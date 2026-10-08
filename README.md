# youssefrajeh.com

Personal portfolio of Youssef Rajeh, in two editions that share one codebase and one content source:

- **Modern site** (`/`, `/portfolio`, `/project/[id]`, `/data-structures`) - animated, themeable (light/dark), SEO-ready.
- **Retro desktop** (`/retro`) - the same portfolio as an interactive Windows 95 desktop: draggable windows, Explorer, WordPad, Outlook-style contact form, Minesweeper and Paint.
- **SQL 3D Odyssey** (`/3D`) - standalone static demo served from `public/3D`.

Live: https://youssefrajeh.com

## Stack

| Concern | Choice |
|---|---|
| Framework | Next.js 16 (App Router), React 19 |
| Language | TypeScript (strict) |
| Output | Static export (`output: 'export'`) - no server, hosted on GitHub Pages |
| Animation | `motion` (Framer Motion) with `LazyMotion` |
| Styling | Plain CSS for the modern site; Tailwind v4 scoped to the retro desktop |
| Fonts | `next/font` (self-hosted at build time) |
| Contact forms | Formspree (no backend) |

## Getting started

Requires Node 22+ (see `.nvmrc`).

```bash
npm install
npm run dev        # http://localhost:3000
npm run check      # typecheck + lint + production build
npm run build      # static site written to ./out
npm start          # serve ./out locally
```

## Project structure

```
src/
  app/
    layout.tsx            Root layout: <html>, metadata, JSON-LD, theme init script
    (site)/               Modern site (route group - owns globals.css)
      page.tsx            Landing hub
      portfolio/          Portfolio single page
      project/[id]/       Project case studies (pre-rendered per project)
      data-structures/    Interactive data structures reference
    retro/                Win95 desktop (owns retro.css: Tailwind + Win95 styles)
    sitemap.ts, robots.ts Generated from content at build time
  components/
    site/                 Modern site components
    retro/                Desktop shell, windows, apps; retro/sections = portfolio content windows
    data-structures/      Reference page, shared pieces, one widget per structure
  data/                   Single source of truth for all content (typed, see data/types.ts)
  lib/                    Site constants, fonts, theme context, hooks, motion variants
  styles/                 globals.css + site.css (modern), retro.css (retro)
public/                   Static assets, CV, /3D demo, CNAME
```

## Editing content

All content lives in `src/data` and is rendered by **both** editions:

- `projectsData.ts` - projects (a new entry automatically gets a `/project/<id>` page, a sitemap entry and a file in the retro Explorer). `image` is optional; projects without a screenshot get a title card.
- `experienceData.ts`, `skillsData.ts` - experience and skills.
- `dataStructuresMeta.ts` - copy for the data structures reference.
- `src/lib/site.ts` - contact details, CV path, Formspree endpoint, site URL.

## Design notes

- **Two global stylesheets, never in one document.** The modern site and the retro desktop each own a global stylesheet via their own layout. Navigation between them is a plain `<a>` (full page load) rather than `<Link>`, so neither stylesheet leaks into the other. Tailwind only scans `components/retro`, so its utilities can never collide with the modern site's class names.
- **Retro desktop renders client-only** (`next/dynamic` with `ssr: false`): its initial layout depends on the viewport, so pre-rendering would only cause a hydration mismatch.
- **Static by design.** API routes, rewrites, middleware and runtime image optimisation are unavailable under `output: 'export'`; `trailingSlash: true` emits `route/index.html` so any static host resolves URLs without rewrite rules.

## Deployment

Pushing to `main` runs `.github/workflows/deploy.yml`: typecheck, lint, build, then publish `./out` to GitHub Pages. Pull requests run the same checks without deploying.

One-time setup:

1. Repository **Settings → Pages → Source: GitHub Actions**.
2. Custom domain: `public/CNAME` contains `youssefrajeh.com`. At the DNS provider, point the apex `A` records to GitHub Pages (`185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`) and `www` as a `CNAME` to `<username>.github.io`, then enable **Enforce HTTPS**.
