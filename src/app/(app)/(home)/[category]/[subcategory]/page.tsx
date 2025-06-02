import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

import { ProductList, ProductListLoadingSkeleton } from "@/modules/products/ui/components/product-list";
import { HydrateClient, prefetch, trpc } from "@/trpc/server";


interface PageProps {
  params: Promise<{
    category: string,
    subcategory: string
  }>;
}

const Page = async ({ params }: PageProps) => {
  const { subcategory } = await params;

  prefetch(trpc.products.getMany.queryOptions({ categorySlug: subcategory }));

  return (
    <HydrateClient>
      <ErrorBoundary fallback={<div>Something went wrong while loading products!</div>}>
        <Suspense fallback={<ProductListLoadingSkeleton />}>
          <ProductList categorySlug={subcategory} />
        </Suspense>
      </ErrorBoundary>
    </HydrateClient>
  );
};

export default Page;
