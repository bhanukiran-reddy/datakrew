"use client";

import TeamCard from "@/components/ui/TeamCard/TeamCard";
import cardStyles from "@/components/ui/TeamCard/TeamCard.module.css";
import styles from "./TeamSection.module.css";
import ModulePopupSec from "@/components/ui/ModalPopup/ModalPopup";
import Skeleton from "@/components/ui/Skeleton/Skeleton";
import { useState, useEffect } from "react";

export type TeamMember = {
  name: string;
  role: string;
  description: string;
  image: string;
  url: string;
  className?: string;
  categories?: string[];
};

export default function TeamSection({ teamMembers }: { teamMembers: TeamMember[] }) {
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [visibleCount, setVisibleCount] = useState(6);
  const [isLoading, setIsLoading] = useState(false);

  const categories = Array.from(
    new Set(teamMembers.flatMap((m: any) => m.categories || []))
  );

  const [activeCategory, setActiveCategory] = useState(categories[0]);

  const filteredMembers = teamMembers.filter((m) =>
    m.categories?.includes(activeCategory)
  );

  const handleCategoryChange = (category: string) => {
    if (category === activeCategory) return;
    setIsLoading(true);
    setActiveCategory(category);
    setVisibleCount(6);
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  };

  const loadMore = () => {
    setVisibleCount((prev) => prev + 6);
  };

  return (
    <>
      <div className={styles.categoryFilterWrap}>
        {categories.map((cat, idx) => (
          <button
            key={idx}
            className={`${styles.categoryTab} ${activeCategory === cat ? styles.active : ""
              }`}
            onClick={() => handleCategoryChange(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className={styles.TeamWrap}>
        {isLoading
          ? Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className={`${styles.teamCard} ${cardStyles.teamCard}`}>
              <div className={cardStyles.profileImg} style={{ background: '#111', minHeight: '420px', display: 'flex' }}>
                <Skeleton variant="image" height="420px" width="100%" />
              </div>
              <div className={cardStyles.profileInfoIcon} style={{ padding: '1rem 0' }}>
                <div className={cardStyles.profileInfo} style={{ width: '100%' }}>
                  <Skeleton variant="heading" width="70%" height="24px" className={styles.skeletonMargin} />
                  <Skeleton variant="text" width="50%" height="16px" />
                </div>
              </div>
            </div>
          ))
          : filteredMembers.slice(0, visibleCount).map((member, index) => (
            <TeamCard
              className={styles.teamCard}
              key={index}
              name={member.name}
              role={member.role}
              image={member.image}
              link={member.url}
              onClick={() => setSelectedMember(member)}
            />
          ))}
      </div>

      {visibleCount < filteredMembers.length && (
        <div className={styles.loadMoreWrap}>
          <button onClick={loadMore} className="secondaryCta">
            Load more
          </button>
        </div>
      )}

      {selectedMember && (
        <ModulePopupSec
          name={selectedMember.name}
          role={selectedMember.role}
          description={selectedMember.description}
          link={selectedMember.url}
          image={selectedMember.image}
          onClose={() => setSelectedMember(null)}
          pagename="Team"
        />
      )}
    </>
  );
}