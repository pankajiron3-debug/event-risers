import React from 'react';
import { Search, X } from 'lucide-react';

export const SearchBar = ({ searchTerm, onSearchChange, onClear, resultCount, totalCount }) => {
  return (
    <div className="bg-panel px-4 py-3 rounded-lg border border-hairline shadow-subtle mb-4 flex flex-col sm:flex-row items-center justify-between gap-3">
      {/* Search Input */}
      <div className="relative w-full sm:w-80">
        <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-ink-subtle">
          <Search className="w-3.5 h-3.5" />
        </div>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Filter by company, contact, or email..."
          className="w-full pl-8 pr-8 py-1.5 text-xs bg-surface/50 hover:bg-surface focus:bg-panel border border-hairline rounded-md text-ink placeholder-ink-subtle/70 focus:outline-none focus:border-teal-deep focus:ring-1 focus:ring-teal-deep transition-all"
        />
        {searchTerm && (
          <button
            onClick={onClear}
            className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-ink-subtle hover:text-ink"
          >
            <X className="w-3 h-3" />
          </button>
        )}
      </div>

      {/* Directory Count */}
      <div className="text-xs text-ink-muted w-full sm:w-auto text-right font-mono text-[11.5px]">
        <span>Showing </span>
        <span className="font-semibold text-ink">{resultCount}</span>
        <span> of </span>
        <span className="font-semibold text-ink">{totalCount}</span>
        <span> accounts</span>
      </div>
    </div>
  );
};

export default SearchBar;
