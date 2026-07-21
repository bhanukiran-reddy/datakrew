/**
 * Recursively extracts all text content from an object or array.
 * Useful for building a search index from complex CMS response shapes.
 */
export function extractTextDeep(obj: any): string {
  if (!obj) return '';
  if (typeof obj === 'string') return obj;
  if (typeof obj === 'number') return obj.toString();
  if (Array.isArray(obj)) {
    return obj.map(extractTextDeep).join(' ');
  }
  if (typeof obj === 'object') {
    return Object.values(obj).map(extractTextDeep).join(' ');
  }
  return '';
}
