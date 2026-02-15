'use client';

import { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { useGSAP } from '@gsap/react';
import styles from './LogisticsAnimationSection.module.css';

// Register GSAP Plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);
}

// --- IMAGE COMPONENTS ---
const RoadImage = ({ src, alt, isActive, priority }: { src: string; alt: string; isActive: boolean; priority?: boolean }) => {
  return (
    <div className={styles.roadImageContainer}>
      <Image
        src={src}
        alt={alt}
        fill
        className={styles.roadImage}
        style={{ 
          opacity: isActive || priority ? 1 : 0,
          visibility: isActive || priority ? 'visible' : 'hidden'
        }} // Keep space reserved to prevent CLS
        loading={priority ? "eager" : "lazy"}
        priority={priority}
        quality={85}
        sizes="(max-width: 768px) 100vw, 58vw"
      />
    </div>
  );
};

const TruckImage = ({ src, alt, isActive, priority }: { src: string; alt: string; isActive: boolean; priority?: boolean }) => {
  return (
    <div className={styles.truckImageContainer}>
      <Image
        src={src}
        alt={alt}
        width={256}
        height={160}
        className={styles.truckImage}
        style={{ 
          opacity: isActive || priority ? 1 : 0,
          visibility: isActive || priority ? 'visible' : 'hidden'
        }} // Keep space reserved to prevent CLS
        loading={priority ? "eager" : "lazy"}
        priority={priority}
        quality={85}
        sizes="(max-width: 768px) 30vw, 15vw"
      />
    </div>
  );
};

// --- CONTENT DATA ---
const SLIDES = [
  {
    id: 1,
    title: "Logistics & Delivery",
    desc: "Predictive range and SOC planning tuned for congestion and charging gaps, ensuring on-time deliveries.",
    cta: "Download whitepaper",
    tags: ["Predictive breakdown alerts", "Fuel & energy optimization", "Driver fatigue monitoring"],
    truckImage: "/truck1.png",
    roadImage: "/truck1road.png"
  },
  {
    id: 2,
    title: "Long Haul Transport",
    desc: "Optimized route planning for cross-country fleets with integrated weather and traffic analysis.",
    cta: "View Case Study",
    tags: ["Real-time cargo tracking", "Automated compliance logging", "Fleet maintenance scheduling"],
    truckImage: "/truck2.png",
    roadImage: "/truck2road.png"
  },
  {
    id: 3,
    title: "Logistics & Delivery",
    desc: "Predictive range and SOC planning tuned for congestion and charging gaps, ensuring on-time deliveries.",
    cta: "Download whitepaper",
    tags: ["Predictive breakdown alerts", "Fuel & energy optimization", "Driver fatigue monitoring"],
    truckImage: "/truck1.png",
    roadImage: "/truck1road.png"
  },
  {
    id: 4,
    title: "Long Haul Transport",
    desc: "Optimized route planning for cross-country fleets with integrated weather and traffic analysis.",
    cta: "View Case Study",
    tags: ["Real-time cargo tracking", "Automated compliance logging", "Fleet maintenance scheduling"],
    truckImage: "/truck2.png",
    roadImage: "/truck2road.png"
  }
];

export default function LogisticsAnimationSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const prevActiveIndexRef = useRef<number>(0); // Track previous active index

  // NEW: Ref to track if we are programmatically skipping slides
  const isSkippingRef = useRef(false);

  // Auto-advance timer ref
  const autoAdvanceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const userInteractedRef = useRef(false); // Track if user manually clicked

  // Refs
  const roadsRef = useRef<(HTMLDivElement | null)[]>([]);
  const trucksRef = useRef<(HTMLDivElement | null)[]>([]);
  const contentRef = useRef<(HTMLDivElement | null)[]>([]);

  // Position mapping based on slide ID (not index, so order changes don't affect positioning)
  // Since we fixed the aspect ratio, these % values will now be 
  // consistently relative to the visual road features.
  const getTruckLeftPosition = (slideId: number): string => {
    const positionMap: { [key: number]: string } = {
      1: '5%',   // Adjusted slightly inward
      2: '20%',
      3: '5%',
      4: '20%',
    };
    return positionMap[slideId] || '5%';
  };

  // 1. SETUP SCROLL LISTENER & INITIAL STATE FIX
  // This just watches the scroll position and updates 'activeIndex'
  useGSAP(() => {
    if (!containerRef.current) return;

    const trigger = ScrollTrigger.create({
      trigger: containerRef.current,
      start: "top top",
      end: "+=2000", // Scroll distance
      pin: true,
      pinSpacing: true, // Ensure this is TRUE to push the Outcomes section down
      anticipatePin: 1, // Smooths out the transition
      // FIX 1: Calculate initial state immediately on creation
      onRefresh: (self) => {
        if (isSkippingRef.current) return;
        const newIndex = Math.round(self.progress * (SLIDES.length - 1));
        setActiveIndex(newIndex);
        // If we reload on slide 2, set prev to 2 so we don't animate from 0 to 2
        if (prevActiveIndexRef.current === 0 && newIndex !== 0) {
          prevActiveIndexRef.current = newIndex;
        }
      },
      onUpdate: (self) => {
        // IMPORTANT: If we are clicking a button (skipping), ignore scroll updates
        if (isSkippingRef.current) return;

        // Calculate index based on scroll progress (0.0 to 1.0)
        const newIndex = Math.round(self.progress * (SLIDES.length - 1));
        setActiveIndex(prev => {
          if (prev !== newIndex) return newIndex;
          return prev;
        });
      },
      onToggle: (self) => {
        // Pause/resume auto-advance based on section visibility
        if (self.isActive) {
          startAutoAdvance(); // Restart timer when entering
        } else {
          // Stop timer when leaving
          if (autoAdvanceTimerRef.current) {
            clearInterval(autoAdvanceTimerRef.current);
            autoAdvanceTimerRef.current = null;
          }
        }
      }
    });

    // Force a refresh to ensure OutcomesSection knows where this ends
    ScrollTrigger.refresh();

    // FIX 1 (Edge Case): Force check immediately in case onRefresh doesn't fire fast enough
    const p = trigger.progress;
    if (!isNaN(p)) {
      const initIdx = Math.round(p * (SLIDES.length - 1));
      if (initIdx !== activeIndex) {
        setActiveIndex(initIdx);
        prevActiveIndexRef.current = initIdx;
      }
    }

    return () => trigger.kill();
  }, { scope: containerRef });

  // 2. INITIAL CENTERING FOR ALL CARDS
  useGSAP(() => {
    // Center all content cards initially
    contentRef.current.forEach((card) => {
      if (card) {
        gsap.set(card, { xPercent: -50, yPercent: -50 });
      }
    });
  }, { scope: containerRef });

  // 3. TRIGGER ANIMATION WHEN 'activeIndex' CHANGES
  useGSAP(() => {
    const road = roadsRef.current[activeIndex];
    const truck = trucksRef.current[activeIndex];
    const content = contentRef.current[activeIndex];

    if (!road || !truck || !content) return;

    // A. ANIMATE OUT PREVIOUS SLIDE (if exists and different from current)
    const tl = gsap.timeline();
    const prevIndex = prevActiveIndexRef.current;
    let hasExitAnimation = false;

    // Only animate out if:
    // 1. There was a previous active slide
    // 2. It's different from current
    // 3. It's a valid index
    // 4. The elements exist
    if (prevIndex !== activeIndex && prevIndex >= 0 && prevIndex < SLIDES.length) {
      const prevRoad = roadsRef.current[prevIndex];
      const prevTruck = trucksRef.current[prevIndex];
      const prevContent = contentRef.current[prevIndex];

      // Check if previous elements actually exist before trying to animate them
      if (prevRoad && prevTruck && prevContent) {
        hasExitAnimation = true;

        // Get current visual state or default to 0
        const currentX = gsap.getProperty(prevTruck, "x") as number || 0;

        // Truck Exit
        tl.to(prevTruck, {
          x: currentX + 150, // Continue moving right
          y: -50,            // Fly up
          opacity: 0,
          duration: 0.6,
          ease: "power2.in"
        }, 0);

        // Road Exit
        tl.to(prevRoad, {
          yPercent: 100,
          opacity: 0,
          duration: 0.6,
          ease: "power2.in"
        }, 0);

        // Content Exit
        tl.to(prevContent, {
          autoAlpha: 0,
          visibility: "hidden",
          duration: 0.4
        }, 0);
      }
    }

    // --- THE FIX IS HERE ---
    // Hide all inactive slides immediately via SET, 
    // BUT skip the 'prevIndex' because we just scheduled an animation for it above.
    SLIDES.forEach((_, i) => {
      // Only hide if it's NOT the active one AND NOT the one exiting
      if (i !== activeIndex && i !== prevIndex) {
        const c = contentRef.current[i];
        const r = roadsRef.current[i];
        const t = trucksRef.current[i];

        if (c) gsap.set(c, { opacity: 0, visibility: "hidden" });
        if (r) gsap.set(r, { opacity: 0, yPercent: 100 });
        if (t) gsap.set(t, { opacity: 0, x: 0, y: -30 });
      }
    });

    // Update previous index immediately after setting up the timeline
    prevActiveIndexRef.current = activeIndex;

    // B. PREPARE NEW SLIDE (Start positions)
    // We wait for the exit animation (approx 0.4s into it) before bringing in the new one
    const delay = hasExitAnimation ? 0.4 : 0;

    // Set starting positions for the INCOMING slide
    // Center the card first, then offset slightly for animation
    tl.set(content, { 
      autoAlpha: 0, 
      xPercent: -50, 
      yPercent: -45, // -50 (center) + 5 (slight offset) = -45
      visibility: "visible", 
      x: 0 
    }, delay);
    tl.set(road, { yPercent: 100, opacity: 0, visibility: "visible" }, delay);
    tl.set(truck, { y: -50, x: -20, opacity: 0, visibility: "visible" }, delay);

    // C. PLAY ENTRY ANIMATION

    // 1. Road Slides Up
    tl.to(road, {
      yPercent: 0,
      opacity: 1,
      duration: 0.8,
      ease: "power2.out"
    }, delay);

    // 2. Truck Drops & Lands
    tl.to(truck, {
      y: 0,
      x: 0,
      opacity: 1,
      duration: 1.2,
      ease: "bounce.out"
    }, delay + 0.1);

    // 3. Content Fades In
    tl.to(content, {
      autoAlpha: 1,
      xPercent: -50, // Keep centered horizontally
      yPercent: -50, // Center vertically
      visibility: "visible",
      duration: 0.5
    }, delay + 0.3);

    // 4. Truck "Drives" diagonally along the road (Idle animation)
    tl.to(truck, {
      x: 50,
      y: 15,
      duration: 3,
      ease: "none"
    }, delay + 1.1);

  }, { dependencies: [activeIndex], scope: containerRef });

  // Helper function to check if element is in viewport
  const isElementInViewport = (element: HTMLElement, threshold: number = 0.2): boolean => {
    const rect = element.getBoundingClientRect();
    const windowHeight = window.innerHeight || document.documentElement.clientHeight;
    const windowWidth = window.innerWidth || document.documentElement.clientWidth;
    
    const visibleHeight = Math.min(rect.bottom, windowHeight) - Math.max(rect.top, 0);
    const visibleWidth = Math.min(rect.right, windowWidth) - Math.max(rect.left, 0);
    const visibleArea = visibleHeight * visibleWidth;
    const elementArea = rect.height * rect.width;
    
    return visibleArea >= elementArea * threshold;
  };

  // 3. UPDATED BUTTON CLICK HANDLER
  const handleNavClick = (index: number) => {
    const container = containerRef.current;
    if (!container) return;

    // Mark that user manually interacted
    userInteractedRef.current = true;

    // Clear auto-advance timer
    if (autoAdvanceTimerRef.current) {
      clearInterval(autoAdvanceTimerRef.current);
      autoAdvanceTimerRef.current = null;
    }

    // 1. Set Skipping Flag to TRUE (Stops ScrollTrigger updates)
    isSkippingRef.current = true;

    // 2. Immediately update state to the target index
    // This triggers the animation for the target slide immediately, skipping intermediates
    setActiveIndex(index);

    const st = ScrollTrigger.getAll().find(st => st.pin === container);
    if (st) {
      const progress = index / (SLIDES.length - 1);
      const scrollPos = st.start + (st.end - st.start) * progress;

      // 3. Scroll the window visually
      gsap.to(window, {
        scrollTo: scrollPos,
        duration: 1,
        ease: "power2.inOut",
        onComplete: () => {
          // 4. Reset Flag when scroll is done
          isSkippingRef.current = false;
          // Restart auto-advance after user interaction
          startAutoAdvance();
        }
      });
    }
  };

  // 4. UPDATED AUTO-ADVANCE FUNCTIONALITY
  const startAutoAdvance = () => {
    // Clear any existing timer
    if (autoAdvanceTimerRef.current) {
      clearInterval(autoAdvanceTimerRef.current);
    }

    // Set up new timer to advance every 30 seconds
    autoAdvanceTimerRef.current = setInterval(() => {
      // CHECK: Is the section actually visible to the user?
      const container = containerRef.current;
      if (!container) return;

      const isVisible = isElementInViewport(container, 0.2); // 20% visibility threshold
      
      if (!isVisible) {
        // If the user is elsewhere, we just update the index silently 
        // WITHOUT calling the GSAP scroll animation.
        setActiveIndex((prevIndex) => (prevIndex + 1) % SLIDES.length);
        return;
      }

      // If visible, proceed with the animated scroll
      setActiveIndex((prevIndex) => {
        const nextIndex = (prevIndex + 1) % SLIDES.length;

        if (container) {
          isSkippingRef.current = true;
          const st = ScrollTrigger.getAll().find(st => st.pin === container);
          if (st) {
            const progress = nextIndex / (SLIDES.length - 1);
            const scrollPos = st.start + (st.end - st.start) * progress;

            gsap.to(window, {
              scrollTo: scrollPos,
              duration: 1,
              ease: "power2.inOut",
              onComplete: () => {
                isSkippingRef.current = false;
              }
            });
          }
        }
        return nextIndex;
      });
    }, 30000); // 30 seconds
  };

  // Start auto-advance on mount (only if section is visible)
  useEffect(() => {
    // Check if section is visible before starting
    if (containerRef.current && isElementInViewport(containerRef.current, 0.2)) {
      startAutoAdvance();
    }

    // Cleanup on unmount
    return () => {
      // Clear auto-advance timer
      if (autoAdvanceTimerRef.current) {
        clearInterval(autoAdvanceTimerRef.current);
        autoAdvanceTimerRef.current = null;
      }

      // Kill all ScrollTrigger instances to prevent memory leaks
      ScrollTrigger.getAll().forEach(trigger => {
        if (trigger.vars.trigger === containerRef.current) {
          trigger.kill();
        }
      });
    };
  }, []);

  return (
    <section className={styles.section} aria-label="Logistics Services">
      {/* SECTION TITLE AND DESCRIPTION */}
      <div className={styles.sectionHeader}>
        <div className="container">
          <h2 className="sectionTitle">Built for <span> every fleet environment</span></h2>
          <p className="sectionDescription">
          Deploy once. Scale across mixed fleets without changing your operating model.</p>
        </div>
      </div>

      {/* PINNED CONTAINER */}
      <div ref={containerRef} className={styles.pinnedContainer}>
        {/* Add a wrapper inside the pinned container for extra spacing control */}
        <div className={styles.animationWrapper}>
          <div className={styles.mainContainer}>

          {/* LEFT SCENE (Road + Truck) */}
          <div className={styles.leftScene}>
            {SLIDES.map((slide, i) => {
              const isActive = activeIndex === i;
              const isPriority = i === 0; // First slide gets priority loading

              return (
                <div key={slide.id} className={styles.slideContainer}>

                  {/* Truck Wrapper */}
                  <div
                    ref={el => { trucksRef.current[i] = el }}
                    className={styles.truckWrapper}
                    style={{ left: getTruckLeftPosition(slide.id) }}
                  >
                    <TruckImage
                      src={slide.truckImage || ''}
                      alt={`Truck ${slide.id}`}
                      isActive={isActive}
                      priority={isPriority}
                    />
                  </div>

                  {/* Road Wrapper */}
                  <div
                    ref={el => { roadsRef.current[i] = el }}
                    className={styles.roadWrapper}
                  >
                    <RoadImage
                      src={slide.roadImage || ''}
                      alt={`Road ${slide.id}`}
                      isActive={isActive}
                      priority={isPriority}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* --- RIGHT CONTENT --- */}
          {/* Added 'flex justify-center' to parent to help alignment calculations */}
          <div className={styles.rightContent}>
            {SLIDES.map((slide, i) => (
              <div
                key={slide.id}
                ref={el => { contentRef.current[i] = el }}
                className={styles.contentCard}
                style={{ 
                  visibility: i === 0 ? 'visible' : 'hidden',
                  opacity: i === 0 ? 1 : 0
                }}
                aria-hidden={i !== activeIndex}
              >
                <h3 className={styles.contentTitle}>{slide.title}</h3>
                <p className={styles.contentDescription}>
                  {slide.desc}
                </p>

                <div className={styles.tagsContainer}>
                  {slide.tags.map(tag => (
                    <div key={tag} className={styles.tagItem}>
                      <div className={styles.tagIcon}></div>
                      {tag}
                    </div>
                  ))}
                </div>

                <div className={styles.buttonContainer}>
                  <button className={styles.primaryButton}>
                    {slide.cta} →
                  </button>
                  <button className={styles.secondaryButton}>
                    Learn more →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
        </div>

        {/* NAVIGATION DOTS */}
        <div className={styles.navDotsContainer}>
          {SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => handleNavClick(i)}
              className={`${styles.navDot} ${activeIndex === i ? styles.navDotActive : ''}`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>

      </div>

      {/* Spacer below */}
      <div className={styles.spacerSection}>
        Next Section
      </div>
    </section>
  );
}
