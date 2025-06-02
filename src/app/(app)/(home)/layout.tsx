import { Suspense } from "react";

import { Footer } from "@/modules/home/ui/components/footer";
import { Navbar } from "@/modules/home/ui/components/navbar";
import { SearchFilters, SearchFiltersLoadingSkeleton } from "@/modules/home/ui/components/search-filters";
import { HydrateClient, prefetch, trpc } from "@/trpc/server";

interface Props {
  children: React.ReactNode;
}

const Layout = async ({ children }: Props) => {
  prefetch(trpc.categories.getMany.queryOptions());

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <HydrateClient>
        <Suspense fallback={<SearchFiltersLoadingSkeleton />}>
          <SearchFilters />
        </Suspense>
      </HydrateClient>
      <div className="flex-1">{children}</div>
      <Footer />
    </div>
  );
};
export default Layout;
