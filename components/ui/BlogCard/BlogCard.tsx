"use client";

import styles from "./BlogCard.module.css";
import Link from "next/link";

export interface BlogCardProps {
  category?: string;

  image: string;
  /** CMS featured-image alt; falls back to title when omitted. */
  imageAlt?: string;
  title: string;
  excerpt?: string;
  date?: string;
  slug?: string;
  linkUrl?: string;
  linkText?: string;
  time?: string;
  locationIcon?: string;
  clockIcon?: string;
  hideCategory?: boolean;
  categoryStyle?: "bubble" | "text";
  onClick?: (e: React.MouseEvent) => void;

  target?: string;
  dateBadge?: string;
  categoryClassName?: string;
  
}

export default function BlogCard({
  category,
  image,
  imageAlt,
  title,
  excerpt,
  date,
  slug,
  linkUrl,
  linkText,
  time,
  locationIcon,
  clockIcon,
  hideCategory,
  categoryStyle = "bubble",
  onClick,
  target,
  dateBadge,
  categoryClassName,
  
}: BlogCardProps) {
  return (
    <div className={styles.blogCard}>
      <div className={styles.blogCardImage}>
        <img
          src={image || "/blog/default.webp"}
          alt={imageAlt?.trim() || title || "Blog"}
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          onError={(e) => { (e.target as HTMLImageElement).src = "/blog/default.webp"; }}
        />
        {((!hideCategory && category && categoryStyle === "bubble") || dateBadge) && (
          <span className={styles.categoryLabel} dangerouslySetInnerHTML={{ __html: (dateBadge || category) as string }} />
        )}
      </div>
      <div className={styles.blogCardContent}>
        <div className={styles.blogCardContentTop}> 
        {date && <span className={styles.blogDate}>{date}</span>}
        {!hideCategory && category && categoryStyle === "text" && (
          <p className={`${styles.categoryText} ${categoryClassName || ''}`} dangerouslySetInnerHTML={{ __html: category }} />
        )}
        <h2 className={styles.blogCardTitle}>{title}</h2>
        {excerpt && (
          <div className={`${styles.blogCardDescription} ${locationIcon ? styles.locationDesc : ''}`}>
            {locationIcon && (
              <i className="fa-kit fa-location" />
            )}
            <p dangerouslySetInnerHTML={{ __html: excerpt }} />
          </div>
        )}

        {time && (
          <div className={styles.blogCardDescription}>
            {clockIcon && <i className={clockIcon}></i>}
            <span className={styles.time}> {time}</span>
          </div>
        )}
        </div>
        <div className={styles.blogCardFooter}>
          {onClick ? (
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onClick(e);
              }}
              className={`${styles.blogCardLink} iconLink tertiaryCta`}
              style={{ background: "transparent", border: "none", padding: 0, cursor: "pointer", fontFamily: "inherit" }}
            >
              {linkText || "Read more"}{" "}
              <i className="icon fa-kit fa-right-arrow"></i>
            </button>
          ) : (
            <Link
              href={linkUrl || (slug ? `/blog/${slug}` : "#")}
              className={`${styles.blogCardLink} iconLink tertiaryCta`}
              target={target}
            >
              {linkText || "Read more"}{" "}
              <i className="icon fa-kit fa-right-arrow"></i>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
