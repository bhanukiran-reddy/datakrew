/** FeatureCard: Presentation component for highlight cards. */
import type { ReactNode } from 'react';
import styles from './FeatureCard.module.css';

export type FeatureCardProps = {
  /** Icon (e.g. inline SVG) — white/light for dark backgrounds */
  icon?: ReactNode;
  title: string;
  description: string;
  className?: string;
};

/**
 * Reusable feature card: icon, title, description.
 * Styled for dark sections (subtle border, light text).
 */
export default function FeatureCard({ icon, title, description, className }: FeatureCardProps) {
  return (
    <article className={`${styles.featureCard} ${className ?? ''}`.trim()}>
      <div className={styles.featureCardHeader}>
        {icon && <div className={styles.featureCardIconWrap} aria-hidden>{icon}</div>}
        <h3 className={styles.featureCardTitle} dangerouslySetInnerHTML={{ __html: title }} />
      </div>
      <p className={styles.featureCardDescription}>{description}</p>
    </article>
  );
}
