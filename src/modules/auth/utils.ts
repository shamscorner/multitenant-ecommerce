import { cookies as getCookies } from 'next/headers';

interface Props {
  prefix: string;
  value: string
}

export const generateAuthCookie = async ({
  prefix,
  value
}: Props) => {
  const cookies = await getCookies();
  cookies.set({
    httpOnly: true,
    name: `${prefix}-token`, // payload-token by default
    path: '/',
    value,
    // TODO: ensure cross-domain cookie sharing
    // sameSite: 'none',
    // secure: true, // Enable this if using HTTPS
    // domain: ''
  });
};
