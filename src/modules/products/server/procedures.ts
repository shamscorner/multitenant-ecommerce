import { Sort, Where } from "payload";
import z from "zod";

import { getFormattedSubcategories } from "@/modules/categories/utils";
import { baseProcedure, createTRPCRouter } from "@/trpc/init";

import { sortValues } from "../searchParams";

export const productsRouter = createTRPCRouter({
  getMany: baseProcedure
    .input(z.object({
      categorySlug: z.string().nullable().optional(),
      minPrice: z.string().nullable().optional(),
      maxPrice: z.string().nullable().optional(),
      tags: z.array(z.string()).nullable().optional(),
      sort: z.enum(sortValues).nullable().optional(),
    }))
    .query(async ({ ctx, input }) => {
      const where: Where = {};

      const sortMap: Record<typeof sortValues[number], Sort> = {
        trending: "name",
        hot_and_new: "+createdAt",
        curated: "-createdAt",
      };

      const sort: Sort = input.sort
        ? (sortMap[input.sort] ?? "-createdAt")
        : "-createdAt";

      if (input.minPrice) {
        where.price = {
          greater_than_equal: input.minPrice,
        };
      }

      if (input.maxPrice) {
        if (!where.price) {
          where.price = {};
        }
        where.price = {
          ...where.price,
          less_than_equal: input.maxPrice,
        };
      }

      if (input.categorySlug) {
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

        if (parentCategory) {
          subcategoriesSlug.push(
            ...parentCategory.subcategories.map((subcategory) => subcategory.slug)
          );
          where["category.slug"] = {
            in: [parentCategory.slug, ...subcategoriesSlug],
          };
        }
      }

      if(input.tags && input.tags.length > 0) {
        where["tags.name"] = {
          in: input.tags,
        };
      }

      const data = await ctx.db.find({
        collection: "products",
        depth: 1, // populate category & image
        where,
        sort
      });

      return data;
    })
});
