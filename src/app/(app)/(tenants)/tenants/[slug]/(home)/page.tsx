import type { SearchParams } from "nuqs/server";

import { DEFAULT_LIMIT } from "@/constants";
import { loadProductFilters } from "@/modules/products/searchParams";
import { ProductListView } from "@/modules/products/ui/views/product-list-view";
import { HydrateClient, prefetch, trpc } from "@/trpc/server";

interface Props {
  params: Promise<{ slug: string }>;
  searchParams: Promise<SearchParams>;
};

const Page = async ({ params, searchParams }: Props) => {
  const { slug } = await params;
  const filters = await loadProductFilters(searchParams);

  prefetch(trpc.products.getMany.infiniteQueryOptions({
    ...filters,
    tenantSlug: slug,
    limit: DEFAULT_LIMIT,
  }));

    return (
      <HydrateClient>
        <ProductListView tenantSlug={slug} narrowView />
      </HydrateClient>
    );
};

export default Page;

