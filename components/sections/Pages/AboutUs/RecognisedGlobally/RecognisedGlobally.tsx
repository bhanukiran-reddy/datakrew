import Image from "next/image";
import styles from "./RecognisedGlobally.module.css";

const logos = [
  {
    id: 1,
    src: "/Layer_1.svg",
    alt: "Patent",
    width: 120,
    height: 60,
  },
  {
    id: 2,
    src: "/Layer_1.svg",
    alt: "Manufacturing Leadership",
    width: 120,
    height: 60,
  },
  {
    id: 3,
    src: "/Layer_1.svg",
    alt: "IdeaForge",
    width: 120,
    height: 60,
  },
  {
    id: 4,
    src: "/Layer_1.svg",
    alt: "Asia Pacific Awards",
    width: 120,
    height: 60,
  },
  {
    id: 5,
    src: "/Layer_1.svg",
    alt: "Innovation Award",
    width: 120,
    height: 60,
  },
  {
    id: 6,
    src: "/Layer_1.svg",
    alt: "Syfter",
    width: 120,
    height: 60,
  },
];

export default function RecognisedGlobally() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <h2 className={`sectionTitle ${styles.headingHighlight}`}>
          Recognised <span>globally</span>
        </h2>

        <div className={styles.logoGrid}>
          {logos.map((logo) => (
            <div key={logo.id} className={styles.logoCard}>
              <Image
                src={logo.src}
                alt={logo.alt}
                width={logo.width}
                height={logo.height}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
