/**
 * Canonical schema.org names per page path (SEO templates).
 * Prefer these over CMS hero headings, which are often long marketing titles.
 */
export const SCHEMA_PAGE_NAMES: Record<string, string> = {
  'tech-stack/hardware/itus-max': 'ITUS Max',
  'tech-stack/hardware/itus-autoscan': 'ITUS Autoscan',
  'tech-stack/software/oxred-myfleet': 'OXRED MyFleet',
  'tech-stack/software/oxred-autocert': 'OXRED AutoCert',
  'tech-stack/software/oxred-lens': 'OXRED Lens',
  'tech-stack/ai-solution/guardian-ai': 'OXRED GuardianAI',
  'tech-stack/ai-solution/ask-ox': 'Ask OX',
  'customer/oem': 'OEM',
  'customer/fleet-management': 'Fleet Management',
};

export function resolveSchemaPageName(path: string, fallback?: string): string {
  const key = path.replace(/^\//, '');
  const mapped = SCHEMA_PAGE_NAMES[key];
  if (mapped) return mapped;
  const trimmed = fallback?.trim();
  return trimmed || '';
}
