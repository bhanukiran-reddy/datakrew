"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import type Player from "@vimeo/player";
import styles from "./videoPlayer.module.css";
import {
    ensureUserActivationTracking,
    subscribeMediaUnlock,
    persistAudioCapability,
    videoDebugLog,
    formatPlayRejection,
} from "./mediaUnlockCoordinator";

export interface VideoPlayerProps {
    src?: string;
    poster?: string;
    posterAlt?: string;
    description?: string;
    transcript?: string;
    className?: string;
    showSkipControls?: boolean;
    autoPlay?: boolean;
}

/** Internal playback lifecycle for autoplay UX (not 1:1 with Vimeo paused state). */
export type PlaybackMachineState =
    | "idle"
    | "loading"
    | "trying_audible"
    | "playing_audible"
    | "audible_blocked"
    | "playing_muted"
    | "paused_out_of_view"
    | "error";

/** Preload iframe when this much of the player is visible (below play band). */
const VIS_LOAD = 0.25;
/** Autoplay and keep playing only while at least this fraction of the player intersects the viewport. */
const VIS_PLAY = 0.7;
const IO_DEBOUNCE_MS = 90;
const PROGRESS_UI_MS = 300;
const MAX_AUDIBLE_RETRIES = 4;
const BACKOFF_MS = [150, 400, 1000, 2200] as const;

const VIMEO_IFRAME_ALLOW =
    "autoplay; fullscreen; picture-in-picture; encrypted-media; accelerometer; gyroscope";

function resolveVimeoSource(src?: string): { id: number; hash?: string } | null {
    if (!src?.trim()) return null;
    const clean = src.trim().replace(/&amp;/g, "&");
    const idMatch =
        clean.match(/vimeo\.com\/(?:video\/)?(\d+)/) ??
        clean.match(/player\.vimeo\.com\/video\/(\d+)/);
    if (!idMatch?.[1]) return null;

    let hash: string | undefined;
    try {
        const url = new URL(clean);
        hash = url.searchParams.get("h") ?? undefined;
    } catch {
        const hashMatch = clean.match(/[?&]h=([a-zA-Z0-9]+)/);
        hash = hashMatch?.[1];
    }

    return { id: parseInt(idMatch[1], 10), hash };
}

type VimeoEmbedOptions = {
    autoplay?: boolean;
    muted?: boolean;
    startTime?: number;
};

function buildVimeoEmbedUrl(
    videoId: number,
    opts: VimeoEmbedOptions = {},
    privacyHash?: string
): string {
    const params = new URLSearchParams({
        badge: "0",
        byline: "0",
        portrait: "0",
        title: "0",
        controls: "0",
        dnt: "1",
        playsinline: "1",
        transparent: "0",
        autopause: "0",
        autoplay: opts.autoplay ? "1" : "0",
        muted: opts.muted ? "1" : "0",
    });
    if (privacyHash) {
        params.set("h", privacyHash);
    }
    if (opts.startTime && opts.startTime > 0) {
        params.set("t", `${Math.floor(opts.startTime)}s`);
    }
    return `https://player.vimeo.com/video/${videoId}?${params.toString()}`;
}

function mountVimeoIframe(
    container: HTMLElement,
    videoId: number,
    opts: VimeoEmbedOptions,
    privacyHash?: string
): HTMLIFrameElement {
    container.replaceChildren();
    const iframe = document.createElement("iframe");
    iframe.src = buildVimeoEmbedUrl(videoId, opts, privacyHash);
    iframe.setAttribute("allow", VIMEO_IFRAME_ALLOW);
    iframe.setAttribute("allowfullscreen", "true");
    iframe.setAttribute("frameborder", "0");
    iframe.setAttribute("referrerpolicy", "strict-origin-when-cross-origin");
    iframe.style.position = "absolute";
    iframe.style.top = "0";
    iframe.style.left = "0";
    iframe.style.width = "100%";
    iframe.style.height = "100%";
    iframe.style.border = "0";
    container.appendChild(iframe);
    return iframe;
}

function patchVimeoIframePermissions(container: HTMLElement | null): void {
    if (!container) return;
    const iframe = container.querySelector("iframe");
    if (!iframe) return;

    const existing = iframe.getAttribute("allow") ?? "";
    const tokens = new Set(
        existing
            .split(";")
            .map((part) => part.trim())
            .filter(Boolean)
    );
    VIMEO_IFRAME_ALLOW.split(";")
        .map((part) => part.trim())
        .filter(Boolean)
        .forEach((part) => tokens.add(part));

    iframe.setAttribute("allow", Array.from(tokens).join("; "));
    iframe.setAttribute("allowfullscreen", "true");
}

function observeVimeoIframe(container: HTMLElement): () => void {
    const patch = () => patchVimeoIframePermissions(container);
    patch();

    const observer = new MutationObserver(patch);
    observer.observe(container, { childList: true, subtree: true });
    return () => observer.disconnect();
}

function isVimeoInternalPlayError(err: unknown): boolean {
    const msg = formatPlayRejection(err);
    return msg.includes("reading 'includes'") || msg.includes('Cannot read properties of undefined');
}

export default function VideoPlayer({
    src,
    poster,
    posterAlt,
    description,
    transcript,
    className,
    showSkipControls = false,
    autoPlay = false,
}: VideoPlayerProps) {
    const vimeoContainerRef = useRef<HTMLDivElement>(null);
    const playerRef = useRef<Player | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [showControls, setShowControls] = useState(true);
    const [playbackRate, setPlaybackRate] = useState(1);
    const [showSpeedMenu, setShowSpeedMenu] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [showPoster, setShowPoster] = useState(!!poster);
    const [playbackBlocked, setPlaybackBlocked] = useState(false);
    const [playbackPhase, setPlaybackPhase] = useState<PlaybackMachineState>("idle");

    const visibleLoadRef = useRef(false);
    const visiblePlayRef = useRef(false);
    const audibleRetryIndexRef = useRef(0);

    useEffect(() => {
        ensureUserActivationTracking();
    }, []);

    useEffect(() => {
        setShowPoster(!!poster);
        setPlaybackBlocked(false);
        setPlaybackPhase("idle");
        setIsMuted(false);
        audibleRetryIndexRef.current = 0;
    }, [src, poster, autoPlay]);

    const rates = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];

    const handleRateChange = (rate: number) => {
        setPlaybackRate(rate);
        if (playerRef.current) {
            playerRef.current.setPlaybackRate(rate);
        }
        setShowSpeedMenu(false);
    };

    /** Prefer synchronous play() tail when possible; keeps gesture where the browser allows it. */
    const playFromUserGesture = useCallback(() => {
        const p = playerRef.current;
        if (!p) return;
        setPlaybackBlocked(false);
        patchVimeoIframePermissions(vimeoContainerRef.current);
        p.setMuted(false)
            .then(() => p.setVolume(1))
            .then(() => p.play())
            .then(() => {
                videoDebugLog("playFromUserGesture chain resolved");
            })
            .catch((err) => {
                console.error("[VideoPlayer] playFromUserGesture failed:", formatPlayRejection(err));
                setPlaybackBlocked(true);
                setPlaybackPhase("error");
            });
    }, []);

    const togglePlay = () => {
        if (playerRef.current) {
            if (isPlaying) {
                playerRef.current.pause();
            } else {
                playFromUserGesture();
            }
        }
    };

    const toggleMute = () => {
        if (!playerRef.current) return;
        if (isMuted) {
            playerRef.current.setMuted(false).catch((e) => console.error("[VideoPlayer] setMuted(false):", e));
            playerRef.current.setVolume(1).catch((e) => console.error("[VideoPlayer] setVolume(1):", e));
        } else {
            playerRef.current.setMuted(true).catch((e) => console.error("[VideoPlayer] setMuted(true):", e));
        }
        setIsMuted(!isMuted);
    };

    const handleProgressClick = async (e: React.MouseEvent<HTMLDivElement>) => {
        if (playerRef.current && duration > 0) {
            const rect = e.currentTarget.getBoundingClientRect();
            const clickX = e.clientX - rect.left;
            const percentage = clickX / rect.width;
            const newTime = percentage * duration;

            await playerRef.current.setCurrentTime(newTime);
            setProgress(percentage * 100);
            setCurrentTime(newTime);
        }
    };

    const skipTime = async (amount: number) => {
        if (playerRef.current && duration > 0) {
            const current = await playerRef.current.getCurrentTime();
            let newTime = current + amount;
            if (newTime < 0) newTime = 0;
            if (newTime > duration) newTime = duration;
            await playerRef.current.setCurrentTime(newTime);
        }
    };

    const formatTime = (timeInSeconds: number) => {
        if (isNaN(timeInSeconds)) return "0:00";
        const minutes = Math.floor(timeInSeconds / 60);
        const seconds = Math.floor(timeInSeconds % 60);
        return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
    };

    const toggleFullscreen = () => {
        const doc = document as Document & {
            webkitFullscreenElement?: Element;
            webkitExitFullscreen?: () => Promise<void>;
        };
        const el = containerRef.current as HTMLElement & {
            webkitRequestFullscreen?: () => Promise<void>;
        };
        if (!el) return;

        const isIOS =
            /iPad|iPhone|iPod/.test(navigator.userAgent) ||
            (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);

        if (isIOS) {
            if (playerRef.current) {
                playerRef.current.requestFullscreen().catch((e) => {
                    console.error("[VideoPlayer] iOS fullscreen:", e);
                });
            }
            return;
        }

        if (doc.fullscreenElement || doc.webkitFullscreenElement) {
            if (doc.exitFullscreen) void doc.exitFullscreen();
            else if (doc.webkitExitFullscreen) void doc.webkitExitFullscreen();
        } else {
            if (el.requestFullscreen) void el.requestFullscreen();
            else if (el.webkitRequestFullscreen) void el.webkitRequestFullscreen();
        }
    };

    const resetControlsTimeout = () => {
        setShowControls(true);
        if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);

        if (isPlaying) {
            controlsTimeoutRef.current = setTimeout(() => {
                setShowControls(false);
            }, 3000);
        }
    };

    useEffect(() => {
        resetControlsTimeout();
        return () => {
            if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
        };
    }, [isPlaying]);

    useEffect(() => {
        const handleFullscreenChange = () => {
            const doc = document as Document & { webkitFullscreenElement?: Element };
            setIsFullscreen(!!(doc.fullscreenElement || doc.webkitFullscreenElement));
        };

        const unlockAudio = () => {
            if (playerRef.current && !isMuted) {
                playerRef.current.setVolume(1).catch((e) => console.error("[VideoPlayer] unlockAudio setVolume:", e));
            }
        };

        document.addEventListener("fullscreenchange", handleFullscreenChange);
        document.addEventListener("webkitfullscreenchange", handleFullscreenChange);
        window.addEventListener("click", unlockAudio, { once: true });
        window.addEventListener("keydown", unlockAudio, { once: true });
        window.addEventListener("touchstart", unlockAudio, { once: true });

        return () => {
            document.removeEventListener("fullscreenchange", handleFullscreenChange);
            document.removeEventListener("webkitfullscreenchange", handleFullscreenChange);
            window.removeEventListener("click", unlockAudio);
            window.removeEventListener("keydown", unlockAudio);
            window.removeEventListener("touchstart", unlockAudio);
        };
    }, [isMuted]);

    useEffect(() => {
        if (!vimeoContainerRef.current) return;

        const vimeoSource = resolveVimeoSource(src);
        if (!vimeoSource) {
            if (src?.trim()) {
                console.warn("[VideoPlayer] Invalid or unsupported Vimeo URL:", src);
            }
            return;
        }

        const videoId = vimeoSource.id;
        const privacyHash = vimeoSource.hash;
        const stopObservingIframe = observeVimeoIframe(vimeoContainerRef.current);

        let playerInitialized = false;
        let embedRemountCount = 0;
        let observer: IntersectionObserver | null = null;
        let ioDebounceTimer: ReturnType<typeof setTimeout> | null = null;
        let audibleBackoffTimer: ReturnType<typeof setTimeout> | null = null;

        let lastProgressUiMs = 0;
        let pendingSeconds = 0;
        let pendingPercent = 0;

        const flushProgressToUi = () => {
            setCurrentTime(pendingSeconds);
            setProgress(pendingPercent);
            lastProgressUiMs = performance.now();
        };

        const clearAudibleBackoff = () => {
            if (audibleBackoffTimer) {
                clearTimeout(audibleBackoffTimer);
                audibleBackoffTimer = null;
            }
        };

        const scheduleAudibleRetry = (reason: string, delayMs: number) => {
            clearAudibleBackoff();
            audibleBackoffTimer = setTimeout(() => {
                audibleBackoffTimer = null;
                const p = playerRef.current;
                if (p) void tryAudibleAutoplay(p, `retry:${reason}`, true);
            }, delayMs);
        };

        async function remountAudibleEmbed(startTime = 0, reason: string): Promise<Player | null> {
            if (!vimeoContainerRef.current || embedRemountCount >= 2) return null;
            embedRemountCount += 1;
            videoDebugLog("remount audible embed", reason, { startTime, embedRemountCount });

            const previous = playerRef.current;
            playerRef.current = null;
            if (previous) {
                await previous.destroy().catch((err) => {
                    console.error("[VideoPlayer] destroy before remount failed:", err);
                });
            }

            const iframe = mountVimeoIframe(vimeoContainerRef.current, videoId, {
                autoplay: true,
                muted: false,
                startTime,
            }, privacyHash);
            patchVimeoIframePermissions(vimeoContainerRef.current);

            try {
                const PlayerModule = await import("@vimeo/player");
                const Player = PlayerModule.default;
                const player = new Player(iframe);
                attachPlayerListeners(player);
                await player.ready();
                playerRef.current = player;
                return player;
            } catch (err) {
                console.error("[VideoPlayer] Audible embed remount failed:", formatPlayRejection(err));
                return null;
            }
        }

        async function tryAudibleAutoplay(
            player: Player,
            context: string,
            isRetry = false
        ): Promise<void> {
            if (!autoPlay) return;

            if (!isRetry) {
                audibleRetryIndexRef.current = 0;
            } else if (audibleRetryIndexRef.current >= MAX_AUDIBLE_RETRIES) {
                videoDebugLog("audible retries exhausted", context);
                return;
            }

            if (!visiblePlayRef.current) {
                videoDebugLog("skip audible — not in play band", context);
                return;
            }

            setPlaybackPhase("trying_audible");
            patchVimeoIframePermissions(vimeoContainerRef.current);

            try {
                await player.setMuted(false);
                await player.setVolume(1);
                await player.play();
                clearAudibleBackoff();
                audibleRetryIndexRef.current = 0;
                videoDebugLog("audible play() resolved", context);
            } catch (err) {
                const msg = formatPlayRejection(err);
                videoDebugLog(`audible autoplay failed (${context})`, msg);
                audibleRetryIndexRef.current += 1;

                if (isVimeoInternalPlayError(err)) {
                    const currentTime = await player.getCurrentTime().catch(() => 0);
                    const remounted = await remountAudibleEmbed(currentTime, context);
                    if (remounted) return;
                }

                if (audibleRetryIndexRef.current < MAX_AUDIBLE_RETRIES && visiblePlayRef.current) {
                    const backoff = BACKOFF_MS[Math.min(audibleRetryIndexRef.current - 1, BACKOFF_MS.length - 1)];
                    scheduleAudibleRetry(context, backoff);
                    return;
                }

                setPlaybackBlocked(true);
                setPlaybackPhase("audible_blocked");
            }
        }

        function attachPlayerListeners(player: Player): void {
            player.on("play", async () => {
                setIsPlaying(true);
                const dur = await player.getDuration();
                if (dur) setDuration(dur);
            });

            player.on("playing", async () => {
                setShowPoster(false);
                setPlaybackBlocked(false);
                try {
                    const muted = await player.getMuted();
                    if (muted) {
                        setPlaybackPhase("playing_muted");
                    } else {
                        setPlaybackPhase("playing_audible");
                        persistAudioCapability();
                    }
                    setIsMuted(muted);
                } catch (e) {
                    console.error("[VideoPlayer] playing handler:", e);
                    setPlaybackPhase("playing_audible");
                }
            });

            player.on("pause", () => {
                setIsPlaying(false);
                flushProgressToUi();
            });

            player.on("seeked", () => {
                flushProgressToUi();
            });

            player.on("timeupdate", (data) => {
                pendingSeconds = data.seconds;
                pendingPercent = data.percent * 100;
                const now = performance.now();
                if (now - lastProgressUiMs >= PROGRESS_UI_MS) {
                    flushProgressToUi();
                }
            });

            player.on("volumechange", (data) => {
                setIsMuted(data.volume === 0 || !!data.muted);
            });

            player.on("loaded", async () => {
                const dur = await player.getDuration();
                if (dur) setDuration(dur);
                requestAnimationFrame(() => patchVimeoIframePermissions(vimeoContainerRef.current));
            });

            player.on("error", (e: { method?: string; message?: string }) => {
                if (e?.method === "play" && isVimeoInternalPlayError(e.message ?? "")) {
                    videoDebugLog("recoverable Vimeo play error — remounting embed", e);
                    void (async () => {
                        const currentTime = await player.getCurrentTime().catch(() => 0);
                        await remountAudibleEmbed(currentTime, "vimeo-error-event");
                    })();
                    return;
                }
                console.error("[VideoPlayer] Vimeo error event:", e);
                setPlaybackPhase("error");
            });
        }

        const initializePlayer = async () => {
            if (playerInitialized) return;
            playerInitialized = true;
            setPlaybackPhase("loading");

            try {
                const audibleEmbed = autoPlay && visiblePlayRef.current;
                const iframe = mountVimeoIframe(vimeoContainerRef.current!, videoId, {
                    autoplay: audibleEmbed,
                    muted: false,
                }, privacyHash);
                patchVimeoIframePermissions(vimeoContainerRef.current);

                const PlayerModule = await import("@vimeo/player");
                const Player = PlayerModule.default;
                const player = new Player(iframe);
                playerRef.current = player;
                attachPlayerListeners(player);

                await player.ready();
                patchVimeoIframePermissions(vimeoContainerRef.current);

                if (audibleEmbed) {
                    try {
                        const paused = await player.getPaused();
                        if (paused) {
                            await tryAudibleAutoplay(player, "post-ready", false);
                        } else {
                            setPlaybackPhase("playing_audible");
                            setShowPoster(false);
                        }
                    } catch (err) {
                        console.error("[VideoPlayer] post-ready autoplay check:", formatPlayRejection(err));
                    }
                } else {
                    setPlaybackPhase("idle");
                }
            } catch (err) {
                console.error("[VideoPlayer] Failed to create Vimeo player:", err);
                playerInitialized = false;
                setPlaybackBlocked(true);
                setPlaybackPhase("error");
            }
        };

        const maybePauseOutOfView = () => {
            if (!visiblePlayRef.current && playerRef.current) {
                void playerRef.current.pause().catch((e) => console.error("[VideoPlayer] pause:", e));
                setPlaybackPhase("paused_out_of_view");
            }
        };

        const processIntersection = (ratio: number) => {
            const inLoad = ratio >= VIS_LOAD;
            const inPlay = ratio >= VIS_PLAY;

            visibleLoadRef.current = inLoad;
            visiblePlayRef.current = inPlay;

            videoDebugLog("IO ratio", ratio.toFixed(3), { inLoad, inPlay, belowPlayBand: ratio < VIS_PLAY });

            if ((autoPlay ? inPlay : inLoad) && !playerInitialized) {
                void initializePlayer();
            }

            // Symmetric to play band: pause when less than 70% visible (scroll up, down, or away).
            if (!inPlay) {
                clearAudibleBackoff();
                audibleRetryIndexRef.current = 0;
                if (autoPlay) {
                    maybePauseOutOfView();
                }
                return;
            }

            if (playerRef.current && autoPlay) {
                void (async () => {
                    const p = playerRef.current;
                    if (!p) return;
                    try {
                        const paused = await p.getPaused();
                        if (paused) {
                            audibleRetryIndexRef.current = 0;
                            patchVimeoIframePermissions(vimeoContainerRef.current);
                            await tryAudibleAutoplay(p, "visibility-reenter", false);
                        }
                    } catch (e) {
                        console.error("[VideoPlayer] visibility play check:", e);
                    }
                })();
            }
        };

        observer = new IntersectionObserver(
            (entries) => {
                const [entry] = entries;
                const ratio = entry?.intersectionRatio ?? 0;
                if (ioDebounceTimer) clearTimeout(ioDebounceTimer);
                ioDebounceTimer = setTimeout(() => {
                    processIntersection(ratio);
                    ioDebounceTimer = null;
                }, IO_DEBOUNCE_MS);
            },
            {
                root: null,
                rootMargin: "0px",
                threshold: [0, 0.05, 0.15, 0.25, 0.35, 0.5, 0.65, 0.7, 0.85, 1],
            }
        );

        observer.observe(vimeoContainerRef.current);

        const unsubUnlock = subscribeMediaUnlock(() => {
            if (!autoPlay) return;
            const p = playerRef.current;
            if (!p || !visiblePlayRef.current) return;
            videoDebugLog("global media unlock — retry audible if muted");
            void (async () => {
                try {
                    const muted = await p.getMuted();
                    const paused = await p.getPaused();
                    if (!muted && !paused) return;
                    audibleRetryIndexRef.current = 0;
                    await tryAudibleAutoplay(p, "user-activation-unlock", false);
                } catch (e) {
                    console.error("[VideoPlayer] unlock retry:", e);
                }
            })();
        });

        return () => {
            unsubUnlock();
            stopObservingIframe();
            clearAudibleBackoff();
            if (observer) observer.disconnect();
            if (ioDebounceTimer) clearTimeout(ioDebounceTimer);
            const p = playerRef.current;
            playerRef.current = null;
            if (p) {
                void p.destroy().catch((err) => {
                    console.error("[VideoPlayer] destroy failed:", err);
                });
            }
            visibleLoadRef.current = false;
            visiblePlayRef.current = false;
        };
    }, [src, autoPlay]);

    const showTapForSound = autoPlay && playbackPhase === "playing_muted";
    const showTapToPlay = autoPlay && playbackBlocked && playbackPhase === "error";

    const handleMouseMove = () => {
        resetControlsTimeout();
    };

    return (
        <div className={`${styles.videoPlayer} ${className || ""}`}>
            <div className="container">
                <div
                    className={styles.videoPlayerContainer}
                    ref={containerRef}
                    onMouseEnter={() => setShowControls(true)}
                    onMouseLeave={() => isPlaying && setShowControls(false)}
                    onMouseMove={handleMouseMove}
                >
                    <div className={styles.aspectRatioWrapper}>
                        {showPoster && poster && (
                            <div
                                className={styles.posterOverlay}
                                onClick={togglePlay}
                                style={{
                                    position: "absolute",
                                    inset: 0,
                                    zIndex: 1,
                                    cursor: "pointer",
                                }}
                            >
                                <img
                                    src={poster}
                                    alt={posterAlt?.trim() || description?.trim() || 'Video Thumbnail'}
                                    style={{
                                        width: "100%",
                                        height: "100%",
                                        objectFit: "cover",
                                    }}
                                />
                                {showTapForSound && (
                                    <div
                                        style={{
                                            position: "absolute",
                                            bottom: "12%",
                                            left: "50%",
                                            transform: "translateX(-50%)",
                                            padding: "8px 16px",
                                            borderRadius: "8px",
                                            background: "rgba(0,0,0,0.75)",
                                            color: "#fff",
                                            fontSize: "14px",
                                            fontWeight: 500,
                                            pointerEvents: "none",
                                        }}
                                    >
                                        Tap for sound
                                    </div>
                                )}
                                {showTapToPlay && (
                                    <div
                                        style={{
                                            position: "absolute",
                                            bottom: "12%",
                                            left: "50%",
                                            transform: "translateX(-50%)",
                                            padding: "8px 16px",
                                            borderRadius: "8px",
                                            background: "rgba(0,0,0,0.75)",
                                            color: "#fff",
                                            fontSize: "14px",
                                            fontWeight: 500,
                                            pointerEvents: "none",
                                        }}
                                    >
                                        Tap to play
                                    </div>
                                )}
                            </div>
                        )}
                        <div
                            ref={vimeoContainerRef}
                            className={styles.video}
                            style={{
                                pointerEvents: "none",
                                position: "absolute",
                                top: 0,
                                left: 0,
                                width: "100%",
                                height: "100%",
                            }}
                        />
                        {!showPoster && (
                            <div
                                style={{ position: "absolute", inset: 0, zIndex: 1, cursor: "pointer" }}
                                onClick={togglePlay}
                            />
                        )}

                        <div className={`${styles.overlay} ${!showControls ? styles.hidden : ""}`} onClick={togglePlay}>
                            <div className={styles.centerControls}>
                                {showSkipControls && (
                                    <button
                                        type="button"
                                        className={styles.circleBtn}
                                        aria-label="Rewind 10 seconds"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            skipTime(-10);
                                        }}
                                    >
                                        <i className="fa-kit fa-backward" aria-hidden="true" />
                                        <span className={styles.circleText}>10s</span>
                                    </button>
                                )}

                                <button
                                    type="button"
                                    className={`${styles.playBtn} ${isPlaying ? styles.isPlaying : ""}`}
                                    aria-label={isPlaying ? "Pause video" : "Play video"}
                                    onClick={togglePlay}
                                >
                                    {isPlaying ? (
                                        <i className="fa-kit fa-pause" aria-hidden="true" />
                                    ) : (
                                        <svg width="25" height="25" viewBox="0 0 15 17" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                            <path
                                                d="M2.99228 0.266469C1.65896 -0.495425 0 0.467312 0 2.00296V14.5566C0 16.0922 1.65896 17.055 2.99228 16.2931L13.9767 10.0163C15.3203 9.24847 15.3203 7.31108 13.9767 6.54329L2.99228 0.266469Z"
                                                fill="currentColor"
                                            />
                                        </svg>
                                    )}
                                </button>

                                {showSkipControls && (
                                    <button
                                        type="button"
                                        className={styles.circleBtn}
                                        aria-label="Forward 10 seconds"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            skipTime(10);
                                        }}
                                    >
                                        <i className="fa-kit fa-forward" aria-hidden="true" />
                                        <span className={styles.circleText}>10s</span>
                                    </button>
                                )}
                            </div>

                            <div className={styles.bottomControls} onClick={(e) => e.stopPropagation()}>
                                <div className={styles.progressBarContainer} onClick={handleProgressClick}>
                                    <div className={styles.progressBarFilled} style={{ width: `${progress}%` }} />
                                </div>

                                <div className={styles.controlsRows}>
                                    <div className={styles.leftControls}>
                                        <button
                                            type="button"
                                            className={styles.iconBtn}
                                            aria-label={isPlaying ? "Pause video" : "Play video"}
                                            onClick={(e) => {
                                            e.stopPropagation();
                                            togglePlay();
                                        }}>
                                            {isPlaying ? (
                                                <svg width="12" height="14" viewBox="0 0 12 14" fill="none" aria-hidden="true">
                                                    <rect x="1" y="1" width="3.5" height="12" rx="1" fill="currentColor" />
                                                    <rect x="7.5" y="1" width="3.5" height="12" rx="1" fill="currentColor" />
                                                </svg>
                                            ) : (
                                                <svg width="11" height="13" viewBox="0 0 15 17" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                                    <path
                                                        d="M2.99228 0.266469C1.65896 -0.495425 0 0.467312 0 2.00296V14.5566C0 16.0922 1.65896 17.055 2.99228 16.2931L13.9767 10.0163C15.3203 9.24847 15.3203 7.31108 13.9767 6.54329L2.99228 0.266469Z"
                                                        fill="currentColor"
                                                    />
                                                </svg>
                                            )}
                                        </button>
                                        <div className={styles.time}>
                                            {formatTime(currentTime)}/{formatTime(duration)}
                                        </div>
                                        <button
                                            type="button"
                                            className={styles.iconBtn}
                                            aria-label={isMuted ? "Unmute video" : "Mute video"}
                                            aria-pressed={isMuted}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                toggleMute();
                                            }}
                                            style={{ marginLeft: "10px" }}
                                        >
                                            {isMuted ? (
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                                                    <path d="M11 5L6 9H2v6h4l5 4V5z" fill="currentColor" />
                                                    <path d="M23 9l-6 6M17 9l6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                                </svg>
                                            ) : (
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                                                    <path d="M11 5L6 9H2v6h4l5 4V5z" fill="currentColor" />
                                                    <path d="M15.5 8.5a5 5 0 010 7M19 5a9 9 0 010 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" />
                                                </svg>
                                            )}
                                        </button>
                                    </div>

                                    <div className={styles.rightControls}>
                                        <div className={styles.rateContainer}>
                                            <button
                                                type="button"
                                                className={styles.rateBtn}
                                                aria-label={`Playback speed, ${playbackRate}x`}
                                                aria-expanded={showSpeedMenu}
                                                aria-haspopup="listbox"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setShowSpeedMenu(!showSpeedMenu);
                                                }}
                                            >
                                                {playbackRate}x{" "}
                                                <svg width="10" height="6" viewBox="0 0 10 6" fill="none" aria-hidden="true" style={{ marginLeft: "2px" }}>
                                                    <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>

                                                {showSpeedMenu && (
                                                    <div className={styles.speedMenu}>
                                                        {rates.map((rate) => (
                                                            <div
                                                                key={rate}
                                                                className={`${styles.speedOption} ${playbackRate === rate ? styles.speedOptionActive : ""}`}
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    handleRateChange(rate);
                                                                }}
                                                            >
                                                                {rate}x
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </button>
                                        </div>
                                        <button
                                            type="button"
                                            className={styles.iconBtn}
                                            aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                toggleFullscreen();
                                            }}
                                        >
                                            <i className={`fa-kit ${isFullscreen ? "fa-minimize" : "fa-expand"}`} aria-hidden="true" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
