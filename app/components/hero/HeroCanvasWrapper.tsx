'use client';

import dynamic from 'next/dynamic';
import styles from './hero.module.css';

// Dynamically import canvas to prevent blocking initial render
const HeroCanvas = dynamic(() => import('./HeroCanvas'), {
  ssr: false,
  loading: () => <div className={styles.fallbackGradient} />
});

export default function HeroCanvasWrapper() {
  return <HeroCanvas />;
}
