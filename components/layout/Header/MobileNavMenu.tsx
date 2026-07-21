"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "@/components/ui/Link/Link";
import { usePathname } from "next/navigation";
import type { NavItemFields, HeaderCtaButton } from "@/lib/graphql/types";
import styles from "./Header.module.css";

export interface MobileNavMenuProps {
  locale?: string;
  isOpen: boolean;
  onClose: () => void;
  menuItems?: NavItemFields[] | null;
  ctaButtons?: HeaderCtaButton[] | null;
}

export default function MobileNavMenu({ locale = "", isOpen, onClose, menuItems, ctaButtons }: MobileNavMenuProps) {
  const pathname = usePathname();
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);

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
    if (!isOpen) {
      setActiveSubmenu(null);
    }
  }, [isOpen]);

  const openSubmenu = (menu: string) => setActiveSubmenu(menu);
  const closeSubmenu = () => setActiveSubmenu(null);

  const firstItem = menuItems?.[0];
  if (!firstItem) return null;

  const { solutionMenuColumn, techStackMenuColumn, resourcesMenuColumn, companyMenuColumn } = firstItem;

  return (
    <div className={`${styles.mobileMenuDrawer} ${isOpen ? styles.open : ""}`}>
      <div
        className={styles.mobileMenuContent}
        style={{
          transform: activeSubmenu ? "translateX(-50%)" : "translateX(0)",
        }}
      >
        {/* Close Button Trigger for Level 1 */}
        <button
          className={styles.closeMenuBtn}
          onClick={onClose}
          aria-label="Close menu"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        {/* Level 1: Main Menu */}
        <div className={styles.mobileLevel}>
          <button
            type="button"
            className={styles.mobileSubHeaderClose}
            onClick={onClose}
            aria-label="Close menu"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
          
          <div className={styles.mobileTopBar}>
            <div className={styles.promoBarNavItem}>

              <div className={styles.promoBarNavItemLogin}>
                {/* <i className={`${styles.magnifierIconLight} fa-kit fa-magnifier`}></i> */}
                <i className={`${styles.loginIcon} fa-kit fa-login`}></i>
                <Link href="/">Become a partner</Link>
              </div>
              <div className={styles.languageSelector}>
                <i className={`${styles.globeIconLight} fa-kit fa-globe`}></i>
                <p>EN-UK</p>
              </div>
            </div>
          </div>

          <ul className={styles.mobileNavList}>
            {solutionMenuColumn && (
              <li
                onClick={() => openSubmenu("solutions")}
                className={isParentActive([
                  ...(solutionMenuColumn.byCustomerColumn?.byCustomerLinks?.nodes?.map(n => n.uri || "") || []),
                  ...(solutionMenuColumn.byIndustryColumn?.byIndustryLinks?.nodes?.map(n => n.uri || "") || []),
                  ...(solutionMenuColumn.byNeedColumn?.byNeedLinks?.nodes?.map(n => n.uri || "") || []),
                  "/solutions",
                ].filter(Boolean)) ? styles.mobileActive : ""}
              >
                <span>{solutionMenuColumn.solColumnHeading}</span>
                <i className="fa-kit fa-right-nav"></i>
              </li>
            )}
            {techStackMenuColumn && (
              <li
                onClick={() => openSubmenu("intelligence")}
                className={isParentActive([
                  ...(techStackMenuColumn.hardwareColumn?.hardwareLinks?.nodes?.map(n => n.uri || "") || []),
                  ...(techStackMenuColumn.softwareColumn?.softwareLinks?.nodes?.map(n => n.uri || "") || []),
                  ...(techStackMenuColumn.aiSolutionsColumn?.aiSolutionsLinks?.nodes?.map(n => n.uri || "") || []),
                  techStackMenuColumn.techstackOverviewCta?.[0]?.techstackButtonLink?.url || "/tech-stack",
                ].filter(Boolean)) ? styles.mobileActive : ""}
              >
                <span>{techStackMenuColumn.techColumnHeading}</span>
                <i className={`${styles.dropdownIconRotNegative} fa-kit fa-dropdown`}></i>
              </li>
            )}
            {resourcesMenuColumn && (
              <li
                onClick={() => openSubmenu("resources")}
                className={isParentActive([
                  ...(resourcesMenuColumn.resourcesColumn?.resourcesLinks?.map(l => l.resourceLinkUrl?.url || "") || []),
                  resourcesMenuColumn.resourcesOverviewCta?.[0]?.resourcesButtonLink?.url || "/resources",
                ].filter(Boolean)) ? styles.mobileActive : ""}
              >
                <span>{resourcesMenuColumn.resColumnHeading}</span>
                <i className={`${styles.dropdownIconRotNegative} fa-kit fa-dropdown`}></i>
              </li>
            )}
            {companyMenuColumn && (
              <li
                onClick={() => openSubmenu("company")}
                className={isParentActive([
                  ...(companyMenuColumn.companyColumn?.companyLinks?.map(l => l.companyLinkUrl?.url || "") || []),
                  "/about-us",
                  "/careers",
                  "/team",
                  "/contact",
                ].filter(Boolean)) ? styles.mobileActive : ""}
              >
                <span>{companyMenuColumn.compColumnHeading}</span>
                <i className={`${styles.dropdownIconRotNegative} fa-kit fa-dropdown`}></i>
              </li>
            )}
          </ul>

          <div className={styles.mobileBottomCtas}>
            {ctaButtons?.map((button, idx) => (
              <Link 
                key={idx} 
                className={idx === 0 ? "secondaryCta" : "primaryCta"} 
                href={button.buttonUrl?.url || "#"}
                target={button.buttonUrl?.target || undefined}
                onClick={onClose}
              >
                {button.buttonText}
                <i className={`icon fa-kit fa-right-arrow`} style={{ marginLeft: "8px" }}></i>
              </Link>
            ))}
          </div>
        </div>

        {/* Level 2: Submenus */}
        <div className={styles.mobileLevel}>
          {activeSubmenu === "solutions" && solutionMenuColumn && (
            <div className={styles.mobileSubMenu}>
              <div className={styles.mobileSubHeader} onClick={closeSubmenu}>
                <i className={`${styles.dropdownIconRotPositive} fa-kit fa-right-arrow`}></i>
                <span>Back</span>
              </div>
              {solutionMenuColumn.byCustomerColumn && (
                <div className={styles.dropdownColumn}>
                  <h3 className={styles.dropdownTitle}>{solutionMenuColumn.byCustomerColumn.byCustomerHeading}</h3>
                  <ul className={styles.dropdownList}>
                    {solutionMenuColumn.byCustomerColumn.byCustomerLinks?.nodes?.map((node) => (
                      <li key={node.id}>
                        <Link href={node.uri || "/"} onClick={onClose} className={isLinkActive(node.uri || "") ? styles.navLinkActive : undefined}>
                          {node.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {solutionMenuColumn.byIndustryColumn && (
                <div className={styles.dropdownColumn} style={{ marginTop: "20px" }}>
                  <h3 className={styles.dropdownTitle}>{solutionMenuColumn.byIndustryColumn.byIndustryHeading}</h3>
                  <ul className={styles.dropdownList}>
                    {solutionMenuColumn.byIndustryColumn.byIndustryLinks?.nodes?.map((node) => (
                      <li key={node.id}>
                        <Link href={node.uri || "/"} onClick={onClose} className={isLinkActive(node.uri || "") ? styles.navLinkActive : undefined}>
                          {node.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {solutionMenuColumn.byNeedColumn && (
                <div className={styles.dropdownColumn} style={{ marginTop: "20px" }}>
                  <h3 className={styles.dropdownTitle}>{solutionMenuColumn.byNeedColumn.byNeedHeading}</h3>
                  <ul className={styles.dropdownList}>
                    {solutionMenuColumn.byNeedColumn.byNeedLinks?.nodes?.map((node) => (
                      <li key={node.id}>
                        <Link href={node.uri || "/"} onClick={onClose} className={isLinkActive(node.uri || "") ? styles.navLinkActive : undefined}>
                          {node.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {activeSubmenu === "intelligence" && techStackMenuColumn && (
            <div className={styles.mobileSubMenu}>
              <div className={styles.mobileSubHeader} onClick={closeSubmenu}>
                <i className={`${styles.dropdownIconRotPositive} fa-kit fa-right-arrow`}></i>
                <span>Back</span>
              </div>
              {techStackMenuColumn.hardwareColumn && (
                <div className={styles.dropdownColumn}>
                  <h3 className={styles.dropdownTitle}>{techStackMenuColumn.hardwareColumn.hardwareHeading}</h3>
                  <ul className={styles.dropdownList}>
                    {techStackMenuColumn.hardwareColumn.hardwareLinks?.nodes?.map((node) => (
                      <li key={node.id}>
                        <Link href={node.uri || "/"} onClick={onClose} className={isLinkActive(node.uri || "") ? styles.navLinkActive : undefined}>
                          {node.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {techStackMenuColumn.softwareColumn && (
                <div className={styles.dropdownColumn} style={{ marginTop: "20px" }}>
                  <h3 className={styles.dropdownTitle}>{techStackMenuColumn.softwareColumn.softwareHeading}</h3>
                  <ul className={styles.dropdownList}>
                    {techStackMenuColumn.softwareColumn.softwareLinks?.nodes?.map((node) => (
                      <li key={node.id}>
                        <Link href={node.uri || "/"} onClick={onClose} className={isLinkActive(node.uri || "") ? styles.navLinkActive : undefined}>
                          {node.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {techStackMenuColumn.aiSolutionsColumn && (
                <div className={styles.dropdownColumn} style={{ marginTop: "20px" }}>
                  <h3 className={styles.dropdownTitle}>{techStackMenuColumn.aiSolutionsColumn.aiSolutionsHeading}</h3>
                  <ul className={styles.dropdownList}>
                    {techStackMenuColumn.aiSolutionsColumn.aiSolutionsLinks?.nodes?.map((node) => (
                      <li key={node.id}>
                        <Link href={node.uri || "/"} onClick={onClose} className={isLinkActive(node.uri || "") ? styles.navLinkActive : undefined}>
                          {node.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              <ul className={styles.mobileNavList} style={{ marginTop: "20px" }}>
                {techStackMenuColumn.techstackOverviewCta?.[0] && (
                  <li>
                    <Link 
                      href={techStackMenuColumn.techstackOverviewCta[0].techstackButtonLink?.url || "/tech-stack"} 
                      target={techStackMenuColumn.techstackOverviewCta[0].techstackButtonLink?.target || undefined}
                      onClick={onClose} 
                      className={styles.caseStudyLink}
                    >
                      {techStackMenuColumn.techstackOverviewCta[0].techstackButtonText} 
                      <i className="icon fa-kit fa-right-arrow"></i>
                    </Link>
                  </li>
                )}
              </ul>
            </div>
          )}

          {activeSubmenu === "resources" && resourcesMenuColumn && (
            <div className={styles.mobileSubMenu}>
              <div className={styles.mobileSubHeader} onClick={closeSubmenu}>
                <i className={`${styles.dropdownIconRotPositive} fa-kit fa-right-arrow`}></i>
                <span>Back</span>
              </div>
              <div className={styles.dropdownColumn}>
                <h3 className={styles.dropdownTitle}>{resourcesMenuColumn.resColumnHeading}</h3>
                <ul className={styles.dropdownList}>
                  {resourcesMenuColumn.resourcesColumn?.resourcesLinks?.map((link, idx) => (
                    <li key={idx}>
                      <Link 
                        href={link.resourceLinkUrl?.url || "/"} 
                        target={link.resourceLinkUrl?.target || undefined}
                        onClick={onClose} 
                        className={isLinkActive(link.resourceLinkUrl?.url || "") ? styles.navLinkActive : undefined}
                      >
                        {link.resourceLinkLabel}
                      </Link>
                    </li>
                  ))}
                </ul>
                {resourcesMenuColumn.resourcesOverviewCta?.[0] && (
                  <Link 
                    href={resourcesMenuColumn.resourcesOverviewCta[0].resourcesButtonLink?.url || "/resources"} 
                    target={resourcesMenuColumn.resourcesOverviewCta[0].resourcesButtonLink?.target || undefined}
                    onClick={onClose} 
                    className={styles.caseStudyLink}
                    style={{ marginTop: "20px", display: "inline-flex" }}
                  >
                    {resourcesMenuColumn.resourcesOverviewCta[0].resourcesButtonText}
                    <i className="fa-kit fa-right-arrow icon"></i>
                  </Link>
                )}
              </div>
            </div>
          )}

          {activeSubmenu === "company" && companyMenuColumn && (
            <div className={styles.mobileSubMenu}>
              <div className={styles.mobileSubHeader} onClick={closeSubmenu}>
                <i className={`${styles.dropdownIconRotPositive} fa-kit fa-right-arrow`}></i>
                <span>Back</span>
              </div>
              <div className={styles.dropdownColumn}>
                <h3 className={styles.dropdownTitle}>{companyMenuColumn.compColumnHeading}</h3>
                <ul className={styles.dropdownList}>
                  {companyMenuColumn.companyColumn?.companyLinks?.map((link, idx) => (
                    <li key={idx}>
                      <Link 
                        href={link.companyLinkUrl?.url || "/"} 
                        target={link.companyLinkUrl?.target || undefined}
                        onClick={onClose} 
                        className={isLinkActive(link.companyLinkUrl?.url || "") ? styles.navLinkActive : undefined}
                      >
                        {link.companyLinkLabel}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
