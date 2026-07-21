"use client";

import { LazyMotion, m } from "framer-motion";
import { ReactNode } from "react";
import { loadDomAnimation } from "@/lib/motion/loadDomAnimation";

type ScrollRevealProps = {
  children: ReactNode;
  width?: "fit-content" | "100%";
  delay?: number;
  y?: number;
  duration?: number;
  once?: boolean;
  className?: string;
};

const ScrollReveal = ({
  children,
  width = "100%",
  delay = 0,
  y = 30,
  duration = 0.6,
  once = true,
  className,
}: ScrollRevealProps) => {
  return (
    <LazyMotion features={loadDomAnimation} strict>
      <m.div
        className={className}
        initial={{ opacity: 0, y }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once, margin: "-100px" }}
        transition={{ duration, delay, ease: "easeOut" }}
        style={{ width }}
      >
        {children}
      </m.div>
    </LazyMotion>
  );
};

export default ScrollReveal;
