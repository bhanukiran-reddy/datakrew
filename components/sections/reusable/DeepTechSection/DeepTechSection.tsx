"use client";

import {
  useState,
  useEffect,
  useRef,
  type ReactNode,
} from "react";

import Link from "@/components/ui/Link/Link";
import { useParams } from "next/navigation";
import ProductStackSection from "@/components/sections/reusable/ProductStackSection/ProductStackSection";
import Image from "next/image";
import styles from "./DeepTechSection.module.css";

/* ── Mobile breakpoint hook ─────────────────────────────────── */
const MOBILE_BREAKPOINT = 768; // matches max-width: 47.99875rem

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 0.02}px)`);
    const handler = (e: MediaQueryListEvent | MediaQueryList) =>
      setIsMobile(e.matches);
    handler(mql); // initial check
    mql.addEventListener("change", handler as (e: MediaQueryListEvent) => void);
    return () =>
      mql.removeEventListener(
        "change",
        handler as (e: MediaQueryListEvent) => void,
      );
  }, []);
  return isMobile;
}

const TabIconSvg = ({ isActive }: { isActive?: boolean }) => (
  <svg
    width="32"
    height="32"
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M30.9184 14.8986H26.0775V12.6628H28.6826C29.3026 12.6628 29.7972 12.1616 29.7972 11.5482C29.7972 10.9349 29.296 10.4336 28.6826 10.4336H26.0775V10.0643C26.0775 7.80214 24.244 5.96867 21.9819 5.96867H21.6125V3.36356C21.6125 2.74361 21.1113 2.24897 20.4979 2.24897C19.8846 2.24897 19.3833 2.75021 19.3833 3.36356V5.96867H17.1476V1.11459C17.1476 0.494641 16.6463 0 16.033 0C15.4196 0 14.9184 0.501237 14.9184 1.11459V5.95548H12.6826V3.35037C12.6826 2.73042 12.1814 2.23578 11.568 2.23578C10.9547 2.23578 10.4534 2.73702 10.4534 3.35037V5.95548H10.0841C7.82193 5.95548 5.98846 7.78895 5.98846 10.0511V10.4204H3.38335C2.7634 10.4204 2.26876 10.9217 2.26876 11.535C2.26876 12.1484 2.76999 12.6496 3.38335 12.6496H5.98846V14.8854H1.11459C0.494641 14.8854 0 15.3866 0 16C0 16.6134 0.501237 17.1146 1.11459 17.1146H5.95548V19.3504H3.35037C2.73042 19.3504 2.23578 19.8516 2.23578 20.465C2.23578 21.0783 2.73702 21.5796 3.35037 21.5796H5.95548V21.9489C5.95548 24.211 7.78895 26.0445 10.0511 26.0445H10.4204V28.6496C10.4204 29.2696 10.9217 29.7642 11.535 29.7642C12.1484 29.7642 12.6496 29.263 12.6496 28.6496V26.0445H14.8854V30.8854C14.8854 31.5054 15.3866 32 16 32C16.6134 32 17.1146 31.4988 17.1146 30.8854V26.0445H19.3504V28.6496C19.3504 29.2696 19.8516 29.7642 20.465 29.7642C21.0783 29.7642 21.5796 29.263 21.5796 28.6496V26.0445H21.9489C24.211 26.0445 26.0445 24.211 26.0445 21.9489V21.5796H28.6496C29.2696 21.5796 29.7642 21.0783 29.7642 20.465C29.7642 19.8516 29.263 19.3504 28.6496 19.3504H26.0445V17.1146H30.8854C31.5054 17.1146 32 16.6134 32 16C32 15.3866 31.4988 14.8854 30.8854 14.8854L30.9184 14.8986Z"
      fill={isActive ? "url(#paint0_linear_deeptech)" : "#fff"}
    />
  </svg>
);

const IconGradientDefs = () => (
  <svg width="0" height="0" style={{ position: "absolute", pointerEvents: "none" }}>
    <defs>
      <linearGradient
        id="paint0_linear_deeptech"
        x1="16"
        y1="0"
        x2="16"
        y2="32"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#93D772" />
        <stop offset="1" stopColor="#3AB1C5" />
      </linearGradient>
    </defs>
  </svg>
);

export type DeepTechTab = {
  tabTitle: string;
  tabTitleIcon?: ReactNode;
  tabIcon?: string;
  tabCardTitle?: string;
  tabCardDescription?: string;
  tabCardLIst?: string[];
  tabCardCtaLink?: string;
  tabCardCtaText?: string;
  tabImage?: string;
  tabImageAlt?: string;
  tabLink?: string;
  tabCtaText?: string;
};

/** Chevron icon for the mobile dropdown */
const ChevronDownIcon = ({ open }: { open: boolean }) => (
  <svg
    className={`${styles.dtDropdownChevron} ${open ? styles.dtDropdownChevronOpen : ""}`}
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    aria-hidden
  >
    <path
      d="M6 9l6 6 6-6"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const RenderTabIcon = ({ tab, isActive }: { tab: DeepTechTab; isActive?: boolean }) => {
  const t = (tab.tabTitle || "").toLowerCase();
  let iconClass = null;

  if (t.includes("itus")) iconClass = "fa-kit fa-itus-max";
  else if (t.includes("guardian") || t.includes("ai")) iconClass = "fa-kit fa-ai-icon";
  else if (t.includes("myfleet") || t.includes("oxred")) iconClass = "fa-kit fa-oxred";

  if (iconClass) {
    return (
      <i
        className={`${iconClass} ${isActive ? styles.activeGradientIcon : ""}`.trim()}
        style={{ fontSize: "32px", color: isActive ? "unset" : "#fff" }}
      />
    );
  }

  if (tab.tabIcon) {
    if (tab.tabIcon.startsWith("<")) {
      return (
        <div
          dangerouslySetInnerHTML={{ __html: tab.tabIcon }}
          className={isActive ? styles.activeGradientIcon : ""}
          style={{ color: isActive ? "unset" : "#fff" }}
        />
      );
    }
    return (
      <Image src={tab.tabIcon} alt={tab.tabTitle} width={32} height={32} />
    );
  }
  return (tab.tabTitleIcon as any) ?? <TabIconSvg isActive={isActive} />;
};

/* ── Mobile Dropdown Sub-component ──────────────────────────── */

type MobileDropdownProps = {
  tabs: DeepTechTab[];
  activeIndex: number;
  onSelect: (index: number) => void;
};

function MobileDropdown({ tabs, activeIndex, onSelect }: MobileDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  const activeTab = tabs[activeIndex];
  const otherTabs = tabs.filter((_, idx) => idx !== activeIndex);

  const handleSelect = (originalIndex: number) => {
    onSelect(originalIndex);
    setIsOpen(false);
  };

  const handleKeyDownOnOption = (
    e: React.KeyboardEvent,
    originalIndex: number,
  ) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleSelect(originalIndex);
    }
  };

  return (
    <div className={styles.dtMobileDropdown} ref={dropdownRef}>
      <button
        type="button"
        className={styles.dtMobileDropdownTrigger}
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-label={`Select tab: ${activeTab.tabTitle}`}
      >
        <div className={styles.dtMobileDropdownActive}>
          <span className={styles.dtMobileDropdownIcon}>
            <RenderTabIcon tab={activeTab} isActive={true} />
          </span>
          <span className={styles.dtMobileDropdownLabel}>
            {activeTab.tabTitle}
          </span>
        </div>
        <ChevronDownIcon open={isOpen} />
      </button>

      {isOpen && (
        <div
          className={styles.dtMobileDropdownMenu}
          role="listbox"
          aria-label="Tab options"
        >
          {otherTabs.map((tab) => {
            const originalIndex = tabs.indexOf(tab);
            return (
              <button
                key={originalIndex}
                type="button"
                role="option"
                aria-selected={false}
                className={styles.dtMobileDropdownOption}
                onClick={() => handleSelect(originalIndex)}
                onKeyDown={(e) => handleKeyDownOnOption(e, originalIndex)}
              >
                <span className={styles.dtMobileDropdownIcon}>
                  <RenderTabIcon tab={tab} isActive={false} />
                </span>
                <span className={styles.dtMobileDropdownLabel}>
                  {tab.tabTitle}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

const AUTO_ADVANCE_DELAY = 9000;

export type DeepTechSectionProps = {
  title?: string;
  description?: string;
  tabs?: DeepTechTab[];
  className?: string;
};

export default function DeepTechSection(props: DeepTechSectionProps) {
  const { title, description, tabs = [], className } = props;
  const params = useParams();
  const locale = params.locale as string;

  // Map DeepTechTab to the format expected by ProductStackSection
  const mappedTabs = tabs.map(tab => ({
    ...tab,
    title: tab.tabTitle,
    iconClass: tab.tabIcon?.startsWith("fa-") ? tab.tabIcon : undefined,
    // we'll use resolveTabIcon in ProductStackSection if possible, 
    // or just let DeepTechSection handle its own icons via children if we want full control.
  }));

  if (!tabs?.length) return null;

  return (
    <ProductStackSection
      title={title}
      description={description}
      tabs={mappedTabs}
      className={className}
      autoAdvance={true}
      autoAdvanceDelay={9000}
      hideMobileTabs={true}
    >
      {(activeTab, activeIndex, onSelect) => (
        <div className={styles.deepTechContentContainer}>
          <div className={styles.dtMobileDropdownWrapper}>
            <MobileDropdown
              tabs={tabs}
              activeIndex={activeIndex}
              onSelect={onSelect}
            />
          </div>
          <div className={styles.deepTechContentWrapper}>
            <div className={styles.deepTechCardContainer}>
              <div className={styles.deepTechGlassCard}>
                {activeTab.tabCardDescription && (
                  <div
                    className={styles.deepTechCardDescription}
                    dangerouslySetInnerHTML={{
                      __html: activeTab.tabCardDescription,
                    }}
                  />
                )}
                {activeTab.tabCardLIst && activeTab.tabCardLIst.length > 0 && (
                  <ul className={`${styles.deepTechCardList} tick-list`}>
                    {activeTab.tabCardLIst.map((item: string, idx: number) => (
                      <li key={idx} className={styles.deepTechCardListItem}>
                        {typeof item === "string" &&
                          (item.startsWith("<") || item.includes("</")) ? (
                          <p>
                            <div dangerouslySetInnerHTML={{ __html: item }} />
                          </p>
                        ) : (
                          <span>{item}</span>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
                {activeTab.tabCardCtaLink && activeTab.tabCardCtaText && (
                  <Link href={activeTab.tabCardCtaLink} className="tertiaryCta" locale={locale}>
                    {activeTab.tabCardCtaText}
                    <i className="fa-kit fa-right-arrow icon"></i>
                  </Link>
                )}
              </div>
            </div>
            <div className={styles.deepTechImageContainer}>
              <div className={styles.deepTechImageWrapper}>
              <Image
                src={activeTab.tabImage || "/deeptech.png"}
                alt={
                  activeTab.tabImageAlt?.trim() ||
                  activeTab.tabCardTitle ||
                  activeTab.tabTitle ||
                  'Deep Tech Background'
                }
                width={1200}
                height={1200}
                quality={100}
                className={styles.deepTechBackgroundImage}
              />
              </div>
            </div>
          </div>
          {activeTab.tabLink && activeTab.tabCtaText && (
            <div className={styles.deepTechCtaContainer}>
              <Link href={activeTab.tabLink} className="primaryCta" locale={locale}>
                {activeTab.tabCtaText && <span>{activeTab.tabCtaText}</span>}
                <i className={`fa-kit fa-right-arrow icon`}></i>
              </Link>
            </div>
          )}
        </div>
      )}
    </ProductStackSection>
  );
}
