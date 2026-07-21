"use client";

import React, { useState, useRef, useEffect } from "react";
import styles from "./JobFilters.module.css";

interface JobFiltersProps {
  onSearch?: (value: string) => void;
  onLocationChange?: (value: string) => void;
  onExperienceChange?: (value: string) => void;
  onTypeChange?: (value: string) => void;
  onSortChange?: (value: string) => void;
  locations?: string[];
  experienceLevels?: string[];
  jobTypes?: string[];
}

const SORT_OPTIONS = ["Newest", "Oldest", "A-Z", "Z-A"];

const JobFilters: React.FC<JobFiltersProps> = ({
  onSearch,
  onLocationChange,
  onExperienceChange,
  onTypeChange,
  onSortChange,
  locations = ["All Locations"],
  experienceLevels = ["All Experience"],
  jobTypes = ["All Types"],
}) => {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [selections, setSelections] = useState({
    location: "Location",
    experience: "Years of experience",
    type: "Job type",
    sort: "Sort by",
  });

  const filterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent | TouchEvent) {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setOpenDropdown(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, []);

  const toggleDropdown = (name: string) => {
    setOpenDropdown(openDropdown === name ? null : name);
  };

  const handleSelect = (name: keyof typeof selections, value: string, callback?: (v: string) => void) => {
    setSelections((prev) => ({ ...prev, [name]: value }));
    setOpenDropdown(null);
    callback?.(value);
  };

  return (
    <div className={styles.filtersContainer} ref={filterRef}>
      <div className={styles.searchWrapper}>
        <i className={`fa-kit fa-magnifier ${styles.searchIcon}`}></i>
        <input
          type="text"
          placeholder="Search for job title"
          className={styles.searchInput}
          onChange={(e) => onSearch?.(e.target.value)}
        />
      </div>

      <div className={styles.dropdownsGroup}>
        {/* Location Dropdown */}
        <div className={styles.dropdownWrapper}>
          <button className={styles.dropdownTrigger} onClick={() => toggleDropdown("location")}>
            {selections.location}
            <i className={`${styles.arrow} fa-kit fa-dropdown ${openDropdown === "location" ? styles.arrowOpen : ""}`}></i>
          </button>
          {openDropdown === "location" && (
            <div className={styles.dropdownMenu}>
              {locations.map((loc) => (
                <div
                  key={loc}
                  className={`${styles.dropdownItem} ${selections.location === loc ? styles.optionActive : ""}`}
                  onClick={() => handleSelect("location", loc, onLocationChange)}
                >
                  {loc}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Experience Dropdown */}
        <div className={styles.dropdownWrapper}>
          <button className={styles.dropdownTrigger} onClick={() => toggleDropdown("experience")}>
            {selections.experience}
            <i className={`${styles.arrow} fa-kit fa-dropdown ${openDropdown === "experience" ? styles.arrowOpen : ""}`}></i>
          </button>
          {openDropdown === "experience" && (
            <div className={styles.dropdownMenu}>
              {experienceLevels.map((exp) => (
                <div
                  key={exp}
                  className={`${styles.dropdownItem} ${selections.experience === exp ? styles.optionActive : ""}`}
                  onClick={() => handleSelect("experience", exp, onExperienceChange)}
                >
                  {exp}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Job Type Dropdown */}
        <div className={styles.dropdownWrapper}>
          <button className={styles.dropdownTrigger} onClick={() => toggleDropdown("type")}>
            {selections.type}
            <i className={`${styles.arrow} fa-kit fa-dropdown ${openDropdown === "type" ? styles.arrowOpen : ""}`}></i>
          </button>
          {openDropdown === "type" && (
            <div className={styles.dropdownMenu}>
              {jobTypes.map((type) => (
                <div
                  key={type}
                  className={`${styles.dropdownItem} ${selections.type === type ? styles.optionActive : ""}`}
                  onClick={() => handleSelect("type", type, onTypeChange)}
                >
                  {type}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Sort Dropdown */}
        <div className={styles.dropdownWrapper}>
          <button className={styles.dropdownTrigger} onClick={() => toggleDropdown("sort")}>
            {selections.sort}
            <i className={`${styles.arrow} fa-kit fa-dropdown ${openDropdown === "sort" ? styles.arrowOpen : ""}`}></i>
          </button>
          {openDropdown === "sort" && (
            <div className={styles.dropdownMenu}>
              {SORT_OPTIONS.map((opt) => (
                <div
                  key={opt}
                  className={`${styles.dropdownItem} ${selections.sort === opt ? styles.optionActive : ""}`}
                  onClick={() => handleSelect("sort", opt, onSortChange)}
                >
                  {opt}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobFilters;
