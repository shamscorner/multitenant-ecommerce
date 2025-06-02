"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";

import { DEFAULT_BG_COLOR } from "@/modules/home/constants";
import { useTRPC } from "@/trpc/client";

import { BreadcrumbNavigation } from "./breadcrumb-navigation";
import { Categories } from "./categories";
import { SearchInput } from "./search-input";

export const SearchFilters = () => {
  const params = useParams() as { category?: string; subcategory?: string };

  const trpc = useTRPC();
  const { data } = useSuspenseQuery(trpc.categories.getMany.queryOptions());

  const categoryParam = params.category as string | undefined;
  const activeCategorySlug = categoryParam || "all";

  const activeCategoryData = data.find((category) => category.slug === activeCategorySlug);
  const activeCategoryColor = activeCategoryData?.color || DEFAULT_BG_COLOR;
  const activeCategoryName = activeCategoryData?.name || null;

  const activeSubCategory = params.subcategory as string | undefined;
  const activeSubCategoryName = activeCategoryData?.subcategories.find(
    (subcategory) => subcategory.slug === activeSubCategory
  )?.name || null;

  return (
    <div
      className="px-4 lg:px-12 py-8 border-b flex flex-col gap-4 w-full"
      style={{ backgroundColor: activeCategoryColor }}
    >
      <SearchInput />
      <div className="hidden lg:block">
        <Categories data={data} />
      </div>
      <BreadcrumbNavigation
        activeCategorySlug={activeCategorySlug}
        activeCategoryName={activeCategoryName}
        activeSubCategoryName={activeSubCategoryName}
      />
    </div>
  );
};

export const SearchFiltersLoadingSkeleton = () => {
  return (
    <div className="px-4 lg:px-12 py-8 border-b flex flex-col gap-4 w-full bg-gray-100">
      <SearchInput disabled />
      <div className="hidden lg:block">
        <div className="h-11" />
      </div>
    </div>
  );
};
