import { redirect } from "next/navigation";

import { SignInView } from "@/modules/auth/ui/views/sign-in-view";
import { caller } from "@/trpc/server";

export const dynamic = "force-dynamic"; // Ensure this page is always server-rendered

const Page = async () => {
  const session  = await caller.auth.session();
  if(session.user) {
    redirect("/"); // Redirect to home if user is already signed in
  }

  return <SignInView />;
};

export default Page;
