import { headers as getHeaders } from "next/headers";
import { Sort, Where } from "payload";
import z from "zod";

import { DEFAULT_LIMIT } from "@/constants";
import { getFormattedSubcategories } from "@/modules/categories/utils";
import { Media, Tenant } from "@/payload-types";
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
      });

      if(!product) {
        throw new Error(`Product with ID ${input.id} not found.`);
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

      return {
        ...product,
        isPurchased,
        image: product.image as Media | null,
        cover: product.cover as Media | null,
        tenant: product.tenant as Tenant & { image: Media | null },
      };
    }),

  getMany: baseProcedure
    .input(z.object({
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
      const where: Where = {};

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

      const data = await ctx.db.find({
        collection: "products",
        depth: 2, // populate category, image & tenant with tenant image
        where,
        sort,
        page: input.cursor,
        limit: input.limit,
      });

      return {
        ...data,
        docs: data.docs.map((doc) => {
          const tenant = doc.tenant as Tenant;
          return {
            ...doc,
            image: doc.image as Media,
            cover: doc.cover as Media,
            tenant: {
              ...tenant,
              image: tenant.image as Media,
            },
          };
        }),
      };
    })
});
