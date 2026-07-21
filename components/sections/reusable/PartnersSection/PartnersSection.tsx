import React from "react";
import styles from "./PartnersSection.module.css";
import PartnersLogo from "@/components/ui/PartnersLogo/PartnersLogo";

type PartnersSectionProps = {
  title?: string;
  titleHighlight?: string;
  description?: string;
  partners?: Array<{ name?: string; image?: string; imageAlt?: string }>;
  className?: string;
  paddingTop?: string | number;
  id?: string;
};

/**
 * Renders only what is provided — no hardcoded defaults.
 * If no partners array, no partner grid is shown.
 * Partners with missing name or image are skipped.
 */
export default function PartnersSection(props: PartnersSectionProps) {
  const { title, titleHighlight, description, partners, paddingTop } = props;

  const validPartners = partners?.filter((p) => p?.image) ?? [];
  const hasHeader = title || titleHighlight || description;
  if (!hasHeader && validPartners.length === 0) return null;

  return (
    <section
      id={props.id}
      className={`${styles.partnersContainer} ${props.className || ''}`}
      style={{ paddingTop }}
    >
      {(title || titleHighlight || description) && (
        <div className="container">
          <div className={styles.partnersHeader}>
            {(title || titleHighlight) && (
              <h2
                className={`sectionTitle ${styles.heading}`}
                dangerouslySetInnerHTML={{
                  __html: titleHighlight
                    ? title &&
                      title.toLowerCase().includes(titleHighlight.toLowerCase())
                      ? `${title}`.replace(
                        new RegExp(
                          `(${titleHighlight.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`,
                          "gi",
                        ),
                        "<span>$1</span>",
                      )
                      : `${title ?? ""} <span>${titleHighlight}</span>`
                    : (title ?? ""),
                }}
              />
            )}
            {description && <p className={`${styles.heading} sectionDescription`}>{description}</p>}
          </div>
        </div>
      )}
      <PartnersLogo partners={validPartners} />
    </section>
  );
}

