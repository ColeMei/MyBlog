# AGENTS.md

This file provides guidance to AI coding agents (Claude Code, Codex, and others) when working with code in this repository.

## Project Overview

Personal blog for Cole Mei at blog.colemei.com. Hugo static site using the hermit-v2 theme (included as a git submodule from ColeMei/hermit-V2). Deployed via Netlify. The blog has been active since ~2022 and contains posts in both English and Chinese.

## Build & Development Commands

```bash
hugo server -D          # Local dev server with drafts enabled (http://localhost:1313)
hugo server             # Local dev server without drafts
hugo                    # Build static site to public/
hugo new posts/NAME.md  # Create new post from archetype
hugo new collections/NAME.md  # Create new collection entry
```

Hugo must be installed locally (`brew install hugo` on macOS).

## Architecture

- **Theme**: hermit-v2 is a git submodule at `themes/hermit-v2/` (fork: ColeMei/hermit-V2). Theme overrides live in the project root's `layouts/` and `assets/` dirs, which take precedence over the theme.
- **Config**: `hugo.toml` - single config file (not split config). Multi-language is configured but only English is active; the `/en/` URL prefix has been dropped (`defaultContentLanguageInSubdir = false`).
- **Content types**: Two main sections - `content/posts/` (blog posts) and `content/collections/` (curated resource collections). Standalone pages: `about.md`, `links.md`. Tags and series taxonomies are enabled; categories are disabled.
- **Layout overrides** (divergences from theme):
  - `layouts/_partials/comments.html` - Giscus comment system (GitHub Discussions-backed), with self-healing theme-sync: the loader script's `data-theme` is refreshed on every switch (so the lazy iframe starts correct) and the theme is re-asserted once per message Giscus sends
  - `layouts/_partials/extra-head.html` + `assets/js/theme-toggle.js` - theme bootstrapping; overrides the fork's copies so `_userstyles.scss` is the single source of truth for toggle CSS. The toggle puts a ~400ms `theme-transitioning` class on `<html>` during a switch; the universal transition rule is scoped to it so all components fade in lockstep and nothing else is hijacked
  - `layouts/_partials/analytics.html` - Umami analytics integration (configured via `params.umami` in hugo.toml)
  - `layouts/_partials/mathjax.html` and `assets/js/mathjax-assistant.js` - MathJax support
  - `layouts/_partials/seo.html` - SEO meta tags
  - `layouts/_partials/posts_single_info.html` - compact one-line post meta (author · tag chips · description · word count) instead of the theme's stacked rows
  - `layouts/_partials/related-posts.html` - hairline "Related" card with title + date rows
  - `layouts/_partials/scroll-to-top.html` + `assets/js/scroll-progress.js` - scroll-up button wrapped in a conic-gradient ring that doubles as a reading-progress indicator
  - `layouts/home.html` - homepage with a "Recently" whisper block (3 latest posts) under the nav
  - `layouts/404.html` - custom 404 (jade accent, typewriter-style message, Back/Home ghost buttons)
  - `layouts/shortcodes/align.html` - Custom alignment shortcode
  - `layouts/posts/list.html` and `layouts/collections/list.html` - Custom list templates; collections renders as cards (serif title, `author`/`collectionType` byline, date)
  - `layouts/taxonomy.html` - term-index page (`/tags/`, `/series/`) extended to recognize the `series` taxonomy alongside `tags`/`categories`, with `data-weight` chip sizing by post count
- **Custom styles**: `assets/scss/userstyles.scss` overrides theme styles. The "DESIGN REFRESH" section holds the visual-polish pass (jade accent `oklch(72% 0.11 172)` via `--accent-jade`, CJK-aware font stack, hairline separators, framed code blocks, card-style extras); design tokens live in `:root` / `[data-theme="light"]` custom properties so light mode inherits every component automatically
- **Post frontmatter** uses TOML (`+++`) or YAML (`---`) interchangeably. Common fields: `title`, `date`, `draft`, `description`, `tags`, `toc`, `pin`, `mathjax`, `images`.
- `public/` and `resources/` are gitignored (build artifacts).

## Content Conventions

- Posts that belong to a series use `series: [Name]` in frontmatter (e.g. `series: [Trips]`, `series: ["My English Reading Flow"]`) instead of encoding the series in the filename. This drives the `/series/` and `/series/<name>/` taxonomy pages.
- Filenames are plain and human-readable (lowercase, hyphen-separated where practical) — avoid `|` or other characters that are illegal or awkward on Windows filesystems.
- `slug:` in frontmatter is the source of truth for a post's URL and is independent of the filename — renaming a file never changes its live URL as long as `slug:` is preserved.
- Collection entries may carry `author:` and `collectionType:` (e.g. `essay`, `speech`) in frontmatter — shown as the byline on the Collections cards. (`type:` is avoided because it is reserved by Hugo for layout lookup.)
- Pinned posts use `pin: true` in frontmatter
- The `draft: true` flag prevents posts from appearing in production builds
- Images are hosted externally (GitHub raw / picsum), not stored in the repo

## Theme updates

`themes/hermit-v2` is a git submodule pointing at `ColeMei/hermit-V2` (a fork of `1bl4z3r/hermit-V2`), pinned to the `main` branch. To pull in upstream changes:

1. In the fork (`ColeMei/hermit-V2`), add/update an `upstream` remote (`https://github.com/1bl4z3r/hermit-V2.git`) and merge `upstream/main` into the fork's `main`, resolving any conflicts there.
2. Push the updated fork `main`.
3. Back in this repo, bump the submodule pointer:
   ```bash
   git submodule update --remote themes/hermit-v2
   git -C themes/hermit-v2 log --oneline -5   # sanity-check what's being pulled in
   git add themes/hermit-v2
   git commit -m "Bump hermit-v2 submodule"
   ```
4. Keep the fork's diff from upstream as small as possible: prefer overriding theme templates, partials, and assets from this repo's root `layouts/`/`assets/` (which take precedence over the theme) instead of patching the fork directly. Only touch the fork when a change genuinely can't be expressed as a root override.
