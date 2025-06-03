"use client";

import { useSuspenseQuery } from "@tanstack/react-query";

import { useTRPC } from "@/trpc/client";

import { useProductFilters } from "../../hooks/use-product-filters";

import { ProductCard } from "./product-card";

interface Props {
  categorySlug?: string;
}

export const ProductList = ({ categorySlug }: Props) => {
  const [ filters ] = useProductFilters();

  const trpc = useTRPC();
  const { data: products } = useSuspenseQuery(trpc.products.getMany.queryOptions({
    categorySlug,
    ...filters
  }));

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
      {products.docs.map((product) => (
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
  );
};

export const ProductListLoadingSkeleton = () => {
  return (
    <div>
      Loading...
    </div>
  );
};
