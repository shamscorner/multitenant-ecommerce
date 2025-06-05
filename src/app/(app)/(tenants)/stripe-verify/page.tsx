"use client";

import { useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { LoaderIcon } from "lucide-react";
import { toast } from "sonner";

import { useTRPC } from "@/trpc/client";

const Page = () => {
  const trpc = useTRPC();
  const { mutate: verify } = useMutation(trpc.checkout.verify.mutationOptions({
    onSuccess: (data) => {
      console.log("Account verified successfully:", data);
      window.location.href = data.url;
    },
    onError: () => {
      toast.error("Failed to verify account. Please try again.");
      window.location.href = "/";
    },
  }));

  useEffect(() => {
    verify();
  }, [verify]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <LoaderIcon className="animate-spin text-muted-foreground" />
    </div>
  );
};

export default Page;
