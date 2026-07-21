"use client";

import { useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import styles from './OemLogo.module.css'

interface OemLogoProps {
  title?: string;
  description?: string;
  logos?: { title: string; url: string }[];
  className?: string;
}

export default function OemLogo({ title, description, logos = [], className }: OemLogoProps) {
  const [visibleCount, setVisibleCount] = useState(16);
  const restoreScrollYRef = useRef<number | null>(null);

  useLayoutEffect(() => {
    if (restoreScrollYRef.current == null) return;
    window.scrollTo({ top: restoreScrollYRef.current });
    restoreScrollYRef.current = null;
  }, [visibleCount]);

  const loadMore = () => {
    restoreScrollYRef.current = window.scrollY;
    setVisibleCount((prev) => prev + 16);
  };

  if (!logos || logos.length === 0) return null;

  return (
    <>
      <section className={`${styles.section} ${className || ""}`}>

        <div className="container">
          {title && <h2 className={`${styles.Title} sectionTitle`} dangerouslySetInnerHTML={{ __html: title }} />}
          {description && <p className={`sectionDescription ${styles.oemDescription}`} dangerouslySetInnerHTML={{ __html: description }} />}
          <div className={styles.OemLogoWrap}>


            <div className={styles.OemLogo}>
              {logos.map((logo, index) => (
                <div className={styles.eachLogo} key={index}>
                  <Image className={styles.logoImg} src={logo.url} alt={logo.title || "OEM logo"} width={280} height={120} unoptimized={!!logo.url} />
                  <span className={styles.logoTitle}>
                    {logo.title.charAt(0).toUpperCase() + logo.title.slice(1)}
                  </span>
                </div>
              ))}
            </div>

            {/* {visibleCount < logos.length && (
              <div className={styles.loadMoreWrap}>
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={(e) => {
                    (e.currentTarget as HTMLButtonElement).blur();
                    loadMore();
                  }}
                  className="secondaryCta"
                >
                  Load more
                </button>
              </div>
            )} */}
          </div>
        </div>
      </section>
    </>
  )
}