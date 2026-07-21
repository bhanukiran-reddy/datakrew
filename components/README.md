# Components (`components/`)

## What is it?
All React components, grouped by scope: UI atoms, CMS-driven sections, and layout shell.

## What goes here?

| Folder | Purpose |
|--------|---------|
| **`ui/`** | Atomic, reusable primitives (Button, Link, Image, Skeleton, etc.). Stateless and presentational. |
| **`sections/`** | Full-width page blocks (Hero, Stats, etc.). One directory per section. |
| **`layout/`** | Structural shell: Header, Footer, PageWrapper. Used in locale layout. |

Do **not** put route definitions, API logic, or data-fetching functions here; use `app/` and `lib/`.

## How to use it
- **UI**: Import and use in any component. Prefer composition over prop drilling.
- **Sections**: Add a new folder (e.g. `TestimonialsSection/`), implement the component, wire it in the page that needs it.
- **Layout**: Used in `app/(pages)/[locale]/layout.tsx`; receive nav, site name, languages from layout.

## Naming convention
- **Directories**: PascalCase (e.g. `Button/`, `StatsSection/`, `Header/`).
- **Files**: `ComponentName.tsx`, `ComponentName.module.css`.
- **Imports**: `@/components/.../ComponentName` (direct file). Use an `index.ts` barrel only when the folder exports multiple public symbols.

## Best practices
- Sections receive data from the page/CMS query; they do not fetch.
- Prefer Server Components; add `'use client'` only when needed (hooks, events, browser APIs).
- Shared sections live in `sections/reusable/`; page-only sections under `sections/Pages/`.
