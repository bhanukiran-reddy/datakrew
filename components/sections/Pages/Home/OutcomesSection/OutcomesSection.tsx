"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import styles from "./OutcomesSection.module.css";
import { formatTitle } from "@/lib/utils/format";

const WebGLOrganicFlow = dynamic(() => import("@/components/sections/reusable/WebGLOrganicFlow/WebGLOrganicFlow"), {
  ssr: false,
});

type OutcomesSectionProps = {
  title?: string;
  description?: string;
  outcomes?: Array<{
    percentage?: string;
    iconClass?: string;
    title?: string;
    description?: string;
    color?: string;
    column?: number;
  }>;
  className?: string;
};

/**
 * Renders only what is provided — no hardcoded defaults.
 * Scroll-based animations: using native IntersectionObserver for maximum reliability.
 */
export default function OutcomesSection(props: OutcomesSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  const outcomes = (props.outcomes ?? []).filter(
    (o) => o?.percentage || o?.title || o?.description,
  );

  useEffect(() => {
    if (!sectionRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} style={{ position: "relative", width: "100%" }}>
      <section ref={sectionRef} className={`${styles.scrollSection} ${props.className || ''}`}>
        <div className={styles.webglBackground}>
          <WebGLOrganicFlow />
        </div>
        <div className={styles.backgroundPattern} />
        <div className="container">
          <div
            className={styles.centerContent}
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
              transition: 'opacity 0.8s ease-out, transform 0.8s ease-out'
            }}
          >
            {props.title && (
              <h2 className={`${styles.title} sectionTitle`}>{formatTitle(props.title)}</h2>
            )}
            {props.description && (
              <div
                className="sectionDescription"
                dangerouslySetInnerHTML={{ __html: props.description }}
              />
            )}
          </div>
          {outcomes.length > 0 && (
            <div className={styles.cardsContainer}>
              {outcomes.map((outcome, index) => (
                <div
                  key={index}
                  className={styles.card}
                  style={{
                    opacity: isVisible ? 1 : 0,
                    transform: isVisible ? 'translateY(0)' : 'translateY(40px)',
                    transition: `opacity 0.8s ease-out ${0.2 + (index * 0.15)}s, transform 0.8s ease-out ${0.2 + (index * 0.15)}s`
                  }}
                >
                  {outcome.iconClass && (
                    <div className={styles.cardIcon}>
                      <i className={outcome.iconClass} />
                    </div>
                  )}
                  {outcome.percentage && (
                    <h3
                      className={styles.cardPercentage}
                    >
                      {outcome.percentage}
                    </h3>
                  )}
                  {outcome.title && (
                    <h3
                      className={styles.cardTitle}
                      dangerouslySetInnerHTML={{ __html: outcome.title }}
                    />
                  )}
                  {outcome.description && (
                    <p
                      className={styles.cardDescription}
                      dangerouslySetInnerHTML={{ __html: outcome.description }}
                    />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
