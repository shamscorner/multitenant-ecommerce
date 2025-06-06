import { DEFAULT_LIMIT } from "@/constants";
import { LibraryView } from "@/modules/library/ui/views/library-view";
import { HydrateClient, prefetch, trpc } from "@/trpc/server";

export const dynamic = "force-dynamic"; // Ensure this page is always server-rendered

const Page = async () => {
  prefetch(trpc.library.getMany.infiniteQueryOptions({
    limit: DEFAULT_LIMIT,
  }));

  return (
    <HydrateClient>
      <LibraryView />
    </HydrateClient>
  );
};

export default Page;
