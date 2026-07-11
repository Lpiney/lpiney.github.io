# Bruce Log

A bilingual, static personal blog built with Astro and Tailwind CSS.

## Content

- Add posts in `content/posts/` as Markdown files with front matter.
- Edit bilingual profile text in `content/pages/about.zh.md` and `content/pages/about.en.md`.
- Post bodies can include `.lang-zh` and `.lang-en` blocks; the navigation toggle selects the visible language.

## Local development

```sh
npm install
npm run dev
npm run build
```

## Comments

To enable Giscus, copy `.env.example` to `.env` and fill in the repository and category IDs from [giscus.app](https://giscus.app). The comment section is intentionally hidden until all required values are set.

## Deployment

Pushing to `main` runs `.github/workflows/deploy.yml`, which builds and publishes the static output through GitHub Pages. In the repository settings, set **Pages → Build and deployment → Source** to **GitHub Actions**. This repository publishes at `https://lpiney.github.io/Bruce.github.io/`; the Astro config adds that project path automatically during GitHub Actions builds.
