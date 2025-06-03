import { useInfiniteQuery } from "@tanstack/react-query";
import { LoaderIcon } from "lucide-react";

import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { DEFAULT_LIMIT } from "@/constants";
import { useTRPC } from "@/trpc/client";

interface TagsFilterProps {
  value?: string[] | null;
  onChange?: (value: string[] | string) => void;
}

export const TagsFilter = ({ value, onChange }: TagsFilterProps) => {
  const trpc = useTRPC();
  const {
    data: tags,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
  } = useInfiniteQuery(trpc.tags.getMany.infiniteQueryOptions({
    limit: DEFAULT_LIMIT,
  }, {
    getNextPageParam: (lastPage) => lastPage.docs.length > 0 ? lastPage.nextPage : undefined,
  }));

  const handleTagChange = (tag: string) => {
    if(value?.includes(tag)) {
      onChange?.(value.filter((t) => t !== tag) || []); //  remove
      return;
    }
    onChange?.([...(value || []), tag]); // add
  };

  return (
    <div className="flex flex-col gap-y-4 pt-4">
      { isLoading ? (
        <div className="flex items-center justify-center p-4">
          <LoaderIcon className="size-4 animate-spin" />
        </div>
      ) : (
        tags?.pages.map((page) => (
          page.docs.map((tag) => (
            <div
              key={tag.id}
              className="flex items-center justify-between px-0.5"
            >
              <Label
                htmlFor={`tags-filter-checkbox-${tag.id}`}
                className="font-medium flex-1"
              >
                {tag.name}
              </Label>
              <Checkbox
                id={`tags-filter-checkbox-${tag.id}`}
                checked={value?.includes(tag.name)}
                onCheckedChange={() => handleTagChange(tag.name)}
              />
            </div>
          ))
        ))
      )}

      { hasNextPage && (
        <button
          className="underline pt-2 w-fit font-medium justify-start text-start disabled:opacity-50"
          onClick={() => fetchNextPage()}
          disabled={isFetchingNextPage}
          type="button"
        >
          Load more
        </button>
      )}
    </div>
  );
};
