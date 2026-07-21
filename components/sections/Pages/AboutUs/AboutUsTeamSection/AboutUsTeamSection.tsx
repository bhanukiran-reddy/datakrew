"use client";

import TeamCard from "@/components/ui/TeamCard/TeamCard";
import styles from './AboutUsTeamSection.module.css';
import ModulePopupSec from "@/components/ui/ModalPopup/ModalPopup";
import { useState } from "react";
import Link from "next/link";

type TeamMember = {
    name: string;
    role: string;
    description: string;
    image: string;
    url: string;
    className?: string;
};

type Props = {
    title?: string;
    button?: { label: string; url: string };
    members?: TeamMember[];
    className?: string;
};

export default function AboutUsTeamSection({ title, button, members = [], className }: Props) {
    const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
    const [visibleCount, setVisibleCount] = useState(6);

    const loadMore = () => {
        setVisibleCount((prev) => prev + 6);
    };

    return (
        <section className={`${styles.teamSectionContainer} ${className || ""}`}>
            <div className="container">
                <div className={styles.sectionHeader}>
                    {title && (
                        <h2 className={styles.title} dangerouslySetInnerHTML={{ __html: title }} />
                    )}
                    {button && (
                        <Link href={button.url} className="tertiaryCta">
                            {button.label} <i className="icon fa-kit fa-right-arrow"></i>
                        </Link>
                    )}
                </div>
                <div className={styles.TeamWrap}>
                    {members.slice(0, visibleCount).map((member, index) => (
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

                {visibleCount < members.length && (
                    <div className={styles.loadMoreWrap}>
                        <button onClick={loadMore} className="secondaryCta">
                            Load moSre
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
            </div>
        </section>
    );
}
