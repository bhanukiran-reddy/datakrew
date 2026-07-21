"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
import styles from "./JobListingSection.module.css";
import JobFilters from "@/components/ui/JobFilters/JobFilters";
import JobCard, { JobCardProps } from "@/components/ui/JobCard/JobCard";
import Pagination from "@/components/ui/Pagination/Pagination";

interface JobListingSectionProps {
  title: string;
  jobs: JobCardProps[];
}

const JobListingSection: React.FC<JobListingSectionProps> = ({ title, jobs }) => {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [location, setLocation] = useState("All Locations");
  const [experience, setExperience] = useState("All Experience");
  const [type, setType] = useState("All Types");
  const [sort, setSort] = useState("Newest");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(6);

  const sectionRef = useRef<HTMLDivElement>(null);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setCurrentPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [search]);

  const scrollToTop = () => {
    if (sectionRef.current) {
      const yOffset = -140; // Space for fixed header
      const rect = sectionRef.current.getBoundingClientRect();
      const elementTop = rect.top + window.scrollY;
      window.scrollTo({ top: elementTop + yOffset, behavior: "smooth" });
    }
  };

  const locations = useMemo(() => {
    const unique = new Set<string>();
    const result: string[] = [];
    jobs.forEach(j => {
      const normalized = j.location.replace(/-/g, ' ').trim().toLowerCase();
      if (!unique.has(normalized)) {
        unique.add(normalized);
        result.push(j.location.trim());
      }
    });
    return ["All Locations", ...result.sort()];
  }, [jobs]);

  const experienceLevels = ["All Experience", "0-2 years", "3-5 years", "5-10 years", "10+ years"];


  const jobTypes = useMemo(() => {
    const unique = new Set<string>();
    const result: string[] = [];
    jobs.forEach(j => {
      const normalized = j.type.replace(/-/g, ' ').trim().toLowerCase();
      if (!unique.has(normalized)) {
        unique.add(normalized);
        result.push(j.type.trim());
      }
    });
    return ["All Types", ...result.sort()];
  }, [jobs]);

  const filteredJobs = useMemo(() => {
    const normalize = (s: string) => s.replace(/-/g, ' ').trim().toLowerCase();

    const matchExperience = (jobExp: string, filterExp: string) => {
      if (filterExp === "All Experience") return true;
      const jobNum = parseInt(jobExp.match(/\d+/)?.[0] || "0", 10);

      if (filterExp === "0-2 years") return jobNum <= 2;
      if (filterExp === "3-5 years") return jobNum >= 3 && jobNum <= 5;
      if (filterExp === "5-10 years") return jobNum >= 5 && jobNum <= 10;
      if (filterExp === "10+ years") return jobNum >= 10;
      return false;
    };

    let result = jobs.filter((job) => {
      const matchesSearch = job.title.toLowerCase().includes(debouncedSearch.toLowerCase());
      const matchesLocation = location === "All Locations" || normalize(job.location) === normalize(location);
      const matchesExperience = matchExperience(job.experience, experience);
      const matchesType = type === "All Types" || normalize(job.type) === normalize(type);

      return matchesSearch && matchesLocation && matchesExperience && matchesType;
    });

    if (sort === "A-Z") {
      result.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sort === "Z-A") {
      result.sort((a, b) => b.title.localeCompare(a.title));
    }

    return result;
  }, [jobs, debouncedSearch, location, experience, type, sort]);

  // Paginated items
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredJobs.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    scrollToTop();
  };

  const handleItemsPerPageChange = (size: number) => {
    setItemsPerPage(size);
    setCurrentPage(1);
    scrollToTop();
  };

  const handleSearch = (val: string) => {
    setSearch(val);
    setCurrentPage(1);
    // Note: We don't call scrollToTop here to prevent the page from jumping while typing.
  };

  const handleLocationChange = (val: string) => {
    setLocation(val);
    setCurrentPage(1);
    scrollToTop();
  };

  const handleExperienceChange = (val: string) => {
    setExperience(val);
    setCurrentPage(1);
    scrollToTop();
  };

  const handleTypeChange = (val: string) => {
    setType(val);
    setCurrentPage(1);
    scrollToTop();
  };

  const handleSortChange = (val: string) => {
    setSort(val);
    setCurrentPage(1);
    scrollToTop();
  };

  return (
    <section className={styles.jobListingSection} id="jobs">
      <div className="container" ref={sectionRef}>
        <h2 className={styles.title} dangerouslySetInnerHTML={{ __html: title }} />
        <JobFilters
          onSearch={handleSearch}
          onLocationChange={handleLocationChange}
          onExperienceChange={handleExperienceChange}
          onTypeChange={handleTypeChange}
          onSortChange={handleSortChange}
          locations={locations}
          experienceLevels={experienceLevels}
          jobTypes={jobTypes}
        />
        <div className={styles.grid}>
          {currentItems.length > 0 ? (
            currentItems.map((job) => <JobCard key={job.id} {...job} />)
          ) : (
            <div className={styles.noResults}>No jobs found matching your criteria.</div>
          )}
        </div>

        <Pagination
          totalItems={filteredJobs.length}
          itemsPerPage={itemsPerPage}
          currentPage={currentPage}
          onPageChange={handlePageChange}
          onItemsPerPageChange={handleItemsPerPageChange}
        />
      </div>
    </section>
  );
};

export default JobListingSection;


