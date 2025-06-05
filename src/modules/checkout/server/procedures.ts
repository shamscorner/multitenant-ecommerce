import { TRPCError } from "@trpc/server";
import type Stripe from "stripe";
import z from "zod";

import { stripe } from "@/lib/stripe";
import { Media, Tenant } from "@/payload-types";
import { baseProcedure, createTRPCRouter, protectedProcedure } from "@/trpc/init";

import { CheckoutMetadata, ProductMetadata } from "../type";

export const checkoutRouter = createTRPCRouter({
  purchase: protectedProcedure
    .input(
      z.object({
        productIds: z.array(z.string()).min(1),
        tenantSlug: z.string().min(1),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const products = await ctx.db.find({
        collection: "products",
        depth: 2,
        where: {
          and: [
            {
              id: {
                in: input.productIds,
              }
            },
            {
              "tenant.slug": {
                equals: input.tenantSlug
              }
            }
          ]
        },
        select: {
          content: false, // Exclude content field
        }
      });

      if (products.totalDocs !== input.productIds.length) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Products not found" });
      }

      const tenantsData = await ctx.db.find({
        collection: "tenants",
        limit: 1,
        pagination: false,
        where: {
          slug: {
            equals: input.tenantSlug,
          },
        },
      });

      const tenant = tenantsData.docs[0];

      if (!tenant) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Tenant not found",
        });
      }

      if (!tenant.stripeAccountId) {
        throw new TRPCError({
          code: "PRECONDITION_FAILED",
          message: "Tenant has not configured Stripe account",
        });
      }

      // TODO: Throw error if stripe details not submitted

      const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] =
        products.docs.map((product) => ({
          quantity: 1,
          price_data: {
            unit_amount: product.price * 100, // Stripe handles prices in cents
            currency: "usd",
            product_data: {
              name: product.name,
              metadata: {
                stripeAccountId: tenant.stripeAccountId,
                id: product.id,
                name: product.name,
                price: product.price,
              } as ProductMetadata
            }
          }
        }));

      const checkout = await stripe.checkout.sessions.create({
        customer_email: ctx.session.user.email,
        success_url: `${process.env.NEXT_PUBLIC_APP_URL}/tenants/${input.tenantSlug}/checkout?success=true`,
        cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/tenants/${input.tenantSlug}/checkout?cancel=true`,
        mode: "payment",
        line_items: lineItems,
        invoice_creation: {
          enabled: true,
        },
        metadata: {
          userId: ctx.session.user.id,
        } as CheckoutMetadata
      });

      if (!checkout.url) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create checkout session"
        });
      }

      return { url: checkout.url };
    }),

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
        select: {
          content: false, // Exclude content field
        }
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
