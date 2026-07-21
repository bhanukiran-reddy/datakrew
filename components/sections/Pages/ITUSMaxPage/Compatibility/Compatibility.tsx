import styles from "./Compatibility.module.css";
import PartnersLogo from "@/components/ui/PartnersLogo/PartnersLogo";

interface SupportItem {
  icon: string;
  label: string;
}

interface SupportCard {
  title: string;
  items: SupportItem[];
}

interface CompatibilityProps {
  id?: string;
  className?: string;
  title?: string;
  subtitle?: string;
  supportCards?: SupportCard[];
  partners?: Array<{ name?: string; image?: string }>;
  partnersDescription?: string;
}

export default function Compatibility({ id, className, title, subtitle, supportCards, partners, partnersDescription }: CompatibilityProps) {
  const validPartners = partners?.filter((p) => p?.image) ?? [];
  if (!title && (!supportCards || supportCards.length === 0) && validPartners.length === 0) return null;

  return (
    <section className={`${styles.compatibilitySection} ${className || ''}`} id={id}>
      <div className="container">
        {title && (
          <h2 className={styles.compatibilityTitle} dangerouslySetInnerHTML={{ __html: title }} />
        )}

        {subtitle && <p className={`${styles.compatibilitySubtitle} sectionDescription`}>{subtitle}</p>}

        {supportCards && supportCards.length > 0 && (
          <div className={styles.compatibilityGrid}>
            {supportCards.map((card, cardIndex) => (
              <div className={styles.compatibilityCard} key={cardIndex}>
                <h5 className={styles.compatibilityCardTitle}>{card.title}</h5>

                <div className={styles.compatibilityIconRow}>
                  {card.items.map((item, itemIndex) => (
                    <div className={styles.compatibilityIconItem} key={itemIndex}>
                      {item.icon && (item.icon.startsWith('fa-') || item.icon.includes('fa-')) ? (
                        <i className={`${item.icon} ${styles.compatibilityIcon}`} />
                      ) : (
                        <img src={item.icon} alt={item.label} />
                      )}
                      <span>{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className={styles.compatibilityPartnersContainer}>
        {partnersDescription && (
          <p className={`${styles.compatibilityPartnersDescription} container`}>{partnersDescription}</p>
        )}
        <PartnersLogo partners={validPartners} />
      </div>
    </section>
  );
}

