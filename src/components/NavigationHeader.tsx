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
  UserCheck
} from 'lucide-react';

export function NavigationHeader() {
  const { currentUser, switchRole, activeCall } = useApp();

  return (
    <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand */}
        <div className="flex items-center space-x-3">
          <div className="h-9 w-9 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-white text-base tracking-tight">CampusNet IT</span>
              <span className="text-[10px] uppercase font-semibold bg-indigo-900/60 text-indigo-300 border border-indigo-700/50 px-2 py-0.5 rounded-full">
                Enterprise Resolver
              </span>
            </div>
            <p className="text-xs text-slate-400">Unified Multi-Channel IT Support & Dispatch</p>
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
