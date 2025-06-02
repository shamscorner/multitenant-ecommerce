import { Category } from "@/payload-types";
import { baseProcedure, createTRPCRouter } from "@/trpc/init";

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

    const formattedData = data.docs.map((doc) => ({
      ...doc,
      subcategories: (doc.subcategories?.docs ?? []).map((subcategory) => ({
        ...(subcategory as Category),
      })),
    }));

    return formattedData;
  })
});
