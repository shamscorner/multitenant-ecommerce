"use client";

import { Suspense } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ArrowLeftIcon } from "lucide-react";
import dynamic from "next/dynamic";
import Link from "next/link";

import { useTRPC } from "@/trpc/client";

import { ReviewSidebar, ReviewSidebarSkeleton } from "../components/review-sidebar";

interface Props {
  productId: string;
}

// Dynamically import the RichText component to avoid server-side rendering issuess
const RichText = dynamic(() => import("@payloadcms/richtext-lexical/react").then(mod => mod.RichText), {
  loading: () => <div>Loading...</div>,
});

export const ProductView = ({ productId }: Props) => {
  const trpc = useTRPC();
  const { data: library } = useSuspenseQuery(trpc.library.getOne.queryOptions({
    productId,
  }));

  return (
    <div className="min-h-screen bg-white">
      <nav className="p-4 bg-[#F4F4F0] w-full border-b">
        <Link prefetch href="/library" className="flex items-center gap-2">
          <ArrowLeftIcon className="size-4" />
          <span className="text font-medium">Back to Library</span>
        </Link>
      </nav>

      <header className="bg-[#F4F4F0] py-8 border-b">
        <div className="max-w-(--breakpoint-xl) mx-auto px-4 lg:px-12">
          <h1 className="text-[40px] font-medium">{library.name}</h1>
        </div>
      </header>

      <section className="max-w-(--breakpoint-xl) mx-auto px-4 lg:px-12 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-7 gap-4 lg:gap-16">
          <div className="lg:col-span-2">
            <div className="p-4 bg-white rounded-md border gap-4">
              <Suspense fallback={<ReviewSidebarSkeleton />}>
                <ReviewSidebar productId={productId} />
              </Suspense>
            </div>
          </div>

          <div className="lg:col-span-5">
            {library.content ? (
              <RichText data={library.content} />
            ) : (
              <p className="font-medium italic text-muted-foreground">
                No special content
              </p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export const ProductViewSkeleton = () => {
  return (
    <div className="min-h-screen bg-white">
      <nav className="p-4 bg-[#F4F4F0] w-full border-b">
        <div className="flex items-center gap-2">
          <ArrowLeftIcon className="size-4" />
          <span className="text font-medium">Back to Library</span>
        </div>
      </nav>
    </div>
  );
};
