'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { 
  Building2, 
  Wrench, 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle2, 
  Radio, 
  PhoneCall, 
  MessageSquare, 
  Users, 
  Lock, 
  Sparkles, 
  Cpu, 
  Globe, 
  Activity,
  Bot
} from 'lucide-react';

export function CentralLandingPortal({ 
  onOpenAuthModal, 
  onOpenRegisterModal,
  onOpenWhatsAppStudio
}: { 
  onOpenAuthModal: (role: 'ADMIN' | 'TECHNICIAN' | 'STUDENT') => void;
  onOpenRegisterModal: () => void;
  onOpenWhatsAppStudio: () => void;
}) {
  const { setPortalMode, facilities, tickets, aishaConfig } = useApp();

  const totalFacilities = facilities.length;
  const operationalCount = facilities.filter(f => f.status === 'OPERATIONAL').length;
  const resolvedCount = tickets.filter(t => t.status === 'RESOLVED' || t.status === 'CLOSED').length;

  return (
    <div className="space-y-10 py-4">
      
      {/* Hero Welcome Section */}
      <div className="bg-gradient-to-b from-slate-900 via-indigo-950/40 to-slate-950 border border-slate-800 rounded-3xl p-8 sm:p-12 shadow-2xl relative overflow-hidden text-center">
        <div className="absolute left-1/2 top-0 -translate-x-1/2 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 bg-indigo-900/60 border border-indigo-700/50 px-3.5 py-1 rounded-full text-indigo-300 text-xs font-semibold">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
            DATAPOINT Technologies &bull; Campus Enterprise Infrastructure
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            Campus IT Facilities &amp; Support Command Portal
          </h1>

          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            A unified university IT ecosystem providing real-time facility telemetry, verified student support, role-gated technician dispatch, and administrative governance.
          </p>

          {/* Quick Telemetry Indicators */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4 text-xs font-mono">
            <div className="flex items-center gap-2 bg-slate-950/80 border border-slate-800 px-3 py-1.5 rounded-xl text-slate-300">
              <span className="h-2 w-2 rounded-full bg-emerald-400"></span>
              <span>Facilities: <strong className="text-emerald-400">{operationalCount}/{totalFacilities} Online</strong></span>
            </div>
            <div className="flex items-center gap-2 bg-slate-950/80 border border-slate-800 px-3 py-1.5 rounded-xl text-slate-300">
              <span className="h-2 w-2 rounded-full bg-emerald-400"></span>
              <span>AI Agent {aishaConfig.name}: <strong className="text-indigo-400">Active (VoIP &amp; Chat)</strong></span>
            </div>
            <div className="flex items-center gap-2 bg-slate-950/80 border border-slate-800 px-3 py-1.5 rounded-xl text-slate-300">
              <span className="h-2 w-2 rounded-full bg-emerald-400"></span>
              <span>Resolved SLA: <strong className="text-white">{resolvedCount} Tickets</strong></span>
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* THREE CORE GATEWAYS / PORTAL ENTRY POINTS */}
      {/* ============================================================== */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* DOOR 1: PUBLIC FACILITIES & STUDENT SERVICES PORTAL */}
        <div className="bg-slate-900 border border-slate-800 hover:border-indigo-500/50 rounded-3xl p-6 shadow-xl flex flex-col justify-between transition-all duration-300 hover:shadow-indigo-500/10 group">
          <div>
            <div className="h-12 w-12 rounded-2xl bg-indigo-600/20 border border-indigo-500/40 text-indigo-400 flex items-center justify-center mb-5 shadow group-hover:scale-105 transition">
              <Building2 className="h-6 w-6" />
            </div>

            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-300 bg-indigo-950/80 border border-indigo-800 px-2.5 py-0.5 rounded-full">
                Open Access
              </span>
              <span className="text-[10px] text-slate-400 font-mono">No Password Needed</span>
            </div>

            <h3 className="text-xl font-bold text-white mb-2">
              Public Facilities &amp; Student Portal
            </h3>

            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              Browse campus computing laboratories, check seat availability, view Wi-Fi coverage, cloud print kiosks, and self-register for verified ticketing.
            </p>

            <ul className="space-y-2 text-xs text-slate-300 border-t border-slate-800/80 pt-4 mb-6">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>Real-time Computing Lab Specs &amp; Hours</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>Wi-Fi 6E &amp; Cloud Printing Status</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>Student Self-Registration Approval Desk</span>
              </li>
            </ul>
          </div>

          <div className="space-y-2 pt-2">
            <button
              onClick={() => setPortalMode('PUBLIC_PORTAL')}
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold py-3 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 transition"
            >
              Enter Public Facilities Portal <ArrowRight className="h-4 w-4" />
            </button>
            <button
              onClick={onOpenRegisterModal}
              className="w-full bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800 hover:border-slate-700 text-xs font-semibold py-2.5 rounded-xl transition"
            >
              Self-Register Student Account
            </button>
          </div>
        </div>

        {/* DOOR 2: TECHNICIAN OPERATIONS WORKSPACE */}
        <div className="bg-slate-900 border border-slate-800 hover:border-emerald-500/50 rounded-3xl p-6 shadow-xl flex flex-col justify-between transition-all duration-300 hover:shadow-emerald-500/10 group">
          <div>
            <div className="h-12 w-12 rounded-2xl bg-emerald-600/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mb-5 shadow group-hover:scale-105 transition">
              <Wrench className="h-6 w-6" />
            </div>

            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-300 bg-emerald-950/80 border border-emerald-800 px-2.5 py-0.5 rounded-full">
                Role-Gated
              </span>
              <span className="text-[10px] text-slate-400 font-mono">Technician Credentials</span>
            </div>

            <h3 className="text-xl font-bold text-white mb-2">
              Technician Workspace Portal
            </h3>

            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              Dedicated operational workspace for campus IT engineers. Access departmental task queues, bridge live WhatsApp audio calls, and resolve incidents.
            </p>

            <ul className="space-y-2 text-xs text-slate-300 border-t border-slate-800/80 pt-4 mb-6">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>Departmental Scoped Task Queue (Wi-Fi, Sec, HW)</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>Live WhatsApp Voice Bridging &amp; Call Handling</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>Technician MTTR Velocity &amp; Performance Telemetry</span>
              </li>
            </ul>
          </div>

          <div className="space-y-2 pt-2">
            <button
              onClick={() => onOpenAuthModal('TECHNICIAN')}
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold py-3 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 transition"
            >
              <Lock className="h-4 w-4" /> Technician Sign In <ArrowRight className="h-4 w-4" />
            </button>
            <p className="text-[10px] text-center text-slate-500">
              Demo: <code>marcus</code> / <code>elena</code> (Pre-filled credentials)
            </p>
          </div>
        </div>

        {/* DOOR 3: CENTRAL ADMIN MANAGEMENT & TICKETING PORTAL */}
        <div className="bg-slate-900 border border-slate-800 hover:border-purple-500/50 rounded-3xl p-6 shadow-xl flex flex-col justify-between transition-all duration-300 hover:shadow-purple-500/10 group">
          <div>
            <div className="h-12 w-12 rounded-2xl bg-purple-600/20 border border-purple-500/40 text-purple-400 flex items-center justify-center mb-5 shadow group-hover:scale-105 transition">
              <ShieldCheck className="h-6 w-6" />
            </div>

            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-purple-300 bg-purple-950/80 border border-purple-800 px-2.5 py-0.5 rounded-full">
                Admin Exclusive
              </span>
              <span className="text-[10px] text-slate-400 font-mono">Master Authority</span>
            </div>

            <h3 className="text-xl font-bold text-white mb-2">
              Admin Ticketing &amp; Config Portal
            </h3>

            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              Executive oversight for IT Directors and System Administrators. Approve user registrations, provision technician staff, configure Aisha AI, and view audit logs.
            </p>

            <ul className="space-y-2 text-xs text-slate-300 border-t border-slate-800/80 pt-4 mb-6">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>Central User Registration Verification Desk</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>Support Staff Provisioning &amp; Departmental Scope</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>Global Master Ticketing Console &amp; FERPA Audit Logs</span>
              </li>
            </ul>
          </div>

          <div className="space-y-2 pt-2">
            <button
              onClick={() => onOpenAuthModal('ADMIN')}
              className="w-full bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold py-3 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-purple-600/30 transition"
            >
              <Lock className="h-4 w-4" /> Administrator Sign In <ArrowRight className="h-4 w-4" />
            </button>
            <p className="text-[10px] text-center text-slate-500">
              Demo: <code>admin</code> (Pre-filled credentials)
            </p>
          </div>
        </div>

      </div>

      {/* Omnichannel Helpline Quick Launcher */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center space-x-4">
          <div className="h-12 w-12 rounded-2xl bg-emerald-600/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center shadow shrink-0">
            <Radio className="h-6 w-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-base font-bold text-white">
                Live WhatsApp Helpdesk &bull; AI Voice Agent {aishaConfig.name}
              </h4>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full font-mono font-bold">
                24/7 Available
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Call or message Aisha directly on WhatsApp for instantaneous automated troubleshooting and live technician escalation.
            </p>
          </div>
        </div>

        <button
          onClick={onOpenWhatsAppStudio}
          className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-5 py-3 rounded-xl shadow-lg shadow-emerald-600/20 flex items-center gap-2 transition shrink-0"
        >
          <PhoneCall className="h-4 w-4" /> Launch WhatsApp Helpline
        </button>
      </div>

    </div>
  );
}
