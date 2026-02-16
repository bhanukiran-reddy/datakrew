import styles from "./testimony.module.css";
import Image from "next/image";

export default function Testimony() {
    return (
        <section className={styles.testimonyContainer}>
            <div className={styles.testimonyHeader}>
                <h2 className="sectionTitle">Our <span>customers</span> speak</h2>
                <p className="sectionDescription">Compatible across Chinese OEMs and global OEM ecosystems.</p>
            </div>
            <div className={styles.testimonyContent}>
                <div>
                    <h3 className={styles.testimonyName}>Alistair Cromwell</h3>
                    <p className={styles.testimonyRole}>Fleet operator, XYZ Company</p>
                </div>
                <div className={styles.testimonyCarouselContainer}>
                    <div className={styles.testimonyCardImage}>
                    {/* image carousel images */}

                    </div>
                </div>
            </div>
        </section>
    )
}