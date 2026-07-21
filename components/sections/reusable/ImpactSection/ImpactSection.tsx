"use client";

import Image from "next/image";
import styles from "./ImpactSection.module.css";
import ImpactStats, { type ImpactStat } from "../ImpactStats/ImpactStats";

interface ImpactItem {
  text: string;
}

interface ImpactSectionProps {
  title: string;
  description: string;
  items: ImpactItem[];
  stats: ImpactStat[];
  image: {
    url: string;
    alt?: string;
  };
  className?: string;
  id?: string;
}

export default function ImpactSection({
  title,
  description,
  items,
  stats,
  image,
  className,
  id,
}: ImpactSectionProps) {
  return (
    <section id={id} className={`${styles.impactSection} ${className || ""}`}>
      <div className="container">
        <div className={styles.impactWrapper}>
          <div className={styles.contentCol}>
            <h2 
              className="sectionTitle" 
              dangerouslySetInnerHTML={{ __html: title }} 
            />
            <p 
              className={styles.description} 
              dangerouslySetInnerHTML={{ __html: description }} 
            />
            
            <div className={styles.impactItemsGrid}>
              {items.map((item, index) => (
                <div key={index} className={styles.impactItem}>
                  <span className={styles.check}>
                    <i className="fa-kit fa-tick"></i>
                  </span>
                  <p className={styles.itemText}>{item.text}</p>
                </div>
              ))}
            </div>

            <ImpactStats stats={stats} className={styles.statsRow} />
          </div>

          <div className={styles.imageCol}>
            <div className={styles.imageWrapper}>
              <Image
                src={image.url}
                alt={image.alt?.trim() || "Impact visualization"}
                width={700}
                height={500}
                className={styles.impactImage}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
