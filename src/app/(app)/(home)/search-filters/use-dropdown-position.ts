import { RefObject } from "react";

export const useDropdownPosition = (
  ref: RefObject<HTMLDivElement> | RefObject<HTMLDivElement | null>,
) => {
  const getDropdownPosition = () => {
    if(!ref.current) return { left: 0, top: 0 };

    const rect = ref.current.getBoundingClientRect();
    const dropdownWidth = 240; // w-60 = 15rem = 240px

    let left = rect.left + window.scrollX;
    const top = rect.bottom + window.scrollY;

    // Check if the dropdown goes off the right side of the screen
    if (left + dropdownWidth > window.innerWidth) {
      // align to the right edge of the button
      left = rect.right - dropdownWidth + window.scrollX;

      // If it still goes off the left side, align to the left edge
      if (left < 0) {
        left = window.innerWidth - dropdownWidth - 16;
      }
    }

    // ensure the dropdown doesn't go off left edge
    if (left < 0) {
      left = 16; // 16px padding
    }

    return { left, top };
  };

  return {
    getDropdownPosition,
  };
};
