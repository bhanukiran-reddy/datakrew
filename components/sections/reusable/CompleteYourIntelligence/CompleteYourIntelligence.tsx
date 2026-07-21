import styles from "./CompleteYourIntelligence.module.css";
import FeatureStackCard from "../FeatureStackCard/FeatureStackCard";
import Link from "@/components/ui/Link/Link";

interface StackCard {
  image?: string;
  label: string;
  title: string;
  description: string;
  features: string[];
  uri?: string;
  ctaText?: string;
}

interface CompleteYourIntelligenceProps {
  id?: string;
  className?: string;
  title?: string;
  description?: string;
  stackCards?: StackCard[];
  columns?: number;
  isItusMaxAutoscan?: boolean;
  isOxredAutoCert?: boolean;
  isAskOx?: boolean;
  isOxRedLens?:boolean

  // Dynamic props from CMS intelligenceStackSection
  stackSectionHeader?: string;
  stackSectionDescription?: string;
  stackDetails?: {
    nodes?: Array<{
      id: string;
      title: string;
      infrastructureCategory?: {
        nodes?: Array<{ name: string }>;
      };
      productFeatures?: {
        featuredCardImage?: {
          node?: {
            altText?: string;
            mediaItemUrl?: string;
          }
        };
        featureDescription?: string;
        featuresList?: Array<{ featureText: string }>;
        featureCtaText?: string;
        featureCtaUrl?: string;
      };
    }>;
  };
  // CTA button from CMS
  stackCtaButton?: {
    stackButtonUrl?: {
      url: string;
      title?: string;
      target?: string;
    } | null;
    stackButtonText?: string;
  };
}

export default function CompleteYourIntelligence(props: CompleteYourIntelligenceProps) {
  const {
    id,
    className,
    title,
    description,
    stackCards,
    columns,
    stackSectionHeader,
    stackSectionDescription,
    stackDetails,
    isItusMaxAutoscan,
    isOxredAutoCert,
    isAskOx,
  isOxRedLens,

    stackCtaButton,
  } = props;

  // Resolve dynamic content
  const finalTitle = stackSectionHeader || title;
  const finalDescription = stackSectionDescription || description;
  const finalCards = stackDetails?.nodes
    ? stackDetails.nodes.map(node => ({
      label: node.infrastructureCategory?.nodes?.[0]?.name || "",
      title: node.title,
      description: node.productFeatures?.featureDescription || "",
      features: node.productFeatures?.featuresList?.map(f => f.featureText) || [],
      uri: node.productFeatures?.featureCtaUrl,
      ctaText: node.productFeatures?.featureCtaText,
      image: node.productFeatures?.featuredCardImage?.node?.mediaItemUrl || ""
    }))
    : stackCards;

  if (!finalTitle && (!finalCards || finalCards.length === 0)) return null;

  const cardsCount = finalCards?.length || 0;
  const gridColumns = isItusMaxAutoscan || isOxredAutoCert || isAskOx  || isOxRedLens ? 1 : (columns || (cardsCount === 3 ? 3 : 2));

  return (
    <section
      className={`${styles.section} ${className || ''} ${isItusMaxAutoscan || isOxredAutoCert || isAskOx || isOxRedLens ? styles.itusVariant : ''}`}
      id={id}
    >
      <div className="container">
        <div className={styles.wrapper}>
          <div className={styles.header}>
            {finalTitle && (
              <h2 className="sectionTitle" dangerouslySetInnerHTML={{ __html: finalTitle }} />
            )}
            {finalDescription && (
              <p className="sectionDescription">{finalDescription}</p>
            )}
          </div>
          {finalCards && finalCards.length > 0 && (
            <div
              className={styles.grid}
              data-card-count={finalCards.length}
              style={{ '--grid-cols': gridColumns } as React.CSSProperties}
            >
              {finalCards.map((card, idx) => (
                <FeatureStackCard
                  key={idx}
                  image={card.image}
                  label={card.label}
                  title={card.title}
                  description={card.description}
                  features={card.features}
                  uri={card.uri}
                  ctaText={card.ctaText}
                  className={isItusMaxAutoscan || isOxredAutoCert || isAskOx || isOxRedLens ? styles.itusCard : ""}
                />
              ))}
            </div>
          )}
          {stackCtaButton?.stackButtonText && (
            <div className={styles.ctaWrapper}>
              <Link
                href={stackCtaButton.stackButtonUrl?.url || "#"}
                target={stackCtaButton.stackButtonUrl?.target || "_self"}
                className="primaryCta"
              >
                {stackCtaButton.stackButtonText}
                <i className={`icon fa-kit fa-right-arrow`}></i>
              </Link>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
