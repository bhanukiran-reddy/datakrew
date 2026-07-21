import styles from "./TeamCard.module.css";
import Link from "@/components/ui/Link/Link";
import Image from "@/components/ui/Image/Image";
import linkedIcon from "@/public/icons/linkedin-icon.svg";

type TeamCardProps = {
  name: string;
  role: string;
  image: string;
  link?: string;
  onClick?: () => void;
  className?: string;
};

export default function TeamCard({
  name,
  role,
  image,
  link,
  onClick,
  className,
}: TeamCardProps) {
  return (
    <>
      <div className={
        className ? `${styles.teamCard} ${className}` : styles.teamCard
      } onClick={onClick}>
        {image?.trim() && (
          <div className={styles.profileImg}>
            <Image src={image} alt={name} width={828} height={840} />
          </div>
        )}
        <div className={styles.profileInfoIcon}>
          <div className={styles.profileInfo}>
            <h4>{name}</h4>
            <p>{role}</p>
          </div>
          {link && (
            <div className={styles.icon}>
              <Link href={link} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>
                <Image
                  src={linkedIcon}
                  alt="linkedin icon"
                  width={22}
                  height={22}
                />
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
