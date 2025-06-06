import type { CollectionConfig } from "payload";

import { isSuperAdmin } from "@/lib/access";
import { Tenant } from "@/payload-types";

export const Products: CollectionConfig = {
  slug: "products",
  access: {
    create: ({ req }) => {
      if(isSuperAdmin(req.user)) return true;
      const tenant = req.user?.tenants?.[0]?.tenant as Tenant;
      return tenant && !!tenant.stripeDetailsSubmitted;
    },
    delete: ({ req }) => isSuperAdmin(req.user),
    // other access rules are already handled by multiTenantPlugin
  },
  admin: {
    useAsTitle: "name",
    description: "You must verify your account before creating products.",
  },
  fields: [
    {
      name: "name",
      type: "text",
      required: true,
    },
    {
      name: "description",
      // TODO: Change to RichText
      type: "text",
    },
    {
      name: "price",
      admin: {
        description: "Price in USD",
      },
      type: "number",
      required: true,
    },
    {
      name: "category",
      type: "relationship",
      relationTo: "categories",
      hasMany: false,
    },
    {
      name: "tags",
      type: "relationship",
      relationTo: "tags",
      hasMany: true,
    },
    {
      name: "cover",
      type: "upload",
      relationTo: "media",
    },
    {
      name: "image",
      type: "upload",
      relationTo: "media",
    },
    {
      name: "refundPolicy",
      type: "select",
      options: [
        "30-day",
        "14-day",
        "7-day",
        "3-day",
        "1-day",
        "no-refunds",
      ],
      defaultValue: "30-day",
    },
    {
      name: "content",
      // TODO: Change to RichText
      type: "textarea",
      admin: {
        description:
          "Protected content only visible to customers after purchase. Add product documentation, downloadable files, getting started guides, and bonus materials. Supports Markdown formatting"
      },
    },
    {
      name: "isPrivate",
      label: "Private",
      defaultValue: false,
      type: "checkbox",
      admin: {
        description: "If checked, this product will not be shown on the public storefront"
      },
    },
    {
      name: "isArchived",
      label: "Archive",
      defaultValue: false,
      type: "checkbox",
      admin: {
        description: "If checked, this product will be archived"
      },
    },
  ],
};
