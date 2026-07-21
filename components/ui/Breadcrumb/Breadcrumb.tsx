"use client";

import React from "react";
import Link from "@/components/ui/Link/Link";
import styles from "./Breadcrumb.module.css";

interface BreadcrumbItem {
  label: React.ReactNode;
  href?: string;
}

interface BreadcrumbProps {
  items?: BreadcrumbItem[];
  showHome?: boolean;
  className?: string;
}

function isHomeItem(item: BreadcrumbItem): boolean {
  if (item.href === "/") return true;
  const label = typeof item.label === "string" ? item.label : "";
  return label.trim().toLowerCase() === "home";
}

export default function Breadcrumb({
  items = [],
  showHome = true,
  className,
}: BreadcrumbProps) {
  // When we show the home icon, don't also show "Home" as the first text item
  const displayItems =
    showHome && items.length > 0 && isHomeItem(items[0])
      ? items.slice(1)
      : items;

  return (
    <nav
      className={`${styles.breadcrumb} ${className || ""}`}
      aria-label="Breadcrumb"
    >
     
        <div className={styles.breadcrumbWrapper}>
          {showHome && (
            <>
              <Link href="/" aria-label="Home">
                <i className={`fa-kit fa-home ${styles.homeIcon}`}></i>
              </Link>
              {displayItems.length > 0 && (
                <span className={styles.breadcrumbSeparator}>
                  <i className={`fa-kit fa-right-nav ${styles.separatorIcon}`}></i>
                </span>
              )}
            </>
          )}

          {displayItems.map((item, index) => {
            const isLast = index === displayItems.length - 1;

            return (
              <React.Fragment key={index}>
                {item.href && !isLast ? (
                  <Link href={item.href}>{item.label}</Link>
                ) : (
                  <span>{item.label}</span>
                )}

                {!isLast && (
                  <span className={styles.breadcrumbSeparator}>
                    <i className={`fa-kit fa-right-nav ${styles.separatorIcon}`}></i>
                  </span>
                )}
              </React.Fragment>
            );
          })}
        </div>
    </nav>
  );
}
