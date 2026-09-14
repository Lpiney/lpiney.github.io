import { getCollection } from 'astro:content';

export async function GET() {
  const posts = await getCollection('posts', ({ data }) => !data.draft);
  const index = posts.map((post) => ({
    id: post.id,
    text: [post.data.title, post.data.subtitle, ...post.data.tags, (post.body ?? '').slice(0, 800)]
      .filter(Boolean)
      .join(' ')
      .toLowerCase(),
  }));

  return new Response(JSON.stringify(index), {
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
}
