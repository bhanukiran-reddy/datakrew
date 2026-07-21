'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';

interface NumberTickerProps {
    value: string;
    duration?: number;
    delay?: number;
}

/**
 * A perfectly stable, jitter-free number ticker.
 * 1. Splits value into prefix, numeric, and suffix.
 * 2. Uses a hidden "ghost" element to lock the container width.
 * 3. Updates the numeric span directly via GSAP (bypassing React state).
 */
export default function NumberTicker({
    value,
    duration = 2,
    delay = 0,
}: NumberTickerProps) {
    const numericRef = useRef<HTMLSpanElement>(null);

    // 1. Parsing logic - ensure we separate signs from the numeric animation
    // Match the numeric part (including decimals)
    const numberMatch = value.match(/\d*\.?\d+/);
    const hasNumber = !!numberMatch && numberMatch[0] !== "";

    // Prefix is everything before the number (e.g., "$", "-", "+", "up to ")
    const prefix = hasNumber ? value.slice(0, numberMatch.index) : '';
    // Suffix is everything after the number (e.g., "%", "pts", "B+")
    const suffix = hasNumber ? value.slice(numberMatch.index! + numberMatch[0].length) : '';
    const targetNumber = hasNumber ? parseFloat(numberMatch[0]) : 0;

    // Decimal precision detection
    const decimalsMatch = hasNumber ? numberMatch[0].split('.') : [];
    const decimals = decimalsMatch.length > 1 ? decimalsMatch[1].length : 0;

    useEffect(() => {
        if (!hasNumber || !numericRef.current) return;

        const el = numericRef.current;
        const animationObj = { current: 0 };

        // Ensure we reset to 0 whenever the value prop changes
        el.innerText = (0).toFixed(decimals);

        const tl = gsap.to(animationObj, {
            current: targetNumber,
            duration,
            delay,
            ease: 'power2.out',
            paused: true, // Start paused, let observer play it
            onUpdate: () => {
                if (el) el.innerText = animationObj.current.toFixed(decimals);
            },
        });

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    tl.play();
                    observer.unobserve(entries[0].target);
                }
            },
            { threshold: 0.1 }
        );

        observer.observe(el);

        return () => {
            observer.disconnect();
            tl.kill();
        };
    }, [value, duration, delay, hasNumber, targetNumber, decimals]);

    return (
        <span
            className="number-ticker"
            style={{
                display: hasNumber ? 'inline-flex' : 'inline',
                alignItems: 'center',
                justifyContent: 'flex-start',
                whiteSpace: hasNumber ? 'nowrap' : 'normal',
                fontVariantNumeric: 'tabular-nums',
                wordBreak: 'break-word',
            }}
        >
            {hasNumber ? (
                <>
                    {prefix && <span style={{ whiteSpace: 'pre' }}>{prefix}</span>}
                    <span ref={numericRef}>0</span>
                    {suffix && <span style={{ whiteSpace: 'pre' }}>{suffix}</span>}
                </>
            ) : (
                <span>{value}</span>
            )}
        </span>
    );
}
