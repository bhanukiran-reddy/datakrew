"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import styles from "./InstallItus.module.css";
import Link from "next/link";
import Steps from "@/components/ui/Steps/Steps";

interface InstallItusProps {
  id?: string;
  className?: string;
  title?: string;
  description?: string;
  align?: 'left' | 'center';
  steps?: Array<{
    number?: string;
    title?: string;
    description?: string;
  }>;
  image?: { url: string; alt?: string };
  ctaButtons?: Array<{
    label: string;
    url: string;
    variant?: 'primary' | 'secondary';
  }>;
}



export default function InstallItus({ id, className, title, description, steps, image, ctaButtons, align = 'center' }: InstallItusProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);
  const [showImage, setShowImage] = useState(
    // if there are no steps we can show image immediately, otherwise wait
    !steps || steps.length === 0
  );

  useEffect(() => {
    // whenever the steps prop changes, reset visibility
    // defer to avoid lint warning about sync setState in effect
    const timer = setTimeout(() => {
      if (steps && steps.length > 0) {
        setShowImage(false);
      } else {
        setShowImage(true);
      }
    }, 0);
    return () => clearTimeout(timer);
  }, [steps]);

  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  if (!title && !description && (!steps || steps.length === 0)) return null;

  return (
    <section className={`${styles.section} ${className || ''}`} id={id}>
      <div className="container">
        {(title || description) && (
          <div className={`${styles.header} ${align === 'left' ? styles.alignLeft : styles.alignCenter}`}>
            {title && (
              <h2 className={`sectionTitle ${styles.title}`} dangerouslySetInnerHTML={{ __html: title }} />
            )}
            {description && (
              <p className={`sectionDescription ${styles.description}`} dangerouslySetInnerHTML={{ __html: description }} />
            )}
          </div>
        )}

        {steps && steps.length > 0 && (
          <div ref={wrapperRef} className={`${styles.stepsWrapper} ${isInView ? styles.inView : ""}`}>
            {steps.length === 3 && (
              <div className={styles.waveWrapper}>
                <Image src="/left_wave.svg" alt="" width={100} height={100} className={`${styles.leftWave} ${styles.revealItem} ${styles.delay2}`} />
                <Image src="/right_wave.svg" alt="" width={100} height={100} className={`${styles.rightWave} ${styles.revealItem} ${styles.delay4}`} />
              </div>
            )}
            {steps.length === 4 && (
              <div className={styles.waveWrapper}>
                <Image src="/steps/waveOne.svg" alt="Decorative wave graphic" width={100} height={100} className={`${styles.waveOne} ${styles.revealItem} ${styles.delay2}`} />
                <Image src="/steps/waveTwo.svg" alt="Decorative wave graphic" width={100} height={100} className={`${styles.waveTwo} ${styles.revealItem} ${styles.delay4}`} />
                <Image src="/steps/waveThree.svg" alt="Decorative wave graphic" width={100} height={100} className={`${styles.waveThree} ${styles.revealItem} ${styles.delay6}`} />
              </div>
            )}
            <Steps
              steps={steps}
              inView={isInView}
              onLastStepAnimationEnd={() => setShowImage(true)}
            />
          </div>
        )}

        {image && (
          <div className={`${styles.imageWrapper} ${showImage ? styles.imageVisible : ''}`}>
            <Image
              src={image.url}
              alt={image.alt || 'Installation illustration'}
              width={500}
              height={500}
              className={styles.image}
            />
          </div>
        )}

        {ctaButtons && ctaButtons.length > 0 && (
          <div className={styles.ctaBar}>
            {ctaButtons.map((cta, index) => (
              <Link
                key={index}
                href={cta.url}
                className={cta.variant === 'primary' ? "secondaryCta" : "primaryCta"}
              >
                {cta.label}
                <i className="icon fa-kit fa-right-arrow"></i>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

