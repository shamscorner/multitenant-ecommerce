import { CategoryDropdown } from "./category-dropdown";
import { CustomCategory } from "../types";

interface Props {
  data: CustomCategory[];
}

export const Categories = ({ data }: Props) => {
  return (
    <div className="relative w-full">
      <div className="flex flex-nowrap items-center">
        {data.map((category: CustomCategory) => (
          <div key={category.id}>
            <CategoryDropdown
              category={category}
              isActive={false} // Replace with actual logic if needed
              isNavigationHovered={false} // Replace with actual logic if needed
            />
          </div>
        ))}
      </div>
    </div>
  );
};
