// Server component - renders immediately
import GlassButton from "../ui/glasscta/page";
import styles from "./hero.module.css";

export default function HeroContent() {
    return (
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
    );
}
