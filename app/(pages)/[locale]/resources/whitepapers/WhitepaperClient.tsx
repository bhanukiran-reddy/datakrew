"use client";

import { useState } from "react";
import styles from './Whitepaper.module.css';
import BlogCard from "@/components/ui/BlogCard/BlogCard";
import DownloadFormPopup from "@/components/ui/DownloadFormPopup/DownloadFormPopup";

interface WhitepaperClientProps {
  initialWhitepapers: any[];
}

export default function WhitepaperClient({ initialWhitepapers }: WhitepaperClientProps) {
  const [visibleCount, setVisibleCount] = useState<number>(6);
  const [selectedWhitepaper, setSelectedWhitepaper] = useState<any>(null);

  const whitepapers = initialWhitepapers.map(node => ({
    title: node.title,
    image: node.featuredImage?.node?.mediaItemUrl || "/whitepaperblog.png",
    excerpt: node.whitepaperAdditionalFields?.briefDescription || "",
    category: node.whitepaperAdditionalFields?.accessType || "",
    slug: node.slug,
    fileUrl: node.whitepaperAdditionalFields?.whitepaperFile?.node?.mediaItemUrl || "",
  }));

  const handleItemClick = (item: any) => {
    const access = item.category?.toLowerCase();
    if (access === 'nongated' || access === 'non-gated' || access === 'ungated') {
      if (item.fileUrl) {
        window.open(item.fileUrl, '_blank');
      }
    } else {
      setSelectedWhitepaper(item);
    }
  };

  return (
    <>
      <section className={styles.WhitepaperSection}>
        <div className="container">
          <div className={styles.WhitepaperWrap}>
            {whitepapers.slice(0, visibleCount).map((paper, index) => (
              <div key={index} onClick={() => handleItemClick(paper)} style={{ cursor: "pointer" }}>
                <BlogCard 
                  {...paper} 
                  date="" // Query doesn't seem to have date in nodes, but we can add it if needed
                  hideCategory={true} 
                  linkText="Download now" 
                  onClick={() => handleItemClick(paper)} 
                />
              </div>
            ))}
          </div>
          {visibleCount < whitepapers.length && (
            <div className={styles.loadMoreWrap}>
              <button
                onClick={() => setVisibleCount((prev) => prev + 6)}
                className="secondaryCta" >
                Load More
              </button>
            </div>
          )}
        </div>
      </section>

      {selectedWhitepaper && (
        <DownloadFormPopup
          title="Share your details to download the whitepaper and start the conversation"
          fileUrl={selectedWhitepaper?.fileUrl}
          assetName={selectedWhitepaper?.title}
          onClose={() => setSelectedWhitepaper(null)}
        />
      )}
    </>
  );
}
