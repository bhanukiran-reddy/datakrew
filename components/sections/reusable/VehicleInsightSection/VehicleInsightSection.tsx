import Image from '@/components/ui/Image/Image';
import Link from '@/components/ui/Link/Link';
import styles from './VehicleInsightSection.module.css';

export type VehicleInsightSectionProps = {
  title?: string;
  description?: string;
  image?: {
    url: string;
    alt?: string;
    width?: number;
    height?: number;
  };
  button?: {
    label: string;
    url: string;
  };
  className?: string;
  id?: string;
  hideBgGradient?: boolean;
};

/**
 * "From vehicle to insight in seconds" — two-column layout
 * with title (highlighted word), description, and TriangleImage.
 * Renders only what is provided — no hardcoded defaults.
 */
export default function VehicleInsightSection(props: VehicleInsightSectionProps) {
  const { title, description, image, button, className, id, hideBgGradient } = props;
  const hasText = title || description;

  if (!hasText && !image?.url) return null;

  return (
    <section id={id} className={`${styles.vehicleInsightSection} ${hideBgGradient ? styles.hideBgGradient : ''} ${className ?? ''}`} aria-labelledby="vehicle-insight-heading">
      <div className="container">
        <div className={styles.vehicleInsightWrapper}>
          <div className={styles.vehicleInsightContent}>
            {title && (
              <h2
                id="vehicle-insight-heading"
                className="sectionTitle"
                dangerouslySetInnerHTML={{ __html: title ?? '' }}
              />
            )}
            {description && (
              <div className={styles.vehicleInsightDescription} dangerouslySetInnerHTML={{ __html: description }} />
            )}
            {button && (
              <Link href={button.url} className={`primaryCta ${styles.vehicleInsightButton}`}>
                {button.label}
                <i className="icon fa-kit fa-right-arrow"></i>
              </Link>
            )}
          </div>
          {image?.url && (
            <div className={styles.vehicleInsightImageWrapper}>
              <Image
                src={image.url}
                alt={image?.alt ?? ''}
                width={500}
                height={500}
                className={styles.vehicleInsightImage}
                unoptimized={image.url.endsWith('.svg')}
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
