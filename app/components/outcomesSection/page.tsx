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
    if (!sectionRef.current || !centerContentRef.current) return;

    // 1. PIN THE TEXT CONTAINER
    // We pin the centerContent for the entire duration of the section's scroll
    ScrollTrigger.create({
      trigger: sectionRef.current,
      start: 'top top',
      end: 'bottom bottom',
      pin: centerContentRef.current,
      pinSpacing: false,
      invalidateOnRefresh: true,
      // markers: true, // Uncomment this to debug the start/end lines
    });

    // 2. REVEAL TEXT ON ENTER
    // Use scoped selectors to avoid selecting elements from other sections
    if (sectionRef.current) {
      const texts = gsap.utils.toArray<HTMLElement>(
        sectionRef.current.querySelectorAll('.reveal-text')
      );
      
      if (texts.length > 0) {
        gsap.fromTo(texts,
          { y: 100, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1.2,
            stagger: 0.2,
            ease: 'power4.out',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 40%', // Start reveal slightly before it hits top
              toggleActions: 'play none none reverse',
              invalidateOnRefresh: true,
            }
          }
        );
      }
    }

    // 3. OPTIONAL: PARALLAX (If you want cards to fly faster than scroll)
    // This isn't strictly necessary if cards are in the flow,
    // but it adds that "premium" feel you saw in the reference.
    if (cardsContainerRef.current && sectionRef.current) {
      gsap.to(cardsContainerRef.current, {
        y: -300,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: true,
          invalidateOnRefresh: true,
        }
      });
    }

    return () => {
      // Clean up only ScrollTriggers created in this scope
      ScrollTrigger.getAll().forEach(trigger => {
        if (trigger.vars.trigger === sectionRef.current) {
          trigger.kill();
        }
      });
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