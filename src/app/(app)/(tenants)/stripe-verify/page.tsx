"use client";

import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { LoaderIcon } from "lucide-react";
import { toast } from "sonner";

import { useTRPC } from "@/trpc/client";

const Page = () => {
  const [isLoading, setIsLoading] = useState(true);

  const trpc = useTRPC();
  const { mutate: verify } = useMutation(trpc.checkout.verify.mutationOptions({
    onSuccess: (data) => {
      setIsLoading(false);
      console.log("Account verified successfully:", data);
      window.location.href = data.url;
    },
    onError: () => {
      setIsLoading(false);
      toast.error("Failed to verify account. Please try again.");
      window.location.href = "/";
    },
  }));

  useEffect(() => {
    verify();
  }, [verify]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      {isLoading ? (
        <LoaderIcon className="animate-spin text-muted-foreground" />
      ) : (
        <div>Redirecting...</div>
      )}
    </div>
  );
};

export default Page;
