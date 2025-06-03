import type { SearchParams } from "nuqs";

import { loadProductFilters } from "@/modules/products/searchParams";
import { ProductListView } from "@/modules/products/ui/views/product-list-view";
import { HydrateClient, prefetch, trpc } from "@/trpc/server";

interface PageProps {
  params: Promise<{ category: string }>;
  searchParams: Promise<SearchParams>;
}

const Page = async ({ params, searchParams }: PageProps) => {
  const { category } = await params;
  const filters = await loadProductFilters(searchParams);

  prefetch(trpc.products.getMany.queryOptions({ categorySlug: category, ...filters }));

  return (
    <HydrateClient>
      <ProductListView categorySlug={category} />
    </HydrateClient>
  );
};

export default Page;
