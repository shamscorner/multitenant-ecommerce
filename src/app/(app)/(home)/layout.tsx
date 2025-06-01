import { Suspense } from "react";

import { HydrateClient, prefetch, trpc } from "@/trpc/server";

import { Footer } from "./footer";
import { Navbar } from "./navbar";
import { SearchFilters, SearchFiltersLoadingSkeleton } from "./search-filters";

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
