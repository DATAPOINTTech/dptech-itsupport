'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Ticket, TicketComment, TicketPriority, TicketStatus } from '@/types';
import { 
  CheckCircle2, 
  Send, 
  Lock, 
  Clock, 
  ShieldCheck, 
  ShieldAlert, 
  AlertOctagon, 
  MessageSquare, 
  KeyRound, 
  UserPlus, 
  FileCheck,
  CornerDownRight,
  Radio,
  FileCode,
  Sparkles,
  Wrench,
  UserCheck,
  Check
} from 'lucide-react';

export function TicketDetailPane({ ticketId }: { ticketId: string | null }) {
  const { 
    tickets, 
    comments, 
    currentUser, 
    updateTicketStatus, 
    assignTicket, 
    resolveTicket,
    addComment, 
    resolveSecurityAction,
    technicians
  } = useApp();

  const [commentText, setCommentText] = useState('');
  const [isInternalNote, setIsInternalNote] = useState(false);
  
  // Resolution Dialog state
  const [showResolutionDialog, setShowResolutionDialog] = useState(false);
  const [resolutionReason, setResolutionReason] = useState('');

  // Security challenge state
  const [showSecurityDialog, setShowSecurityDialog] = useState(false);
  const [challengePin, setChallengePin] = useState('');
  const [securityError, setSecurityError] = useState('');

  const ticket = tickets.find(t => t.id === ticketId);
  const ticketComments = ticketId ? comments[ticketId] || [] : [];

  if (!ticket) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-xl h-[740px] flex items-center justify-center p-8 text-center shadow-xl">
        <div className="max-w-sm space-y-3">
          <div className="h-12 w-12 rounded-full bg-slate-800 flex items-center justify-center mx-auto text-slate-500">
            <MessageSquare className="h-6 w-6" />
          </div>
          <h4 className="text-sm font-medium text-slate-300">Select an Incident Ticket</h4>
          <p className="text-xs text-slate-500">
            Choose a ticket from the left panel to inspect the timeline, audit history, transcripts, assign technicians, and record work resolutions.
          </p>
        </div>
      </div>
    );
  }

  const handlePostComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    addComment(ticket.id, commentText, isInternalNote);
    setCommentText('');
  };

  const handleClaimTicket = () => {
    assignTicket(ticket.id, currentUser.id, currentUser.fullName);
  };

  const handleAdminAssign = (techId: string) => {
    const tech = technicians.find(t => t.id === techId);
    if (tech) {
      assignTicket(ticket.id, tech.id, `${tech.fullName} (${tech.role.replace('TECHNICIAN_', 'Tier-')})`);
    }
  };

  const handleOpenResolveModal = () => {
    if (ticket.isSecuritySensitive) {
      setShowSecurityDialog(true);
    } else {
      setShowResolutionDialog(true);
    }
  };

  const handleConfirmResolution = (e: React.FormEvent) => {
    e.preventDefault();
    const reason = resolutionReason.trim() || 'Work completed successfully on-site, verified operational baseline with requester.';
    resolveTicket(ticket.id, reason, currentUser.id, currentUser.fullName);
    setShowResolutionDialog(false);
    setResolutionReason('');
  };

  const handleVerifyAndResolve = (e: React.FormEvent) => {
    e.preventDefault();
    setSecurityError('');
    const success = resolveSecurityAction(ticket.id, challengePin);
    if (success) {
      setShowSecurityDialog(false);
      setChallengePin('');
      setShowResolutionDialog(true);
    } else {
      setSecurityError('Invalid Out-of-Band Challenge Token. Please verify Microsoft Entra / Duo push.');
    }
  };

  const presetReasons = [
    'Replaced damaged patch cable on rack switch port, confirmed 1Gbps link negotiation and DHCP lease.',
    'Recalibrated classroom projector HDMI matrix, updated firmware, and verified 4K video + audio output.',
    'Replaced toner cartridge, cleared roller paper jam, and successfully printed diagnostic test page.',
    'Re-synced Microsoft Entra / Duo MFA hardware token and validated student sign-in to campus portal.',
    'Rebooted edge access point, cleared stale client ARP cache, and validated Wi-Fi RSSI signal at -52 dBm.'
  ];

  const isResolved = ticket.status === 'RESOLVED' || ticket.status === 'CLOSED';

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden flex flex-col h-[740px] shadow-xl">
      
      {/* Ticket Header & Status Banner */}
      <div className="p-4 border-b border-slate-800 bg-slate-950/70 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <span className="font-mono text-sm font-bold text-white bg-slate-800 px-2.5 py-0.5 rounded border border-slate-700">
              {ticket.referenceId}
            </span>
            <span className="text-xs text-slate-400">
              via <strong className="text-slate-200">{ticket.channel}</strong>
            </span>
            <span className="text-xs text-slate-500">
              &bull; {new Date(ticket.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-2">
            
            {/* Admin: Quick Assign Dropdown */}
            {currentUser.role === 'ADMIN' && !isResolved && (
              <div className="flex items-center space-x-1.5 bg-slate-900 border border-slate-700 rounded-lg px-2 py-1">
                <span className="text-[10px] text-slate-400 font-semibold uppercase">Assign:</span>
                <select
                  value=""
                  onChange={e => handleAdminAssign(e.target.value)}
                  className="bg-transparent text-xs text-indigo-300 font-medium focus:outline-none cursor-pointer"
                >
                  <option value="" disabled>Select Technician...</option>
                  {technicians.filter(t => t.status !== 'SUSPENDED').map(t => (
                    <option key={t.id} value={t.id} className="bg-slate-900 text-white">
                      {t.fullName} ({t.role.replace('TECHNICIAN_', 'Tier-')})
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Technician: Self-Assign Button */}
            {!ticket.assignedTechId && ['TECHNICIAN_T1', 'TECHNICIAN_T2', 'TECHNICIAN_T3'].includes(currentUser.role) && (
              <button
                onClick={handleClaimTicket}
                className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow-md shadow-emerald-600/30 transition"
              >
                <UserPlus className="h-3.5 w-3.5" /> Assign to Myself
              </button>
            )}

            {/* Complete Work & Resolve Button */}
            {!isResolved && !['STUDENT', 'FACULTY', 'STAFF'].includes(currentUser.role) && (
              <button
                onClick={handleOpenResolveModal}
                className={`text-xs font-bold px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 shadow transition ${
                  ticket.isSecuritySensitive 
                    ? 'bg-amber-600 hover:bg-amber-500 text-white' 
                    : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                }`}
              >
                {ticket.isSecuritySensitive ? <Lock className="h-3.5 w-3.5" /> : <CheckCircle2 className="h-3.5 w-3.5" />}
                {ticket.isSecuritySensitive ? 'Verify & Resolve (2FA)' : 'Complete Work & Resolve'}
              </button>
            )}

            {/* Resolved Badge */}
            {isResolved && (
              <span className="text-xs font-bold text-emerald-400 bg-emerald-950/80 border border-emerald-800/60 px-3 py-1 rounded-lg flex items-center gap-1.5 shadow-inner">
                <CheckCircle2 className="h-4 w-4" /> Incident Resolved
              </span>
            )}
          </div>
        </div>

        {/* Title & Metadata */}
        <div>
          <h2 className="text-base font-semibold text-slate-100">{ticket.title}</h2>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-xs text-slate-400">
            <span>Requester: <strong className="text-slate-200">{ticket.requesterName}</strong> {ticket.requesterType && <code className="text-[10px] text-blue-400 font-mono">({ticket.requesterType})</code>}</span>
            <span>Department: <strong className="text-indigo-400">{ticket.departmentName}</strong></span>
            <span>Assignee: <strong className={ticket.assignedTechName ? "text-emerald-400" : "text-amber-400"}>{ticket.assignedTechName || 'Unassigned'}</strong></span>
          </div>
        </div>

        {/* PROMINENT WORK DONE & RESOLUTION REASON BANNER */}
        {ticket.resolutionReason && (
          <div className="bg-emerald-950/70 border border-emerald-500/60 rounded-xl p-3 text-xs text-emerald-200 shadow-md animate-fadeIn">
            <div className="flex items-center justify-between font-bold text-emerald-300 mb-1">
              <span className="flex items-center gap-1.5">
                <Check className="h-4 w-4 text-emerald-400" /> Work Completed &amp; Resolution Reason:
              </span>
              <span className="text-[10px] text-emerald-400 font-mono font-normal">
                Resolved by: {ticket.resolvedByName || 'Support Tech'} &bull; {ticket.resolvedAt ? new Date(ticket.resolvedAt).toLocaleTimeString() : 'Recently'}
              </span>
            </div>
            <p className="text-slate-200 bg-slate-950/60 p-2.5 rounded-lg border border-emerald-800/40 text-xs leading-relaxed font-sans">
              {ticket.resolutionReason}
            </p>
          </div>
        )}

        {/* Sensitive Security Notice Banner */}
        {ticket.isSecuritySensitive && !isResolved && (
          <div className="bg-amber-950/40 border border-amber-600/40 rounded-lg p-2.5 flex items-start space-x-2 text-xs text-amber-200">
            <ShieldAlert className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Security-Sensitive Incident Detected</p>
              <p className="text-[11px] text-amber-300/80">
                Involves institutional credentials or MFA device reconfiguration. An Out-of-Band verification challenge is required prior to ticket closure.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Ticket Details & Comments Stream */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        
        {/* Original Description */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3.5">
          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Original Incident Description</p>
          <p className="text-xs text-slate-200 leading-relaxed whitespace-pre-wrap">{ticket.description}</p>
        </div>

        {/* Comment Thread */}
        <div className="space-y-3">
          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Communication &amp; Work Audit History</p>
          {ticketComments.map(comment => (
            <div 
              key={comment.id}
              className={`p-3 rounded-xl border text-xs ${
                comment.isInternalNote 
                  ? 'bg-amber-950/20 border-amber-800/40 text-amber-200' 
                  : comment.authorRole === 'AI_AGENT'
                  ? 'bg-indigo-950/30 border-indigo-800/50 text-indigo-200'
                  : 'bg-slate-950/50 border-slate-800/80 text-slate-300'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center space-x-2">
                  <span className="font-semibold text-white">{comment.authorName}</span>
                  <span className="text-[10px] uppercase font-bold text-slate-400 bg-slate-800 px-1.5 py-0.2 rounded">
                    {comment.authorRole}
                  </span>
                  {comment.isInternalNote && (
                    <span className="text-[10px] text-amber-400 bg-amber-950/80 px-1.5 py-0.2 rounded font-semibold">
                      Internal Tech Note
                    </span>
                  )}
                </div>
                <span className="text-[10px] text-slate-500 font-mono">
                  {new Date(comment.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <p className="leading-relaxed whitespace-pre-wrap">{comment.content}</p>
            </div>
          ))}
        </div>

      </div>

      {/* Comment Form */}
      <div className="p-3 bg-slate-950/90 border-t border-slate-800">
        <form onSubmit={handlePostComment} className="space-y-2">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-slate-400">Add to work log or message requester:</span>
            {!['STUDENT', 'FACULTY', 'STAFF'].includes(currentUser.role) && (
              <label className="flex items-center gap-1.5 text-slate-400 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isInternalNote}
                  onChange={e => setIsInternalNote(e.target.checked)}
                  className="rounded bg-slate-900 border-slate-700 text-indigo-600 focus:ring-0"
                />
                <span>Internal Technician Note only</span>
              </label>
            )}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Type message, diagnostic update, or troubleshooting note..."
              value={commentText}
              onChange={e => setCommentText(e.target.value)}
              className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-500 text-white px-3.5 py-2 rounded-lg flex items-center justify-center transition shrink-0 text-xs font-semibold"
            >
              <Send className="h-3.5 w-3.5" />
            </button>
          </div>
        </form>
      </div>

      {/* WORK DONE & RESOLUTION REASON MODAL */}
      {showResolutionDialog && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 max-w-lg w-full shadow-2xl space-y-4 animate-fadeIn">
            
            <div className="flex items-center space-x-3 text-emerald-400">
              <div className="h-10 w-10 rounded-xl bg-emerald-600/30 border border-emerald-500/50 flex items-center justify-center">
                <CheckCircle2 className="h-6 w-6 text-emerald-400" />
              </div>
              <div>
                <h4 className="text-base font-bold text-white">Complete Work &amp; Resolve Incident</h4>
                <p className="text-xs text-slate-400">Record root-cause explanation for Admin Dashboard</p>
              </div>
            </div>

            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs text-slate-300">
              <p>Ticket: <strong className="text-white font-mono">{ticket.referenceId}</strong> &bull; {ticket.title}</p>
              <p className="text-slate-400 mt-0.5">Requester: <strong>{ticket.requesterName}</strong></p>
            </div>

            {/* Quick preset chips */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1.5 uppercase">
                Quick Preset Work Descriptions (Click to Apply):
              </label>
              <div className="space-y-1.5">
                {presetReasons.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setResolutionReason(preset)}
                    className="w-full text-left text-[11px] p-2 rounded-lg bg-slate-950 hover:bg-emerald-950/40 border border-slate-800 hover:border-emerald-700/50 text-slate-300 hover:text-emerald-300 transition"
                  >
                    &bull; {preset}
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleConfirmResolution} className="space-y-3 pt-1">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Resolution Reason / Work Completed Summary
                </label>
                <textarea
                  rows={3}
                  value={resolutionReason}
                  onChange={e => setResolutionReason(e.target.value)}
                  placeholder="Explain the technical work done, replacement parts, or configurations performed..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 resize-none"
                  required
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowResolutionDialog(false)}
                  className="text-xs text-slate-400 hover:text-slate-200 px-3.5 py-2 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-lg shadow-emerald-600/30 transition flex items-center gap-1.5"
                >
                  <Check className="h-4 w-4" /> Confirm &amp; Update Admin Dashboard
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* Security Verification Dialog Modal */}
      {showSecurityDialog && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-xl p-5 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center space-x-3 text-amber-400">
              <KeyRound className="h-6 w-6" />
              <div>
                <h4 className="text-sm font-bold text-white">Out-of-Band Identity Verification</h4>
                <p className="text-xs text-slate-400">FERPA / Institutional Access Security Check</p>
              </div>
            </div>

            <div className="bg-slate-950 p-3 rounded border border-slate-800 text-xs text-slate-300 space-y-1">
              <p>Requester: <strong>{ticket.requesterName}</strong> ({ticket.requesterEmail})</p>
              <p>Action: <strong>Hardware Token / 2FA Reset Resolution</strong></p>
              <p className="text-amber-400 text-[11px] pt-1">
                A verification challenge has been transmitted via campus push. Enter the 6-digit challenge token (Demo Token: <code>774920</code>).
              </p>
            </div>

            {securityError && (
              <div className="p-2 bg-rose-950/80 border border-rose-700 text-rose-300 text-xs rounded">
                {securityError}
              </div>
            )}

            <form onSubmit={handleVerifyAndResolve} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  6-Digit Verification PIN
                </label>
                <input
                  type="text"
                  maxLength={6}
                  value={challengePin}
                  onChange={e => setChallengePin(e.target.value)}
                  placeholder="774920"
                  className="w-full text-center tracking-widest font-mono text-lg bg-slate-950 border border-slate-700 rounded-md py-2 text-white focus:outline-none focus:border-amber-500"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowSecurityDialog(false)}
                  className="text-xs text-slate-400 hover:text-slate-200 px-3 py-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold px-4 py-2 rounded shadow transition"
                >
                  Verify &amp; Proceed to Resolution
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
