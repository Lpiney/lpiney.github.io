import { getCollection } from 'astro:content';

const escapeXml = (value: string) => value.replace(/[<>&'\"]/g, (character) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;' }[character] || character));

export async function GET({ site }: { site: URL | undefined }) {
  const siteUrl = site ?? new URL('http://localhost:4321');
  const basePath = import.meta.env.BASE_URL;
  const channelUrl = new URL(basePath, siteUrl).href;
  const selfUrl = new URL(`${basePath}rss.xml`, siteUrl).href;
  const posts = (await getCollection('posts', ({ data }) => !data.draft)).sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
  const lastBuildDate = posts[0] ? posts[0].data.date.toUTCString() : new Date(0).toUTCString();
  const items = posts.map((post) => {
    const link = new URL(`${basePath}posts/${post.id}/`, siteUrl).href;
    return `<item><title>${escapeXml(post.data.title)}</title><link>${link}</link><guid>${link}</guid><pubDate>${post.data.date.toUTCString()}</pubDate><description>${escapeXml(post.data.subtitle || post.data.title)}</description></item>`;
  }).join('');
  const xml = `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom"><channel><title>Bruce Log</title><link>${channelUrl}</link><description>Robotics, independent games, and curious technology.</description><atom:link href="${selfUrl}" rel="self" type="application/rss+xml"/><lastBuildDate>${lastBuildDate}</lastBuildDate><language>zh-CN</language>${items}</channel></rss>`;
  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
}
