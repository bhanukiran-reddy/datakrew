'use client';

import { useId } from 'react';
import styles from './TriangleImage.module.css';

type TriangleImageProps = {
  /** Image URL. When empty or omitted, only the triangle shape is rendered (no image). */
  src?: string;
  /** Optional className for the container. */
  className?: string;
  /** Whether to show the gradient stroke around the shape. Default true. */
  showBorder?: boolean;
  /** Optional width (e.g. '10rem', 160). Applied to the container. */
  width?: string | number;
  /** Optional height (e.g. '11.25rem', 180). Applied to the container. */
  height?: string | number;
  /** When true, container and SVG fill 100% width/height (e.g. inside a carousel center slot). */
  fillContainer?: boolean;

  left?: number;
};

/**
 * Rounded triangle (play-style) card with optional gradient border and clipped image.
 * Renders an SVG shape with image fill and optional linear gradient stroke.
 */
export default function TriangleImage({
  src: srcProp,
  className,
  showBorder = true,
  width,
  height,
  fillContainer = false,
  left = 0,
}: TriangleImageProps) {
  // If src is empty or undefined, only the triangle border renders (no image fill)
  const src = srcProp || '';
  const id = useId();
  const safeId = id.replace(/:/g, '-');
  const playShapeId = `play-shape-${safeId}`;
  const borderGradientId = `border-gradient-${safeId}`;
  const shapeMaskId = `shape-mask-${safeId}`;

  const containerStyle =
    width !== undefined || height !== undefined
      ? {
        width: typeof width === 'number' ? `${width}px` : width,
        height: typeof height === 'number' ? `${height}px` : height,
      }
      : undefined;

  return (
    <div
      className={`${styles.triangleImageCardContainer} ${fillContainer ? styles.triangleImageFillContainer : ''} ${className ?? ''}`.trim()}
      style={containerStyle}
    >
      <svg
        className={styles.triangleImagePlayCard}
        viewBox={`${left} 0 100 100`}
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
      >
        <defs>
          <path
            id={playShapeId}
            d="M 18 12 L 18 88 Q 18 98 28 92 L 90 56 Q 98 50 90 44 L 28 8 Q 18 2 18 12 Z"
          />
          <linearGradient
            id={borderGradientId}
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="0%" stopColor="#6eff95" stopOpacity={1} />
            <stop offset="100%" stopColor="#00c3ff" stopOpacity={1} />
          </linearGradient>
          <clipPath id={shapeMaskId}>
            <use href={`#${playShapeId}`} />
          </clipPath>
        </defs>
        {src && (
          <image
            href={src}
            width="100%"
            height="100%"
            preserveAspectRatio="xMidYMid slice"
            clipPath={`url(#${shapeMaskId})`}
          />
        )}
        {showBorder && (
          <use
            href={`#${playShapeId}`}
            fill="none"
            stroke={`url(#${borderGradientId})`}
            strokeWidth={1}
          />
        )}
      </svg>
    </div>
  );
}
