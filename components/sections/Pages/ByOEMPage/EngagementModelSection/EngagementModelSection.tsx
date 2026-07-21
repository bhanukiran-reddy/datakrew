"use client";
import { useRef } from "react";
import styles from "./EngagementModelSection.module.css";
import gsap from "gsap";
import Image from "next/image";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CSSRulePlugin } from "gsap/CSSRulePlugin";
gsap.registerPlugin(ScrollTrigger, CSSRulePlugin);
import { useGSAP } from "@gsap/react";
import Link from "@/components/ui/Link/Link";

gsap.registerPlugin(ScrollTrigger);

interface EngagementModelStep {
    title: string;
    description: string;
}

interface EngagementModelProps {
    title?: string;
    subtitle?: string;
    steps?: EngagementModelStep[];
    cta?: {
        label: string;
        url: string;
    };
    id?: string;
}

export default function EngagementModelSection({
    title = "<span>Engagement</span> model",
    subtitle = "A low-friction path from alignment to production-ready outputs.",
    steps = [],
    cta,
    id
}: EngagementModelProps) {
    const containerRef = useRef<HTMLDivElement>(null);

    useGSAP(
        () => {
            if (!containerRef.current) return;

            const ctx = gsap.context(() => {
                const cards = gsap.utils.toArray<HTMLElement>(".em-card");
                const cta = containerRef.current?.querySelector(".em-cta");

                gsap.set(cards, { opacity: 0, y: 50 });
                if (cta) gsap.set(cta, { opacity: 0, y: 40 });

                const tl = gsap.timeline({
                    scrollTrigger: {
                        trigger: containerRef.current,
                        start: "top 75%",
                    },
                });

                cards.forEach((card, index) => {
                    // Card animation
                    tl.to(card, {
                        opacity: 1,
                        y: 0,
                        duration: 0.6,
                        ease: "power3.out",
                    });

                    // Arrow animation except last
                    if (index !== cards.length - 1) {
                        const arrowRule = CSSRulePlugin.getRule(
                            `.step-${index}::after`
                        );

                        tl.to(arrowRule, {
                            cssRule: {
                                opacity: 1,
                                scaleX: 1,
                            },
                            duration: 0.4,
                            ease: "power2.out",
                        });
                    }
                });

                if (cta) {
                    tl.to(cta, {
                        opacity: 1,
                        y: 0,
                        duration: 0.6,
                        ease: "power3.out",
                    });
                }
            }, containerRef);

            return () => ctx.revert();
        },
        { scope: containerRef }
    );



    return (
        <section className={styles.section} ref={containerRef} id={id}>
            <div className="container">
                <h2 className={`${styles.modelTitle} em-title sectionTitle`} dangerouslySetInnerHTML={{ __html: title }}>
                </h2>

                {subtitle && (
                    <p className={`${styles.modelSubtitle} em-subtitle sectionDescription`}>
                        {subtitle}
                    </p>
                )}

                <div className={styles.stepsWrapper}>
                    {steps.map((step, index) => (
                        <div
                            key={index}
                            className={`${styles.stepItem} step-${index}`}
                        >

                            <div className={`${styles.card} em-card`}>
                                <h3>{step.title}</h3>
                                <p>{step.description}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {cta && (
                    <div className={styles.ctaWrapper}>
                        <Link href={cta.url} className="primaryCta em-cta">
                            {cta.label}
                            <i className="fa-kit fa-right-arrow icon"></i>
                        </Link>
                    </div>
                )}
            </div>
        </section>
    );
}
