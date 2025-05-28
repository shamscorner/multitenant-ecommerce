import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { CustomCategory } from "../types";
import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import router from "next/router";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data: CustomCategory[]; // TODO: remove this later
}

export const CategoriesSidebar = ({
  open,
  onOpenChange,
  data
}: Props) => {
  const [parentCategories, setParentCategories] = useState<CustomCategory[] | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<CustomCategory | null>(null);

  const currentCategories = parentCategories ?? data ?? [];

  const handleOpenChange = (open: boolean) => {
    setSelectedCategory(null);
    setParentCategories(null);
    onOpenChange(open);
  };

  const handleSelectCategory = (category: CustomCategory) => {
    if (category.subcategories && category.subcategories.length > 0) {
      setParentCategories(category.subcategories as CustomCategory[]);
      setSelectedCategory(category);
      return;
    }

    if (parentCategories && selectedCategory) {
      router.push(`/${selectedCategory.slug}/${category.slug}`);
    } else if (category.slug === 'all') {
      router.push('/');
    } else {
      router.push(`/${category.slug}`);
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
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="left"
        className="p-0 transition-none"
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
              onClick={handleBackNavigation}
              className="w-full text-left p-4 hover:bg-black hover:text-white flex items-center text-base font-medium"
            >
              <ChevronLeftIcon className="size-4 mr-2" />
              Back
            </button>
          )}
          {currentCategories.map((category) => (
            <button
              key={category.slug}
              onClick={() => handleSelectCategory(category)}
              className="w-full text-left p-4 hover:bg-black hover:text-white flex justify-between items-center text-base font-medium"
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
