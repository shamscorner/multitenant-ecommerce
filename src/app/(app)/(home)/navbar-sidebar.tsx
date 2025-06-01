import Link from "next/link";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";

interface NavbarItem {
  children: React.ReactNode;
  href: string;
}

interface Props {
  items: NavbarItem[];
  onOpenChange: (open: boolean) => void;
  open: boolean;
}

export const NavbarSidebar = ({ items, onOpenChange, open }: Props) => {
  return (
    <Sheet onOpenChange={onOpenChange} open={open}>
      <SheetContent className="p-0 transition-none" side="left">
        <SheetHeader className="p-4 border-b">
          <SheetTitle>Menu</SheetTitle>
        </SheetHeader>

        <ScrollArea className="flex flex-col overflow-y-auto h-full pb-2">
          {items.map((item) => (
            <Link
              className="w-full text-left p-4 hover:bg-black hover:text-white flex items-center text-base font-medium"
              href={item.href}
              key={item.href}
              onClick={() => onOpenChange(false)} // Close sidebar on item click
            >
              {item.children}
            </Link>
          ))}

          <div className="border-t">
            <Link
              className="w-full text-left p-4 hover:bg-black hover:text-white flex items-center text-base font-medium"
              href="/sign-in"
              onClick={() => onOpenChange(false)} // Close sidebar on item click
            >
              Log in
            </Link>
            <Link
              className="w-full text-left p-4 hover:bg-black hover:text-white flex items-center text-base font-medium"
              href="/sign-up"
              onClick={() => onOpenChange(false)} // Close sidebar on item click
            >
              Start Selling
            </Link>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};
