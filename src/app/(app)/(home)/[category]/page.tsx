import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

import { ProductList, ProductListLoadingSkeleton } from "@/modules/products/ui/components/product-list";
import { HydrateClient, prefetch, trpc } from "@/trpc/server";


interface PageProps {
  params: Promise<{ category: string }>;
}

const Page = async ({ params }: PageProps) => {
  const { category } = await params;

  prefetch(trpc.products.getMany.queryOptions({ categorySlug: category }));

  return (
    <HydrateClient>
      <ErrorBoundary fallback={<div>Something went wrong while loading categories!</div>}>
        <Suspense fallback={<ProductListLoadingSkeleton />}>
          <ProductList categorySlug={category} />
        </Suspense>
      </ErrorBoundary>
    </HydrateClient>
  );
};

export default Page;
