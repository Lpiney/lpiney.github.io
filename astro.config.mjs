import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

const repository = process.env.GITHUB_REPOSITORY?.split('/')[1] ?? 'Bruce.github.io';
const owner = process.env.GITHUB_REPOSITORY_OWNER;
const isUserSite = owner && repository.toLowerCase() === `${owner}.github.io`.toLowerCase();
const base = process.env.GITHUB_ACTIONS === 'true' && !isUserSite ? `/${repository}` : '/';

export default defineConfig({
  site: 'https://lpiney.github.io',
  base,
  output: 'static',
  integrations: [mdx(), sitemap()],
  vite: { plugins: [tailwindcss()] },
});
