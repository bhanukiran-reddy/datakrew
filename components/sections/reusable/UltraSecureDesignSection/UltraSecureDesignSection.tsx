"use client";

import React, { useEffect, useRef, useState } from "react";
import styles from "./UltraSecureDesignSection.module.css";
import Image from "next/image";
import Link from "next/link";

interface GridCell {
  /** "content" = icon + title + description, "image" = background image, "empty" = spacer, "borderless-content" = content without borders */
  type: "content" | "image" | "empty" | "borderless-content";
  iconClass?: string;
  icon?: string;
  iconWidth?: number;
  iconHeight?: number;
  title?: string;
  description?: string;
  image?: string;
  imageAlt?: string;
  number?: string;
  accentColor?: string;
}

interface UltraSecureDesignProps {
  id?: string;
  className?: string;
  title?: string;
  subtitle?: string;
  columns?: number;
  cells?: GridCell[];
  background?: React.ReactNode;
  numberClassName?: string;
  cta?: {
    text: string;
    url: string;
    target?: string;
  };
  ctas?: Array<{
    text: string;
    url: string;
    target?: string;
    variant?: "primary" | "secondary";
  }>;
}

export default function UltraSecureDesignSection({
  id,
  className,
  title,
  subtitle,
  columns = 6,
  cells,
  background,
  numberClassName,
  cta,
  ctas,
}: UltraSecureDesignProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!sectionRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 } // Start when 10% visible to fix mobile viewport height 
    );

    observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  if (!title && (!cells || cells.length === 0)) return null;

  const allCtas = ctas || (cta ? [cta] : []);

  return (
    <section
      ref={sectionRef}
      className={`${styles.ultraSecureDesignSection} ${className || ""}`}
      id={id ?? "ultra-secure-design"}
    >
      {background && <div className={styles.ultraSecureDesignBackground}>{background}</div>}
      <div className={`container ${styles.ultraSecureDesignContentContainer}`}>
        {title && (
          <h2
            className="sectionTitle"
            dangerouslySetInnerHTML={{ __html: title }}
          />
        )}

        {subtitle && <p className={`sectionDescription ${styles.ultraSecureDesignSubtitle}`}>{subtitle}</p>}

        {cells && cells.length > 0 && (
          <div
            className={styles.ultraSecureDesignWrapper}
            style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
          >
            {cells.map((cell, index) => {
              const row = Math.floor(index / columns);
              const col = index % columns;
              const totalRows = Math.ceil(cells.length / columns);
              const isTop = row === 0;
              const isBottom = row === totalRows - 1;
              const isLeft = col === 0;
              const isRight = col === columns - 1;

              // Animation logic: Top half falls, bottom half rises
              const midPoint = totalRows / 2;
              const animationClass = isVisible
                ? (row < midPoint ? styles.brickFallDown : styles.brickRiseUp)
                : styles.brickHidden;

              return (
                <div
                  key={index}
                  style={{
                    '--cell-order': (index % columns) * 10 + Math.floor(index / columns),
                    '--accent-color': cell.accentColor || '#93D772',
                    animationDelay: isVisible ? `${index * 100}ms` : undefined,
                  } as React.CSSProperties}
                  className={[
                    styles.ultraSecureDesignCell,
                    animationClass,
                    cell.type === "content" && styles.ultraSecureDesignContentCell,
                    cell.type === "borderless-content" && styles.ultraSecureDesignBorderlessContentCell,
                    cell.type === "image" && styles.ultraSecureDesignImageCell,
                    cell.type === "empty" && styles.ultraSecureDesignEmptyCell,
                    isTop && styles.ultraSecureDesignIsTop,
                    isBottom && styles.ultraSecureDesignIsBottom,
                    isLeft && styles.ultraSecureDesignIsLeft,
                    isRight && styles.ultraSecureDesignIsRight
                  ].filter(Boolean).join(' ')}
                >
                  {(cell.type === "content" || cell.type === "borderless-content") && (
                    <div className={styles.ultraSecureDesignCellInner}>
                      {cell.number && (
                        <span className={`${styles.ultraSecureDesignCellNumber} ${numberClassName || ""}`}>{cell.number}</span>
                      )}
                      {cell.iconClass ? (
                        <i className={`${cell.iconClass} ${styles.ultraSecureDesignIcon}`}></i>
                      ) : cell.icon ? (
                        <Image
                          src={cell.icon}
                          alt={cell.title ?? ""}
                          width={cell.iconWidth ?? 47}
                          height={cell.iconHeight ?? 47}
                          className={styles.ultraSecureDesignBoxImage}
                        />
                      ) : null}
                      {cell.title && <p className={styles.ultraSecureDesignCellTitle}><strong>{cell.title}</strong></p>}
                      {cell.description && <p>{cell.description}</p>}
                    </div>
                  )}

                  {cell.type === "image" && cell.image && (
                    <Image
                      src={cell.image}
                      alt={cell.imageAlt ?? ""}
                      // width={300}
                      // height={300}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className={styles.ultraSecureDesignCellImage}
                      unoptimized
                    />
                  )}
                </div>
              );
            })}
          </div>
        )}
        {allCtas.length > 0 && (
          <div className={styles.ultraSecureDesignCtaWrapper}>
            {allCtas.map((btn, idx) => (
              <Link
                key={idx}
                href={btn.url || "#"}
                target={btn.target}
                className={(btn as any).variant === "secondary" ? "secondaryCta" : "primaryCta"}
                style={{ margin: "0 0.5rem" }}
              >
                {btn.text}
                <i className="icon fa-kit fa-right-arrow"></i>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
