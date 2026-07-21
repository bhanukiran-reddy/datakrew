'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import Image from 'next/image';
import styles from './TestimonialSection.module.css';

/** One testimonial per slide: quote, author, and image stay in sync. */
export type TestimonialItem = {
  quote: string;
  authorName: string;
  authorTitle?: string;
  image: { url: string; alt?: string };
};

type TestimonialSectionProps = {
  title?: string;
  titleHighlight?: string;
  /** New shape: one testimonial per slide. Quote, author, and carousel stay in sync. */
  testimonials?: TestimonialItem[];
  /** Legacy: single quote/author + carousel images. Converted to one slide if testimonials not provided. */
  quote?: string;
  authorName?: string;
  authorTitle?: string;
  carouselImages?: Array<{ url: string; alt?: string }>;
  className?: string;
  id?: string;
};

export default function TestimonialSection({
  title,
  titleHighlight,
  testimonials: testimonialsProp,
  quote,
  authorName,
  authorTitle,
  carouselImages,
  className,
  id,
}: TestimonialSectionProps) {
  const testimonials = useMemo((): TestimonialItem[] => {
    if (testimonialsProp && testimonialsProp.length > 0) {
      return testimonialsProp;
    }
    if (quote && authorName && carouselImages && carouselImages.length > 0) {
      return [
        {
          quote,
          authorName,
          authorTitle,
          image: carouselImages[0],
        },
      ];
    }
    if (quote && authorName) {
      return [
        {
          quote,
          authorName,
          authorTitle,
          // No carousel image available — TriangleImage will show just the
          // triangle shape without any image fill.
          image: carouselImages?.[0] ?? { url: '', alt: '' },
        },
      ];
    }
    if (carouselImages && carouselImages.length > 0) {
      return carouselImages.map((img) => ({
        quote: '',
        authorName: '',
        authorTitle: undefined,
        image: img,
      }));
    }
    return [];
  }, [testimonialsProp, quote, authorName, authorTitle, carouselImages]);

  const [activeIndex, setActiveIndex] = useState(0);
  const n = testimonials.length;
  const safeIndex = n > 0 ? ((activeIndex % n) + n) % n : 0;
  const active = testimonials[safeIndex];

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
      { threshold: 0.15 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const contentRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (contentRef.current && isVisible) {
      // Kill any ongoing animations to prevent overlap
      gsap.killTweensOf(contentRef.current.children);

      // Timeline for a smooth staggered horizontal slide
      gsap.fromTo(
        contentRef.current.children,
        {
          opacity: 0,
          x: 40, // Slide in from the right
        },
        {
          opacity: 1,
          x: 0,
          duration: 0.6,
          stagger: 0.1, // Quote fades first, then author
          ease: 'power3.out',
          overwrite: true,
        }
      );
    }
  }, { dependencies: [safeIndex, isVisible], scope: sectionRef });

  if (testimonials.length === 0) return null;

  return (
    <section
      id={id}
      ref={sectionRef}
      className={`${styles.testimonialSection} ${isVisible ? styles.isVisible : ''} ${className || ''}`}
      aria-labelledby="testimonial-heading"
    >
      <div className='container'>
        <div className={`${styles.testimonialSectionContentInner}`}>
          {(title || titleHighlight) && (
            <h2
              id="testimonial-heading"
              className={`sectionTitle ${styles.testimonialSectionTitle}`}
              dangerouslySetInnerHTML={{
                __html: titleHighlight
                  ? (title && title.toLowerCase().includes(titleHighlight.toLowerCase())
                    ? title.replace(new RegExp(`(${titleHighlight.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi'), `<span class="${styles.testimonialSectionTitleHighlight}">$1</span>`)
                    : `${title ?? ''} <span class="${styles.testimonialSectionTitleHighlight}">${titleHighlight}</span>`)
                  : (title ?? ''),
              }}
            />
          )}

          <div className={styles.testimonialSectionSlide}>
            <div ref={contentRef} className={styles.testimonialSectionSlideInner}>
              {(active.quote || active.authorName) && (
                <>
                  {active.quote && (
                    <div className={styles.testimonialSectionQuoteBlock}>
                      <p className={`sectionDescription ${styles.testimonialSectionQuoteText}`}>
                        <span className={styles.testimonialSectionQuoteMark} aria-hidden>
                          <Image src="/icons/quotes.svg" alt="quotes" width={39} height={28} />
                        </span>{active.quote}
                      </p>
                    </div>
                  )}
                  {active.authorName && (
                    <h3 className={styles.testimonialSectionAuthorName}>{active.authorName}</h3>
                  )}
                  {active.authorTitle && (
                    <p className={styles.testimonialSectionAuthorTitle}>{active.authorTitle}</p>
                  )}
                </>
              )}
            </div>
          </div>

          {n > 1 && (
            <div className={styles.navigationRow}>
              <div className={styles.indicators}>
                <div className={styles.paginationInfo}>
                  <span className={styles.currentSlide}>
                    {(safeIndex + 1).toString().padStart(2, '0')}
                  </span>
                  <span className={styles.separator}>/</span>
                  <span className={styles.totalSlides}>
                    {n.toString().padStart(2, '0')}
                  </span>
                </div>
                <div className={styles.dotsRow}>
                  {testimonials.map((_, i) => (
                    <button
                      key={i}
                      className={`${styles.dot} ${i === safeIndex ? styles.dotActive : ''}`}
                      onClick={() => setActiveIndex(i)}
                      aria-label={`Go to slide ${i + 1}`}
                    />
                  ))}
                </div>
              </div>
              <div className={styles.btnGroup}>
                <button
                  className={`${styles.navBtn} ${safeIndex === 0 ? styles.navBtnDisabled : ''}`}
                  onClick={() => safeIndex > 0 && setActiveIndex(safeIndex - 1)}
                  disabled={safeIndex === 0}
                  aria-label="Previous slide"
                >
                  <i className="icon fa-kit fa-right-nav" style={{ transform: 'rotate(180deg)' }} />
                </button>
                <button
                  className={`${styles.navBtn} ${safeIndex === n - 1 ? styles.navBtnDisabled : ''}`}
                  onClick={() => safeIndex < n - 1 && setActiveIndex(safeIndex + 1)}
                  disabled={safeIndex === n - 1}
                  aria-label="Next slide"
                >
                  <i className="icon fa-kit fa-right-nav" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
