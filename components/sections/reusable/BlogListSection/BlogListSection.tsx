"use client";

import { useState, useRef, useEffect } from "react";
import Filters from "@/components/ui/Filters/Filters";
import Pagination from "@/components/ui/Pagination/Pagination";
import BlogCard from "@/components/ui/BlogCard/BlogCard";
import styles from "./BlogListSection.module.css";

interface BlogListSectionProps {
  posts: any[];
  isSearch?: boolean;
  isCategory?: boolean;
  isSort?: boolean;
  heading?: string;
  headingHighlight?: string;
  categoryLabel?: string;
  sortLabel?: string;
  categories?: string[];
  industries?: string[];
  regions?: string[];
  sortOptions?: string[];
  categoryStyle?: "bubble" | "text";
  noResultsMessage?: React.ReactNode;
  children?: React.ReactNode;
}


export default function BlogListSection({
  posts,
  isSearch = true,
  isCategory = true,
  isSort = true,
  heading,
  headingHighlight,
  categories,
  industries = [],
  regions = [],
  categoryStyle = "bubble",
  noResultsMessage,
  children
}: BlogListSectionProps) {


  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(6);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [industryFilter, setIndustryFilter] = useState("");
  const [regionFilter, setRegionFilter] = useState("");
  const [sortOption, setSortOption] = useState("");

  const sectionRef = useRef<HTMLDivElement>(null);

  // Debounce search query to prevent excessive re-renders and jitter
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 400); // 400ms delay
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const filteredPosts = posts.filter(post => {
    const matchesSearch = !debouncedSearchQuery ||
      post.title.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
      (post.excerpt?.toLowerCase().includes(debouncedSearchQuery.toLowerCase()));

    const matchesCategory = !categoryFilter || post.category === categoryFilter;

    // For case studies specifically, we handle industry and region
    const matchesIndustry = !industryFilter || (post.industries && post.industries.some((i: string) => i === industryFilter));
    const matchesRegion = !regionFilter || (post.region && post.region.some((r: string) => r === regionFilter));

    return matchesSearch && matchesCategory && matchesIndustry && matchesRegion;
  });

  const sortedPosts = [...filteredPosts].sort((a, b) => {
    if (sortOption === "Latest" || sortOption === "Oldest") {
      const dateA = new Date(a.rawDate || a.date).getTime() || 0;
      const dateB = new Date(b.rawDate || b.date).getTime() || 0;
      return sortOption === "Latest" ? dateB - dateA : dateA - dateB;
    }
    return 0;
  });

  // Calculate the index of the first and last item on the current page
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  // Get current items
  const currentItems = sortedPosts.slice(indexOfFirstItem, indexOfLastItem);

  const scrollToTop = () => {
    if (sectionRef.current) {
      const yOffset = -140; // Offset for fixed header
      const rect = sectionRef.current.getBoundingClientRect();
      const elementTop = rect.top + window.scrollY;
      window.scrollTo({ top: elementTop + yOffset, behavior: "smooth" });
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    scrollToTop();
  };

  const handleItemsPerPageChange = (size: number) => {
    setItemsPerPage(size);
    setCurrentPage(1);
    scrollToTop();
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
    // Note: We don't call scrollToTop here to prevent the page from jumping while typing.
    // The debouncedSearchQuery update will refresh the list.
  };

  const handleCategoryChange = (cat: string) => {
    setCategoryFilter(cat);
    setCurrentPage(1);
    scrollToTop();
  };

  const handleIndustryChange = (val: string) => {
    setIndustryFilter(val);
    setCurrentPage(1);
    scrollToTop();
  };

  const handleRegionChange = (val: string) => {
    setRegionFilter(val);
    setCurrentPage(1);
    scrollToTop();
  };

  const handleSortChange = (sort: string) => {
    setSortOption(sort);
    setCurrentPage(1);
    scrollToTop();
  };

  const extraFilters = [];
  if (industries.length > 0) {
    extraFilters.push({ label: "Industry", options: industries, onChange: handleIndustryChange, selected: industryFilter });
  }
  if (regions.length > 0) {
    extraFilters.push({ label: "Region", options: regions, onChange: handleRegionChange, selected: regionFilter });
  }

  return (
    <section className={styles.blogListSection}>
      <div className="container" ref={sectionRef}>
        {(heading || headingHighlight) && (
          <h2
            className={`sectionTitle ${styles.sectionHeading}`}
            dangerouslySetInnerHTML={{
              __html: heading
                ? headingHighlight &&
                  heading.toLowerCase().includes(headingHighlight.toLowerCase())
                  ? `${heading}`.replace(
                    new RegExp(
                      `(${headingHighlight.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`,
                      "gi",
                    ),
                    "<span>$1</span>",
                  )
                  : `${heading ?? ""} <span>${headingHighlight}</span>`
                : (headingHighlight ? `<span>${headingHighlight}</span>` : ""),
            }}
          />
        )}
        <Filters
          isSearch={isSearch}
          isCategory={isCategory}
          isSort={isSort}
          categories={categories}
          onSearch={handleSearch}
          onCategoryChange={handleCategoryChange}
          onSortChange={handleSortChange}
          extraFilters={extraFilters}
        />

        {children}
        {currentItems.length > 0 ? (
          <div className={styles.blogFlex}>
            {currentItems.map((post: any, index: number) => (
              <BlogCard
                key={`${post.id}-${indexOfFirstItem + index}`}
                {...post}
                categoryStyle={categoryStyle}
              />
            ))}
          </div>
        ) : (
          <div className={styles.noResults}>
            {noResultsMessage || (
              <p>Uh-oh!! We couldn't find any resources matching your search.</p>
            )}
          </div>
        )}
        <Pagination
          totalItems={sortedPosts.length}
          itemsPerPage={itemsPerPage}
          currentPage={currentPage}
          onPageChange={handlePageChange}
          onItemsPerPageChange={handleItemsPerPageChange}
        />
      </div>
    </section>
  );
}
