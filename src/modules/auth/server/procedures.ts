import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import { headers as getHeaders, cookies as getCookies } from 'next/headers';
import z from "zod";
import { AUTH_COOKIE } from "../constants";
import { BasePayload } from "payload";

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
      name: AUTH_COOKIE,
      value: data.token,
      httpOnly: true,
      path: '/',
      // TODO: ensure cross-domain cookie sharing
      // sameSite: 'none',
      // domain: ''
    });

    return data;
};

export const authRouter = createTRPCRouter({
  session: baseProcedure.query(async ({ ctx }) => {
    const headers = await getHeaders();
    const session = await ctx.db.auth({ headers });
    return session;
  }),

  register: baseProcedure
    .input(
      z.object({
        email: z.string().email(),
        password: z.string(), // TODO: Add password validation
        username: z
          .string()
          .min(3, "Username must be at least 3 characters long")
          .max(63, "Username must be at most 63 characters long")
          .regex(
            /^[a-z0-9][a-z0-9-]*[a-z0-9]$/,
            "Username must start and end with a letter or number, and can only contain letters, numbers, and hyphens"
          )
          .refine(
            (val) => !val.includes("--"),
            "Username cannot contain consecutive hyphens"
          )
          .transform((val) => val.toLowerCase()),
      })
    )
    .mutation(async ({ input, ctx }) => {
      await ctx.db.create({
        collection: "users",
        data: {
          email: input.email,
          password: input.password, // This will be hashed by payload
          username: input.username,
        }
      });

      await login(ctx, input);
    }),

  login: baseProcedure
    .input(
      z.object({
        email: z.string().email(),
        password: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const data = await login(ctx, input);
      return data;
    }),
  logout: baseProcedure.mutation(async () => {
    const cookies = await getCookies();
    cookies.delete(AUTH_COOKIE);
  })
});
