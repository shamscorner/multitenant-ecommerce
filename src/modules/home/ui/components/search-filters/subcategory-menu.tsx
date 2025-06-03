import Link from "next/link";

import { CategoriesGetManyOutput } from "@/modules/categories/types";

interface Props {
  category: CategoriesGetManyOutput[number];
  isOpen: boolean;
}

export const SubcategoryMenu = ({
  category,
  isOpen,
}: Props) => {
  if (!isOpen || !category.subcategories || category.subcategories.length === 0) {
    return null;
  }

  const backgroundColor = category.color || "#f5f5f5";

  return (
    <div
      className="absolute z-100"
      style={{
        left: "0",
        top: 45,
      }}
    >
      <div className="h-3 w-60"></div>
      <div
        className="w-60 text-black rounded-md overflow-hidden border shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] -translate-x-[2px] -translate-y-[2px]"
        style={{ backgroundColor }}
      >
        <div>
          {category.subcategories?.map((subcategory) => (
            <Link
              className="w-full text-left p-4 hover:bg-black hover:text-white flex justify-between items-center underline font-medium"
              href={`/${category.slug}/${subcategory.slug}`}
              key={subcategory.slug}
            >
              {subcategory.name}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};
