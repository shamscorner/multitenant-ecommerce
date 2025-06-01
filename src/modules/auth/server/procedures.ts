import { TRPCError } from "@trpc/server";
import { cookies as getCookies, headers as getHeaders } from 'next/headers';
import { BasePayload } from "payload";

import { baseProcedure, createTRPCRouter } from "@/trpc/init";

import { AUTH_COOKIE } from "../constants";
import { loginSchema, registerSchema } from "../schemas";

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

    const cookies = await getCookies();
    cookies.set({
      httpOnly: true,
      name: AUTH_COOKIE,
      path: '/',
      value: data.token,
      // TODO: ensure cross-domain cookie sharing
      // sameSite: 'none',
      // secure: true, // Enable this if using HTTPS
      // domain: ''
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

  logout: baseProcedure.mutation(async () => {
    const cookies = await getCookies();
    cookies.delete(AUTH_COOKIE);
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

      await ctx.db.create({
        collection: "users",
        data: {
          email: input.email,
          password: input.password, // This will be hashed by payload
          username: input.username,
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
