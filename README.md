# Bruce Log

A bilingual, static personal blog built with Astro.

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

Giscus powers the comment sections. Identifiers are never hardcoded; copy `.env.example` to `.env` (gitignored) and fill in:

| Variable | Purpose |
| --- | --- |
| `PUBLIC_GISCUS_REPO` | Repository in `owner/name` form |
| `PUBLIC_GISCUS_REPO_ID` | Repository node ID from [giscus.app](https://giscus.app) |
| `PUBLIC_GISCUS_CATEGORY` | Discussion category name (defaults to `Announcements`) |
| `PUBLIC_GISCUS_CATEGORY_ID` | Discussion category node ID from [giscus.app](https://giscus.app) |

The comment section is intentionally hidden until `PUBLIC_GISCUS_REPO`, `PUBLIC_GISCUS_REPO_ID`, and `PUBLIC_GISCUS_CATEGORY_ID` are all set.

For deployments, add the same four names as **repository variables** under *Settings → Secrets and variables → Actions → Variables*; the deploy workflow passes them to the build. Without them, the deployed site simply renders no comment section.

## Configuration

- `SITE_URL` optionally overrides the canonical origin used for canonical URLs, the sitemap, RSS, and `robots.txt`. On GitHub Actions it defaults to `https://<owner>.github.io`, and to `http://localhost:4321` locally, so no account name is hardcoded in the repository.
- `robots.txt` is generated at build time from `SITE_URL`/the derived origin, so it stays in sync with the deployment target.
- Content that identifies a person (contact address, social accounts, school, full name) should stay out of the repository; publish only the details you are comfortable sharing.

## Deployment

Pushing to `master` runs `.github/workflows/deploy.yml`, which builds and publishes the static output through GitHub Pages. In the repository settings, set **Pages → Build and deployment → Source** to **GitHub Actions**. A repository named `<owner>.github.io` is served from `https://<owner>.github.io/`; any other repository name is served from a `/<repository>/` subpath, which the build detects automatically.
