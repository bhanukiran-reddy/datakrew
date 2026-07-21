"use client";

import { useState } from "react";
import Link from "@/components/ui/Link/Link";
import DownloadFormPopup from "@/components/ui/DownloadFormPopup/DownloadFormPopup";

type CtaButton = {
  label?: string;
  text?: string;
  url: string;
  target?: string;
  pdfUrl?: string;
};

interface CvShowCtaButtonsProps {
  buttons: CtaButton[];
  wrapperClassName?: string;
  isBanner?: boolean;
  id?: string;
}

export default function CvShowCtaButtons({ buttons, wrapperClassName, isBanner, id }: CvShowCtaButtonsProps) {
  const [showModal, setShowModal] = useState(false);
  const [selectedPdfUrl, setSelectedPdfUrl] = useState<string | undefined>(undefined);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, btn: CtaButton) => {
    const isDownload = (btn.label || btn.text || "").toLowerCase().includes("download");

    if (isDownload && btn.pdfUrl) {
      e.preventDefault();
      setSelectedPdfUrl(btn.pdfUrl);
      setShowModal(true);
    }
  };

  if (!buttons || buttons.length === 0) return null;

  return (
    <>
      <div className={wrapperClassName} id={id}>
        {buttons.map((btn, idx) => {
          const label = btn.label || btn.text;
          const isDownload = label?.toLowerCase().includes("download");

          return (
            <Link
              key={idx}
              href={isDownload ? "#" : btn.url}
              target={btn.target}
              className={
                isBanner 
                  ? (idx === 0 ? "primaryCta" : "secondaryCta")
                  : (label?.toLowerCase().includes("contact") ? "secondaryCta" : "primaryCta")
              }
              onClick={(e) => handleClick(e, btn)}
            >
              {label}
              {label?.toLowerCase().includes("contact") && <i className="icon fa-kit fa-right-arrow" style={{ marginLeft: "8px" }} />}
            </Link>
          );
        })}
      </div>

      {showModal && (() => {
        let extractedAssetName = "CV Show Birmingham";
        if (selectedPdfUrl) {
          const filename = selectedPdfUrl.split('/').pop()?.split('.')[0] || "";
          if (filename) {
            extractedAssetName = filename.replace(/[-_]/g, ' ');
          }
        }

        return (
          <DownloadFormPopup
            title="Share your details to download the whitepaper and start the conversation"
            fileUrl={selectedPdfUrl}
            assetName={extractedAssetName}
            onClose={() => setShowModal(false)}
          />
        );
      })()}
    </>
  );
}
