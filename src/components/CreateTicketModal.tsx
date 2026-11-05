'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { TicketPriority, TicketChannel } from '@/types';
import { 
  PlusCircle, 
  Sparkles, 
  ShieldCheck, 
  Mail, 
  Send, 
  HelpCircle,
  FileCheck2,
  Cpu
} from 'lucide-react';

export function CreateTicketModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { createTicket, departments, currentUser } = useApp();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [departmentId, setDepartmentId] = useState(departments[0]?.id || '');
  const [priority, setPriority] = useState<TicketPriority>('P3_MEDIUM');
  const [channel, setChannel] = useState<TicketChannel>('WEB_PORTAL');
  const [isSecuritySensitive, setIsSecuritySensitive] = useState(false);
  
  // NLP Auto-Triage Suggestion state
  const [isClassifying, setIsClassifying] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState<string | null>(null);

  if (!isOpen) return null;

  // Simulate NLP / LLM auto-triage
  const handleAutoTriage = () => {
    if (!description && !title) return;
    setIsClassifying(true);
    setTimeout(() => {
      const text = (title + ' ' + description).toLowerCase();
      if (text.includes('wifi') || text.includes('switch') || text.includes('eduroam') || text.includes('ethernet')) {
        const netDept = departments.find(d => d.code === 'NET_WIFI');
        if (netDept) setDepartmentId(netDept.id);
        setPriority('P2_HIGH');
        setAiSuggestion('Classified as Campus Wi-Fi & Core Network. High urgency assigned based on network keyword pattern.');
      } else if (text.includes('mfa') || text.includes('duo') || text.includes('password') || text.includes('token') || text.includes('entra')) {
        const secDept = departments.find(d => d.code === 'SECURITY_MFA');
        if (secDept) setDepartmentId(secDept.id);
        setIsSecuritySensitive(true);
        setPriority('P1_CRITICAL');
        setAiSuggestion('Flagged as Identity & Access / MFA. High-risk security policy and out-of-band challenge auto-enabled.');
      } else if (text.includes('canvas') || text.includes('quiz') || text.includes('grade')) {
        const lmsDept = departments.find(d => d.code === 'LMS');
        if (lmsDept) setDepartmentId(lmsDept.id);
        setPriority('P3_MEDIUM');
        setAiSuggestion('Routed to LMS (Canvas) support queue.');
      } else {
        setAiSuggestion('Processed by NLP: Standard priority assigned.');
      }
      setIsClassifying(false);
    }, 600);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createTicket({
      title,
      description,
      departmentId,
      priority,
      channel,
      isSecuritySensitive,
    }, description);

    // Reset form
    setTitle('');
    setDescription('');
    setAiSuggestion(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-xl max-w-xl w-full overflow-hidden shadow-2xl">
        <div className="bg-slate-950 p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <PlusCircle className="h-5 w-5 text-indigo-400" />
            <h3 className="text-sm font-semibold text-white">Create New IT Incident / Request</h3>
          </div>
          <button 
            onClick={onClose} 
            className="text-slate-400 hover:text-slate-200 text-xs font-mono"
          >
            ESC
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Incident Summary / Title</label>
            <input
              type="text"
              placeholder="e.g. Wi-Fi disconnection in Chem Lab 204 or MFA hardware token lost"
              value={title}
              onChange={e => setTitle(e.target.value)}
              onBlur={handleAutoTriage}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              required
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-medium text-slate-300">Detailed Description & Diagnostics</label>
              <button
                type="button"
                onClick={handleAutoTriage}
                disabled={isClassifying}
                className="text-[11px] text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-medium"
              >
                <Sparkles className="h-3 w-3" />
                {isClassifying ? 'Analyzing with NLP...' : 'Run Auto-Triage'}
              </button>
            </div>
            <textarea
              rows={4}
              placeholder="Provide workstation ID, switch port, browser logs, or error codes..."
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 resize-none"
              required
            />
          </div>

          {/* AI Auto-Triage Feedback Banner */}
          {aiSuggestion && (
            <div className="bg-indigo-950/40 border border-indigo-500/40 rounded-lg p-2.5 flex items-start space-x-2 text-xs text-indigo-200 animate-fadeIn">
              <Cpu className="h-4 w-4 text-indigo-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">NLP Auto-Triage Engine</p>
                <p className="text-[11px] text-indigo-300/80">{aiSuggestion}</p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-medium text-slate-400 mb-1">Channel Origin</label>
              <select
                value={channel}
                onChange={e => setChannel(e.target.value as TicketChannel)}
                className="w-full bg-slate-950 border border-slate-700 rounded-md px-2 py-1.5 text-xs text-slate-200"
              >
                <option value="WEB_PORTAL">Web Portal</option>
                <option value="EMAIL">Email Gateway (support@campus.edu)</option>
                <option value="WHATSAPP_CHAT">WhatsApp Chat</option>
                <option value="WHATSAPP_CALL">WhatsApp Voice Call</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-400 mb-1">Target Department</label>
              <select
                value={departmentId}
                onChange={e => setDepartmentId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-md px-2 py-1.5 text-xs text-slate-200"
              >
                {departments.map(d => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-400 mb-1">Priority SLA</label>
              <select
                value={priority}
                onChange={e => setPriority(e.target.value as TicketPriority)}
                className="w-full bg-slate-950 border border-slate-700 rounded-md px-2 py-1.5 text-xs text-slate-200"
              >
                <option value="P1_CRITICAL">P1 - Critical (Campus Wide)</option>
                <option value="P2_HIGH">P2 - High (Lab / Exam)</option>
                <option value="P3_MEDIUM">P3 - Medium (Individual)</option>
                <option value="P4_LOW">P4 - Low (General Inquiry)</option>
              </select>
            </div>
          </div>

          <div className="pt-2">
            <label className="flex items-center space-x-2 text-xs text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={isSecuritySensitive}
                onChange={e => setIsSecuritySensitive(e.target.checked)}
                className="rounded bg-slate-950 border-slate-700 text-amber-500 focus:ring-0"
              />
              <span>High-Risk Credential or Security Action (Requires Out-of-Band 2FA Challenge)</span>
            </label>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="text-xs text-slate-400 hover:text-slate-200 px-3 py-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-4 py-2 rounded-lg shadow-lg shadow-indigo-600/30 flex items-center gap-1.5 transition"
            >
              <Send className="h-3.5 w-3.5" /> Dispatch Ticket
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
