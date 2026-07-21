import type { CSSProperties } from 'react';
import Link from '@/components/ui/Link/Link';
import styles from './ContactStripSection.module.css';
import ScrollReveal from '@/components/ui/ScrollReveal/ScrollReveal';

type ContactStripSectionProps = {
  title?: string;
  titleHighlight?: string;
  description?: string;
  /** CTA buttons from CMS: text and url. First = primary, second = secondary style when two. */
  ctas?: Array<{ text?: string; url?: string }>;
  /** Background image URL from CMS (no static fallback). */
  backgroundImageUrl?: string;
  id?: string;
  className?: string;

  // New dynamic props from CMS prefooterCtaBannerSection
  prefooterCtaBannerHeading?: string;
  prefooterCtaBannerDescription?: string;
  prefooterCtaBackgroundImage?: {
    node?: {
      mediaItemUrl?: string;
    }
  };
  prefooterBannerCtaButtons?: Array<{
    buttonStyle?: string[];
    buttonText?: string;
    buttonUrl?: {
      target?: string;
      url?: string;
    } | null;
  }>;
};

/**
 * Renders only what is provided from CMS — no hardcoded copy.
 * Background image only when backgroundImageUrl from CMS/mock; otherwise no background image.
 */
export default function ContactStripSection(props: ContactStripSectionProps) {
  const {
    title,
    titleHighlight,
    description,
    ctas,
    backgroundImageUrl,
    prefooterCtaBannerHeading,
    prefooterCtaBannerDescription,
    prefooterCtaBackgroundImage,
    prefooterBannerCtaButtons,
    id,
    className
  } = props;

  // Resolve dynamic content
  const finalTitle = (prefooterCtaBannerHeading || title || '').replaceAll('sapn', 'span');
  const finalDescription = (prefooterCtaBannerDescription || description || '').replaceAll('sapn', 'span');
  const finalBgUrl = prefooterCtaBackgroundImage?.node?.mediaItemUrl || backgroundImageUrl;
  const finalCtas = prefooterBannerCtaButtons
    ? prefooterBannerCtaButtons.map(cta => ({
      text: cta.buttonText,
      url: cta.buttonUrl?.url || '#'
    }))
    : ctas;

  const titleHtml =
    !finalTitle ? '' : (titleHighlight && !finalTitle.includes('<span>'))
      ? (finalTitle.toLowerCase().includes(titleHighlight.toLowerCase())
        ? finalTitle.replace(new RegExp(`(${titleHighlight.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi'), `<span>$1</span>`)
        : `${finalTitle} <span>${titleHighlight}</span>`)
      : finalTitle;

  const validCtas = finalCtas?.filter((c) => c?.text && c?.url) ?? [];
  const hasContent = finalTitle || finalDescription || validCtas.length > 0;

  if (!hasContent) return null;

  const sectionStyle: CSSProperties =
    finalBgUrl != null && finalBgUrl !== ''
      ? {
        backgroundImage: `url(${finalBgUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }
      : {};

  return (
    <section className={`${styles.contactStripContainer} ${className || ''}`} style={sectionStyle} id={id}>
      <div className="container">
        <div className={styles.contactStripContent}>
          {finalTitle && (
            <ScrollReveal delay={0.1}>
              <h2 className={`sectionTitle`} dangerouslySetInnerHTML={{ __html: titleHtml }} />
            </ScrollReveal>
          )}
          {finalDescription && (
            <ScrollReveal delay={0.2}>
              <p className={`sectionDescription ${styles.description || ''}`} dangerouslySetInnerHTML={{ __html: finalDescription }} />
            </ScrollReveal>
          )}
          {validCtas.length > 0 && (
            <ScrollReveal delay={0.3}>
              <div className={styles.cta}>
                {validCtas.map((cta, i) => (
                  <Link
                    key={i}
                    className={i === 0 ? 'primaryCta' : 'secondaryCta'}
                    href={cta.url!}
                  >
                    {cta.text}
                    {
                      i === 0 ? (<i className={`fa-kit fa-right-arrow icon`}></i>) : (
                        (<i className={`fa-kit fa-right-arrow icon`}></i>)
                      )
                    }
                  </Link>
                ))}
              </div>
            </ScrollReveal>
          )}
        </div>
      </div>
    </section>
  );
}

