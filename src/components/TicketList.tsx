'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Ticket, TicketPriority, TicketChannel } from '@/types';
import { 
  Filter, 
  Search, 
  PlusCircle, 
  AlertTriangle, 
  Clock, 
  Mail, 
  Phone, 
  Globe, 
  MessageSquare, 
  ShieldAlert,
  CheckCircle2,
  ChevronRight
} from 'lucide-react';

export function TicketList({ 
  onSelectTicket, 
  selectedTicketId,
  initialStatusFilter = 'ALL'
}: { 
  onSelectTicket: (id: string) => void; 
  selectedTicketId?: string;
  initialStatusFilter?: string;
}) {
  const { tickets, departments, currentUser } = useApp();
  const [filterDept, setFilterDept] = useState<string>('ALL');
  const [filterPriority, setFilterPriority] = useState<string>('ALL');
  const [filterStatus, setFilterStatus] = useState<string>(initialStatusFilter);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTickets = tickets.filter(t => {
    // Role isolation: If Student/Faculty, only view own tickets
    if (['STUDENT', 'FACULTY', 'STAFF'].includes(currentUser.role)) {
      if (t.requesterId !== currentUser.id && t.requesterEmail !== currentUser.email) {
        return false;
      }
    }
    
    if (filterDept !== 'ALL' && t.departmentId !== filterDept) return false;
    if (filterPriority !== 'ALL' && t.priority !== filterPriority) return false;
    if (filterStatus !== 'ALL') {
      if (filterStatus === 'RESOLVED' && t.status !== 'RESOLVED' && t.status !== 'CLOSED') return false;
      if (filterStatus === 'NEW' && t.status !== 'NEW') return false;
      if (filterStatus === 'PENDING' && (t.status === 'RESOLVED' || t.status === 'CLOSED' || t.status === 'NEW')) return false;
      if (filterStatus !== 'RESOLVED' && filterStatus !== 'NEW' && filterStatus !== 'PENDING' && t.status !== filterStatus) return false;
    }
    if (searchTerm) {
      const match = t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    t.referenceId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    t.requesterName.toLowerCase().includes(searchTerm.toLowerCase());
      if (!match) return false;
    }
    return true;
  });

  const getChannelBadge = (ch: TicketChannel) => {
    switch (ch) {
      case 'EMAIL':
        return <span className="flex items-center gap-1 text-[10px] text-amber-400 bg-amber-950/60 border border-amber-800/40 px-2 py-0.5 rounded"><Mail className="h-2.5 w-2.5" /> Email</span>;
      case 'WHATSAPP_CALL':
        return <span className="flex items-center gap-1 text-[10px] text-emerald-400 bg-emerald-950/60 border border-emerald-800/40 px-2 py-0.5 rounded"><Phone className="h-2.5 w-2.5" /> WhatsApp Call</span>;
      case 'WHATSAPP_CHAT':
        return <span className="flex items-center gap-1 text-[10px] text-teal-400 bg-teal-950/60 border border-teal-800/40 px-2 py-0.5 rounded"><MessageSquare className="h-2.5 w-2.5" /> WhatsApp Bot</span>;
      default:
        return <span className="flex items-center gap-1 text-[10px] text-indigo-400 bg-indigo-950/60 border border-indigo-800/40 px-2 py-0.5 rounded"><Globe className="h-2.5 w-2.5" /> Web Portal</span>;
    }
  };

  const getPriorityBadge = (p: TicketPriority) => {
    switch (p) {
      case 'P1_CRITICAL':
        return <span className="text-[10px] font-semibold text-rose-300 bg-rose-950 border border-rose-800/50 px-2 py-0.5 rounded">P1 Critical</span>;
      case 'P2_HIGH':
        return <span className="text-[10px] font-semibold text-orange-300 bg-orange-950 border border-orange-800/50 px-2 py-0.5 rounded">P2 High</span>;
      case 'P3_MEDIUM':
        return <span className="text-[10px] font-medium text-amber-300 bg-amber-950/80 border border-amber-800/40 px-2 py-0.5 rounded">P3 Medium</span>;
      default:
        return <span className="text-[10px] font-medium text-slate-300 bg-slate-800 px-2 py-0.5 rounded">P4 Low</span>;
    }
  };

  const getStatusBadge = (status: Ticket['status']) => {
    switch (status) {
      case 'RESOLVED':
      case 'CLOSED':
        return <span className="text-[10px] font-medium text-emerald-300 bg-emerald-950/60 border border-emerald-800/40 px-2 py-0.5 rounded flex items-center gap-1"><CheckCircle2 className="h-2.5 w-2.5" /> {status}</span>;
      case 'PENDING_APPROVAL':
        return <span className="text-[10px] font-medium text-yellow-300 bg-yellow-950/60 border border-yellow-800/40 px-2 py-0.5 rounded flex items-center gap-1"><ShieldAlert className="h-2.5 w-2.5 text-yellow-400" /> 2FA Hold</span>;
      case 'IN_PROGRESS':
        return <span className="text-[10px] font-medium text-blue-300 bg-blue-950/60 border border-blue-800/40 px-2 py-0.5 rounded">In Progress</span>;
      default:
        return <span className="text-[10px] font-medium text-purple-300 bg-purple-950/60 border border-purple-800/40 px-2 py-0.5 rounded">{status}</span>;
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden flex flex-col h-[740px] shadow-xl">
      {/* Search & Filter Toolbar */}
      <div className="p-3.5 border-b border-slate-800 bg-slate-950/60 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <h3 className="text-sm font-semibold text-slate-200">Incident Pipeline</h3>
            <span className="text-xs bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full font-mono">
              {filteredTickets.length}
            </span>
          </div>
          {['STUDENT', 'FACULTY', 'STAFF'].includes(currentUser.role) && (
            <span className="text-[11px] text-indigo-400 bg-indigo-950/60 px-2 py-0.5 rounded border border-indigo-800/40">
              Filtered: Student Context
            </span>
          )}
        </div>

        {/* Search Input */}
        <div className="relative">
          <Search className="h-3.5 w-3.5 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by ID, keyword, requester..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>

        {/* Filter Dropdowns */}
        <div className="grid grid-cols-3 gap-2">
          <select
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
            className="bg-slate-900 border border-slate-800 text-slate-300 text-[11px] rounded px-2 py-1 focus:outline-none focus:border-indigo-500"
          >
            <option value="ALL">All Statuses</option>
            <option value="NEW">New</option>
            <option value="PENDING">Pending / In-Prog</option>
            <option value="RESOLVED">Resolved</option>
          </select>

          <select
            value={filterDept}
            onChange={e => setFilterDept(e.target.value)}
            className="bg-slate-900 border border-slate-800 text-slate-300 text-[11px] rounded px-2 py-1 focus:outline-none focus:border-indigo-500"
          >
            <option value="ALL">All Depts</option>
            {departments.map(d => (
              <option key={d.id} value={d.id}>{d.name.split(' ')[0]}</option>
            ))}
          </select>

          <select
            value={filterPriority}
            onChange={e => setFilterPriority(e.target.value)}
            className="bg-slate-900 border border-slate-800 text-slate-300 text-[11px] rounded px-2 py-1 focus:outline-none focus:border-indigo-500"
          >
            <option value="ALL">All Priorities</option>
            <option value="P1_CRITICAL">P1 Critical</option>
            <option value="P2_HIGH">P2 High</option>
            <option value="P3_MEDIUM">P3 Medium</option>
            <option value="P4_LOW">P4 Low</option>
          </select>
        </div>
      </div>

      {/* Ticket List Items */}
      <div className="flex-1 overflow-y-auto divide-y divide-slate-800/60">
        {filteredTickets.length === 0 ? (
          <div className="p-8 text-center text-slate-500 text-xs">
            No incidents found matching current filters.
          </div>
        ) : (
          filteredTickets.map(ticket => {
            const isSelected = ticket.id === selectedTicketId;
            return (
              <div
                key={ticket.id}
                onClick={() => onSelectTicket(ticket.id)}
                className={`p-3.5 cursor-pointer transition flex flex-col gap-2 ${
                  isSelected 
                    ? 'bg-indigo-950/40 border-l-4 border-indigo-500' 
                    : 'hover:bg-slate-850/40 hover:bg-slate-800/40'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-xs font-semibold text-slate-300">{ticket.referenceId}</span>
                    {getChannelBadge(ticket.channel)}
                  </div>
                  <div className="flex items-center space-x-1.5">
                    {ticket.isSecuritySensitive && (
                      <span className="text-[10px] text-yellow-400 bg-yellow-950/60 border border-yellow-800/40 px-1.5 py-0.5 rounded flex items-center gap-1 font-semibold">
                        <ShieldAlert className="h-2.5 w-2.5" /> 2FA Gated
                      </span>
                    )}
                    {getPriorityBadge(ticket.priority)}
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-medium text-slate-100 line-clamp-1">{ticket.title}</h4>
                  <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">{ticket.description}</p>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                  <span className="truncate max-w-[130px]">{ticket.requesterName}</span>
                  <div className="flex items-center space-x-2">
                    {getStatusBadge(ticket.status)}
                    <ChevronRight className="h-3 w-3 text-slate-600" />
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
