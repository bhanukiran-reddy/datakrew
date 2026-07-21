/**
 * Extracts H2 headings from an HTML string and injects unique IDs into them.
 * Useful for building dynamic Table of Contents (TOC).
 * 
 * @param html The raw HTML string from CMS
 * @returns An object containing the modified HTML and the list of extracted TOC items.
 */
export function processHtmlForToc(html: string) {
  if (!html) return { processedHtml: '', tocItems: [] };

  const tocItems: { id: string; label: string; level: number }[] = [];
  
  // Use a regex to find all <h2> and <h3> tags
  // Regex explanation:
  // <h([23])(.*?)> : matches the opening h2 or h3 tag and captures the level and attributes
  // (.*?)          : captures the content of the heading
  // <\/h\1>        : matches the closing tag matching the captured level
  let count = 0;
  const processedHtml = html.replace(/<h([23])(.*?)>(.*?)<\/h\1>/gi, (match, levelChar, attributes, content) => {
    count++;
    
    const level = parseInt(levelChar, 10);
    // Create a clean ID from the content
    // Strip HTML tags if any exist inside the heading, then slugify
    const textOnly = content.replace(/<[^>]*>/g, '').trim();
    const id = `heading-${count}-${textOnly.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')}`;
    
    tocItems.push({ id, label: textOnly, level });
    
    // Reconstruct the tag with the new ID
    return `<h${levelChar} id="${id}"${attributes}>${content}</h${levelChar}>`;
  });

  return {
    processedHtml,
    tocItems
  };
}
