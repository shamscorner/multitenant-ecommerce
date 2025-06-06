import type { SearchParams } from "nuqs";

import { DEFAULT_LIMIT } from "@/constants";
import { loadProductFilters } from "@/modules/products/searchParams";
import { ProductListView } from "@/modules/products/ui/views/product-list-view";
import { HydrateClient, prefetch, trpc } from "@/trpc/server";

interface PageProps {
  params: Promise<{ category: string }>;
  searchParams: Promise<SearchParams>;
}

export const dynamic = "force-dynamic"; // Ensure this page is always server-rendered

const Page = async ({ params, searchParams }: PageProps) => {
  const { category } = await params;
  const filters = await loadProductFilters(searchParams);

  prefetch(trpc.products.getMany.infiniteQueryOptions({
    ...filters,
    categorySlug: category,
    limit: DEFAULT_LIMIT
  }));

  return (
    <HydrateClient>
      <ProductListView categorySlug={category} />
    </HydrateClient>
  );
};

export default Page;
