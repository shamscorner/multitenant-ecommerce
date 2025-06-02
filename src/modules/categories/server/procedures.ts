import { baseProcedure, createTRPCRouter } from "@/trpc/init";

import { getFormattedSubcategories } from "../utils";

export const categoriesRouter = createTRPCRouter({
  getMany: baseProcedure.query(async ({ ctx }) => {
    const data = await ctx.db.find({
      collection: "categories",
      depth: 1, // populate subcategories
      pagination: false,
      sort: "name",
      where: {
        parent: {
          exists: false,
        }
      }
    });

    return getFormattedSubcategories(data);
  })
});
