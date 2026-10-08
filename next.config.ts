import type { NextConfig } from 'next';

// Fully static site: `next build` writes plain HTML/CSS/JS to ./out, which is
// deployed to GitHub Pages (see .github/workflows/deploy.yml). There is no
// server runtime, so API routes, rewrites, middleware and on-demand image
// optimization are unavailable by design.
const nextConfig: NextConfig = {
  output: 'export',
  // Sub-path when served from youssefrajeh.github.io/Portfolio; empty on a
  // custom domain. Provided by the deploy workflow (see src/lib/site.ts).
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || undefined,
  // Emit /portfolio/index.html instead of /portfolio.html so every route is a
  // directory - static hosts resolve these without any rewrite rules. This
  // also makes /3D/ (plain static app in public/3D) resolve to its index.html.
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
