import { TRPCError } from "@trpc/server";
import z from "zod";

import { Media, Tenant } from "@/payload-types";
import { baseProcedure, createTRPCRouter } from "@/trpc/init";

export const checkoutRouter = createTRPCRouter({
  getProducts: baseProcedure
    .input(
      z.object({
        ids: z.array(z.string()),
      }),
    )
    .query(async ({ ctx, input }) => {
      const data = await ctx.db.find({
        collection: "products",
        depth: 2, // Populate "category", "image", "tenant" & "tenant.image"
        where: {
          id: {
            in: input.ids,
          },
        },
      });

      if (data.totalDocs !== input.ids.length) {
        const foundIds = data.docs.map(doc => doc.id);
        const missingIds = input.ids.filter(id => !foundIds.includes(id));
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `Products not found: ${missingIds.join(", ")}`
        });
      }

      const totalPrice = data.docs.reduce((acc, product) => {
        const price = Number(product.price);
        if (isNaN(price)) {
          console.warn(`Invalid price for product ${product.id}: ${product.price}`);
          return acc;
        }
        return acc + price;
      }, 0);

      return {
        ...data,
        totalPrice: totalPrice,
        docs: data.docs.map((doc) => ({
          ...doc,
          image: doc.image as Media | null,
          tenant: doc.tenant as Tenant & { image: Media | null },
        }))
      };
    }),
});
