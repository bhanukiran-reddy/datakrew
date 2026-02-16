'use client';

import { useRef} from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import styles from './cardFlotingSection.module.css';

// Register GSAP Plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// 4 cards with specific positions:
// Row 1: Column 1, Row 2: Column 4, Row 3: Column 2, Row 4: Column 3
const outcomesData = [
  { percentage: '50%', title: 'higher safety scores', description: 'GuardianAI escalates risks in real-time.', color: '#93D772', column: 1 }, // Row 1, Column 1
  { percentage: '20%', title: 'more efficiency', description: 'Optimized operations and reduced downtime.', color: '#93D772', column: 4 }, // Row 2, Column 4
  { percentage: '10%', title: 'higher resale value', description: 'Battery intelligence maintains health.', color: '#93D772', column: 2 }, // Row 3, Column 2
  { percentage: '15%', title: 'lower costs', description: 'Reduced insurance premiums via data.', color: '#93D772', column: 4 }, // Row 4, Column 3
];

export default function OutcomesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const centerContentRef = useRef<HTMLDivElement>(null);
  const cardsContainerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!sectionRef.current || !centerContentRef.current || !cardsContainerRef.current) return;

    const viewportHeight = window.innerHeight;

    // 1. PIN THE SECTION
    ScrollTrigger.create({
      trigger: sectionRef.current,
      start: 'top top',
      end: `+=${viewportHeight * 1.5}`, // Pin for enough scroll distance
      pin: true,
      pinSpacing: true,
      anticipatePin: 1,
      invalidateOnRefresh: true,
    });

    // 2. REVEAL TEXT ON ENTER
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
              start: 'top 40%',
              toggleActions: 'play none none reverse',
              invalidateOnRefresh: true,
            }
          }
        );
      }
    }

    // 3. REVEAL CARDS FIRST (on section enter)
    gsap.fromTo(cardsContainerRef.current,
      { 
        opacity: 0,
        y: 1000, // Start 400px below
      },
      {
        opacity: 1,
        y: 1000, // Reveal at 400px down (keep them down)
        duration: 1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%', // Start revealing when section enters viewport
          toggleActions: 'play none none reverse',
          invalidateOnRefresh: true,
        }
      }
    );

    // 4. MOVE CARDS UP ON SCROLL (after reveal)
    gsap.to(cardsContainerRef.current,
      {
        y: 400 - (viewportHeight * 0.5), // Start from 400px down, move up smoothly
        ease: 'power1.inOut',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: `+=${viewportHeight * 1.5}`,
          scrub: 1, // Smooth, controlled movement (higher = smoother, less wavy)
          invalidateOnRefresh: true,
        }
      }
    );

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
          <div 
            key={index} 
            className={styles.card}
            style={{ gridColumn: outcome.column, gridRow: index + 1 }}
          >
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