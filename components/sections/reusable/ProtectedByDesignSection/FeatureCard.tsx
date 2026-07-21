'use client';

import React from 'react';
import styles from './ProtectedByDesignSection.module.css';

export type FeatureCardProps = {
  title: string;
  description: string;
};

/**
 * Reusable feature card – title (cyan) + description (white).
 * Figma: table-item, VERTICAL, padding 1rem, gap 1.5rem.
 */
export default class FeatureCard extends React.Component<FeatureCardProps> {
  render() {
    const { title, description } = this.props;
    return (
      <article className={styles.card}>
        <h3 className={styles.cardTitle} dangerouslySetInnerHTML={{ __html: title }} />
        <p className={styles.cardDescription}>{description}</p>
      </article>
    );
  }
}
