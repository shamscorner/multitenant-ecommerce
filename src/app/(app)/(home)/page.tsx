import type { SearchParams } from "nuqs";

import { DEFAULT_LIMIT } from "@/constants";
import { loadProductFilters } from "@/modules/products/searchParams";
import { ProductListView } from "@/modules/products/ui/views/product-list-view";
import { HydrateClient, prefetch, trpc } from "@/trpc/server";

interface PageProps {
  searchParams: Promise<SearchParams>;
}

const Page = async ({ searchParams }: PageProps) => {
  const filters = await loadProductFilters(searchParams);

  prefetch(trpc.products.getMany.infiniteQueryOptions({
    ...filters,
    limit: DEFAULT_LIMIT
  }));

  return (
    <HydrateClient>
      <ProductListView />
    </HydrateClient>
  );
};

export default Page;
