/**
 * Re-export from utils for a single lib/seo entry point.
 * SEO helpers: buildMetadata, buildTitle, buildAlternates.
 */

export { buildMetadata, buildTitle } from '@/lib/utils/metadata';
export { buildAlternates, buildSelfReferencingHreflang } from './alternates';
