"use client";

import { useState, useRef, useEffect } from "react";
import styles from "./Filters.module.css";

interface FilterGroup {
  label: string;
  options: string[];
  onChange: (value: string) => void;
  selected?: string;
}

interface FiltersProps {
  isSearch?: boolean;
  isCategory?: boolean;
  isSort?: boolean;
  onSearch?: (value: string) => void;
  onCategoryChange?: (category: string) => void;
  onSortChange?: (sort: string) => void;
  categories?: string[];
  categoryLabel?: string;
  searchPlaceholder?: string;
  extraFilters?: FilterGroup[];
}

const SORT_OPTIONS = ["All", "Latest", "Oldest"];

export default function Filters({
  isSearch = true,
  isCategory = true,
  isSort = true,
  onSearch,
  onCategoryChange,
  onSortChange,
  categories,
  categoryLabel = "All Categories",
  searchPlaceholder = "Search",
  extraFilters = []
}: FiltersProps) {
  const displayCategories = categories && categories.length > 0
    ? [categoryLabel, ...categories]
    : [];

  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(categoryLabel);

  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const [isSortOpen, setIsSortOpen] = useState(false);
  const [selectedSort, setSelectedSort] = useState("");
  const [searchValue, setSearchValue] = useState("");

  const handleSearchChange = (value: string) => {
    setSearchValue(value);
    onSearch?.(value);
  };

  const clearSearch = () => {
    setSearchValue("");
    onSearch?.("");
  };

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
        setIsSortOpen(false);
        setIsCategoryOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={styles.filters} ref={containerRef}>
      {isSearch &&
        <div className={styles.searchWrapper}>
          <i className={`fa-kit fa-magnifier ${styles.searchIcon}`}></i>
          <input
            type="text"
            placeholder={searchPlaceholder}
            className={styles.searchInput}
            value={searchValue}
            onChange={(e) => handleSearchChange(e.target.value)}
          />
          {searchValue && (
            <button
              className={styles.clearBtn}
              onClick={clearSearch}
              aria-label="Clear search"
            >
              <i className={`${styles.arrow} fa-kit fa-cross`} ></i>
            </button>
          )}
        </div>
      }

      <div className={styles.dropdownsGroup}>
        {isCategory &&
          <div className={`${styles.customSelectWrapper} ${styles.categoryWrapper}`}>
            <button
              className={styles.dropdownTrigger}
              onClick={() => {
                setIsCategoryOpen(!isCategoryOpen);
                setIsSortOpen(false);
                setActiveDropdown(null);
              }}
            >
              {selectedCategory}
              <i className={`fa-kit fa-dropdown ${styles.arrow} ${isCategoryOpen ? styles.arrowOpen : ""}`}></i>
            </button>
            {isCategoryOpen && (
              <div className={styles.dropdownPanel}>
                {displayCategories.map((cat: string) => (
                  <div
                    key={cat}
                    className={`${styles.dropdownOption} ${selectedCategory === cat ? styles.optionActive : ""}`}
                    onClick={() => {
                      setSelectedCategory(cat);
                      setIsCategoryOpen(false);
                      onCategoryChange?.(cat === categoryLabel ? "" : cat);
                    }}
                  >
                    {cat}
                  </div>
                ))}
              </div>
            )}
          </div>
        }

        {extraFilters.map((filter, idx) => (
          <div key={idx} className={styles.customSelectWrapper}>
            <button
              className={styles.dropdownTrigger}
              onClick={() => {
                setActiveDropdown(activeDropdown === filter.label ? null : filter.label);
                setIsCategoryOpen(false);
                setIsSortOpen(false);
              }}
            >
              {filter.selected || filter.label}
              <i className={`fa-kit fa-dropdown ${styles.arrow} ${activeDropdown === filter.label ? styles.arrowOpen : ""}`}></i>
            </button>
            {activeDropdown === filter.label && (
              <div className={styles.dropdownPanel}>
                {["All", ...filter.options].map((opt) => (
                  <div
                    key={opt}
                    className={`${styles.dropdownOption} ${(filter.selected === opt || (!filter.selected && opt === "All")) ? styles.optionActive : ""}`}
                    onClick={() => {
                      filter.onChange(opt === "All" ? "" : opt);
                      setActiveDropdown(null);
                    }}
                  >
                    {opt}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}

        {isSort &&
          <div className={styles.customSelectWrapper}>
            <button
              className={styles.dropdownTrigger}
              onClick={() => {
                setIsSortOpen(!isSortOpen);
                setIsCategoryOpen(false);
                setActiveDropdown(null);
              }}
            >
              {selectedSort || "Sort by"}
              <i className={`fa-kit fa-dropdown ${styles.arrow} ${isSortOpen ? styles.arrowOpen : ""}`}></i>
            </button>
            {isSortOpen && (
              <div className={styles.dropdownPanel}>
                {SORT_OPTIONS.map((opt) => (
                  <div
                    key={opt}
                    className={`${styles.dropdownOption} ${(!selectedSort && opt === "All") || selectedSort === opt ? styles.optionActive : ""}`}
                    onClick={() => {
                      const val = opt === "All" ? "" : opt;
                      setSelectedSort(val);
                      setIsSortOpen(false);
                      onSortChange?.(val);
                    }}
                  >
                    {opt}
                  </div>
                ))}
              </div>
            )}
          </div>
        }
      </div>
    </div>
  );
}
