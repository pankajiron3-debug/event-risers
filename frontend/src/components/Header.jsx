import React from 'react';
import { RefreshCw, FileText } from 'lucide-react';

export const Header = ({ onRefresh, isRefreshing }) => {
  return (
    <header className="bg-panel border-b border-hairline sticky top-0 z-30 shadow-subtle">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Product Identity */}
          <div className="flex items-center space-x-3">
            <div className="h-9 w-9 rounded-lg bg-teal-deep text-white flex items-center justify-center font-bold text-sm tracking-tight shadow-xs select-none">
              ER
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-base tracking-tight text-ink font-sans">
                  Event Risers
                </span>
                <span className="text-hairline text-sm hidden sm:inline">|</span>
                <span className="text-xs font-medium text-ink-muted hidden sm:inline">
                  Corporate Client Directory &amp; GST Invoicing
                </span>
              </div>
              <p className="text-[11px] text-ink-subtle sm:hidden font-medium">
                Corporate Client Directory &amp; GST Invoicing
              </p>
            </div>
          </div>

          {/* Right Ledger Controls */}
          <div className="flex items-center space-x-3">
            
            {/* Fiscal Period Badge */}
            <div className="hidden md:flex items-center space-x-1.5 px-2.5 py-1 rounded-md bg-surface border border-hairline text-[11px] font-mono text-ink-muted">
              <span>FY 2026–27</span>
              <span className="text-ink-subtle">&bull;</span>
              <span>GST Active</span>
            </div>

            {/* Refresh Action */}
            <button
              onClick={onRefresh}
              disabled={isRefreshing}
              title="Refresh ledger records"
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium text-ink bg-panel hover:bg-surface border border-hairline hover:border-hairline-hover rounded-lg transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-ink-muted ${isRefreshing ? 'animate-spin text-teal-deep' : ''}`} />
              <span className="hidden sm:inline">Sync Directory</span>
            </button>

          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
