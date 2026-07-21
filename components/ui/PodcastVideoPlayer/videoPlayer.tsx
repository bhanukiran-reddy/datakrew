"use client";

import React, { useState } from "react";
import SharedVideoPlayer from "../VideoPlayer/VideoPlayer";
import styles from "./videoPlayer.module.css";

interface VideoPlayerProps {
    src?: string;
    poster?: string;
    description?: string;
    transcript?: string;
}

export default function VideoPlayer({
    src,
    poster,
    description,
    transcript
}: VideoPlayerProps) {
    const [activeTab, setActiveTab] = useState<'description' | 'transcript'>('description');
    const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
    const [isTranscriptExpanded, setIsTranscriptExpanded] = useState(false);

    return (
        <div className={styles.podcastVideoWrapper}>
            <SharedVideoPlayer
                src={src}
                poster={poster}
                showSkipControls={true}
            />
            {(description || transcript) && (
                <div className="container">
                    <div className={styles.contentSection}>
                        <div className={styles.tabsHeader}>
                            {description && (
                                <button
                                    className={`${styles.tabBtn} ${activeTab === 'description' ? styles.activeTab : ''}`}
                                    onClick={() => setActiveTab('description')}
                                >
                                    Description
                                </button>
                            )}
                        </div>
                        <div className={styles.tabContent}>
                            {activeTab === 'description' && description ? (
                                <div className={styles.descriptionWrapper}>
                                    <div
                                        className={`${styles.descriptionText} ${isDescriptionExpanded ? styles.expanded : ''}`}
                                        dangerouslySetInnerHTML={{ __html: description }}
                                    />
                                    {description.replace(/<[^>]*>/g, '').trim().length > 500 && (
                                        <button
                                            className="tertiaryCta"
                                            onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                                        >
                                            {isDescriptionExpanded ? "View less" : "View more"}
                                        </button>
                                    )}
                                </div>
                            ) : activeTab === 'transcript' && transcript ? (
                                <div className={styles.transcriptWrapper}>
                                    <div
                                        className={`${styles.transcriptText} ${isTranscriptExpanded ? styles.expanded : ''}`}
                                        dangerouslySetInnerHTML={{ __html: transcript }}
                                    />
                                    {transcript.replace(/<[^>]*>/g, '').trim().length > 500 && (
                                        <button
                                            className={`${styles.viewMoreBtn} tertiaryCta`}
                                            onClick={() => setIsTranscriptExpanded(!isTranscriptExpanded)}
                                        >
                                            {isTranscriptExpanded ? "View less" : "View more"}
                                        </button>
                                    )}
                                </div>
                            ) : null}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
