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
  Sparkles
} from 'lucide-react';

export function TicketDetailPane({ ticketId }: { ticketId: string | null }) {
  const { 
    tickets, 
    comments, 
    currentUser, 
    updateTicketStatus, 
    assignTicket, 
    addComment, 
    resolveSecurityAction 
  } = useApp();

  const [commentText, setCommentText] = useState('');
  const [isInternalNote, setIsInternalNote] = useState(false);
  
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
            Choose a ticket from the left panel to inspect the timeline, audit history, transcripts, and initiate resolutions.
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

  const handleMarkResolved = () => {
    if (ticket.isSecuritySensitive) {
      setShowSecurityDialog(true);
    } else {
      updateTicketStatus(ticket.id, 'RESOLVED');
    }
  };

  const handleVerifyAndResolve = (e: React.FormEvent) => {
    e.preventDefault();
    setSecurityError('');
    const success = resolveSecurityAction(ticket.id, challengePin);
    if (success) {
      setShowSecurityDialog(false);
      setChallengePin('');
    } else {
      setSecurityError('Invalid Out-of-Band Challenge Token. Please verify Microsoft Entra / Duo push.');
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden flex flex-col h-[740px] shadow-xl">
      {/* Ticket Header & Status Banner */}
      <div className="p-4 border-b border-slate-800 bg-slate-950/70 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <span className="font-mono text-sm font-bold text-white bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
              {ticket.referenceId}
            </span>
            <span className="text-xs text-slate-400">
              via <strong className="text-slate-200">{ticket.channel}</strong>
            </span>
            <span className="text-xs text-slate-500">• {new Date(ticket.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          </div>

          {/* Action Buttons for Technician */}
          <div className="flex items-center space-x-2">
            {!ticket.assignedTechId && !['STUDENT', 'FACULTY', 'STAFF'].includes(currentUser.role) && (
              <button
                onClick={handleClaimTicket}
                className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow transition"
              >
                <UserPlus className="h-3.5 w-3.5" /> Assign to Me
              </button>
            )}

            {ticket.status !== 'RESOLVED' && ticket.status !== 'CLOSED' && !['STUDENT', 'FACULTY', 'STAFF'].includes(currentUser.role) && (
              <button
                onClick={handleMarkResolved}
                className={`text-xs font-medium px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow transition ${
                  ticket.isSecuritySensitive 
                    ? 'bg-amber-600 hover:bg-amber-500 text-white' 
                    : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                }`}
              >
                {ticket.isSecuritySensitive ? <Lock className="h-3.5 w-3.5" /> : <CheckCircle2 className="h-3.5 w-3.5" />}
                {ticket.isSecuritySensitive ? 'Verify & Resolve (2FA)' : 'Resolve Incident'}
              </button>
            )}

            {(ticket.status === 'RESOLVED' || ticket.status === 'CLOSED') && (
              <span className="text-xs font-semibold text-emerald-400 bg-emerald-950/80 border border-emerald-800/40 px-3 py-1 rounded-lg flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4" /> Incident Resolved
              </span>
            )}
          </div>
        </div>

        {/* Title & Metadata */}
        <div>
          <h2 className="text-base font-semibold text-slate-100">{ticket.title}</h2>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-xs text-slate-400">
            <span>Requester: <strong className="text-slate-300">{ticket.requesterName}</strong></span>
            <span>Department: <strong className="text-indigo-400">{ticket.departmentName}</strong></span>
            <span>Assignee: <strong className="text-slate-300">{ticket.assignedTechName || 'Unassigned'}</strong></span>
          </div>
        </div>

        {/* Sensitive Security Notice Banner */}
        {ticket.isSecuritySensitive && (
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

      {/* Timeline & Conversation Stream */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Original Issue Description Card */}
        <div className="bg-slate-950 border border-slate-800 rounded-lg p-3.5 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-medium text-slate-300">Initial Problem Statement</span>
            <span>Reported via {ticket.channel}</span>
          </div>
          <p className="text-xs text-slate-200 leading-relaxed whitespace-pre-wrap">{ticket.description}</p>
        </div>

        {/* Comments & Transcripts */}
        {ticketComments.map((comment) => (
          <div
            key={comment.id}
            className={`p-3.5 rounded-lg border text-xs space-y-1.5 ${
              comment.isInternalNote
                ? 'bg-amber-950/20 border-amber-800/40 text-amber-100'
                : comment.authorName.includes('Whisper')
                ? 'bg-indigo-950/25 border-indigo-800/40 text-slate-200'
                : 'bg-slate-950 border-slate-800 text-slate-200'
            }`}
          >
            <div className="flex items-center justify-between text-[11px]">
              <div className="flex items-center space-x-2">
                <span className="font-semibold text-slate-300">{comment.authorName}</span>
                <span className="text-[10px] bg-slate-800 text-slate-400 px-1.5 py-0.2 rounded font-mono">
                  {comment.authorRole}
                </span>
                {comment.isInternalNote && (
                  <span className="text-[10px] text-amber-400 bg-amber-950/80 border border-amber-800 px-1 rounded flex items-center gap-0.5">
                    <Lock className="h-2.5 w-2.5" /> Internal Tech Note
                  </span>
                )}
              </div>
              <span className="text-slate-500 font-mono">
                {new Date(comment.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>

            <div className="whitespace-pre-wrap leading-relaxed text-slate-300">
              {comment.content}
            </div>
          </div>
        ))}
      </div>

      {/* Reply & Comment Composer */}
      <div className="p-3 border-t border-slate-800 bg-slate-950/90">
        <form onSubmit={handlePostComment} className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-slate-400">Add Timeline Update</span>
            {!['STUDENT', 'FACULTY', 'STAFF'].includes(currentUser.role) && (
              <label className="flex items-center space-x-1.5 text-xs text-amber-400 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isInternalNote}
                  onChange={e => setIsInternalNote(e.target.checked)}
                  className="rounded bg-slate-800 border-slate-700 text-amber-500 focus:ring-0"
                />
                <span className="text-[11px]">Internal IT note only</span>
              </label>
            )}
          </div>

          <div className="flex items-end gap-2">
            <textarea
              rows={2}
              value={commentText}
              onChange={e => setCommentText(e.target.value)}
              placeholder={isInternalNote ? "Write an internal diagnosis note (visible only to technicians)..." : "Reply to requester or post diagnostic findings..."}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 resize-none"
            />
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-500 text-white p-2.5 rounded-lg flex items-center justify-center transition shrink-0"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </form>
      </div>

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
                  Confirm & Resolve Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
