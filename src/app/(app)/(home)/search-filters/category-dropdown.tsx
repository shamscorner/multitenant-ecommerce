"use client";

import { useRef, useState } from "react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CategoriesGetManyOutput } from "@/modules/categories/types";

import { SubcategoryMenu } from "./subcategory-menu";
import { useDropdownPosition } from "./use-dropdown-position";

interface Props {
  category: CategoriesGetManyOutput[number];
  isActive?: boolean;
  isNavigationHovered?: boolean;
}

export const CategoryDropdown = ({
  category,
  isActive = false,
  isNavigationHovered = false,
}: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropDownRef = useRef<HTMLDivElement>(null);
  const { getDropdownPosition } = useDropdownPosition(dropDownRef);

  const handleMouseEnter = () => {
    if (!category.subcategories) return;
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    setIsOpen(false);
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (!category.subcategories) return;

    if (event.key === "Enter" || event.key === " " || event.key === "Space") {
      event.preventDefault();
      setIsOpen(!isOpen);
    } else if (event.key === "Escape" && isOpen) {
      event.preventDefault();
      setIsOpen(false);
    }
  };

  return (
    <div
      className="relative"
      onKeyDown={handleKeyDown}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      ref={dropDownRef}
      role="navigation"
    >
      <div className="relative">
        <Button
          aria-expanded={isOpen}
          aria-haspopup="true"
          asChild
          className={cn(
            "h-11 px-4 bg-transparent border-transparent rounded-full hover:bg-white hover:border-border text-black",
            isActive && !isNavigationHovered && "bg-white border-border",
            isOpen && "bg-white border-border shadow-shadow -translate-x-boxShadowX -translate-y-boxShadowY",
          )}
          variant="reverse"
        >
          <Link href={`/${category.slug === 'all' ? '' : category.slug}`}>
            {category.name}
          </Link>
        </Button>

        {category.subcategories && category.subcategories.length > 0 && (
          <div
            className={cn(
              "opacity-0 absolute -bottom-3 w-0 h-0 border-l-[10px] border-r-[10px] border-b-[10px] border-l-transparent border-r-transparent border-b-black left-1/2 -translate-x-1/2",
              isOpen && "opacity-100"
            )}
          />
        )}
      </div>

      <SubcategoryMenu
        category={category}
        isOpen={isOpen}
        position={getDropdownPosition()}
      />
    </div>
  );
};
