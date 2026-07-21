'use client';

import { useState, useCallback } from 'react';
import { sanitizeHTML } from '@/lib/utils/sanitize';
import styles from './FAQSection.module.css';

export type FAQItem = {
  id?: string;
  question: string;
  answer: string;
};

export type FAQSectionProps = {
  title?: string;
  /** FAQ items from CMS/data only — no hardcoded Q&A; section shows only what is in this array */
  items?: FAQItem[];
  id?: string;
  className?: string;

  // Dynamic props from CMS faqSection
  enableFaqSection?: boolean;
  faqSectionHeading?: string;
  faqItems?:
  | any[]
  | {
    nodes?: Array<{
      id: string;
      title: string;
      content: string;
    }>;
  };
};

export default function FAQSection(props: FAQSectionProps) {
  const {
    title,
    items = [],
    id,
    className,
    enableFaqSection,
    faqSectionHeading,
    faqItems
  } = props;

  const [openIndex, setOpenIndex] = useState<number>(0);

  // Resolve dynamic content
  const finalTitle = faqSectionHeading || title;
  const finalItems = Array.isArray(faqItems)
    ? faqItems.map((item: any) => ({
      id: item.id,
      question: item.question,
      answer: item.answer,
    }))
    : faqItems?.nodes
      ? faqItems.nodes.map((node) => ({
        id: node.id,
        question: node.title,
        answer: node.content,
      }))
      : items;

  const hasTitle = !!finalTitle;
  const validItems = finalItems.filter((i) => i?.question?.trim());

  const toggle = useCallback(
    (index: number) => setOpenIndex((prev) => (prev === index ? prev : index)),
    [],
  );

  if (enableFaqSection === false) return null;
  if (validItems.length === 0) return null;

  return (
    <section className={`${styles.faqSection} ${className || ''}`} aria-labelledby="faq-heading" id={id}>
      <div className="container">
        {hasTitle && (
          <div className={styles.faqHeader}>
            <h2
              id="faq-heading"
              className="sectionTitle"
              dangerouslySetInnerHTML={{
                __html: finalTitle
                  ? finalTitle.replace(/<span>/gi, `<span class="${styles.faqTitleHighlight}">`)
                  : '',
              }}
            />
          </div>
        )}

        {validItems.length > 0 && (
          <div className={styles.faqList} role="list">
            {validItems.map((item, index) => {
              const isOpen = openIndex === index;
              return (
                <div key={item.id ?? `faq-${index}`} className={styles.faqItem} role="listitem">
                  <button
                    type="button"
                    className={`${styles.faqItemButton} ${isOpen ? styles.activePadding : ''}`}
                    onClick={() => toggle(index)}
                    aria-expanded={isOpen}
                    aria-controls={`faq-answer-${index}`}
                    id={`faq-question-${index}`}
                  >
                    <h3 className={styles.faqQuestion}>{item.question}</h3>
                    <svg
                      className={styles.faqIcon}
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden
                    >
                      {isOpen ? (
                        /* Minus — horizontal line */
                        <path
                          d="M5 12h14"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                        />
                      ) : (
                        /* Plus — vertical + horizontal */
                        <path
                          d="M12 5v14M5 12h14"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                        />
                      )}
                    </svg>
                  </button>

                  <div
                    id={`faq-answer-${index}`}
                    role="region"
                    aria-labelledby={`faq-question-${index}`}
                    className={`${styles.faqAnswerWrap} ${isOpen ? styles.faqAnswerWrapOpen : ''}`}
                  >
                    <div className={styles.faqAnswerInner}>
                      <div className={styles.faqAnswer} dangerouslySetInnerHTML={{ __html: sanitizeHTML(item.answer ?? '') }} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
