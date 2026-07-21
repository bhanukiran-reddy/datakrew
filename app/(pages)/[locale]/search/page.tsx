'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import type { SearchResult } from '@/lib/types/search';
import SearchResultItem from '@/components/ui/Search/SearchResultItem';
import Pagination from '@/components/ui/Pagination/Pagination';
import styles from './search.module.css';

function SearchResultsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const query = searchParams.get('q') || '';
  const page = parseInt(searchParams.get('page') || '1', 10);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [searchInput, setSearchInput] = useState(query);
  const limit = parseInt(searchParams.get('limit') || '12', 10);

  useEffect(() => {
    if (!query) return;

    async function fetchResults() {
      setLoading(true);
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(query)}&page=${page}&limit=${limit}`);
        if (!response.ok) throw new Error('Search failed');
        const data = await response.json();
        setResults(data.results || []);
        setTotal(data.total || 0);
      } catch (err) {
        console.error('Search failed:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchResults();
  }, [query, page, limit]);

  useEffect(() => {
    setSearchInput(query);
  }, [query]);

  const totalPages = Math.ceil(total / limit);

  const handlePageChange = (newPage: number) => {
    router.push(`/search?q=${encodeURIComponent(query)}&page=${newPage}&limit=${limit}`);
  };

  const handleItemsPerPageChange = (newLimit: number) => {
    router.push(`/search?q=${encodeURIComponent(query)}&page=1&limit=${newLimit}`);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchInput.trim())}`);
    }
  };

  return (
    <section className={styles.sectionWrapper}>
      <div className="container">
        <form onSubmit={handleSearchSubmit} className={styles.searchBar}>
          <label>Search</label>
          <input 
            type="text" 
            placeholder="Search term" 
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
          <button type="submit">Apply</button>
        </form>

        {/* <div className={styles.header}>
          <h1>Search Results for: <span>"{query}"</span></h1>
          <p>{total} results found</p>
        </div> */}

        <div className={styles.resultsGrid}>
          {loading ? (
            <div className={styles.loading}>Searching...</div>
          ) : results.length > 0 ? (
            results.map((result, idx) => (
              <SearchResultItem key={`${result.uri}-${idx}`} {...result} />
            ))
          ) : (
            <div className={styles.noResults}>No search results found for "{query}".</div>
          )}
        </div>

        <Pagination
          totalItems={total}
          itemsPerPage={limit}
          currentPage={page}
          onPageChange={handlePageChange}
          onItemsPerPageChange={handleItemsPerPageChange}
        />
      </div>
    </section>
  );
}

export default function SearchPage() {
  return (
    <div className={styles.pageWrapper}>
      <Suspense fallback={<div>Loading Search...</div>}>
        <SearchResultsContent />
      </Suspense>
    </div>
  );
}
