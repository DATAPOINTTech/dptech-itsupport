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
  Cpu,
  PhoneCall,
  MessageSquare,
  Globe,
  GraduationCap,
  Briefcase,
  Building2,
  UserCheck
} from 'lucide-react';

export function CreateTicketModal({ 
  isOpen, 
  onClose,
  initialScenario,
  initialRequesterType
}: { 
  isOpen: boolean; 
  onClose: () => void;
  initialScenario?: TicketChannel;
  initialRequesterType?: 'STUDENT' | 'FACULTY' | 'STAFF' | 'DEPARTMENT';
}) {
  const { createTicket, departments, currentUser } = useApp();

  const [requesterType, setRequesterType] = useState<'STUDENT' | 'FACULTY' | 'STAFF' | 'DEPARTMENT'>(
    initialRequesterType || 'STUDENT'
  );
  const [requesterName, setRequesterName] = useState(currentUser.fullName || 'Sophia Martinez');
  const [requesterEmail, setRequesterEmail] = useState(currentUser.email || 'smartinez@student.campus.edu');
  const [requesterPhone, setRequesterPhone] = useState(currentUser.phoneNumber || '+1 (415) 555-2381');
  const [channel, setChannel] = useState<TicketChannel>(initialScenario || 'WEB_PORTAL');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [departmentId, setDepartmentId] = useState(departments[0]?.id || '');
  const [priority, setPriority] = useState<TicketPriority>('P3_MEDIUM');
  const [isSecuritySensitive, setIsSecuritySensitive] = useState(false);
  
  // NLP Auto-Triage Suggestion state
  const [isClassifying, setIsClassifying] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState<string | null>(null);

  if (!isOpen) return null;

  // Preset quick fill
  const handleApplyPreset = (type: 'STUDENT' | 'FACULTY' | 'STAFF' | 'DEPARTMENT', ch: TicketChannel) => {
    setRequesterType(type);
    setChannel(ch);

    if (type === 'STUDENT') {
      setRequesterName('Sophia Martinez');
      setRequesterEmail('smartinez@student.campus.edu');
      setRequesterPhone('+1 (415) 555-2381');
      if (ch === 'WHATSAPP_CHAT') {
        setTitle('WhatsApp Message: eduroam AP dropped near Library 3rd Floor Pods');
        setDescription('Student WhatsApp message: "eduroam disconnected on 3rd floor study rooms 301-310. SSIDs visible but DHCP handshake times out."');
        setDepartmentId(departments[0]?.id || '');
        setPriority('P2_HIGH');
      }
    } else if (type === 'FACULTY') {
      setRequesterName('Dr. Arthur Pendelton');
      setRequesterEmail('apendelton@faculty.campus.edu');
      setRequesterPhone('+1 (415) 555-9012');
      if (ch === 'WHATSAPP_CALL') {
        setTitle('WhatsApp Call: Main Auditorium Projector 4K Audio Failure');
        setDescription('Live voice call routed via WhatsApp Helpline: Audio and HDMI sync cuts out every 5 minutes in Chem Lecture Hall 1. Handled by Aisha AI.');
        setDepartmentId(departments[1]?.id || departments[0]?.id || '');
        setPriority('P1_CRITICAL');
      }
    } else if (type === 'STAFF') {
      setRequesterName('David Jenkins (Registrar Staff)');
      setRequesterEmail('djenkins@staff.campus.edu');
      setRequesterPhone('+1 (415) 555-4819');
      if (ch === 'EMAIL') {
        setTitle('Inbound Email: High-volume transcript laser printer error 13.02');
        setDescription('Email sent to support@campus.edu: "Registrar office HP LaserJet is showing error 13.02 and out-of-toner warning. Need urgent service before afternoon graduation batch printing."');
        setDepartmentId(departments[2]?.id || departments[0]?.id || '');
        setPriority('P3_MEDIUM');
      }
    } else {
      setRequesterName('Computer Science Department Office');
      setRequesterEmail('cs-office@campus.edu');
      setRequesterPhone('+1 (415) 555-7000');
      setTitle('Department Request: CS Lab 204 VLAN Re-allocation & GPU Node Access');
      setDescription('Departmental request: Lab 204 workstations need switch port mapping and CUDA license tokens refreshed for upcoming Machine Learning lab class.');
      setDepartmentId(departments[0]?.id || '');
      setPriority('P2_HIGH');
    }
  };

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
      } else if (text.includes('mfa') || text.includes('duo') || text.includes('password') || text.includes('token')) {
        const secDept = departments.find(d => d.code === 'SECURITY_MFA');
        if (secDept) setDepartmentId(secDept.id);
        setIsSecuritySensitive(true);
        setPriority('P1_CRITICAL');
        setAiSuggestion('Flagged as Identity & Access / MFA. High-risk security policy auto-enabled.');
      } else {
        setAiSuggestion('Processed by NLP Auto-Triage: Standard routing applied.');
      }
      setIsClassifying(false);
    }, 500);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createTicket({
      requesterName,
      requesterEmail,
      requesterPhone,
      requesterType,
      title,
      description,
      departmentId,
      priority,
      channel,
      isSecuritySensitive,
      hasCallSession: channel === 'WHATSAPP_CALL',
    }, description);

    // Reset form
    setTitle('');
    setDescription('');
    setAiSuggestion(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl my-8">
        
        {/* Header */}
        <div className="bg-slate-950 p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-lg bg-indigo-600/30 border border-indigo-500/50 flex items-center justify-center text-indigo-400">
              <PlusCircle className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Generate Campus IT Support Ticket</h3>
              <p className="text-[11px] text-slate-400">Staff &bull; Student &bull; Faculty &bull; Department &bull; Omnichannel Scenarios</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="text-slate-400 hover:text-slate-200 text-xs px-2 py-1 rounded hover:bg-slate-800"
          >
            ✕ Close
          </button>
        </div>

        {/* Quick Scenario Pre-fill bar */}
        <div className="bg-slate-950/70 p-3 border-b border-slate-800/80">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
              <Sparkles className="h-3 w-3 text-indigo-400" /> 1-Click Omnichannel Demo Presets:
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 text-[11px]">
            <button
              type="button"
              onClick={() => handleApplyPreset('FACULTY', 'WHATSAPP_CALL')}
              className="px-2 py-1.5 rounded-lg bg-emerald-950/60 hover:bg-emerald-900/80 border border-emerald-800/50 text-emerald-300 font-medium flex items-center gap-1 transition text-left"
            >
              <PhoneCall className="h-3 w-3 shrink-0" />
              <span className="truncate">WhatsApp Call (Faculty)</span>
            </button>
            <button
              type="button"
              onClick={() => handleApplyPreset('STUDENT', 'WHATSAPP_CHAT')}
              className="px-2 py-1.5 rounded-lg bg-teal-950/60 hover:bg-teal-900/80 border border-teal-800/50 text-teal-300 font-medium flex items-center gap-1 transition text-left"
            >
              <MessageSquare className="h-3 w-3 shrink-0" />
              <span className="truncate">WhatsApp Msg (Student)</span>
            </button>
            <button
              type="button"
              onClick={() => handleApplyPreset('STAFF', 'EMAIL')}
              className="px-2 py-1.5 rounded-lg bg-amber-950/60 hover:bg-amber-900/80 border border-amber-800/50 text-amber-300 font-medium flex items-center gap-1 transition text-left"
            >
              <Mail className="h-3 w-3 shrink-0" />
              <span className="truncate">Inbound Email (Staff)</span>
            </button>
            <button
              type="button"
              onClick={() => handleApplyPreset('DEPARTMENT', 'WEB_PORTAL')}
              className="px-2 py-1.5 rounded-lg bg-indigo-950/60 hover:bg-indigo-900/80 border border-indigo-800/50 text-indigo-300 font-medium flex items-center gap-1 transition text-left"
            >
              <Building2 className="h-3 w-3 shrink-0" />
              <span className="truncate">Dept Request</span>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
          
          {/* 1. Who is generating this ticket? */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              1. Requester Persona / Category
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => setRequesterType('STUDENT')}
                className={`py-2 px-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition ${
                  requesterType === 'STUDENT'
                    ? 'bg-blue-600 text-white border-blue-500 shadow-md shadow-blue-600/30'
                    : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
                }`}
              >
                <GraduationCap className="h-3.5 w-3.5" /> Student
              </button>
              <button
                type="button"
                onClick={() => setRequesterType('FACULTY')}
                className={`py-2 px-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition ${
                  requesterType === 'FACULTY'
                    ? 'bg-purple-600 text-white border-purple-500 shadow-md shadow-purple-600/30'
                    : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
                }`}
              >
                <Briefcase className="h-3.5 w-3.5" /> Faculty
              </button>
              <button
                type="button"
                onClick={() => setRequesterType('STAFF')}
                className={`py-2 px-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition ${
                  requesterType === 'STAFF'
                    ? 'bg-amber-600 text-white border-amber-500 shadow-md shadow-amber-600/30'
                    : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
                }`}
              >
                <UserCheck className="h-3.5 w-3.5" /> Staff
              </button>
              <button
                type="button"
                onClick={() => setRequesterType('DEPARTMENT')}
                className={`py-2 px-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition ${
                  requesterType === 'DEPARTMENT'
                    ? 'bg-emerald-600 text-white border-emerald-500 shadow-md shadow-emerald-600/30'
                    : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
                }`}
              >
                <Building2 className="h-3.5 w-3.5" /> Department
              </button>
            </div>
          </div>

          {/* Requester Contact info */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-medium text-slate-400 mb-1">Full Name / Dept Unit</label>
              <input
                type="text"
                value={requesterName}
                onChange={e => setRequesterName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                required
              />
            </div>
            <div>
              <label className="block text-[11px] font-medium text-slate-400 mb-1">Campus Email</label>
              <input
                type="email"
                value={requesterEmail}
                onChange={e => setRequesterEmail(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                required
              />
            </div>
            <div>
              <label className="block text-[11px] font-medium text-slate-400 mb-1">Phone Number</label>
              <input
                type="text"
                value={requesterPhone}
                onChange={e => setRequesterPhone(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* 2. Generation Scenario / Channel */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              2. Generation Scenario / Inbound Channel
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => setChannel('WHATSAPP_CALL')}
                className={`py-2 px-2 rounded-xl border text-[11px] font-semibold flex items-center justify-center gap-1.5 transition ${
                  channel === 'WHATSAPP_CALL'
                    ? 'bg-emerald-600 text-white border-emerald-500 shadow-md shadow-emerald-600/30'
                    : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
                }`}
              >
                <PhoneCall className="h-3 w-3" /> Live WhatsApp Call
              </button>
              <button
                type="button"
                onClick={() => setChannel('WHATSAPP_CHAT')}
                className={`py-2 px-2 rounded-xl border text-[11px] font-semibold flex items-center justify-center gap-1.5 transition ${
                  channel === 'WHATSAPP_CHAT'
                    ? 'bg-teal-600 text-white border-teal-500 shadow-md shadow-teal-600/30'
                    : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
                }`}
              >
                <MessageSquare className="h-3 w-3" /> WhatsApp Message
              </button>
              <button
                type="button"
                onClick={() => setChannel('EMAIL')}
                className={`py-2 px-2 rounded-xl border text-[11px] font-semibold flex items-center justify-center gap-1.5 transition ${
                  channel === 'EMAIL'
                    ? 'bg-amber-600 text-white border-amber-500 shadow-md shadow-amber-600/30'
                    : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
                }`}
              >
                <Mail className="h-3 w-3" /> Inbound Email
              </button>
              <button
                type="button"
                onClick={() => setChannel('WEB_PORTAL')}
                className={`py-2 px-2 rounded-xl border text-[11px] font-semibold flex items-center justify-center gap-1.5 transition ${
                  channel === 'WEB_PORTAL'
                    ? 'bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-600/30'
                    : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
                }`}
              >
                <Globe className="h-3 w-3" /> Web Form
              </button>
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">3. Incident Title / Summary</label>
            <input
              type="text"
              placeholder="e.g. Wi-Fi disconnection in Chem Lab 204 or Projector audio not syncing"
              value={title}
              onChange={e => setTitle(e.target.value)}
              onBlur={handleAutoTriage}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              required
            />
          </div>

          {/* Description */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-semibold text-slate-300">4. Detailed Description</label>
              <button
                type="button"
                onClick={handleAutoTriage}
                disabled={isClassifying}
                className="text-[11px] text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-medium"
              >
                <Sparkles className="h-3 w-3" />
                {isClassifying ? 'Analyzing...' : 'Auto-Triage Priority & Dept'}
              </button>
            </div>
            <textarea
              rows={3}
              placeholder="Describe the issue, room number, equipment model, or error messages..."
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 resize-none"
              required
            />
          </div>

          {/* AI Feedback */}
          {aiSuggestion && (
            <div className="bg-indigo-950/40 border border-indigo-500/40 rounded-xl p-2.5 flex items-start space-x-2 text-xs text-indigo-200">
              <Cpu className="h-4 w-4 text-indigo-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">NLP Auto-Triage Suggestion</p>
                <p className="text-[11px] text-indigo-300/80">{aiSuggestion}</p>
              </div>
            </div>
          )}

          {/* Department & Priority */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-medium text-slate-400 mb-1">Target Functional Scope</label>
              <select
                value={departmentId}
                onChange={e => setDepartmentId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200"
              >
                {departments.map(d => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-400 mb-1">SLA Urgency</label>
              <select
                value={priority}
                onChange={e => setPriority(e.target.value as TicketPriority)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200"
              >
                <option value="P1_CRITICAL">P1 - Critical (Classroom / Exam Impact)</option>
                <option value="P2_HIGH">P2 - High (Departmental Outage)</option>
                <option value="P3_MEDIUM">P3 - Medium (Standard Incident)</option>
                <option value="P4_LOW">P4 - Low (General Inquiry)</option>
              </select>
            </div>
          </div>

          {/* Actions */}
          <div className="pt-2 flex items-center justify-end space-x-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-lg shadow-indigo-600/30 flex items-center gap-1.5 transition"
            >
              <Send className="h-3.5 w-3.5" /> Generate Ticket &amp; Send to Admin Dashboard
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
