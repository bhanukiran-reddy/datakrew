import Image from "next/image";
import NumberTicker from "@/components/sections/reusable/NumberTicker/NumberTicker";
import styles from "./OneDevice.module.css";
interface OneDeviceProps {
  id?: string;
  className?: string;
  title?: string;
  sectionHeading?: string;
  description?: string;
  moveTitleInsideWrapper?: boolean;
  sectionDescription?: string;
  image?: { url: string; alt?: string };
  stats?: Array<{
    statsDescription?: string;
    statsValue?: string;
  }>;
  statsWidth?: "full" | "narrow";
  hideFallbackImage?: boolean;
  children?: React.ReactNode;
  statsClassName?: string;
  statsItemClassName?: string;
}

export default function OneDevice({
  id,
  className,
  title,
  sectionHeading,
  description,
  sectionDescription,
  image,
  stats,
  moveTitleInsideWrapper,
  statsWidth = "full",
  hideFallbackImage,
  children,
  statsClassName,
  statsItemClassName,
}: OneDeviceProps) {
  const finalTitle = title || sectionHeading;
  const finalDescription = description || sectionDescription;

  if (!finalTitle && !finalDescription) return null;

  const paragraphs = finalDescription
    ? finalDescription.split(/\n+/).filter(Boolean)
    : [];

  // Cleanly replace span if CMS doesn't provide it but it's required for highlight visually,
  // or just use finalTitle if CMS already has it.
  const displayTitle =
    finalTitle?.includes("smarter decisions") && !finalTitle.includes("<span>")
      ? finalTitle.replace(
        "smarter decisions",
        "<span>smarter decisions</span>",
      )
      : finalTitle || "";

  return (
    <section className={`${styles.section} ${className || ""}`} id={id}>
      <div className="container">
        {!moveTitleInsideWrapper && (
          <h2
            className="sectionTitle"
            dangerouslySetInnerHTML={{ __html: displayTitle }}
          />
        )}
        <div className={styles.wrapper}>
          <div
            className={`${styles.content} ${moveTitleInsideWrapper ? styles.byoemSpacing : ""
              }`}
            style={{ maxWidth: (hideFallbackImage && !image?.url) ? '100%' : undefined }}
          >

            {/*ByOEM Behavior */}
            {moveTitleInsideWrapper && (
              <h2
                className="sectionTitle"
                dangerouslySetInnerHTML={{ __html: displayTitle }}
              />
            )}
            <div className={styles.rightContent}>
              {finalDescription?.includes("<p>") ? (
                <div dangerouslySetInnerHTML={{ __html: finalDescription }} />
              ) : (
                paragraphs.map((p, idx) => (
                  <p key={idx} dangerouslySetInnerHTML={{ __html: p }} />
                ))
              )}
            </div>
            {stats && stats.length > 0 && (
              <div

                className={`${styles.stats} ${statsWidth === "narrow" ? styles.statsNarrow : ""
                  } ${stats.length === 3 && statsWidth === "full"
                    ? styles.statsGrid3
                    : ""
                  } ${statsClassName || ""}`}
              >
                {stats.map((s, idx) => (
                  <div key={idx} className={`${styles.statsItem} ${statsItemClassName || ""}`}>
                    <h3 className={styles.statsValue}>
                      {s.statsValue ? (
                        <NumberTicker value={s.statsValue} />
                      ) : (
                        "-"
                      )}
                    </h3>
                    <p>
                      <span>{s.statsDescription}</span>
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {(!hideFallbackImage || !!image?.url) && (
            <div className={styles.card}>
              <Image
                src={image?.url || "/assets/group-device.png"}
                alt={image?.alt || "ITUS Max device"}
                width={500}
                height={492}
                className={styles.singleImage}
                unoptimized={!!image?.url}
              />
            </div>
          )}
        </div>
        {children &&
          children
        }
      </div>
    </section>
  );
}
