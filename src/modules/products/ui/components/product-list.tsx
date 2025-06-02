"use client";

import { useSuspenseQuery } from "@tanstack/react-query";

import { useTRPC } from "@/trpc/client";

interface Props {
  categorySlug?: string;
}

export const ProductList = ({ categorySlug }: Props) => {
  const trpc = useTRPC();
  const { data: products } = useSuspenseQuery(trpc.products.getMany.queryOptions({ categorySlug }));

  return (
    <div>
      {JSON.stringify(products, null, 2)}
    </div>
  );
};

export const ProductListLoadingSkeleton = () => {
  return (
    <div>
      Loading...
    </div>
  );
};
