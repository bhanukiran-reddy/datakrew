"use client";

import {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
  type ReactNode,
} from "react";
import Image from "@/components/ui/Image/Image";
import Link from "@/components/ui/Link/Link";
import { useParams } from "next/navigation";
import NavDropdown from '@/components/ui/NavDropdown/NavDropdown';
import type { NavDropdownItem } from '@/components/ui/NavDropdown/NavDropdown';
import styles from "./ProductStackSection.module.css";

/* ── Types ──────────────────────────────────────────────────── */

export type Product = {
  name: string;
  description?: string;
  image?: string;
  features?: string[];
  ctaText?: string;
  ctaHref?: string;
};

export type StackTab = {
  title: string;
  iconUrl?: string;
  iconClass?: string;
  /** cards variant: multiple product cards per tab */
  products?: Product[];
  /** overlay variant: single-product glass card */
  cardTitle?: string;
  cardList?: string[];
  tabImage?: string;
  ctaText?: string;
  ctaHref?: string;
  [key: string]: any;
};

export type ProductStackSectionProps = {
  variant?: "overlay" | "cards";
  title?: string;
  titleHighlight?: string;
  description?: string;
  tabs?: StackTab[];
  className?: string;
  hideDesktopTabs?: boolean;
  hideMobileTabs?: boolean;
  autoAdvance?: boolean;
  autoAdvanceDelay?: number;
  children?: ReactNode | ((activeTab: StackTab, activeIndex: number, onSelect: (idx: number) => void) => ReactNode);
};

type IconProps = { active?: boolean };

const HardwareIcon = ({ active }: IconProps) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden
  >
    <g clipPath="url(#clip0_hw)">
      <path
        d="M19.9692 9.91553H12.0646C10.8774 9.91553 9.91504 10.8779 9.91504 12.065V19.9697C9.91504 21.1568 10.8774 22.1192 12.0646 22.1192H19.9692C21.1564 22.1192 22.1187 21.1568 22.1187 19.9697V12.065C22.1187 10.8779 21.1564 9.91553 19.9692 9.91553Z"
        fill={active ? "url(#hw_grad)" : "currentColor"}
      />
      <path
        d="M30.8554 11.441C31.4795 11.441 31.9995 10.9209 31.9995 10.2969C31.9995 9.67281 31.4795 9.15276 30.8554 9.15276H29.7113V6.86457C29.7113 4.33369 27.6658 2.28819 25.1349 2.28819H22.8468V1.1441C22.8468 0.520043 22.3267 0 21.7027 0C21.0786 0 20.5586 0.520043 20.5586 1.1441V2.28819H17.1263V1.1441C17.1263 0.520043 16.6062 0 15.9822 0C15.3581 0 14.8381 0.520043 14.8381 1.1441V2.28819H11.4058V1.1441C11.4058 0.520043 10.8858 0 10.2617 0C9.63765 0 9.11761 0.520043 9.11761 1.1441V2.28819H6.82942C4.29854 2.28819 2.25303 4.33369 2.25303 6.86457V9.15276H1.10894C0.484887 9.15276 -0.0351562 9.67281 -0.0351562 10.2969C-0.0351562 10.9209 0.484887 11.441 1.10894 11.441H2.25303V14.8732H1.10894C0.484887 14.8732 -0.0351562 15.3933 -0.0351562 16.0173C-0.0351562 16.6414 0.484887 17.1614 1.10894 17.1614H2.25303V20.5937H1.10894C0.484887 20.5937 -0.0351562 21.1138 -0.0351562 21.7378C-0.0351562 22.3619 0.484887 22.8819 1.10894 22.8819H2.25303V25.1701C2.25303 27.701 4.29854 29.7465 6.82942 29.7465H9.11761V30.8906C9.11761 31.5146 9.63765 32.0347 10.2617 32.0347C10.8858 32.0347 11.4058 31.5146 11.4058 30.8906V29.7465H14.8381V30.8906C14.8381 31.5146 15.3581 32.0347 15.9822 32.0347C16.6062 32.0347 17.1263 31.5146 17.1263 30.8906V29.7465H20.5586V30.8906C20.5586 31.5146 21.0786 32.0347 21.7027 32.0347C22.3267 32.0347 22.8468 31.5146 22.8468 30.8906V29.7465H25.1349C27.6658 29.7465 29.7113 27.701 29.7113 25.1701V22.8819H30.8554C31.4795 22.8819 31.9995 22.3619 31.9995 21.7378C31.9995 21.1138 31.4795 20.5937 30.8554 20.5937H29.7113V17.1614H30.8554C31.4795 17.1614 31.9995 16.6414 31.9995 16.0173C31.9995 15.3933 31.4795 14.8732 30.8554 14.8732H29.7113V11.441H30.8554ZM25.1349 22.8472C25.1349 24.0953 24.0949 25.1354 22.8468 25.1354H9.15228C7.90417 25.1354 6.86409 24.0953 6.86409 22.8472V9.15276C6.86409 7.90466 7.90417 6.86457 9.15228 6.86457H22.8468C24.0949 6.86457 25.1349 7.90466 25.1349 9.15276V22.8472Z"
        fill={active ? "url(#hw_grad)" : "currentColor"}
      />
    </g>
    <defs>
      <clipPath id="clip0_hw">
        <rect width="32" height="32" fill="white" />
      </clipPath>
      <linearGradient
        id="hw_grad"
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

const SoftwareIcon = ({ active }: IconProps) => (
  <svg
    width="28.5"
    height="24"
    viewBox="0 0 38 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden
  >
    <g clipPath="url(#clip0_sw)">
      <path
        d="M34.7743 4.4814V1.68053C34.7743 0.770241 34.1007 0 33.1437 0H1.6306C0.779851 0 0 0.665208 0 1.54048V4.4814H34.7743Z"
        fill={active ? "url(#sw_grad)" : "currentColor"}
      />
      <path
        d="M0 6.51221V26.9236C0 27.7638 0.708955 28.4641 1.5597 28.4641H8.36567H17.7948H21.9776H25.4869C25.4869 28.4641 25.4869 28.4291 25.4869 28.394C25.3806 28.359 25.2388 28.289 25.097 28.219C23.7854 27.5188 23.9272 25.9433 23.9627 25.3481C24.0336 24.5078 24.5653 23.7726 25.4869 23.4225C25.4869 23.3525 25.5578 23.2824 25.5933 23.2124C25.0261 21.882 25.6287 21.0067 26.0896 20.5866L26.2668 20.4115C26.5858 20.0965 27.1884 19.4663 28.1455 19.4663C28.5 19.4663 28.819 19.5363 29.1381 19.6763C29.209 19.6763 29.2798 19.6063 29.3507 19.5713C29.528 19.0811 29.9534 18.3809 30.9104 18.1708C31.1586 18.1008 31.4067 18.1008 31.6903 18.1008H32.0093H32.222H32.3638C33.0019 18.1008 33.8172 18.3459 34.3489 19.5713C34.4198 19.5713 34.4907 19.6413 34.5616 19.6413C34.6325 19.6413 34.7034 19.6413 34.7743 19.6063V6.51221H0ZM11.8041 14.8448L7.76306 16.7004L11.8041 18.556V20.5866L5.24627 17.5056V15.9302L11.8041 12.8142V14.8448ZM14.3918 23.3175H12.3004L15.597 10.3284H17.653L14.3918 23.3175ZM24.7425 17.4706L18.1847 20.5866V18.556L22.2257 16.7004L18.1847 14.8448V12.7792L24.7425 15.8601V17.4356V17.4706Z"
        fill={active ? "url(#sw_grad)" : "currentColor"}
      />
      <path
        d="M38.0001 25.3481V26.5035C37.6456 26.9936 37.362 26.7835 36.8303 27.1337C36.4758 28.5341 35.9441 28.254 36.5113 29.2693C36.8303 29.7945 36.4758 30.0046 35.9796 30.4947C35.4833 30.9849 35.0225 30.3197 34.5616 30.3197C34.2781 30.3197 34.0654 30.4947 33.8172 30.6348C33.1792 30.9148 32.9665 30.6698 32.7893 31.475C32.6829 31.9652 32.3639 32.1402 31.8676 32.1052C31.584 32.1052 31.2296 32.1402 31.0169 31.8951C30.8396 31.6501 30.8042 31.0199 30.4852 30.9148C29.9889 30.7398 29.5635 30.5647 29.0672 30.3197C28.7128 30.3197 28.1456 30.9148 27.7911 30.5997C27.543 30.3897 27.3303 30.1796 27.1176 29.9345C26.7986 29.5494 27.4366 28.9892 27.4012 28.6391C27.224 28.219 27.0113 27.8689 26.9049 27.4137C26.7986 26.9236 26.3023 26.9936 25.8769 26.7835C25.5934 26.6085 25.6288 25.8733 25.6643 25.5932C25.6643 25.3131 25.8769 25.173 26.1251 25.103C26.7986 24.893 26.834 24.928 27.0113 24.3328C27.1176 23.9827 27.3657 23.7026 27.4366 23.3525C27.5075 22.9674 26.7277 22.4422 27.2594 21.917C27.7557 21.4619 27.8975 21.1118 28.5001 21.3919C29.4572 21.882 29.0672 21.5669 30.5206 21.0768C30.9105 20.9367 30.8396 20.0264 31.265 19.9564C31.6195 19.8864 31.974 19.9564 32.3284 19.9564C32.8602 19.9564 32.7184 20.9717 33.1792 21.1118C33.5691 21.2518 33.959 21.3569 34.3135 21.5669C34.4908 21.672 34.6325 21.6369 34.8098 21.5669L35.2352 21.3569C35.7669 21.0768 35.9441 21.4969 36.5113 22.0571C36.7949 22.3021 36.4049 22.8273 36.2631 23.1424C36.1922 23.2825 36.2631 23.4575 36.2986 23.5976C36.4758 23.9126 36.5822 24.2628 36.724 24.6129C36.9366 25.173 37.6102 24.8579 37.9646 25.4181L38.0001 25.3481ZM34.5262 25.9083C34.5262 24.4728 33.321 23.2825 31.8676 23.2825C30.4143 23.2825 29.209 24.4728 29.209 25.9083C29.209 27.3437 30.4143 28.5341 31.8676 28.5341C33.321 28.5341 34.5262 27.3437 34.5262 25.9083Z"
        fill={active ? "url(#sw_grad)" : "currentColor"}
      />
      <path
        d="M31.8676 27.484C32.7486 27.484 33.4628 26.7786 33.4628 25.9085C33.4628 25.0384 32.7486 24.333 31.8676 24.333C30.9866 24.333 30.2725 25.0384 30.2725 25.9085C30.2725 26.7786 30.9866 27.484 31.8676 27.484Z"
        fill={active ? "url(#sw_grad)" : "currentColor"}
      />
    </g>
    <defs>
      <clipPath id="clip0_sw">
        <rect width="38" height="32" fill="white" />
      </clipPath>
      <linearGradient
        id="sw_grad"
        x1="19"
        y1="0"
        x2="19"
        y2="32"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#93D772" />
        <stop offset="1" stopColor="#3AB1C5" />
      </linearGradient>
    </defs>
  </svg>
);

const AIAgentsIcon = ({ active }: IconProps) => (
  <svg
    width="30.75"
    height="24"
    viewBox="0 0 41 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden
  >
    <g clipPath="url(#clip0_ai)">
      <path
        d="M31.6133 31.9225L10.4733 31.9999C8.0684 31.9999 5.85742 30.4908 5.85742 27.8596V10.099C5.85742 7.23568 8.18476 4.87534 11.0552 4.83664H18.3475L18.3863 2.39892C18.3863 1.16071 18.9681 0.23205 20.093 0.0385797C21.1791 -0.154891 22.4979 0.502909 22.5367 1.8572L22.6531 4.79795H29.9842C32.8546 4.87534 35.1819 7.27437 35.1819 10.099V27.8596C35.1819 29.6008 33.7079 31.8838 31.6133 31.8838V31.9225ZM17.7269 17.9152C17.7269 16.2514 16.3692 14.8971 14.7013 14.8971C13.0334 14.8971 11.6758 16.2514 11.6758 17.9152C11.6758 19.5791 13.0334 20.9334 14.7013 20.9334C16.3692 20.9334 17.7269 19.5791 17.7269 17.9152ZM29.3636 17.9152C29.3636 16.2514 28.006 14.8971 26.338 14.8971C24.6701 14.8971 23.3125 16.2514 23.3125 17.9152C23.3125 19.5791 24.6701 20.9334 26.338 20.9334C28.006 20.9334 29.3636 19.5791 29.3636 17.9152Z"
        fill={active ? "url(#ai_grad)" : "currentColor"}
      />
      <path
        d="M1.55156 25.6927C0.853359 25.6927 0 24.4545 0 23.7193V15.3614C0 14.6649 0.581835 13.5041 1.28004 13.3493C2.32734 13.1558 3.25828 13.1945 4.228 13.3106V25.6927H1.55156Z"
        fill={active ? "url(#ai_grad)" : "currentColor"}
      />
      <path
        d="M41.0002 23.5647C41.0002 24.2999 40.302 25.5381 39.6426 25.6155C38.5953 25.7316 37.7807 25.6929 36.7334 25.6542V13.2721C37.7031 13.156 38.6341 13.156 39.6814 13.3495C40.3796 13.4656 40.9614 14.6651 40.9614 15.3616V23.6034L41.0002 23.5647Z"
        fill={active ? "url(#ai_grad)" : "currentColor"}
      />
    </g>
    <defs>
      <clipPath id="clip0_ai">
        <rect width="41" height="32" fill="white" />
      </clipPath>
      <linearGradient
        id="ai_grad"
        x1="20.5"
        y1="0"
        x2="20.5"
        y2="32"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#93D772" />
        <stop offset="1" stopColor="#3AB1C5" />
      </linearGradient>
    </defs>
  </svg>
);

const ChipIcon = ({ active }: IconProps) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden
  >
    <path
      d="M30.918 14.899H26.078V12.663h2.605a1.115 1.115 0 000-2.23h-2.605v-.37a5.98 5.98 0 00-5.96-5.96v-.74a1.115 1.115 0 00-2.23 0v3.605h-2.236V1.115a1.115 1.115 0 00-2.23 0v4.841h-2.236V3.35a1.115 1.115 0 00-2.23 0v2.605h-.37a5.98 5.98 0 00-5.96 5.96v.37H.384a1.115 1.115 0 100 2.23h2.605v2.236H1.115a1.115 1.115 0 000 2.23h4.841v2.236H3.35a1.115 1.115 0 000 2.23h2.605v.37a5.98 5.98 0 005.96 5.96v2.604a1.115 1.115 0 002.23 0v-2.605h2.236v4.841a1.115 1.115 0 002.23 0v-4.841h2.236v2.605a1.115 1.115 0 002.23 0v-2.605h.37a5.98 5.98 0 005.96-5.96v-.37h2.6a1.115 1.115 0 000-2.23h-2.6v-2.236h4.84a1.115 1.115 0 000-2.23l.05.013z"
      fill={active ? "url(#chip_grad)" : "currentColor"}
    />
    <defs>
      <linearGradient
        id="chip_grad"
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

/** Resolve icon by tab title keyword, iconClass, or iconUrl */
function resolveTabIcon(tab: StackTab, active: boolean): ReactNode {
  // CMS iconClass takes priority (e.g. "fa-kit fa-itus-max")
  if (tab.iconClass) {
    return (
      <i
        className={tab.iconClass}
        style={{
          fontSize: "24px",
          ...(active
            ? {
              background: "linear-gradient(180deg, #93D772, #3AB1C5)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }
            : { color: "currentColor" }),
        }}
      />
    );
  }
  // Keyword-based icons
  const key = tab.title.toLowerCase();

  // Specific DataKrew Icons
  if (key.includes("itus")) return <i className={`fa-kit fa-itus-max ${active ? styles.activeGradientIcon : ""}`} style={{ fontSize: "24px", color: active ? "unset" : "currentColor" }} />;
  if (key.includes("guardian") || key.includes("ai")) return <i className={`fa-kit fa-ai-icon ${active ? styles.activeGradientIcon : ""}`} style={{ fontSize: "24px", color: active ? "unset" : "currentColor" }} />;
  if (key.includes("myfleet") || key.includes("oxred")) return <i className={`fa-kit fa-oxred ${active ? styles.activeGradientIcon : ""}`} style={{ fontSize: "24px", color: active ? "unset" : "currentColor" }} />;

  // Existing SVG icons
  if (key === "hardware") return <HardwareIcon active={active} />;
  if (key === "software") return <SoftwareIcon active={active} />;
  if (key === "ai agents" || key === "ai solutions")
    return <AIAgentsIcon active={active} />;
  return <ChipIcon active={active} />;
}

/** Check icon for feature lists — uses /check-icon.svg */
const FeatureCheckIcon = () => (
  <Image
    className={styles.psFeatureIcon}
    src="/check-icon.svg"
    alt="Checkmark icon"
    width={20}
    height={20}
  />
);

/* ── Component ──────────────────────────────────────────────── */

export default function ProductStackSection(props: ProductStackSectionProps) {
  const {
    variant = "overlay",
    title,
    titleHighlight,
    description,
    tabs = [],
    className,
    hideDesktopTabs = false,
    hideMobileTabs = false,
    autoAdvance = false,
    autoAdvanceDelay = 9000,
    children,
  } = props;
  const isCards = variant === "cards";
  const params = useParams();
  const locale = params.locale as string;

  const [activeIndex, setActiveIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  const sectionRef = useRef<HTMLElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const progressAnimationRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);

  const hasTitle = title || titleHighlight;

  const resetAutoAdvance = useCallback(() => {
    if (intervalRef.current) clearTimeout(intervalRef.current);
    if (progressAnimationRef.current) cancelAnimationFrame(progressAnimationRef.current);

    if (!autoAdvance || !isVisible) {
      setProgress(0);
      return;
    }

    setProgress(0);
    startTimeRef.current = performance.now();

    const animateProgress = () => {
      if (!isVisible) return;
      const elapsed = performance.now() - startTimeRef.current;
      const newProgress = Math.min((elapsed / autoAdvanceDelay) * 100, 100);
      setProgress(newProgress);

      if (newProgress < 100) {
        progressAnimationRef.current = requestAnimationFrame(animateProgress);
      }
    };

    progressAnimationRef.current = requestAnimationFrame(animateProgress);
    intervalRef.current = setTimeout(() => {
      if (isVisible && tabs.length > 1) {
        setActiveIndex((prev) => (prev + 1) % tabs.length);
      }
    }, autoAdvanceDelay);
  }, [autoAdvance, autoAdvanceDelay, isVisible, tabs.length]);

  const handleTabClick = useCallback((index: number) => {
    setActiveIndex(index);
    if (autoAdvance) resetAutoAdvance();
  }, [autoAdvance, resetAutoAdvance]);

  // Intersection Observer to start/stop auto-advance
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        setIsVisible(entries[0].isIntersecting);
      },
      { threshold: 0.1 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (autoAdvance && isVisible) {
      resetAutoAdvance();
    }
    return () => {
      if (intervalRef.current) clearTimeout(intervalRef.current);
      if (progressAnimationRef.current) cancelAnimationFrame(progressAnimationRef.current);
    };
  }, [activeIndex, autoAdvance, isVisible, resetAutoAdvance]);


  const activeTab = useMemo(
    () => tabs[activeIndex] ?? tabs[0],
    [tabs, activeIndex],
  );

  /* ── Map StackTab[] → NavDropdownItem[] for the reusable dropdown ── */
  const dropdownItems: NavDropdownItem[] = useMemo(
    () =>
      tabs.map((tab, idx) => ({
        id: idx,
        label: tab.title,
        ...(tab.iconUrl ? { iconUrl: tab.iconUrl } : {}),
      })),
    [tabs],
  );

  /** Render the section-specific icon inside NavDropdown */
  const renderTabIcon = useCallback(
    (item: NavDropdownItem, isActive: boolean) => {
      const tab = tabs[item.id as number];
      if (!tab) return null;
      return resolveTabIcon(tab, isActive);
    },
    [tabs],
  );

  if (!hasTitle && tabs.length === 0) return null;

  return (
    <section
      className={`${styles.productStackSection} ${isCards ? styles.productStackCards : styles.productStackOverlay} ${className || ""}`}
      aria-labelledby="product-stack-heading"
    >
      <div className="container">
        {/* Header */}
        {hasTitle && (
          <div className={styles.productStackHeader}>
            <h2
              id="product-stack-heading"
              className="sectionTitle"
              dangerouslySetInnerHTML={{
                __html:
                  (titleHighlight ? `<span>${titleHighlight} </span>` : "") +
                  (title ?? ""),
              }}
            />
            {description && <p className="sectionDescription">{description}</p>}
          </div>
        )}

        {/* Tabs — Desktop: horizontal tabs | Mobile: dropdown */}
        {tabs.length > 1 && (
          <>
            {/* Desktop tabs (hidden on mobile via CSS) */}
            {!hideDesktopTabs && (
              <div className={styles.productStackTabs}>
                {tabs.map((tab, index) => (
                  <button
                    key={index}
                    type="button"
                    className={`${styles.productStackTab} ${index === activeIndex ? styles.productStackTabActive : ""}`}
                    onClick={() => handleTabClick(index)}
                  >
                    <div className={styles.productStackTabIcon}>
                      {resolveTabIcon(tab, index === activeIndex)}
                    </div>
                    <span className={styles.productStackTabTitle}>
                      {tab.title}
                    </span>
                    {index === activeIndex && (
                      <div className={styles.productStackTabActiveBorder}>
                        <div
                          className={styles.productStackProgressFill}
                          style={{ width: autoAdvance ? `${progress}%` : "100%" }}
                        />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            )}
  
            {/* Mobile dropdown (hidden on desktop via CSS) */}
            {!hideMobileTabs && (
              <div className={styles.psMobileDropdownWrapper}>
                <NavDropdown
                  items={dropdownItems}
                  activeIndex={activeIndex}
                  onSelect={handleTabClick}
                  renderIcon={renderTabIcon}
                  ariaLabel={`Select tab: ${activeTab.title}`}
                />
              </div>
            )}
          </>
        )}

        {/* Content */}
        {children ? (
          <div className={styles.productStackCustomContent}>
            {typeof children === "function" ? children(activeTab, activeIndex, handleTabClick) : children}
          </div>
        ) : isCards ? (
          /* ── Cards variant ─────────────────────────────────── */
          <div className={styles.productStackCardsContent}>
            {(activeTab.products ?? []).map((product, idx) => (
              <div key={idx} className={styles.psProductCard}>
                {product.image && (
                  <div className={styles.psProductImageWrap}>
                    <Image
                      src={product.image}
                      alt={product.name}
                      width={800}
                      height={800}
                      className={styles.psProductImage}
                    />
                  </div>
                )}
                <div className={styles.psProductInfo}>
                  <h3
                    className={styles.psProductName}
                    dangerouslySetInnerHTML={{ __html: product.name ?? "" }}
                  />
                  {product.description && (
                    <div
                      className={styles.psProductDescription}
                      dangerouslySetInnerHTML={{ __html: product.description }}
                    />
                  )}
                  {product.features && product.features.length > 0 && (
                    <div className={styles.psFeatureGrid}>
                      {product.features.map((feat, fi) => (
                        <div key={fi} className={styles.psFeatureItem}>
                          <FeatureCheckIcon />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  {product.ctaText && product.ctaHref && (
                    <Link
                      href={product.ctaHref}
                      className={`${styles.psProductCta} tertiaryCta`}
                      locale={locale}
                    >
                      {product.ctaText}
                      <i
                        className={`${styles.psProductCtaIcon} fa-kit fa-right-arrow`}
                      ></i>
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* ── Overlay variant ───────────────────────────────── */
          <div className={styles.productStackOverlayContent}>
            <div className={styles.productStackOverlayImageContainer}>
              {activeTab.tabImage && (
                <Image
                  src={activeTab.tabImage}
                  alt={activeTab.title}
                  fill
                  className={styles.productStackOverlayBgImage}
                  priority={activeIndex === 0}
                />
              )}
            </div>
            <div className={styles.productStackOverlayCardContainer}>
              <div className={styles.productStackGlassCard}>
                {activeTab.cardTitle && (
                  <h2
                    className={styles.productStackOverlayCardTitle}
                    dangerouslySetInnerHTML={{ __html: activeTab.cardTitle }}
                  />
                )}
                {activeTab.cardList && activeTab.cardList.length > 0 && (
                  <ul className={styles.productStackOverlayCardList}>
                    {activeTab.cardList.map((item, idx) => (
                      <li
                        key={idx}
                        className={styles.productStackOverlayCardListItem}
                      >
                        <Image
                          src="/icons/check-icon.svg"
                          alt=""
                          width={20}
                          height={20}
                        />

                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
            {activeTab.ctaText && activeTab.ctaHref && (
              <div className={styles.productStackOverlayCta}>
                <Link href={activeTab.ctaHref} className="primaryCta" locale={locale}>
                  <span>{activeTab.ctaText}</span>
                  <i
                    className={`${styles.productStackOverlayCtaIcon} fa-kit fa-right-arrow`}
                  ></i>
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
