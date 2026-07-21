# Routing and locale behaviour

## How URLs map to files

- **All pages** live under `[locale]`: `app/(pages)/[locale]/page.tsx`, `.../intelligence-infrastructure/page.tsx`, `.../blog/[[...slug]]/page.tsx`.
- So the **only** routes that exist are: `/:locale`, `/:locale/intelligence-infrastructure`, `/:locale/blog`, `/:locale/blog/...`.
- There is **no** route for `/` or `/intelligence-infrastructure` by themselves; the first segment must be a locale (e.g. `en`).

## Default locale (no segment in the URL)

- **Default locale** (e.g. `en`) must **not** appear in the URL: use `/` and `/intelligence-infrastructure`, not `/en` or `/en/intelligence-infrastructure`.
- **Proxy** (`proxy.ts`): rewrites `/` → `/en` and `/intelligence-infrastructure` → `/en/intelligence-infrastructure` (and similar for other path-only URLs) so that the `[locale]` route receives `locale === 'en'` while the browser URL stays without `en`.
- **next.config rewrites**: same rewrites are defined as a fallback (/, /intelligence-infrastructure, /blog, /blog/:path*) so that if the proxy does not run, these paths still resolve.
- **Redirect**: the proxy redirects `/en` and `/en/*` to `/` and `/*` so the default locale is never visible in the address bar.

## Other locales

- **Other locales** keep the prefix: `/fr`, `/fr/intelligence-infrastructure`, `/fr/blog`, etc.
- The proxy does not rewrite these; it passes them through so `[locale]` is e.g. `fr`.

## Locale config

- **Default/supported locales** come from env: `DEFAULT_LOCALE`, `SUPPORTED_LOCALES` (used by `lib/config/locales.ts` and the proxy).
- Layout uses `generateStaticParams` (from CMS `getLocales()` or env fallback) and `dynamicParams = true` so any locale is accepted at runtime.

## If you see 404

1. **Restart dev server** after changing `proxy.ts` or `next.config.ts`.
2. **Check** that you are opening `/` or `/intelligence-infrastructure` (no `/en` in the URL).
3. **Check** that `DEFAULT_LOCALE` / `SUPPORTED_LOCALES` include `en` (or your default) when not using CMS.
