
import styles from './ProfileInfo.module.css'
import Link from '@/components/ui/Link/Link'
import Image from '@/components/ui/Image/Image'
import linkedIcon from '@/public/icons/linkedin-icon.svg'
import quotesIcon from '@/public/icons/quotes.svg'

type ProfileInfoProps = {
  name: string;
  role: string;
  description: string;
  link?: string;
  image: string;
  iconClass?: string;
  pageName?: string;
}

export default function ProfileInfo({ name, role, description, link, image, iconClass, pageName }: ProfileInfoProps) {
  return (
    <>
      {pageName === "Team" ? (
        <div className={styles.profileInformation}>
          <div className={styles.profileImg}>
            <Image
              src={image}
              alt="Team Member"
              width={200}
              height={200}
            />
          </div>
          <div className={styles.profileText}>
            <Image className={`${styles.iconQuote} ${iconClass ?? ""}`} src={quotesIcon} alt="Quotes icon" width={39} height={28} />
            <div className={styles.info} dangerouslySetInnerHTML={{ __html: description }} />
            <div className={styles.profileNameLink}>
              <div className={styles.profileName}>
                <h4>{name}</h4>
                <p>{role}</p>
              </div>
              <div className={styles.Link}>
                {link && (
                  <Link
                    href={link} target="_blank" rel="noopener noreferrer">
                    <Image src={linkedIcon} alt="linkedin icon" width={22} height={22} />
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>  
      ) : (
        <div className={styles.DownloadForm}>
          <form action="">
            <input type="text" placeholder='name' />
          </form>
        </div>
      )}
    </>
  )
}