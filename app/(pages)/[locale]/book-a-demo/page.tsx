"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { usePathname } from "next/navigation";
import styles from "./bookDemo.module.css";


import Link from "@/components/ui/Link/Link";
import Script from "next/script";
import CompleteYourIntelligence from "@/components/sections/reusable/CompleteYourIntelligence/CompleteYourIntelligence";
import Breadcrumb from "@/components/ui/Breadcrumb/Breadcrumb";
import { COUNTRIES } from "@/lib/utils/countries";
import type { BookaDemoPageData } from "@/lib/graphql/queries/getBookADemoPage";

interface BookDemoFormData {
  role: string;
  industries: string[];
  fleetSize: string;
  assetTypes: string[];
  productionVolume: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  companyName: string;
  jobTitle: string;
  location: string;
  message: string;
  agreeToTerms: boolean;
}

type RoleOption = {
  id: string;
  title: string;
  icon: string;
  iconUrl?: string;
};

type Role = {
  id: string;
  title: string;
  icon: string;
  iconUrl?: string;
  question: string;
  volumeQuestion?: string;
  type: RoleOption[];
  volumeOptions?: Array<{ id: string; title: string }>;
};

const ROLE_IDS = ["fleet-manager", "oem", "other"] as const;
const DEFAULT_ICON = "fa-kit fa-dots";

function buildStepsFromQuery(
  pageData: BookaDemoPageData | null,
): Array<{ number: string; title: string }> {
  const stepsData = pageData?.bookADemoStepsSection?.bookDemoSteps;
  if (!stepsData) return [];
  const one = stepsData.bookDemoStepOne;
  const two = stepsData.bookDemoStepTwo;
  const three = stepsData.bookDemoStepThree;
  return [
    {
      number: one?.stepOneNumber ?? "",
      title: (one?.stepOneHeading ?? "").trim(),
    },
    {
      number: two?.stepTwoNumber ?? "",
      title: (two?.stepTwoHeading ?? "").trim(),
    },
    {
      number: three?.stepThreeNumber ?? "",
      title: (three?.stepThreeHeading ?? "").trim(),
    },
  ];
}

function buildRolesFromCms(pageData: BookaDemoPageData | null): Role[] | null {
  const stepsData = pageData?.bookADemoStepsSection?.bookDemoSteps;
  if (!stepsData) return null;
  const stepOne = stepsData.bookDemoStepOne;
  const stepTwo = stepsData.bookDemoStepTwo;
  const opts = stepOne?.stepOneAnswerOptions;
  const hasThreeOptions = Array.isArray(opts) && opts.length >= 3;
  if (!hasThreeOptions) return null;

  const fleetRaw = stepTwo?.stepTwoFleetPersona;
  const oemRaw = stepTwo?.stepTwoOemsPersona;
  const others = stepTwo?.stepTwoOthersPersona;

  const fleetArr = Array.isArray(fleetRaw)
    ? fleetRaw
    : fleetRaw
      ? [fleetRaw]
      : null;
  const oemArr = Array.isArray(oemRaw) ? oemRaw : oemRaw ? [oemRaw] : null;

  const fleetIndustry = fleetArr?.[0] ?? null;
  const fleetVolume = fleetArr && fleetArr.length > 1 ? fleetArr[1] : null;
  const oemAsset = oemArr?.[0] ?? null;
  const oemVolume = oemArr && oemArr.length > 1 ? oemArr[1] : null;

  const toRoleOptions = (items: any[] | null | undefined, textKey: string, iconKey: string): RoleOption[] =>
    (items ?? []).map((o, i) => {
      const t = (o[textKey] ?? "").trim();
      const iconUrl = o[iconKey]?.node?.mediaItemUrl;
      return { id: t || `opt-${i}`, title: t, icon: DEFAULT_ICON, iconUrl };
    });

  const toVolumeOptions = (items: any[] | null | undefined, textKey: string): Array<{ id: string; title: string }> =>
    (items ?? []).map((o) => {
      const t = (o[textKey] ?? "").trim();
      return { id: t, title: t };
    });

  const roles: Role[] = ROLE_IDS.map((roleId, index) => {
    const option = opts![index];
    const title = (option?.stepOneOptionText ?? "").trim();
    const icon = (option?.stepOneOptionIconClass ?? "").trim() || DEFAULT_ICON;
    const iconUrl = (option as any)?.stepOneOptionIcon?.node?.mediaItemUrl;

    if (roleId === "fleet-manager") {
      const question = (fleetIndustry?.fleetPersonaQuestion ?? "").trim();
      const volumeQuestion = (fleetVolume?.fleetPersonaQuestion ?? "").trim() || undefined;
      const type = toRoleOptions(fleetIndustry?.personaAnswerOptions, "fleetOptionText", "fleetOptionIcon");
      const volumeOptions = toVolumeOptions(fleetVolume?.personaAnswerOptions, "fleetOptionText");
      return { id: roleId, title, icon, iconUrl, question, volumeQuestion, type, volumeOptions };
    }
    if (roleId === "oem") {
      const question = (oemAsset?.oemPersonaQuestion ?? "").trim();
      const volumeQuestion = (oemVolume?.oemPersonaQuestion ?? "").trim() || undefined;
      const type = toRoleOptions(oemAsset?.oemAnswerOptions, "oemOptionText", "oemOptionIcon");
      const volumeOptions = toVolumeOptions(oemVolume?.oemAnswerOptions, "oemOptionText");
      return { id: roleId, title, icon, iconUrl, question, volumeQuestion, type, volumeOptions };
    }
    const question = (others?.personaOthersQuestion ?? "").trim();
    const type = toRoleOptions(others?.othersPersonaAnswerOptions, "othersOptionText", "othersOptionIcon");
    return { id: roleId, title, icon, iconUrl, question, type };
  });

  return roles;
}

export default function BookDemoPage() {
  const pathname = usePathname();
  const [cmsPageData, setCmsPageData] = useState<BookaDemoPageData | null>(
    null,
  );
  const calendlyRef = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<BookDemoFormData>({
    role: "",
    industries: [],
    fleetSize: "",
    assetTypes: [],
    productionVolume: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    companyName: "",
    jobTitle: "",
    location: "",
    message: "",
    agreeToTerms: false,
  });

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const formRef = useRef<HTMLFormElement>(null);

  const [errors, setErrors] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const segments = pathname?.split("/").filter(Boolean) ?? [];
    const locale =
      segments[0] && /^[a-z]{2}(-[A-Z]{2})?$/.test(segments[0])
        ? segments[0]
        : "en";
    fetch(`/api/book-a-demo?locale=${encodeURIComponent(locale)}`)
      .then((res) => res.json())
      .then((data) => setCmsPageData(data ?? null))
      .catch(() => setCmsPageData(null));
  }, [pathname]);

  // UTM tracking is now handled globally by the UTMTracker component in RootLayout

  const displaySteps = useMemo(
    () => buildStepsFromQuery(cmsPageData),
    [cmsPageData],
  );
  const displayRoles = useMemo(
    () => buildRolesFromCms(cmsPageData) ?? [],
    [cmsPageData],
  );
  const sectionHeading =
    cmsPageData?.bookADemoStepsSection?.bookDemoSectionHeading?.trim() ||
    cmsPageData?.title?.trim() ||
    "Book a Demo";
  const stepOneQuestion =
    cmsPageData?.bookADemoStepsSection?.bookDemoSteps?.bookDemoStepOne?.stepOneQuestion?.trim() ||
    "Which role fits you best?";
  const stepOneCtaText =
    cmsPageData?.bookADemoStepsSection?.bookDemoSteps?.bookDemoStepOne?.stepOneCtaButtonText?.trim() ||
    "Next";
  const stepTwoBackText =
    cmsPageData?.bookADemoStepsSection?.bookDemoSteps?.bookDemoStepTwo?.stepTwoCtaButtons?.stepTwobuttonLeftText?.trim() ||
    "Back";
  const stepTwoNextText =
    cmsPageData?.bookADemoStepsSection?.bookDemoSteps?.bookDemoStepTwo?.stepTwoCtaButtons?.stepTwobuttonRightText?.trim() ||
    "Next";
  const stepThreeFormHeading =
    cmsPageData?.bookADemoStepsSection?.bookDemoSteps?.bookDemoStepThree?.stepThreeFormHeading?.trim() ||
    "Let's confirm your details";
  const stepThreeBackText =
    cmsPageData?.bookADemoStepsSection?.bookDemoSteps?.bookDemoStepThree?.stepThreeCtaButtons?.stepThreeButtonLeftText?.trim() ||
    "Back";
  const stepThreeSubmitText =
    cmsPageData?.bookADemoStepsSection?.bookDemoSteps?.bookDemoStepThree?.stepThreeCtaButtons?.stepThreeButtonRightText?.trim() ||
    "Schedule the demo";

  const updateFormData = (fields: Partial<BookDemoFormData>) => {
    setFormData((prev) => ({ ...prev, ...fields }));
    // Clear errors for updated fields
    const newErrors = { ...errors };
    Object.keys(fields).forEach((key) => {
      newErrors[key] = false;
    });
    setErrors(newErrors);
  };

  const handleRoleSelect = (roleId: string) => {
    // Clear all qualification fields when role changes
    updateFormData({
      role: roleId,
      industries: [],
      fleetSize: "",
      assetTypes: [],
      productionVolume: "",
    });
  };

  const handleTypeToggle = (
    typeId: string,
    field: "industries" | "assetTypes",
  ) => {
    const current = formData[field];
    if (current.includes(typeId)) {
      updateFormData({ [field]: current.filter((id) => id !== typeId) });
    } else {
      updateFormData({ [field]: [...current, typeId] });
    }
  };

  const handleNext = () => {
    if (step === 1) {
      if (!formData.role) {
        setErrorMessage("Please select a role to proceed.");
        return;
      }
    }
    if (step === 2) {
      if (formData.role === "fleet-manager") {
        if (formData.industries.length === 0 || !formData.fleetSize) {
          setErrorMessage("Please select your industry and fleet size.");
          return;
        }
      } else if (formData.role === "oem") {
        if (formData.assetTypes.length === 0 || !formData.productionVolume) {
          setErrorMessage("Please select asset type and production volume.");
          return;
        }
      } else if (formData.role === "other") {
        if (formData.industries.length === 0) {
          setErrorMessage("Please select your industry.");
          return;
        }
      }
    }
    setErrorMessage("");
    setStep((prev) => prev + 1);
  };
  const handleBack = () => setStep((prev) => prev - 1);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = formRef.current;
    if (!form) return;

    const newErrors: Record<string, boolean> = {};
    let hasError = false;

    const requiredFields = [
      { key: "firstName", name: "FIRSTNAME" },
      { key: "lastName", name: "LASTNAME" },
      { key: "email", name: "CONTACT_EMAIL" },
      { key: "companyName", name: "COMPANYNAME" },
      { key: "jobTitle", name: "JOB_TITLE" },
      { key: "location", name: "CONTACT_CF14" },
      { key: "agreeToTerms", name: "terms", type: "checkbox" },
    ];

    requiredFields.forEach((field) => {
      if (field.type === "checkbox") {
        if (!formData[field.key as keyof BookDemoFormData]) {
          newErrors[field.key] = true;
          hasError = true;
        }
      } else {
        const val = formData[field.key as keyof BookDemoFormData];
        if (!val || !val.toString().trim()) {
          newErrors[field.key] = true;
          hasError = true;
        }
      }
    });

    setErrors(newErrors);

    if (hasError) return;

    setErrorMessage("");
    setSubmitting(true);

    try {
      const formDataObj = new FormData(form);

      // Fetch UTM marketing cookies and translate to Zoho field mapping
      const utmParams = [
        "utm_source",
        "utm_medium",
        "utm_campaign",
        "utm_term",
        "utm_content",
        "gclid",
      ];
      const zohoMappings: Record<string, string> = {
        utm_source: "CONTACT_CF1",
        utm_medium: "CONTACT_CF2",
        utm_content: "CONTACT_CF3",
        utm_term: "CONTACT_CF4",
        utm_campaign: "CONTACT_CF5",
        gclid: "CONTACT_CF6",
      };

      const defaultUtmValues: Record<string, string> = {
        CONTACT_CF1: "Website",
        CONTACT_CF2: "Organic",
        CONTACT_CF3: "website-form",
        CONTACT_CF4: "none",
        CONTACT_CF5: "website",
        CONTACT_CF6: "none",
      };

      // Read UTM params: URL query string → sessionStorage → cookie (priority order)
      // IMPORTANT: Use .set() NOT .append() — the form already has hardcoded hidden inputs
      // for these fields (e.g. CONTACT_CF1 = "Website"). Using .has() would always return
      // true so UTMs would be silently ignored. .set() overwrites with real values.
      const urlParams = new URLSearchParams(window.location.search);
      utmParams.forEach((param) => {
        const zohoField = zohoMappings[param];
        if (!zohoField) return;

        // 1. URL query string (user came via a tracked link — highest priority)
        const urlValue = urlParams.get(param);
        if (urlValue) {
          formDataObj.set(zohoField, urlValue);
          return;
        }

        // 2. sessionStorage (captured on page load, survives multi-step scrolling)
        const sessionValue = sessionStorage.getItem(`utm_${param}`);
        if (sessionValue) {
          formDataObj.set(zohoField, sessionValue);
          return;
        }

        // 3. Cookies (fallback — leaves hidden-input defaults untouched if nothing found)
        const cookieStr = document.cookie;
        const match = cookieStr.match(new RegExp("(^| )" + param + "=([^;]+)"));
        if (match) {
          formDataObj.set(zohoField, match[2]);
        }
      });

      // Normalize location to lowercase for Zoho compatibility
      const loc = formDataObj.get("CONTACT_CF14");
      if (loc) formDataObj.set("CONTACT_CF14", loc.toString().toLowerCase());

      formDataObj.delete("zc_spmSubmit");

      const res = await fetch("/api/contact", {
        method: "POST",
        body: formDataObj,
        headers: { Accept: "application/json" },
      });
      const data = await res.json().catch(() => ({}));
      const message =
        typeof data?.inlineMessage === "string" && data.inlineMessage
          ? data.inlineMessage
          : typeof data?.rawResponse === "string" &&
            !data.rawResponse.trim().startsWith("<")
            ? data.rawResponse
            : null;

      if (res.ok || data.success) {
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

  const isFleetManager = formData.role === "fleet-manager";
  const isOEM = formData.role === "oem";
  const isOther = formData.role === "other";
  const selectedRole = displayRoles.find((r) => r.id === formData.role);
  const intelligenceStack = cmsPageData?.intelligenceStackSection;

  return (
    <div className={styles.pageContainer}>
      <Breadcrumb items={[{ label: "Book a Demo" }]} />
      <div className={styles.mainContent}>
        <section className={styles.bookDemoSection}>
          <div className="container">
            {!cmsPageData && !submitted ? (
              /* Skeleton Loader */
              <div className={styles.skeletonWrapper}>
                <div className={`${styles.skeleton} ${styles.skeletonTitle}`} />
                <div className={styles.stepsWrapper}>
                  <div className={styles.steps}>
                    {[1, 2, 3].map((i) => (
                      <div className={styles.skeletonStep} key={i}>
                        <div className={`${styles.skeleton} ${styles.skeletonCircle}`} />
                        <div className={`${styles.skeleton} ${styles.skeletonText}`} />
                      </div>
                    ))}
                  </div>
                </div>
                <div className={styles.formContainer}>
                  <div className={`${styles.skeleton} ${styles.skeletonText}`} style={{ margin: '0 auto 2rem', width: '40%' }} />
                  <div className={styles.skeletonRoleGrid}>
                    {[1, 2, 3].map((i) => (
                      <div className={`${styles.skeleton} ${styles.skeletonRoleCard}`} key={i} />
                    ))}
                  </div>
                  <div className={`${styles.skeleton} ${styles.skeletonForm}`} />
                </div>
              </div>
            ) : submitted ? (
              <div className={styles.stepWrapper}>
                <div
                  className={`${styles.formSuccessBlock} ${styles.bookDemoTitle}`}
                  role="status"
                  style={{ textAlign: "center" }}
                >
                  <h1>
                    You're{" "}
                    <span className={styles.formSuccessHeadlineSpan}>
                      all set.
                    </span>
                  </h1>
                  <p className={styles.formSuccessSubheadline}>
                    Our team will follow up shortly with the right next step for
                    your use case.
                  </p>
                </div>

                {intelligenceStack && (
                  <>
                    <h4 className={styles.exploreText}>
                      {intelligenceStack.stackSectionHeader}
                    </h4>
                    <CompleteYourIntelligence
                      className={styles.intelligenceSectionOverride}
                      stackSectionDescription={intelligenceStack.stackSectionDescription ?? undefined}
                      stackDetails={intelligenceStack.stackDetails as any}
                      stackCtaButton={intelligenceStack.stackCtaButton as any}
                    />
                  </>
                )}
              </div>
            ) : (
              /* Normal content when data is loaded */
              <>
                <div className={styles.bookDemoTitle}>
                  <h1 dangerouslySetInnerHTML={{ __html: sectionHeading }} />
                </div>
                <div className={styles.stepsWrapper}>
                  <div className={styles.waveWrapper}>
                    <svg
                      className={`${styles.leftWave}`}
                      width="491"
                      height="89"
                      viewBox="0 0 491 89"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M0.265625 87.6139C62.5695 48.0622 111.324 0.499981 286.919 0.5C360.538 0.500008 427.836 10.3578 490.266 23.4412"
                        stroke={step >= 2 ? "#93D772" : "#8D8D8D"}
                        strokeDasharray="2 2"
                      />
                    </svg>
                    <svg
                      className={`${styles.rightWave}`}
                      width="487"
                      height="77"
                      viewBox="0 0 487 77"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M486.125 0.359375C436.625 48.3594 338.941 76.3044 222.886 76.3044C153.98 76.3044 81.0819 56.7021 0.125 36.0947"
                        stroke={step >= 3 ? "#93D772" : "#8D8D8D"}
                        strokeDasharray="2 2"
                      />
                    </svg>
                  </div>
                  <div className={styles.steps}>
                    {displaySteps.map((s, index) => {
                      const isCurrentOrCompleted = step >= index + 1;
                      const isCurrent = step === index + 1;
                      return (
                        <div
                          className={`${styles.step} ${isCurrentOrCompleted ? styles.active : ""} ${isCurrent ? styles.current : ""}`}
                          key={index}
                        >
                          <div className={styles.number}>
                            <h2>{s.number}</h2>
                          </div>
                          <h5>{s.title}</h5>
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div className={styles.formContainer}>

                  {step === 1 && (
                    <div className={styles.stepWrapper}>
                      <h2
                        className={styles.stepTitle}
                        dangerouslySetInnerHTML={{ __html: stepOneQuestion }}
                      />
                      <div className={styles.rolesGrid}>
                        {displayRoles.map((role) => (
                          <div
                            key={role.id}
                            className={`${styles.roleCard} ${formData.role === role.id ? styles.selected : ""} ${role.id === "other" ? styles.otherRole : ""}`}
                            onClick={() => handleRoleSelect(role.id)}
                          >
                            {role.iconUrl ? (
                              <img src={role.iconUrl} alt={role.title} className={styles.cardIconImg} />
                            ) : (
                              <i className={`${role.icon} ${styles.cardIcon}`} />
                            )}
                            <span className={styles.cardTitle}>
                              {role.title}
                            </span>
                          </div>
                        ))}
                      </div>
                      <div className={styles.actions}>
                        <button
                          className="primaryCta"
                          onClick={handleNext}
                        >
                          {stepOneCtaText}
                        </button>
                      </div>
                      {step === 1 && errorMessage && <p className={styles.stepError}>{errorMessage}</p>}
                    </div>
                  )}

                  {step === 2 && (
                    <div className={styles.stepWrapper}>
                      <h2 className={styles.stepTitle}>
                        {selectedRole?.question}
                      </h2>
                      <div className={styles.assetsGrid}>
                        {selectedRole?.type.map((type: RoleOption) => {
                          const field: "industries" | "assetTypes" =
                            isFleetManager || isOther
                              ? "industries"
                              : "assetTypes";
                          return (
                             <div
                               key={type.id}
                               className={`${styles.assetCard} ${formData[field].includes(type.id) ? styles.selected : ""} ${type.title.toLowerCase().includes('other') ? styles.otherRole : ""}`}
                               onClick={() => handleTypeToggle(type.id, field)}
                             >
                               {type.iconUrl ? (
                                 <img src={type.iconUrl} alt={type.title} className={styles.cardIconImg} />
                               ) : (
                                 <i className={`${type.icon} ${styles.cardIcon}`} />
                               )}
                              <span className={styles.cardTitle}>
                                {type.title}
                              </span>
                            </div>
                          );
                        })}
                      </div>

                      {!isOther && (
                        <>
                          <div className={styles.divider}></div>

                          <h2 className={styles.stepTitle}>
                            {selectedRole?.volumeQuestion}
                          </h2>
                          <div className={styles.volumeGrid}>
                            {(selectedRole?.volumeOptions ?? []).map((v) => {
                              const field = isFleetManager
                                ? "fleetSize"
                                : "productionVolume";
                              return (
                                <div
                                  key={v.id}
                                  className={`${styles.volumeCard} ${formData[field] === v.id ? styles.selected : ""}`}
                                  onClick={() =>
                                    updateFormData({ [field]: v.id })
                                  }
                                >
                                  <span className={styles.cardVolumeTitle}>
                                    {v.title}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        </>
                      )}

                      <div className={styles.actions}>
                        <button className="secondaryCta" onClick={handleBack}>
                          {stepTwoBackText}
                        </button>
                        <button
                          className="primaryCta"
                          onClick={handleNext}
                        >
                          {stepTwoNextText}
                        </button>
                      </div>
                      {step === 2 && errorMessage && <p className={styles.stepError}>{errorMessage}</p>}
                    </div>
                  )}

                  {step === 3 && !submitted && (
                    <form
                      ref={formRef}
                      id="zcampaignOptinForm"
                      action="https://krew-zgp4.maillist-manage.in/weboptin.zc"
                      method="POST"
                      onSubmit={handleSubmit}
                      noValidate
                      className={styles.stepWrapper}
                    >
                      <h2
                        className={styles.stepTitle}
                        dangerouslySetInnerHTML={{
                          __html: stepThreeFormHeading,
                        }}
                      />

                      <input
                        type="hidden"
                        id="signupTmplName"
                        name="signupTmplName"
                        value="large_form_1"
                      />
                      <input
                        type="hidden"
                        id="recapThemeOptin"
                        name="recapThemeOptin"
                        value="0"
                      />
                      <input
                        type="hidden"
                        id="orgNameFull"
                        name="orgNameFull"
                        value="Datakrew"
                      />
                      <input
                        type="hidden"
                        id="recapTheme"
                        name="recapTheme"
                        value="0"
                      />
                      <input
                        type="hidden"
                        id="isRecapIntegDone"
                        name="isRecapIntegDone"
                        value="false"
                      />
                      <input
                        type="hidden"
                        id="signupFormType"
                        name="signupFormType"
                        value="LargeForm_Vertical"
                      />
                      <input
                        type="hidden"
                        id="recapModeTheme"
                        name="recapModeTheme"
                        value=""
                      />
                      <input
                        type="hidden"
                        id="signupFormMode"
                        name="signupFormMode"
                        value=""
                      />
                      <input
                        type="hidden"
                        id="fieldBorder"
                        name="fieldBorder"
                        value="rgb(222, 222, 222)"
                      />
                      <input
                        type="hidden"
                        id="zc_trackCode"
                        name="zc_trackCode"
                        value=""
                      />
                      <input
                        type="hidden"
                        id="viewFrom"
                        name="viewFrom"
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
                        id="emailReportId"
                        name="emailReportId"
                        value=""
                      />
                      <input
                        type="hidden"
                        id="cmpZuid"
                        name="zx"
                        value="1dfba104ec"
                      />
                      <input type="hidden" name="zcvers" value="2.0" />
                      <input
                        type="hidden"
                        id="allCheckedListIds"
                        name="oldListIds"
                        value=""
                      />
                      <input
                        type="hidden"
                        id="mode"
                        name="mode"
                        value="OptinCreateView"
                      />
                      <input type="hidden" id="zcld" name="zcld" value="" />
                      <input
                        type="hidden"
                        id="zctd"
                        name="zctd"
                        value="142d4d88c9c9b219"
                      />
                      <input
                        type="hidden"
                        id="document_domain"
                        name="document_domain"
                        value="ma.zoho.in"
                      />
                      <input
                        type="hidden"
                        id="zc_Url"
                        name="zc_Url"
                        value="krew-zgp4.maillist-manage.in"
                      />
                      <input
                        type="hidden"
                        id="new_optin_response_in"
                        name="new_optin_response_in"
                        value="0"
                      />
                      <input
                        type="hidden"
                        id="duplicate_optin_response_in"
                        name="duplicate_optin_response_in"
                        value="0"
                      />
                      <input
                        type="hidden"
                        id="zc_formIx"
                        name="zc_formIx"
                        value="3z7b595db7c8b418a4c5bba6280ede75146848967349774a95520cf5ac74cb6197"
                      />
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
                      <input
                        type="hidden"
                        name="isCaptchaNeeded"
                        id="isCaptchaNeeded"
                        value="false"
                      />
                      <input
                        type="hidden"
                        name="superAdminCap"
                        id="superAdminCap"
                        value="0"
                      />

                      {/* Hidden UTM fields matching Zoho snippet structure */}
                      <input type="hidden" name="CONTACT_CF1" value="Website" />
                      <input type="hidden" name="CONTACT_CF2" value="Organic" />
                      <input
                        type="hidden"
                        name="CONTACT_CF3"
                        value="website-form"
                      />
                      <input type="hidden" name="CONTACT_CF4" value="none" />
                      <input type="hidden" name="CONTACT_CF5" value="website" />
                      <input type="hidden" name="CONTACT_CF6" value="none" />

                      <input
                        type="hidden"
                        name="LEAD_INFO15"
                        value={
                          isOther
                            ? "Other"
                            : selectedRole?.title || formData.role
                        }
                      />
                      {/* Industry hidden field (CONTACT_CF12) populated for Fleet Manager and Other */}
                      <input
                        type="hidden"
                        name="CONTACT_CF12"
                        value={
                          isFleetManager || isOther
                            ? formData.industries.join(", ")
                            : ""
                        }
                      />

                      {/* Asset Type hidden field (CONTACT_CF31) populated only for OEM */}
                      <input
                        type="hidden"
                        name="CONTACT_CF31"
                        value={isOEM ? formData.assetTypes.join(", ") : ""}
                      />

                      {/* Production Volume hidden field (CONTACT_CF32) populated only for OEM */}
                      <input
                        type="hidden"
                        name="CONTACT_CF32"
                        value={isOEM ? formData.productionVolume : ""}
                      />

                      {/* Fleet Size hidden field (CONTACT_CF15) */}
                      <input
                        type="hidden"
                        name="CONTACT_CF15"
                        value={isFleetManager ? formData.fleetSize : ""}
                      />

                      <div className={styles.inputRows}>
                        <div className={styles.inputGroup}>
                          <label>First name<span className={styles.required}>*</span></label>
                          <div className={styles.inputBox}>
                            <input
                              type="text"
                              name="FIRSTNAME"
                              placeholder="Enter your first name"
                              required
                              maxLength={50}
                              value={formData.firstName}
                              onChange={(e) =>
                                updateFormData({
                                  firstName: e.target.value.replace(
                                    /[^a-zA-Z\s-]/g,
                                    "",
                                  ),
                                })
                              }
                            />
                            {errors.firstName && (
                              <span className={styles.fieldError}>
                                This field is required
                              </span>
                            )}
                          </div>
                        </div>
                        <div className={styles.inputGroup}>
                          <label>Last name<span className={styles.required}>*</span></label>
                          <div className={styles.inputBox}>
                            <input
                              type="text"
                              name="LASTNAME"
                              placeholder="Enter your last name"
                              required
                              maxLength={50}
                              value={formData.lastName}
                              onChange={(e) =>
                                updateFormData({
                                  lastName: e.target.value.replace(
                                    /[^a-zA-Z\s-]/g,
                                    "",
                                  ),
                                })
                              }
                            />
                            {errors.lastName && (
                              <span className={styles.fieldError}>
                                This field is required
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className={styles.inputRows}>
                        <div className={styles.inputGroup}>
                          <label>Work email<span className={styles.required}>*</span></label>
                          <div className={styles.inputBox}>
                            <input
                              type="email"
                              name="CONTACT_EMAIL"
                              placeholder="Enter your work email address"
                              required
                              value={formData.email}
                              onChange={(e) =>
                                updateFormData({ email: e.target.value })
                              }
                            />
                            {errors.email && (
                              <span className={styles.fieldError}>
                                This field is required
                              </span>
                            )}
                          </div>
                        </div>
                        <div className={styles.inputGroup}>
                          <label>Phone number (optional)</label>
                          <div className={styles.inputBox}>
                            <input
                              type="tel"
                              name="PHONE"
                              placeholder="Enter phone number"
                              pattern="[+]?[0-9]*"
                              maxLength={15}
                              value={formData.phone}
                              onChange={(e) =>
                                updateFormData({
                                  phone: e.target.value
                                    .replace(/[^0-9+]/g, "")
                                    .slice(0, 15),
                                })
                              }
                            />
                          </div>
                        </div>
                      </div>

                      <div className={styles.inputRows}>
                        <div className={styles.inputGroup}>
                          <label>Company name<span className={styles.required}>*</span></label>
                          <div className={styles.inputBox}>
                            <input
                              type="text"
                              name="COMPANYNAME"
                              placeholder="Enter company name"
                              required
                              value={formData.companyName}
                              onChange={(e) =>
                                updateFormData({ companyName: e.target.value })
                              }
                            />
                            {errors.companyName && (
                              <span className={styles.fieldError}>
                                This field is required
                              </span>
                            )}
                          </div>
                        </div>
                        <div className={styles.inputGroup}>
                          <label>Job title<span className={styles.required}>*</span></label>
                          <div className={styles.inputBox}>
                            <input
                              type="text"
                              name="JOB_TITLE"
                              placeholder="Enter job title"
                              required
                              value={formData.jobTitle}
                              onChange={(e) =>
                                updateFormData({ jobTitle: e.target.value })
                              }
                            />
                            {errors.jobTitle && (
                              <span className={styles.fieldError}>
                                This field is required
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className={styles.inputGroup}>
                        <label>Company location<span className={styles.required}>*</span></label>
                        <div className={styles.inputBox}>
                          <input
                            list="countries"
                            name="CONTACT_CF14"
                            placeholder="Type to search country..."
                            required
                            value={formData.location}
                            onChange={(e) =>
                              updateFormData({ location: e.target.value })
                            }
                          />
                          <datalist id="countries">
                            {COUNTRIES.map((country) => (
                              <option key={country.code} value={country.name} />
                            ))}
                          </datalist>
                          {errors.location && (
                            <span className={styles.fieldError}>
                              This field is required
                            </span>
                          )}
                        </div>
                      </div>

                      <div className={styles.inputGroup}>
                        <label>
                          Anything you&apos;d like us to know (optional):
                        </label>
                        <textarea
                          name="CONTACT_CF13"
                          placeholder="Leave a message to us"
                          rows={4}
                          value={formData.message}
                          onChange={(e) =>
                            updateFormData({ message: e.target.value })
                          }
                        />
                      </div>

                      <div className={styles.checkboxGroup}>
                        <div className={styles.inputBox}>
                          <div className={styles.checkboxInner}>
                            <input
                              type="checkbox"
                              id="terms"
                              name="PRIVACY_POLICY"
                              value="PRIVACY_AGREED"
                              required
                              checked={formData.agreeToTerms}
                              onChange={(e) =>
                                updateFormData({
                                  agreeToTerms: e.target.checked,
                                })
                              }
                            />
                            <label htmlFor="terms">
                              By submitting, you agree to DataKrew’s{" "}
                              <Link href="/termsandconditions">Terms & Conditions</Link>
                              {" "}and{" "}
                              <Link href="/privacy-policy">Privacy Policy</Link>.
                            </label>
                          </div>
                          {errors.agreeToTerms && (
                            <span className={styles.fieldError}>
                              You must agree to terms
                            </span>
                          )}
                        </div>
                      </div>

                      <div className={styles.actions}>
                        <button
                          type="button"
                          className="secondaryCta"
                          onClick={handleBack}
                          disabled={submitting}
                        >
                          {stepThreeBackText}
                        </button>
                        <button
                          type="submit"
                          className="primaryCta"
                          disabled={submitting}
                        >
                          {submitting ? "Submitting..." : stepThreeSubmitText}
                        </button>
                      </div>
                      {errorMessage && (
                        <p className={styles.stepError}>{errorMessage}</p>
                      )}
                    </form>
                  )}
                </div>
                <div className={styles.orContainer}>
                  <div className="container">
                    <span>Or</span>
                  </div>
                </div>
                {/* Calendly Inline Widget */}
                <div className={styles.calendlySection}>
                  <div className="container">
                    <div className={styles.calendlyContainer}>
                      <div
                        ref={calendlyRef}
                        className="calendly-inline-widget"
                        data-url={`${process.env.NEXT_PUBLIC_CALENDLY_URL}?background_color=101215&primary_color=9be36d&text_color=ffffff`}
                        style={{ minWidth: "320px", height: "700px" }}
                        data-auto-load="false"
                      />
                    </div>
                    <Script
                      src="https://assets.calendly.com/assets/external/widget.js"
                      strategy="afterInteractive"
                      onReady={() => {
                        const w = typeof window !== "undefined" ? window : null;
                        if (w && "Calendly" in w && calendlyRef.current) {
                          (
                            w as Window & {
                              Calendly: {
                                initInlineWidget: (opts: object) => void;
                              };
                            }
                          ).Calendly.initInlineWidget({
                            url: `${process.env.NEXT_PUBLIC_CALENDLY_URL}?background_color=101215&primary_color=9be36d&text_color=ffffff`,
                            parentElement: calendlyRef.current,
                            prefill: {},
                            utm: {},
                            pageSettings: {
                              backgroundColor: "101215",
                              hideEventTypeDetails: false,
                              hideLandingPageDetails: false,
                              primaryColor: "9BE36D",
                              textColor: "ffffff",
                            },
                          });
                        }
                      }}
                    />
                  </div>
                </div>
              </>
            )}
          </div>
        </section>
      </div>

    </div>
  );
}
