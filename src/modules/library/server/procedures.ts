import { TRPCError } from "@trpc/server";
import z from "zod";

import { DEFAULT_LIMIT } from "@/constants";
import { Media, Review, Tenant } from "@/payload-types";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";

export const libraryRouter = createTRPCRouter({
  getOne: protectedProcedure
    .input(
      z.object({
        productId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const ordersData = await ctx.db.find({
        collection: "orders",
        limit: 1,
        pagination: false,
        where: {
          and: [
            {
              product: {
                equals: input.productId,
              }
            },
            {
              user: {
                equals: ctx.session.user.id,
              },
            },
          ],
        },
      });

      const order = ordersData.docs[0];

      if (!order) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Order not found",
        });
      }

      const product = await ctx.db.findByID({
        collection: "products",
        id: input.productId,
      });

      if (!product) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Product not found",
        });
      }

      return product;
    }),

  getMany: protectedProcedure
    .input(
      z.object({
        cursor: z.number().default(1),
        limit: z.number().default(DEFAULT_LIMIT),
      }),
    )
    .query(async ({ ctx, input }) => {
      const ordersData = await ctx.db.find({
        collection: "orders",
        depth: 0, // We want to just get ids, without populating
        page: input.cursor,
        limit: input.limit,
        where: {
          user: {
            equals: ctx.session.user.id,
          },
        },
      });

      // Fetch all products related to the orders in a single query
      const productIds = ordersData.docs.map((order) => order.product);
      const productsData = await ctx.db.find({
        collection: "products",
        pagination: false,
        where: {
          id: {
            in: productIds,
          },
        },
      });

      // Fetch all reviews for all products in a single query
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
      const dataWithSummarizedReviews = productsData.docs.map((doc) => {
        const reviews = reviewsByProduct[doc.id] || [];
        const reviewCount = reviews.length;
        const reviewRating = reviewCount === 0
          ? 0
          : reviews.reduce((acc, review) => acc + review.rating, 0) / reviewCount;

        return {
          ...doc,
          reviewCount,
          reviewRating,
        };
      });

      return {
        ...productsData,
        docs: dataWithSummarizedReviews.map((doc) => ({
          ...doc,
          image: doc.image as Media | null,
          tenant: doc.tenant as Tenant & { image: Media | null },
        }))
      };
    }),
});
