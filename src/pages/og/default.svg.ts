const escapeXml = (value: string) => value.replace(/[<>&'\"]/g, (character) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;' }[character] || character));

export function GET() {
  const title = escapeXml('Bruce // Field Notes');
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630"><rect width="1200" height="630" fill="#070b16"/><circle cx="970" cy="170" r="235" fill="#9a8cff" opacity=".22"/><circle cx="930" cy="180" r="112" fill="none" stroke="#b8ff65" stroke-width="2" opacity=".65"/><path d="M64 462H1136" stroke="#b8ff65" stroke-opacity=".35"/><text x="66" y="116" fill="#b8ff65" font-family="monospace" font-size="24" letter-spacing="5">BRUCE.LOG / FIELD NOTES</text><text x="66" y="302" fill="#e9edff" font-family="Arial, sans-serif" font-size="76" font-weight="700">${title}</text><text x="66" y="366" fill="#8f9ab9" font-family="Arial, sans-serif" font-size="30">Robotics · indie games · curious technology</text><text x="66" y="510" fill="#b8ff65" font-family="monospace" font-size="20">STATUS: CURIOUS</text></svg>`;
  return new Response(svg, { headers: { 'Content-Type': 'image/svg+xml', 'Cache-Control': 'public, max-age=31536000, immutable' } });
}
