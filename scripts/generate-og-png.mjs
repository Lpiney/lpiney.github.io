import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { Resvg } from '@resvg/resvg-js';

const ogDirectory = new URL('../dist/og/', import.meta.url);
const files = (await readdir(ogDirectory)).filter((file) => file.endsWith('.svg'));

await Promise.all(files.map(async (file) => {
  const svg = await readFile(new URL(file, ogDirectory));
  const renderer = new Resvg(svg, {
    fitTo: { mode: 'width', value: 1200 },
    background: '#121212',
  });
  const output = file.replace(/\.svg$/, '.png');
  await writeFile(new URL(output, ogDirectory), renderer.render().asPng());
}));

console.log(`Generated ${files.length} PNG social images in ${join(ogDirectory.pathname, '')}`);
