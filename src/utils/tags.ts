export const tagSlug = (tag: string) => encodeURIComponent(tag.toLowerCase().trim().replace(/\s+/g, '-'));

export const tagFromSlug = (slug: string, tags: string[]) =>
  tags.find((tag) => tagSlug(tag) === slug);
