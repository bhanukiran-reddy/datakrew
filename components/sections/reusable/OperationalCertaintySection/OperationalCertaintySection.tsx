import type { ReactNode } from 'react';
import Link from '@/components/ui/Link/Link';
import FeatureCard from '@/components/ui/FeatureCard/FeatureCard';
import styles from './OperationalCertaintySection.module.css';

export type OperationalCertaintyCard = {
  iconName?: string;
  iconClass?: string;
  iconImage?: string; // ✅ NEW FIELD
  iconAlt?: string; // ✅ Alt text for iconImage
  icon?: ReactNode;
  title: string;
  description: string;
};

export type OperationalCertaintySectionProps = {
  title?: string;
  titleHighlight?: string;
  description?: string;
  cards?: OperationalCertaintyCard[];
  ctaText?: string;
  ctaHref?: string;
  className?: string;
  align?: 'left' | 'center'; //NEW PROP (optional)
  showTint?: boolean;
};

export default function OperationalCertaintySection(props: OperationalCertaintySectionProps) {
  const {
    title,
    titleHighlight,
    description,
    cards,
    ctaText,
    ctaHref,
    className,
    align = 'left', //default keeps old layout
    showTint = true,
  } = props;

  const hasText = title || titleHighlight || description;
  const validCards = cards?.filter((c) => c.title || c.description) ?? [];

  if (!hasText && validCards.length === 0) return null;

  return (
    <section
      className={`${styles.operationalCertaintySection} ${!showTint ? styles.hideTint : ''} ${className || ''}`}
      aria-labelledby="operational-certainty-heading"
    >
      <div className="container">
        <div className={styles.operationalCertaintyContainer}>
          {hasText && (
            <div className={`${styles.operationalCertaintyHeader} ${align === 'center' ? styles.centerAlign : ''}`}>
              {(title || titleHighlight) && (
                <h2
                  id="operational-certainty-heading"
                  className={`sectionTitle ${styles.operationalCertaintyTitle}`}
                  dangerouslySetInnerHTML={{
                    __html:
                      (title ? `${title} ` : '') +
                      (titleHighlight ? `<span>${titleHighlight}</span>` : ''),
                  }}
                />
              )}

              {description && (
                <p 
                  className={`sectionDescription ${styles.operationalCertaintyDescription}`}
                  dangerouslySetInnerHTML={{ __html: description }}
                />
              )}
            </div>
          )}

          {validCards.length > 0 && (
            <div className={styles.operationalCertaintyGrid}>
              {validCards.map((card, index) => (
                <div key={card.title || index}>
                  <FeatureCard
                    icon={
                      card.icon ??
                      (card.iconImage ? (
                        <img src={card.iconImage} alt={card.iconAlt || card.title} style={{ width: '32px', height: '32px' }} />
                      ) : card.iconClass ? (
                        <i className={`${card.iconClass} ${styles.gradientIcon}`} style={{ fontSize: '32px' }} />
                      ) : undefined)
                    }
                    title={card.title}
                    description={card.description}
                  />
                </div>
              ))}
            </div>
          )}

          {ctaText && ctaHref && (
            <div className={styles.operationalCertaintyCtaWrap}>
              <Link href={ctaHref} className={`primaryCta ${styles.operationalCertaintyCta}`}>
                {ctaText}
                <i className="icon fa-kit fa-right-arrow"></i>
              </Link>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
