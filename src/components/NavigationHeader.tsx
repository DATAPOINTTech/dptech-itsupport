'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { ShieldCheck, Activity } from 'lucide-react';

export function NavigationHeader() {
  const { setPortalMode } = useApp();

  return (
    <header className="border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-md sticky top-0 z-50 transition-all duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Left Side: Logo & Main Company Information */}
        <div 
          onClick={() => setPortalMode('CENTRAL_LANDING')}
          className="flex items-center space-x-4 cursor-pointer group select-none"
          title="DATAPOINT Technologies - Return to Central Portal"
        >
          {/* Company Logo in clean high-contrast container */}
          <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-2xl bg-white p-1.5 flex items-center justify-center shadow-lg shadow-blue-500/10 border border-slate-700/40 shrink-0 overflow-hidden group-hover:scale-105 group-hover:shadow-blue-500/20 transition-all duration-300">
            <img 
              src="/datapoint-logo.png" 
              alt="DATAPOINT Technologies Logo" 
              className="h-full w-full object-contain"
            />
          </div>

          {/* Company Title & Corporate Tagline */}
          <div className="flex flex-col justify-center">
            <div className="flex items-center space-x-2">
              <span className="font-extrabold text-white text-lg sm:text-xl tracking-tight group-hover:text-blue-400 transition-colors">
                DATAPOINT <span className="text-blue-500">TECHNOLOGIES</span>
              </span>
              <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase bg-blue-950/80 text-blue-300 border border-blue-700/50">
                Enterprise
              </span>
            </div>
            
            {/* Official Slogan */}
            <div className="flex items-center space-x-2 mt-0.5">
              <p className="text-[11px] sm:text-xs font-bold tracking-wider uppercase text-blue-400 font-mono">
                SMART SOLUTIONS. INTELLIGENT FUTURE.
              </p>
              <span className="hidden md:inline text-slate-600">&bull;</span>
              <p className="hidden md:inline text-[11px] text-slate-400 font-medium">
                Campus IT Facilities &amp; Support System
              </p>
            </div>
          </div>
        </div>

        {/* Right Side: Company Division & Infrastructure Status */}
        <div className="flex items-center space-x-4">
          <div className="hidden sm:flex flex-col items-end text-right">
            <div className="flex items-center space-x-1.5 text-xs font-semibold text-slate-200">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Enterprise IT Infrastructure Hub</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Campus Omnichannel Dispatch &bull; 24/7 Operations
            </p>
          </div>

          <div className="h-9 w-px bg-slate-800 hidden sm:block"></div>

          <div className="flex items-center gap-2 bg-slate-900/90 border border-slate-800 px-3 py-1.5 rounded-xl shadow-inner">
            <ShieldCheck className="h-4 w-4 text-blue-400 shrink-0" />
            <div className="text-left">
              <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400 leading-none">Status</div>
              <div className="text-xs font-bold text-emerald-400 leading-tight">Verified Secure</div>
            </div>
          </div>
        </div>

      </div>
    </header>
  );
}
