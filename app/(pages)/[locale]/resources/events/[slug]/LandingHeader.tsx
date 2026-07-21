"use client";

import { useState, Suspense } from "react";
import Link from "@/components/ui/Link/Link";
import Image from "@/components/ui/Image/Image";
import styles from "./page.module.css";
import { NavMenuItems, MobileMenuToggle, MobileNavMenu } from "@/components/layout/Header";
import HeaderCtas from "./HeaderCtas";
import { usePathname } from "next/navigation";
import type { NavItemFields } from "@/lib/graphql/types";

interface CtaButton {
    label?: string;
    text?: string;
    url: string;
    target?: string;
    pdfUrl?: string;
}

export interface LandingHeaderProps {
    locale: string;
    ctaButtons?: CtaButton[];
    menuItems?: NavItemFields[] | null;
}

export default function LandingHeader({ locale, ctaButtons, menuItems }: LandingHeaderProps) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const pathname = usePathname();

    const [prevPathname, setPrevPathname] = useState(pathname);
    if (pathname !== prevPathname) {
        setPrevPathname(pathname);
        setIsMobileMenuOpen(false);
    }

    const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

    return (
        <div role="banner" className={styles.landingHeader}>
            <div className="container">
                <div className={styles.headerInner}>
                    <Link href="/" className={styles.logoLink} locale={locale}>
                        <Image
                            src="/logos/company-logo.svg"
                            alt="Logo"
                            width={130}
                            height={90}
                            priority
                        />
                    </Link>
 
                    {/* Desktop Menu */}
                    <Suspense fallback={null}>
                      <NavMenuItems locale={locale} dropdownTop="7.625rem" menuItems={menuItems} />
                    </Suspense>

                    <div className={styles.headerRightSide}>
                        {/* Desktop CTAs - Hidden on mobile via CSS in page.module.css */}
                        {ctaButtons && (
                            <div className={styles.desktopCtasOnly}>
                                <HeaderCtas buttons={ctaButtons} />
                            </div>
                        )}

                        {/* Mobile Hamburger */}
                        {!isMobileMenuOpen && (
                            <MobileMenuToggle 
                                isOpen={isMobileMenuOpen} 
                                onClick={toggleMobileMenu} 
                            />
                        )}
                    </div>
                </div>
            </div>

            {/* Mobile Menu Drawer */}
            <MobileNavMenu 
                locale={locale} 
                isOpen={isMobileMenuOpen} 
                onClose={toggleMobileMenu} 
                menuItems={menuItems}
            />
        </div>
    );
}
