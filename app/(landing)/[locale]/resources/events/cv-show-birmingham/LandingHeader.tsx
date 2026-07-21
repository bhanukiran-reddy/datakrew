"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "@/components/ui/Link/Link";
import Image from "@/components/ui/Image/Image";
import styles from "./page.module.css";
import { NavMenuItems, MobileMenuToggle, MobileNavMenu } from "@/components/layout/Header";
import HeaderCtas from "./HeaderCtas";
import { usePathname } from "next/navigation";

export interface LandingHeaderProps {
    locale: string;
    ctaButtons?: any[];
    menuItems?: any[];
}

export default function LandingHeader({ locale, ctaButtons, menuItems }: LandingHeaderProps) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const pathname = usePathname();

    const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

    // Close menu when route changes
    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [pathname]);

    return (
        <header className={styles.landingHeader}>
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
                        <MobileMenuToggle 
                            isOpen={isMobileMenuOpen} 
                            onClick={toggleMobileMenu} 
                        />
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
        </header>
    );
}

