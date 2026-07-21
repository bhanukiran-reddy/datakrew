"use client";

import { useRef, useState, useEffect } from "react";
import styles from "./contactForm.module.css";
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

const INDUSTRY_PLACEHOLDER = "Select industry...";



type Props = {
  formHeading?: string | null;
  id?: string;
};

export default function ContactFormSection({ formHeading, id }: Props) {
  const formRef = useRef<HTMLFormElement>(null);
  const [submitted, setSubmitted] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [errors, setErrors] = useState<Record<string, boolean>>({});
  const [agreeToTerms, setAgreeToTerms] = useState(false);

  const [isIndustryDropdownOpen, setIsIndustryDropdownOpen] = useState(false);
  const [selectedIndustry, setSelectedIndustry] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);
  const [countrySearchTerm, setCountrySearchTerm] = useState("");
  const countryDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsIndustryDropdownOpen(false);
      }
      if (countryDropdownRef.current && !countryDropdownRef.current.contains(event.target as Node)) {
        setIsCountryDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
    
  }, []);

  // Global smooth scroll offset interceptor for the JS offset
  useEffect(() => {
    if (!id) return;
    
    const scrollToTarget = () => {
      const element = document.getElementById(id);
      if (element) {
        // Javascript offset calculation (150px provides large clearing space)
        const y = element.getBoundingClientRect().top + window.scrollY - 150;
        window.scrollTo({ top: y, behavior: "smooth" });
      }
    };

    // Check if loaded with the hash
    if (window.location.hash === `#${id}`) {
      setTimeout(scrollToTarget, 100);
      setTimeout(scrollToTarget, 500); // Safari fallback delay
    }

    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest("a");
      
      if (anchor) {
        const href = anchor.getAttribute("href");
        if (href === `#${id}` || href?.endsWith(`#${id}`)) {
          e.preventDefault();
          window.history.pushState(null, "", `#${id}`);
          scrollToTarget();
        }
      }
    };

    document.addEventListener("click", handleAnchorClick);
    return () => document.removeEventListener("click", handleAnchorClick);
  }, [id]);

  const formContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (submitted && formContainerRef.current) {
      setTimeout(() => {
        formContainerRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    }
  }, [submitted]);

  // UTM tracking is now handled globally by the UTMTracker component in RootLayout

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = formRef.current;
    if (!form) return;

    const formData = new FormData(form);
    const newErrors: Record<string, boolean> = {};
    let hasError = false;

    const requiredFields = [
      "FIRSTNAME",
      "LASTNAME",
      "CONTACT_EMAIL",
      "COMPANYNAME",
      "JOB_TITLE",
      "CONTACT_CF14",
    ];

    requiredFields.forEach((field) => {
      const val = formData.get(field);
      if (!val || !val.toString().trim()) {
        newErrors[field] = true;
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

      const defaultUtmValues: Record<string, string> = {
        "CONTACT_CF1": "Website",
        "CONTACT_CF2": "Organic",
        "CONTACT_CF3": "website-form",
        "CONTACT_CF4": "none",
        "CONTACT_CF5": "website",
        "CONTACT_CF6": "none"
      };

      // Read UTM params: URL query string → sessionStorage → cookie (priority order)
      // IMPORTANT: Use .set() NOT based on .has() — form has hardcoded hidden inputs
      // for CONTACT_CF1–CF6 (e.g. "Website", "Organic"), so .has() is always true.
      // .set() overwrites them with real UTM values when present.
      const urlParams = new URLSearchParams(window.location.search);
      utmParams.forEach((param) => {
        const zohoField = zohoMappings[param];
        if (!zohoField) return;

        // 1. URL query string (highest priority — user came via tracked link)
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

        // 3. Cookies (leaves hidden-input defaults untouched if nothing found)
        const cookieStr = document.cookie;
        const match = cookieStr.match(new RegExp('(^| )' + param + '=([^;]+)'));
        if (match) {
          formData.set(zohoField, match[2]);
        }
      });

      formData.delete("TERMS_AGREED"); // Clean up if any
      formData.delete("zc_spmSubmit");

      // Normalize location to lowercase for Zoho compatibility
      const loc = formData.get("CONTACT_CF14");
      if (loc) formData.set("CONTACT_CF14", loc.toString().toLowerCase());

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
        setSuccessMessage(message ?? "Thank you for Signing Up");
        setSubmitted(true);
      } else {
        setErrorMessage(
          message ??
          (typeof data?.error === "string"
            ? data.error
            : "Something went wrong. Please try again."),
        );
      }
    } catch (err) {
      setErrorMessage(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className={styles.formSuccessWrapper} id={id}>
        <div className={styles.formSuccessBlock} ref={formContainerRef} role="status">
          <h4 className={styles.formSuccessHeadline}>
            You’re <span>all set.</span>
          </h4>
          <p className={styles.formSuccessSubheadline}>
            Our team will follow up shortly with the right next step for your use case.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.formBlock} id={id}>
      {formHeading && <h4 className={styles.formHeading}>{formHeading}</h4>}
      <div className={styles.contactFormHtml} name="signupFormContainer">
        <div
          id="sf3z7b595db7c8b418a4c5bba6280ede7514e30fe94db60c0e5edba22087832ae153"
          data-type="signupform"
        >
          <div id="customForm">

            <div
              name="SIGNUP_PAGE"
              className="large_form_1_css"
              id="SIGNUP_PAGE"
            >
              <div name="" changeid="" changename="">
                <div id="imgBlock" name="LOGO_DIV" logo="true" />
              </div>
              <br />
              <div
                id="signupMainDiv"
                name="SIGNUPFORM"
                changeid="SIGNUPFORM"
                changename="SIGNUPFORM"
              >
                <div>
                  <div style={{ position: "relative" }}>
                    <div
                      id="Zc_SignupSuccess"
                      style={{
                        display: "none",
                        position: "absolute",
                        marginLeft: "4%",
                        width: "90%",
                        backgroundColor: "white",
                        padding: "3px",
                        border: "3px solid rgb(194, 225, 154)",
                        marginTop: "10px",
                        marginBottom: "10px",
                        wordBreak: "break-all",
                      }}
                    >
                      <table
                        width="100%"
                        cellPadding="0"
                        cellSpacing="0"
                        border={0}
                      >
                        <tbody>
                          <tr>
                            <td width="10%">
                              <img
                                className="successicon"
                                src="https://ma.zoho.in/images/challangeiconenable.jpg"
                                align="absmiddle"
                                alt="thumsup"
                              />
                            </td>
                            <td>
                              <span
                                id="signupSuccessMsg"
                                style={{
                                  color: "rgb(73, 140, 132)",
                                  fontFamily: "sans-serif",
                                  fontSize: "14px",
                                  wordBreak: "break-word",
                                }}
                              >
                                {" "}
                                Thank you for Signing Up
                              </span>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                  <form
                    ref={formRef}
                    method="POST"
                    id="zcampaignOptinForm"
                    action="https://krew-zgp4.maillist-manage.in/weboptin.zc"
                    onSubmit={handleSubmit}
                    noValidate
                  >
                    <input type="hidden" name="signupTmplName" id="signupTmplName" value="large_form_1" />
                    <input type="hidden" name="recapThemeOptin" value="2" id="recapThemeOptin" />
                    <input type="hidden" name="orgNameFull" id="orgNameFull" value="Datakrew" />
                    <input type="hidden" name="recapTheme" id="recapTheme" value="2" />
                    <input type="hidden" name="isRecapIntegDone" id="isRecapIntegDone" value="false" />
                    <input type="hidden" name="signupFormMode" id="signupFormMode" value="" />
                    <input type="hidden" name="signupFormType" id="signupFormType" value="LargeForm_Vertical" />
                    <input type="hidden" name="recapModeTheme" id="recapModeTheme" value="" />

                    <div id="SIGNUP_BODY_ALL" name="SIGNUP_BODY_ALL">
                      <h2
                        id="SIGNUP_HEADING"
                        name="SIGNUP_HEADING"
                        changeid="SIGNUP_MSG"
                        changetype="SIGNUP_HEADER"
                      />
                      <div id="SIGNUP_BODY" name="SIGNUP_BODY">
                        <div>
                          <div>
                            <div
                              name="fieldsdivSf"
                              className={`zcsffieldsdiv ${styles.formGroup}`}
                            >

                              <div className={styles.fieldGroup}>
                                <div className={styles.fieldLabel}>
                                  <div
                                    className={styles.fieldLabelText}
                                    name="SIGNUP_FORM_LABEL"
                                  >
                                    First Name
                                    <span name="SIGNUP_REQUIRED">*</span>
                                  </div>
                                  <div className={`zcinputbox ${styles.inputBox}`}>
                                    <input
                                      name="FIRSTNAME"
                                      changeitem="SIGNUP_FORM_FIELD"
                                      maxLength={50}
                                      type="text"
                                      required
                                      placeholder="Enter your first name"
                                      onInput={(e) => {
                                        const input = e.currentTarget;
                                        input.value = input.value.replace(/[^a-zA-Z\s-]/g, '');
                                        setErrors((prev) => ({ ...prev, FIRSTNAME: false }));
                                      }}
                                    />
                                    {errors.FIRSTNAME && <div className={styles.errorMsg}>This field is required</div>}
                                  </div>
                                </div>
                                <div />
                              </div>
                              <div className={styles.fieldGroup}>
                                <div className={styles.fieldLabel}>
                                  <div
                                    className={styles.fieldLabelText}
                                    name="SIGNUP_FORM_LABEL"
                                  >
                                    Last Name
                                    <span name="SIGNUP_REQUIRED">*</span>
                                  </div>
                                  <div className={`zcinputbox ${styles.inputBox}`}>
                                    <input
                                      name="LASTNAME"
                                      changeitem="SIGNUP_FORM_FIELD"
                                      maxLength={50}
                                      type="text"
                                      required
                                      placeholder="Enter your last name"
                                      onInput={(e) => {
                                        const input = e.currentTarget;
                                        input.value = input.value.replace(/[^a-zA-Z\s-]/g, '');
                                        setErrors((prev) => ({ ...prev, LASTNAME: false }));
                                      }}
                                    />
                                    {errors.LASTNAME && <div className={styles.errorMsg}>This field is required</div>}
                                  </div>
                                </div>
                                <div />
                              </div>
                              <div className={styles.fieldGroup}>
                                <div className={styles.fieldLabel}>
                                  <div
                                    className={styles.fieldLabelText}
                                    name="SIGNUP_FORM_LABEL"
                                  >
                                    Work email
                                    <span name="SIGNUP_REQUIRED">*</span>
                                  </div>
                                  <div className={`zcinputbox ${styles.inputBox}`}>
                                    <input
                                      name="CONTACT_EMAIL"
                                      changeitem="SIGNUP_FORM_FIELD"
                                      maxLength={100}
                                      type="email"
                                      required
                                      placeholder="Enter your work email address"
                                      onChange={() => setErrors((prev) => ({ ...prev, CONTACT_EMAIL: false }))}
                                    />
                                    {errors.CONTACT_EMAIL && <div className={styles.errorMsg}>This field is required</div>}
                                  </div>
                                </div>
                                <div />
                              </div>
                              <div className={styles.fieldGroup}>
                                <div className={styles.fieldLabel}>
                                  <div
                                    className={styles.fieldLabelText}
                                    name="SIGNUP_FORM_LABEL"
                                  >
                                    Phone number (optional)
                                  </div>
                                  <div className={`zcinputbox ${styles.inputBox}`}>
                                    <input
                                      name="PHONE"
                                      changeitem="SIGNUP_FORM_FIELD"
                                      maxLength={20}
                                      type="tel"
                                      placeholder="Enter your phone number"
                                      pattern="[+]?[0-9]*"
                                      onInput={(e) => {
                                        const input = e.currentTarget;
                                        // Limit to 15 digits/chars
                                        input.value = input.value.replace(/[^0-9+]/g, '').slice(0, 15);
                                        setErrors((prev) => ({ ...prev, PHONE: false }));
                                      }}
                                    />
                                    {errors.PHONE && <div className={styles.errorMsg}>This field is required</div>}
                                  </div>
                                </div>
                                <div />
                              </div>
                              <div className={styles.fieldGroup}>
                                <div className={styles.fieldLabel}>
                                  <div
                                    className={styles.fieldLabelText}
                                    name="SIGNUP_FORM_LABEL"
                                  >
                                    Company Name
                                    <span name="SIGNUP_REQUIRED">*</span>
                                  </div>
                                  <div className={`zcinputbox ${styles.inputBox}`}>
                                    <input
                                      name="COMPANYNAME"
                                      changeitem="SIGNUP_FORM_FIELD"
                                      maxLength={100}
                                      type="text"
                                      required
                                      placeholder="Enter your company name"
                                      onChange={() => setErrors((prev) => ({ ...prev, COMPANYNAME: false }))}
                                    />
                                    {errors.COMPANYNAME && <div className={styles.errorMsg}>This field is required</div>}
                                  </div>
                                </div>
                                <div />
                              </div>
                              <div className={styles.fieldGroup}>
                                <div className={styles.fieldLabel}>
                                  <div
                                    className={styles.fieldLabelText}
                                    name="SIGNUP_FORM_LABEL"
                                  >
                                    Job title
                                    <span name="SIGNUP_REQUIRED">*</span>
                                  </div>
                                  <div className={`zcinputbox ${styles.inputBox}`}>
                                    <input
                                      name="JOB_TITLE"
                                      changeitem="SIGNUP_FORM_FIELD"
                                      maxLength={50}
                                      type="text"
                                      required
                                      placeholder="Enter your job title"
                                      onChange={() => setErrors((prev) => ({ ...prev, JOB_TITLE: false }))}
                                    />
                                    {errors.JOB_TITLE && <div className={styles.errorMsg}>This field is required</div>}
                                  </div>
                                </div>
                                <div />
                              </div>
                              <div className={styles.fieldGroupFull}>
                                <div className={styles.fieldLabel}>
                                  <div
                                    className={styles.fieldLabelText}
                                    name="SIGNUP_FORM_LABEL"
                                  >
                                    Company location
                                    <span name="SIGNUP_REQUIRED">*</span>
                                  </div>
                                  <div className={`zcinputbox ${styles.inputBox}`}>
                                    <div className={styles.industryDropdownWrap} ref={countryDropdownRef}>
                                      <input type="hidden" name="CONTACT_CF14" value={countrySearchTerm} />
                                      <input
                                        className={styles.industryDropdownTrigger}
                                        type="text"
                                        placeholder="Type to search country..."
                                        value={countrySearchTerm}
                                        onChange={(e) => {
                                          setCountrySearchTerm(e.target.value);
                                          setIsCountryDropdownOpen(true);
                                          setErrors((prev) => ({ ...prev, CONTACT_CF14: false }));
                                        }}
                                        onFocus={() => setIsCountryDropdownOpen(true)}
                                      />
                                      <div className={styles.industryDropdownArrow}></div>

                                      {isCountryDropdownOpen && (
                                        <div className={styles.industryDropdownPanel}>
                                          {COUNTRIES.filter(country => country.name.toLowerCase().includes(countrySearchTerm.toLowerCase())).length > 0 ? (
                                            COUNTRIES.filter(country => country.name.toLowerCase().includes(countrySearchTerm.toLowerCase())).map((country) => (
                                              <div
                                                key={country.code}
                                                className={styles.industryDropdownOption}
                                                onClick={() => {
                                                  setCountrySearchTerm(country.name);
                                                  setIsCountryDropdownOpen(false);
                                                  setErrors((prev) => ({ ...prev, CONTACT_CF14: false }));
                                                }}
                                              >
                                                {country.name}
                                              </div>
                                            ))
                                          ) : (
                                            <div className={styles.industryDropdownOption} style={{ opacity: 0.5, cursor: 'default' }}>
                                              No countries found
                                            </div>
                                          )}
                                        </div>
                                      )}
                                    </div>
                                    {errors.CONTACT_CF14 && <div className={styles.errorMsg}>This field is required</div>}
                                  </div>
                                </div>
                                <div />
                              </div>
                              <div className={styles.fieldGroupFull}>
                                <div className={styles.fieldLabel}>
                                  <div
                                    className={styles.fieldLabelText}
                                    name="SIGNUP_FORM_LABEL"
                                  >
                                    Anything you’d like us to know (optional)
                                  </div>
                                  <div className="zcinputbox">
                                    <textarea
                                      name="CONTACT_CF13"
                                      changeitem="SIGNUP_FORM_FIELD"
                                      zc_display_name="Message"
                                      placeholder="Leave us a message"
                                      maxLength={2000}
                                      cols={undefined}
                                      rows={undefined}
                                    />
                                  </div>
                                  <div />
                                </div>
                                <div />
                              </div>
                            </div>
                            <div />
                            {/* <div
                              id="REQUIRED_FIELD_TEXT"
                              changetype="REQUIRED_FIELD_TEXT"
                              name="SIGNUP_REQUIRED"
                            >
                              *Required fields
                            </div> */}
                            <div className={styles.checkboxGroup}>
                              <div className={styles.inputBox}>
                                <div className={styles.checkboxInner}>
                                  <input
                                    type="checkbox"
                                    id="terms"
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
                            <div>
                              <input
                                type="submit"
                                formAction="Save"
                                id="zcWebOptin"
                                name="SIGNUP_SUBMIT_BUTTON"
                                changetype="SIGNUP_SUBMIT_BUTTON_TEXT"
                                value={submitting ? "Submitting..." : "Submit"}
                                disabled={submitting}
                                className="primaryCta"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                      <input type="hidden" name="fieldBorder" id="fieldBorder" value="" />
                      <input
                        type="hidden"
                        name="zc_trackCode"
                        id="zc_trackCode"
                        value=""
                      />
                      <input
                        type="hidden"
                        name="viewFrom"
                        id="viewFrom"
                        value="URL_ACTION"
                      />
                      <input
                        type="hidden"
                        id="submitType"
                        name="submitType"
                        value="optinCustomView"
                      />
                      <input type="hidden" id="lD" name="lD" value="" />
                      <input
                        type="hidden"
                        name="emailReportId"
                        id="emailReportId"
                        value=""
                      />
                      <input
                        type="hidden"
                        name="zx"
                        id="cmpZuid"
                        value="1dfba104ec"
                      />
                      <input type="hidden" name="zcvers" value="2.0" />
                      <input
                        type="hidden"
                        name="oldListIds"
                        id="allCheckedListIds"
                        value=""
                      />
                      <input
                        type="hidden"
                        id="mode"
                        name="mode"
                        value="OptinCreateView"
                      />
                      <input type="hidden" id="zcld" name="zcld" value="" />
                      <input type="hidden" id="zctd" name="zctd" value="142d4d88c9c9b219" />
                      <input type="hidden" id="document_domain" name="document_domain" value="ma.zoho.in" />
                      <input type="hidden" id="zc_Url" name="zc_Url" value="krew-zgp4.maillist-manage.in" />
                      <input type="hidden" id="new_optin_response_in" name="new_optin_response_in" value="0" />
                      <input type="hidden" id="duplicate_optin_response_in" name="duplicate_optin_response_in" value="0" />
                      <input
                        type="hidden"
                        id="zc_formIx"
                        name="zc_formIx"
                        value="3z7b595db7c8b418a4c5bba6280ede7514e30fe94db60c0e5edba22087832ae153"
                      />
                      <input type="hidden" name="LEAD_INFO15" value="Contact Us" />
                      <input type="hidden" name="CONTACT_CF15" value="" />
                      <input type="hidden" name="CONTACT_CF31" value="" />
                      <input type="hidden" name="CONTACT_CF32" value="" />
                      <input type="hidden" name="isCaptchaNeeded" id="isCaptchaNeeded" value="false" />
                      <input type="hidden" name="superAdminCap" id="superAdminCap" value="0" />

                      {/* Hidden UTM fields matching Zoho snippet structure */}
                      <input type="hidden" name="CONTACT_CF1" value="Website" />
                      <input type="hidden" name="CONTACT_CF2" value="Organic" />
                      <input type="hidden" name="CONTACT_CF3" value="website-form" />
                      <input type="hidden" name="CONTACT_CF4" value="none" />
                      <input type="hidden" name="CONTACT_CF5" value="website" />
                      <input type="hidden" name="CONTACT_CF6" value="none" />
                    </div>
                    <input
                      type="hidden"
                      id="scriptless"
                      name="scriptless"
                      value="yes"
                    />
                    <input
                      type="hidden"
                      id="zc_spmSubmit"
                      name="zc_spmSubmit"
                      value="ZCSPMSUBMIT"
                    />
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {errorMessage && (
        <p className={styles.formError} role="alert">
          {errorMessage}
        </p>
      )}
    </div>
  );
}
