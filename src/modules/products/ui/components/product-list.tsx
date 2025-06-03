"use client";

import { useSuspenseInfiniteQuery } from "@tanstack/react-query";
import { InboxIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { DEFAULT_LIMIT } from "@/constants";
import { cn } from "@/lib/utils";
import { useTRPC } from "@/trpc/client";

import { useProductFilters } from "../../hooks/use-product-filters";

import { ProductCard, ProductCardSkeleton } from "./product-card";

interface Props {
  categorySlug?: string;
  tenantSlug?: string;
  narrowView?: boolean;
}

export const ProductList = ({ categorySlug, tenantSlug, narrowView }: Props) => {
  const [ filters ] = useProductFilters();

  const trpc = useTRPC();
  const {
    data: products,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useSuspenseInfiniteQuery(trpc.products.getMany.infiniteQueryOptions({
    ...filters,
    categorySlug,
    tenantSlug,
    limit: DEFAULT_LIMIT,
  }, {
    getNextPageParam: (lastPage) => lastPage.docs.length > 0 ? lastPage.nextPage : undefined,
  }));

  if (products.pages?.[0]?.docs.length === 0) {
    return (
      <div className="border border-black border-dashed flex items-center justify-center p-8 flex-col gap-y-4 bg-white w-full rounded-lg">
        <InboxIcon />
        <p className="text-base font-medium">No products found</p>
      </div>
    );
  }

  return (
    <>
      <div className={cn(
        "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4",
        narrowView && "lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-3"
      )}>
        {products?.pages.flatMap((page) => page.docs).map((product) => (
          <ProductCard
            key={product.id}
            id={product.id}
            name={product.name}
            imageUrl={product.image?.url}
            tenantSlug={product.tenant?.slug}
            tenantImageUrl={product.tenant?.image?.url}
            reviewRating={3}
            reviewCount={5}
            price={product.price}
          />
        ))}
      </div>

      <div className="flex justify-center pt-10">
        { hasNextPage && (
          <Button
            type="button"
            variant="reverse"
            size="lg"
            disabled={isFetchingNextPage}
            className="bg-white"
            onClick={() => fetchNextPage()}
          >
            Load more
          </Button>
        )}
      </div>
    </>
  );
};

export const ProductListLoadingSkeleton = ({ narrowView }: Props) => {
  return (
    <div className={cn(
      "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4",
      narrowView && "lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-3"
    )}>
      {Array.from({ length: DEFAULT_LIMIT }).map((_, index) => (
        <ProductCardSkeleton key={index} />
      ))}
    </div>
  );
};
