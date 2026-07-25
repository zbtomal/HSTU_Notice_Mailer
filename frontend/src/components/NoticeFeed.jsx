import React, { useState, useEffect, useCallback } from 'react';
import { noticeApi, userApi } from '../api/client';
import NoticeCard from './NoticeCard';
import { Search, Filter, RefreshCw, ChevronLeft, ChevronRight, ChevronDown, Layers, Bell, Mail } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

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
  
  const LIMIT = 12;

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

  // Fetch notices according to current page, category_id, and search query
  const loadNotices = useCallback(async () => {
    setLoading(true);
    setError(null);

    const res = await noticeApi.getNotices({
      page,
      limit: LIMIT,
      category_id: selectedCategory,
      search: searchQuery,
    });

    if (res.ok && Array.isArray(res.data)) {
      setNotices(res.data);
    } else {
      setError(res.error || 'Failed to load notices');
    }
    setLoading(false);
  }, [page, selectedCategory, searchQuery]);

  useEffect(() => {
    loadNotices();
  }, [loadNotices]);

  // Handle Search Submission
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setSearchQuery(searchInput);
    setPage(1);
  };

  // Clear Filters
  const handleResetFilters = () => {
    setSelectedCategory(null);
    setSearchQuery('');
    setSearchInput('');
    setPage(1);
  };

  return (
    <div className="space-y-8 pb-16">

      {/* Hero Section Banner */}
      <section className="relative overflow-hidden rounded-3xl border border-teal-500/30 bg-white dark:bg-slate-900/80 p-6 sm:p-10 shadow-xl shadow-teal-500/5 dark:shadow-glow transition-all">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-64 h-64 rounded-full bg-teal-500/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-64 h-64 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />

        <div className="relative max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-teal-500/10 text-teal-600 dark:text-teal-300 border border-teal-500/20">
            <Bell className="w-3.5 h-3.5 text-teal-500 dark:text-teal-400" />
            HSTU Official Announcement Portal
          </div>

          <h1 className="font-heading text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
            Stay Ahead with Instant <span className="bg-gradient-to-r from-teal-600 via-cyan-600 to-amber-600 dark:from-teal-400 dark:via-cyan-300 dark:to-amber-300 bg-clip-text text-transparent">Notice Alerts</span>
          </h1>

          <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
            Automated scraping and direct email notifications for Hajee Mohammad Danesh Science and Technology University notices, filtered by your exact department and section.
          </p>

          {!isAuthenticated && (
            <div className="pt-2 flex flex-wrap gap-3">
              <button
                onClick={() => openAuthModal('register')}
                className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 text-slate-950 font-bold text-sm shadow-glow hover:brightness-110 transition-all"
              >
                <Mail className="w-4 h-4" />
                Subscribe to Email Alerts
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Search & Category Filter Section */}
      <section className="space-y-3">
        
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
          
          {/* Keyword Search Input */}
          <form onSubmit={handleSearchSubmit} className="relative sm:col-span-6 lg:col-span-7">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search notices by keyword..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full pl-10 pr-24 py-2.5 rounded-xl glass-input text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all"
            />
            <button
              type="submit"
              className="absolute right-1.5 top-1/2 -translate-y-1/2 px-3.5 py-1.5 rounded-lg bg-teal-500 text-slate-950 font-bold text-xs hover:bg-teal-400 transition-colors shadow-sm"
            >
              Search
            </button>
          </form>

          {/* Category Dropdown Select */}
          <div className="relative sm:col-span-4 lg:col-span-3">
            <div className="relative">
              <Filter className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-teal-600 dark:text-teal-400 pointer-events-none" />
              <select
                value={selectedCategory || ''}
                onChange={(e) => {
                  const val = e.target.value ? Number(e.target.value) : null;
                  setSelectedCategory(val);
                  setPage(1);
                }}
                disabled={categoriesLoading}
                className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 font-bold text-xs sm:text-sm appearance-none cursor-pointer focus:outline-none focus:border-teal-500 shadow-sm transition-all truncate"
              >
                <option value="">All Categories (Master Feed)</option>
                {[...categories].sort((a, b) => a.name.localeCompare(b.name)).map((cat) => (
                  <option key={cat.id} value={cat.id} className="text-slate-900 bg-white dark:bg-slate-900 dark:text-slate-100 font-medium py-1">
                    {cat.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>
          </div>

          {/* Action Buttons: Refresh & Clear */}
          <div className="flex items-center gap-2 sm:col-span-2 lg:col-span-2 justify-end">
            {(selectedCategory || searchQuery) && (
              <button
                onClick={handleResetFilters}
                className="px-3 py-2.5 rounded-xl border border-rose-200 dark:border-rose-500/30 bg-rose-50 dark:bg-rose-950/30 text-xs font-bold text-rose-700 dark:text-rose-300 hover:bg-rose-100 transition-all shadow-sm shrink-0"
              >
                Clear
              </button>
            )}
            <button
              onClick={loadNotices}
              disabled={loading}
              className="flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-teal-600 dark:hover:text-teal-300 transition-all shadow-sm shrink-0"
              title="Refresh Notices"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-teal-500' : ''}`} />
              <span>Refresh</span>
            </button>
          </div>

        </div>

        {/* Active Category Filter Indicator Badge */}
        {selectedCategory && (
          <div className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400 pt-1">
            <span>Filtered by:</span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-teal-50 dark:bg-teal-950/40 text-teal-800 dark:text-teal-300 border border-teal-200 dark:border-teal-500/30 font-bold">
              <Filter className="w-3 h-3 text-teal-500" />
              {categories.find(c => c.id === selectedCategory)?.name}
              <button 
                onClick={() => { setSelectedCategory(null); setPage(1); }}
                className="ml-1 text-slate-400 hover:text-rose-500 transition-colors text-sm font-extrabold"
                title="Remove filter"
              >
                ×
              </button>
            </span>
          </div>
        )}

      </section>

      {/* Notice Feed Grid */}
      <section>
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="h-56 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 p-6 animate-pulse space-y-4 shadow-sm">
                <div className="flex justify-between">
                  <div className="h-4 w-20 bg-slate-200 dark:bg-slate-800 rounded-full" />
                  <div className="h-4 w-24 bg-slate-200 dark:bg-slate-800 rounded-full" />
                </div>
                <div className="h-6 w-3/4 bg-slate-200 dark:bg-slate-800 rounded-lg" />
                <div className="h-12 w-full bg-slate-100 dark:bg-slate-800/50 rounded-lg" />
                <div className="h-6 w-1/3 bg-slate-200 dark:bg-slate-800 rounded-lg pt-4" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="p-8 rounded-2xl border border-rose-500/20 bg-rose-50 dark:bg-rose-950/20 text-center space-y-3">
            <p className="text-rose-600 dark:text-rose-400 font-semibold">{error}</p>
            <button
              onClick={loadNotices}
              className="px-4 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-800 dark:text-slate-200 hover:text-teal-600 shadow-sm"
            >
              Try Again
            </button>
          </div>
        ) : notices.length === 0 ? (
          <div className="p-12 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 text-center space-y-3 shadow-sm">
            <Filter className="w-10 h-10 text-slate-400 mx-auto" />
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-300">No notices found</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
              We couldn't find any notices matching your search or category filter. Try clearing filters.
            </p>
            <button
              onClick={handleResetFilters}
              className="px-4 py-2 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-300 border border-teal-500/20 text-xs font-semibold hover:bg-teal-500/20"
            >
              Reset Filters
            </button>
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
      {!loading && notices.length > 0 && (
        <div className="flex items-center justify-between pt-6 border-t border-slate-200 dark:border-slate-800/80">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Showing Page <span className="font-bold text-slate-900 dark:text-slate-200">{page}</span>
          </p>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="flex items-center gap-1 px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 dark:hover:bg-slate-800 transition-all shadow-sm"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </button>

            <span className="px-3 py-1.5 rounded-lg bg-teal-500/10 text-teal-700 dark:text-teal-300 border border-teal-500/20 font-bold text-xs">
              {page}
            </span>

            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={notices.length < LIMIT}
              className="flex items-center gap-1 px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 dark:hover:bg-slate-800 transition-all shadow-sm"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
