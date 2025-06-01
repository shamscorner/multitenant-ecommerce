import { useState } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { useRouter } from "next/navigation";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { CategoriesGetManyOutput } from "@/modules/categories/types";
import { useTRPC } from "@/trpc/client";

interface Props {
  onOpenChange: (open: boolean) => void;
  open: boolean;
}

export const CategoriesSidebar = ({
  onOpenChange,
  open,
}: Props) => {
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(trpc.categories.getMany.queryOptions());

  const router = useRouter();

  const [parentCategories, setParentCategories] = useState<CategoriesGetManyOutput | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<CategoriesGetManyOutput[number] | null>(null);

  const currentCategories = parentCategories ?? data ?? [];

  const handleOpenChange = (open: boolean) => {
    setSelectedCategory(null);
    setParentCategories(null);
    onOpenChange(open);
  };

  const handleSelectCategory = (category: CategoriesGetManyOutput[number]) => {
    if (category.subcategories && category.subcategories.length > 0) {
      setParentCategories(category.subcategories as CategoriesGetManyOutput);
      setSelectedCategory(category);
      return;
    }

    try {
      let navigationPath: string;

      if (parentCategories && selectedCategory) {
        navigationPath = `/${selectedCategory.slug}/${category.slug}`;
      } else if (category.slug === 'all') {
        navigationPath = '/';
      } else {
        navigationPath = `/${category.slug}`;
      }

      router.push(navigationPath);
    } catch (error) {
      console.error('Navigation error:', error);
    }

    handleOpenChange(false);
  };

  const handleBackNavigation = () => {
    if (!parentCategories || parentCategories.length === 0) return;
    setParentCategories(null);
    setSelectedCategory(null);
  };

  const backgroundColor = selectedCategory?.color || 'white';

  return (
    <Sheet onOpenChange={onOpenChange} open={open}>
      <SheetContent
        className="p-0 transition-none"
        side="left"
        style={{ backgroundColor: backgroundColor }}
      >
        <SheetHeader className="p-4 border-b">
          <SheetTitle>Categories</SheetTitle>
        </SheetHeader>

        <ScrollArea
          className="flex flex-col overflow-y-auto h-full pb-2"
        >
          {parentCategories && (
            <button
              className="w-full text-left p-4 hover:bg-black hover:text-white flex items-center text-base font-medium"
              onClick={handleBackNavigation}
            >
              <ChevronLeftIcon className="size-4 mr-2" />
              Back
            </button>
          )}
          {currentCategories.map((category) => (
            <button
              className="w-full text-left p-4 hover:bg-black hover:text-white flex justify-between items-center text-base font-medium"
              key={category.slug}
              onClick={() => handleSelectCategory(category)}
            >
              {category.name}
              {category.subcategories && category.subcategories.length > 0 && (
                <ChevronRightIcon className="size-4" />
              )}
            </button>
          ))}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};
