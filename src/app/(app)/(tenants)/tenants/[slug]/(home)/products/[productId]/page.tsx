import { ProductView } from "@/modules/products/ui/views/product-view";
import { HydrateClient, prefetch, trpc } from "@/trpc/server";

interface Props {
  params: Promise<{ productId: string; slug: string }>;
};

const Page = async ({ params }: Props) => {
  const { productId, slug: tenantSlug } = await params;

  prefetch(trpc.tenants.getOne.queryOptions({
    slug: tenantSlug
  }));

  return (
    <HydrateClient>
      <ProductView productId={productId} tenantSlug={tenantSlug} />
    </HydrateClient>
  );
};

export default Page;
