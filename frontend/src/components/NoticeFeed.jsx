import React, { useState, useEffect, useCallback } from 'react';
import { noticeApi, userApi } from '../api/client';
import NoticeCard from './NoticeCard';
import { Search, Filter, RefreshCw, ChevronLeft, ChevronRight, Layers, Bell, Mail } from 'lucide-react';
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

      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl border border-teal-500/20 bg-gradient-to-b from-slate-900/90 via-slate-900/60 to-slate-950/80 p-6 sm:p-10 shadow-glow">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-64 h-64 rounded-full bg-teal-500/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-64 h-64 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />

        <div className="relative max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-teal-500/10 text-teal-300 border border-teal-500/20">
            <Bell className="w-3.5 h-3.5 text-teal-400" />
            HSTU Official Announcement Portal
          </div>

          <h1 className="font-heading text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Stay Ahead with Instant <span className="bg-gradient-to-r from-teal-400 via-cyan-300 to-amber-300 bg-clip-text text-transparent">Notice Alerts</span>
          </h1>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
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
      <section className="space-y-4">
        
        {/* Search Bar & Refresh */}
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
          <form onSubmit={handleSearchSubmit} className="relative w-full sm:max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search notices by keyword..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full pl-10 pr-24 py-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all"
            />
            <button
              type="submit"
              className="absolute right-1.5 top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-lg bg-teal-500 text-slate-950 font-semibold text-xs hover:bg-teal-400 transition-colors"
            >
              Search
            </button>
          </form>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            {(selectedCategory || searchQuery) && (
              <button
                onClick={handleResetFilters}
                className="px-3 py-2 rounded-xl border border-slate-800 bg-slate-900/60 text-xs font-semibold text-slate-400 hover:text-white hover:border-slate-700 transition-all"
              >
                Clear Filters
              </button>
            )}
            <button
              onClick={loadNotices}
              disabled={loading}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-800 bg-slate-900/60 text-xs font-semibold text-slate-300 hover:text-teal-300 hover:border-teal-500/30 transition-all"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-teal-400' : ''}`} />
              Refresh
            </button>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
            <Layers className="w-3.5 h-3.5 text-teal-400" />
            Category Filter
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            <button
              onClick={() => { setSelectedCategory(null); setPage(1); }}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === null
                  ? 'bg-teal-500 text-slate-950 shadow-glow'
                  : 'bg-slate-900/80 border border-slate-800 text-slate-300 hover:border-slate-700 hover:text-white'
              }`}
            >
              All Categories
            </button>

            {categoriesLoading ? (
              <div className="flex gap-2 animate-pulse">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="h-8 w-24 bg-slate-800/60 rounded-xl" />
                ))}
              </div>
            ) : (
              categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => { setSelectedCategory(cat.id); setPage(1); }}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                    selectedCategory === cat.id
                      ? 'bg-teal-500 text-slate-950 shadow-glow'
                      : 'bg-slate-900/80 border border-slate-800 text-slate-300 hover:border-slate-700 hover:text-white'
                  }`}
                >
                  {cat.name}
                </button>
              ))
            )}
          </div>
        </div>

      </section>

      {/* Notice Feed Grid */}
      <section>
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="h-56 rounded-2xl bg-slate-900/60 border border-slate-800/80 p-6 animate-pulse space-y-4">
                <div className="flex justify-between">
                  <div className="h-4 w-20 bg-slate-800 rounded-full" />
                  <div className="h-4 w-24 bg-slate-800 rounded-full" />
                </div>
                <div className="h-6 w-3/4 bg-slate-800 rounded-lg" />
                <div className="h-12 w-full bg-slate-800/50 rounded-lg" />
                <div className="h-6 w-1/3 bg-slate-800 rounded-lg pt-4" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="p-8 rounded-2xl border border-rose-500/20 bg-rose-950/20 text-center space-y-3">
            <p className="text-rose-400 font-semibold">{error}</p>
            <button
              onClick={loadNotices}
              className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-200 hover:text-white"
            >
              Try Again
            </button>
          </div>
        ) : notices.length === 0 ? (
          <div className="p-12 rounded-2xl border border-slate-800 bg-slate-900/40 text-center space-y-3">
            <Filter className="w-10 h-10 text-slate-600 mx-auto" />
            <h3 className="text-lg font-bold text-slate-300">No notices found</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              We couldn't find any notices matching your search or category filter. Try clearing filters.
            </p>
            <button
              onClick={handleResetFilters}
              className="px-4 py-2 rounded-xl bg-teal-500/10 text-teal-300 border border-teal-500/20 text-xs font-semibold hover:bg-teal-500/20"
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
        <div className="flex items-center justify-between pt-6 border-t border-slate-800/80">
          <p className="text-xs text-slate-400">
            Showing Page <span className="font-bold text-slate-200">{page}</span>
          </p>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="flex items-center gap-1 px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-800 transition-all"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </button>

            <span className="px-3 py-1.5 rounded-lg bg-teal-500/10 text-teal-300 border border-teal-500/20 font-bold text-xs">
              {page}
            </span>

            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={notices.length < LIMIT}
              className="flex items-center gap-1 px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-800 transition-all"
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
