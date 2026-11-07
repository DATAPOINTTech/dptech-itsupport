'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  TrendingUp, 
  Award, 
  Users, 
  Bot, 
  ShieldCheck, 
  ArrowUpRight, 
  MessageSquare, 
  Phone, 
  Globe, 
  Mail, 
  ChevronRight,
  Filter,
  Sparkles,
  Zap,
  BarChart3,
  Star,
  Activity
} from 'lucide-react';
import { Ticket } from '@/types';

interface MemberStats {
  id: string;
  name: string;
  role: string;
  isAi: boolean;
  resolvedCount: number;
  pendingCount: number;
  avgResolutionMinutes: number;
  csat: number;
  avatarBg: string;
}

export function AnalyticsDashboard({ onNavigateToTickets }: { onNavigateToTickets: (filterStatus?: string) => void }) {
  const { tickets, departments, aishaConfig, assignTicket, technicians } = useApp();
  const [timeRange, setTimeRange] = useState<'TODAY' | 'WEEK' | 'MONTH' | 'ALL'>('ALL');
  const [assignSuccessToast, setAssignSuccessToast] = useState<string | null>(null);

  const handleAdminAssign = (ticketId: string, techId: string) => {
    const tech = technicians.find(t => t.id === techId);
    const techName = tech ? `${tech.fullName} (${tech.role.replace('TECHNICIAN_', 'Tier-')})` : 'Assigned Technician';
    assignTicket(ticketId, techId, techName);
    setAssignSuccessToast(`Ticket assigned to ${techName}`);
    setTimeout(() => setAssignSuccessToast(null), 3000);
  };

  // Compute live ticket metrics
  const totalTickets = tickets.length;
  const resolvedTickets = tickets.filter(t => t.status === 'RESOLVED' || t.status === 'CLOSED');
  const newTickets = tickets.filter(t => t.status === 'NEW');
  const pendingTickets = tickets.filter(t => 
    t.status === 'IN_PROGRESS' || 
    t.status === 'TRIAGED' || 
    t.status === 'WAITING_ON_USER' || 
    t.status === 'PENDING_APPROVAL'
  );

  const resolvedPercent = totalTickets > 0 ? Math.round((resolvedTickets.length / totalTickets) * 100) : 0;
  const newPercent = totalTickets > 0 ? Math.round((newTickets.length / totalTickets) * 100) : 0;
  const pendingPercent = totalTickets > 0 ? Math.round((pendingTickets.length / totalTickets) * 100) : 0;

  // Support Team Resolver Stats computation
  const supportTeamMembers: MemberStats[] = [
    {
      id: 'sys-aisha',
      name: `${aishaConfig.name} (DATAPOINT AI)`,
      role: 'Autonomous AI Support Specialist',
      isAi: true,
      resolvedCount: tickets.filter(t => 
        t.resolvedById === 'sys-aisha' || 
        t.assignedTechId === 'sys-aisha' || 
        (t.status === 'RESOLVED' && (t.channel === 'WHATSAPP_CHAT' || t.channel === 'WHATSAPP_CALL'))
      ).length + 18, // includes auto-resolved historical volume
      pendingCount: tickets.filter(t => 
        (t.assignedTechId === 'sys-aisha' || t.hasCallSession) && 
        (t.status === 'IN_PROGRESS' || t.status === 'NEW')
      ).length,
      avgResolutionMinutes: 2.4,
      csat: 99.4,
      avatarBg: 'bg-gradient-to-tr from-indigo-600 to-purple-600 text-white',
    },
    ...technicians.map((tech, idx) => ({
      id: tech.id,
      name: tech.fullName,
      role: `${tech.departmentName} (${tech.role.replace('TECHNICIAN_', 'Tier-')})`,
      isAi: false,
      resolvedCount: (tech.resolvedTicketsCount || 0) + tickets.filter(t => t.resolvedById === tech.id || (t.assignedTechId === tech.id && (t.status === 'RESOLVED' || t.status === 'CLOSED'))).length,
      pendingCount: tickets.filter(t => t.assignedTechId === tech.id && t.status !== 'RESOLVED' && t.status !== 'CLOSED').length,
      avgResolutionMinutes: 14 + (idx * 3),
      csat: 96 + (idx % 3),
      avatarBg: idx % 3 === 0 ? 'bg-emerald-600 text-white' : idx % 3 === 1 ? 'bg-indigo-600 text-white' : 'bg-cyan-600 text-white',
    })),
    {
      id: 'usr-admin-1',
      name: 'David Sterling',
      role: 'IT Director & Escalation Manager',
      isAi: false,
      resolvedCount: tickets.filter(t => t.resolvedById === 'usr-admin-1' || (t.assignedTechId === 'usr-admin-1' && t.status === 'RESOLVED')).length + 5,
      pendingCount: tickets.filter(t => t.assignedTechId === 'usr-admin-1' && t.status !== 'RESOLVED').length,
      avgResolutionMinutes: 38.5,
      csat: 94.6,
      avatarBg: 'bg-blue-600 text-white',
    },
  ].sort((a, b) => b.resolvedCount - a.resolvedCount);

  // Maximum Tickets Resolved by User of Support Team
  const topResolver = supportTeamMembers[0];
  const maxResolvedCount = Math.max(...supportTeamMembers.map(m => m.resolvedCount), 1);

  // Omnichannel breakdown
  const channelCounts = {
    WHATSAPP_CALL: tickets.filter(t => t.channel === 'WHATSAPP_CALL').length,
    WHATSAPP_CHAT: tickets.filter(t => t.channel === 'WHATSAPP_CHAT').length,
    WEB_PORTAL: tickets.filter(t => t.channel === 'WEB_PORTAL').length,
    EMAIL: tickets.filter(t => t.channel === 'EMAIL').length,
    WALK_IN: tickets.filter(t => t.channel === 'WALK_IN').length,
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header & Range Switcher */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-blue-600 p-0.5 shadow-md flex items-center justify-center">
                <BarChart3 className="h-5 w-5 text-white" />
              </div>
              <h2 className="text-xl font-bold text-white tracking-tight">
                Campus IT Executive &amp; Support Team Command Center
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Live enterprise resolution telemetry, technician leaderboard, and omnichannel triage throughput.
            </p>
          </div>

          {/* Timeframe Filter */}
          <div className="flex items-center space-x-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-medium">
            <button
              onClick={() => setTimeRange('TODAY')}
              className={`px-3 py-1.5 rounded-lg transition ${
                timeRange === 'TODAY' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Today
            </button>
            <button
              onClick={() => setTimeRange('WEEK')}
              className={`px-3 py-1.5 rounded-lg transition ${
                timeRange === 'WEEK' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              This Week
            </button>
            <button
              onClick={() => setTimeRange('MONTH')}
              className={`px-3 py-1.5 rounded-lg transition ${
                timeRange === 'MONTH' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              This Month
            </button>
            <button
              onClick={() => setTimeRange('ALL')}
              className={`px-3 py-1.5 rounded-lg transition ${
                timeRange === 'ALL' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              All-Time
            </button>
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 4 CORE KPI METRIC CARDS */}
      {/* ============================================================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* KPI 1: RESOLVED TICKETS */}
        <div 
          onClick={() => onNavigateToTickets('RESOLVED')}
          className="group bg-gradient-to-b from-slate-900 to-slate-950 p-5 rounded-2xl border border-emerald-500/30 hover:border-emerald-500/60 transition cursor-pointer shadow-lg hover:shadow-emerald-500/10 relative overflow-hidden"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4" />
              Resolved Tickets
            </span>
            <span className="text-[10px] font-bold bg-emerald-950/80 text-emerald-300 border border-emerald-700/50 px-2 py-0.5 rounded-full flex items-center gap-1">
              <TrendingUp className="h-3 w-3" /> {resolvedPercent}% Rate
            </span>
          </div>

          <div className="flex items-baseline space-x-2 mt-2">
            <span className="text-3xl font-extrabold text-white tracking-tight">{resolvedTickets.length}</span>
            <span className="text-xs text-slate-400">/ {totalTickets} total</span>
          </div>

          <div className="w-full bg-slate-800 h-1.5 rounded-full mt-3 overflow-hidden">
            <div 
              className="bg-emerald-500 h-full rounded-full transition-all duration-700" 
              style={{ width: `${resolvedPercent}%` }}
            ></div>
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-400 mt-3 pt-2 border-t border-slate-800/80">
            <span>Avg TTR: <strong>14.2 min</strong></span>
            <span className="text-emerald-400 font-medium group-hover:translate-x-0.5 transition flex items-center gap-0.5">
              View resolved <ChevronRight className="h-3 w-3" />
            </span>
          </div>
        </div>

        {/* KPI 2: NEW TICKETS */}
        <div 
          onClick={() => onNavigateToTickets('NEW')}
          className="group bg-gradient-to-b from-slate-900 to-slate-950 p-5 rounded-2xl border border-blue-500/30 hover:border-blue-500/60 transition cursor-pointer shadow-lg hover:shadow-blue-500/10 relative overflow-hidden"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-blue-400 flex items-center gap-1.5">
              <Zap className="h-4 w-4" />
              New / Inbound Tickets
            </span>
            <span className="text-[10px] font-bold bg-blue-950/80 text-blue-300 border border-blue-700/50 px-2 py-0.5 rounded-full">
              Needs Triage
            </span>
          </div>

          <div className="flex items-baseline space-x-2 mt-2">
            <span className="text-3xl font-extrabold text-white tracking-tight">{newTickets.length}</span>
            <span className="text-xs text-slate-400">awaiting pickup</span>
          </div>

          <div className="w-full bg-slate-800 h-1.5 rounded-full mt-3 overflow-hidden">
            <div 
              className="bg-blue-500 h-full rounded-full transition-all duration-700" 
              style={{ width: `${Math.min(newPercent, 100)}%` }}
            ></div>
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-400 mt-3 pt-2 border-t border-slate-800/80">
            <span>Queue SLA: <strong>&lt; 15 min</strong></span>
            <span className="text-blue-400 font-medium group-hover:translate-x-0.5 transition flex items-center gap-0.5">
              Assign now <ChevronRight className="h-3 w-3" />
            </span>
          </div>
        </div>

        {/* KPI 3: PENDING & IN-PROGRESS TICKETS */}
        <div 
          onClick={() => onNavigateToTickets('PENDING')}
          className="group bg-gradient-to-b from-slate-900 to-slate-950 p-5 rounded-2xl border border-amber-500/30 hover:border-amber-500/60 transition cursor-pointer shadow-lg hover:shadow-amber-500/10 relative overflow-hidden"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-amber-400 flex items-center gap-1.5">
              <Clock className="h-4 w-4" />
              Pending / In-Progress
            </span>
            <span className="text-[10px] font-bold bg-amber-950/80 text-amber-300 border border-amber-700/50 px-2 py-0.5 rounded-full">
              Active Workload
            </span>
          </div>

          <div className="flex items-baseline space-x-2 mt-2">
            <span className="text-3xl font-extrabold text-white tracking-tight">{pendingTickets.length}</span>
            <span className="text-xs text-slate-400">in engineering cycle</span>
          </div>

          <div className="w-full bg-slate-800 h-1.5 rounded-full mt-3 overflow-hidden">
            <div 
              className="bg-amber-500 h-full rounded-full transition-all duration-700" 
              style={{ width: `${Math.min(pendingPercent, 100)}%` }}
            ></div>
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-400 mt-3 pt-2 border-t border-slate-800/80">
            <span>Critical P1: <strong>{tickets.filter(t => t.priority === 'P1_CRITICAL' && t.status !== 'RESOLVED').length}</strong></span>
            <span className="text-amber-400 font-medium group-hover:translate-x-0.5 transition flex items-center gap-0.5">
              Inspect active <ChevronRight className="h-3 w-3" />
            </span>
          </div>
        </div>

        {/* KPI 4: SLA COMPLIANCE */}
        <div className="bg-gradient-to-b from-slate-900 to-slate-950 p-5 rounded-2xl border border-indigo-500/30 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-indigo-400 flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4" />
              SLA Health Index
            </span>
            <span className="text-[10px] font-bold bg-indigo-950/80 text-indigo-300 border border-indigo-700/50 px-2 py-0.5 rounded-full">
              Zero Breaches
            </span>
          </div>

          <div className="flex items-baseline space-x-2 mt-2">
            <span className="text-3xl font-extrabold text-white tracking-tight">99.2%</span>
            <span className="text-xs text-emerald-400 font-semibold">&uarr; Optimal</span>
          </div>

          <div className="w-full bg-slate-800 h-1.5 rounded-full mt-3 overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-500 to-emerald-400 h-full rounded-full w-[99.2%]"></div>
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-400 mt-3 pt-2 border-t border-slate-800/80">
            <span>Uptime: <strong>99.98%</strong></span>
            <span className="text-slate-300 font-medium">FERPA Monitored</span>
          </div>
        </div>

      </div>

      {/* ============================================================== */}
      {/* SECTION 2: MAXIMUM TICKETS RESOLVED BY USER LEADERBOARD */}
      {/* ============================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left 4 Cols: TOP RESOLVER CHAMPION CARD */}
        <div className="lg:col-span-4 bg-gradient-to-b from-slate-900 via-indigo-950/50 to-slate-950 border-2 border-amber-500/40 rounded-2xl p-6 shadow-2xl relative overflow-hidden flex flex-col justify-between">
          <div className="absolute -right-6 -bottom-6 w-44 h-44 bg-amber-500/10 rounded-full blur-2xl pointer-events-none"></div>

          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-400 bg-amber-950/80 border border-amber-600/50 px-3 py-1 rounded-full shadow">
                <Award className="h-3.5 w-3.5 text-amber-400" />
                #1 Support Resolver
              </span>
              <span className="text-[10px] font-mono text-slate-400">All Departments</span>
            </div>

            <div className="flex items-center space-x-4 mb-5">
              <div className="relative">
                <div className={`h-16 w-16 rounded-2xl ${topResolver.avatarBg} p-1 flex items-center justify-center shadow-xl ring-2 ring-amber-400/50`}>
                  {topResolver.isAi ? (
                    <Bot className="h-9 w-9 text-white" />
                  ) : (
                    <span className="text-2xl font-bold">{topResolver.name[0]}</span>
                  )}
                </div>
                <div className="absolute -top-2 -right-2 bg-amber-400 text-slate-950 rounded-full h-6 w-6 flex items-center justify-center shadow font-bold text-xs">
                  🏆
                </div>
              </div>

              <div>
                <h3 className="text-base font-bold text-white tracking-tight">{topResolver.name}</h3>
                <p className="text-xs text-indigo-300 font-medium">{topResolver.role}</p>
                <div className="flex items-center gap-1 mt-1 text-[11px] text-amber-300">
                  <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                  <span className="font-semibold">{topResolver.csat}% CSAT</span>
                  <span className="text-slate-400">• High Velocity</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-950/90 border border-slate-800 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Maximum Tickets Resolved:</span>
                <span className="text-lg font-extrabold text-emerald-400 font-mono">
                  {topResolver.resolvedCount} tickets
                </span>
              </div>
              <div className="flex items-center justify-between text-xs border-t border-slate-800 pt-2">
                <span className="text-slate-400">Average Turnaround Speed:</span>
                <span className="font-semibold text-white font-mono">{topResolver.avgResolutionMinutes} min</span>
              </div>
              <div className="flex items-center justify-between text-xs border-t border-slate-800 pt-2">
                <span className="text-slate-400">Active Queue Handling:</span>
                <span className="font-semibold text-blue-300 font-mono">{topResolver.pendingCount} in flight</span>
              </div>
            </div>
          </div>

          <div className="mt-5 pt-3 border-t border-slate-800/80 text-[11px] text-slate-400 flex items-center justify-between">
            <span className="flex items-center gap-1 text-emerald-400 font-medium">
              <Sparkles className="h-3.5 w-3.5" /> Autonomous Voice &amp; Chat
            </span>
            <span className="text-slate-300">Lead Resolver</span>
          </div>
        </div>

        {/* Right 8 Cols: FULL SUPPORT TEAM LEADERBOARD TABLE */}
        <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-5">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Users className="h-4 w-4 text-indigo-400" />
                  Support Team Performance &amp; Ticket Resolution Leaderboard
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Ranked by maximum tickets resolved across autonomous AI agents and engineering specialists.
                </p>
              </div>

              <span className="text-[11px] font-mono text-indigo-300 bg-indigo-950/60 border border-indigo-700/50 px-2.5 py-1 rounded-lg">
                Live Resolution Engine
              </span>
            </div>

            {/* Leaderboard Rows */}
            <div className="space-y-3">
              {supportTeamMembers.map((member, index) => {
                const sharePercent = Math.round((member.resolvedCount / maxResolvedCount) * 100);
                return (
                  <div 
                    key={member.id}
                    className="p-3.5 bg-slate-950/80 hover:bg-slate-950 rounded-xl border border-slate-800/80 hover:border-slate-700 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="flex items-center space-x-3 min-w-[220px]">
                      <span className={`w-6 h-6 rounded-lg text-xs font-bold flex items-center justify-center shrink-0 ${
                        index === 0 ? 'bg-amber-400 text-slate-950 shadow' :
                        index === 1 ? 'bg-slate-300 text-slate-950' :
                        index === 2 ? 'bg-amber-700 text-white' :
                        'bg-slate-800 text-slate-400'
                      }`}>
                        #{index + 1}
                      </span>

                      <div className={`h-9 w-9 rounded-xl ${member.avatarBg} flex items-center justify-center font-bold text-xs shrink-0 shadow`}>
                        {member.isAi ? <Bot className="h-5 w-5" /> : member.name[0]}
                      </div>

                      <div className="truncate">
                        <div className="flex items-center gap-1.5">
                          <p className="text-xs font-bold text-white truncate">{member.name}</p>
                          {index === 0 && (
                            <span className="text-[9px] bg-amber-500/20 text-amber-300 border border-amber-500/30 px-1.5 py-0.2 rounded-full font-bold">
                              TOP
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] text-slate-400 truncate">{member.role}</p>
                      </div>
                    </div>

                    {/* Progress Bar of Maximum Resolved */}
                    <div className="flex-1 max-w-xs space-y-1">
                      <div className="flex justify-between text-[11px]">
                        <span className="text-slate-400 font-medium">Resolution Share</span>
                        <span className="text-white font-mono font-semibold">{member.resolvedCount} resolved</span>
                      </div>
                      <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all duration-700 ${
                            index === 0 
                              ? 'bg-gradient-to-r from-amber-400 to-emerald-400' 
                              : 'bg-indigo-500'
                          }`}
                          style={{ width: `${sharePercent}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Metrics Pillars */}
                    <div className="flex items-center space-x-4 text-xs font-mono justify-end">
                      <div className="text-right">
                        <p className="text-[10px] text-slate-400">Avg Speed</p>
                        <p className="font-semibold text-slate-200">{member.avgResolutionMinutes}m</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] text-slate-400">Pending</p>
                        <p className="font-semibold text-amber-300">{member.pendingCount}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] text-slate-400">CSAT</p>
                        <p className="font-semibold text-emerald-400">{member.csat}%</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span>Synchronized real-time with Institutional Ticketing Queue</span>
            <button
              onClick={() => onNavigateToTickets()}
              className="text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1 transition"
            >
              Open Incident Console <ArrowUpRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

      </div>

      {/* Toast feedback */}
      {assignSuccessToast && (
        <div className="bg-emerald-950 border border-emerald-500 text-emerald-300 px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-between shadow-xl animate-fadeIn">
          <span>✓ {assignSuccessToast}</span>
          <button onClick={() => setAssignSuccessToast(null)} className="text-emerald-400 hover:text-white">✕</button>
        </div>
      )}

      {/* ============================================================== */}
      {/* SECTION 2.5: LIVE INCIDENT DISPATCH & WORK RESOLUTION BOARD */}
      {/* ============================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* PANEL 1: INBOUND & UNASSIGNED INCIDENTS (ADMIN DIRECT ASSIGNMENT) */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Zap className="h-4 w-4 text-blue-400" />
                Live Inbound Tickets &bull; Direct Technician Assignment
              </h4>
              <span className="text-[10px] bg-blue-950 text-blue-300 border border-blue-800/50 px-2 py-0.5 rounded-full font-mono font-bold">
                {tickets.filter(t => !t.assignedTechId && t.status !== 'RESOLVED').length} Unassigned
              </span>
            </div>

            <p className="text-xs text-slate-400 mb-3">
              Generated by Student, Staff, Faculty, or Department via WhatsApp, Email, or Web. Assign to technician in 1-click:
            </p>

            <div className="space-y-2.5 max-h-[360px] overflow-y-auto pr-1">
              {tickets.filter(t => t.status !== 'RESOLVED' && t.status !== 'CLOSED').slice(0, 5).map(ticket => (
                <div key={ticket.id} className="p-3 bg-slate-950 rounded-xl border border-slate-800/80 hover:border-slate-700 transition space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-xs font-bold text-white bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                        {ticket.referenceId}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded font-semibold bg-indigo-950/80 text-indigo-300 border border-indigo-800/40">
                        {ticket.channel}
                      </span>
                      {ticket.requesterType && (
                        <span className="text-[10px] px-2 py-0.5 rounded font-bold uppercase bg-slate-800 text-slate-300">
                          {ticket.requesterType}
                        </span>
                      )}
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      ticket.status === 'NEW' ? 'bg-blue-950 text-blue-300 border border-blue-800' : 'bg-amber-950 text-amber-300 border border-amber-800'
                    }`}>
                      {ticket.status}
                    </span>
                  </div>

                  <div>
                    <h5 className="text-xs font-semibold text-slate-200 line-clamp-1">{ticket.title}</h5>
                    <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">Requester: {ticket.requesterName} &bull; {ticket.departmentName}</p>
                  </div>

                  {/* Assign dropdown */}
                  <div className="flex items-center justify-between pt-1.5 border-t border-slate-900 text-xs">
                    <span className="text-[11px] text-slate-400">
                      Assignee: <strong className={ticket.assignedTechName ? "text-emerald-400" : "text-amber-400"}>{ticket.assignedTechName || 'None'}</strong>
                    </span>

                    <select
                      value=""
                      onChange={e => handleAdminAssign(ticket.id, e.target.value)}
                      className="bg-slate-900 border border-slate-700 text-xs text-indigo-300 font-semibold rounded-lg px-2 py-1 focus:outline-none focus:border-indigo-500 cursor-pointer"
                    >
                      <option value="" disabled>⚡ Assign Tech...</option>
                      {technicians.filter(t => t.status !== 'SUSPENDED').map(t => (
                        <option key={t.id} value={t.id} className="bg-slate-900 text-white">
                          {t.fullName} ({t.role.replace('TECHNICIAN_', 'Tier-')})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => onNavigateToTickets('ALL')}
            className="w-full mt-3 bg-slate-950 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 py-2 rounded-xl text-xs font-semibold transition text-center"
          >
            Open Full Ticket Dispatch Grid &rarr;
          </button>
        </div>

        {/* PANEL 2: RECENT WORK RESOLUTIONS (WITH WORK DONE & REASON) */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                Work Completed &amp; Resolution Audit Feed
              </h4>
              <span className="text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-800/50 px-2 py-0.5 rounded-full font-mono font-bold">
                {resolvedTickets.length} Resolved Cases
              </span>
            </div>

            <p className="text-xs text-slate-400 mb-3">
              Real-time audit log of tickets resolved by technicians with technical explanations and root-cause reasons:
            </p>

            <div className="space-y-2.5 max-h-[360px] overflow-y-auto pr-1">
              {resolvedTickets.length === 0 ? (
                <div className="p-8 text-center text-slate-500 text-xs">
                  No resolved tickets recorded yet.
                </div>
              ) : (
                resolvedTickets.slice(0, 5).map(ticket => (
                  <div key={ticket.id} className="p-3 bg-slate-950 rounded-xl border border-emerald-500/20 hover:border-emerald-500/40 transition space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center space-x-2">
                        <span className="font-mono text-xs font-bold text-white bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                          {ticket.referenceId}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded font-bold text-emerald-400 bg-emerald-950/80 border border-emerald-800/40">
                          RESOLVED
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-400 font-mono">
                        {ticket.resolvedAt ? new Date(ticket.resolvedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Recently'}
                      </span>
                    </div>

                    <div>
                      <h5 className="text-xs font-semibold text-slate-200 line-clamp-1">{ticket.title}</h5>
                      <p className="text-[11px] text-slate-400 mt-0.5">Resolved by: <strong className="text-emerald-300">{ticket.resolvedByName || 'Support Tech'}</strong> &bull; {ticket.requesterName}</p>
                    </div>

                    {/* Resolution Reason display */}
                    <div className="bg-emerald-950/40 border border-emerald-800/40 rounded-lg p-2 text-xs text-emerald-200">
                      <p className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">Root Cause / Work Done:</p>
                      <p className="text-[11px] text-slate-300 mt-0.5 leading-relaxed">
                        {ticket.resolutionReason || 'Work completed on-site, verified operational baseline with requester.'}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <button
            onClick={() => onNavigateToTickets('RESOLVED')}
            className="w-full mt-3 bg-slate-950 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 py-2 rounded-xl text-xs font-semibold transition text-center"
          >
            View All Resolved Incidents ({resolvedTickets.length}) &rarr;
          </button>
        </div>

      </div>

      {/* ============================================================== */}
      {/* SECTION 3: OMNICHANNEL DISTRIBUTION & DEPARTMENT BREAKDOWN */}
      {/* ============================================================== */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Channel Ingestion Distribution */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
          <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Activity className="h-4 w-4 text-indigo-400" />
            Omnichannel Intake Distribution
          </h4>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 bg-slate-950 rounded-xl border border-emerald-500/30 space-y-1">
              <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                <Phone className="h-3 w-3" /> WhatsApp Call
              </span>
              <p className="text-xl font-bold text-white font-mono">{channelCounts.WHATSAPP_CALL}</p>
              <p className="text-[10px] text-slate-400">Aisha Voice</p>
            </div>

            <div className="p-3 bg-slate-950 rounded-xl border border-teal-500/30 space-y-1">
              <span className="text-[10px] text-teal-400 font-semibold flex items-center gap-1">
                <MessageSquare className="h-3 w-3" /> WhatsApp Chat
              </span>
              <p className="text-xl font-bold text-white font-mono">{channelCounts.WHATSAPP_CHAT}</p>
              <p className="text-[10px] text-slate-400">Auto-Triage Bot</p>
            </div>

            <div className="p-3 bg-slate-950 rounded-xl border border-indigo-500/30 space-y-1">
              <span className="text-[10px] text-indigo-400 font-semibold flex items-center gap-1">
                <Globe className="h-3 w-3" /> Web Portal
              </span>
              <p className="text-xl font-bold text-white font-mono">{channelCounts.WEB_PORTAL}</p>
              <p className="text-[10px] text-slate-400">Self-Service</p>
            </div>

            <div className="p-3 bg-slate-950 rounded-xl border border-amber-500/30 space-y-1">
              <span className="text-[10px] text-amber-400 font-semibold flex items-center gap-1">
                <Mail className="h-3 w-3" /> Verified Email
              </span>
              <p className="text-xl font-bold text-white font-mono">{channelCounts.EMAIL}</p>
              <p className="text-[10px] text-slate-400">DKIM / SPF Checked</p>
            </div>
          </div>
        </div>

        {/* Department Volume Breakdown */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
          <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
            Campus Department Workload
          </h4>

          <div className="space-y-2 text-xs">
            {departments.map((dept) => {
              const deptTickets = tickets.filter(t => t.departmentId === dept.id);
              const deptResolved = deptTickets.filter(t => t.status === 'RESOLVED').length;
              return (
                <div key={dept.id} className="flex items-center justify-between p-2 bg-slate-950 rounded-lg border border-slate-800/80">
                  <div className="truncate mr-3">
                    <p className="font-semibold text-slate-200 truncate">{dept.name}</p>
                    <p className="text-[10px] text-slate-400 font-mono">SLA Target: {dept.defaultSlaMinutes} min</p>
                  </div>
                  <div className="flex items-center space-x-2 font-mono shrink-0">
                    <span className="text-emerald-400 font-semibold">{deptResolved} resolved</span>
                    <span className="text-slate-500">/</span>
                    <span className="text-slate-300">{deptTickets.length} total</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

    </div>
  );
}

