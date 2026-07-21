# App Directory

This directory contains the application routes using the Next.js App Router.

## Routing Structure

- **`(pages)/[locale]/…`**: Locale-based pages (home, about, product, resources, etc.). Each route has its own `page.tsx`. See `app/(pages)/ROUTING.md`.
- **`api/`**: API Route Handlers (e.g. revalidate).
- Root `layout.tsx`, `not-found.tsx`, `sitemap.ts`, and `robots.ts` live beside the route groups.

## Key Files

- **layout.tsx**: The root layout (HTML, body, global providers).
- **page.tsx**: The entry point for a route.
- **not-found.tsx**: Custom 404 page.
- **error.tsx**: Global error boundary (where present).
