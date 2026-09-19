import { getCollection } from 'astro:content';

const stripMarkup = (body: string) =>
  body
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`([^`]*)`/g, '$1')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/<[^>]+>/g, ' ')
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/[*_>~|]/g, ' ');

export async function GET() {
  const posts = await getCollection('posts', ({ data }) => !data.draft);
  const index = posts.map((post) => ({
    id: post.id,
    text: [post.data.title, post.data.subtitle, ...post.data.tags, stripMarkup(post.body ?? '')]
      .filter(Boolean)
      .join(' ')
      .replace(/\s+/g, ' ')
      .toLowerCase(),
  }));

  return new Response(JSON.stringify(index), {
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
}
