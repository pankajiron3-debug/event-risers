import React from 'react';
import { Search, X, Filter } from 'lucide-react';

export const SearchBar = ({ searchTerm, onSearchChange, onClear, resultCount, totalCount }) => {
  return (
    <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
      {/* Search Input Bar */}
      <div className="relative w-full sm:w-96">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
          <Search className="w-4 h-4" />
        </div>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Filter by company, contact, email or event..."
          className="w-full pl-10 pr-9 py-2 text-sm bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
        />
        {searchTerm && (
          <button
            onClick={onClear}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Registry Count & Meta Indicator */}
      <div className="flex items-center space-x-3 text-xs text-slate-500 w-full sm:w-auto justify-between sm:justify-end">
        <div className="flex items-center space-x-1.5 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <span>Showing:</span>
          <span className="font-bold text-slate-800">{resultCount}</span>
          <span>of</span>
          <span className="font-semibold text-slate-700">{totalCount}</span>
          <span>Partners</span>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
