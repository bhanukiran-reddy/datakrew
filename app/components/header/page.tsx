import Link from "next/link";
import styles from "./header.module.css";
import Image from "next/image";

export default function Header() {
  return (
    <header>
      <div className="container">
        <div className={styles.promoBar}>
          <div className={styles.promoBarText}>
            <p>We are hiring! <Link href="/careers">Join our team</Link></p>
          </div>
          <div className={styles.promoBarIcon}>
            <div>
            <Image src="/Search.svg" alt="logo" width={20} height={20} /> 
            <div>
              <Image src="/menu.svg" alt="logo" width={20} height={20} />
              <Link href="/">Login</Link>
            </div>
            <div>
              <Image src="/menu.svg" alt="logo" width={20} height={20} />
              <p>EN-US</p>
              <Image src="/arrow-down.svg" alt="logo" width={20} height={20} />
            </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}