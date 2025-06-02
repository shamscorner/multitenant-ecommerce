import { Suspense } from "react";

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
      <Suspense fallback={<ProductListLoadingSkeleton />}>
        <ProductList categorySlug={category} />
      </Suspense>
    </HydrateClient>
  );
};

export default Page;
