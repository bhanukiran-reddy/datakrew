"use client";

import { useRef, useState, useEffect, useCallback, useLayoutEffect } from "react";
import Image from "next/image";
import Link from "@/components/ui/Link/Link";
import { useParams } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { useGSAP } from "@gsap/react";
import { formatTitle } from "@/lib/utils/format";
import { scheduleScrollTriggerRefresh } from "@/lib/scheduling/scrollTriggerCoordinator";
import styles from "./LogisticsSection.module.css";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);
}

/** Pinned desktop GSAP path only applies at this breakpoint (matches mobile/desktop split). */
function isLogisticsDesktopGsapViewport(): boolean {
  return typeof window !== "undefined" && window.matchMedia("(min-width: 1200px)").matches;
}

/* ---------- Sub-components ---------- */

function RoadImage({
  src,
  alt,
  priority,
}: {
  src: string;
  alt: string;
  priority?: boolean;
}) {
  return (
    <div className={styles.logisticsRoadImageContainer}>
      <Image
        src={src}
        alt={alt}
        fill
        className={styles.logisticsRoadImage}
        loading={priority ? "eager" : "lazy"}
        priority={!!priority}
        quality={85}
        sizes="(max-width: 768px) 100vw, 50vw"
      />
    </div>
  );
}

function TruckImage({
  src,
  alt,
  priority,
  width = 256,
  height = 160,
}: {
  src: string;
  alt: string;
  priority?: boolean;
  width?: number;
  height?: number;
}) {
  return (
    <div className={styles.logisticsTruckImageContainer}>
      <Image
        src={src}
        alt={alt || 'Logistics vehicle'}
        width={width}
        height={height}
        className={styles.logisticsTruckImage}
        unoptimized
        loading={priority ? "eager" : "lazy"}
        priority={!!priority}
        quality={85}
        sizes="(max-width: 768px) 30vw, 15vw"
      />
    </div>
  );
}

/* ---------- Slide data ---------- */

export interface LogisticsSlide {
  id?: number;
  title: string;
  desc: string;
  cta?: string;
  tags?: string[];
  ctaPrimary?: { text: string; url: string };
  ctaSecondary?: { text: string; url: string };
  caseStudyTitle?: string;
  caseStudyCtaText?: string;
  caseStudyUrl?: string;
}

const FALLBACK_SLIDES: LogisticsSlide[] = [
  {
    id: 1,
    title: "Logistics & Delivery",
    desc: "Predictive range and SOC planning tuned for congestion and charging gaps, ensuring on-time deliveries.",
    cta: "Download whitepaper",
    tags: [
      "Predictive breakdown alerts",
      "Fuel & energy optimization",
      "Driver fatigue monitoring",
    ],
  },
  {
    id: 2,
    title: "Long Haul Transport",
    desc: "Optimized route planning for cross-country fleets with integrated weather and traffic analysis.",
    cta: "Download whitepaper",
    tags: [
      "Real-time cargo tracking",
      "Automated compliance logging",
      "Fleet maintenance scheduling",
    ],
  },
  {
    id: 3,
    title: "Manufacturing & Factory",
    desc: "Intelligent fleet orchestration across factory floors — from inbound logistics to outbound dispatch.",
    cta: "Download whitepaper",
    tags: [
      "Autonomous yard management",
      "Real-time load optimization",
      "Predictive maintenance alerts",
    ],
  },
  {
    id: 4,
    title: "Airport & Aviation",
    desc: "Ground fleet coordination for airside and landside operations with live turnaround tracking.",
    cta: "Download whitepaper",
    tags: [
      "Airside vehicle tracking",
      "Turnaround time optimization",
      "Emission compliance monitoring",
    ],
  },
  {
    id: 5,
    title: "Autonomous Vehicles",
    desc: "Full-stack telemetry and remote oversight for self-driving fleets operating in mixed traffic.",
    cta: "Download whitepaper",
    tags: [
      "Remote intervention support",
      "Sensor health monitoring",
      "Geo-fenced route compliance",
    ],
  },
  {
    id: 6,
    title: "Autonomous Vehicles",
    desc: "Full-stack telemetry and remote oversight for self-driving fleets operating in mixed traffic.",
    cta: "Download whitepaper",
    tags: [
      "Remote intervention support",
      "Sensor health monitoring",
      "Geo-fenced route compliance",
    ],
  },
];

/* ---------- Slide road images for mobile (from public/logistics/mobile) ---------- */
const SLIDE_ROAD_IMAGES = [
  "/logistics/mobile/public-transport-schools-mobile.png",
  "/logistics/mobile/logistics-delivery-mobile.png",
  "/logistics/mobile/delivery.png",
  "/logistics/mobile/autonomous-vehicles-mobile.png",
  "/logistics/mobile/mining-mobile.png",
];

/* ==========================================================
   Mobile / Tablet Slider (≤1200px)
   No GSAP, no ScrollTrigger, no animations.
   Simple touch-swipeable carousel with image + content card.
   ========================================================== */

const MOBILE_AUTO_ADVANCE_INTERVAL_MS = 10000;

/* ---------- Props type ---------- */
export type LogisticsSectionProps = {
  title?: string;
  description?: string;
  slides?: LogisticsSlide[];
  className?: string;
};

function LogisticsMobileSlider({
  title,
  description,
  slides = FALLBACK_SLIDES,
  className,
}: LogisticsSectionProps) {
  const params = useParams();
  const locale = params.locale as string;
  const activeSlides = slides.length > 0 ? slides : FALLBACK_SLIDES;
  const slideCount = activeSlides.length;
  const [activeIndex, setActiveIndex] = useState(0);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  const touchDeltaRef = useRef(0);
  const isSwiping = useRef(false);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0];
    touchStartRef.current = { x: touch.clientX, y: touch.clientY };
    touchDeltaRef.current = 0;
    isSwiping.current = false;
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!touchStartRef.current) return;
    const touch = e.touches[0];
    const deltaX = touch.clientX - touchStartRef.current.x;
    const deltaY = touch.clientY - touchStartRef.current.y;
    // If horizontal swipe is dominant, prevent vertical scroll and mark as swiping
    if (
      !isSwiping.current &&
      Math.abs(deltaX) > Math.abs(deltaY) &&
      Math.abs(deltaX) > 10
    ) {
      isSwiping.current = true;
    }
    if (isSwiping.current) {
      e.preventDefault();
      touchDeltaRef.current = deltaX;
    }
  }, []);

  const handleTouchEnd = useCallback(() => {
    if (!isSwiping.current) {
      touchStartRef.current = null;
      return;
    }
    const delta = touchDeltaRef.current;
    const SWIPE_THRESHOLD = 50;
    if (delta < -SWIPE_THRESHOLD) {
      // Swiped left → next slide (no wrap)
      setActiveIndex((prev) => Math.min(prev + 1, slideCount - 1));
    } else if (delta > SWIPE_THRESHOLD) {
      // Swiped right → prev slide (no wrap)
      setActiveIndex((prev) => Math.max(prev - 1, 0));
    }
    touchStartRef.current = null;
    touchDeltaRef.current = 0;
    isSwiping.current = false;
  }, [slideCount]);

  const handleDotClick = useCallback((index: number) => {
    setActiveIndex(index);
  }, []);

  return (
    <section
      className={`${styles.logisticsSection} ${title ? className || '' : ''}`}
      aria-label="Logistics Services"
    >
      <div className="container">
        {(title != null && title !== "") ||
          (description != null && description !== "") ? (
          <div className={styles.logisticsSectionHeader}>
            {title != null && title !== "" && (
              <h2 className="sectionTitle">{formatTitle(title)}</h2>
            )}
            {description != null && description !== "" && (
              <p className="sectionDescription">{description}</p>
            )}
          </div>
        ) : null}

        <div
          className={styles.logisticsMobileContainer}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Image area */}
          <div className={styles.logisticsMobileImageWrapper}>
            {activeSlides.map((slide: LogisticsSlide, i: number) => (
              <div
                key={slide.id || i}
                className={`${styles.logisticsMobileSlide} ${i === activeIndex ? styles.logisticsMobileSlideActive : ""
                  }`}
              >
                <Image
                  src={SLIDE_ROAD_IMAGES[i % SLIDE_ROAD_IMAGES.length]}
                  alt={slide.title}
                  fill
                  className={styles.logisticsMobileImage}
                  sizes="100vw"
                  quality={85}
                  priority={i === 0}
                />
              </div>
            ))}
          </div>

          {/* Content card — overlaps image slightly */}
          <div className={styles.logisticsMobileCardArea}>
            {activeSlides.map((slide: LogisticsSlide, i: number) => (
              <div
                key={slide.id || i}
                className={`${styles.logisticsMobileCard} ${i === activeIndex ? styles.logisticsMobileCardActive : ""
                  }`}
                aria-hidden={i !== activeIndex}
              >
                <h3 className={styles.logisticsContentTitle}>{slide.title}</h3>
                <p className={styles.logisticsContentDescription}>{slide.desc}</p>
                <ul className={`${styles.logisticsTagsContainer} tick-list`}>
                  {slide.tags?.map((tag: string) => (
                    <li key={tag} className={styles.logisticsTagItem}>
                      {tag}
                    </li>
                  ))}
                </ul>
                <div className={styles.logisticsButtonContainer}>
                  {slide.ctaPrimary ? (
                    <Link
                      href={slide.ctaPrimary.url}
                      className="primaryCta"
                      target="_blank"
                      locale={locale}
                      aria-label={`${slide.ctaPrimary.text} for ${slide.title}`}
                    >
                      {slide.ctaPrimary.text}{" "}
                      <i className="icon fa-kit fa-right-arrow"></i>
                    </Link>
                  ) : (
                    <button
                      type="button"
                      className="primaryCta"
                      aria-label={` ${slide.title} `}
                    >
                      {slide.cta || "Learn more"}{" "}
                      <i className="icon fa-kit fa-right-arrow"></i>
                    </button>
                  )}
                  {slide.ctaSecondary && (
                    <Link
                      href={slide.ctaSecondary.url}
                      className="secondaryCta"
                      locale={locale}
                      aria-label={`${slide.ctaSecondary.text} for ${slide.title}`}
                    >
                      {slide.ctaSecondary.text}{" "}
                      <i className="icon fa-kit fa-right-arrow"></i>
                    </Link>
                  )}
                </div>
                {slide.caseStudyTitle && (
                  <>
                    <div className={styles.logisticsCardDivider} />
                    <div className={styles.logisticsCaseStudyBlock}>
                      <p className={styles.logisticsCaseStudyText}>
                        {slide.caseStudyTitle}
                      </p>
                      {slide.caseStudyUrl && (
                        <Link
                          href={slide.caseStudyUrl}
                          className={styles.logisticsCaseStudyLink}
                          locale={locale}
                          aria-label={`${slide.caseStudyCtaText || "View case study"} for ${slide.title}`}
                        >
                          {slide.caseStudyCtaText || "View case study"}{" "}
                          <i className="icon fa-kit fa-right-arrow"></i>
                        </Link>
                      )}
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>

          {/* Nav buttons & dots */}
          <div className={styles.logisticsMobileControls}>
            <div className={styles.logisticsMobileDotsContainer}>
              {activeSlides.map((_: any, i: number) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleDotClick(i)}
                  className={`${styles.logisticsNavDot} ${activeIndex === i ? styles.logisticsNavDotActive : ""
                    }`}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>
            <div className={styles.logisticsMobileNavGroup}>
              <button
                type="button"
                className={`${styles.xlNavBtn} ${styles.xlNavBtnLeft} ${activeIndex === 0 ? styles.disabled : ""}`}
                onClick={() => handleDotClick(Math.max(0, activeIndex - 1))}
                aria-label="Previous slide"
                disabled={activeIndex === 0}
              >
                <i className="fa-kit fa-right-nav" />
              </button>
              <button
                type="button"
                className={`${styles.xlNavBtn} ${activeIndex === slideCount - 1 ? styles.disabled : ""}`}
                onClick={() => handleDotClick(Math.min(slideCount - 1, activeIndex + 1))}
                aria-label="Next slide"
                disabled={activeIndex === slideCount - 1}
              >
                <i className="fa-kit fa-right-nav" />
              </button>
            </div>
            
          </div>
        </div>
      </div>
    </section>
  );
}

/* ==========================================================
   Desktop Component (>1200px)
   Full GSAP ScrollTrigger pinned carousel with animations.
   ========================================================== */

function LogisticsDesktop({
  title,
  description,
  slides = FALLBACK_SLIDES,
  className,
}: LogisticsSectionProps) {
  const params = useParams();
  const locale = params.locale as string;
  const activeSlides = slides.length > 0 ? slides : FALLBACK_SLIDES;
  const slideCount = activeSlides.length;
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const prevActiveIndexRef = useRef(0);
  const isSkippingRef = useRef(false);
  const skipTargetIndexRef = useRef<number | null>(null);
  const autoAdvanceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const scrollTweenRef = useRef<gsap.core.Tween | null>(null);
  const hasEnteredRef = useRef(false);
  const activeTimelineRef = useRef<gsap.core.Timeline | null>(null);
  const isUserScrollingRef = useRef(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [animTrigger, setAnimTrigger] = useState(0);
  const needsEntranceAnimRef = useRef(false);
  const scrollTriggerInstanceRef = useRef<ScrollTrigger | null>(null);
  const isNavigatingRef = useRef(false);
  const [isNavigating, setIsNavigating] = useState(false);

  const [isXL, setIsXL] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia("(min-width: 1200px)");
    setIsXL(mql.matches);
    const handler = (e: MediaQueryListEvent) => setIsXL(e.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, []);

  const sectionRef = useRef<HTMLElement>(null);

  const roadsRef = useRef<(HTMLDivElement | null)[]>([]);
  const trucksRef = useRef<(HTMLDivElement | null)[]>([]);
  const secondaryVehiclesRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (!isLogisticsDesktopGsapViewport()) return;
    const handleScroll = () => {
      isUserScrollingRef.current = true;
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
      scrollTimeoutRef.current = setTimeout(() => {
        isUserScrollingRef.current = false;
      }, 300);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    };
  }, []);

  /* ---- Helpers ---- */

  const killAllSlideAnimations = useCallback(() => {
    if (activeTimelineRef.current) {
      activeTimelineRef.current.kill();
      activeTimelineRef.current = null;
    }
    activeSlides.forEach((_, i) => {
      const r = roadsRef.current[i];
      const t = trucksRef.current[i];
      const sv = secondaryVehiclesRef.current[i];
      if (r) gsap.killTweensOf(r);
      if (t) gsap.killTweensOf(t);
      if (sv) gsap.killTweensOf(sv);
      const c = r?.parentElement;
      if (c) gsap.killTweensOf(c);
    });
  }, [activeSlides]);

  /** Instantly show a slide in its resting pose (no animation — just set final state) */
  const showSlideStatic = useCallback(
    (index: number) => {
      // If we haven't entered the pinned zone yet, keep everything hidden
      if (!hasEnteredRef.current) return;

      activeSlides.forEach((_, i) => {
        const r = roadsRef.current[i];
        const t = trucksRef.current[i];
        const sv = secondaryVehiclesRef.current[i];
        const c = r?.parentElement;
        if (i === index) {
          if (r) gsap.set(r, { opacity: 1, yPercent: 0, visibility: "visible" });
          if (t) gsap.set(t, { opacity: 1, x: 0, y: 0, visibility: "visible" });
          if (sv) gsap.set(sv, { opacity: 1, x: 0, y: 0, visibility: "visible" });
          if (c) gsap.set(c, { zIndex: 2, opacity: 1, visibility: "visible" });
        } else {
          if (r) gsap.set(r, { opacity: 0, yPercent: 100, visibility: "hidden" });
          if (t) gsap.set(t, { opacity: 0, y: -30, visibility: "hidden" });
          if (sv) gsap.set(sv, { opacity: 0, y: -30, visibility: "hidden" });
          if (c) gsap.set(c, { zIndex: 0, opacity: 0, visibility: "hidden" });
        }
      });
    },
    [activeSlides],
  );

  /* ---- Auto-advance timer ---- */

  const stopAutoAdvance = useCallback(() => {
    if (autoAdvanceTimerRef.current) {
      clearInterval(autoAdvanceTimerRef.current);
      autoAdvanceTimerRef.current = null;
    }
  }, []);

  /* ---- Auto-advance Toggle ---- */
  const IS_AUTO_ADVANCE_ENABLED = false;

  const startAutoAdvance = useCallback(() => {
    if (!IS_AUTO_ADVANCE_ENABLED) return;
    if (autoAdvanceTimerRef.current) clearInterval(autoAdvanceTimerRef.current);
    autoAdvanceTimerRef.current = setInterval(() => {
      const container = containerRef.current;
      if (!container) return;

      // ── Skip if user is actively scrolling — prevents fighting with scroll direction ──
      if (isUserScrollingRef.current) return;

      // ── Check if section is at least partially in viewport ──
      const rect = container.getBoundingClientRect();
      const windowHeight = window.innerHeight || document.documentElement.clientHeight;
      const visibleTop = Math.max(rect.top, 0);
      const visibleBottom = Math.min(rect.bottom, windowHeight);
      const visibleHeight = visibleBottom - visibleTop;
      if (visibleHeight < 50) return; // At least 50px visible

      setActiveIndex((prev) => {
        const nextIndex = (prev + 1) % slideCount;

        if (isXL) {
          return nextIndex;
        }

        isSkippingRef.current = true;
        skipTargetIndexRef.current = nextIndex;
        const st = ScrollTrigger.getAll().find((s) => s.pin === container);
        if (st) {
          if (scrollTweenRef.current) scrollTweenRef.current.kill();
          gsap.killTweensOf(window);
          const rawProgress = nextIndex / (slideCount - 1);
          const progress = Math.max(0.001, Math.min(0.999, rawProgress));
          const scrollPos = st.start + (st.end - st.start) * progress;
          window.scrollTo({ top: scrollPos, behavior: "instant" });
          requestAnimationFrame(() => {
            ScrollTrigger.update();
            isSkippingRef.current = false;
            skipTargetIndexRef.current = null;
            scrollTweenRef.current = null;
          });
        } else {
          isSkippingRef.current = false;
          skipTargetIndexRef.current = null;
        }
        return nextIndex;
      });
    }, 10000);
  }, [slideCount, isXL]);



  /* ---- Kill animations only when section is fully off-screen ---- */

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) {
          killAllSlideAnimations();
          const rect = el.getBoundingClientRect();
          if (rect.bottom <= 0) {
            showSlideStatic(slideCount - 1);
            prevActiveIndexRef.current = slideCount - 1;
          } else {
            showSlideStatic(0);
            prevActiveIndexRef.current = 0;
          }
        }
      },
      { threshold: 0 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [killAllSlideAnimations, showSlideStatic, slideCount]);

  /* ---- Manual dot click ---- */

  const handleNavClick = useCallback(
    (index: number) => {
      if (isNavigatingRef.current) return;

      const container = containerRef.current;
      if (!container) return;

      stopAutoAdvance();

      if (isXL) {
        isNavigatingRef.current = true;
        setIsNavigating(true);
        setActiveIndex(index);
        // Cooldown period matching the animation length (approx 800ms)
        setTimeout(() => {
          isNavigatingRef.current = false;
          setIsNavigating(false);
          startAutoAdvance();
        }, 850);
        return;
      }

      if (scrollTweenRef.current) {
        scrollTweenRef.current.kill();
        scrollTweenRef.current = null;
      }
      isSkippingRef.current = true;
      skipTargetIndexRef.current = index;

      // Ensure hasEnteredRef is true so animation guard doesn't block
      hasEnteredRef.current = true;

      setActiveIndex(index);
      const st = ScrollTrigger.getAll().find((s) => s.pin === container);
      if (st) {
        const rawProgress = index / (slideCount - 1);
        const clampedProgress = Math.max(0.001, Math.min(0.999, rawProgress));
        const targetScroll = st.start + (st.end - st.start) * clampedProgress;
        gsap.killTweensOf(window);
        window.scrollTo({ top: targetScroll, behavior: "instant" });
        requestAnimationFrame(() => {
          ScrollTrigger.update();
          isSkippingRef.current = false;
          skipTargetIndexRef.current = null;
          scrollTweenRef.current = null;
          startAutoAdvance();
        });
      } else {
        isSkippingRef.current = false;
        skipTargetIndexRef.current = null;
        startAutoAdvance();
      }
    },
    [startAutoAdvance, stopAutoAdvance, slideCount, isXL],
  );

  /* ---- ScrollTrigger setup (runs once) ---- */

  useGSAP(
    () => {
      if (!isLogisticsDesktopGsapViewport()) return;
      if (!containerRef.current) return;
      if (scrollTriggerInstanceRef.current) {
        scrollTriggerInstanceRef.current.kill();
        scrollTriggerInstanceRef.current = null;
      }
      if (isXL) {
        ScrollTrigger.create({
          trigger: containerRef.current,
          start: "top 85%",
          onEnter: () => {
            if (!hasEnteredRef.current) {
              gsap.fromTo(containerRef.current, { opacity: 0 }, { opacity: 1, duration: 1 });
              hasEnteredRef.current = true;
              needsEntranceAnimRef.current = true;
              setAnimTrigger((c) => c + 1);
              startAutoAdvance();
            }
          },
        });
        scheduleScrollTriggerRefresh();
        return;
      }

      const trigger = ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top 50%",
        end: "+=2500",
        pin: true,
        pinSpacing: true,
        anticipatePin: 1,
        onRefresh: (self) => {
          const target = skipTargetIndexRef.current;
          if (target !== null && target !== undefined) {
            setActiveIndex(target);
            prevActiveIndexRef.current = target;
            return;
          }
          const newIndex = Math.round(self.progress * (slideCount - 1));
          setActiveIndex(newIndex);
          if (prevActiveIndexRef.current === 0 && newIndex !== 0) {
            prevActiveIndexRef.current = newIndex;
          }
        },
        onUpdate: (self) => {
          const target = skipTargetIndexRef.current;
          if (target !== null && target !== undefined) {
            setActiveIndex(target);
            return;
          }
          const newIndex = Math.round(self.progress * (slideCount - 1));
          setActiveIndex((prev) => (prev !== newIndex ? newIndex : prev));
        },
        onEnter: () => {
          hasEnteredRef.current = true;
          needsEntranceAnimRef.current = true;
          startAutoAdvance();
          setAnimTrigger((c) => c + 1);
        },
        onEnterBack: () => {
          hasEnteredRef.current = true;
          needsEntranceAnimRef.current = true;
          startAutoAdvance();
          setAnimTrigger((c) => c + 1);
        },
        onLeaveBack: () => {
          if (isSkippingRef.current) return;
          hasEnteredRef.current = false;
          stopAutoAdvance();
          killAllSlideAnimations();
          activeSlides.forEach((_, i) => {
            const r = roadsRef.current[i];
            const t = trucksRef.current[i];
            const sv = secondaryVehiclesRef.current[i];
            const c = r?.parentElement;
            if (r) gsap.set(r, { opacity: 0, yPercent: 100, visibility: "hidden" });
            if (t) gsap.set(t, { opacity: 0, y: -30, visibility: "hidden" });
            if (sv) gsap.set(sv, { opacity: 0, y: -30, visibility: "hidden" });
            if (c) gsap.set(c, { zIndex: 0, opacity: 0, visibility: "hidden" });
          });
        },
      });

      scrollTriggerInstanceRef.current = trigger;
      scheduleScrollTriggerRefresh();

      const initIdx = Math.round(trigger.progress * (slideCount - 1));
      setActiveIndex(initIdx);
      prevActiveIndexRef.current = initIdx;

      if (trigger.isActive) {
        hasEnteredRef.current = true;
        needsEntranceAnimRef.current = true;
        showSlideStatic(initIdx);
        requestAnimationFrame(() => setAnimTrigger((c) => c + 1));
      } else {
        showSlideStatic(initIdx);
      }

      return () => {
        trigger.kill();
        scrollTriggerInstanceRef.current = null;
      };
    },
    { dependencies: [isXL], scope: containerRef },
  );

  /* ---- LEFT SIDE: GSAP truck + road animations ---- */

  useGSAP(
    () => {
      if (!isLogisticsDesktopGsapViewport()) return;
      if (!hasEnteredRef.current) return;
      const prevIndex = prevActiveIndexRef.current;
      const currentRoad = roadsRef.current[activeIndex];
      const currentTruck = trucksRef.current[activeIndex];
      const currentSecondary = secondaryVehiclesRef.current[activeIndex];

      if (!currentRoad || !currentTruck) return;

      activeSlides.forEach((_, i) => {
        const r = roadsRef.current[i];
        const t = trucksRef.current[i];
        const sv = secondaryVehiclesRef.current[i];
        const c = r?.parentElement;
        if (i !== prevIndex || prevIndex === activeIndex) {
          if (r) gsap.set(r, { opacity: 0, yPercent: 100, visibility: "hidden" });
          if (t) gsap.set(t, { opacity: 0, y: -30, visibility: "hidden" });
          if (sv) gsap.set(sv, { opacity: 0, y: -30, visibility: "hidden" });
          if (c) gsap.set(c, { zIndex: 0, opacity: 0, visibility: "hidden" });
        }
      });

      const tl = gsap.timeline({ defaults: { overwrite: "auto" } });
      activeTimelineRef.current = tl;
      const isActuallyTransitioning = prevIndex !== activeIndex;
      const isFreshEntry = needsEntranceAnimRef.current;
      needsEntranceAnimRef.current = false;
      const shouldAnimate = isActuallyTransitioning || isFreshEntry;

      if (isActuallyTransitioning) {
        const prevRoad = roadsRef.current[prevIndex];
        const prevTruck = trucksRef.current[prevIndex];
        const prevSecondary = secondaryVehiclesRef.current[prevIndex];
        const prevContainer = prevRoad?.parentElement;

        if (prevRoad && prevTruck && prevContainer) {
          gsap.set(prevContainer, { zIndex: 1, opacity: 1, visibility: "visible" });
          gsap.set(prevRoad, { visibility: "visible" });
          gsap.set(prevTruck, { visibility: "visible" });
          if (prevSecondary) gsap.set(prevSecondary, { visibility: "visible" });

          tl.to(prevTruck, { y: -150, opacity: 0, duration: 0.6, ease: "power2.in" }, 0);
          if (prevSecondary) {
            tl.to(prevSecondary, { y: prevIndex === 2 ? 100 : -100, opacity: 0, duration: 0.5, ease: "power2.in" }, 0);
          }
          tl.to(prevRoad, {
            yPercent: 100,
            opacity: 0,
            duration: 0.6,
            ease: "power2.in",
            onComplete: () => {
              gsap.set(prevContainer, { visibility: "hidden", opacity: 0 });
            },
          }, 0);
        }
      }

      const currentContainer = currentRoad.parentElement;
      if (currentContainer) {
        gsap.set(currentContainer, { zIndex: 2, opacity: 1, visibility: "visible" });
      }
      gsap.set([currentRoad, currentTruck], { visibility: "visible" });
      if (currentSecondary) gsap.set(currentSecondary, { visibility: "visible" });

      const delay = isActuallyTransitioning ? 0.3 : 0;

      if (shouldAnimate) {
        tl.fromTo(currentRoad, { yPercent: 100, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 1, ease: "power2.out" }, delay);
        tl.fromTo(currentTruck, { y: -50, x: -20, opacity: 0 }, { y: 0, x: 0, opacity: 1, duration: 1.2, ease: "bounce.out" }, delay + 0.1);
        if (currentSecondary) {
          tl.fromTo(currentSecondary,
            {
              y: activeIndex === 2 ? -20 : activeIndex === 3 ? -30 : -30,
              x: activeIndex === 2 ? 100 : activeIndex === 3 ? 50 : 0,
              opacity: 0
            },
            { y: 0, x: 0, opacity: 1, duration: 1.2, ease: activeIndex === 3 ? "bounce.out" : "power2.out" },
            delay + 0.3
          );
        }
      }

      const idleX = activeIndex === 2 ? 40 : activeIndex === 3 ? 50 : 50;
      const idleY = activeIndex === 4 || activeIndex === 5 ? 21 : 15;
      tl.to(currentTruck, { x: idleX, y: idleY, duration: 3, ease: "none" }, delay + 1.1);
      if ((activeIndex === 2 || activeIndex === 3) && currentSecondary) {
        const secondaryIdleX = activeIndex === 3 ? -50 : -40;
        const secondaryIdleY = activeIndex === 3 ? 15 : 15;
        tl.to(currentSecondary, { x: secondaryIdleX, y: secondaryIdleY, duration: 3, ease: "none" }, delay + 1.1);
      }

      prevActiveIndexRef.current = activeIndex;
    },
    { dependencies: [activeIndex, animTrigger], scope: containerRef },
  );

  useGSAP(
    () => {
      if (!isLogisticsDesktopGsapViewport()) return;
      activeSlides.forEach((_, i) => {
        const r = roadsRef.current[i];
        const t = trucksRef.current[i];
        const sv = secondaryVehiclesRef.current[i];
        const c = r?.parentElement;
        if (r) gsap.set(r, { opacity: 0, yPercent: 100, visibility: "hidden" });
        if (t) gsap.set(t, { opacity: 0, y: -30, visibility: "hidden" });
        if (sv) gsap.set(sv, { opacity: 0, y: -30, visibility: "hidden" });
        if (c) gsap.set(c, { opacity: 0, visibility: "hidden" });
      });
    },
    { scope: containerRef },
  );

  useEffect(() => {
    if (!isLogisticsDesktopGsapViewport()) return;
    let resizeTimer: ReturnType<typeof setTimeout> | undefined;
    scheduleScrollTriggerRefresh();
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        scheduleScrollTriggerRefresh();
      }, 120);
    };
    window.addEventListener("resize", handleResize, { passive: true });
    return () => {
      clearTimeout(resizeTimer);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    return () => {
      stopAutoAdvance();
      if (scrollTweenRef.current) {
        scrollTweenRef.current.kill();
        scrollTweenRef.current = null;
      }
      killAllSlideAnimations();
      if (scrollTriggerInstanceRef.current) {
        scrollTriggerInstanceRef.current.kill();
        scrollTriggerInstanceRef.current = null;
      }
    };
  }, [stopAutoAdvance, killAllSlideAnimations]);

  return (
    <section
      ref={sectionRef}
      className={`${styles.logisticsSection} ${title ? className || '' : ''}`}
      aria-label="Logistics Services"
    >
      <div className="container">
        {(title != null && title !== "") ||
          (description != null && description !== "") ? (
          <div className={styles.logisticsSectionHeader}>
            {title != null && title !== "" && (
              <h2 className="sectionTitle">{formatTitle(title)}</h2>
            )}
            {description != null && description !== "" && (
              <p className="sectionDescription">{description}</p>
            )}
          </div>
        ) : null}
        <div className={`${styles.logisticsControlsContainer} ${styles.logisticsControlsContainerTop}`}>
          {isXL && (
            <div className={styles.logisticsXLNav}>
              <button
                type="button"
                className={`${styles.xlNavBtn} ${styles.xlNavBtnLeft} ${activeIndex === 0 || isNavigating ? styles.disabled : ""}`}
                onClick={() => handleNavClick(Math.max(0, activeIndex - 1))}
                aria-label="Previous slide"
                disabled={activeIndex === 0 || isNavigating}
              >
                <i className="fa-kit fa-right-nav" />
              </button>
              <button
                type="button"
                className={`${styles.xlNavBtn} ${activeIndex === slideCount - 1 || isNavigating ? styles.disabled : ""}`}
                onClick={() => handleNavClick(Math.min(slideCount - 1, activeIndex + 1))}
                aria-label="Next slide"
                disabled={activeIndex === slideCount - 1 || isNavigating}
              >
                <i className="fa-kit fa-right-nav" />
              </button>
            </div>
          )}
        </div>
        <div ref={containerRef} className={styles.logisticsPinnedContainer}>

          <div className={styles.logisticsAnimationWrapper}>
            <div className={styles.logisticsMainContainer}>
              {/* ===== LEFT: Truck + Road ===== */}
              <div className={styles.logisticsLeftScene}>

                {/* Logistics & Delivery ── */}
                <div
                  className={styles.logisticsSlideContainer}
                  style={{ position: "absolute", inset: 0, visibility: 0 === activeIndex ? "visible" : "hidden", opacity: 0 === activeIndex ? 1 : 0 }}
                >
                  <div
                    ref={(el) => { trucksRef.current[1] = el; }}
                    className={`${styles.logisticsTruckWrapper} ${styles.truckZero}`}
                  >
                    <TruckImage src="/truck1.png" alt="Illustration of an electric delivery truck" width={100} height={100} priority />
                  </div>
                  <div
                    ref={(el) => { roadsRef.current[1] = el; }}
                    className={`${styles.logisticsRoadWrapper} ${styles.baseZero}`}
                  >
                    <RoadImage src="/truck1road.png" alt={activeSlides[1]?.title || 'Logistics & Delivery road'} priority />
                  </div>
                </div>

                {/* ── Long Haul Transport ── */}
                <div
                  className={styles.logisticsSlideContainer}
                  style={{ position: "absolute", inset: 0, visibility: 1 === activeIndex ? "visible" : "hidden", opacity: 1 === activeIndex ? 1 : 0 }}
                >
                  <div
                    ref={(el) => { trucksRef.current[4] = el; }}
                    className={`${styles.logisticsTruckWrapper} ${styles.truckOne}`}
                  >
                    <TruckImage src="/truck2.png" alt="Illustration of an electric delivery truck, alternate view" />
                  </div>
                  <div
                    ref={(el) => { roadsRef.current[4] = el; }}
                    className={`${styles.logisticsRoadWrapper} ${styles.baseOne}`}
                  >
                    <RoadImage src="/logistics/mining.png" alt={activeSlides[4]?.title || 'Long Haul Transport road'} />
                  </div>
                </div>

               

                {/* ── Slide 3: Airport & Aviation ── */}
                <div
                  className={styles.logisticsSlideContainer}
                  style={{ position: "absolute", inset: 0, visibility: 3 === activeIndex ? "visible" : "hidden", opacity: 3 === activeIndex ? 1 : 0 }}
                >
                  <div
                    ref={(el) => { trucksRef.current[2] = el; }}
                    className={`${styles.logisticsTruckWrapper} ${styles.truckThree}`}
                  >
                    <TruckImage src="/logistics/bikeOne.png" alt="Illustration of a delivery bike" />
                  </div>

                  <div
                    ref={(el) => { secondaryVehiclesRef.current[2] = el; }}
                    className={`${styles.logisticsTruckWrapper} ${styles.biketwo}`}
                  >
                    <TruckImage src="/logistics/bikeTwo.png" alt="Illustration of a second delivery bike" />
                  </div>
                  <div
                    ref={(el) => { roadsRef.current[2] = el; }}
                    className={`${styles.logisticsRoadWrapper} ${styles.baseThree}`}
                  >
                    <RoadImage src="/logistics/ground.png" alt={activeSlides[2]?.title || 'Courier and Delivery road'} />
                  </div>
                </div>

                {/* ── Slide 4: Autonomous Vehicles (1) ── */}
                <div
                  className={styles.logisticsSlideContainer}
                  style={{ position: "absolute", inset: 0, visibility: 4 === activeIndex ? "visible" : "hidden", opacity: 4 === activeIndex ? 1 : 0 }}
                >
                  <div
                    ref={(el) => { trucksRef.current[3] = el; }}
                    className={`${styles.logisticsTruckWrapper} ${styles.truckFour}`}
                  >
                    <TruckImage src="/logistics/selfCar.png" alt="Illustration of a car representing personal transport" />
                  </div>
                  <div
                    ref={(el) => { roadsRef.current[3] = el; }}
                    className={`${styles.logisticsRoadWrapper} ${styles.baseFour}`}
                  >
                    <RoadImage src="/logistics/self.png" alt={activeSlides[3]?.title || 'Autonomous Vehicles road'} />
                  </div>
                </div>

                {/*  Public transpotation ── */}
                <div
                  className={styles.logisticsSlideContainer}
                  style={{ position: "absolute", inset: 0, visibility: 5 === activeIndex ? "visible" : "hidden", opacity: 5 === activeIndex ? 1 : 0 }}
                >
                  <div
                    ref={(el) => { trucksRef.current[0] = el; }}
                    className={`${styles.logisticsTruckWrapper} ${styles.truckFive}`}
                  >
                    <TruckImage src="/logistics/publicTransportBus.png" alt="Illustration of a public transport bus" />
                  </div>
                  <div
                    ref={(el) => { roadsRef.current[0] = el; }}
                    className={`${styles.logisticsRoadWrapper} ${styles.baseFive}`}
                  >
                    <RoadImage src="/logistics/publicTransportBase.png" alt={activeSlides[0]?.title || 'Public Transport road'} />
                  </div>
                </div>

              </div>

              {/* ===== RIGHT: Content cards ===== */}
              <div className={styles.logisticsRightContent}>
                {activeSlides.map((slide: LogisticsSlide, i: number) => (
                  <div
                    key={slide.id || i}
                    className={`${styles.logisticsContentCard} ${activeIndex === i ? styles.logisticsContentCardActive : ""
                      }`}
                    aria-hidden={i !== activeIndex}
                  >
                    <h3 className={styles.logisticsContentTitle}>{slide.title}</h3>
                    <p className={styles.logisticsContentDescription}>{slide.desc}</p>
                    <ul className={`${styles.logisticsTagsContainer} tick-list`}>
                      {slide.tags?.map((tag: string) => (
                        <li key={tag} className={styles.logisticsTagItem}>
                          {tag}
                        </li>
                      ))}
                    </ul>
                    <div className={styles.logisticsButtonContainer}>
                      {slide.ctaPrimary ? (
                        <Link
                          href={slide.ctaPrimary.url}
                          className="primaryCta"
                          locale={locale}
                          aria-label={`${slide.ctaPrimary.text} for ${slide.title}`}
                        >
                          {slide.ctaPrimary.text}{" "}
                          <i className="icon fa-kit fa-right-arrow"></i>
                        </Link>
                      ) : (
                        <button
                          type="button"
                          className="primaryCta"
                          aria-label={` ${slide.title} `}
                        >
                          {slide.cta || "Learn more"}{" "}
                          <i className="icon fa-kit fa-right-arrow"></i>
                        </button>
                      )}
                      {slide.ctaSecondary && (
                        <Link
                          href={slide.ctaSecondary.url}
                          className="secondaryCta"
                          locale={locale}
                          aria-label={`${slide.ctaSecondary.text} for ${slide.title}`}
                        >
                          {slide.ctaSecondary.text}{" "}
                          <i className="icon fa-kit fa-right-arrow"></i>
                        </Link>
                      )}
                    </div>
                    {slide.caseStudyTitle && (
                      <>
                        <div className={styles.logisticsCardDivider} />
                        <div className={styles.logisticsCaseStudyBlock}>
                          <p className={styles.logisticsCaseStudyText}>
                            {slide.caseStudyTitle}
                          </p>
                          {slide.caseStudyUrl && (
                            <Link
                              href={slide.caseStudyUrl}
                              className="tertiaryCta"
                              locale={locale}
                              aria-label={`${slide.caseStudyCtaText || "View case study"} for ${slide.title}`}
                            >
                              {slide.caseStudyCtaText || "View case study"}{" "}
                              <i className="icon fa-kit fa-right-arrow"></i>
                            </Link>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation Controls (Dots + XL Buttons) - Moved out of the flex-center area */}
            <div className={styles.logisticsControlsContainer}>
              <div className={styles.logisticsNavDotsContainer}>
                {activeSlides.map((_: LogisticsSlide, i: number) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => handleNavClick(i)}
                    className={`${styles.logisticsNavDot} ${activeIndex === i ? styles.logisticsNavDotActive : ""
                      }`}
                    aria-label={`Go to slide ${i + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ==========================================================
   Main Export
   ========================================================== */

export default function LogisticsSection(props: LogisticsSectionProps) {
  const [isDesktopLayout, setIsDesktopLayout] = useState(true);

  useLayoutEffect(() => {
    const mql = window.matchMedia("(min-width: 1200px)");
    const sync = () => setIsDesktopLayout(mql.matches);
    sync();
    mql.addEventListener("change", sync);
    return () => mql.removeEventListener("change", sync);
  }, []);

  if (!isDesktopLayout) {
    return (
      <LogisticsMobileSlider
        title={props.title}
        description={props.description}
        slides={props.slides}
        className={props.className}
      />
    );
  }

  return (
    <LogisticsDesktop
      title={props.title}
      description={props.description}
      slides={props.slides}
      className={props.className}
    />
  );
}
