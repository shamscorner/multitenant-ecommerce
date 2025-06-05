import type { CollectionConfig } from "payload";

import { isSuperAdmin } from "@/lib/access";

export const Media: CollectionConfig = {
  access: {
    read: () => true,
    delete: ({ req }) => isSuperAdmin(req.user),
  },
  admin: {
    hidden: ({ user }) => !isSuperAdmin(user),
  },
  fields: [
    {
      name: "alt",
      required: true,
      type: "text",
    },
  ],
  slug: "media",
  upload: true,
};
