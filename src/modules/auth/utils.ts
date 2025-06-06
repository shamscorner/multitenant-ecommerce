import { cookies as getCookies } from "next/headers";

interface Props {
  prefix: string;
  value: string;
}

export const generateAuthCookie = async ({
  prefix,
  value
}: Props) => {
  const cookies = await getCookies();

  try {
    cookies.set({
      httpOnly: true,
      name: `${prefix}-token`, // payload-token by default
      path: "/",
      value,
      ...(process.env.NODE_ENV !== "development" && {
        sameSite: "none",
        domain: process.env.NEXT_PUBLIC_ROOT_DOMAIN,
        secure: true
      })
    });
  } catch (error) {
    console.error("Error setting cookie:", error);
    throw new Error("Failed to set authentication cookie");
  }
};
