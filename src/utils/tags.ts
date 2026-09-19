import { getCollection } from 'astro:content';

export const tagSlug = (tag: string) => encodeURIComponent(tag.toLowerCase().trim().replace(/\s+/g, '-'));

export const tagFromSlug = (slug: string, tags: string[]) => tags.find((tag) => tagSlug(tag) === slug);

export const TAG_PAGE_MIN_POSTS = 2;

export const getTagCounts = async () => {
  const posts = await getCollection('posts', ({ data }) => !data.draft);
  const counts = new Map<string, number>();
  for (const post of posts) {
    for (const tag of post.data.tags) {
      counts.set(tag, (counts.get(tag) ?? 0) + 1);
    }
  }
  return counts;
};

export const hasTagPage = (counts: Map<string, number>, tag: string) => (counts.get(tag) ?? 0) >= TAG_PAGE_MIN_POSTS;
