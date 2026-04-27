import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const blog = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/blog" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    author: z.string().default("Ronaldo Dantas"),
    category: z.string(),
    cover: z.string().optional(),
    draft: z.boolean().default(false),
  }),
});

const areas = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/areas" }),
  schema: z.object({
    title: z.string(),
    short: z.string(),
    icon: z.string(),
    order: z.number(),
    summary: z.string(),
  }),
});

export const collections = { blog, areas };
