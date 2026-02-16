'use client';

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import styles from "./header.module.css";
import Image from "next/image";

export default function Header() {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpenDropdown(null);
      }
    };

    if (openDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [openDropdown]);

  const toggleDropdown = (menu: string) => {
    setOpenDropdown(openDropdown === menu ? null : menu);
  };

  return (
    <header className={styles.headerContainer}>
      <div className={styles.promoBar}>
        <div className="container">
          <div className={styles.promoBarContent}>
            <div className={styles.promoBarText}>
              <p>See how leading EV fleet operators reduce downtime with battery intelligence
              </p>
              <Link href="/careers">Get the whitepaper <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15.2902 9.99755L12.6458 7.35318C12.4506 7.15791 12.4506 6.84133 12.6458 6.64607C12.8411 6.45081 13.1577 6.45081 13.3529 6.64607L16.8213 10.1144C16.9305 10.2061 17 10.3437 17 10.4975L17 10.4992C17 10.5779 16.9816 10.6566 16.9447 10.7282C16.9215 10.7734 16.891 10.8157 16.8533 10.8535L16.843 10.8635L13.3529 14.3536C13.1577 14.5488 12.8411 14.5488 12.6458 14.3536C12.4505 14.1583 12.4505 13.8417 12.6458 13.6464L15.2947 10.9975L3.5 10.9975C3.22386 10.9975 3 10.7737 3 10.4975C3 10.2214 3.22386 9.99755 3.5 9.99755L15.2902 9.99755Z" fill="#131313" />
              </svg>
              </Link>

            </div>
            <div className={styles.promoBarNav}>
              <div className={`${styles.promoBarNavItems} ${styles.promoSearch}`}>
                <Image src="/Search.svg" alt="logo" width={24} height={24} />
                <div className={`${styles.promoBarNavItemLogin}`}>
                  <Image src="/user-icon.svg" alt="logo" width={24} height={24} />
                  <Link href="/">Login</Link>
                </div>
                <div className={styles.languageSelector}>
                  <Image src="/globe.svg" alt="logo" width={24} height={24} />
                  <p>EN-US</p>
                  <Image src="/arrow-down.svg" alt="logo" width={24} height={24} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.navContainer}>
        <div className="container">
          <div className={styles.navContent}>
            <div className={styles.navContentLeft}>
              <Image src="/company-logo.svg" alt="logo" width={20} height={20} />
            </div>
            <div className={styles.navMenu} ref={dropdownRef}>
              <ul className={styles.navMenuItemsList}>
                <li 
                  className={styles.dropdownItem}
                  onClick={() => toggleDropdown('solutions')}
                >
                  <Link href="#" onClick={(e) => e.preventDefault()}>
                    Solutions
                    <svg 
                      width="16" 
                      height="16" 
                      viewBox="0 0 16 16" 
                      fill="none" 
                      xmlns="http://www.w3.org/2000/svg"
                      className={openDropdown === 'solutions' ? styles.rotated : ''}
                    >
                      <path d="M7.99964 10.2363L4.23047 6.46715L4.93297 5.76465L7.99964 8.83132L11.0663 5.76465L11.7688 6.46715L7.99964 10.2363Z" fill="white" />
                    </svg>
                  </Link>
                  {openDropdown === 'solutions' && (
                    <div className={styles.dropdownMenu}>
                      <div className={styles.dropdownContent}>
                        <div className={styles.dropdownColumn}>
                          <h3 className={styles.dropdownTitle}>By Customer</h3>
                          <ul className={styles.dropdownList}>
                            <li><Link href="/fleet">Fleet</Link></li>
                            <li><Link href="/oem">OEM</Link></li>
                          </ul>
                        </div>
                        <div className={styles.dropdownColumn}>
                          <h3 className={styles.dropdownTitle}>By Industry</h3>
                          <ul className={styles.dropdownList}>
                            <li><Link href="/logistics-delivery">Logistics & delivery</Link></li>
                            <li><Link href="/mining-construction">Mining & construction</Link></li>
                            <li><Link href="/manufacturing-warehouse">Manufacturing & warehouse</Link></li>
                            <li><Link href="/airports-transport">Airports & public transport</Link></li>
                            <li><Link href="/ride-hailing">Ride-hailing & self drive</Link></li>
                          </ul>
                        </div>
                        <div className={styles.dropdownColumn}>
                          <h3 className={styles.dropdownTitle}>By Need</h3>
                          <ul className={styles.dropdownList}>
                            <li><Link href="/fleet-intelligence">Fleet intelligence</Link></li>
                            <li><Link href="/electric-fleet">Electric fleet management</Link></li>
                            <li><Link href="/mixed-fleet">Mixed fleet management</Link></li>
                            <li><Link href="/tco-roi">Lowering TCO & increasing ROI</Link></li>
                            <li><Link href="/predictive-maintenance">Predictive maintenance & scheduling</Link></li>
                            <li><Link href="/safety">Safety & protection</Link></li>
                            <li><Link href="/route-optimization">Route optimization</Link></li>
                          </ul>
                        </div>
                        <div className={styles.dropdownCaseStudy}>
                          <h3 className={styles.caseStudyTitle}>Case study</h3>
                          <p className={styles.caseStudyDescription}>
                            A leading last-mile delivery operator with a fleet of 500+ electric vans was facing unpredictable battery degradation. Frequent...
                          </p>
                          <Link href="/case-study" className={styles.caseStudyLink}>
                            View case study →
                          </Link>
                        </div>
                      </div>
                    </div>
                  )}
                </li>
                <li 
                  className={styles.dropdownItem}
                  onClick={() => toggleDropdown('intelligence')}
                >
                  <Link href="#" onClick={(e) => e.preventDefault()}>
                    Intelligence infrastructure
                    <svg 
                      width="16" 
                      height="16" 
                      viewBox="0 0 16 16" 
                      fill="none" 
                      xmlns="http://www.w3.org/2000/svg"
                      className={openDropdown === 'intelligence' ? styles.rotated : ''}
                    >
                      <path d="M7.99964 10.2363L4.23047 6.46715L4.93297 5.76465L7.99964 8.83132L11.0663 5.76465L11.7688 6.46715L7.99964 10.2363Z" fill="white" />
                    </svg>
                  </Link>
                  {openDropdown === 'intelligence' && (
                    <div className={styles.dropdownMenu}>
                      <div className={styles.dropdownContent}>
                        <div className={styles.dropdownColumn}>
                          <h3 className={styles.dropdownTitle}>Intelligence Infrastructure</h3>
                          <ul className={styles.dropdownList}>
                            <li><Link href="/platform">Platform</Link></li>
                            <li><Link href="/api">API & Integrations</Link></li>
                            <li><Link href="/data-analytics">Data & Analytics</Link></li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}
                </li>
                <li 
                  className={styles.dropdownItem}
                  onClick={() => toggleDropdown('resources')}
                >
                  <Link href="#" onClick={(e) => e.preventDefault()}>
                    Resources
                    <svg 
                      width="16" 
                      height="16" 
                      viewBox="0 0 16 16" 
                      fill="none" 
                      xmlns="http://www.w3.org/2000/svg"
                      className={openDropdown === 'resources' ? styles.rotated : ''}
                    >
                      <path d="M7.99964 10.2363L4.23047 6.46715L4.93297 5.76465L7.99964 8.83132L11.0663 5.76465L11.7688 6.46715L7.99964 10.2363Z" fill="white" />
                    </svg>
                  </Link>
                  {openDropdown === 'resources' && (
                    <div className={styles.dropdownMenu}>
                      <div className={styles.dropdownContent}>
                        <div className={styles.dropdownColumn}>
                          <h3 className={styles.dropdownTitle}>Resources</h3>
                          <ul className={styles.dropdownList}>
                            <li><Link href="/blog">Blog</Link></li>
                            <li><Link href="/whitepapers">Whitepapers</Link></li>
                            <li><Link href="/case-studies">Case Studies</Link></li>
                            <li><Link href="/webinars">Webinars</Link></li>
                            <li><Link href="/documentation">Documentation</Link></li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}
                </li>
                <li 
                  className={styles.dropdownItem}
                  onClick={() => toggleDropdown('company')}
                >
                  <Link href="#" onClick={(e) => e.preventDefault()}>
                    Company
                    <svg 
                      width="16" 
                      height="16" 
                      viewBox="0 0 16 16" 
                      fill="none" 
                      xmlns="http://www.w3.org/2000/svg"
                      className={openDropdown === 'company' ? styles.rotated : ''}
                    >
                      <path d="M7.99964 10.2363L4.23047 6.46715L4.93297 5.76465L7.99964 8.83132L11.0663 5.76465L11.7688 6.46715L7.99964 10.2363Z" fill="white" />
                    </svg>
                  </Link>
                  {openDropdown === 'company' && (
                    <div className={styles.dropdownMenu}>
                      <div className={styles.dropdownContent}>
                        <div className={styles.dropdownColumn}>
                          <h3 className={styles.dropdownTitle}>Company</h3>
                          <ul className={styles.dropdownList}>
                            <li><Link href="/about">About Us</Link></li>
                            <li><Link href="/careers">Careers</Link></li>
                            <li><Link href="/contact">Contact</Link></li>
                            <li><Link href="/news">News & Press</Link></li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}
                </li>
              </ul>
            </div>
            <div className={styles.navContentRight}>
              <div className={styles.navContentRightItem}>
                <Link className="secondaryCta" href="/">Talk to our expert
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4.00685 12.3509L4 12.2491C4 11.8694 4.28215 11.5556 4.64823 11.506L4.75 11.4991L17.446 11.5L14.2248 8.28055C13.9585 8.0144 13.9341 7.59774 14.1518 7.30404L14.2244 7.21989C14.4905 6.95352 14.9072 6.92913 15.2009 7.14687L15.2851 7.21945L19.7851 11.7157C20.0514 11.9818 20.0758 12.3985 19.8581 12.6922L19.7855 12.7763L15.2855 17.2801C14.9927 17.5731 14.5179 17.5733 14.2248 17.2806C13.9585 17.0144 13.9341 16.5977 14.1518 16.304L14.2244 16.2199L17.442 13L4.75 12.9991C4.3703 12.9991 4.05651 12.717 4.00685 12.3509L4 12.2491L4.00685 12.3509Z" fill="#93D772" />
                  </svg>

                </Link>
                <Link className='primaryCta' href="/">Book a demo
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4.00685 12.3509L4 12.2491C4 11.8694 4.28215 11.5556 4.64823 11.506L4.75 11.4991L17.446 11.5L14.2248 8.28055C13.9585 8.0144 13.9341 7.59774 14.1518 7.30404L14.2244 7.21989C14.4905 6.95352 14.9072 6.92913 15.2009 7.14687L15.2851 7.21945L19.7851 11.7157C20.0514 11.9818 20.0758 12.3985 19.8581 12.6922L19.7855 12.7763L15.2855 17.2801C14.9927 17.5731 14.5179 17.5733 14.2248 17.2806C13.9585 17.0144 13.9341 16.5977 14.1518 16.304L14.2244 16.2199L17.442 13L4.75 12.9991C4.3703 12.9991 4.05651 12.717 4.00685 12.3509L4 12.2491L4.00685 12.3509Z" fill="#131313" />
                  </svg>

                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header >
  );
}