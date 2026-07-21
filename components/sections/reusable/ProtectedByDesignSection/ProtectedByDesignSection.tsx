"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./ProtectedByDesignSection.module.css";

export type ProtectedByDesignSectionProps = {
  id?: string;
  title?: string;
  titleHighlight?: string;
  subheading?: string;
  centerImageUrl?: string;
  centerImageAlt?: string;
  ctaText?: string;
  ctaHref?: string;
  features?: Array<{ title: string; description: string }>;
  cardPositions?: Array<{ contentIdx: number }>;
  className?: string;

  // CMS Specific props
  specLeftItems?: Array<{ leftItemTitle: string; leftItemDescription: string }>;
  specRightItems?: Array<{ rightItemTitle: string; rightItemDescription: string }>;
};

const DEFAULT_CARD_POSITIONS: Array<{ contentIdx: number }> = [
  { contentIdx: 6 },
  { contentIdx: 7 },
  { contentIdx: 8 },
  { contentIdx: 9 },
  { contentIdx: 10 },
  { contentIdx: 5 },
  { contentIdx: 5 },
  { contentIdx: 0 },
  { contentIdx: 1 },
  { contentIdx: 2 },
  { contentIdx: 3 },
  { contentIdx: 4 },
];

/**
 * Protected by design – three-column layout (relative, no absolute).
 * Left: 6 cards (align right toward center) | Center: image | Right: 6 cards (align left toward center).
 * Mobile: stack order = first 6 cards → image → next 6 cards.
 */
export default class ProtectedByDesignSection extends React.Component<ProtectedByDesignSectionProps> {
  render() {
    const {
      id,
      title = "Enterprise-grade hardware ready for <span>global fleets</span>",
      subheading = "High-frequency telemetry and battery data capture for extreme environments.",
      centerImageUrl,
      centerImageAlt = "ITUS hardware – exploded view",
      ctaText = "Contact us for datasheet",
      ctaHref = "/contact",
      features = [],
      cardPositions = DEFAULT_CARD_POSITIONS,
      className,
      specLeftItems,
      specRightItems,
    } = this.props;

    const hasCMSItems = specLeftItems && specRightItems && (specLeftItems.length > 0 || specRightItems.length > 0);
    const hasContent = title || subheading || features.length > 0 || hasCMSItems;
    if (!hasContent) return null;

    let leftCards: Array<{ title: string; description: string }> = [];
    let rightCards: Array<{ title: string; description: string }> = [];

    if (hasCMSItems) {
      leftCards = (specLeftItems || []).map(item => ({
        title: item.leftItemTitle,
        description: item.leftItemDescription
      }));
      rightCards = (specRightItems || []).map(item => ({
        title: item.rightItemTitle,
        description: item.rightItemDescription
      }));
    } else {
      const positions =
        cardPositions.length >= 12 ? cardPositions : DEFAULT_CARD_POSITIONS;
      const list = positions
        .map((pos) => features[pos.contentIdx])
        .filter(Boolean);
      leftCards = list.slice(0, 6);
      rightCards = list.slice(6, 12);
    }

    const stripClasses = [
      styles.stripOne,
      styles.stripTwo,
      styles.stripThree,
      styles.stripFour,
      styles.stripFive,
      styles.stripSix,
      styles.stripSeven,
      styles.stripEight,
      styles.stripNine,
      styles.stripTen,
      styles.stripEleven,
      styles.stripTwelve,
    ];

    const renderCard = (
      item: { title: string; description: string },
      index: number,
    ) => (
      <article
        key={index}
        className={`${styles.protectedByDesignCard} ${stripClasses[index] || ""}`.trim()}
        role="listitem"
      >
        <h6 className={styles.protectedByDesignCardTitle} dangerouslySetInnerHTML={{ __html: item.title ?? '' }} />
        <p className={styles.protectedByDesignCardDescription}>
          {item.description}
        </p>
      </article>
    );

    return (
      <section
        id={id}
        className={`${styles.protectedByDesignSection} ${className || ''}`}
        aria-labelledby="protected-by-design-heading"
      >
        <div className="container">
          <div className={styles.protectedByDesignSectionInner}>
            <div className={styles.protectedByDesignHeader}>
              <h2
                id="protected-by-design-heading"
                className={`sectionTitle ${styles.protectedByDesignHeading}`}
                dangerouslySetInnerHTML={{
                  __html: title ?? '',
                }}
              />
              {subheading && (
                <p className={styles.protectedByDesignSubheading}>
                  {subheading}
                </p>
              )}
            </div>

            <div className={styles.protectedByDesignContentWrapper}>
              <div className={styles.protectedByDesignLeftColumn} role="list">
                {leftCards.map((item, index) => renderCard(item, index))}
              </div>
              {centerImageUrl && (
                <div className={styles.protectedByDesignCenterColumn}>
                  <Image
                    src={centerImageUrl}
                    alt={centerImageAlt}
                    width={538}
                    height={615}
                    className={styles.protectedByDesignCenterImage}
                    sizes="(max-width: 1200px) 100vw, 33.625rem"
                  />
                </div>
              )}
              <div className={styles.protectedByDesignRightColumn} role="list">
                {rightCards.map((item, index) => renderCard(item, index + 6))}
              </div>
            </div>

            {ctaText && ctaHref && (
              <div className={styles.protectedByDesignCtaWrapper}>
                <Link
                  href={ctaHref}
                  className="primaryCta"
                >
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
}