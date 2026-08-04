import { defineCollection } from "astro:content";
import { z } from "astro/zod";
import { glob } from "astro/loaders";

const notes = defineCollection({
  loader: glob({ pattern: "**/[^_]*.md", base: "./src/content/notes" }),
  // Type-check frontmatter using a schema
  schema: z.object({
    title: z.string(),
    description: z.string(),
    // Transform string to Date object
    pubDate: z.coerce.date(),
    updatedAt: z.coerce.date().optional(),
    color: z.string().optional(),
    image: z.string().optional(),
  }),
});

export const collections = { notes };

const indexLocale = z.object({
  description: z.string(),
  heading: z.string(),
  subheading: z.string(),
  greeting: z.string(),
  introText1: z.string(),
  introText2: z.string(),
  motivationTitle: z.string(),
  motivationText: z.string(),
  skills: z.string(),
  projectTitle: z.string(),
  kopistaDescription: z.string(),
  postsTitle: z.string(),
  contactTitle: z.string(),
  universeHeading: z.string(),
  universeSubheading: z.string(),
  name: z.string(),
  email: z.string(),
  message: z.string(),
  submit: z.string(),
});

export type IndexLocale = z.infer<typeof indexLocale>;
