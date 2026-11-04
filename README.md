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
| Output | Static export (`output: 'export'`) - no server, hosted on Vercel |
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
public/                   Static assets, CV, /3D demo
apps/                     Standalone apps served on this domain (no shared code)
  millionaire/            /millionaire/ - Arabic trivia game (PWA)
  nagham/                 /nagham/      - Arabic music player (PWA)
scripts/sync-apps.mjs     Copies apps/<name> to public/<name> before dev/build
api/                      Vercel Functions entry points (re-export apps/nagham/api/*)
```

## Standalone apps

Each folder in `apps/` is a self-contained static app with its own HTML, JS, service worker and manifest. It shares nothing with the portfolio code and still runs on its own (`python -m http.server` inside the folder). Before `npm run dev` and `npm run build`, `scripts/sync-apps.mjs` copies each app into `public/<name>/` (gitignored), so it is deployed with the portfolio at `youssefrajeh.com/<name>/`. READMEs, `tools/` and `api/` are not published as static files.

Nagham's server functions live in `apps/nagham/api/`. Vercel only deploys functions from the repository's root `api/` folder, so `api/radio.mjs` and `api/youtube.mjs` re-export them at `/api/radio` and `/api/youtube`. `/api/youtube` needs the `YT_KEY` environment variable (a YouTube Data API key) in the Vercel project. The functions don't run under `npm run dev`. Use `vercel dev` to test them locally.

To add another app: put it in `apps/<name>/` using only relative paths, add `<name>` to `APPS` in the sync script, and add `/public/<name>/` to `.gitignore`.

## Editing content

All content lives in `src/data` and is rendered by **both** editions:

- `projectsData.ts` - projects (a new entry automatically gets a `/project/<id>` page, a sitemap entry and a file in the retro Explorer). `image` is optional; projects without a screenshot get a title card. `demo` adds a "Live demo" link; `featured: true` lists the project first with a Featured label.
- `experienceData.ts`, `educationData.ts`, `skillsData.ts` - experience, education (from the CV) and skills.
- `dataStructuresMeta.ts` - copy for the data structures reference.
- `src/lib/site.ts` - contact details, CV path, Formspree endpoint, site URL.
- Accent colour and theme tokens live at the top of `src/styles/globals.css`.
- `src/app/opengraph-image.png` is the link-preview card shown when the site is shared.

## Design notes

- **Two global stylesheets, never in one document.** The modern site and the retro desktop each own a global stylesheet via their own layout. Navigation between them is a plain `<a>` (full page load) rather than `<Link>`, so neither stylesheet leaks into the other. Tailwind only scans `components/retro`, so its utilities can never collide with the modern site's class names.
- **Retro desktop renders client-only** (`next/dynamic` with `ssr: false`): its initial layout depends on the viewport, so pre-rendering would only cause a hydration mismatch.
- **Static by design.** API routes, rewrites, middleware and runtime image optimisation are unavailable under `output: 'export'`; `trailingSlash: true` emits `route/index.html` so any static host resolves URLs without rewrite rules.

## Deployment

The site is hosted on **Vercel**. `vercel.json` sets no framework preset, so Vercel runs `npm run build`, serves the static export in `./out` and deploys the functions in `api/`. Pushing to `main` deploys to production at `youssefrajeh.com`, and pull requests get preview URLs. `.github/workflows/ci.yml` runs typecheck, lint and build on every push and PR. It doesn't deploy.

The custom domain `youssefrajeh.com` (and `www`) is set under the Vercel project's **Settings → Domains**, with DNS records pointing to Vercel.
