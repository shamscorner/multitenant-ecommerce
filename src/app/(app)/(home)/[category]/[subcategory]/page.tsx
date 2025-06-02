import { Suspense } from "react";

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
      <Suspense fallback={<ProductListLoadingSkeleton />}>
        <ProductList categorySlug={subcategory} />
      </Suspense>
    </HydrateClient>
  );
};

export default Page;
