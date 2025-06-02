import { PaginatedDocs } from "payload";

import { Category } from "@/payload-types";

export const getFormattedSubcategories = (data: PaginatedDocs<Category>) => {
  return data.docs.map((doc) => ({
    ...doc,
    subcategories: (doc.subcategories?.docs ?? []).map((subcategory) => ({
      ...(subcategory as Category),
    })),
  }));
};
