import React from 'react';

/**
 * Parses a title string containing <span> and <br /> tags and returns React elements.
 * This allows us to handle highlighting and line breaks from the CMS without using
 * dangerouslySetInnerHTML for simple titles.
 *
 * @param title The title string potentially containing <span> and <br /> tags
 * @param highlightClass Optional CSS class to apply to text within <span> tags
 */
export function formatTitle(title: string, highlightClass?: string): React.ReactNode {
    if (!title) return null;

    // Split by <span>...</span> and <br /> tags
    // The regex captures these tags so they remain in the parts array
    const parts = title.split(/(<span[^>]*>.*?<\/span>|<br\s*\/?>)/gi);

    return parts.map((part, index) => {
        if (!part) return null;

        // Handle <br /> tags
        if (part.toLowerCase().startsWith('<br')) {
            return <br key={`br-${index}`} />;
        }

        // Handle <span> tags
        if (part.toLowerCase().startsWith('<span')) {
            // Extract content inside <span>...</span>
            const content = part.replace(/<span[^>]*>(.*?)<\/span>/gi, '$1');

            // We also handle potential <br /> inside the span
            return (
                <span key={`span-${index}`} className={highlightClass}>
                    {content.split(/(<br\s*\/?>)/gi).map((subPart, subIndex) =>
                        subPart.toLowerCase().startsWith('<br')
                            ? <br key={`span-br-${subIndex}`} />
                            : subPart
                    )}
                </span>
            );
        }

        // Regular text
        return part;
    });
}
