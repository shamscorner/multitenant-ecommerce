"use client";

import { useState } from "react";
import { ListFilterIcon, SearchIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { CategoriesSidebar } from "./categories-sidebar";

interface Props {
  disabled?: boolean;
}

export const SearchInput = ({ disabled }: Props) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex items-center gap-2 w-full">
      <CategoriesSidebar onOpenChange={setIsSidebarOpen} open={isSidebarOpen} />
      <div className="relative w-full">
        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-neutral-500" />
        <Input className="pl-8" disabled={disabled} placeholder="Search products" />
      </div>

      <Button
        className="shrink-0 flex lg:hidden"
        onClick={() => setIsSidebarOpen(true)}
        size="icon"
        variant="noShadow"
      >
        <ListFilterIcon />
      </Button>

      {/* TODO: Add library button */}
    </div>
  );
};
