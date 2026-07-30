import React, { useState, useEffect, useCallback, useRef } from 'react';
import { noticeApi, userApi } from '../api/client';
import NoticeCard from './NoticeCard';
import { ChevronLeft, ChevronRight, Layers } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import FeedHeader from './feed/FeedHeader';
import SearchCategoryBar from './feed/SearchCategoryBar';

export default function NoticeFeed({ openAuthModal }) {
  const { isAuthenticated } = useAuth();

  const [notices, setNotices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [error, setError] = useState(null);

  // In-memory notice cache for 0ms instant tab switching
  const noticeCache = useRef({});
  const LIMIT = 12;

  // Real-time 300ms Debounced Search Input handler
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInput.trim() !== searchQuery) {
        setSearchQuery(searchInput.trim());
        setPage(1);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [searchInput, searchQuery]);

  // Fetch available categories
  useEffect(() => {
    async function loadCategories() {
      setCategoriesLoading(true);
      const res = await userApi.getCategories();
      if (res.ok && Array.isArray(res.data)) {
        setCategories(res.data);
      }
      setCategoriesLoading(false);
    }
    loadCategories();
  }, []);

  // Fetch notices according to current page, category_id, and search query with 0ms cache support
  const loadNotices = useCallback(async (ignoreCache = false) => {
    const cacheKey = `${selectedCategory || 'all'}_${searchQuery || ''}_${page}`;
    
    // Check in-memory cache for instant 0ms retrieval
    if (!ignoreCache && noticeCache.current[cacheKey]) {
      setNotices(noticeCache.current[cacheKey]);
      setLoading(false);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    const res = await noticeApi.getNotices({
      page,
      limit: LIMIT,
      category_id: selectedCategory,
      search: searchQuery
    });

    if (res.ok && Array.isArray(res.data)) {
      noticeCache.current[cacheKey] = res.data;
      setNotices(res.data);
    } else {
      setError(res.error || 'Failed to fetch notices.');
    }
    setLoading(false);
  }, [page, selectedCategory, searchQuery]);

  useEffect(() => {
    loadNotices();
  }, [loadNotices]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setSearchQuery(searchInput.trim());
    setPage(1);
  };

  const handleResetFilters = () => {
    setSelectedCategory(null);
    setSearchQuery('');
    setSearchInput('');
    setPage(1);
  };

  return (
    <div className="space-y-8 pb-16">
      
      {/* Hero Header Banner Sub-component */}
      <FeedHeader />

      {/* Search & Category Filter Control Sub-component */}
      <SearchCategoryBar
        searchInput={searchInput}
        setSearchInput={setSearchInput}
        handleSearchSubmit={handleSearchSubmit}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        categories={categories}
        categoriesLoading={categoriesLoading}
        searchQuery={searchQuery}
        handleResetFilters={handleResetFilters}
        loadNotices={() => loadNotices(true)}
        loading={loading}
        setPage={setPage}
      />

      {/* Notice Feed Grid */}
      <section>
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="h-64 rounded-3xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 animate-pulse p-6" />
            ))}
          </div>
        ) : error ? (
          <div className="p-8 rounded-3xl border border-rose-300 dark:border-rose-900/50 bg-rose-50 dark:bg-rose-950/20 text-center text-rose-800 dark:text-rose-300 space-y-3">
            <p className="font-semibold text-sm">{error}</p>
            <button
              onClick={loadNotices}
              className="px-4 py-2 rounded-xl bg-rose-600 text-white text-xs font-bold hover:bg-rose-500 transition-colors shadow-sm"
            >
              Try Again
            </button>
          </div>
        ) : notices.length === 0 ? (
          <div className="p-12 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 text-center space-y-3">
            <Layers className="w-10 h-10 text-slate-400 mx-auto" />
            <h3 className="font-bold text-slate-900 dark:text-slate-200 text-base">No Notices Found</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {searchQuery ? `No notices matching "${searchQuery}"` : 'No notices available in this category yet.'}
            </p>
            {(selectedCategory || searchQuery) && (
              <button
                onClick={handleResetFilters}
                className="mt-2 px-4 py-2 rounded-xl bg-teal-500/10 border border-teal-500/20 text-teal-700 dark:text-teal-300 text-xs font-bold hover:bg-teal-500/20 transition-all"
              >
                Clear Search & Filters
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {notices.map((notice) => (
              <NoticeCard key={notice.id} notice={notice} />
            ))}
          </div>
        )}
      </section>

      {/* Pagination Controls */}
      {notices.length > 0 && (
        <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-800/80">
          <button
            disabled={page === 1 || loading}
            onClick={() => setPage(p => Math.max(1, p - 1))}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 text-xs font-bold text-slate-700 dark:text-slate-300 hover:border-teal-500/40 hover:text-teal-600 dark:hover:text-teal-300 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm"
          >
            <ChevronLeft className="w-4 h-4" /> Previous
          </button>

          <span className="text-xs font-bold text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-900/60 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800">
            Page {page}
          </span>

          <button
            disabled={notices.length < LIMIT || loading}
            onClick={() => setPage(p => p + 1)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 text-xs font-bold text-slate-700 dark:text-slate-300 hover:border-teal-500/40 hover:text-teal-600 dark:hover:text-teal-300 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm"
          >
            Next <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

    </div>
  );
}
