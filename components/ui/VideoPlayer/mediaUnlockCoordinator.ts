/**
 * Cross-component user activation + session hints for aggressive (but policy-compliant)
 * audible autoplay. Browser policy always wins; this only improves odds and recovery.
 */

const SESSION_KEY = "datakrew_media_audio_unlocked_session";
const LOCAL_KEY = "datakrew_media_audio_unlocked";

export type MediaUnlockListener = () => void;

const unlockListeners = new Set<MediaUnlockListener>();

function markWindowFlag(): void {
    if (typeof window === "undefined") return;
    (window as unknown as { __mediaUnlocked?: boolean }).__mediaUnlocked = true;
}

/** First trusted activation on the page (capture phase). */
let activationHandlersInstalled = false;

export function ensureUserActivationTracking(): void {
    if (activationHandlersInstalled || typeof window === "undefined") return;
    activationHandlersInstalled = true;

    let done = false;
    const fire = () => {
        if (done) return;
        done = true;
        removeListeners();
        markWindowFlag();
        unlockListeners.forEach((fn) => {
            try {
                fn();
            } catch (e) {
                console.error("[mediaUnlock] listener error:", e);
            }
        });
    };

    const opts: AddEventListenerOptions = { capture: true, passive: true };
    const keyOpts: AddEventListenerOptions = { capture: true };

    const removeListeners = () => {
        window.removeEventListener("pointerdown", fire, opts);
        window.removeEventListener("click", fire, opts);
        window.removeEventListener("touchstart", fire, opts);
        window.removeEventListener("keydown", fire, keyOpts);
    };

    window.addEventListener("pointerdown", fire, opts);
    window.addEventListener("click", fire, opts);
    window.addEventListener("touchstart", fire, opts);
    window.addEventListener("keydown", fire, keyOpts);
}

export function subscribeMediaUnlock(fn: MediaUnlockListener): () => void {
    unlockListeners.add(fn);
    return () => {
        unlockListeners.delete(fn);
    };
}

export function hasStoredAudioCapability(): boolean {
    if (typeof window === "undefined") return false;
    try {
        return (
            sessionStorage.getItem(SESSION_KEY) === "1" || localStorage.getItem(LOCAL_KEY) === "1"
        );
    } catch {
        return false;
    }
}

export function persistAudioCapability(): void {
    if (typeof window === "undefined") return;
    try {
        sessionStorage.setItem(SESSION_KEY, "1");
        localStorage.setItem(LOCAL_KEY, "1");
    } catch {
        /* private mode / blocked storage */
    }
}

export function isVideoDebugEnabled(): boolean {
    if (typeof window === "undefined") return false;
    try {
        if (localStorage.getItem("VIDEO_PLAYER_DEBUG") === "1") return true;
        return new URLSearchParams(window.location.search).has("videoDebug");
    } catch {
        return false;
    }
}

export function videoDebugLog(...args: unknown[]): void {
    if (isVideoDebugEnabled()) {
        console.info("[VideoPlayer:debug]", ...args);
    }
}

export function formatPlayRejection(err: unknown): string {
    if (err instanceof DOMException) {
        return `${err.name}: ${err.message} (code=${err.code})`;
    }
    if (err instanceof Error) {
        return `${err.name}: ${err.message}`;
    }
    return String(err);
}
