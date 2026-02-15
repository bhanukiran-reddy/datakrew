// Server component - structure renders immediately
import HeroContent from './HeroContent';
import DarkVeilClient from './DarkVeilClient';
import styles from "./hero.module.css";

export default function Hero() {
    return (
        <div className={styles.heroContainer}>
            {/* Client component loads immediately but doesn't block server render */}
            <DarkVeilClient />
            {/* Server-rendered content - paints immediately */}
            <HeroContent />
        </div>
    );
}