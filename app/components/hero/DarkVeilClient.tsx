'use client';

import { useEffect, useState } from 'react';
import DarkVeil from './DarkVeil';
import styles from './hero.module.css';

export default function DarkVeilClient() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // Start immediately on client mount - no delay
    setIsMounted(true);
  }, []);

  // Render immediately on client - no lazy loading
  if (typeof window === 'undefined') {
    return null; // SSR: return null, client will hydrate immediately
  }

  return (
    <div className={styles.darkVeilWrapper}>
      {isMounted && (
        <DarkVeil
          hueShift={47}
          noiseIntensity={0.02}
          scanlineIntensity={0.1}
          speed={2}
          scanlineFrequency={2.0}
          warpAmount={0.1}
          resolutionScale={1}
          enableOnMobile={false}
          maxFPS={60}
        />
      )}
    </div>
  );
}
