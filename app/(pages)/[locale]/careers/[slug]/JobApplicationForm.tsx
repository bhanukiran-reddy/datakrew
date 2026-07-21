"use client";

import React, { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import styles from "./jobApplicationForm.module.css";
import Link from "next/link";
import FileUploadInput from "@/components/ui/FileUploadInput/FileUploadInput";
import { getDefaultLocaleSync } from "@/lib/config/locales";
import { localizedPath } from "@/lib/utils/slugUtils";

interface JobApplicationFormProps {
  jobTitle?: string;
  mode?: "full" | "mini";
}

interface FormState {
  fullName: string;
  email: string;
  phone: string;  
  experience: string;
  currentCTC: string;
  expectedCTC: string;
  joiningPeriod: string;
  linkedin: string;
  resume: File | null;
  coverLetter: File | null;
  agreeToTerms: boolean;
}

const JobApplicationForm: React.FC<JobApplicationFormProps> = ({
  jobTitle = "General Application",
  mode = "full"
}) => {
  const [formData, setFormData] = useState<FormState>({
    fullName: "",
    email: "",
    phone: "",
    experience: "",
    currentCTC: "",
    expectedCTC: "",
    joiningPeriod: "",
    linkedin: "",
    resume: null,
    coverLetter: null,
    agreeToTerms: false,
  });

  const router = useRouter();
  const params = useParams();
  const locale =
    typeof params.locale === "string" ? params.locale : getDefaultLocaleSync();
  const slug = typeof params.slug === "string" ? params.slug : "";
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    // Clear error when user types
    if (errors[name as keyof FormState]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validate = () => {
    const newErrors: Partial<Record<keyof FormState, string>> = {};
    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (mode === "full") {
      if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
      if (!formData.experience.trim()) newErrors.experience = "Experience is required";
      if (!formData.currentCTC.trim()) newErrors.currentCTC = "Current CTC is required";
      if (!formData.expectedCTC.trim()) newErrors.expectedCTC = "Expected CTC is required";
      if (!formData.joiningPeriod.trim()) newErrors.joiningPeriod = "Joining period is required";
      if (!formData.linkedin.trim()) newErrors.linkedin = "LinkedIn profile is required";
      if (!formData.agreeToTerms) newErrors.agreeToTerms = "You must accept the terms";
    }

    if (!formData.resume) newErrors.resume = "Resume is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setServerError("");

    try {
      const CF7_FORM_ID = "4340";
      const unitTag = `wpcf7-f${CF7_FORM_ID}-p0-o1`;

      const submissionData = new FormData();

      // Required Contact Form 7 metadata
      submissionData.append("_wpcf7", CF7_FORM_ID);
      submissionData.append("_wpcf7_unit_tag", unitTag);
      submissionData.append("_wpcf7_container_post", "0");
      submissionData.append("_wpcf7_version", "5.9.3");
      submissionData.append("_wpcf7_locale", "en_US");

      // Field mapping
      submissionData.append("fullname", formData.fullName.trim());
      submissionData.append("email", formData.email.trim());
      submissionData.append("your-phone", formData.phone.trim() || "");
      submissionData.append("experience-years", formData.experience || "");
      submissionData.append("current-ctc", formData.currentCTC || "");
      submissionData.append("expected-ctc", formData.expectedCTC || "");
      submissionData.append("join-days", formData.joiningPeriod || "");
      submissionData.append("linkedin-profile", formData.linkedin.trim() || "");
      submissionData.append("job-title", jobTitle.trim());

      submissionData.append("_wpcf7_is_ajax_call", "1");

      if (formData.resume) {
        submissionData.append("resume", formData.resume);
      }
      if (formData.coverLetter) {
        submissionData.append("coverletter", formData.coverLetter);
      }

      const response = await fetch(
        `https://staging-api.datakrew.com/wp-json/contact-form-7/v1/contact-forms/${CF7_FORM_ID}/feedback`,
        {
          method: "POST",
          headers: {
            "Accept": "application/json",
          },
          body: submissionData,
        }
      );

      const result = await response.json();

      if (result.status === "mail_sent" || result.status === "mail_failed") {
        if (mode === "full" && slug) {
          router.push(localizedPath(locale, `/careers/${slug}/thank-you`));
        } else {
          router.push(localizedPath(locale, "/careers/thank-you"));
        }
      } else if (result.status === "validation_failed") {
        const apiErrors: Partial<Record<keyof FormState, string>> = {};
        let detailedError = result.message || "Validation failed.";

        if (result.invalid_fields && result.invalid_fields.length > 0) {
          detailedError += " Fields with errors: " + result.invalid_fields.map((f: any) => `${f.field}: ${f.message}`).join(", ");
        }

        result.invalid_fields?.forEach((err: any) => {
          if (err.field === "fullname") apiErrors.fullName = err.message;
          if (err.field === "email") apiErrors.email = err.message;
          if (err.field === "your-phone") apiErrors.phone = err.message;
          if (err.field === "experience-years") apiErrors.experience = err.message;
          if (err.field === "current-ctc") apiErrors.currentCTC = err.message;
          if (err.field === "expected-ctc") apiErrors.expectedCTC = err.message;
          if (err.field === "join-days") apiErrors.joiningPeriod = err.message;
          if (err.field === "linkedin-profile") apiErrors.linkedin = err.message;
          if (err.field === "resume") apiErrors.resume = err.message;
          if (err.field === "coverletter") apiErrors.coverLetter = err.message;
        });
        setErrors(apiErrors);
        setServerError(detailedError);
      } else {
        setServerError(result.message || "Submission failed. Status: " + result.status);
      }
    } catch (err) {
      setServerError(err instanceof Error ? err.message : String(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className={styles.successMessage}>
        <h2 className={styles.successHeadline}>Application <span>Sent Successfully!</span></h2>
        <p className={styles.successSubheadline}>Thank you for your interest in Datakrew. Our team will review your profile and get back to you soon.</p>
      </div>
    );
  }

  return (
    <div className={styles.formBlock}>
      <form onSubmit={handleSubmit} noValidate className={mode === "mini" ? styles.miniForm : ""}>
        <div className={styles.formGroup}>
          <div className={styles.fieldGroup}>
            <label htmlFor="fullName" className={styles.fieldLabelText}>Full name <span>*</span></label>
            <div className={styles.inputBox}>
              <input
                id="fullName"
                type="text"
                name="fullName"
                placeholder="Enter your full name"
                value={formData.fullName}
                onChange={handleChange}
                required
              />
              {errors.fullName && <p className={styles.errorMsg}>{errors.fullName}</p>}
            </div>
          </div>
          <div className={styles.fieldGroup}>
            <label htmlFor="email" className={styles.fieldLabelText}>Email <span>*</span></label>
            <div className={styles.inputBox}>
              <input
                id="email"
                type="email"
                name="email"
                placeholder="Enter your email address"
                value={formData.email}
                onChange={handleChange}
                required
              />
              {errors.email && <p className={styles.errorMsg}>{errors.email}</p>}
            </div>
          </div>

          {mode === "full" && (
            <>
              <div className={styles.fieldGroup}>
                <label htmlFor="phone" className={styles.fieldLabelText}>Phone number <span>*</span></label>
                <div className={styles.inputBox}>
                  <input
                    id="phone"
                    type="tel"
                    name="phone"
                    placeholder="Enter your phone number"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                  {errors.phone && <p className={styles.errorMsg}>{errors.phone}</p>}
                </div>
              </div>
              <div className={styles.fieldGroup}>
                <label htmlFor="experience" className={styles.fieldLabelText}>Experience in years <span>*</span></label>
                <div className={styles.inputBox}>
                  <input
                    id="experience"
                    type="number"
                    name="experience"
                    placeholder="Total years of experience"
                    value={formData.experience}
                    onChange={handleChange}
                  />
                  {errors.experience && <p className={styles.errorMsg}>{errors.experience}</p>}
                </div>
              </div>

              <div className={styles.fieldGroup}>
                <label htmlFor="currentCTC" className={styles.fieldLabelText}>Current CTC (in LPA) <span>*</span></label>
                <div className={styles.inputBox}>
                  <input
                    id="currentCTC"
                    type="number"
                    name="currentCTC"
                    placeholder="e.g. 8.5"
                    value={formData.currentCTC}
                    onChange={handleChange}
                  />
                  {errors.currentCTC && <p className={styles.errorMsg}>{errors.currentCTC}</p>}
                </div>
              </div>
              <div className={styles.fieldGroup}>
                <label htmlFor="expectedCTC" className={styles.fieldLabelText}>Expected CTC (in LPA) <span>*</span></label>
                <div className={styles.inputBox}>
                  <input
                    id="expectedCTC"
                    type="number"
                    name="expectedCTC"
                    placeholder="e.g. 12"
                    value={formData.expectedCTC}
                    onChange={handleChange}
                  />
                  {errors.expectedCTC && <p className={styles.errorMsg}>{errors.expectedCTC}</p>}
                </div>
              </div>

              <div className={styles.fieldGroup}>
                <label htmlFor="joiningPeriod" className={styles.fieldLabelText}>Available to join (in days) <span>*</span></label>
                <div className={styles.inputBox}>
                  <input
                    id="joiningPeriod"
                    type="number"
                    name="joiningPeriod"
                    placeholder="e.g. 30"
                    value={formData.joiningPeriod}
                    onChange={handleChange}
                  />
                  {errors.joiningPeriod && <p className={styles.errorMsg}>{errors.joiningPeriod}</p>}
                </div>
              </div>
              <div className={styles.fieldGroup}>
                <label htmlFor="linkedin" className={styles.fieldLabelText}>LinkedIn profile <span>*</span></label>
                <div className={styles.inputBox}>
                  <input
                    id="linkedin"
                    type="url"
                    name="linkedin"
                    placeholder="https://linkedin.com/in/username"
                    value={formData.linkedin}
                    onChange={handleChange}
                  />
                  {errors.linkedin && <p className={styles.errorMsg}>{errors.linkedin}</p>}
                </div>
              </div>
            </>
          )}

          <div className={mode === "full" ? styles.fieldGroup : styles.fieldGroupFull}>
            <div className={styles.fileUploadWrapper}>
              <FileUploadInput
                id="resume"
                placeholder="Upload your resume or drag and drop it here *"
                onFileSelect={(file) => setFormData(prev => ({ ...prev, resume: file }))}
              />
              {errors.resume && <p className={styles.errorMsg}>{errors.resume}</p>}
            </div>
          </div>
          {mode === "full" && (
            <div className={styles.fieldGroup}>
              <div className={styles.fileUploadWrapper}>
                <FileUploadInput
                  id="coverLetter"
                  placeholder="Upload your cover letter or drag and drop it here"
                  onFileSelect={(file) => setFormData(prev => ({ ...prev, coverLetter: file }))}
                />
                {errors.coverLetter && <p className={styles.errorMsg}>{errors.coverLetter}</p>}
              </div>
            </div>
          )}
        </div>

        {mode === "full" && (
          <div className={styles.checkboxGroup}>
            <div className={styles.checkboxInner}>
              <input
                type="checkbox"
                id="agreeToTerms"
                name="agreeToTerms"
                checked={formData.agreeToTerms}
                onChange={handleChange}
              />
              <label htmlFor="agreeToTerms" className={styles.checkboxLabel}>
                By applying, you hereby accept Datakrew’s <Link className={styles.termsLink} href="/termsandconditions">Terms and Conditions</Link> and <Link className={styles.termsLink} href="/privacy-policy">Privacy Policy</Link>
              </label>
            </div>
            {errors.agreeToTerms && <p className={styles.errorMsg}>{errors.agreeToTerms}</p>}
          </div>
        )}

        <div className={styles.submitBtnWrapper}>
          <button
            type="submit"
            className="primaryCta"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : (mode === "mini" ? "Submit now" : "Apply now")}
            {!isSubmitting && mode === "mini" && <i className="icon fa-kit fa-right-arrow" style={{ marginLeft: '8px' }}></i>}
          </button>
        </div>

        {serverError && <p className={styles.formError}>{serverError}</p>}
      </form>
    </div>
  );
};

export default JobApplicationForm;
