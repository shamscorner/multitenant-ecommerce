import { TRPCError } from "@trpc/server";
import { headers as getHeaders } from "next/headers";
import { BasePayload } from "payload";

import { stripe } from "@/lib/stripe";
import { baseProcedure, createTRPCRouter } from "@/trpc/init";

import { loginSchema, registerSchema } from "../schemas";
import { generateAuthCookie } from "../utils";

const login = async (
  ctx: { db: BasePayload },
  input: { email: string; password: string }
) => {
  const data = await ctx.db.login({
    collection: "users",
    data: {
      email: input.email,
      password: input.password,
    }
  });

  if(!data.token) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Invalid email or password",
    });
  }

  await generateAuthCookie({
    prefix: ctx.db.config.cookiePrefix,
    value: data.token
  });

  return data;
};

export const authRouter = createTRPCRouter({
  login: baseProcedure
    .input(loginSchema)
    .mutation(async ({ ctx, input }) => {
      const { email, password } = input || {};
      const data = await login(ctx, { email, password });
      return data;
    }),

  register: baseProcedure
    .input(registerSchema)
    .mutation(async ({ ctx, input }) => {
      const existingData = await ctx.db.find({
        collection: "users",
        limit: 1,
        where: {
          username: {
            equals: input.username,
          },
        }
      });

      const existingUser = existingData.docs[0];

      if (existingUser) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Username already taken",
        });
      }

      const account = await stripe.accounts.create({});

      if (!account) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Failed to create Stripe account",
        });
      }

      const tenant = await ctx.db.create({
        collection: "tenants",
        data: {
          name: input.username,
          slug: input.username,
          stripeAccountId: account.id,
        }
      });

      await ctx.db.create({
        collection: "users",
        data: {
          email: input.email,
          password: input.password, // This will be hashed by payload
          username: input.username,
          tenants: [
            {
              tenant: tenant.id,
            }
          ]
        }
      });

      const { email, password } = input || {};
      await login(ctx, { email, password });
    }),

  session: baseProcedure.query(async ({ ctx }) => {
    const headers = await getHeaders();
    const session = await ctx.db.auth({ headers });
    return session;
  })
});
