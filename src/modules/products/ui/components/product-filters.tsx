"use client";

import { useState } from "react";
import { ChevronDownIcon, ChevronRightIcon } from "lucide-react";

import { cn } from "@/lib/utils";

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

  const onChange = (key:  keyof typeof filters, value: unknown) => {
    setFilters({ ...filters, [key]: value });
  };

  return (
    <div className="border rounded-md bg-white">
      <div className="p-4 border-b flex items-center justify-between">
        <p className="font-medium">Filters</p>
        <button type="button" className="underline" onClick={() => {}}>
          Clear
        </button>
      </div>
      <ProductFilter title="Price">
        <PriceFilter
          minPrice={filters.minPrice}
          maxPrice={filters.maxPrice}
          onMinPriceChange={(value) => onChange("minPrice", value)}
          onMaxPriceChange={(value) => onChange("maxPrice", value)}
        />
      </ProductFilter>
    </div>
  );
};
