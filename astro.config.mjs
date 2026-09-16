import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

const repository = process.env.GITHUB_REPOSITORY?.split('/')[1] ?? '';
const owner = process.env.GITHUB_REPOSITORY_OWNER ?? '';
const isUserSite = Boolean(owner) && repository.toLowerCase() === `${owner}.github.io`.toLowerCase();
const base = process.env.GITHUB_ACTIONS === 'true' && repository && !isUserSite ? `/${repository}` : '/';
const site = process.env.SITE_URL ?? (owner ? `https://${owner.toLowerCase()}.github.io` : 'http://localhost:4321');

export default defineConfig({
  site,
  base,
  output: 'static',
  integrations: [mdx(), sitemap()],
});
