/**
 * HTML sanitization for rendering CMS rich-text content.
 * Uses isomorphic-dompurify (DOMPurify) — never parse or sanitize HTML with regex (XSS risk).
 */

import DOMPurify from 'isomorphic-dompurify';

/** Tags allowed in CMS rich-text output (DOMPurify allow-list). */
export const ALLOWED_TAGS = [
  'p', 'br', 'strong', 'em', 'b', 'i', 'u', 'a',
  'ul', 'ol', 'li',
  'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
  'blockquote', 'code', 'pre',
  'img', 'figure', 'figcaption',
  'table', 'thead', 'tbody', 'tr', 'th', 'td',
  'span', 'div', 'section',
];

/** Attributes allowed on elements. */
export const ALLOWED_ATTRS = [
  'href', 'target', 'rel', 'src', 'alt', 'width', 'height',
  'class', 'id', 'title',
];

/** Wrap mailto anchors so Cloudflare does not rewrite them to /cdn-cgi/l/email-protection. */
export function preventCloudflareEmailObfuscation(html: string): string {
  if (!html) return html;
  return html.replace(
    /<a\s+([^>]*href\s*=\s*["']mailto:[^"']+["'][^>]*)>([\s\S]*?)<\/a>/gi,
    '<!--email_off--><a $1>$2</a><!--/email_off-->'
  );
}

/** Skip Scrape Shield obfuscation for blocks that contain email addresses. */
export function wrapCloudflareEmailOff(html: string): string {
  if (!html || (!html.includes('@') && !/mailto:/i.test(html))) return html;
  return `<!--email_off-->${html}<!--/email_off-->`;
}

/**
 * Sanitize HTML from the CMS before rendering with dangerouslySetInnerHTML.
 * Uses DOMPurify to prevent XSS (scripts, event handlers, javascript: URLs, etc.).
 */
export function sanitizeHTML(html: string): string {
  if (typeof html !== 'string') return '';
  const cleaned = DOMPurify.sanitize(html, {
    ALLOWED_TAGS,
    ALLOWED_ATTR: ALLOWED_ATTRS,
    ADD_ATTR: ['target'], // allow target for external links
  });
  return wrapCloudflareEmailOff(preventCloudflareEmailObfuscation(cleaned));
}

/**
 * Strip all HTML tags from a string and clean up whitespace/entities.
 * Useful for breadcrumbs, aria-labels, and metadata where plain text is required.
 */
export function stripHtml(html: string): string {
  if (typeof html !== "string") return "";
  return html
    .replace(/<[^>]*>?/gm, "") // remove tags
    .replace(/&nbsp;/g, " ") // replace non-breaking space
    .replace(/\s+/g, " ") // normalize spacing
    .trim();
}
