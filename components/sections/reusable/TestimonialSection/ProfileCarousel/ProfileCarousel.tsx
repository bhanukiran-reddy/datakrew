"use client";
import { useCallback, useState, useRef } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import TriangleImage from '@/components/sections/reusable/TriangleImage/TriangleImage';
import styles from './ProfileCarousel.module.css';

export type CarouselImage = {
  url: string;
  alt?: string;
};

type ProfileCarouselProps = {
  images: CarouselImage[];
  /** Controlled: current center index (0-based). When provided with onChange, carousel is controlled. */
  value?: number;
  /** Called when the center index changes (prev/next or card click). */
  onChange?: (index: number) => void;
  /** Center (active) card: use TriangleImage instead of masked image. When true, center shows triangle shape. */
  centerAsTriangle?: boolean;
  /** Center card: hide border on the triangle. Default true when centerAsTriangle. */
  centerTriangleNoBorder?: boolean;
  /** Center card: optional width (e.g. '10rem', 160). Falls back to CSS .cardActive size. */
  centerTriangleWidth?: string | number;
  /** Center card: optional height (e.g. '11.25rem', 180). Falls back to CSS .cardActive size. */
  centerTriangleHeight?: string | number;
};

function PrevIcon() {
  return (
    <i className={`${styles.profileCarouselNavIconPrev} fa-kit fa-right-nav`}></i>
  );
}

function NextIcon() {
  return (
    <i className={`${styles.profileCarouselNavIcon} fa-kit fa-right-nav`}></i>
  );
}


/**
 * Always shows exactly 5 slots: [left-2] [left-1] [CENTER] [right+1] [right+2].
 * Center slot is always the play-shaped card. Images rotate through
 * these fixed slots infinitely (wraps around via modulo).
 * Supports controlled mode via value + onChange.
 */
const VISIBLE_COUNT = 5;
const CENTER = 2; // 0-based index of the center slot

export default function ProfileCarousel({
  images,
  value,
  onChange,
  centerAsTriangle = true,
  centerTriangleNoBorder = true,
  centerTriangleWidth,
  centerTriangleHeight,
}: ProfileCarouselProps) {
  const n = images.length;
  const isControlled = value !== undefined && onChange !== undefined;
  const [internalIndex, setInternalIndex] = useState(0);

  const centerIndex = isControlled ? Math.max(0, Math.min(value, n - 1)) : internalIndex;

  const setCenterIndex = useCallback(
    (next: number | ((prev: number) => number)) => {
      const resolved = typeof next === 'function' ? next(centerIndex) : next;
      const idx = Math.max(0, Math.min(resolved, n - 1));
      if (isControlled) {
        onChange(idx);
      } else {
        setInternalIndex(idx);
      }
    },
    [n, isControlled, centerIndex, onChange],
  );

  const canGoPrev = centerIndex > 0;
  const canGoNext = centerIndex < n - 1;

  const goPrev = useCallback(() => {
    if (canGoPrev) setCenterIndex((i) => i - 1);
  }, [canGoPrev, setCenterIndex]);

  const goNext = useCallback(() => {
    if (canGoNext) setCenterIndex((i) => i + 1);
  }, [canGoNext, setCenterIndex]);

  const handleSlotClick = useCallback(
    (slot: number) => {
      if (slot === CENTER) {
        // Clicked the center card, do nothing or trigger a specific action
        return;
      }
      const offset = slot - CENTER;
      setCenterIndex((prev) => prev + offset);
    },
    [setCenterIndex],
  );

  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      // Small "pop" effect for the active center card
      const activeCard = containerRef.current?.querySelector(`.${styles.profileCarouselCardActive}`);
      if (activeCard) {
        gsap.fromTo(
          activeCard,
          { scale: 0.8 },
          {
            scale: 1,
            duration: 0.4,
            ease: 'back.out(2)',
            overwrite: true,
          }
        );
      }
    },
    { dependencies: [centerIndex], scope: containerRef }
  );

  if (!n) return null;

  // ── Single-item: just the active triangle, centred, no nav buttons ──
  if (n === 1) {
    const img = images[0];
    return (
      <div className={styles.profileCarouselWrapper} ref={containerRef}>
        <ul className={styles.profileCarouselTrack} role="list">
          <li
            className={`${styles.profileCarouselCard} ${styles.profileCarouselCardActive}`}
            role="button"
            tabIndex={0}
            aria-label={img.alt ?? 'Profile 1'}
            aria-current="true"
          >
            {centerAsTriangle ? (
              <TriangleImage
                src={img.url}
                showBorder={!centerTriangleNoBorder}
                width={centerTriangleWidth}
                height={centerTriangleHeight}
                fillContainer={centerTriangleWidth === undefined && centerTriangleHeight === undefined}
                className={styles.profileCarouselCenterTriangleWrap}
              />
            ) : (
              <Image
                src={img.url}
                alt={img.alt ?? ''}
                width={120}
                height={120}
                className={styles.profileCarouselCardImg}
                unoptimized={img.url.startsWith('http')}
              />
            )}
          </li>
        </ul>
      </div>
    );
  }

  // ── Multi-item carousel (2+): show real items with nav buttons ──────
  // Build visible slots: always centred around centerIndex, but only
  // include slots that actually map to a valid image (no empty placeholders).
  const visibleSlots: { slot: number; imgIndex: number; isCenter: boolean; isEmpty?: boolean }[] = [];
  for (let slot = 0; slot < VISIBLE_COUNT; slot++) {
    const offset = slot - CENTER;
    const imgIndex = centerIndex + offset;
    if (imgIndex >= 0 && imgIndex < n) {
      visibleSlots.push({ slot, imgIndex, isCenter: slot === CENTER });
    } else {
      visibleSlots.push({ slot, imgIndex: -1, isCenter: false, isEmpty: true });
    }
  }

  return (
    <div className={styles.profileCarouselWrapper} ref={containerRef}>
      <button
        type="button"
        className={`${styles.profileCarouselNavBtn} ${styles.profileCarouselNavBtnPrev} ${!canGoPrev ? styles.profileCarouselNavBtnDisabled : ''}`}
        onClick={goPrev}
        aria-label="Previous profile"
        disabled={!canGoPrev}
      >
        <PrevIcon />
      </button>

      <ul className={styles.profileCarouselTrack} role="list">
        {visibleSlots.map(({ slot, imgIndex, isCenter, isEmpty }) => {
          if (isEmpty) {
            return (
              <li
                key={slot}
                className={`${styles.profileCarouselCard} ${styles.profileCarouselCardEmpty}`}
                data-slot={slot}
                aria-hidden="true"
              />
            );
          }
          const img = images[imgIndex];
          return (
            <li
              key={slot}
              className={`${styles.profileCarouselCard} ${isCenter ? styles.profileCarouselCardActive : ''}`}
              data-slot={slot}
              onClick={() => handleSlotClick(slot)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleSlotClick(slot);
                }
              }}
              role="button"
              tabIndex={0}
              aria-label={img.alt ?? `Profile ${imgIndex + 1}`}
              aria-current={isCenter ? 'true' : undefined}
            >
              <div key={`${img.url}-${isCenter}`} className={styles.profileCarouselImageWrap}>
                {isCenter && centerAsTriangle ? (
                  <TriangleImage
                    src={img.url}
                    showBorder={!centerTriangleNoBorder}
                    width={centerTriangleWidth}
                    height={centerTriangleHeight}
                    fillContainer={centerTriangleWidth === undefined && centerTriangleHeight === undefined}
                    className={styles.profileCarouselCenterTriangleWrap}
                  />
                ) : (
                  <Image
                    src={img.url}
                    alt={img.alt ?? ''}
                    width={120}
                    height={120}
                    className={styles.profileCarouselCardImg}
                    unoptimized={img.url.startsWith('http')}
                  />
                )}
              </div>
            </li>
          );
        })}
      </ul>

      <button
        type="button"
        className={`${styles.profileCarouselNavBtn} ${styles.profileCarouselNavBtnNext} ${!canGoNext ? styles.profileCarouselNavBtnDisabled : ''}`}
        onClick={goNext}
        aria-label="Next profile"
        disabled={!canGoNext}
      >
        <NextIcon />
      </button>
    </div>
  );
}
