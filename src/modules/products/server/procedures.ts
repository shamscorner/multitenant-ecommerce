import { TRPCError } from "@trpc/server";
import { headers as getHeaders } from "next/headers";
import { Sort, Where } from "payload";
import z from "zod";

import { DEFAULT_LIMIT } from "@/constants";
import { getFormattedSubcategories } from "@/modules/categories/utils";
import { Media, Review, Tenant } from "@/payload-types";
import { baseProcedure, createTRPCRouter } from "@/trpc/init";

import { sortValues } from "../searchParams";

export const productsRouter = createTRPCRouter({
  getOne: baseProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const product = await ctx.db.findByID({
        collection: "products",
        id: input.id,
        depth: 2, // Load the "product.image", "product.tenant", and "product.tenant.image"
        select: {
          content: false, // Exclude content field
        }
      });

      if(!product || product.isArchived) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Product not found or has been archived.",
        });
      }

      const headers = await getHeaders();
      const session = await ctx.db.auth({ headers });

      let isPurchased = false;

      if (session.user) {
        const ordersData = await ctx.db.find({
          collection: "orders",
          pagination: false,
          limit: 1,
          where: {
            and: [
              {
                product: {
                  equals: input.id,
                },
              },
              {
                user: {
                  equals: session.user.id,
                },
              },
            ],
          },
        });

        isPurchased = !!ordersData.docs[0];
      }

      const reviews = await ctx.db.find({
        collection: "reviews",
        pagination: false,
        where: {
          product: {
            equals: input.id,
          },
        },
      });

      // Calculate the average rating and distribution
      const reviewRating =
        reviews.docs.length > 0
        ? reviews.docs.reduce((acc, review) => acc + review.rating, 0) / reviews.totalDocs
        : 0;

      const ratingDistribution: Record<number, number> = {
        5: 0,
        4: 0,
        3: 0,
        2: 0,
        1: 0,
      };

      if (reviews.totalDocs > 0) {
        reviews.docs.forEach((review) => {
          const rating = review.rating;

          if (rating >= 1 && rating <= 5) {
            ratingDistribution[rating] = (ratingDistribution[rating] || 0) + 1;
          }
        });

        Object.keys(ratingDistribution).forEach((key) => {
          const rating = Number(key);
          const count = ratingDistribution[rating] || 0;
          ratingDistribution[rating] = Math.round(
            (count / reviews.totalDocs) * 100,
          );
        });
      }

      return {
        ...product,
        isPurchased,
        image: product.image as Media | null,
        cover: product.cover as Media | null,
        tenant: product.tenant as Tenant & { image: Media | null },
        reviewRating,
        reviewCount: reviews.totalDocs,
        ratingDistribution,
      };
    }),

  getMany: baseProcedure
    .input(z.object({
      search: z.string().nullable().optional(),
      cursor: z.number().default(1),
      limit: z.number().default(DEFAULT_LIMIT),
      categorySlug: z.string().nullable().optional(),
      minPrice: z.string().nullable().optional(),
      maxPrice: z.string().nullable().optional(),
      tags: z.array(z.string()).nullable().optional(),
      sort: z.enum(sortValues).nullable().optional(),
      tenantSlug: z.string().nullable().optional(),
    }))
    .query(async ({ ctx, input }) => {
      const where: Where = {
        isArchived: {
          not_equals: true,
        }
      };

      const sortMap: Record<typeof sortValues[number], Sort> = {
        trending: "name",
        hot_and_new: "+createdAt",
        curated: "-createdAt",
      };

      const sort: Sort = input.sort
        ? (sortMap[input.sort] ?? "-createdAt")
        : "-createdAt";

      if (input.minPrice) {
        where.price = {
          greater_than_equal: input.minPrice,
        };
      }

      if (input.maxPrice) {
        if (!where.price) {
          where.price = {};
        }
        where.price = {
          ...where.price,
          less_than_equal: input.maxPrice,
        };
      }

      if(input.tenantSlug) {
        where["tenant.slug"] = {
          equals: input.tenantSlug,
        };
      } else {
        // If tenantSlug is not provided, we assume public products
        // and filter out private products
        where["isPrivate"] = {
          not_equals: true,
        };
      }

      if (input.categorySlug) {
        const categoriesData =  await ctx.db.find({
          collection: "categories",
          limit: 1,
          depth: 1, // populate subcategories
          pagination: false,
          where: {
            slug: {
              equals: input.categorySlug,
            }
          }
        });

        const formattedCategoriesData = getFormattedSubcategories(categoriesData);
        const parentCategory = formattedCategoriesData[0];
        const subcategoriesSlug: string[] = [];

        if (parentCategory) {
          subcategoriesSlug.push(
            ...parentCategory.subcategories.map((subcategory) => subcategory.slug)
          );
          where["category.slug"] = {
            in: [parentCategory.slug, ...subcategoriesSlug],
          };
        }
      }

      if(input.tags && input.tags.length > 0) {
        where["tags.name"] = {
          in: input.tags,
        };
      }

      if (input.search) {
        where["name"] = {
          like: input.search,
        };
      }

      // Fetch products with the specified filters and sorting
      const productsData = await ctx.db.find({
        collection: "products",
        depth: 2, // populate category, image & tenant with tenant image
        where,
        sort,
        page: input.cursor,
        limit: input.limit,
        select: {
          content: false, // Exclude content field
        }
      });

      // Fetch all reviews for all products in a single query
      const productIds = productsData.docs.map((product) => product.id);
      const allReviewsData = await ctx.db.find({
        collection: "reviews",
        depth: 0, // We want to just get ids, without populating
        pagination: false,
        where: {
          product: {
            in: productIds,
          },
        },
      });

      // Group reviews by product ID and calculate aggregations
      const reviewsByProduct = allReviewsData.docs.reduce((acc, review) => {
        const productId = review.product as string;
        if (!acc[productId]) {
          acc[productId] = [];
        }
        acc[productId].push(review);
        return acc;
      }, {} as Record<string, Review[]>);

      // Map products and summarize reviews
      const dataWithSummarizedReviews = productsData.docs.map((product) => {
        const reviews = reviewsByProduct[product.id] || [];
        const reviewCount = reviews.length;
        const reviewRating = reviewCount === 0
          ? 0
          : reviews.reduce((acc, review) => acc + review.rating, 0) / reviewCount;

        return {
          ...product,
          reviewCount,
          reviewRating,
        };
      });

      return {
        ...productsData,
        docs: dataWithSummarizedReviews.map((doc) => {
          return {
            ...doc,
            image: doc.image as Media,
            cover: doc.cover as Media,
            tenant: doc.tenant as Tenant & { image: Media | null },
          };
        }),
      };
    })
});
