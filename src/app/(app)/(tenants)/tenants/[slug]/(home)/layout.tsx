import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

import { FallbackError } from "@/components/fallback-error";
import { SearchFiltersLoadingSkeleton } from "@/modules/home/ui/components/search-filters";
import { Footer } from "@/modules/tenants/ui/components/footer";
import { Navbar } from "@/modules/tenants/ui/components/navbar";
import { HydrateClient, prefetch, trpc } from "@/trpc/server";


interface Props {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}

const Layout = async ({ params, children }: Props) => {
  const { slug } = await params;

  prefetch(trpc.tenants.getOne.queryOptions({
    slug,
  }));

  return (
    <div className="min-h-screen flex flex-col">
      <HydrateClient>
        <ErrorBoundary
          fallback={<FallbackError message="Something went wrong while loading!" />}
        >
          <Suspense fallback={<SearchFiltersLoadingSkeleton />}>
            <Navbar slug={slug} />
          </Suspense>
        </ErrorBoundary>
      </HydrateClient>
      <div className="flex-1">
        <div className="max-w-(--breakpoint-xl) mx-auto">
          {children}
        </div>
      </div>
      <Footer />
    </div>
  );
};
export default Layout;
