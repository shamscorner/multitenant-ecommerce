import { ProductView } from "@/modules/library/ui/views/product-view";
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
      <ProductView productId={productId} />
    </HydrateClient>
  );
};

export default Page;
