"use client";

import { CategoryDropdown } from "./category-dropdown";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ListFilterIcon } from "lucide-react";
import { CategoriesSidebar } from "./categories-sidebar";
import { CategoriesGetManyOutput } from "@/modules/categories/types";

interface Props {
  data: CategoriesGetManyOutput;
}

export const Categories = ({ data }: Props) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const measureRef = useRef<HTMLDivElement>(null);
  const viewAllRef = useRef<HTMLDivElement>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  const [visibleCount, setVisibleCount] = useState(0);
  const [isAnyHovered, setIsAnyHovered] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const activeCategory = 'all';

  const activeCategoryIndex = data.findIndex((category) => category.slug === activeCategory);
  const isActiveCategoryHidden = activeCategoryIndex >= visibleCount && activeCategoryIndex !== -1;

  useEffect(() => {
    const calculateVisible = () => {
      if (!containerRef.current || !measureRef.current || !viewAllRef.current) {
        console.warn('Required refs not available for visibility calculation');
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
        console.error('Error calculating visible items:', error);
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
        open={isSidebarOpen}
        onOpenChange={setIsSidebarOpen}
      />

      {/* Hidden container only for measuring all items */}
      <div
        ref={measureRef}
        className="absolute opacity-0 pointer-events-none flex"
        style={{ position: "fixed", top: -9999, left: -9999 }}
        aria-hidden="true"
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
        ref={containerRef}
        className="flex flex-nowrap items-center"
        onMouseEnter={() => setIsAnyHovered(true)}
        onMouseLeave={() => setIsAnyHovered(false)}
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
        <div ref={viewAllRef} className="shrink-0">
          <Button
            variant="reverse"
            className={cn(
              "h-11 px-4 bg-transparent border-transparent rounded-full hover:bg-white hover:border-border text-black",
              isActiveCategoryHidden && !isAnyHovered && "bg-white border-border",
            )}
            onClick={() => setIsSidebarOpen(true)}
          >
            View All
            <ListFilterIcon className="ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
};
