// Note: Run `npm run db:fresh` and ensure the database is fully initialized before running this seed script.
// This ensures all collections and schema are properly set up before seeding data.

import { getPayload } from "payload";
import config from "@payload-config";

import { categories } from './categories';

const seed = async () => {
  const payload = await getPayload({ config });

  for (const category of categories) {
    const parentCategory =  await payload.create({
      collection: "categories",
      data: {
        name: category.name,
        slug: category.slug,
        color: category.color,
        parent: null,
      }
    });

    // Process subcategories in parallel for better performance
    if (category.subcategories?.length) {
      await Promise.all(
        category.subcategories.map(subcategory =>
          payload.create({
            collection: "categories",
            data: {
              name: subcategory.name,
              slug: subcategory.slug,
              parent: parentCategory.id,
            }
          })
        )
      );
    }
  }
};

try {
  console.log("Starting seed...");
  await seed();
  console.log("Seed completed successfully.");
  process.exit(0);
} catch (error) {
  console.error("Error during seed:", error);
  console.error("Stack trace:", error instanceof Error ? error.stack : "No stack trace available");
  process.exit(1);
}
