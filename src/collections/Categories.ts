import type { CollectionConfig } from 'payload';

export const Categories: CollectionConfig = {
  fields: [
    {
      name: 'name',
      required: true,
      type: 'text',
    },
    {
      index: true,
      name: "slug",
      required: true,
      type: "text",
      unique: true,
    },
    {
      name: 'color',
      type: 'text',
    },
    {
      hasMany: false,
      name: "parent",
      relationTo: "categories",
      type: "relationship",
    },
    {
      collection: 'categories',
      hasMany: true,
      name: 'subcategories',
      on: 'parent',
      type: 'join',
    }
  ],
  slug: 'categories',
};
