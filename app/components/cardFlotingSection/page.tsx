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
    
    // Cache DOM queries once
    const texts = gsap.utils.toArray<HTMLElement>(
      sectionRef.current.querySelectorAll('.reveal-text')
    );

    const triggers: ScrollTrigger[] = [];

    // 1. PIN THE SECTION
    const pinTrigger = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: 'top top',
      end: `+=${viewportHeight * 1.5}`,
      pin: true,
      pinSpacing: true,
      anticipatePin: 1,
    });
    triggers.push(pinTrigger);

    // 2. REVEAL TEXT ON ENTER
    if (texts.length > 0) {
      const textAnimation = gsap.fromTo(texts,
        { y: 100, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.2,
          stagger: 0.2,
          ease: 'power2.out', // Changed from power4.out for lighter calculation
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 40%',
            toggleActions: 'play none none reverse',
          }
        }
      );
      if (textAnimation.scrollTrigger) {
        triggers.push(textAnimation.scrollTrigger);
      }
    }

    // 3. REVEAL CARDS FIRST (on section enter)
    const cardRevealAnimation = gsap.fromTo(cardsContainerRef.current,
      { 
        opacity: 0,
        y: 1000,
      },
      {
        opacity: 1,
        y: 1000,
        duration: 1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        }
      }
    );
    if (cardRevealAnimation.scrollTrigger) {
      triggers.push(cardRevealAnimation.scrollTrigger);
    }

    // 4. MOVE CARDS UP ON SCROLL (after reveal)
    // Enable GPU acceleration and optimize
    gsap.set(cardsContainerRef.current, { force3D: true, willChange: 'transform' });
    
    const cardMoveAnimation = gsap.to(cardsContainerRef.current,
      {
        y: 400 - (viewportHeight * 0.5),
        ease: 'power1.inOut',
        force3D: true, // GPU acceleration
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: `+=${viewportHeight * 1.5}`,
          scrub: 1,
          onEnter: () => {
            // Add will-change only when animation starts
            gsap.set(cardsContainerRef.current, { willChange: 'transform' });
          },
          onLeave: () => {
            // Remove will-change when animation ends
            gsap.set(cardsContainerRef.current, { willChange: 'auto' });
          },
          onEnterBack: () => {
            gsap.set(cardsContainerRef.current, { willChange: 'transform' });
          },
          onLeaveBack: () => {
            gsap.set(cardsContainerRef.current, { willChange: 'auto' });
          },
        }
      }
    );
    if (cardMoveAnimation.scrollTrigger) {
      triggers.push(cardMoveAnimation.scrollTrigger);
    }

    return () => {
      // Clean up stored triggers
      triggers.forEach(trigger => trigger.kill());
      // Reset will-change
      gsap.set(cardsContainerRef.current, { willChange: 'auto', force3D: false });
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