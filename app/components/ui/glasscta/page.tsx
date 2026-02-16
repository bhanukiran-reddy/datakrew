import styles from './page.module.css';
import Link from 'next/link';
import Image from 'next/image';
export default function GlassButton( {icon, text}: {icon: string, text: string} ) {
    return (
        <Link href="/" className={styles.glassButton}>
           <Image src={icon} alt={text} width={28} height={28} /> <span>{text}</span>
        </Link>
    );
}