'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { TicketList } from '@/components/TicketList';
import { TicketDetailPane } from '@/components/TicketDetailPane';
import { WhatsAppCallStudio } from '@/components/WhatsAppCallStudio';
import { 
  Wrench, 
  CheckCircle2, 
  Clock, 
  PhoneCall, 
  LayoutDashboard, 
  Users, 
  ShieldCheck, 
  Zap, 
  Star, 
  Activity, 
  ArrowLeft,
  UserPlus,
  Check,
  Inbox
} from 'lucide-react';

export function TechnicianWorkspace({ onReturnToLanding }: { onReturnToLanding: () => void }) {
  const { currentUser, tickets, activeCall, departments, assignTicket } = useApp();
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>('tkt-101');
  const [techTab, setTechTab] = useState<'QUEUE' | 'CALL_STUDIO'>('QUEUE');
  const [queueFilter, setQueueFilter] = useState<'ALL' | 'UNASSIGNED' | 'MY_ASSIGNED' | 'RESOLVED'>('ALL');

  const dept = departments.find(d => d.id === currentUser.departmentId);

  // Tickets filtered by scope
  const unassignedTickets = tickets.filter(t => !t.assignedTechId && t.status !== 'RESOLVED' && t.status !== 'CLOSED');
  const myAssignedTickets = tickets.filter(t => t.assignedTechId === currentUser.id);
  const myActiveWork = myAssignedTickets.filter(t => t.status !== 'RESOLVED' && t.status !== 'CLOSED');
  const myResolvedTickets = tickets.filter(t => t.resolvedById === currentUser.id || (t.assignedTechId === currentUser.id && t.status === 'RESOLVED'));
  const myResolvedCount = myResolvedTickets.length;

  return (
    <div className="space-y-6">
      
      {/* Technician Header Banner */}
      <div className="bg-gradient-to-r from-emerald-950/80 via-slate-900 to-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          
          <div className="flex items-center space-x-4">
            <div className="h-14 w-14 rounded-2xl bg-emerald-600/30 border border-emerald-500/50 flex items-center justify-center text-emerald-400 shadow-lg shadow-emerald-600/20">
              <Wrench className="h-7 w-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-white tracking-tight">
                  Technician Operations Workspace &bull; {currentUser.fullName}
                </h2>
                <span className="text-[10px] uppercase font-bold bg-emerald-900/60 text-emerald-300 border border-emerald-700/50 px-2.5 py-0.5 rounded-full">
                  {currentUser.role}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Functional Scope: <strong className="text-slate-200">{dept?.name || 'All Campus Infrastructure'}</strong> &bull; Campus ID: <code className="text-indigo-300">{currentUser.campusId}</code>
              </p>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center gap-3">
            <div 
              onClick={() => { setTechTab('QUEUE'); setQueueFilter('RESOLVED'); }}
              className="bg-slate-950 p-3 rounded-xl border border-emerald-500/30 text-center min-w-[90px] cursor-pointer hover:border-emerald-400 transition"
              title="Click to view resolved tickets with reasons"
            >
              <p className="text-[10px] text-emerald-400 font-semibold">My Resolved</p>
              <p className="text-xl font-bold text-white font-mono">{myResolvedCount + 12}</p>
            </div>
            <div 
              onClick={() => { setTechTab('QUEUE'); setQueueFilter('MY_ASSIGNED'); }}
              className="bg-slate-950 p-3 rounded-xl border border-amber-500/30 text-center min-w-[90px] cursor-pointer hover:border-amber-400 transition"
              title="Click to view my active assignments"
            >
              <p className="text-[10px] text-amber-400 font-semibold">My Active Queue</p>
              <p className="text-xl font-bold text-white font-mono">{myActiveWork.length}</p>
            </div>
            <div 
              onClick={() => { setTechTab('QUEUE'); setQueueFilter('UNASSIGNED'); }}
              className="bg-slate-950 p-3 rounded-xl border border-blue-500/30 text-center min-w-[90px] cursor-pointer hover:border-blue-400 transition"
              title="Click to view unassigned tickets ready to claim"
            >
              <p className="text-[10px] text-blue-400 font-semibold">Ready to Claim</p>
              <p className="text-xl font-bold text-white font-mono">{unassignedTickets.length}</p>
            </div>
          </div>
        </div>

        {/* Workspace Toolbar & Filter Pills */}
        <div className="flex flex-wrap items-center justify-between gap-3 mt-6 pt-5 border-t border-slate-800/80 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setTechTab('QUEUE')}
              className={`px-3.5 py-2 rounded-xl flex items-center gap-2 transition font-semibold ${
                techTab === 'QUEUE'
                  ? 'bg-emerald-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <LayoutDashboard className="h-4 w-4" /> Incident Workbench ({tickets.length})
            </button>
            <button
              onClick={() => setTechTab('CALL_STUDIO')}
              className={`px-3.5 py-2 rounded-xl flex items-center gap-2 transition font-semibold ${
                techTab === 'CALL_STUDIO'
                  ? 'bg-emerald-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <PhoneCall className="h-4 w-4" /> WhatsApp Voice Bridge
              {activeCall && <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping"></span>}
            </button>
          </div>

          <button
            onClick={onReturnToLanding}
            className="text-slate-400 hover:text-white flex items-center gap-1.5 transition text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-slate-800"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Return to Central Portal
          </button>
        </div>
      </div>

      {/* QUICK QUEUE FILTER CHIPS FOR TECHNICIAN */}
      {techTab === 'QUEUE' && (
        <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900 border border-slate-800 p-3 rounded-xl">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-400">Queue View:</span>
            <button
              onClick={() => setQueueFilter('ALL')}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition ${
                queueFilter === 'ALL'
                  ? 'bg-indigo-600 text-white shadow'
                  : 'bg-slate-950 text-slate-400 hover:text-slate-200'
              }`}
            >
              All Tickets ({tickets.length})
            </button>
            <button
              onClick={() => setQueueFilter('UNASSIGNED')}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition flex items-center gap-1 ${
                queueFilter === 'UNASSIGNED'
                  ? 'bg-blue-600 text-white shadow'
                  : 'bg-slate-950 text-slate-400 hover:text-slate-200'
              }`}
            >
              <Inbox className="h-3 w-3" /> Unassigned &bull; Claim Yourself ({unassignedTickets.length})
            </button>
            <button
              onClick={() => setQueueFilter('MY_ASSIGNED')}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition flex items-center gap-1 ${
                queueFilter === 'MY_ASSIGNED'
                  ? 'bg-amber-600 text-white shadow'
                  : 'bg-slate-950 text-slate-400 hover:text-slate-200'
              }`}
            >
              <Wrench className="h-3 w-3" /> Assigned to Me ({myActiveWork.length})
            </button>
            <button
              onClick={() => setQueueFilter('RESOLVED')}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition flex items-center gap-1 ${
                queueFilter === 'RESOLVED'
                  ? 'bg-emerald-600 text-white shadow'
                  : 'bg-slate-950 text-slate-400 hover:text-slate-200'
              }`}
            >
              <Check className="h-3 w-3" /> My Resolved ({myResolvedCount})
            </button>
          </div>

          {unassignedTickets.length > 0 && (
            <div className="text-xs text-blue-300 bg-blue-950/60 border border-blue-800/50 px-2.5 py-1 rounded-lg flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-blue-400 animate-pulse"></span>
              <span>{unassignedTickets.length} new incidents waiting to be claimed</span>
            </div>
          )}
        </div>
      )}

      {/* Workspace Views */}
      {techTab === 'QUEUE' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5">
            <TicketList
              selectedTicketId={selectedTicketId || undefined}
              onSelectTicket={(id) => setSelectedTicketId(id)}
              initialStatusFilter={queueFilter === 'RESOLVED' ? 'RESOLVED' : queueFilter === 'UNASSIGNED' ? 'NEW' : 'ALL'}
            />
          </div>
          <div className="lg:col-span-7">
            <TicketDetailPane ticketId={selectedTicketId} />
          </div>
        </div>
      )}

      {techTab === 'CALL_STUDIO' && (
        <WhatsAppCallStudio
          onOpenTicket={(tktId) => {
            setSelectedTicketId(tktId);
            setTechTab('QUEUE');
          }}
        />
      )}

    </div>
  );
}
