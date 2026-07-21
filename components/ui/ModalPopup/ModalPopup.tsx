import { useEffect } from "react";
import styles from './ModalPopup.module.css'
import ProfileInfo from '@/components/ui/ProfileInfo/ProfileInfo'
import Image from '@/components/ui/Image/Image'
import closeIcon from '@/public/icons/close-icon.svg'

type ModulePopupProps = {
  name: string;
  role: string;
  description: string;
  link: string;
  image: string;
  iconClass ?: string;
  pagename: string;
  onClose: () => void; 
}
export default function ModulePopupSec({ name, role, description, link, image, onClose, pagename}: ModulePopupProps) {
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.body.classList.add("modalPopupOpen");
    window.addEventListener("keydown", handleEsc);

    return () => {
      document.body.classList.remove("modalPopupOpen");
      window.removeEventListener("keydown", handleEsc);
    };
  }, [onClose]);
  return (
    <>
      <div className={styles.modalOverlay} onClick={onClose}></div>
      <div className={styles.modalPopup} onClick={(e) => e.stopPropagation()}>      
        <button className={styles.closeIcon} onClick={onClose}>
          <Image src={closeIcon} alt="close icon" width={24} height={24} />
        </button>
        <ProfileInfo 
          name={name}
          role={role}
          description={description}
          link={link}
          image={image}
          iconClass={styles.teamIconQuote}
          pageName={pagename}
          />
      </div>
    </>
  );
}