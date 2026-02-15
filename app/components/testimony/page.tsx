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
                <div><h3 className="testimonyName">Alistair Cromwell</h3>
                <p>Fleet operator, XYZ Company</p></div>
                <div className={styles.testimonyCard}>
                    <div className={styles.testimonyCardImage}>
                        <Image src="/testimony1.png" alt="Testimony 1" width={100} height={100} />
                    </div>
                </div>
            </div>
        </section>
    )
}