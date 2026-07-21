"use client";

import { useState, useRef, useEffect, useMemo, Suspense, Fragment } from "react";
import Link from "@/components/ui/Link/Link";
import Image from "next/image";
import { usePathname, useSearchParams } from "next/navigation";
import type { NavItem } from "@/lib/types/cms";
import type { Language } from "@/lib/i18n/getLanguages";
import type { GlobalHeaderMegaMenuFields } from "@/lib/graphql/types";
import styles from "./Header.module.css";
import SearchInline from "@/components/ui/Search/SearchInline";
import NavMenuItems from "./NavMenuItems";
import MobileMenuToggle from "./MobileMenuToggle";
import MobileNavMenu from "./MobileNavMenu";

const DEFAULT_ACTIVE_COLOR = "#3ab1c5";
const HEX_REGEX = /^#?[0-9A-Fa-f]{6}$/;

function parseActiveColorFromUrl(value: string | null): string {
  if (!value) return DEFAULT_ACTIVE_COLOR;
  const hex = value.startsWith("#") ? value : `#${value}`;
  return HEX_REGEX.test(hex) ? hex : DEFAULT_ACTIVE_COLOR;
}

export interface HeaderProps {
  locale?: string;
  siteName?: string;
  items?: NavItem[];
  languages?: Language[];
  headerData?: GlobalHeaderMegaMenuFields | null;
}

export function HeaderSkeleton() {
  return (
    <div className={`${styles.headerContainer} ${styles.headerSkeleton}`}>
      <div className={styles.navContainer}>
        <div className="container">
          <div className={styles.navSkeleton} />
        </div>
      </div>
    </div>
  );
}

export default function Header({ locale = "", headerData, ..._rest }: HeaderProps = {}) {
  void _rest;
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const [headerHeight, setHeaderHeight] = useState(0);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const activeColor = useMemo(
    () => parseActiveColorFromUrl(searchParams.get("activeColor")),
    [searchParams],
  );

  // Close mobile menu when pathname changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  useEffect(() => {
    const updateHeaderHeight = () => {
      if (headerRef.current) {
        const height = headerRef.current.offsetHeight;
        setHeaderHeight(height);
        document.documentElement.style.setProperty(
          "--header-height",
          `${height}px`
        );
      }
    };

    updateHeaderHeight();

    const resizeObserver = new ResizeObserver(() => {
      updateHeaderHeight();
    });

    if (headerRef.current) {
      resizeObserver.observe(headerRef.current);
    }

    window.addEventListener("resize", updateHeaderHeight);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", updateHeaderHeight);
    };
  }, []);

  const announcement = headerData?.topBar?.announcementSection;
  const logo = headerData?.headerLogo;
  const ctaButtons = headerData?.ctaSection?.ctaButtons;

  return (
    <header
      ref={headerRef}
      className={styles.headerContainer}
      style={{
        "--header-active-color": activeColor,
        "--header-height": `${headerHeight}px`
      } as React.CSSProperties}
    >
      {announcement?.announcementText && (
        <div className={styles.promoBar}>
          <div className="container">
            <div className={styles.promoBarContent}>
              <div className={styles.promoBarText}>
                <p dangerouslySetInnerHTML={{ __html: announcement.announcementText }} />
                {announcement.announcementCtaButton && (
                  <Link
                    className={`${styles.promoBarLink} tertiaryCta`}
                    href={announcement.announcementCtaButton.announcementButtonUrl?.url || "#"}
                    target={announcement.announcementCtaButton.announcementButtonUrl?.target || undefined}
                  >
                    {announcement.announcementCtaButton.announcementButtonText}
                    <i
                      className={`${styles.rightArrowIcon} fa-kit fa-right-arrow`}
                    ></i>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      <div className={styles.navContainer}>
        <div className="container">
          <div className={styles.navContent}>
            <Link href={logo?.headerLogoLink?.url || "/"} className={styles.navContentLeft}>
              {logo?.headerLogoImage?.node?.mediaItemUrl ? (
                <Image
                  src={logo.headerLogoImage.node.mediaItemUrl}
                  alt={logo.headerLogoImage.node.altText || "Logo"}
                  width={133}
                  height={62}
                  priority
                />
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="134"
                  height="52"
                  viewBox="0 0 134 52"
                  fill="none"
                >
                  <path
                    d="M37.914 39.6617L20.457 49.7383V32.8621L23.297 31.2227L30.8301 35.5711L37.914 39.6617Z"
                    fill="url(#paint0_linear_13754_8250)"
                  />
                  <path
                    d="M13.2225 2.32013V45.593L12.596 45.2305L6.57362 41.7542L5.82031 41.3191V8.78538C5.82031 7.92738 5.98749 7.10764 6.28962 6.35638C7.2524 3.95558 9.59893 2.26172 12.3443 2.26172C12.6424 2.26172 12.9364 2.28186 13.2225 2.32013Z"
                    fill="url(#paint1_linear_13754_8250)"
                  />
                  <path
                    d="M44.7882 23.7481C44.7882 25.2688 44.2686 26.6686 43.3944 27.7783C42.8788 28.4329 42.2423 28.9868 41.5172 29.4037L41.5011 29.4118L38.0588 31.3997L30.5257 27.0512L32.1754 26.0986L36.3306 23.6998L32.2056 21.3171L29.0433 19.4923L23.2384 22.8418L20.4548 24.449V14.5336L17.4738 12.8116L13.2218 10.3564L6.29102 6.35638C7.2538 3.95558 9.60033 2.26172 12.3457 2.26172C12.6438 2.26172 12.9378 2.28186 13.2239 2.32013C14.0698 2.43292 14.8634 2.70885 15.5744 3.11368L15.6107 3.13584L15.6449 3.15598L15.657 3.16403L20.4588 5.93543L36.4958 15.1942L41.5031 18.0865L41.5192 18.0945C42.2201 18.4994 42.8385 19.0291 43.344 19.6555C44.2484 20.7753 44.7882 22.1993 44.7882 23.7501V23.7481Z"
                    fill="url(#paint2_linear_13754_8250)"
                  />
                  <path
                    d="M47.9675 44.8575H44.9805V31.8867H50.9586C51.5145 31.8867 52.0342 31.9915 52.5156 32.2029C52.9969 32.4124 53.4159 32.6964 53.7764 33.0569C54.135 33.4154 54.421 33.8364 54.6325 34.3198C54.8419 34.8011 54.9467 35.3187 54.9467 35.8746V40.8777C54.9467 41.4335 54.8419 41.9512 54.6325 42.4325C54.421 42.9159 54.137 43.3349 53.7764 43.6893C53.4179 44.0458 52.999 44.3278 52.5176 44.5393C52.0382 44.7508 51.5185 44.8575H47.9655H47.9675ZM47.9675 34.8897V41.8726H50.9586C51.2426 41.8726 51.4823 41.7739 51.6756 41.5765C51.869 41.3792 51.9637 41.1455 51.9637 40.8756V35.8726C51.9637 35.6027 51.869 35.3691 51.6797 35.1757C51.4883 34.9824 51.2486 34.8877 50.9586 34.8877H47.9675V34.8897ZM58.6689 44.8575H55.6859L59.1483 31.8867H62.1897L65.6541 44.8575H62.6671L60.669 37.4134L58.6709 44.8575H58.6689ZM67.5333 34.8897H64.5302V31.8867H73.5135V34.8897H70.5103V44.8575H67.5333V34.8897ZM75.3847 44.8575H72.3996L75.864 31.8867H78.9034L82.3658 44.8575H79.3828L77.3847 37.4134L75.3826 44.8575H75.3847ZM86.0881 44.8575H83.101V31.8867H86.0881V36.8676H87.0831C87.3671 36.8676 87.6047 36.7729 87.7981 36.5856C87.9915 36.3943 88.0881 36.1566 88.0881 35.8746V31.8867H91.0752V35.8746C91.0752 36.3822 90.9946 36.8495 90.8315 37.2744C91.5002 37.5947 92.04 38.074 92.4529 38.7145C92.8658 39.353 93.0733 40.074 93.0733 40.8756V44.8555H90.0862V40.8756C90.0862 40.5917 89.9916 40.354 89.8042 40.1586C89.6129 39.9653 89.3732 39.8706 89.0852 39.8706H86.0901V44.8555L86.0881 44.8575ZM96.7874 44.8575H93.8044V31.8867H99.7845C100.338 31.8867 100.856 31.9915 101.34 32.2029C101.823 32.4124 102.242 32.6964 102.602 33.0569C102.961 33.4154 103.245 33.8364 103.456 34.3198C103.668 34.8011 103.773 35.8746 103.773 35.8746C103.773 36.3439 103.696 36.7911 103.543 37.216C103.39 37.643 103.176 38.0277 102.907 38.3701C103.178 38.7145 103.39 39.1012 103.543 39.5302C103.696 39.9592 103.773 40.4084 103.773 40.8777V44.8575H100.79V40.8777C100.79 40.5937 100.693 40.356 100.504 40.1606C100.314 39.9673 100.075 39.8726 99.7866 39.8726H96.7915V44.8575H96.7874ZM96.7874 34.8897V36.8676H99.7825C100.065 36.8676 100.302 36.7729 100.498 36.5856C100.691 36.3943 100.788 36.1566 100.788 35.8746C100.788 35.5927 100.691 35.3711 100.502 35.1778C100.312 34.9844 100.073 34.8897 99.7845 34.8897H96.7894H96.7874ZM104.504 40.8777V35.8746C104.504 35.3187 104.611 34.8011 104.822 34.3198C105.034 33.8384 105.318 33.4154 105.672 33.0569C106.029 32.6984 106.447 32.4124 106.929 32.2029C107.412 31.9915 107.93 31.8867 108.484 31.8867H114.474V34.8897H108.484C108.202 34.8897 107.964 34.9864 107.775 35.1778C107.586 35.3711 107.491 35.6027 107.491 35.8746V36.8676H114.474V39.8726H107.491V40.8777C107.491 41.1475 107.586 41.3832 107.775 41.5786C107.966 41.7759 108.202 41.8746 108.484 41.8746H114.474V44.8575H108.484C107.93 44.8575 107.412 44.7528 106.929 44.5393C106.447 44.3278 106.027 44.0458 105.672 43.6893C105.316 43.3328 105.034 42.9139 104.822 42.4325C104.611 41.9512 104.504 41.4335 104.504 40.8777ZM115.207 40.8777V31.8867H118.21V40.8777C118.21 41.1475 118.305 41.3832 118.494 41.5786C118.686 41.7759 118.921 41.8746 119.203 41.8746C119.485 41.8746 119.725 41.7759 119.92 41.5786C120.114 41.3812 120.21 41.1475 120.21 40.8777V36.8696H123.193V40.8777C123.193 41.1475 123.288 41.3832 123.479 41.5786C123.669 41.7759 123.904 41.8746 124.19 41.8746C124.476 41.8746 124.71 41.7759 124.904 41.5786C125.097 41.3812 125.192 41.1475 125.192 40.8777V31.8867H128.179V40.8777C128.179 41.4335 128.074 41.9512 127.862 42.4325C127.651 42.9159 127.367 43.3349 127.008 43.6893C126.65 44.0458 126.229 44.3278 125.745 44.5393C125.262 44.7508 124.744 44.8575 124.19 44.8575C123.719 44.8575 123.27 44.781 122.845 44.6279C122.42 44.4748 122.035 44.2613 121.691 43.9915C121.359 44.2634 120.98 44.4748 120.551 44.6279C120.122 44.781 119.673 44.8575 119.203 44.8575C118.649 44.8575 118.132 44.7528 117.648 44.5393C117.165 44.3278 116.744 44.0458 116.383 43.6893C116.021 43.3328 115.733 42.9139 115.521 42.4325C115.312 41.9512 115.207 41.4335 115.207 40.8777Z"
                    fill="#00B3C7"
                  />
                  <defs>
                    <linearGradient
                      id="paint0_linear_13754_8250"
                      x1="28.9771"
                      y1="32.131"
                      x2="29.3315"
                      y2="53.5308"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop offset="0.2" stopColor="#00B3C7" />
                      <stop offset="0.62" stopColor="#00CBC1" />
                      <stop offset="0.94" stopColor="#7DD863" />
                    </linearGradient>
                    <linearGradient
                      id="paint1_linear_13754_8250"
                      x1="9.23839"
                      y1="4.66051"
                      x2="10.0682"
                      y2="54.8901"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop offset="0.2" stopColor="#00B3C7" />
                      <stop offset="0.62" stopColor="#00CBC1" />
                      <stop offset="0.94" stopColor="#7DD863" />
                    </linearGradient>
                    <linearGradient
                      id="paint2_linear_13754_8250"
                      x1="44.9856"
                      y1="29.8206"
                      x2="5.26072"
                      y2="5.55116"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop offset="0.2" stopColor="#00B3C7" />
                      <stop offset="0.62" stopColor="#00CBC1" />
                      <stop offset="0.94" stopColor="#7DD863" />
                    </linearGradient>
                  </defs>
                </svg>
              )}
            </Link>

            {!isMobileMenuOpen && (
              <div className={styles.mobileActionsContainer}>
                {/* Mobile Actions (Search) */}
                {/* {!isSearchOpen && (
                  <div className={styles.mobileActions}>
                    <button
                      className={styles.searchToggleMobile}
                      onClick={() => setIsSearchOpen(!isSearchOpen)}
                      aria-label="Toggle search"
                    >
                      <i className={`fa-kit fa-magnifier`}></i>
                    </button>
                  </div>
                )} */}

                {/* Mobile Hamburger */}
                <MobileMenuToggle
                  isOpen={isMobileMenuOpen}
                  onClick={toggleMobileMenu}
                />
              </div>
            )}

            <NavMenuItems locale={locale} menuItems={headerData?.menuColumnsSection?.navItems} />

            <div className={styles.navContentRightItem}>
              {isSearchOpen && (
                <div className={styles.desktopSearchOnly}>
                  <SearchInline isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} locale={locale} />
                </div>
              )}
              {!isSearchOpen && (
                <>
                  {/* <button
                    className={styles.searchToggle}
                    onClick={() => setIsSearchOpen(true)}
                    aria-label="Open search"
                  >
                    <i className="fa-kit fa-magnifier"></i>
                  </button> */}
                  {ctaButtons && ctaButtons.length > 0 ? (
                    ctaButtons.map((button, idx) => (
                      <Link
                        key={idx}
                        className={idx === 0 ? "secondaryCta" : "primaryCta"}
                        href={button.buttonUrl?.url || "#"}
                        target={button.buttonUrl?.target || undefined}
                      >
                        {button.buttonText}
                        <i className={`icon fa-kit fa-right-arrow`}></i>
                      </Link>
                    ))
                  ) : (
                    <>
                      <Link className="secondaryCta" href="/contact">
                        Contact us
                        <i className={`icon fa-kit fa-right-arrow`}></i>
                      </Link>
                      <Link className="primaryCta" href="/book-a-demo">
                        Book a demo
                        <i className={`icon fa-kit fa-right-arrow`}></i>
                      </Link>
                    </>
                  )}
                </>
              )}
            </div>
          </div>
          {isSearchOpen && (
            <div className={styles.mobileSearchContainer}>
              <SearchInline isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} locale={locale} />
            </div>
          )}
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      <MobileNavMenu
        locale={locale}
        isOpen={isMobileMenuOpen}
        onClose={toggleMobileMenu}
        menuItems={headerData?.menuColumnsSection?.navItems}
        ctaButtons={ctaButtons}
      />
    </header>
  );
}
