'use client';

import GlassButton from "../ui/glasscta/page";
import DarkVeil from "./DarkVeil";
import styles from "./hero.module.css";

export default function Hero() {
    return (
        <div className={styles.heroContainer}>
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
            <div className={styles.heroContent}>

                <h1 className={styles.heroTitle}>
                    Your <span> global mobility
                        intelligence</span> partner
                </h1>
                <p className={styles.heroDescription}>Data inception. Inference. Decisions.</p>
                <div className={styles.heroButtons}>
                    <GlassButton icon="fleetCtaIcon.svg" text="Fleet" />
                    <GlassButton icon="ome.svg" text="OEM" />
                </div>


            </div>
        </div>
    );
}