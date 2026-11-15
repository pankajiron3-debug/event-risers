import React from 'react';
import { ShieldCheck, Sparkles, RefreshCw } from 'lucide-react';

export const Header = ({ onRefresh, isRefreshing, healthStatus }) => {
  return (
    <header className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-30 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 py-3">
          
          {/* Logo & Corporate Title */}
          <div className="flex items-center space-x-3.5">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-blue-600 to-sky-400 flex items-center justify-center shadow-lg shadow-blue-500/20 ring-1 ring-white/20">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2.5">
                <span className="font-extrabold text-xl tracking-tight text-white font-['Plus_Jakarta_Sans']">
                  EVENT <span className="text-sky-400">RISERS</span>
                </span>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase bg-blue-500/10 text-sky-300 border border-blue-500/30">
                  Indian B2B SaaS
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                CMS Data Registry &bull; In-Memory GST PDF Billing (₹ INR) &bull; Automated Corporate Dispatch
              </p>
            </div>
          </div>

          {/* Right Header Badges & Actions */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            
            {/* System Health Indicator */}
            <div className="hidden md:flex items-center space-x-2 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700/60 text-xs text-slate-300">
              <span className={`w-2 h-2 rounded-full ${healthStatus === 'UP' ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
              <span className="font-medium">
                {healthStatus === 'UP' ? 'Engine Online' : 'Connecting Engine...'}
              </span>
            </div>

            {/* Refresh Button */}
            <button
              onClick={onRefresh}
              disabled={isRefreshing}
              title="Refresh Registry Data"
              className="inline-flex items-center justify-center p-2 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700/80 rounded-lg border border-slate-700/60 transition-all disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-sky-400' : ''}`} />
            </button>

            {/* Solo Internship Project Badge */}
            <div className="flex items-center space-x-1.5 bg-gradient-to-r from-blue-600/20 to-sky-500/20 border border-blue-500/30 px-3 py-1.5 rounded-lg text-xs font-semibold text-sky-200">
              <ShieldCheck className="w-3.5 h-3.5 text-sky-400" />
              <span className="hidden sm:inline">Internship Showcase</span>
              <span className="sm:hidden">Demo</span>
            </div>

          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
