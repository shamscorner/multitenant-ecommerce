import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

import { ProductFilters } from "@/modules/products/ui/components/product-filters";
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
      <div className="px-4 lg:px-12 py-8 flex flex-col gap-4">
        <div className="grid grid-cols-1 lg:grid-cols-6 xl:grid-cols-8 gap-y-6 gap-x-12">
          <div className="lg:col-span-2 xl:col-span-2">
            <ProductFilters />
          </div>
          <div className="lg:col-span-4 xl:col-span-6">
            <ErrorBoundary fallback={<div>Something went wrong while loading categories!</div>}>
              <Suspense fallback={<ProductListLoadingSkeleton />}>
                <ProductList categorySlug={category} />
              </Suspense>
            </ErrorBoundary>
          </div>
        </div>
      </div>
    </HydrateClient>
  );
};

export default Page;
