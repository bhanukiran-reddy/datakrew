# Datakrew Headless Frontend

Headless Next.js frontend connected to a WordPress GraphQL CMS. Copy, media, and SEO fields come from the backend; the frontend owns routes, layout, and section UI.

## Stack

- **Next.js** App Router (RSC) + ISR (`revalidate` on most pages)
- **Apollo Client** for GraphQL (`lib/graphql/`)
- **CSS Modules** + CSS variables (no runtime CSS-in-JS)
- **i18n** via `[locale]` routes; default locale has no URL prefix (`proxy.ts`)
- **SEO**: metadata, OpenGraph, JSON-LD, sitemap, robots (`lib/seo/`)
- **Icons**: Font Awesome kit (CDN in root layout); prefer inline SVG for player/chrome icons when the kit does not include them

## Project layout

| Path | Role |
|------|------|
| [`app/`](app/README.md) | Routes, layouts, API handlers, sitemap, robots |
| [`components/`](components/README.md) | `ui/` atoms, `sections/` blocks, `layout/` shell |
| `lib/` | GraphQL queries, SEO, i18n, config, env, utils |
| `public/` | Static assets |
| `styles/` | Shared/global styles |
| `proxy.ts` | Default-locale URL rewrite / redirect |

Locale pages live under `app/(pages)/[locale]/…` (one `page.tsx` per route). See [`app/(pages)/ROUTING.md`](app/(pages)/ROUTING.md).

Sections: shared blocks in `components/sections/reusable/`; page-specific ones under `components/sections/Pages/`.

## Getting started

1. `npm install`
2. Copy [`.env.example`](.env.example) to `.env.development` or `.env.local` and fill in values (GraphQL endpoint, site URL, secrets, etc.).
3. `npm run dev`
4. `npm run build` / `npm run prod` (build + start)
5. Release: `npm run release` (release-it + CHANGELOG)

Useful scripts: `npm run lint`, `npm run codegen` (GraphQL types).

## Conventions

- **Components**: `Name/Name.tsx` + `Name.module.css`. Import the file: `@/components/ui/Button/Button`. Skip one-line `index.ts` barrels; keep a barrel only when a folder exports several public symbols (e.g. `Header/`, `lib/seo/`).
- **Lib**: camelCase files (`getHomePage.ts`, `buildMetadata.ts`).
- **Routes**: kebab-case segments; `(pages)` / `(landing)` are route groups and do not appear in the URL.
- **Path alias**: `@/*` → repo root (`tsconfig.json`). No short `@ComponentName` aliases.

## Production notes

- Security headers and CSP in `next.config.ts` (CookieYes, Font Awesome kit, analytics, etc.).
- Image optimization: remotePatterns, AVIF/WebP.
- CI: lint, typecheck, build. No automated test suite by design.
