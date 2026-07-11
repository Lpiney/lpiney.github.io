import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const posts = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './content/posts' }),
  schema: z.object({
    title: z.string(),
    subtitle: z.string().optional(),
    date: z.coerce.date(),
    author: z.string().default('Bruce Li'),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().optional(),
  }),
});

const pages = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './content/pages' }),
  schema: z.object({}),
});

const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './content/projects' }),
  schema: z.object({
    title: z.string(),
    summaryZh: z.string(),
    summaryEn: z.string(),
    category: z.string(),
    status: z.string(),
    started: z.coerce.date(),
    link: z.string().url().optional(),
  }),
});

export const collections = { posts, pages, projects };
