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
- **Config**: `hugo.toml` - single config file (not split config). Multi-language is configured but only English is active.
- **Content types**: Two main sections - `content/posts/` (blog posts) and `content/collections/` (curated resource collections). Standalone pages: `about.md`, `links.md`. Tags taxonomy is enabled; categories are disabled.
- **Layout overrides** (divergences from theme):
  - `layouts/partials/comments.html` - Giscus comment system (GitHub Discussions-backed), with theme-sync logic to match light/dark mode
  - `layouts/partials/analytics.html` - Umami analytics integration (configured via `params.umami` in hugo.toml)
  - `layouts/partials/mathjax.html` and `assets/js/mathjax-assistant.js` - MathJax support
  - `layouts/partials/seo.html` - SEO meta tags
  - `layouts/shortcodes/align.html` - Custom alignment shortcode
  - `layouts/posts/list.html` and `layouts/collections/list.html` - Custom list templates
- **Custom styles**: `assets/scss/userstyles.scss` overrides theme styles
- **Post frontmatter** uses TOML (`+++`) or YAML (`---`) interchangeably. Common fields: `title`, `date`, `draft`, `description`, `tags`, `toc`, `pin`, `mathjax`, `images`.
- `public/` and `resources/` are gitignored (build artifacts).

## Content Conventions

- Posts may use `|` in filenames to denote series (e.g., `Trips|North of Xinjiang 7.1-7.3.md`)
- Pinned posts use `pin: true` in frontmatter
- The `draft: true` flag prevents posts from appearing in production builds
- Images are hosted externally (GitHub raw / picsum), not stored in the repo
