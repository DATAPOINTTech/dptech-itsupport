'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { 
  ShieldCheck, 
  UserCircle, 
  PhoneCall, 
  Mail, 
  HelpCircle, 
  SlidersHorizontal, 
  GraduationCap, 
  Wrench, 
  UserCheck, 
  Palette,
  Home,
  LogOut,
  Building2,
  Lock
} from 'lucide-react';

export function NavigationHeader() {
  const { 
    currentUser, 
    switchRole, 
    activeCall, 
    theme, 
    toggleTheme, 
    portalMode, 
    setPortalMode, 
    isAuthenticated, 
    logout 
  } = useApp();

  return (
    <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand */}
        <div 
          onClick={() => setPortalMode('CENTRAL_LANDING')}
          className="flex items-center space-x-3 cursor-pointer group"
          title="Return to Central Landing Portal"
        >
          <div className="h-11 w-11 rounded-xl bg-white p-1 flex items-center justify-center shadow-md shadow-blue-500/20 border border-slate-700/30 shrink-0 overflow-hidden group-hover:scale-105 transition">
            <img 
              src="/datapoint-logo.png" 
              alt="DATAPOINT Technologies Logo" 
              className="h-full w-full object-contain"
            />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-white text-base tracking-tight group-hover:text-indigo-300 transition">
                DATAPOINT Technologies
              </span>
              <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border ${
                portalMode === 'ADMIN_PORTAL' 
                  ? 'bg-purple-950/80 text-purple-300 border-purple-700/60'
                  : portalMode === 'TECHNICIAN_PORTAL'
                  ? 'bg-emerald-950/80 text-emerald-300 border-emerald-700/60'
                  : 'bg-blue-900/60 text-blue-300 border-blue-700/50'
              }`}>
                {portalMode === 'ADMIN_PORTAL' 
                  ? 'Admin Portal' 
                  : portalMode === 'TECHNICIAN_PORTAL' 
                  ? 'Tech Workspace' 
                  : portalMode === 'PUBLIC_PORTAL'
                  ? 'Public Portal'
                  : 'Campus Support'}
              </span>
            </div>
            <p className="text-xs text-slate-400">Campus-Wide Intelligent IT Support &amp; Dispatch</p>
          </div>
        </div>

        {/* Live Call Banner if active */}
        {activeCall && (
          <div className="hidden md:flex items-center space-x-2 bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 px-3 py-1.5 rounded-full text-xs animate-pulse">
            <span className="h-2 w-2 rounded-full bg-emerald-400"></span>
            <PhoneCall className="h-3.5 w-3.5" />
            <span className="font-medium">WhatsApp Call Active: {activeCall.callerName} ({activeCall.participants.length} connected)</span>
          </div>
        )}

        {/* User Role Switcher (Simulator) */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 bg-slate-900 border border-slate-800 rounded-lg p-1 text-xs">
            <span className="text-slate-400 px-2 flex items-center gap-1">
              <SlidersHorizontal className="h-3 w-3" /> Role Sim:
            </span>
            <button
              onClick={() => switchRole('student')}
              className={`px-2.5 py-1 rounded font-medium transition ${
                currentUser.role === 'STUDENT'
                  ? 'bg-indigo-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Student
            </button>
            <button
              onClick={() => switchRole('tech1')}
              className={`px-2.5 py-1 rounded font-medium transition ${
                currentUser.role === 'TECHNICIAN_T1'
                  ? 'bg-indigo-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Tier-1 Tech
            </button>
            <button
              onClick={() => switchRole('tech2')}
              className={`px-2.5 py-1 rounded font-medium transition ${
                currentUser.role === 'TECHNICIAN_T2'
                  ? 'bg-indigo-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Security Tech
            </button>
            <button
              onClick={() => switchRole('admin')}
              className={`px-2.5 py-1 rounded font-medium transition ${
                currentUser.role === 'ADMIN'
                  ? 'bg-indigo-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              IT Admin
            </button>
          </div>

          {/* Theme Mode Switcher */}
          <button
            onClick={toggleTheme}
            title={`Active Theme: ${theme === 'cyber-dark' ? 'Cyber Dark' : 'Midnight Blue'} (Click to toggle)`}
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-indigo-500/50 text-slate-300 hover:text-white text-xs transition"
          >
            <Palette className="h-3.5 w-3.5 text-indigo-400" />
            <span className="text-[11px] font-medium">
              {theme === 'cyber-dark' ? 'Cyber Dark' : 'Midnight Blue'}
            </span>
          </button>

          {/* Central Portal Return / Sign Out */}
          {portalMode !== 'CENTRAL_LANDING' ? (
            <button
              onClick={logout}
              className="px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-rose-300 hover:text-rose-200 text-xs font-semibold flex items-center gap-1.5 transition"
              title="Return to Central Landing Portal"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span className="hidden md:inline">Exit Portal</span>
            </button>
          ) : (
            <button
              onClick={() => setPortalMode('PUBLIC_PORTAL')}
              className="px-2.5 py-1.5 rounded-lg bg-indigo-950/60 hover:bg-indigo-900 border border-indigo-700/50 text-indigo-300 text-xs font-semibold flex items-center gap-1.5 transition"
            >
              <Building2 className="h-3.5 w-3.5" /> Facilities
            </button>
          )}

          {/* Current User Pill */}
          <div className="flex items-center space-x-2 pl-2 border-l border-slate-800">
            <div className="h-8 w-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 font-semibold text-xs">
              {currentUser.fullName.split(' ').map(n => n[0]).join('')}
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-xs font-medium text-slate-200 leading-tight">{currentUser.fullName}</p>
              <p className="text-[10px] text-slate-400">{currentUser.role} • {currentUser.campusId}</p>
            </div>
          </div>

        </div>

      </div>
    </header>
  );
}
