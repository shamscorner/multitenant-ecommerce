// Note: Run `npm run db:fresh` and ensure the database is fully initialized before running this seed script.
// This ensures all collections and schema are properly set up before seeding data.

import config from "@payload-config";
import { getPayload } from "payload";

import { categories } from "./categories";

const seed = async () => {
  const payload = await getPayload({ config });

  // Create admin tenant
  const adminTenant = await payload.create({
    collection: "tenants",
    data: {
      name: process.env.ADMIN_TENANT_USERNAME || "admin",
      slug: process.env.ADMIN_TENANT_SLUG || "admin",
      stripeAccountId: process.env.ADMIN_STRIPE_ACCOUNT_ID || "admin",
    },
  });

  // Create admin user
  await payload.create({
    collection: "users",
    data: {
      email: process.env.ADMIN_TENANT_EMAIL || "admin@shamsroad.com",
      password: process.env.ADMIN_TENANT_PASSWORD || "This@123",
      roles: ["super-admin"],
      username: process.env.ADMIN_TENANT_USERNAME || "admin",
      tenants: [
        {
          tenant: adminTenant.id,
        },
      ],
    },
  });

  for (const category of categories) {
    const parentCategory =  await payload.create({
      collection: "categories",
      data: {
        color: category.color,
        name: category.name,
        parent: null,
        slug: category.slug,
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
              parent: parentCategory.id,
              slug: subcategory.slug,
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
