"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import styles from "./DownloadFormPopup.module.css";
import Image from "next/image";
import closeIcon from "@/public/icons/close-icon.svg";
import Link from "next/link";

type DownloadFormPopupProps = {
  title?: string;
  onClose: () => void;
  fileUrl?: string;
  assetName?: string;
};

const CONTACT_API = "/api/contact";

export default function DownloadFormPopup({
  title = "Share your details to download the whitepaper and start the conversation",
  onClose,
  fileUrl,
  assetName,
}: DownloadFormPopupProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const [submitted, setSubmitted] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [errors, setErrors] = useState<Record<string, boolean>>({});
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.body.classList.add("modalPopupOpen");
    window.addEventListener("keydown", handleEsc);

    return () => {
      document.body.classList.remove("modalPopupOpen");
      window.removeEventListener("keydown", handleEsc);
    };
  }, [onClose]);

  // UTM tracking is now handled globally by the UTMTracker component in RootLayout

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = formRef.current;
    if (!form) return;

    const formData = new FormData(form);
    const newErrors: Record<string, boolean> = {};
    let hasError = false;

    const requiredFields = ["FIRSTNAME", "LASTNAME", "CONTACT_EMAIL"];

    requiredFields.forEach((field) => {
      const val = formData.get(field);
      if (!val || !val.toString().trim()) {
        newErrors[field] = true;
        hasError = true;
      }
    });

    const isTermsChecked = formData.get("terms") === "on";
    if (!isTermsChecked) {
      newErrors["TERMS"] = true;
      hasError = true;
    }

    setErrors(newErrors);

    if (hasError) return;

    setErrorMessage("");
    setSubmitting(true);

    try {
      const utmParams = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content", "gclid"];
      const zohoMappings: Record<string, string> = {
        "utm_source": "CONTACT_CF1",
        "utm_medium": "CONTACT_CF2",
        "utm_content": "CONTACT_CF3",
        "utm_term": "CONTACT_CF4",
        "utm_campaign": "CONTACT_CF5",
        "gclid": "CONTACT_CF6"
      };

      const urlParams = new URLSearchParams(window.location.search);
      utmParams.forEach((param) => {
        const zohoField = zohoMappings[param];
        if (!zohoField) return;

        const urlValue = urlParams.get(param);
        if (urlValue) {
          formData.set(zohoField, urlValue);
          return;
        }

        const sessionValue = sessionStorage.getItem(`utm_${param}`);
        if (sessionValue) {
          formData.set(zohoField, sessionValue);
          return;
        }

        const cookieStr = document.cookie;
        const match = cookieStr.match(new RegExp('(^| )' + param + '=([^;]+)'));
        if (match) {
          formData.set(zohoField, match[2]);
        }
      });

      // Pass asset title to Zoho
      if (assetName) {
        formData.set("CONTACT_CF62", assetName);
      }
      
      // Pass Privacy Policy consent to Zoho
      if (formData.get("terms") === "on") {
        formData.set("PRIVACY_POLICY", "PRIVACY_AGREED");
      }
      formData.delete("terms");

      const res = await fetch(CONTACT_API, {
        method: "POST",
        body: formData,
        headers: { Accept: "application/json" },
      });
      const data = await res.json().catch(() => ({}));
      const message =
        typeof data?.inlineMessage === "string" && data.inlineMessage
          ? data.inlineMessage
          : typeof data?.rawResponse === "string" && !data.rawResponse.trim().startsWith("<")
            ? data.rawResponse
            : null;

      if (res.ok || data.success) {
        setSuccessMessage(message ?? "Thank you for your submission!");
        setSubmitted(true);
        if (fileUrl) {
          window.open(fileUrl, "_blank");
        }
      } else {
        setErrorMessage(
          message ??
          (typeof data?.error === "string"
            ? data.error
            : "Something went wrong. Please try again.")
        );
      }
    } catch (err) {
      setErrorMessage(
        err instanceof Error ? err.message : "Something went wrong. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (!mounted) return null;

  return createPortal(
    <>
      <div className={styles.modalOverlay} onClick={onClose}></div>
      <div className={styles.modalPopup} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeIcon} onClick={onClose}>
          <Image src={closeIcon} alt="close icon" width={24} height={24} />
        </button>

        {submitted ? (
          <div className={styles.formSuccessBlock}>
            <h4 className={styles.formSuccessHeadline}>You’re <span>all set.</span></h4>
            <p className={styles.formSuccessSubheadline}>
              {successMessage || "Thank you for your interest. Your download should begin shortly."}
            </p>
          </div>
        ) : (
          <>
            <div className={styles.formHeader}>
              <h4 className={styles.formTitle}>{title}</h4>
            </div>

            <form ref={formRef} onSubmit={handleSubmit} noValidate>
              <input type="hidden" name="signupTmplName" value="large_form_1" />
              <input type="hidden" name="recapThemeOptin" value="2" />
              <input type="hidden" name="orgNameFull" value="Datakrew" />
              <input type="hidden" name="recapTheme" value="2" />
              <input type="hidden" name="isRecapIntegDone" value="false" />
              <input type="hidden" name="signupFormMode" value="" />
              <input type="hidden" name="signupFormType" value="LargeForm_Vertical" />
              <input type="hidden" name="recapModeTheme" value="" />

              {/* Zoho Marketing Automation tracking required fields */}
              <input type="hidden" name="viewFrom" value="URL_ACTION" />
              <input type="hidden" name="submitType" value="optinCustomView" />
              <input type="hidden" name="lD" value="" />
              <input type="hidden" name="emailReportId" value="" />
              <input type="hidden" name="zx" value="1dfba104ec" />
              <input type="hidden" name="zcvers" value="2.0" />
              <input type="hidden" name="oldListIds" value="" />
              <input type="hidden" name="mode" value="OptinCreateView" />
              <input type="hidden" name="zcld" value="" />
              <input type="hidden" name="zctd" value="142d4d88c9c9b219" />
              <input type="hidden" name="document_domain" value="ma.zoho.in" />
              <input type="hidden" name="zc_Url" value="krew-zgp4.maillist-manage.in" />
              <input type="hidden" name="new_optin_response_in" value="0" />
              <input type="hidden" name="duplicate_optin_response_in" value="0" />
              <input type="hidden" name="zc_formIx" value="3z22ce7654d2099a1b5f98c9c535dbbc8219786efc759df21d9f3106412951b9db" />
              <input type="hidden" name="scriptless" value="yes" />

              {/* UTM and custom fields */}
              <input type="hidden" name="CONTACT_CF62" value={assetName || " "} />
              <input type="hidden" name="CONTACT_CF1" value="Website" />
              <input type="hidden" name="CONTACT_CF2" value="Ogranic" />
              <input type="hidden" name="CONTACT_CF3" value="website-form" />
              <input type="hidden" name="CONTACT_CF4" value="none" />
              <input type="hidden" name="CONTACT_CF5" value="website" />
              <input type="hidden" name="CONTACT_CF6" value="none" />
              <input type="hidden" name="CONTACT_CF52" value=" " />
              <input type="hidden" name="CONTACT_CF53" value=" " />
              <input type="hidden" name="CONTACT_CF54" value=" " />
              <input type="hidden" name="zc_spmSubmit" value="ZCSPMSUBMIT" />

              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>
                    First name<span>*</span>
                  </label>
                  <div style={{ position: "relative" }}>
                    <input
                      name="FIRSTNAME"
                      type="text"
                      className={styles.formInput}
                      placeholder="Enter your first name"
                      required
                      onInput={(e) => {
                        const input = e.currentTarget;
                        input.value = input.value.replace(/[^a-zA-Z\s\-]/g, '');
                        setErrors(prev => ({ ...prev, FIRSTNAME: false }));
                      }}
                    />
                    {errors.FIRSTNAME && <div className={styles.errorMsg}>This field is required</div>}
                  </div>
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>
                    Last name<span>*</span>
                  </label>
                  <div style={{ position: "relative" }}>
                    <input
                      name="LASTNAME"
                      type="text"
                      className={styles.formInput}
                      placeholder="Enter your last name"
                      required
                      onInput={(e) => {
                        const input = e.currentTarget;
                        input.value = input.value.replace(/[^a-zA-Z\s\-]/g, '');
                        setErrors(prev => ({ ...prev, LASTNAME: false }));
                      }}
                    />
                    {errors.LASTNAME && <div className={styles.errorMsg}>This field is required</div>}
                  </div>
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>
                    Work email<span>*</span>
                  </label>
                  <div style={{ position: "relative" }}>
                    <input
                      name="CONTACT_EMAIL"
                      type="email"
                      className={styles.formInput}
                      placeholder="Enter your work email address"
                      required
                      onChange={() => setErrors(prev => ({ ...prev, CONTACT_EMAIL: false }))}
                    />
                    {errors.CONTACT_EMAIL && <div className={styles.errorMsg}>This field is required</div>}
                  </div>
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Phone number (optional)</label>
                  <div style={{ position: "relative" }}>
                    <input
                      name="PHONE"
                      type="tel"
                      className={styles.formInput}
                      placeholder="Enter phone number"
                      maxLength={20}
                      pattern="[+]?[0-9]*"
                      onInput={(e) => {
                        const input = e.currentTarget;
                        input.value = input.value.replace(/[^0-9+]/g, '').slice(0, 15);
                      }}
                    />
                  </div>
                </div>
              </div>

              <div className={styles.checkboxGroup}>
                <div style={{ position: "relative", display: "flex", flexDirection: "column", flex: 1 }}>
                  <div className={styles.checkboxInner}>
                    <input
                      name="terms"
                      type="checkbox"
                      id="terms"
                      className={styles.checkbox}
                      required
                      onChange={() => setErrors(prev => ({ ...prev, TERMS: false }))}
                    />
                    <label htmlFor="terms" className={styles.checkboxLabel}>
                      By submitting, you agree to Datakrew's{" "}
                      <Link href="/termsandconditions" onClick={(e) => e.stopPropagation()}>Terms & Conditions</Link>
                      {" "}and{" "}
                      <Link href="/privacy-policy" onClick={(e) => e.stopPropagation()}>Privacy Policy</Link>.
                    </label>
                  </div>
                  {errors.TERMS && (
                    <div className={styles.errorMsg} style={{ marginTop: "4px" }}>
                      You must agree to terms
                    </div>
                  )}
                </div>
              </div>

              <div className={styles.submitWrapper}>
                <button type="submit" className="primaryCta" disabled={submitting}>
                  {submitting ? "Submitting..." : "Download now"}
                </button>
              </div>

              {errorMessage && (
                <p className={styles.formError} role="alert">
                  {errorMessage}
                </p>
              )}
            </form>
          </>
        )}
      </div>
    </>,
    document.body
  );
}
