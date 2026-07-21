'use client';

import { useState, useEffect, useRef } from 'react';
import styles from './blog.module.css';

interface TocItem {
  id: string;
  label: string;
  level: number;
}

interface BlogLayoutClientProps {
  children: React.ReactNode;
  tocItems: TocItem[];
}

export default function BlogLayoutClient({
  children,
  tocItems
}: BlogLayoutClientProps) {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeId, setActiveId] = useState('');
  const tocListRef = useRef<HTMLUListElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateProgress = () => {
      if (!contentRef.current) return;
      const element = contentRef.current;
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const rect = element.getBoundingClientRect();
      const elementTop = rect.top + scrollTop;
      const elementHeight = element.offsetHeight;
      const windowHeight = window.innerHeight;

      // Start counting when the content is 150px from top
      const startPoint = elementTop - 150;
      const scrollDistance = scrollTop - startPoint;

      // Reach 100% when the bottom of the element is visible
      const scrollableDistance = elementHeight - (windowHeight / 2);

      if (scrollableDistance > 0) {
        const progress = Math.min(Math.max(Math.round((scrollDistance / scrollableDistance) * 100), 0), 100);
        setScrollProgress(progress);
      } else {
        setScrollProgress(scrollTop > startPoint ? 100 : 0);
      }
    };

    window.addEventListener('scroll', updateProgress);
    updateProgress();
    return () => window.removeEventListener('scroll', updateProgress);
  }, []);

  useEffect(() => {
    const handleActiveSection = () => {
      const sectionElements = tocItems.map(item => document.getElementById(item.id));
      const currentSection = [...sectionElements].reverse().find(el => {
        if (!el) return false;
        const rect = el.getBoundingClientRect();
        return rect.top <= 165;
      });

      if (currentSection && currentSection.id !== activeId) {
        setActiveId(currentSection.id);

        if (tocListRef.current) {
          const activeItem = tocListRef.current.querySelector(`[data-target-id="${currentSection.id}"]`) as HTMLElement;
          if (activeItem) {
            const container = tocListRef.current;
            const itemTop = activeItem.offsetTop;
            const itemHeight = activeItem.offsetHeight;
            const containerHeight = container.offsetHeight;
            const scrollTop = container.scrollTop;

            if (itemTop < scrollTop) {
              container.scrollTo({ top: itemTop, behavior: 'smooth' });
            } else if (itemTop + itemHeight > scrollTop + containerHeight) {
              container.scrollTo({ top: itemTop + itemHeight - containerHeight, behavior: 'smooth' });
            }
          }
        }
      }
    };

    window.addEventListener('scroll', handleActiveSection);
    handleActiveSection();
    return () => window.removeEventListener('scroll', handleActiveSection);
  }, [tocItems, activeId]); // Added activeId to prevent stale closure loop

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const headerOffset = 160; // Align with sticky sidebar (10rem)
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const hasToc = tocItems && tocItems.length > 0;
  const hasSidebar = true; // Always show sidebar for progressive layout balance, or allow progress bar

  return (
    <section className={styles.blogLayoutSection}>
      <div className="container">
        <div className={styles.blogContentContainer}>
          {hasSidebar && (
            <aside className={styles.blogSidebar}>
              <div className={styles.sidebarSection}>
                <div className={styles.readSoFar}>
                  <h2 className={styles.sidebarTitle} style={{ margin: 0 }}>Read so far</h2>
                  <p className={styles.progressText}>{Math.round(scrollProgress)}%</p>
                </div>
                <div className={styles.progressContainer}>
                  <div
                    className={styles.progressBar}
                    style={{ width: `${scrollProgress}%` }}
                  ></div>
                </div>
              </div>

              {hasToc && (
                <div className={styles.tocCard}>
                  <h2 className={styles.sidebarTitle}>Table of contents</h2>
                  <ul className={styles.tocList} ref={tocListRef}>
                    {tocItems.map((item) => (
                      <li
                        key={item.id}
                        className={`${styles.tocItem} ${activeId === item.id ? styles.tocItemActive : ''}`}
                        data-target-id={item.id}
                        style={{ paddingLeft: item.level === 3 ? '1.5rem' : '0' }}
                      >
                        <div className={styles.tocTick}>
                          <i className={`fa-kit fa-tick`}></i>
                        </div>
                        <div>
                          <a
                            href={`#${item.id}`}
                            onClick={(e) => {
                              e.preventDefault();
                              scrollToSection(item.id);
                            }}
                            className={styles.tocLink}
                          >
                            {item.label}
                          </a>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </aside>
          )}

          {/* Main Content */}
          <div className={styles.blogMainContent} ref={contentRef}>
            <article className={styles.newsArticleBody}>
              {children}
            </article>
          </div>
        </div>
      </div>
    </section>
  );
}
