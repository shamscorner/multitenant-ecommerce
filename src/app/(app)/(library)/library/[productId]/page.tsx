import { Suspense } from "react";

import { ProductView, ProductViewSkeleton } from "@/modules/library/ui/views/product-view";
import { HydrateClient, prefetch, trpc } from "@/trpc/server";

interface Props {
  params: Promise<{
    productId: string;
  }>
}

const Page = async ({ params }: Props) => {
  const { productId } = await params;

  prefetch(trpc.library.getOne.queryOptions({
    productId,
  }));

  prefetch(trpc.reviews.getOne.queryOptions({
    productId,
  }));

  return (
    <HydrateClient>
      <Suspense fallback={<ProductViewSkeleton />}>
        <ProductView productId={productId} />
      </Suspense>
    </HydrateClient>
  );
};

export default Page;
