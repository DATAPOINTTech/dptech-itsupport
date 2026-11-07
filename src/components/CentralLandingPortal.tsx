'use client';

import React, { useState } from 'react';
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
  Bot,
  Mail,
  PlusCircle,
  GraduationCap,
  Briefcase,
  UserCheck,
  Check,
  Inbox,
  Zap
} from 'lucide-react';
import { TicketChannel } from '@/types';

export function CentralLandingPortal({ 
  onOpenAuthModal, 
  onOpenRegisterModal,
  onOpenWhatsAppStudio,
  onOpenCreateTicketModal,
}: { 
  onOpenAuthModal: (role: 'ADMIN' | 'TECHNICIAN' | 'STUDENT') => void;
  onOpenRegisterModal: () => void;
  onOpenWhatsAppStudio: () => void;
  onOpenCreateTicketModal: () => void;
}) {
  const { setPortalMode, facilities, tickets, aishaConfig, simulateQuickScenario } = useApp();
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const totalFacilities = facilities.length;
  const operationalCount = facilities.filter(f => f.status === 'OPERATIONAL').length;
  const resolvedCount = tickets.filter(t => t.status === 'RESOLVED' || t.status === 'CLOSED').length;
  const pendingCount = tickets.filter(t => t.status !== 'RESOLVED' && t.status !== 'CLOSED').length;

  const handleQuickSimulate = (scenario: 'WHATSAPP_CALL' | 'WHATSAPP_CHAT' | 'EMAIL' | 'DEPARTMENT_REQUEST') => {
    const created = simulateQuickScenario(scenario);
    setToastMessage(`✓ New Ticket ${created.referenceId} generated via ${created.channel}! It is now live in the Admin Dashboard.`);
    setTimeout(() => setToastMessage(null), 4000);
  };

  return (
    <div className="space-y-8 py-4">
      
      {/* Toast Alert */}
      {toastMessage && (
        <div className="bg-emerald-950 border border-emerald-500 text-emerald-200 px-4 py-3 rounded-2xl text-xs font-semibold flex items-center justify-between shadow-2xl animate-fadeIn">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>{toastMessage}</span>
          </div>
          <button onClick={() => setToastMessage(null)} className="text-emerald-400 hover:text-white px-2 py-0.5">✕</button>
        </div>
      )}

      {/* Hero Welcome Section */}
      <div className="bg-gradient-to-b from-slate-900 via-indigo-950/40 to-slate-950 border border-slate-800 rounded-3xl p-8 sm:p-10 shadow-2xl relative overflow-hidden text-center">
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
            Simplified omnichannel incident generation for Staff, Students, Faculty, and Departments. Automated WhatsApp triage, administrative dispatch, technician workflows, and live work resolution tracking.
          </p>

          {/* Quick Telemetry Indicators */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2 text-xs font-mono">
            <div className="flex items-center gap-2 bg-slate-950/80 border border-slate-800 px-3 py-1.5 rounded-xl text-slate-300">
              <span className="h-2 w-2 rounded-full bg-emerald-400"></span>
              <span>Tickets Resolved: <strong className="text-emerald-400">{resolvedCount}</strong></span>
            </div>
            <div className="flex items-center gap-2 bg-slate-950/80 border border-slate-800 px-3 py-1.5 rounded-xl text-slate-300">
              <span className="h-2 w-2 rounded-full bg-amber-400"></span>
              <span>Active In-Progress: <strong className="text-amber-400">{pendingCount}</strong></span>
            </div>
            <div className="flex items-center gap-2 bg-slate-950/80 border border-slate-800 px-3 py-1.5 rounded-xl text-slate-300">
              <span className="h-2 w-2 rounded-full bg-blue-400"></span>
              <span>Aisha Voice Agent: <strong className="text-indigo-400">Online</strong></span>
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* SIMPLE TICKET GENERATION & OMNICHANNEL SCENARIO DISPATCH HUB */}
      {/* ============================================================== */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-xl bg-indigo-600/30 border border-indigo-500/50 flex items-center justify-center text-indigo-400">
                <Sparkles className="h-4 w-4" />
              </div>
              <h2 className="text-lg font-bold text-white tracking-tight">
                Simple Ticket Generation &bull; Omnichannel Scenarios
              </h2>
            </div>
            <p className="text-xs text-slate-400">
              Generate tickets as <strong>Student, Staff, Faculty, or Department</strong> via <strong>WhatsApp Call, Message, or Email</strong>.
            </p>
          </div>

          <button
            onClick={onOpenCreateTicketModal}
            className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-lg shadow-indigo-600/30 flex items-center gap-2 transition shrink-0"
          >
            <PlusCircle className="h-4 w-4" /> New Custom Ticket Form
          </button>
        </div>

        {/* 4 1-CLICK INSTANT SCENARIO GENERATORS */}
        <div>
          <p className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <Zap className="h-3.5 w-3.5 text-amber-400" />
            1-Click Incident Scenario Simulators (Instantly sends ticket to Admin Dashboard):
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            
            {/* SCENARIO 1: WHATSAPP CALL */}
            <div 
              onClick={() => handleQuickSimulate('WHATSAPP_CALL')}
              className="group bg-slate-950 p-4 rounded-2xl border border-emerald-500/30 hover:border-emerald-400 cursor-pointer transition shadow-md hover:shadow-emerald-500/10 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/80 border border-emerald-800/60 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <PhoneCall className="h-2.5 w-2.5" /> WhatsApp Call
                  </span>
                  <span className="text-[10px] text-purple-300 font-bold bg-purple-950 px-2 py-0.5 rounded-full">
                    Faculty
                  </span>
                </div>
                <h4 className="text-xs font-bold text-white group-hover:text-emerald-300 transition line-clamp-1">
                  Main Auditorium Audio Failure
                </h4>
                <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">
                  Dr. Arthur Pendelton calls via WhatsApp: HDMI &amp; 4K audio cutting out during chemistry lecture.
                </p>
              </div>
              <div className="pt-3 mt-2 border-t border-slate-900 flex items-center justify-between text-[11px] text-emerald-400 font-semibold">
                <span>Simulate Call Inbound</span>
                <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition" />
              </div>
            </div>

            {/* SCENARIO 2: WHATSAPP MESSAGE */}
            <div 
              onClick={() => handleQuickSimulate('WHATSAPP_CHAT')}
              className="group bg-slate-950 p-4 rounded-2xl border border-teal-500/30 hover:border-teal-400 cursor-pointer transition shadow-md hover:shadow-teal-500/10 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold text-teal-400 bg-teal-950/80 border border-teal-800/60 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <MessageSquare className="h-2.5 w-2.5" /> WhatsApp Msg
                  </span>
                  <span className="text-[10px] text-blue-300 font-bold bg-blue-950 px-2 py-0.5 rounded-full">
                    Student
                  </span>
                </div>
                <h4 className="text-xs font-bold text-white group-hover:text-teal-300 transition line-clamp-1">
                  Science Library Wi-Fi Dropped
                </h4>
                <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">
                  Sophia Martinez messages Aisha bot: eduroam AP dropped near 3rd floor study pods 301-310.
                </p>
              </div>
              <div className="pt-3 mt-2 border-t border-slate-900 flex items-center justify-between text-[11px] text-teal-400 font-semibold">
                <span>Simulate Message Inbound</span>
                <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition" />
              </div>
            </div>

            {/* SCENARIO 3: INBOUND EMAIL */}
            <div 
              onClick={() => handleQuickSimulate('EMAIL')}
              className="group bg-slate-950 p-4 rounded-2xl border border-amber-500/30 hover:border-amber-400 cursor-pointer transition shadow-md hover:shadow-amber-500/10 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold text-amber-400 bg-amber-950/80 border border-amber-800/60 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Mail className="h-2.5 w-2.5" /> Inbound Email
                  </span>
                  <span className="text-[10px] text-amber-300 font-bold bg-amber-950 px-2 py-0.5 rounded-full">
                    Staff
                  </span>
                </div>
                <h4 className="text-xs font-bold text-white group-hover:text-amber-300 transition line-clamp-1">
                  Laser Printer Error 13.02
                </h4>
                <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">
                  David Jenkins (Registrar) emails: HP LaserJet jammed &amp; toner low before graduation batch printing.
                </p>
              </div>
              <div className="pt-3 mt-2 border-t border-slate-900 flex items-center justify-between text-[11px] text-amber-400 font-semibold">
                <span>Simulate Email Inbound</span>
                <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition" />
              </div>
            </div>

            {/* SCENARIO 4: DEPARTMENT REQUEST */}
            <div 
              onClick={() => handleQuickSimulate('DEPARTMENT_REQUEST')}
              className="group bg-slate-950 p-4 rounded-2xl border border-indigo-500/30 hover:border-indigo-400 cursor-pointer transition shadow-md hover:shadow-indigo-500/10 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold text-indigo-400 bg-indigo-950/80 border border-indigo-800/60 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Building2 className="h-2.5 w-2.5" /> Web Request
                  </span>
                  <span className="text-[10px] text-emerald-300 font-bold bg-emerald-950 px-2 py-0.5 rounded-full">
                    Department
                  </span>
                </div>
                <h4 className="text-xs font-bold text-white group-hover:text-indigo-300 transition line-clamp-1">
                  CS Lab 204 Switch &amp; CUDA Nodes
                </h4>
                <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">
                  Computer Science Dept: Switch port mapping and CUDA license tokens needed for Machine Learning lab.
                </p>
              </div>
              <div className="pt-3 mt-2 border-t border-slate-900 flex items-center justify-between text-[11px] text-indigo-400 font-semibold">
                <span>Simulate Dept Request</span>
                <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition" />
              </div>
            </div>

          </div>
        </div>

        {/* RECENT INBOUND INCIDENT PREVIEW */}
        <div className="border-t border-slate-800/80 pt-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-300 flex items-center gap-2">
              <Activity className="h-4 w-4 text-emerald-400" />
              Live Inbound Campus Tickets (Syncing to Admin &amp; Technician Portals):
            </span>
            <span className="text-[11px] text-slate-400 font-mono">
              Total Recorded: <strong className="text-white">{tickets.length}</strong>
            </span>
          </div>

          <div className="space-y-2">
            {tickets.slice(0, 3).map(ticket => (
              <div key={ticket.id} className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono font-bold text-white">{ticket.referenceId}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-800">
                      {ticket.channel}
                    </span>
                    {ticket.requesterType && (
                      <span className="text-[10px] px-1.5 py-0.2 rounded font-bold uppercase bg-blue-950 text-blue-300">
                        {ticket.requesterType}
                      </span>
                    )}
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      ticket.status === 'RESOLVED' 
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                        : ticket.status === 'NEW'
                        ? 'bg-blue-950 text-blue-300 border border-blue-800'
                        : 'bg-amber-950 text-amber-300 border border-amber-800'
                    }`}>
                      {ticket.status}
                    </span>
                  </div>
                  <p className="font-semibold text-slate-200">{ticket.title}</p>
                  <p className="text-[11px] text-slate-400">
                    Requester: <strong>{ticket.requesterName}</strong> &bull; Assignee: <strong className={ticket.assignedTechName ? "text-emerald-400" : "text-amber-400"}>{ticket.assignedTechName || 'Unassigned'}</strong>
                  </p>
                  {ticket.resolutionReason && (
                    <p className="text-[11px] text-emerald-300 bg-emerald-950/40 border border-emerald-800/40 p-1.5 rounded mt-1">
                      ✓ <strong>Work Done:</strong> {ticket.resolutionReason} (by {ticket.resolvedByName})
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => onOpenAuthModal('ADMIN')}
                    className="px-3 py-1.5 rounded-lg bg-purple-950/80 hover:bg-purple-900 border border-purple-800 text-purple-300 text-[11px] font-semibold transition"
                  >
                    Admin Assign &rarr;
                  </button>
                  <button
                    onClick={() => onOpenAuthModal('TECHNICIAN')}
                    className="px-3 py-1.5 rounded-lg bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-800 text-emerald-300 text-[11px] font-semibold transition"
                  >
                    Tech Claim &rarr;
                  </button>
                </div>
              </div>
            ))}
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
              <span className="text-[10px] text-slate-400 font-mono">Student &amp; Facilities</span>
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
                Technician Gate
              </span>
              <span className="text-[10px] text-slate-400 font-mono">Self-Assign &amp; Resolve</span>
            </div>

            <h3 className="text-xl font-bold text-white mb-2">
              Technician Workspace Portal
            </h3>

            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              Dedicated workbench for campus IT engineers. Claim unassigned tickets, bridge live WhatsApp audio calls, and update tickets with work done &amp; root cause reasons.
            </p>

            <ul className="space-y-2 text-xs text-slate-300 border-t border-slate-800/80 pt-4 mb-6">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>1-Click Self-Assign (Claim Unassigned Tickets)</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>Complete Work &amp; Submit Resolution Reason</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>Live WhatsApp Voice Bridging &amp; Call Handling</span>
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
              Executive oversight for IT Directors. Direct technician ticket assignment, real-time resolution telemetry, user verification, and Aisha AI configuration.
            </p>

            <ul className="space-y-2 text-xs text-slate-300 border-t border-slate-800/80 pt-4 mb-6">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>Executive Dashboard with Direct Tech Assignment</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>Live Work Resolution Reason Audit Feed</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>Aisha AI &amp; WhatsApp Helpline Cloud Config</span>
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
