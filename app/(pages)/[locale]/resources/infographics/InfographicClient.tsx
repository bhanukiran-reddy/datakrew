"use client";

import { useState } from "react";
import styles from './Whitepaper.module.css';
import BlogCard from "@/components/ui/BlogCard/BlogCard";
import DownloadFormPopup from "@/components/ui/DownloadFormPopup/DownloadFormPopup";

interface InfographicClientProps {
  initialInfographics: any[];
}

export default function InfographicClient({ initialInfographics }: InfographicClientProps) {
  const [visibleCount, setVisibleCount] = useState<number>(6);
  const [selectedInfographic, setSelectedInfographic] = useState<any>(null);

  const infographics = initialInfographics.map(node => ({
    title: node.title,
    image: node.featuredImage?.node?.mediaItemUrl || "/whitepaperblog.png",
    excerpt: node.infographicsAdditionalFields?.briefDescription || "",
    category: node.infographicsAdditionalFields?.accessType || "",
    slug: node.slug,
    fileUrl: node.infographicsAdditionalFields?.infographicsFile?.node?.mediaItemUrl || "",
  }));

  const handleItemClick = (item: any) => {
    const access = item.category?.toLowerCase();
    if (access === 'nongated' || access === 'non-gated' || access === 'ungated') {
      if (item.fileUrl) {
        window.open(item.fileUrl, '_blank');
      }
    } else {
      setSelectedInfographic(item);
    }
  };

  return (
    <>
      <section className={styles.WhitepaperSection}>
        <div className="container">
          <div className={styles.WhitepaperWrap}>
            {infographics.slice(0, visibleCount).map((item, index) => (
              <div key={index} onClick={() => handleItemClick(item)} style={{ cursor: "pointer" }}>
                <BlogCard 
                  {...item} 
                  date=""
                  hideCategory={true} 
                  linkText="Download now" 
                  onClick={() => handleItemClick(item)} 
                />
              </div>
            ))}
          </div>
          {visibleCount < infographics.length && (
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

      {selectedInfographic && (
        <DownloadFormPopup
        title="Share your details to download the infographic and start the conversation"
          fileUrl={selectedInfographic?.fileUrl}
          assetName={selectedInfographic?.title}
          onClose={() => setSelectedInfographic(null)}
        />
      )}
    </>
  );
}
