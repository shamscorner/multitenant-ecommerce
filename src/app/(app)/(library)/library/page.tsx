import { DEFAULT_LIMIT } from "@/constants";
import { LibraryView } from "@/modules/library/ui/views/library-view";
import { HydrateClient, prefetch, trpc } from "@/trpc/server";

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
