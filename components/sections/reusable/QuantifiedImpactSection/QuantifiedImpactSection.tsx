"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "@/components/ui/Link/Link";
import { LazyMotion, m, AnimatePresence } from "framer-motion";
import { loadDomAnimation } from "@/lib/motion/loadDomAnimation";
import TriangleImage from "@/components/sections/reusable/TriangleImage/TriangleImage";
import NumberTicker from "@/components/sections/reusable/NumberTicker/NumberTicker";
import ImpactStats from '@/components/sections/reusable/ImpactStats/ImpactStats';
import styles from "./QuantifiedImpactSection.module.css";

/** Prefer CMS alt text; fall back to slide title, then a generic label. */
function resolveImageAlt(
  alt: string | null | undefined,
  fallbackLabel: string | null | undefined,
  genericFallback: string,
): string {
  const trimmed = alt?.trim();
  if (trimmed) return trimmed;
  const label = fallbackLabel?.trim();
  if (label) return label;
  return genericFallback;
}

export type QuantifiedImpactStat = {
  value: string;
  label: string;
};

export type QuantifiedImpactSlide = {
  /** Large image on left */
  image: { url: string; alt: string };
  /** Optional slide-specific title */
  title?: string;
  titleHighlight?: string;
  /** Optional slide-specific description */
  description?: string;
  /** Quote text */
  quote: string;
  /** Author avatar */
  authorImage?: { url: string; alt?: string };
  authorName: string;
  authorTitle?: string;
  stats: QuantifiedImpactStat[];
  casestudyHref?: string;
  casestudyText?: string;
};

export type QuantifiedImpactSectionProps = {
  title?: string;
  titleHighlight?: string;
  description?: string;
  slides?: QuantifiedImpactSlide[];
  className?: string;
  id?: string;

  // Dynamic props from CMS caseStudyCarouselSection
  csCarouselHeading?: string;
  csCarouselDescription?: string;
  csCarouselItems?: {
    nodes?: Array<{
      id?: string;
      title?: string;
      uri?: string;
      featuredImage?: {
        node?: {
          mediaItemUrl?: string;
          altText?: string;
        };
      };
      caseStudyCardFields?: {
        csClientName?: string;
        csClientTitle?: string;
        csCtaText?: string;
        csDescription?: string;
        csClientPhoto?: {
          node?: {
            mediaItemUrl?: string;
            altText?: string;
          };
        };
        csKeyMetrics?: Array<{
          csMetricLabel?: string;
          csMetricType?: string[];
          csMetricValue?: string;
        }>;
      };
    }>;
  };
};

export default function QuantifiedImpactSection(
  props: QuantifiedImpactSectionProps,
) {
  const {
    title,
    titleHighlight,
    description,
    slides,
    className,
    id,
    csCarouselHeading,
    csCarouselDescription,
    csCarouselItems,
  } = props;

  // Resolve dynamic content
  const finalTitle = csCarouselHeading || title;
  const finalDescription = csCarouselDescription || description;

  // Be more robust with slide mapping to handle various CMS response shapes
  const rawNodes = csCarouselItems?.nodes || [];
  const finalSlides: QuantifiedImpactSlide[] =
    rawNodes.length > 0
      ? rawNodes.map((node: any) => ({
        image: {
          url:
            node.featuredImage?.node?.mediaItemUrl || node.image?.url || "",
          alt: resolveImageAlt(
            node.featuredImage?.node?.altText ?? node.image?.alt,
            node.title,
            "Case study impact visualization",
          ),
        },
        title: "", // This will cause displayTitle to fall back to finalTitle (csCarouselHeading)
        description: node.title || "", // Case study title becomes the slide description
        quote:
          node.caseStudyCardFields?.csDescription ||
          node.quote ||
          node.description ||
          "",
        authorName:
          node.caseStudyCardFields?.csClientName || node.authorName || "",
        authorTitle:
          node.caseStudyCardFields?.csClientTitle || node.authorTitle || "",
        authorImage: {
          url:
            node.caseStudyCardFields?.csClientPhoto?.node?.mediaItemUrl ||
            node.authorImage?.url ||
            node.image?.url ||
            "",
          alt: resolveImageAlt(
            node.caseStudyCardFields?.csClientPhoto?.node?.altText ??
              node.authorImage?.alt,
            node.caseStudyCardFields?.csClientName || node.authorName,
            "Case study client photo",
          ),
        },
        casestudyText:
          node.caseStudyCardFields?.csCtaText || node.casestudyText || "View case study",
        casestudyHref: node.uri || node.casestudyHref || "#",
        stats:
          (node.caseStudyCardFields?.csKeyMetrics || []).map((m: any) => ({
            label: m.csMetricLabel || m.label || "",
            value: m.csMetricValue || m.value || "",
          })) ||
          node.stats ||
          [],
      }))
      : (slides || []).map((s) => ({
        ...s,
        image: {
          url: s.image.url,
          alt: resolveImageAlt(s.image.alt, s.title, "Case study impact visualization"),
        },
        quote: s.quote || s.description || "",
        authorName: s.authorName || "",
      }));

  const validSlides = (finalSlides ?? []).filter(
    (s) => s.image?.url || s.quote,
  );
  const [activeIndex, setActiveIndex] = useState(0);
  const n = validSlides.length;
  const safeIndex = n > 0 ? ((activeIndex % n) + n) % n : 0;
  const slide: QuantifiedImpactSlide = validSlides[safeIndex] || {
    image: { url: "", alt: "Case study impact visualization" },
    quote: "",
    authorName: "",
    stats: [],
  };

  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 },
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe && safeIndex < n - 1) {
      setActiveIndex((prev) => prev + 1);
    }
    if (isRightSwipe && safeIndex > 0) {
      setActiveIndex((prev) => prev - 1);
    }
  };

  if (validSlides.length === 0) return null;

  const displayTitle = slide.title || finalTitle;
  const displayTitleHighlight = slide.titleHighlight || titleHighlight;
  const displayDescription = slide.description || finalDescription;
  const hasCurrentTitle = !!(displayTitle || displayTitleHighlight);

  return (
    <LazyMotion features={loadDomAnimation} strict>
    <section
      id={id}
      ref={sectionRef}
      className={`${styles.impactSection} ${isVisible ? styles.impactIsVisible : ""} ${className || ""}`}
      aria-label="Quantified impact"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      <div className="container">
        {n > 1 ? (
          <div
            className={styles.impactNavigationRow}
            aria-label="Case study slides"
          >
            <div className={styles.impactNavBtnGroup}>
              <button
                type="button"
                className={`${styles.impactNavBtn} ${safeIndex === 0 ? styles.impactNavBtnDisabled : ""}`}
                onClick={() => setActiveIndex((prev) => prev - 1)}
                aria-label="Previous slide"
                disabled={safeIndex === 0}
              >
                <i
                  className={`${styles.leftArrow} icon fa-kit fa-right-nav`}
                ></i>
              </button>
              <button
                type="button"
                className={`${styles.impactNavBtn} ${safeIndex === n - 1 ? styles.impactNavBtnDisabled : ""}`}
                onClick={() => setActiveIndex((prev) => prev + 1)}
                aria-label="Next slide"
                disabled={safeIndex === n - 1}
              >
                <i className={`${styles.rightArrow} fa-kit fa-right-nav`}></i>
              </button>
            </div>
          </div>
        ) : null}
        <div className={styles.impactInner}>
          <div className={styles.impactImageCol}>
            <div className={styles.impactImageWrap}>
              {validSlides.map((s, i) => (
                <Image
                  key={i}
                  src={s.image.url}
                  alt={s.image.alt}
                  width={800}
                  height={600}
                  className={`${styles.impactImage} ${i === safeIndex ? styles.impactImage_active : ""}`}
                  priority={i === 0}
                  loading={i === 0 ? "eager" : "lazy"}
                  sizes="(max-width: 991px) 100vw, 50vw"
                />
              ))}
            </div>
          </div>

          {/* RIGHT — title, description, quote, author, CTA, dots */}
          <div className={styles.impactContentCol}>
            <AnimatePresence mode="popLayout">
              <m.div
                key={safeIndex}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                onAnimationComplete={() => {
                  const el = document.getElementById(
                    `impact-content-${safeIndex}`,
                  );
                  if (el) el.style.transform = "none";
                }}
                id={`impact-content-${safeIndex}`}
                className={styles.impactSlideContent}
              >
                {hasCurrentTitle && (
                  <h2
                    className={styles.impactTitle}
                    dangerouslySetInnerHTML={{
                      __html:
                        (displayTitle ? `${displayTitle} ` : "") +
                        (displayTitleHighlight
                          ? `<span class="${styles.impactTitleHighlight}">${displayTitleHighlight}</span>`
                          : ""),
                    }}
                  />
                )}

                {displayDescription && (
                  <p
                    className={`sectionDescription ${styles.impactDescription}`}
                  >
                    {displayDescription}
                  </p>
                )}

                <hr className={styles.impactDivider} aria-hidden />

                {slide.quote && (
                  <p className={styles.impactQuote}>{slide.quote}</p>
                )}

                {/* {slide.authorName && (
                                    <div className={styles.impactAuthor}>
                                        {slide.authorImage?.url && (
                                            <div className={styles.impactAuthorAvatarWrap}>
                                                <TriangleImage
                                                    src={slide.authorImage.url}
                                                    width="40px"
                                                    height="40px"
                                                    showBorder={false}
                                                />
                                            </div>
                                        )}
                                        <div className={styles.impactAuthorInfo}>
                                            <h3 className={styles.impactAuthorName}>{slide.authorName}</h3>
                                            {slide.authorTitle && (
                                                <p className={styles.impactAuthorTitle}>{slide.authorTitle}</p>
                                            )}
                                        </div>
                                    </div>
                                )} */}

                {/* Stat cards — after author details */}
                <ImpactStats stats={slide.stats} className={styles.impactStatsRow} />

                {slide.casestudyHref && slide.casestudyText && (
                  <Link
                    href={slide.casestudyHref}
                    className="tertiaryCta"
                    aria-label={`${slide.casestudyText} for ${displayTitle}`}
                  >
                    {slide.casestudyText}
                    <i className="icon fa-kit fa-right-arrow"></i>
                  </Link>
                )}
              </m.div>
            </AnimatePresence>
          </div>
        </div>
        {/* Navigation dots and arrows */}
        {n > 1 ? (
          <div
            className={styles.impactNavigationRow}
            aria-label="Case study slides"
            role="tablist"
          >
            <div className={styles.impactDotsRow}>
              {validSlides.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  role="tab"
                  aria-selected={i === safeIndex}
                  aria-label={`Slide ${i + 1}`}
                  className={`${styles.impactDot} ${i === safeIndex ? styles.impactDotActive : ""}`}
                  onClick={() => setActiveIndex(i)}
                />
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </section>
    </LazyMotion>
  );
}
