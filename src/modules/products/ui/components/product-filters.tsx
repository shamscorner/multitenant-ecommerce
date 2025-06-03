"use client";

import { useState } from "react";
import { ChevronDownIcon, ChevronRightIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { TagsFilter } from "@/modules/tags/ui/components/tags-filter";

import { useProductFilters } from "../../hooks/use-product-filters";

import { PriceFilter } from "./price-filter";

interface ProductFilterProps {
  title: string;
  className?: string;
  children?: React.ReactNode;
}

const ProductFilter = ({ title, className, children }: ProductFilterProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const Icon = isOpen ? ChevronDownIcon : ChevronRightIcon;

  return (
    <div
      className={cn("p-4 border-b flex flex-col gap-2", className)}
    >
      <button
        className="flex items-center justify-between cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
        type="button"
      >
        <span className="font-medium">{title}</span>
        <Icon className="size-5" />
      </button>
      { isOpen && children }
    </div>
  );
};

export const ProductFilters = () => {
  const [filters, setFilters] = useProductFilters();

  const hasAnyFilters = Object.entries(filters).some(([key, value]) => {
    if (key === "sort") return false;
    if (Array.isArray(value)) {
      return value.length > 0;
    }
    if (typeof value === "string") {
      return value !== "";
    }
    return value !== null;
  });

  const onChange = (key:  keyof typeof filters, value: string | string[] | null) => {
    setFilters({ ...filters, [key]: value });
  };

  const onClear = () => {
    setFilters({
      minPrice: "",
      maxPrice: "",
      tags: [],
    });
  };

  return (
    <div className="border rounded-md bg-white">
      <div className="p-4 border-b flex items-center justify-between">
        <p className="font-medium">Filters</p>
        {hasAnyFilters && (
          <button type="button" className="underline" onClick={onClear}>
            Clear
          </button>
        )}
      </div>
      <ProductFilter title="Price">
        <PriceFilter
          minPrice={filters.minPrice}
          maxPrice={filters.maxPrice}
          onMinPriceChange={(value) => onChange("minPrice", value)}
          onMaxPriceChange={(value) => onChange("maxPrice", value)}
        />
      </ProductFilter>
      <ProductFilter title="Tags" className="border-b-0">
        <TagsFilter
          value={filters.tags}
          onChange={(value) => onChange("tags", value)}
        />
      </ProductFilter>
    </div>
  );
};
