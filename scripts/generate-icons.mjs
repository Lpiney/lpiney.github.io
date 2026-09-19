import { writeFile } from 'node:fs/promises';
import { Resvg } from '@resvg/resvg-js';

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="180" height="180" viewBox="0 0 180 180"><rect width="180" height="180" rx="40" fill="#0a0a0f"/><text x="90" y="132" text-anchor="middle" font-family="Georgia, serif" font-size="112" fill="#dd6151">✦</text></svg>`;

const renderer = new Resvg(svg, { fitTo: { mode: 'width', value: 180 } });
await writeFile(new URL('../public/apple-touch-icon.png', import.meta.url), renderer.render().asPng());

console.log('Generated public/apple-touch-icon.png');
