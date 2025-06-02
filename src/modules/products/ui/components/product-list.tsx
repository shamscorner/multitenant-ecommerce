"use client";

import { useSuspenseQuery } from "@tanstack/react-query";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useTRPC } from "@/trpc/client";

interface Props {
  categorySlug?: string;
}

export const ProductList = ({ categorySlug }: Props) => {
  const trpc = useTRPC();
  const { data: products } = useSuspenseQuery(trpc.products.getMany.queryOptions({ categorySlug }));

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
      {products.docs.map((product) => (
        <Card key={product.id} className="w-full max-w-sm">
          <CardHeader>
            <CardTitle>{product.name}</CardTitle>
            <CardDescription>
              {product.description}
            </CardDescription>
          </CardHeader>
          <CardContent>
            Content here.
          </CardContent>
          <CardFooter className="flex-col gap-2">
            Footer
          </CardFooter>
        </Card>
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
