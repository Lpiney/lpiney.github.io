import { getCollection } from 'astro:content';

const escapeXml = (value: string) => value.replace(/[<>&'\"]/g, (character) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;' }[character] || character));

export async function getStaticPaths() {
  const posts = await getCollection('posts', ({ data }) => !data.draft);
  return posts.map((post) => ({ params: { slug: post.id }, props: { title: post.data.title, subtitle: post.data.subtitle || '', date: post.data.date.getFullYear() } }));
}

export function GET({ props }: { props: { title: string; subtitle: string; date: number } }) {
  const title = escapeXml(props.title);
  const subtitle = escapeXml(props.subtitle.slice(0, 90));
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630"><rect width="1200" height="630" fill="#050505"/><path d="M0 82H1200M0 548H1200M785 0V630" stroke="#fff" stroke-opacity=".15"/><path d="M868 98L948 98L980 408L836 408Z" fill="#e9e9e5"/><path d="M836 408H980L1018 521H798Z" fill="#ff2d20" opacity=".9"/><path d="M64 486H1136" stroke="#ff2d20" stroke-width="3"/><text x="66" y="110" fill="#ff2d20" font-family="monospace" font-size="23" letter-spacing="4">BRUCE.LOG / MISSION ${props.date}</text><text x="66" y="294" fill="#f4f4f0" font-family="Arial, sans-serif" font-size="64" font-weight="700">${title}</text><text x="66" y="358" fill="#a5a5a0" font-family="Arial, sans-serif" font-size="28">${subtitle}</text><text x="66" y="535" fill="#f4f4f0" font-family="monospace" font-size="20">FLIGHT NOTE / NOMINAL</text></svg>`;
  return new Response(svg, { headers: { 'Content-Type': 'image/svg+xml', 'Cache-Control': 'public, max-age=31536000, immutable' } });
}
