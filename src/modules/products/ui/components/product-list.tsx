"use client";

import { useSuspenseInfiniteQuery } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { DEFAULT_LIMIT } from "@/constants";
import { useTRPC } from "@/trpc/client";

import { useProductFilters } from "../../hooks/use-product-filters";

import { ProductCard } from "./product-card";

interface Props {
  categorySlug?: string;
}

export const ProductList = ({ categorySlug }: Props) => {
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
    limit: DEFAULT_LIMIT,
  }, {
    getNextPageParam: (lastPage) => lastPage.docs.length > 0 ? lastPage.nextPage : undefined,
  }));

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
        {products?.pages.flatMap((page) => page.docs).map((product) => (
          <ProductCard
            key={product.id}
            id={product.id}
            name={product.name}
            imageUrl={product.image?.url}
            authorUsername="antonio"
            authorImageUrl={undefined}
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

export const ProductListLoadingSkeleton = () => {
  return (
    <div>
      Loading...
    </div>
  );
};
