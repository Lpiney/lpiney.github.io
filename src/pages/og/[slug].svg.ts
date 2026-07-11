import { getCollection } from 'astro:content';

const escapeXml = (value: string) => value.replace(/[<>&'\"]/g, (character) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;' }[character] || character));

export async function getStaticPaths() {
  const posts = await getCollection('posts', ({ data }) => !data.draft);
  return posts.map((post) => ({ params: { slug: post.id }, props: { title: post.data.title, subtitle: post.data.subtitle || '', date: post.data.date.getFullYear() } }));
}

export function GET({ props }: { props: { title: string; subtitle: string; date: number } }) {
  const title = escapeXml(props.title);
  const subtitle = escapeXml(props.subtitle.slice(0, 90));
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630"><rect width="1200" height="630" fill="#050505"/><path d="M0 82H1200M0 548H1200M785 0V630" stroke="#fff" stroke-opacity=".15"/><circle cx="923" cy="270" r="192" fill="#8e83e8" opacity=".15"/><ellipse cx="923" cy="270" rx="242" ry="92" fill="none" stroke="#b6faff" stroke-opacity=".65" stroke-width="2" transform="rotate(-27 923 270)"/><ellipse cx="923" cy="270" rx="175" ry="67" fill="none" stroke="#ff2d20" stroke-opacity=".7" stroke-width="2" transform="rotate(39 923 270)"/><circle cx="923" cy="270" r="78" fill="#111323" stroke="#b6faff" stroke-opacity=".6"/><text x="891" y="301" fill="#f4f4f0" font-family="Georgia, serif" font-size="104">∞</text><path d="M64 486H1136" stroke="#ff2d20" stroke-width="3"/><text x="66" y="110" fill="#ff2d20" font-family="monospace" font-size="23" letter-spacing="4">BRUCE.LOG / COSMIC ${props.date}</text><text x="66" y="294" fill="#f4f4f0" font-family="Arial, sans-serif" font-size="64" font-weight="700">${title}</text><text x="66" y="358" fill="#a5a5a0" font-family="Arial, sans-serif" font-size="28">${subtitle}</text><text x="66" y="535" fill="#f4f4f0" font-family="monospace" font-size="20">COSMIC NOTE / ∞</text></svg>`;
  return new Response(svg, { headers: { 'Content-Type': 'image/svg+xml', 'Cache-Control': 'public, max-age=31536000, immutable' } });
}
