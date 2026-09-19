# Repository Guidelines

## Project Structure

Bruce Log is an Astro 7 static blog deployed to GitHub Pages. Site source lives in `src/`; long-form content is Markdown in `content/`; static public files belong in `public/`.

- `src/pages/`: route entry points, including posts, archive, start, lab, and stats pages.
- `src/components/`: reusable Astro components such as navigation, cards, comments, and Steam profile.
- `src/layouts/`: shared document layout and metadata.
- `src/styles/global.css`: global visual system and responsive styles.
- `src/content.config.ts`: zod schemas for posts, pages, and projects.
- `content/posts/`, `content/pages/`, `content/projects/`: validated Markdown collections.
- `src/data/`: small structured datasets used by pages, such as curated external reading.
- `public/`: crawler-facing or static assets, such as `robots.txt` and diagrams.

Do not commit `dist/`, `node_modules/`, editor metadata, generated caches, or secrets. Keep external service identifiers configurable where practical; do not add API keys to the repository.

## Development and Verification

```sh
npm ci                 # install locked dependencies
npm run dev            # local development server
npm run build          # production build; runs before every commit
npx astro check        # Astro and TypeScript diagnostics
npm run preview        # serve the generated dist/ output locally
git diff --check       # whitespace validation
git status --short     # verify intended changes
```

The GitHub Actions deployment workflow builds `master` and publishes `dist/` to GitHub Pages. Validate both `npm run build` and `npx astro check` before submitting a site change.

## Style and Content Conventions

Use two-space indentation for Astro, TypeScript, CSS, and YAML. Prefer lowercase hyphenated filenames. Keep the existing visual direction: the dark starfield theme, restrained red accent, serif reading typography, and cosmic motifs used sparingly.

Posts use frontmatter validated by `src/content.config.ts`: `title`, optional `subtitle`, `date`, `author`, `tags`, optional `draft`, and `featured`. The schema is strict, so stray keys fail the build. The start page shows the three newest `featured: true` posts and throws if fewer than three exist.

Maintain the bilingual convention with `.lang-zh` and `.lang-en` blocks; visibility is controlled entirely by the `html[data-lang]` rules in `src/styles/global.css`, while the nav toggle only flips `data-lang` and stores it in localStorage. Inline UI labels use `.zh-only` / `.en-only`. Reading time and character counts are estimated per language in `src/utils/reading-time.ts`.

Tag pages are only generated for tags used by at least two posts (`src/utils/tags.ts`); single-post tags render as non-link chips. Use external links responsibly: link to the canonical source and do not reproduce copyrighted articles in full.

## Accessibility and SEO

Preserve the skip link, visible keyboard focus, reduced-motion support, semantic headings, useful image alt text, and bilingual labels when editing UI. Keep canonical URL, Open Graph, Twitter, JSON-LD, and sitemap behavior intact when working in `BaseLayout.astro`.

## Commit and Pull Request Guidance

Use concise imperative commit subjects, for example `Add curated reading card` or `Improve theme accessibility`. Keep commits focused. For visual changes, include a short validation note and screenshots when a pull request is used.
