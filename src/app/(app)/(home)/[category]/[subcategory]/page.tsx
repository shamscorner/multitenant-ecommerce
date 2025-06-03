import { SearchParams } from "nuqs";

import { DEFAULT_LIMIT } from "@/constants";
import { loadProductFilters } from "@/modules/products/searchParams";
import { ProductListView } from "@/modules/products/ui/views/product-list-view";
import { HydrateClient, prefetch, trpc } from "@/trpc/server";

interface PageProps {
  params: Promise<{
    subcategory: string;
  }>;
  searchParams: Promise<SearchParams>;
}

const Page = async ({ params, searchParams }: PageProps) => {
  const { subcategory } = await params;
  const filters = await loadProductFilters(searchParams);

  prefetch(trpc.products.getMany.infiniteQueryOptions({
    ...filters,
    categorySlug: subcategory,
    limit: DEFAULT_LIMIT,
  }));

  return (
    <HydrateClient>
      <ProductListView categorySlug={subcategory} />
    </HydrateClient>
  );
};

export default Page;
