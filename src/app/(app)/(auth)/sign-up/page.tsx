import { redirect } from "next/navigation";

import { SignUpView } from "@/modules/auth/ui/views/sign-up-view";
import { caller } from "@/trpc/server";

export const dynamic = "force-dynamic"; // Ensure this page is always server-rendered

const Page = async () => {
  const session = await caller.auth.session();

  if(session.user) {
    redirect("/");
  }

  return <SignUpView />;
};

export default Page;
