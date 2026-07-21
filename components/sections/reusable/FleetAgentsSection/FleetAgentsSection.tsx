"use client";

import React, { useState } from "react";
import Image from "next/image";
import styles from "./FleetAgentsSection.module.css";
import ScrollReveal from "@/components/ui/ScrollReveal/ScrollReveal";

export type FleetAgent = {
  id: string;
  label: string;
  description: string;
  tabDescription?: string;
  imageUrl?: string;
};

export type FleetAgentsSectionProps = {
  title?: string;
  titleHighlight1?: string;
  titleHighlight2?: string;
  subheading?: string;
  agents?: FleetAgent[];
  /** Center card image (500×596). fallback if agent doesn't have one */
  centerImageUrl?: string;
  centerImageAlt?: string;
  /** Background for the content row. */
  backgroundImageUrl?: string;
  headerAlign?: "center" | "left";
  id?: string;
  className?: string;
  hideTabDescription?: boolean;
};

/* Inactive tab: right arrow (→). Active tab: down arrow (↓). Figma: 30×30, #FFFFFF */
const ArrowRightIcon = () => (
  <svg
    className={styles.fleetAgents_arrowIcon}
    viewBox="0 0 30 30"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden
  >
    <path
      d="M12 15h12M18 9l6 6-6 6"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const FleetAgentsSection: React.FC<FleetAgentsSectionProps> = ({
  title,
  subheading,
  agents,
  centerImageUrl,
  centerImageAlt,
  backgroundImageUrl,
  headerAlign = "center",
  id,
  className,
  hideTabDescription = false,
}) => {
  const safeAgents = (agents || []);

  const [activeId, setActiveId] = useState<string>(() => safeAgents?.[0]?.id || "");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Synchronize activeId if agents change and current activeId becomes invalid
  const [prevAgents, setPrevAgents] = useState(agents);
  if (agents !== prevAgents) {
    setPrevAgents(agents);
    if (safeAgents && safeAgents.length > 0) {
      const isValid = safeAgents.some((a) => a.id === activeId);
      if (!isValid) {
        setActiveId(safeAgents[0].id);
      }
    }
  }

  const handleSelect = (id: string, isActive: boolean) => {
    if (isActive) {
      setIsDropdownOpen((prev) => !prev);
    } else {
      setActiveId(id);
      setIsDropdownOpen(false);
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent,
    id: string,
    isActive: boolean,
  ) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleSelect(id, isActive);
    }
  };

  const hasContent =
    (safeAgents && safeAgents.length > 0);
  if (!hasContent) return null;

  const activeAgent =
    safeAgents.find((a) => a.id === activeId) ?? safeAgents[0];

  const sectionStyle: React.CSSProperties = backgroundImageUrl
    ? {
      backgroundImage: `url(${backgroundImageUrl})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
    }
    : {};

  return (
    <section
      className={`${styles.fleetAgents_section} ${className || ""}`}
      aria-labelledby="fleet-agents-heading"
      style={sectionStyle}
      id={id}
    >
      <div className="container">
        <div className={styles.fleetAgents_inner}>
          <ScrollReveal
            className={`${styles.fleetAgents_header} ${headerAlign === "left" ? styles.fleetAgents_header_left : ""}`.trim()}
          >
            {title && (
              <h2
                id="fleet-agents-heading"
                className={`sectionTitle ${headerAlign === "left" ? styles.fleetAgents_heading_left : ""}`.trim()}
                dangerouslySetInnerHTML={{ __html: title }}
              />
            )}
            {subheading && (
              <p
                className={`sectionDescription ${styles.fleetAgents_subheading} ${headerAlign === "left" ? styles.fleetAgents_heading_left : ""}`}
                dangerouslySetInnerHTML={{ __html: subheading }}
              />
            )}
          </ScrollReveal>

          <div className={styles.fleetAgents_content}>
            <ScrollReveal className={styles.tabsCardWrapper} delay={0.2}>
              <div
                className={`${styles.fleetAgents_tabsCard} ${isDropdownOpen ? styles.dropdownOpen : ""}`.trim()}
              >
                {/* Mobile dropdown trigger — not part of tablist (disclosure control). */}
                <button
                  type="button"
                  className={`${styles.fleetAgents_tabButton_active} ${styles.mobileDropdownToggle}`}
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  aria-expanded={isDropdownOpen}
                  aria-controls="fleet-agents-tablist"
                  aria-haspopup="true"
                  aria-label={`${activeAgent?.label ?? "Agent type"}, show options`}
                >
                  <div className={styles.fleetAgents_tabLabelGroup}>
                    <span className={styles.fleetAgents_tabLabel}>
                      {activeAgent?.label}
                      <i
                        className={`icon fa-kit fa-dropdown ${styles.mobileArrow} ${isDropdownOpen ? styles.rotated : ""}`}
                        aria-hidden="true"
                      ></i>
                    </span>
                    {activeAgent?.tabDescription && !hideTabDescription && (
                      <p 
                        className={`${styles.fleetAgents_tabIntro_card} ${isDropdownOpen ? styles.hideClass : ""}`}
                        dangerouslySetInnerHTML={{ __html: activeAgent.tabDescription }}
                      />
                    )}
                  </div>
                </button>

                <div
                  id="fleet-agents-tablist"
                  className={styles.dropdownList}
                  role="tablist"
                  aria-label="Agent types"
                >
                  {safeAgents.map((agent, index) => {
                    const isActive = activeId === agent.id;
                    return (
                      <React.Fragment key={agent.id}>
                        {index > 0 && (
                          <div
                            className={styles.fleetAgents_divider}
                            aria-hidden="true"
                          />
                        )}
                        <button
                          type="button"
                          role="tab"
                          aria-selected={isActive}
                          aria-controls={`fleet-agent-panel-${agent.id}`}
                          id={`fleet-agent-tab-${agent.id}`}
                          tabIndex={isActive ? 0 : -1}
                          className={
                            isActive
                              ? styles.fleetAgents_tabButton_active
                              : styles.fleetAgents_tabButton
                          }
                          onClick={() => handleSelect(agent.id, isActive)}
                          onKeyDown={(e) => handleKeyDown(e, agent.id, isActive)}
                        >
                          <div className={styles.fleetAgents_tabLabelGroup}>
                            <span className={styles.fleetAgents_tabLabel}>
                              {agent.label}{" "}
                              <i className={`${styles.arrowIcon} icon fa-kit fa-right-arrow`} aria-hidden="true"></i>

                            </span>
                            {isActive && agent.tabDescription && !hideTabDescription && (
                              <p 
                                className={styles.fleetAgents_tabIntro_card}
                                dangerouslySetInnerHTML={{ __html: agent.tabDescription }}
                              />
                            )}
                          </div>
                        </button>
                      </React.Fragment>
                    );
                  })}
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal className={styles.fleetAgents_centerWrapper} delay={0.3}>
              <div className={styles.fleetAgents_imageCard}>
                {safeAgents.map((agent) => {
                  const imageUrl = agent.imageUrl || centerImageUrl;
                  if (!imageUrl) return null;
                  const isActive = agent.id === activeId;
                  return (
                    <Image
                      key={agent.id}
                      src={imageUrl}
                      alt={centerImageAlt || agent.label || "Fleet agent visualization"}
                      width={500}
                      height={596}
                      className={`${styles.fleetAgents_centerImage} ${isActive ? styles.fleetAgents_centerImage_active : ""}`.trim()}
                      sizes="(max-width: 900px) 100vw, 31.25rem"
                      priority={isActive} // Let the active one be the highest priority
                    />
                  );
                })}
                {!safeAgents.some(a => a.imageUrl) && centerImageUrl && (
                  <Image
                    src={centerImageUrl}
                    alt={centerImageAlt || "Fleet agent visualization"}
                    width={500}
                    height={596}
                    className={`${styles.fleetAgents_centerImage} ${styles.fleetAgents_centerImage_active}`}
                    sizes="(max-width: 900px) 100vw, 31.25rem"
                    priority
                  />
                )}
                {(!safeAgents.some(a => a.imageUrl) && !centerImageUrl) && (
                  <div className={styles.fleetAgents_centerPlaceholder} />
                )}
              </div>
              <div
                id={`fleet-agent-panel-${activeAgent?.id || "default"}`}
                role="tabpanel"
                aria-labelledby={`fleet-agent-tab-${activeAgent?.id || "default"}`}
                className={styles.fleetAgents_descriptionCard}
              >
                {(activeAgent?.tabDescription || activeAgent?.description) && (
                  <div key={activeId}>
                    {activeAgent.description && (
                      <p 
                        className={styles.fleetAgents_descriptionText}
                        dangerouslySetInnerHTML={{ __html: activeAgent.description }}
                      />
                    )}
                  </div>
                )}
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FleetAgentsSection;
