import { defineCollection, z } from "astro:content";

const notes = defineCollection({
  // Type-check frontmatter using a schema
  schema: z.object({
    title: z.string(),
    description: z.string(),
    // Transform string to Date object
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    size: z.string().optional(),
  }),
});

export const collections = { notes };
