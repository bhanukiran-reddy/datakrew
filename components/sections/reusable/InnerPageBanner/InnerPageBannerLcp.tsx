"use client";

import {
  createContext,
  useContext,
  useLayoutEffect,
  useState,
  type ReactNode,
} from "react";
import Image from "@/components/ui/Image/Image";

const WIDE_MQ = "(min-width: 767.98px)";

const Wide767Context = createContext(true);

/** One subscription per banner: matches `.mobileImageOnly` breakpoint in CSS. */
export function InnerPageBannerLcpProvider({ children }: { children: ReactNode }) {
  const [isWide, setIsWide] = useState(true);

  useLayoutEffect(() => {
    const mql = window.matchMedia(WIDE_MQ);
    const sync = () => setIsWide(mql.matches);
    sync();
    mql.addEventListener("change", sync);
    return () => mql.removeEventListener("change", sync);
  }, []);

  return (
    <Wide767Context.Provider value={isWide}>{children}</Wide767Context.Provider>
  );
}

function useWide767(): boolean {
  return useContext(Wide767Context);
}

type BgProps = {
  classNameWrap: string;
  classNameImg: string;
  url: string;
  alt: string;
  width: number;
  height: number;
};

export function InnerPageBannerHeroBackground({
  classNameWrap,
  classNameImg,
  url,
  alt,
  width,
  height,
}: BgProps) {
  const isWide = useWide767();
  return (
    <div className={classNameWrap}>
      <div className={classNameImg}>
        <Image
          src={url}
          alt={alt}
          width={width}
          height={height}
          priority={isWide}
          fetchPriority={isWide ? "high" : "auto"}
          sizes="100vw"
        />
      </div>
    </div>
  );
}

type MobileProps = {
  classNameMobile: string;
  url: string;
  alt: string;
};

export function InnerPageBannerHeroMobile({
  classNameMobile,
  url,
  alt,
}: MobileProps) {
  const isWide = useWide767();
  return (
    <div className={classNameMobile}>
      <Image
        src={url}
        alt={alt}
        width={360}
        height={333}
        sizes="100dvw"
        priority={!isWide}
        fetchPriority={!isWide ? "high" : "auto"}
      />
    </div>
  );
}
