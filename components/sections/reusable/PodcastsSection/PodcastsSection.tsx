import PodcastCard from "@/components/ui/PodcastCard/podcastCard";
import styles from "./PodcastsSection.module.css";

export default function PodcastsSection({ podcasts }: { podcasts: any[] }) {
    if (!podcasts || podcasts.length === 0) return null;

    return (
        <section className={styles.podcastsSection}>
            <div className="container">
                <h2 className={`${styles.podcastHeading} sectionTitle`}>
                    Recent <span>videos & podcasts</span>

                </h2>
                <div className={styles.podcastsGrid}>
                    {podcasts.map((podcast, index) => (
                        <PodcastCard
                            key={index}
                            {...podcast}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}