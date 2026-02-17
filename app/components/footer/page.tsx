'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from './page.module.css';

export default function Footer() {
    const [email, setEmail] = useState('');
    const [agreed, setAgreed] = useState(false);

    return (
        <footer className={styles.footer}>
            <div className="container">
                <div className={styles.footerMain}>
                    {/* Left Section - Newsletter */}
                    <div className={styles.footerLeft}>
                        <div className={styles.logoSection}>
                            <Image 
                                src="/Footer-logo.svg" 
                                alt="Datakrew Logo" 
                                width={40} 
                                height={40} 
                                className={styles.logo}
                            />
                            <span className={styles.companyName}>DATAKREW</span>
                        </div>
                        <h2 className={styles.substackHeading}>Datakrew's substack</h2>
                        <p className={styles.substackDescription}>
                            Subscribe to our newsletter for the latest updates, insights, and breakthroughs - delivered straight to your inbox.
                        </p>
                        <form className={styles.subscribeForm} onSubmit={(e) => e.preventDefault()}>
                            <div className={styles.inputGroup}>
                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className={styles.emailInput}
                                />
                                <button type="submit" className={styles.subscribeButton}>
                                    Subscribe
                                </button>
                            </div>
                            <label className={styles.checkboxLabel}>
                                <input
                                    type="checkbox"
                                    checked={agreed}
                                    onChange={(e) => setAgreed(e.target.checked)}
                                    className={styles.checkbox}
                                />
                                <span className={styles.checkboxText}>
                                    By subscribing you agree to substack's terms of use, our privacy policy and our information collection notice
                                </span>
                            </label>
                        </form>
                    </div>
                    <div className={styles.footerRightSeparator} />
                    {/* Right Section - Contact */}
                    <div className={styles.footerRight}>
                        <data value=""></data>
                        <h2 className={styles.contactHeading}>Contact us</h2>
                        <div className={styles.officesGrid}>
                            <div className={styles.office}>
                                <h3 className={styles.officeHeading}>Singapore Office</h3>
                                <address className={styles.address}>
                                    <p>1 Cleantech Loop, #02-26</p>
                                    <p>JTC CleanTech One,</p>
                                    <p>Singapore 637141</p>
                                    <p className={styles.email}>
                                        <a href="mailto:info@datakrew.com">info@datakrew.com</a>
                                    </p>
                                </address>
                            </div>
                            <div className={styles.office}>
                                <h3 className={styles.officeHeading}>India Office</h3>
                                <address className={styles.address}>
                                    <p>4th floor, Regus, cabin no: 409, 45</p>
                                    <p>Baner Street, Veerbhadra Nagar,</p>
                                    <p>Baner, Pune, Maharashtra 411045</p>
                                    <p className={styles.email}>
                                        <a href="mailto:info@datakrew.com">info@datakrew.com</a>
                                    </p>
                                </address>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className={styles.footerBottom}>
                    <div className={styles.bottomLeft}>
                        <p className={styles.copyright}>©2026. All rights reserved</p>
                    </div>
                    <div className={styles.bottomCenter}>
                        <Link href="/privacy" className={styles.legalLink}>Privacy policy</Link>
                        <span className={styles.separator}>|</span>
                        <Link href="/terms" className={styles.legalLink}>Terms and conditions</Link>
                    </div>
                    <div className={styles.bottomRight}>
                        <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className={styles.socialIcon} aria-label="LinkedIn">
                            <Image src="/linkedin-icon.svg" alt="LinkedIn" width={20} height={20} />
                        </a>
                        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className={styles.socialIcon} aria-label="Twitter">
                            <Image src="/twitter-icon.svg" alt="Twitter" width={20} height={20} />
                        </a>
                        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className={styles.socialIcon} aria-label="Facebook">
                            <Image src="/facebook-icon.svg" alt="Facebook" width={20} height={20} />
                        </a>
                        <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className={styles.socialIcon} aria-label="YouTube">
                            <Image src="/youtube-icon.svg" alt="YouTube" width={20} height={20} />
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
