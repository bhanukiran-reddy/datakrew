"use client";

import { useRef, useState, useEffect } from "react";
import styles from "./becomePartnerForm.module.css";
import { COUNTRIES } from '@/lib/utils/countries';
import Link from 'next/link';
import Script from 'next/script';

const CONTACT_API = "/api/contact";

const INDUSTRY_OPTIONS = [
  "EV OEM",
  "EV Insurer",
  "EV Fleet Operator",
  "EV Software/ Solution Provider",
  "Battery OEM",
  "Charge Point Operator",
  "Others",
] as const;

const COMPANY_SIZE_OPTIONS = [
  "< 10",
  "10-50",
  "50-200",
  "200-500",
  "500-1000",
  "1000+",
] as const;

export default function BecomePartnerFormSection() {
  const formRef = useRef<HTMLFormElement>(null);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [errors, setErrors] = useState<Record<string, boolean>>({});

  const [isIndustryDropdownOpen, setIsIndustryDropdownOpen] = useState(false);
  const [selectedIndustry, setSelectedIndustry] = useState("");
  const industryDropdownRef = useRef<HTMLDivElement>(null);

  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);
  const [countrySearchTerm, setCountrySearchTerm] = useState("");
  const countryDropdownRef = useRef<HTMLDivElement>(null);

  const [isSizeDropdownOpen, setIsSizeDropdownOpen] = useState(false);
  const [selectedSize, setSelectedSize] = useState("");
  const sizeDropdownRef = useRef<HTMLDivElement>(null);

  const [agreeToTerms, setAgreeToTerms] = useState(false);

  // UTM tracking is now handled globally by the UTMTracker component in RootLayout

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (industryDropdownRef.current && !industryDropdownRef.current.contains(event.target as Node)) {
        setIsIndustryDropdownOpen(false);
      }
      if (countryDropdownRef.current && !countryDropdownRef.current.contains(event.target as Node)) {
        setIsCountryDropdownOpen(false);
      }
      if (sizeDropdownRef.current && !sizeDropdownRef.current.contains(event.target as Node)) {
        setIsSizeDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = formRef.current;
    if (!form) return;

    const formData = new FormData(form);
    const newErrors: Record<string, boolean> = {};
    let hasError = false;

    const requiredFields = [
      "COMPANYNAME",
      "WEBSITE",
      "CONTACT_EMAIL",
      "COUNTRY",
      "COMPANY_SIZE",
      "INDUSTRY"
    ];

    const websitePattern = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,20})([\/\w \.-]*)*\/?$/i;

    requiredFields.forEach((field) => {
      const val = formData.get(field);
      if (!val || !val.toString().trim()) {
        newErrors[field] = true;
        hasError = true;
      } else if (field === "WEBSITE" && !websitePattern.test(val.toString().trim())) {
        newErrors["WEBSITE_FORMAT"] = true;
        hasError = true;
      }
    });

    if (!agreeToTerms) {
      newErrors["TERMS"] = true;
      hasError = true;
    }

    setErrors(newErrors);

    if (hasError) {
      return;
    }

    setErrorMessage("");
    setSubmitting(true);
    try {
      // Map to Zoho fields
      const country = formData.get("COUNTRY");
      if (country) formData.set("CONTACT_CF14", country.toString());
      formData.delete("COUNTRY");

      const size = formData.get("COMPANY_SIZE");
      if (size) formData.set("CONTACT_CF51", size.toString());
      formData.delete("COMPANY_SIZE");

      const industry = formData.get("INDUSTRY");
      if (industry) formData.set("CONTACT_CF12", industry.toString());
      formData.delete("INDUSTRY");

      const message = formData.get("MESSAGE");
      if (message) formData.set("CONTACT_CF13", message.toString());
      formData.delete("MESSAGE");

      // Normalize location to lowercase for Zoho compatibility
      const loc = formData.get("CONTACT_CF14");
      if (loc) formData.set("CONTACT_CF14", loc.toString().toLowerCase());

      // Fetch UTM marketing cookies and translate to Zoho field mapping
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

        // 1. URL query string (highest priority)
        const urlValue = urlParams.get(param);
        if (urlValue) {
          formData.set(zohoField, urlValue);
          return;
        }

        // 2. sessionStorage (persisted from page load)
        const sessionValue = sessionStorage.getItem(`utm_${param}`);
        if (sessionValue) {
          formData.set(zohoField, sessionValue);
          return;
        }

        // 3. Cookies
        const cookieStr = document.cookie;
        const match = cookieStr.match(new RegExp('(^| )' + param + '=([^;]+)'));
        if (match) {
          formData.set(zohoField, match[2]);
        }
      });
      
      if (formData.get("TERMS_AGREED") === "on") {
        formData.set("PRIVACY_POLICY", "PRIVACY_AGREED");
      }
      formData.delete("TERMS_AGREED");

      formData.delete("zc_spmSubmit");

      const res = await fetch(CONTACT_API, {
        method: "POST",
        body: formData,
        headers: { Accept: "application/json" },
      });
      const data = await res.json().catch(() => ({}));
      const inlineMsg =
        typeof data?.inlineMessage === "string" && data.inlineMessage
          ? data.inlineMessage
          : typeof data?.rawResponse === "string" && !data.rawResponse.trim().startsWith("<")
            ? data.rawResponse
            : null;

      if (res.ok || data.success) {
        setSubmitted(true);
      } else {
        setErrorMessage(
          inlineMsg ??
          (typeof data?.error === "string"
            ? data.error
            : "Something went wrong. Please try again.")
        );
      }
    } catch (err) {
      setErrorMessage(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <section className={styles.becomePartnerSection}>
        <div className="container">
          <div className={styles.formBlock}>
            <div className={styles.formSuccessBlock} role="status">
              <h4 className={styles.formSuccessHeadline}>You’re <span>all set.</span></h4>
              <p className={styles.formSuccessSubheadline}>
                Our team will follow up shortly with the right next step for your partnership.
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.becomePartnerSection} id="become-a-partner">
      <div className="container">
        <div className={styles.formBlock}>
          <h2 className={styles.formHeading}>Become a <span>Reseller Partner</span></h2>

          <form
            ref={formRef}
            method="POST"
            id="zcampaignOptinForm"
            action="https://krew-zgp4.maillist-manage.in/weboptin.zc"
            onSubmit={handleSubmit}
            noValidate
          >
            {/* Hidden Zoho Fields */}
            <input type="hidden" name="signupTmplName" id="signupTmplName" value="large_form_1" />
            <input type="hidden" name="recapThemeOptin" value="2" id="recapThemeOptin" />
            <input type="hidden" name="orgNameFull" id="orgNameFull" value="Datakrew" />
            <input type="hidden" name="recapTheme" id="recapTheme" value="2" />
            <input type="hidden" name="isRecapIntegDone" id="isRecapIntegDone" value="false" />
            <input type="hidden" name="signupFormMode" id="signupFormMode" value="" />
            <input type="hidden" name="signupFormType" id="signupFormType" value="LargeForm_Vertical" />
            <input type="hidden" name="recapModeTheme" id="recapModeTheme" value="" />
            <input type="hidden" name="fieldBorder" id="fieldBorder" value="" />
            <input type="hidden" name="zc_trackCode" id="zc_trackCode" value="" />
            <input type="hidden" name="viewFrom" id="viewFrom" value="URL_ACTION" />
            <input type="hidden" id="submitType" name="submitType" value="optinCustomView" />
            <input type="hidden" id="lD" name="lD" value="" />
            <input type="hidden" name="emailReportId" id="emailReportId" value="" />
            <input type="hidden" name="zx" id="cmpZuid" value="1dfba104ec" />
            <input type="hidden" name="zcvers" value="2.0" />
            <input type="hidden" name="oldListIds" id="allCheckedListIds" value="" />
            <input type="hidden" id="mode" name="mode" value="OptinCreateView" />
            <input type="hidden" id="zcld" name="zcld" value="" />
            <input type="hidden" id="zctd" name="zctd" value="142d4d88c9c9b219" />
            <input type="hidden" id="document_domain" name="document_domain" value="ma.zoho.in" />
            <input type="hidden" id="zc_Url" name="zc_Url" value="krew-zgp4.maillist-manage.in" />
            <input type="hidden" id="new_optin_response_in" name="new_optin_response_in" value="0" />
            <input type="hidden" id="duplicate_optin_response_in" name="duplicate_optin_response_in" value="0" />
            <input type="hidden" id="zc_formIx" name="zc_formIx" value="3z335420771a1197b62e066a87ac1b8b845a78451827a75474354affd03477139e" />
            <input type="hidden" id="scriptless" name="scriptless" value="yes" />
            <input type="hidden" id="zc_spmSubmit" name="zc_spmSubmit" value="ZCSPMSUBMIT" />
            <input type="hidden" name="LEAD_INFO15" value="Become a Partner" />
            <input type="hidden" name="isCaptchaNeeded" id="isCaptchaNeeded" value="false" />
            <input type="hidden" name="superAdminCap" id="superAdminCap" value="0" />
            
            {/* Default UTM hidden fields matching Zoho mapping */}
            <input type="hidden" name="CONTACT_CF1" value="Website" />
            <input type="hidden" name="CONTACT_CF2" value="Ogranic" />
            <input type="hidden" name="CONTACT_CF3" value="website-form" />
            <input type="hidden" name="CONTACT_CF4" value="none" />
            <input type="hidden" name="CONTACT_CF5" value="website" />
            <input type="hidden" name="CONTACT_CF6" value="none" />
            <input type="hidden" name="CONTACT_CF52" value=" " />
            <input type="hidden" name="CONTACT_CF53" value=" " />
            <input type="hidden" name="CONTACT_CF54" value=" " />

            <h3 className={styles.formSubheading}>Company Details</h3>
            <div className={styles.formGrid}>

              {/* Company name */}
              <div className={styles.fieldGroup}>
                <div className={styles.fieldLabelText}>Company name<span className={styles.required}>*</span></div>
                <div className={styles.inputBox}>
                  <input
                    name="COMPANYNAME"
                    type="text"
                    required
                    placeholder="Enter your company name"
                    onChange={() => setErrors((prev) => ({ ...prev, COMPANYNAME: false }))}
                  />
                  {errors.COMPANYNAME && <div className={styles.errorMsg}>This field is required</div>}
                </div>
              </div>

              {/* Website */}
              <div className={styles.fieldGroup}>
                <div className={styles.fieldLabelText}>Website<span className={styles.required}>*</span></div>
                <div className={styles.inputBox}>
                  <input
                    name="WEBSITE"
                    type="text"
                    required
                    placeholder="Enter your website URL (e.g. www.example.com)"
                    onChange={() => setErrors((prev) => ({ ...prev, WEBSITE: false, WEBSITE_FORMAT: false }))}
                  />
                  {errors.WEBSITE && <div className={styles.errorMsg}>This field is required</div>}
                  {errors.WEBSITE_FORMAT && <div className={styles.errorMsg}>Please enter a valid website URL</div>}
                </div>
              </div>

              {/* Country Selection */}
              <div className={styles.fieldGroup}>
                <div className={styles.fieldLabelText}>Country/Primary Market<span className={styles.required}>*</span></div>
                <div className={styles.dropdownWrap} ref={countryDropdownRef}>
                  <input type="hidden" name="COUNTRY" value={countrySearchTerm} />
                  <div
                    className={`${styles.dropdownTrigger} ${isCountryDropdownOpen ? styles.open : ""}`}
                    onClick={() => setIsCountryDropdownOpen(!isCountryDropdownOpen)}
                  >
                    {countrySearchTerm || "Select"}
                    <div className={styles.dropdownArrow}></div>
                  </div>
                  {isCountryDropdownOpen && (
                    <div className={styles.dropdownPanel}>
                      {COUNTRIES.map((country) => (
                        <div
                          key={country.code}
                          className={styles.dropdownOption}
                          onClick={() => {
                            setCountrySearchTerm(country.name);
                            setIsCountryDropdownOpen(false);
                            setErrors((prev) => ({ ...prev, COUNTRY: false }));
                          }}
                        >
                          {country.name}
                        </div>
                      ))}
                    </div>
                  )}
                  {errors.COUNTRY && <div className={styles.errorMsg}>This field is required</div>}
                </div>
              </div>

              {/* Company size */}
              <div className={styles.fieldGroup}>
                <div className={styles.fieldLabelText}>Company size<span className={styles.required}>*</span></div>
                <div className={styles.dropdownWrap} ref={sizeDropdownRef}>
                  <input type="hidden" name="COMPANY_SIZE" value={selectedSize} />
                  <div
                    className={`${styles.dropdownTrigger} ${isSizeDropdownOpen ? styles.open : ""}`}
                    onClick={() => setIsSizeDropdownOpen(!isSizeDropdownOpen)}
                  >
                    {selectedSize || "Select"}
                    <div className={styles.dropdownArrow}></div>
                  </div>
                  {isSizeDropdownOpen && (
                    <div className={styles.dropdownPanel}>
                      {COMPANY_SIZE_OPTIONS.map((size) => (
                        <div
                          key={size}
                          className={styles.dropdownOption}
                          onClick={() => {
                            setSelectedSize(size);
                            setIsSizeDropdownOpen(false);
                            setErrors((prev) => ({ ...prev, COMPANY_SIZE: false }));
                          }}
                        >
                          {size}
                        </div>
                      ))}
                    </div>
                  )}
                  {errors.COMPANY_SIZE && <div className={styles.errorMsg}>This field is required</div>}
                </div>
              </div>
            </div>

            <h3 className={styles.formSubheading}>Primary contact</h3>
            <div className={styles.formGrid}>

              {/* Work email */}
              <div className={styles.fieldGroup}>
                <div className={styles.fieldLabelText}>Work email<span className={styles.required}>*</span></div>
                <div className={styles.inputBox}>
                  <input
                    name="CONTACT_EMAIL"
                    type="email"
                    required
                    placeholder="Enter your work email address"
                    onChange={() => setErrors((prev) => ({ ...prev, CONTACT_EMAIL: false }))}
                  />
                  {errors.CONTACT_EMAIL && <div className={styles.errorMsg}>This field is required</div>}
                </div>
              </div>

              {/* Phone number */}
              <div className={styles.fieldGroup}>
                <div className={styles.fieldLabelText}>Phone number (optional)</div>
                <div className={styles.inputBox}>
                  <input
                    name="PHONE"
                    type="tel"
                    placeholder="Enter your phone number"
                    onInput={(e) => {
                      e.currentTarget.value = e.currentTarget.value.replace(/[^0-9+]/g, '');
                    }}
                  />
                </div>
              </div>

              {/* Industry Selection */}
              <div className={styles.fieldGroupFull}>
                <div className={styles.fieldLabelText}>Industry<span className={styles.required}>*</span></div>
                <div className={styles.dropdownWrap} ref={industryDropdownRef}>
                  <input type="hidden" name="INDUSTRY" value={selectedIndustry} />
                  <div
                    className={`${styles.dropdownTrigger} ${isIndustryDropdownOpen ? styles.open : ""}`}
                    onClick={() => setIsIndustryDropdownOpen(!isIndustryDropdownOpen)}
                  >
                    {selectedIndustry || "Select"}
                    <div className={styles.dropdownArrow}></div>
                  </div>
                  {isIndustryDropdownOpen && (
                    <div className={styles.dropdownPanel}>
                      {INDUSTRY_OPTIONS.map((industry) => (
                        <div
                          key={industry}
                          className={styles.dropdownOption}
                          onClick={() => {
                            setSelectedIndustry(industry);
                            setIsIndustryDropdownOpen(false);
                            setErrors((prev) => ({ ...prev, INDUSTRY: false }));
                          }}
                        >
                          {industry}
                        </div>
                      ))}
                    </div>
                  )}
                  {errors.INDUSTRY && <div className={styles.errorMsg}>This field is required</div>}
                </div>
              </div>

              {/* Textarea */}
              <div className={styles.fieldGroupFull}>
                <div className={styles.fieldLabelText}>Anything you’d like us to know?</div>
                <div className={styles.inputBox}>
                  <textarea
                    name="MESSAGE"
                    placeholder="Leave us a message"
                    maxLength={2000}
                  />
                </div>
              </div>
            </div>

            {/* Terms Checkbox */}
            <div className={styles.checkboxGroup}>
              <div className={`${styles.inputBox}`}>
                <div className={styles.checkboxInner}>
                  <input
                    type="checkbox"
                    id="terms"
                    name="TERMS_AGREED"
                    required
                    checked={agreeToTerms}
                    onChange={(e) => {
                      setAgreeToTerms(e.target.checked);
                      setErrors((prev) => ({ ...prev, TERMS: false }));
                    }}
                  />
                  <label htmlFor="terms" className={styles.checkboxLabel}>
                    By submitting, you agree to Datakrew's <Link href="/termsandconditions" onClick={(e) => e.stopPropagation()}>Terms & Conditions</Link> and <Link href="/privacy-policy" onClick={(e) => e.stopPropagation()}>Privacy Policy</Link>.
                  </label>
                </div>
                {errors.TERMS && <div className={styles.errorMsg}>You must agree to the terms to proceed</div>}
              </div>
            </div>

            <button type="submit" className="primaryCta" disabled={submitting}>
              {submitting ? "Submitting..." : "Submit"}
            </button>

            {errorMessage && <p className={styles.errorMsg} style={{ marginTop: '1rem', fontSize: '1rem' }}>{errorMessage}</p>}
          </form>
        </div>
      </div>
    </section>
  );
}
