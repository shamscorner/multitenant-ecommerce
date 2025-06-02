"use client";

import { useEffect, useRef, useState } from "react";
import { ListFilterIcon } from "lucide-react";
import { useParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CategoriesGetManyOutput } from "@/modules/categories/types";

import { CategoriesSidebar } from "./categories-sidebar";
import { CategoryDropdown } from "./category-dropdown";

interface Props {
  data: CategoriesGetManyOutput;
}

export const Categories = ({ data }: Props) => {
  const params = useParams();

  const containerRef = useRef<HTMLDivElement>(null);
  const measureRef = useRef<HTMLDivElement>(null);
  const viewAllRef = useRef<HTMLDivElement>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  const [visibleCount, setVisibleCount] = useState(0);
  const [isAnyHovered, setIsAnyHovered] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const categoryParam = params.category as string | undefined;
  const activeCategory = categoryParam || "all";

  const activeCategoryIndex = data.findIndex((category) => category.slug === activeCategory);
  const isActiveCategoryHidden = activeCategoryIndex >= visibleCount && activeCategoryIndex !== -1;

  useEffect(() => {
    const calculateVisible = () => {
      if (!containerRef.current || !measureRef.current || !viewAllRef.current) {
        console.warn("Required refs not available for visibility calculation");
        return;
      }

      try {
        const containerWidth = containerRef.current.offsetWidth;
        const viewAllWidth = viewAllRef.current.offsetWidth;
        const availableWidth = containerWidth - viewAllWidth;

        if (availableWidth <= 0) {
          setVisibleCount(0);
          return;
        }

        const items = Array.from(measureRef.current.children);
        let totalWidth = 0;
        let visibleCount = 0;

        for (const item of items) {
          const width = item.getBoundingClientRect().width;

          if (totalWidth + width > availableWidth) break;
          totalWidth += width;
          visibleCount++;
        }
        setVisibleCount(visibleCount);
      } catch (error) {
        console.error("Error calculating visible items:", error);
        setVisibleCount(data.length); // Fallback to show all
      }
    };

    const debouncedCalculateVisible = () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      debounceTimerRef.current = setTimeout(() => {
        calculateVisible();
      }, 200);
    };

    const resizeObserver = new ResizeObserver(debouncedCalculateVisible);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    // Initial calculation without debounce
    calculateVisible();

    return () => {
      resizeObserver.disconnect();
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [data.length]);

  return (
    <div className="relative w-full">
      {/* Categories sidebar */}
      <CategoriesSidebar
        onOpenChange={setIsSidebarOpen}
        open={isSidebarOpen}
      />

      {/* Hidden container only for measuring all items */}
      <div
        aria-hidden="true"
        className="absolute opacity-0 pointer-events-none flex"
        ref={measureRef}
        style={{ left: -9999, position: "fixed", top: -9999 }}
      >
        {data.map((category: CategoriesGetManyOutput[number]) => (
          <div key={category.id}>
            <CategoryDropdown
              category={category}
              isActive={activeCategory === category.slug}
              isNavigationHovered={false} // Replace with actual logic if needed
            />
          </div>
        ))}
      </div>

      {/* Visible items */}
      <div
        className="flex flex-nowrap items-center"
        onMouseEnter={() => setIsAnyHovered(true)}
        onMouseLeave={() => setIsAnyHovered(false)}
        ref={containerRef}
      >
        {data.slice(0, visibleCount).map((category) => (
          <div key={category.id}>
            <CategoryDropdown
              category={category}
              isActive={activeCategory === category.slug}
              isNavigationHovered={isAnyHovered}
            />
          </div>
        ))}

        {/* View All button */}
        <div className="shrink-0" ref={viewAllRef}>
          <Button
            className={cn(
              "h-11 px-4 bg-transparent border-transparent rounded-full hover:bg-white hover:border-border text-black",
              isActiveCategoryHidden && !isAnyHovered && "bg-white border-border",
            )}
            onClick={() => setIsSidebarOpen(true)}
            variant="reverse"
          >
            View All
            <ListFilterIcon className="ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
};
