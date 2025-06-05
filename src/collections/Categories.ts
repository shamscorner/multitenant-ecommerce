import type { CollectionConfig } from "payload";

import { isSuperAdmin } from "@/lib/access";

export const Categories: CollectionConfig = {
  slug: "categories",
  access: {
    read: () => true,
    create: ({ req }) => isSuperAdmin(req.user),
    update: ({ req }) => isSuperAdmin(req.user),
    delete: ({ req }) => isSuperAdmin(req.user),
  },
  admin: {
    useAsTitle: "name",
    hidden: ({ user }) => !isSuperAdmin(user),
  },
  fields: [
    {
      name: "name",
      required: true,
      type: "text",
    },
    {
      index: true,
      name: "slug",
      required: true,
      type: "text",
      unique: true,
    },
    {
      name: "color",
      type: "text",
    },
    {
      hasMany: false,
      name: "parent",
      relationTo: "categories",
      type: "relationship",
    },
    {
      collection: "categories",
      hasMany: true,
      name: "subcategories",
      on: "parent",
      type: "join",
    }
  ]
};
