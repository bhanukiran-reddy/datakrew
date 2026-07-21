import styles from './AssetClass.module.css'
import Image from "next/image";

interface Asset {
  title: string;
  featuredImage?: {
    node?: {
      mediaItemUrl: string;
    };
  };
}

interface AssetClassProps {
  title: string;
  items: Asset[];
}

export default function AssetClass({ title, items }: AssetClassProps) {
  return (
    <>
      <div className={styles.assetClassWrap}>
        <div className={styles.title}>
          <h5>{title}</h5>
        </div>
        <div className={styles.assetClass}>
          {items && items.map((asset, index) => (
            <div key={index} className={styles.EachAssetClass}>
              <Image
                src={asset.featuredImage?.node?.mediaItemUrl || "/icons/scooter.svg"}
                width={56}
                height={56}
                alt={asset.title}
              />
              <p className={styles.assetTitle}>{asset.title}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}