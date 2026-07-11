const escapeXml = (value: string) => value.replace(/[<>&'\"]/g, (character) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;' }[character] || character));

export function GET() {
  const title = escapeXml('Bruce // Field Notes');
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630"><rect width="1200" height="630" fill="#050505"/><path d="M0 85H1200M0 545H1200M760 0V630" stroke="#fff" stroke-opacity=".15"/><path d="M835 105L915 105L945 415L805 415Z" fill="#e9e9e5"/><path d="M805 415H945L980 520H770Z" fill="#ff2d20" opacity=".9"/><path d="M64 462H1136" stroke="#ff2d20" stroke-width="3"/><text x="66" y="116" fill="#ff2d20" font-family="monospace" font-size="24" letter-spacing="5">BRUCE.LOG / MISSION NOTES</text><text x="66" y="302" fill="#f4f4f0" font-family="Arial, sans-serif" font-size="76" font-weight="700">${title}</text><text x="66" y="366" fill="#a5a5a0" font-family="Arial, sans-serif" font-size="30">Robotics · indie games · curious technology</text><text x="66" y="510" fill="#f4f4f0" font-family="monospace" font-size="20">FLIGHT STATUS: NOMINAL</text></svg>`;
  return new Response(svg, { headers: { 'Content-Type': 'image/svg+xml', 'Cache-Control': 'public, max-age=31536000, immutable' } });
}
