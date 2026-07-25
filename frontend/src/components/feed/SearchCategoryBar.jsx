import React from 'react';
import { Search, Filter, ChevronDown, RefreshCw } from 'lucide-react';

export default function SearchCategoryBar({
  searchInput, setSearchInput,
  handleSearchSubmit,
  selectedCategory, setSelectedCategory,
  categories, categoriesLoading,
  searchQuery,
  handleResetFilters,
  loadNotices, loading,
  setPage
}) {
  return (
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
  );
}
