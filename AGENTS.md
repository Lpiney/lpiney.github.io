# Repository Guidelines

## Project Structure & Module Organization

This repository is currently a minimal GitHub Pages project scaffold. The only tracked project file is `spec.md`, reserved for requirements and planning notes. Add site source at the repository root unless a future framework introduces a conventional directory such as `src/`. Keep static files in an `assets/` directory, grouped by type when the collection grows (for example, `assets/images/` and `assets/styles/`).

Do not commit generated site output, editor metadata, dependency caches, or local secrets. Update this guide when tooling or a source layout is introduced.

## Build, Test, and Development Commands

No build system, package manifest, or automated test suite is configured yet. For now, verify Markdown and static-site edits by reviewing the changed files and using the GitHub Pages preview/deployment workflow when it is enabled.

Useful repository checks:

```sh
git status                 # inspect intended changes
git diff --check           # detect whitespace errors
rg --files                 # list tracked project files
```

If adding a framework, include its install, local-server, build, lint, and test commands in its README or `package.json` scripts, then update this section.

## Coding Style & Naming Conventions

Use clear, descriptive lowercase filenames with hyphens, such as `about-page.md` or `site-header.css`. Prefer two spaces for HTML, CSS, YAML, and JavaScript indentation unless the chosen formatter specifies otherwise. Keep Markdown headings sequential and use fenced code blocks with a language label. Avoid introducing a formatter or linter without documenting how contributors run it.

## Testing Guidelines

There is no test framework or coverage target. Before committing, check that links and asset paths resolve, render changed Markdown, and run `git diff --check`. Add focused tests alongside any interactive JavaScript or build configuration introduced later; name tests after the behavior they cover.

## Commit & Pull Request Guidelines

The repository has no commit history yet, so no established convention exists. Use concise imperative commit subjects, for example `Add home page layout` or `Document local preview`. Keep commits focused.

Pull requests should explain the user-visible change, link relevant issues or specifications, and include screenshots for visual changes. Note any validation performed and any follow-up configuration needed for GitHub Pages.
