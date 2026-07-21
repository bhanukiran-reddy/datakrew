import Image from "next/image";
import styles from "./FeatureStackCard.module.css";
import Link from "@/components/ui/Link/Link";

interface Props {
  image?: string;
  label: string;
  title: string;
  description: string;
  features?: string[];
  className?: string;
  uri?: string;
  ctaText?: string;

}

export default function FeatureStackCard({
  image, // backend image
  label,
  title,
  description,
  features = [],
  className,
  uri = "/",
  ctaText,
}: Props) {
  // Build descriptive text from the card title when CMS provides no CTA text.
  // This prevents Lighthouse's "Links do not have descriptive text" error.
  const resolvedCtaText = ctaText?.trim() || `Explore ${title.replace(/<[^>]*>/g, '').trim()}`;
  return (
    <div className={`${styles.card} ${className || ''}`}>
      {image && (
        <div className={styles.imageWrapper}>
          <Image src={image} alt={title} width={585} height={225} className={styles.image} />
        </div>
      )}

      <p className={styles.label}>{label}</p>
      <h3
        className={styles.cardTitle}
        dangerouslySetInnerHTML={{ __html: title }}
      />
      <p className={styles.cardDesc}>{description}</p>

      {features.length > 0 && (
        <ul className={styles.featureList}>
          {features.map((item, i) => (
            <li key={i} className={styles.featureItem}>
              <Image
                src="/Frame.svg"
                alt="Decorative graphic frame"
                width={32}
                height={28}
              />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      )}

      {uri && uri !== "/" && (
        <Link href={uri} className={`${styles.link} tertiaryCta`} aria-label={resolvedCtaText}>
          {resolvedCtaText}
          <i className="icon fa-kit fa-right-arrow"></i>
        </Link>
      )}
    </div>
  );
}
