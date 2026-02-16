'use client';

import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import styles from './outcoms.module.css';

// Register GSAP Plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const outcomesData = [
  { percentage: '50%', title: 'higher safety scores', description: 'GuardianAI escalates risks in real-time.', color: '#93D772', speed: 1.2, offset: 0 },
  { percentage: '20%', title: 'more efficiency', description: 'Optimized operations and reduced downtime.', color: '#93D772', speed: 1.8, offset: 100 },
  { percentage: '10%', title: 'higher resale value', description: 'Battery intelligence maintains health.', color: '#93D772', speed: 1.4, offset: 50 },
  { percentage: '15%', title: 'lower costs', description: 'Reduced insurance premiums via data.', color: '#93D772', speed: 2.2, offset: 150 },
];

export default function OutcomesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useGSAP(() => {
    if (!sectionRef.current) return;

    // 1. PIN THE ENTIRE SECTION
    // This keeps the 70vh section locked on screen.
    // The 'end' value determines how much the user has to scroll to finish the cards.
    ScrollTrigger.create({
      trigger: sectionRef.current,
      start: "top top",
      end: "+=1500", // Total scroll effort to finish the section
      pin: true,
      pinSpacing: true, // Creates space for the scroll distance
      anticipatePin: 1
    });

    // 2. ANIMATE CARDS
    // Cards start below the section and scroll up over the text
    if (typeof window === 'undefined') return;
    const viewportHeight = window.innerHeight;
    // Cards are centered, so we animate them from below to above
    // Using viewport-relative values so they're visible
    const startY = viewportHeight * 0.6; // Start 60% of viewport below center
    const endY = -viewportHeight * 0.6; // End 60% of viewport above center
    
    cardsRef.current.forEach((card, i) => {
      if (!card) return;
      const speed = outcomesData[i].speed;

      gsap.fromTo(card, 
        { y: startY, opacity: 0 }, // Start below the visible area
        {
          y: endY, // End above the visible area
          opacity: 1,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: "+=1500",
            scrub: 0.5 + (i * 0.2), // Slight lag between cards for "staggered" feel
          }
        }
      );
    });

    // 3. TEXT REVEAL
    const texts = gsap.utils.toArray<HTMLElement>(
      sectionRef.current.querySelectorAll('.reveal-text')
    );
    
    if (texts.length > 0) {
      gsap.fromTo(texts, 
        { opacity: 0, y: 30 },
        { 
          opacity: 1, 
          y: 0, 
          stagger: 0.1,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 40%",
            toggleActions: "play none none reverse"
          }
        }
      );
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
    <div className={styles.sectionWrapper}>
      <section ref={sectionRef} className={styles.scrollSection}>
        <div className={styles.centerContent}>
          <h1 className="reveal-text">Outcomes you can <span className={styles.highlight}>measure</span></h1>
          <p className="reveal-text">Operational certainty for uptime and safety.</p>
        </div>

        <div className={styles.cardsRow}>
          {outcomesData.map((outcome, index) => (
            <div 
              key={index} 
              className={styles.card}
              ref={(el) => { cardsRef.current[index] = el; }}
              style={{ marginTop: `${outcome.offset}px` }}
            >
              <div className={styles.cardPercentage} style={{ color: outcome.color }}>{outcome.percentage}</div>
              <h3 className={styles.cardTitle}>{outcome.title}</h3>
              <p className={styles.cardDescription}>{outcome.description}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}