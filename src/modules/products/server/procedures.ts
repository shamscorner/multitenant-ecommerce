import { Where } from "payload";
import z from "zod";

import { getFormattedSubcategories } from "@/modules/categories/utils";
import { baseProcedure, createTRPCRouter } from "@/trpc/init";

export const productsRouter = createTRPCRouter({
  getMany: baseProcedure
    .input(z.object({
      categorySlug: z.string().nullable().optional(),
    }))
    .query(async ({ ctx, input }) => {
      const where: Where = {};

      if(input.categorySlug) {
        const categoriesData =  await ctx.db.find({
          collection: "categories",
          limit: 1,
          depth: 1, // populate subcategories
          pagination: false,
          where: {
            slug: {
              equals: input.categorySlug,
            }
          }
        });

        const formattedCategoriesData = getFormattedSubcategories(categoriesData);
        const parentCategory = formattedCategoriesData[0];
        const subcategoriesSlug: string[] = [];

        if(parentCategory) {
          subcategoriesSlug.push(
            ...parentCategory.subcategories.map((subcategory) => subcategory.slug)
          );
        }

        where["category.slug"] = {
          in: [input.categorySlug, ...subcategoriesSlug],
        };
      }

      const data = await ctx.db.find({
        collection: "products",
        depth: 1, // populate category & image
        where
      });

      return data;
    })
});
