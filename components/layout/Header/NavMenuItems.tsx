"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import Link from "@/components/ui/Link/Link";
import Image from "next/image";
import { usePathname, useSearchParams } from "next/navigation";
import type { NavItemFields } from "@/lib/graphql/types";
import styles from "./Header.module.css";

const DEFAULT_ACTIVE_COLOR = "#3ab1c5";
const HEX_REGEX = /^#?[0-9A-Fa-f]{6}$/;

function parseActiveColorFromUrl(value: string | null): string {
  if (!value) return DEFAULT_ACTIVE_COLOR;
  const hex = value.startsWith("#") ? value : `#${value}`;
  return HEX_REGEX.test(hex) ? hex : DEFAULT_ACTIVE_COLOR;
}

export interface NavMenuItemsProps {
  locale?: string;
  /** Optional className to apply to the outer <nav> wrapper */
  className?: string;
  /** Optional top position for dropdown menus */
  dropdownTop?: string;
  menuItems?: NavItemFields[] | null;
}

export default function NavMenuItems({ locale = "", className, dropdownTop, menuItems }: NavMenuItemsProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const pathWithoutLocale = useMemo(() => {
    if (!pathname || typeof pathname !== "string") return "";
    const trimmed = pathname.replace(/\/$/, "") || "/";
    if (!locale) return trimmed;
    const localePrefix = `/${locale}`;
    if (trimmed === localePrefix) return "/";
    if (trimmed.startsWith(`${localePrefix}/`))
      return trimmed.slice(localePrefix.length) || "/";
    return trimmed;
  }, [pathname, locale]);

  const activeColor = useMemo(
    () => parseActiveColorFromUrl(searchParams.get("activeColor")),
    [searchParams],
  );

  const isLinkActive = (href: string) => {
    if (!href || href === "#") return false;
    const normalized =
      (href.startsWith("/") ? href : `/${href}`).replace(/\/$/, "") || "/";
    const path = pathWithoutLocale.replace(/\/$/, "") || "/";
    const pathnameNorm = (pathname ?? "").replace(/\/$/, "") || "/";
    return (
      path === normalized ||
      path.startsWith(`${normalized}/`) ||
      pathnameNorm === normalized ||
      pathnameNorm.startsWith(`${normalized}/`)
    );
  };

  const isParentActive = (childPaths: string[]) =>
    childPaths.some((href) => isLinkActive(href));

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpenDropdown(null);
      }
    };
    if (openDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [openDropdown]);

  // Close dropdowns when pathname changes
  useEffect(() => {
    setOpenDropdown(null);
  }, [pathname]);

  const toggleDropdown = (menu: string) => {
    setOpenDropdown(openDropdown === menu ? null : menu);
  };

  const firstItem = menuItems?.[0];
  if (!firstItem) return null;

  const { solutionMenuColumn, techStackMenuColumn, resourcesMenuColumn, companyMenuColumn } = firstItem;

  return (
    <nav 
      className={className || styles.navMenu} 
      ref={dropdownRef} 
      style={{ 
        "--header-active-color": activeColor,
        ...(dropdownTop ? { "--dropdown-top": dropdownTop } : {})
      } as React.CSSProperties}
    >
      <ul className={styles.navMenuItemsList}>
        {solutionMenuColumn && (
          <li
            className={styles.dropdownItem}
            onClick={() => toggleDropdown("solutions")}
          >
            <Link
              href="#"
              onClick={(e) => e.preventDefault()}
              className={
                isParentActive([
                  ...(solutionMenuColumn.byCustomerColumn?.byCustomerLinks?.nodes?.map(n => n.uri || "") || []),
                  ...(solutionMenuColumn.byIndustryColumn?.byIndustryLinks?.nodes?.map(n => n.uri || "") || []),
                  ...(solutionMenuColumn.byNeedColumn?.byNeedLinks?.nodes?.map(n => n.uri || "") || []),
                  "/solutions", // Base path fallback
                ].filter(Boolean) as string[])
                  ? styles.navLinkActive
                  : undefined
              }
            >
              {solutionMenuColumn.solColumnHeading}
              <i
                className={`${styles.dropdownIcon} fa-kit fa-dropdown ${openDropdown === "solutions" ? styles.rotated : ""}`}
              ></i>
            </Link>
            {openDropdown === "solutions" && (
              <div className={`${styles.dropdownMenu} ${styles.solutionsDropdownMenu}`}>
                <div className={styles.dropdownContent}>
                  {solutionMenuColumn.byCustomerColumn && (
                    <div className={styles.dropdownColumn}>
                      <h3 className={styles.dropdownTitle}>{solutionMenuColumn.byCustomerColumn.byCustomerHeading}</h3>
                      <ul className={styles.dropdownList}>
                        {solutionMenuColumn.byCustomerColumn.byCustomerLinks?.nodes?.map((node) => (
                          <li key={node.id}>
                            <Link
                              href={node.uri || "/"}
                              className={isLinkActive(node.uri || "") ? styles.navLinkActive : undefined}
                            >
                              {node.title}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {solutionMenuColumn.byIndustryColumn && (
                    <div className={styles.dropdownColumn}>
                      <h3 className={styles.dropdownTitle}>{solutionMenuColumn.byIndustryColumn.byIndustryHeading}</h3>
                      <ul className={styles.dropdownList}>
                        {solutionMenuColumn.byIndustryColumn.byIndustryLinks?.nodes?.map((node) => (
                          <li key={node.id}>
                            <Link
                              href={node.uri || "/"}
                              className={isLinkActive(node.uri || "") ? styles.navLinkActive : undefined}
                            >
                              {node.title}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {solutionMenuColumn.byNeedColumn && (
                    <div className={styles.dropdownColumn}>
                      <h3 className={styles.dropdownTitle}>{solutionMenuColumn.byNeedColumn.byNeedHeading}</h3>
                      <ul className={styles.dropdownList}>
                        {solutionMenuColumn.byNeedColumn.byNeedLinks?.nodes?.map((node) => (
                          <li key={node.id}>
                            <Link
                              href={node.uri || "/"}
                              className={isLinkActive(node.uri || "") ? styles.navLinkActive : undefined}
                            >
                              {node.title}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {solutionMenuColumn.solFeaturedPanel && (
                    <div className={styles.dropdownCaseStudy}>
                      <p className={styles.caseStudyTitle}>{solutionMenuColumn.solFeaturedPanel.solPanelEyebrow}</p>
                      <p className={styles.caseStudyDescription}>
                        {solutionMenuColumn.solFeaturedPanel.solPanelDescription}
                      </p>
                      <Link
                        href={solutionMenuColumn.solFeaturedPanel.solPanelCtaUrl?.url || "#"}
                        className={styles.caseStudyLink}
                      >
                        {solutionMenuColumn.solFeaturedPanel.solPanelCtaText}
                        <i className="fa-kit fa-right-arrow icon"></i>
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            )}
          </li>
        )}

        {techStackMenuColumn && (
          <li
            className={styles.dropdownItem}
            onClick={() => toggleDropdown("intelligence")}
          >
            <Link
              href=""
              onClick={(e) => e.preventDefault()}
              className={
                isParentActive([
                  ...(techStackMenuColumn.hardwareColumn?.hardwareLinks?.nodes?.map(n => n.uri || "") || []),
                  ...(techStackMenuColumn.softwareColumn?.softwareLinks?.nodes?.map(n => n.uri || "") || []),
                  ...(techStackMenuColumn.aiSolutionsColumn?.aiSolutionsLinks?.nodes?.map(n => n.uri || "") || []),
                  techStackMenuColumn.techstackOverviewCta?.[0]?.techstackButtonLink?.url || "/tech-stack",
                ].filter(Boolean) as string[])
                  ? styles.navLinkActive
                  : undefined
              }
            >
              {techStackMenuColumn.techColumnHeading}
              <i
                className={`${styles.dropdownIcon} fa-kit fa-dropdown ${openDropdown === "intelligence" ? styles.rotated : ""}`}
              ></i>
            </Link>
            {openDropdown === "intelligence" && (
              <div className={`${styles.dropdownMenu} ${styles.intelligenceDropdownMenu}`}>
                <div className={styles.dropdownContent}>
                  {techStackMenuColumn.hardwareColumn && (
                    <div className={styles.dropdownColumn}>
                      <h3 className={styles.dropdownTitle}>{techStackMenuColumn.hardwareColumn.hardwareHeading}</h3>
                      <ul className={styles.dropdownList}>
                        {techStackMenuColumn.hardwareColumn.hardwareLinks?.nodes?.map((node) => (
                          <li key={node.id}>
                            <Link
                              href={node.uri || "/"}
                              className={isLinkActive(node.uri || "") ? styles.navLinkActive : undefined}
                            >
                              {node.title}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {techStackMenuColumn.softwareColumn && (
                    <div className={styles.dropdownColumn}>
                      <h3 className={styles.dropdownTitle}>{techStackMenuColumn.softwareColumn.softwareHeading}</h3>
                      <ul className={styles.dropdownList}>
                        {techStackMenuColumn.softwareColumn.softwareLinks?.nodes?.map((node) => (
                          <li key={node.id}>
                            <Link
                              href={node.uri || "/"}
                              className={isLinkActive(node.uri || "") ? styles.navLinkActive : undefined}
                            >
                              {node.title}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {techStackMenuColumn.aiSolutionsColumn && (
                    <div className={styles.dropdownColumn}>
                      <h3 className={styles.dropdownTitle}>{techStackMenuColumn.aiSolutionsColumn.aiSolutionsHeading}</h3>
                      <ul className={styles.dropdownList}>
                        {techStackMenuColumn.aiSolutionsColumn.aiSolutionsLinks?.nodes?.map((node) => (
                          <li key={node.id}>
                            <Link
                              href={node.uri || "/"}
                              className={isLinkActive(node.uri || "") ? styles.navLinkActive : undefined}
                            >
                              {node.title}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {techStackMenuColumn.techFeaturedPanel && (
                    <div className={styles.dropdownCaseStudy}>
                      <p className={styles.caseStudyTitle}>{techStackMenuColumn.techFeaturedPanel.techPanelEyebrow}</p>
                      <p className={styles.caseStudyDescription}>
                        {techStackMenuColumn.techFeaturedPanel.techPanelDescription}
                      </p>
                      <Link
                        href={techStackMenuColumn.techFeaturedPanel.techPanelCtaUrl?.url || "#"}
                        className={styles.caseStudyLink}
                      >
                        {techStackMenuColumn.techFeaturedPanel.techPanelCtaText}
                        <i className="fa-kit fa-right-arrow icon"></i>
                      </Link>
                    </div>
                  )}
                </div>
                {techStackMenuColumn.techstackOverviewCta?.[0] && (
                  <Link 
                    href={techStackMenuColumn.techstackOverviewCta[0].techstackButtonLink?.url || "/tech-stack"} 
                    target={techStackMenuColumn.techstackOverviewCta[0].techstackButtonLink?.target || undefined}
                    className={styles.caseStudyLink}
                  >
                    {techStackMenuColumn.techstackOverviewCta[0].techstackButtonText}
                    <i className="fa-kit fa-right-arrow icon"></i>
                  </Link>
                )}
              </div>
            )}
          </li>
        )}

        {resourcesMenuColumn && (
          <li
            className={styles.dropdownItem}
            onClick={() => toggleDropdown("resources")}
          >
            <Link
              href="#"
              onClick={(e) => e.preventDefault()}
              className={
                isParentActive([
                  ...(resourcesMenuColumn.resourcesColumn?.resourcesLinks?.map(l => l.resourceLinkUrl?.url || "") || []),
                  resourcesMenuColumn.resourcesOverviewCta?.[0]?.resourcesButtonLink?.url || "/resources",
                ].filter(Boolean) as string[])
                  ? styles.navLinkActive
                  : undefined
              }
            >
              {resourcesMenuColumn.resColumnHeading}
              <i
                className={`${styles.dropdownIcon} fa-kit fa-dropdown ${openDropdown === "resources" ? styles.rotated : ""}`}
              ></i>
            </Link>
            {openDropdown === "resources" && (
              <div className={`${styles.dropdownMenu} ${styles.resourcesDropdownMenu}`}>
                <div className={styles.dropdownContent}>
                  <div className={styles.dropdownColumn}>
                    <ul className={styles.dropdownList}>
                      {resourcesMenuColumn.resourcesColumn?.resourcesLinks?.map((link, idx) => (
                        <li key={idx}>
                          <Link 
                            href={link.resourceLinkUrl?.url || "/"} 
                            target={link.resourceLinkUrl?.target || undefined}
                            className={isLinkActive(link.resourceLinkUrl?.url || "") ? styles.navLinkActive : undefined}
                          >
                            {link.resourceLinkLabel}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                  {resourcesMenuColumn.resFeaturedPanel && (
                    <div className={styles.dropdownCaseStudy}>
                       <p className={styles.caseStudyTitle}>{resourcesMenuColumn.resFeaturedPanel.resPanelEyebrow}</p>
                      <p className={styles.caseStudyDescription}>
                        {resourcesMenuColumn.resFeaturedPanel.resPanelDescription}
                      </p>
                      <Link
                        href={resourcesMenuColumn.resFeaturedPanel.resPanelCtaUrl?.url || "#"}
                        className={styles.caseStudyLink}
                      >
                        {resourcesMenuColumn.resFeaturedPanel.resPanelCtaText}
                        <i className="fa-kit fa-right-arrow icon"></i>
                      </Link>
                    </div>
                  )}
                </div>
                {resourcesMenuColumn.resourcesOverviewCta?.[0] && (
                  <Link 
                    href={resourcesMenuColumn.resourcesOverviewCta[0].resourcesButtonLink?.url || "/resources"} 
                    target={resourcesMenuColumn.resourcesOverviewCta[0].resourcesButtonLink?.target || undefined}
                    className={styles.caseStudyLink}
                    style={{ marginTop: "10px", display: "inline-flex" }}
                  >
                    {resourcesMenuColumn.resourcesOverviewCta[0].resourcesButtonText}
                    <i className="fa-kit fa-right-arrow icon"></i>
                  </Link>
                )}
              </div>
            )}

          </li>
        )}

        {companyMenuColumn && (
          <li
            className={styles.dropdownItem}
            onClick={() => toggleDropdown("company")}
          >
            <Link
              href="#"
              onClick={(e) => e.preventDefault()}
              className={
                isParentActive(companyMenuColumn.companyColumn?.companyLinks?.map(l => l.companyLinkUrl?.url || "") || [])
                  ? styles.navLinkActive
                  : undefined
              }
            >
              {companyMenuColumn.compColumnHeading}
              <i
                className={`${styles.dropdownIcon} fa-kit fa-dropdown ${openDropdown === "company" ? styles.rotated : ""}`}
              ></i>
            </Link>
            {openDropdown === "company" && (
              <div className={`${styles.dropdownMenu} ${styles.companyDropdownMenu}`}>
                <div className={styles.dropdownContent}>
                  <div className={styles.dropdownColumn}>
                    <ul className={styles.dropdownList}>
                      {companyMenuColumn.companyColumn?.companyLinks?.map((link, idx) => (
                        <li key={idx}>
                          <Link 
                            href={link.companyLinkUrl?.url || "/"} 
                            target={link.companyLinkUrl?.target || undefined}
                            className={isLinkActive(link.companyLinkUrl?.url || "") ? styles.navLinkActive : undefined}
                          >
                            {link.companyLinkLabel}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                  {companyMenuColumn.compFeaturedPanel && (
                    <div className={styles.dropdownCaseStudy}>
                      <p className={styles.caseStudyTitle}>{companyMenuColumn.compFeaturedPanel.compPanelEyebrow}</p>
                      <p className={styles.caseStudyDescription}>
                        {companyMenuColumn.compFeaturedPanel.compPanelDescription}
                      </p>
                      <Link
                        href={companyMenuColumn.compFeaturedPanel.compPanelCtaUrl?.url || "#"}
                        className={styles.caseStudyLink}
                      >
                        {companyMenuColumn.compFeaturedPanel.compPanelCtaText}
                        <i className="fa-kit fa-right-arrow icon"></i>
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            )}
          </li>
        )}
      </ul>
    </nav>
  );
}
