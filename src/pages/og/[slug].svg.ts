import { getCollection } from 'astro:content';

const escapeXml = (value: string) =>
  value.replace(
    /[<>&'\"]/g,
    (character) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;' })[character] || character,
  );

const isWide = (character: string) => /[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}　-〿＀-｠]/u.test(character);
const LATIN_WIDTH = 0.55;
const KEEP_WITH_PREVIOUS = '，。、：；！？）」』】》〉·—…';

type Token = { text: string; width: number; wide: boolean };

const tokenize = (value: string) => {
  const tokens: Token[] = [];
  let latin = '';
  const flushLatin = () => {
    if (!latin) return;
    tokens.push({ text: latin, width: latin.length * LATIN_WIDTH, wide: false });
    latin = '';
  };
  for (const character of value) {
    if (isWide(character)) {
      flushLatin();
      tokens.push({ text: character, width: 1, wide: true });
    } else if (character === ' ') {
      flushLatin();
    } else {
      latin += character;
    }
  }
  flushLatin();
  return tokens;
};

const wrapText = (value: string, lineLength: number) => {
  const lines: string[] = [];
  let line = '';
  let width = 0;
  let endsLatin = false;
  for (const token of tokenize(value)) {
    const gap = line && !token.wide && endsLatin ? 1 : 0;
    const added = token.width + gap * LATIN_WIDTH;
    if (line && width + added > lineLength && !KEEP_WITH_PREVIOUS.includes(token.text)) {
      lines.push(line);
      line = token.text;
      width = token.width;
    } else {
      line += (gap ? ' ' : '') + token.text;
      width += added;
    }
    endsLatin = !token.wide;
  }
  if (line) lines.push(line);
  return lines;
};

const truncateLines = (lines: string[], maxLines: number) => {
  if (lines.length <= maxLines) return lines;
  const kept = lines.slice(0, maxLines);
  kept[maxLines - 1] = `${kept[maxLines - 1]}…`;
  return kept;
};

export async function getStaticPaths() {
  const posts = await getCollection('posts', ({ data }) => !data.draft);
  return posts.map((post) => ({
    params: { slug: post.id },
    props: {
      title: post.data.title,
      subtitle: post.data.subtitle || '',
      date: post.data.date.getUTCFullYear(),
    },
  }));
}

export function GET({ props }: { props: { title: string; subtitle: string; date: number } }) {
  const titleLines = wrapText(props.title, 18).map(escapeXml);
  const multiLineTitle = titleLines.length > 1;
  const titleMarkup = titleLines
    .map((line, index) => `<tspan x="66" dy="${index === 0 ? 0 : 70}">${line}</tspan>`)
    .join('');
  const subtitleLines = truncateLines(wrapText(props.subtitle, 36), 3).map(escapeXml);
  const subtitleMarkup = subtitleLines
    .map((line, index) => `<tspan x="66" dy="${index === 0 ? 0 : 36}">${line}</tspan>`)
    .join('');
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630"><rect width="1200" height="630" fill="#050505"/><path d="M0 82H1200M0 548H1200M785 0V630" stroke="#fff" stroke-opacity=".15"/><circle cx="923" cy="270" r="192" fill="#8e83e8" opacity=".15"/><ellipse cx="923" cy="270" rx="242" ry="92" fill="none" stroke="#b6faff" stroke-opacity=".65" stroke-width="2" transform="rotate(-27 923 270)"/><ellipse cx="923" cy="270" rx="175" ry="67" fill="none" stroke="#ff2d20" stroke-opacity=".7" stroke-width="2" transform="rotate(39 923 270)"/><circle cx="923" cy="270" r="78" fill="#111323" stroke="#b6faff" stroke-opacity=".6"/><text x="891" y="301" fill="#f4f4f0" font-family="Georgia, serif" font-size="104">✦</text><path d="M64 486H1136" stroke="#ff2d20" stroke-width="3"/><text x="66" y="110" fill="#ff2d20" font-family="monospace" font-size="23" letter-spacing="4">BRUCE.LOG / ${props.date}</text><text x="66" y="${multiLineTitle ? 250 : 294}" fill="#f4f4f0" font-family="Georgia, serif" font-size="${multiLineTitle ? 56 : 64}" font-weight="500">${titleMarkup}</text><text x="66" y="${multiLineTitle ? 392 : 358}" fill="#a5a5a0" font-family="Arial, sans-serif" font-size="25">${subtitleMarkup}</text><text x="66" y="535" fill="#f4f4f0" font-family="monospace" font-size="20">COSMIC NOTE</text></svg>`;
  return new Response(svg, {
    headers: { 'Content-Type': 'image/svg+xml', 'Cache-Control': 'public, max-age=31536000, immutable' },
  });
}
