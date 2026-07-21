'use client';

import { useState, useEffect, useRef } from 'react';
import styles from './news.module.css';

interface TocItem {
  id: string;
  label: string;
}

interface BlogLayoutClientProps {
  category: string;
  authorName: string;
  authorDesignation: string;
  authorImage: string;
  children: React.ReactNode;
  tocItems: TocItem[];
}

export default function BlogLayoutClient({
  category,
  authorName,
  authorDesignation,
  authorImage,
  children,
  tocItems
}: BlogLayoutClientProps) {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeId, setActiveId] = useState('');
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      // Calculate Scroll Progress based on Article Content area
      if (contentRef.current) {
        const rect = contentRef.current.getBoundingClientRect();
        const contentHeight = contentRef.current.offsetHeight;
        const visibleHeight = window.innerHeight;

        // Progress starts when content top enters viewport, ends when content bottom enters viewport
        const scrolled = (-rect.top) / (contentHeight - visibleHeight + 100); // +100 for some buffer
        const progress = Math.min(Math.max(Math.round(scrolled * 100), 0), 100);
        setScrollProgress(progress);
      }

      // Calculate Active Section for TOC
      const sectionElements = tocItems.map(item => document.getElementById(item.id));
      const currentSection = sectionElements.reverse().find(el => {
        if (!el) return false;
        const rect = el.getBoundingClientRect();
        return rect.top <= 150; // Offset for sticky header
      });

      if (currentSection) {
        setActiveId(currentSection.id);
      }
    };

    // Initial check on mount
    handleScroll();

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [tocItems]);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 100, // Offset for sticky header
        behavior: 'smooth'
      });
    }
  };

  return (
    <section className={styles.blogLayoutSection}>
      <div className="container">
        <div className={styles.blogContentContainer}>
          <aside className={styles.blogSidebar}>
            {/* <div className={styles.sidebarSection}>
              <h2 className={styles.sidebarTitle}>Category</h2>
              <p className={styles.categoryTag}>{category}</p>
            </div> */}

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

            {/* <div className={styles.tocCard}>
              <h2 className={styles.sidebarTitle}>Table of contents</h2>
              <ul className={styles.tocList}>
                {tocItems.map((item) => (
                  <li
                    key={item.id}
                    className={`${styles.tocItem} ${activeId === item.id ? styles.tocItemActive : ''}`}
                    data-target-id={item.id}
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
            </div> */}
          </aside>

          {/* Main Content */}
          <div className={styles.blogMainContent} ref={contentRef}>
            <article className={styles.newsArticleBody}>
              {children}
            </article>

            <div className={styles.authorSeparator} />

            {/* <div className={styles.authorCard}>
              <div className={styles.authorImage}>
                <Image
                  src="/blogauthor.jpg"
                  alt={authorName}
                  width={100}
                  height={90}
                />
              </div>
              <div className={styles.authorInfo}>
                <h2 className={styles.authorName}>{authorName}</h2>
                <p>{authorDesignation}</p>
              </div>
            </div> */}
          </div>
        </div>
      </div>
    </section>
  );
}
const blogStyles = styles;
