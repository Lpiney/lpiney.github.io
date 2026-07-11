import { getCollection } from 'astro:content';

const escapeXml = (value: string) => value.replace(/[<>&'\"]/g, (character) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;' }[character] || character));

export async function getStaticPaths() {
  const posts = await getCollection('posts', ({ data }) => !data.draft);
  return posts.map((post) => ({ params: { slug: post.id }, props: { title: post.data.title, subtitle: post.data.subtitle || '', date: post.data.date.getFullYear() } }));
}

export function GET({ props }: { props: { title: string; subtitle: string; date: number } }) {
  const title = escapeXml(props.title);
  const subtitle = escapeXml(props.subtitle.slice(0, 90));
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630"><rect width="1200" height="630" fill="#070b16"/><circle cx="1010" cy="130" r="270" fill="#9a8cff" opacity=".2"/><circle cx="1000" cy="140" r="134" fill="none" stroke="#b8ff65" stroke-width="2" opacity=".65"/><path d="M64 486H1136" stroke="#b8ff65" stroke-opacity=".35"/><text x="66" y="110" fill="#b8ff65" font-family="monospace" font-size="23" letter-spacing="4">BRUCE.LOG / ${props.date}</text><text x="66" y="294" fill="#e9edff" font-family="Arial, sans-serif" font-size="64" font-weight="700">${title}</text><text x="66" y="358" fill="#8f9ab9" font-family="Arial, sans-serif" font-size="28">${subtitle}</text><text x="66" y="535" fill="#b8ff65" font-family="monospace" font-size="20">FIELD NOTE</text></svg>`;
  return new Response(svg, { headers: { 'Content-Type': 'image/svg+xml', 'Cache-Control': 'public, max-age=31536000, immutable' } });
}
