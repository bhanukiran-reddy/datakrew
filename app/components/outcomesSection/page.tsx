'use client';

import { useRef} from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import styles from './outcoms.module.css';

// Register GSAP Plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const outcomesData = [
  {
    percentage: '50%',
    title: 'higher safety scores',
    description: 'GuardianAI escalates risks in real-time across multiple channels.',
    color: '#93D772'
  },
  {
    percentage: '20%',
    title: 'more efficiency',
    description: 'Optimized operations and reduced downtime through predictive analytics.',
    color: '#93D772'
  },
  {
    percentage: '10%',
    title: 'higher resale value',
    description: 'Battery intelligence that maintains optimal health and extends lifespan.',
    color: '#93D772'
  },
];

export default function OutcomesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const centerContentRef = useRef<HTMLDivElement>(null);
  const cardsContainerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // 1. Text Reveal Animation
    gsap.to('.reveal-text', {
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top 50%',
        toggleActions: 'play none none reverse',
      },
      opacity: 1,
      y: 0,
      duration: 1,
      stagger: 0.2,
      ease: 'power3.out',
    });

    // 2. Card Scroll Animation - Cards move over the text
    gsap.to(cardsContainerRef.current, {
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1.5, // Smooth delay for premium feel
      },
      y: -500, // Distance cards travel over the text
      ease: 'none',
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} className={styles.scrollSection}>
      {/* Background Pattern */}
      <div className={styles.backgroundPattern}></div>

      {/* Pinned Center Content */}
      <div ref={centerContentRef} className={styles.centerContent}>
        <h1 className={`${styles.revealText} reveal-text`}>
          Outcomes you can <span className={styles.highlight}>measure</span>
        </h1>
        <p className={`${styles.revealText} reveal-text`}>
          Operational certainty for uptime, safety, warranty, and asset value.
        </p>
      </div>

      {/* Cards Container - Scrolls over the text */}
      <div ref={cardsContainerRef} className={styles.cardsContainer}>
        {outcomesData.map((outcome, index) => (
          <div key={index} className={styles.card}>
            <div className={styles.cardPercentage} style={{ color: outcome.color }}>
              {outcome.percentage}
            </div>
            <h3 className={styles.cardTitle} style={{ color: outcome.color }}>
              {outcome.title}
            </h3>
            <p className={styles.cardDescription}>
              {outcome.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}