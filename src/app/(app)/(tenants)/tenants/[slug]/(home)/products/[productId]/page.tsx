import { Suspense } from "react";

import { ProductView, ProductViewSkeleton } from "@/modules/products/ui/views/product-view";
import { HydrateClient, prefetch, trpc } from "@/trpc/server";

interface Props {
  params: Promise<{ productId: string; slug: string }>;
};

export const dynamic = "force-dynamic"; // Ensure this page is always server-rendered

const Page = async ({ params }: Props) => {
  const { productId, slug: tenantSlug } = await params;

  prefetch(trpc.tenants.getOne.queryOptions({
    slug: tenantSlug
  }));

  return (
    <HydrateClient>
      <Suspense fallback={<ProductViewSkeleton />}>
        <ProductView productId={productId} tenantSlug={tenantSlug} />
      </Suspense>
    </HydrateClient>
  );
};

export default Page;
