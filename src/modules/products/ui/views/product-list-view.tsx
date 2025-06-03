import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

import { ProductFilters } from "../components/product-filters";
import { ProductList, ProductListLoadingSkeleton } from "../components/product-list";
import { ProductSort } from "../components/product-sort";

interface Props {
  categorySlug: string;
}

export const ProductListView = ({ categorySlug }: Props) => {
  return (
    <div className="px-4 lg:px-12 py-8 flex flex-col gap-4">
      <div className="flex flex-col lg:flex-row lg:items-center gap-y-2 lg:gap-y-0 justify-between">
        <h2 className="text-2xl font-medium">Curated for you</h2>
        <ProductSort />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-6 xl:grid-cols-8 gap-y-6 gap-x-12">
        <div className="lg:col-span-2 xl:col-span-2">
          <ProductFilters />
        </div>
        <div className="lg:col-span-4 xl:col-span-6">
          <ErrorBoundary fallback={<div>Something went wrong while loading categories!</div>}>
            <Suspense fallback={<ProductListLoadingSkeleton />}>
              <ProductList categorySlug={categorySlug} />
            </Suspense>
          </ErrorBoundary>
        </div>
      </div>
    </div>
  );
};
