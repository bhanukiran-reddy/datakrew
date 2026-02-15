import styles from "./page.module.css";
import Image from "next/image";

const parternersData = [
    {
        name: "Hyundai",
        image: "/hyndai.svg"
    },
    {
        name: "Partner 2",
        image: "/hyndai.svg"
    },
    {
        name: "Partner 3",
        image: "/hyndai.svg"
    },
    {
        name: "Partner 4",
        image: "/hyndai.svg"
    },
    {
        name: "Partner 5",
        image: "/hyndai.svg"
    },
    {
        name: "Partner 6",
        image: "/hyndai.svg"
    },
    {
        name: "Partner 7",
        image: "/hyndai.svg"
    },
    {
        name: "Partner 8",
        image: "/hyndai.svg"
    },
    {
        name: "Partner 9",
        image: "/hyndai.svg"
    },
    {
        name: "Partner 10",
        image: "/hyndai.svg"
    },
]

export default function Parterners() {
    return (
        <section className={styles.parternersContainer}>

            <div className={styles.parternersHeader}>
                <h2 className="sectionTitle"> <span>Our global</span> partners</h2>
                <p className="sectionDescription">Compatible across Chinese OEMs and global OEM ecosystems.</p>
            </div>
            <div className={styles.parternersContent}>
                <div className={styles.parternersCard}>
                    {/* First set of logos */}
                    {parternersData.map((partner) => (
                        <div key={partner.name} className={styles.parternersCardItem}>
                            <div className={styles.parternersCardItemImage}>
                                <Image src={partner.image} alt={partner.name} width={100} height={100} />
                            </div>
                        </div>
                    ))}
                    {/* Duplicate set for seamless loop */}
                    {parternersData.map((partner) => (
                        <div key={`${partner.name}-duplicate`} className={styles.parternersCardItem}>
                            <div className={styles.parternersCardItemImage}>
                                <Image src={partner.image} alt={partner.name} width={100} height={100} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}