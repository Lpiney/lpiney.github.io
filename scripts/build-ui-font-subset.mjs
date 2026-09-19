#!/usr/bin/env node
/**
 * Regenerates the MiSans interface subset used by src/styles/global.css.
 *
 * The interface only needs the characters that appear in templates, project cards,
 * and post front matter, so the subset stays around 100 KB instead of 19 MB.
 *
 * Requirements: python3 with fontTools and brotli (`pip install fonttools brotli`).
 * Run with: npm run build:ui-font
 */
import { execFileSync } from 'node:child_process';
import { mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const cacheDir = join(root, '.cache');
const sourceUrl = 'https://cdn.jsdelivr.net/npm/@fontpkg/mi-sans-vf@4.3.0/MiSans%20VF.ttf';
const sourceTtf = join(cacheDir, 'MiSansVF.ttf');
const instanceTtf = join(cacheDir, 'MiSans-ui-var.ttf');
const charsetFile = join(cacheDir, 'ui-charset.txt');
const outputFile = join(root, 'src/assets/fonts/misans-ui-subset.woff2');

const safetyCharacters = [
  '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',
  ' .,:;!?()[]{}<>/\\|-_=+*&%$#@~^`\'"…—–·、。，；：！？（）【】《》「」『』“”‘’％＆＋－×÷←→↑↓✦✧∞♊◎',
].join('');

const walk = (directory) =>
  readdirSync(directory).flatMap((entry) => {
    const path = join(directory, entry);
    return statSync(path).isDirectory() ? walk(path) : [path];
  });

const collectCharacters = () => {
  const characters = new Set(safetyCharacters);
  const add = (text) => [...text].forEach((character) => characters.add(character));

  walk(join(root, 'src'))
    .filter((path) => path.endsWith('.astro') || path.endsWith('.ts'))
    .forEach((path) => add(readFileSync(path, 'utf8')));

  walk(join(root, 'content', 'projects'))
    .filter((path) => path.endsWith('.md'))
    .forEach((path) => add(readFileSync(path, 'utf8')));

  walk(join(root, 'content', 'posts'))
    .filter((path) => path.endsWith('.md'))
    .forEach((path) => add(/^---\n([\s\S]*?)\n---/.exec(readFileSync(path, 'utf8'))?.[1] ?? ''));

  return [...characters].sort().join('');
};

mkdirSync(join(root, 'src', 'assets', 'fonts'), { recursive: true });
mkdirSync(cacheDir, { recursive: true });

if (!statSync(sourceTtf, { throwIfNoEntry: false })) {
  console.log(`Downloading MiSans VF from ${sourceUrl}`);
  const response = await fetch(sourceUrl);
  if (!response.ok) throw new Error(`Download failed: ${response.status}`);
  writeFileSync(sourceTtf, Buffer.from(await response.arrayBuffer()));
}

const charset = collectCharacters();
writeFileSync(charsetFile, charset);
console.log(`Interface charset: ${charset.length} characters`);

execFileSync('fonttools', ['varLib.instancer', '-q', '-o', instanceTtf, sourceTtf, 'wght=400:700'], {
  stdio: 'inherit',
});
execFileSync(
  'pyftsubset',
  [
    instanceTtf,
    `--text-file=${charsetFile}`,
    '--flavor=woff2',
    `--output-file=${outputFile}`,
    '--layout-features=*',
    '--no-hinting',
  ],
  { stdio: 'inherit' },
);

console.log(`Wrote ${outputFile} (${(statSync(outputFile).size / 1024).toFixed(1)} KB)`);
