'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { 
  Bot, 
  MessageSquare, 
  PhoneCall, 
  Settings, 
  ShieldCheck, 
  Key, 
  Link, 
  Save, 
  RotateCcw, 
  CheckCircle2, 
  AlertCircle, 
  Sliders, 
  BookOpen, 
  Plus, 
  Trash2, 
  Eye, 
  EyeOff, 
  Sparkles, 
  Terminal,
  Activity,
  Copy,
  Check,
  UserCheck,
  UserX,
  FileQuestion,
  Users,
  Wrench,
  GraduationCap
} from 'lucide-react';
import { AishaAgentConfig, WhatsAppConfig, KnowledgeBaseItem } from '@/types';

export function AdminPanel() {
  const { 
    aishaConfig, 
    updateAishaConfig, 
    whatsAppConfig, 
    updateWhatsAppConfig, 
    knowledgeBase, 
    addKnowledgeItem, 
    toggleKnowledgeItem, 
    deleteKnowledgeItem,
    testWhatsAppConnection,
    pendingRegistrations,
    approveRegistration,
    rejectRegistration,
    requestProofRegistration,
    departments
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'VERIFICATION' | 'PROVISIONING' | 'AISHA' | 'WHATSAPP' | 'KNOWLEDGE' | 'ESCALATION'>('VERIFICATION');
  
  // Technician provisioning form state
  const [techName, setTechName] = useState('');
  const [techEmail, setTechEmail] = useState('');
  const [techDept, setTechDept] = useState(departments[0]?.id || '');
  const [techTier, setTechTier] = useState<'TECHNICIAN_T1' | 'TECHNICIAN_T2' | 'TECHNICIAN_T3'>('TECHNICIAN_T1');
  const [techSkills, setTechSkills] = useState('Cisco Switches, Aruba Wi-Fi 6E, RADIUS/PEAP');
  
  // Local form state for Aisha
  const [localAisha, setLocalAisha] = useState<AishaAgentConfig>(aishaConfig);
  const [newKeyword, setNewKeyword] = useState('');
  
  // Local form state for WhatsApp
  const [localWA, setLocalWA] = useState<WhatsAppConfig>(whatsAppConfig);
  const [showToken, setShowToken] = useState(false);
  const [copiedWebhook, setCopiedWebhook] = useState(false);
  const [isTestingConn, setIsTestingConn] = useState(false);
  const [testResult, setTestResult] = useState<string | null>(null);

  // New Knowledge Item modal / form state
  const [isAddingKB, setIsAddingKB] = useState(false);
  const [kbTopic, setKbTopic] = useState('');
  const [kbCategory, setKbCategory] = useState<'NETWORK' | 'ACCOUNT' | 'HARDWARE' | 'LMS'>('NETWORK');
  const [kbKeywords, setKbKeywords] = useState('');
  const [kbSnippet, setKbSnippet] = useState('');

  // Toast feedback
  const [savedToast, setSavedToast] = useState(false);

  const handleSaveAisha = (e: React.FormEvent) => {
    e.preventDefault();
    updateAishaConfig(localAisha);
    showSavedToastNotification();
  };

  const handleSaveWA = (e: React.FormEvent) => {
    e.preventDefault();
    updateWhatsAppConfig(localWA);
    showSavedToastNotification();
  };

  const showSavedToastNotification = () => {
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 2500);
  };

  const handleAddKeyword = () => {
    if (!newKeyword.trim()) return;
    if (!localAisha.humanHandoffKeywords.includes(newKeyword.trim().toLowerCase())) {
      setLocalAisha(prev => ({
        ...prev,
        humanHandoffKeywords: [...prev.humanHandoffKeywords, newKeyword.trim().toLowerCase()]
      }));
    }
    setNewKeyword('');
  };

  const handleRemoveKeyword = (kwToRemove: string) => {
    setLocalAisha(prev => ({
      ...prev,
      humanHandoffKeywords: prev.humanHandoffKeywords.filter(k => k !== kwToRemove)
    }));
  };

  const handleCreateKB = (e: React.FormEvent) => {
    e.preventDefault();
    if (!kbTopic || !kbSnippet) return;

    addKnowledgeItem({
      topic: kbTopic,
      category: kbCategory,
      triggerKeywords: kbKeywords.split(',').map(s => s.trim().toLowerCase()).filter(Boolean),
      resolutionSnippet: kbSnippet,
      active: true,
    });

    setKbTopic('');
    setKbKeywords('');
    setKbSnippet('');
    setIsAddingKB(false);
    showSavedToastNotification();
  };

  const handleTestConnection = async () => {
    setIsTestingConn(true);
    setTestResult(null);
    const success = await testWhatsAppConnection();
    setIsTestingConn(false);
    setTestResult(success 
      ? '✓ WhatsApp Cloud Webhook Handshake Successful (HTTP 200 OK - Meta API v21.0)' 
      : '✕ Error: Verify Phone Number ID & Bearer Token.');
  };

  const copyWebhookUrl = () => {
    navigator.clipboard.writeText(localWA.webhookUrl);
    setCopiedWebhook(true);
    setTimeout(() => setCopiedWebhook(false), 2000);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/60 to-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div className="flex items-center space-x-4">
            <div className="h-14 w-14 rounded-2xl bg-gradient-to-tr from-indigo-600 to-blue-500 p-0.5 shadow-lg shadow-indigo-500/30 flex items-center justify-center">
              <div className="h-full w-full bg-slate-950 rounded-2xl flex items-center justify-center">
                <Bot className="h-7 w-7 text-indigo-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-white tracking-tight">
                  DATAPOINT Technologies &mdash; AI &amp; Voice Administration
                </h2>
                <span className="text-[11px] bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-semibold px-2.5 py-0.5 rounded-full">
                  Aisha Core v2.4
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Configure autonomous AI support agent Aisha, WhatsApp Business Cloud API parameters, and enterprise knowledge base.
              </p>
            </div>
          </div>

          {/* Quick Status Badges */}
          <div className="flex items-center gap-3">
            <div className="bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-2 flex items-center gap-2 text-xs">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <div>
                <p className="text-[10px] text-slate-400">Agent Aisha</p>
                <p className="font-semibold text-slate-200">Active (Auto-Triage)</p>
              </div>
            </div>
            <div className="bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-2 flex items-center gap-2 text-xs">
              <span className={`h-2.5 w-2.5 rounded-full ${whatsAppConfig.status === 'CONNECTED' ? 'bg-emerald-400' : 'bg-amber-400'}`}></span>
              <div>
                <p className="text-[10px] text-slate-400">WhatsApp Gateway</p>
                <p className="font-semibold text-slate-200">{whatsAppConfig.status}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Sub-Tabs Navigation */}
        <div className="flex items-center space-x-2 mt-6 pt-5 border-t border-slate-800/80 overflow-x-auto text-xs font-medium">
          <button
            onClick={() => setActiveSubTab('VERIFICATION')}
            className={`px-3.5 py-2 rounded-lg flex items-center gap-2 transition shrink-0 ${
              activeSubTab === 'VERIFICATION'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <UserCheck className="h-4 w-4" /> User Verification Desk
            {pendingRegistrations.filter(r => r.status === 'PENDING_VERIFICATION').length > 0 && (
              <span className="text-[10px] bg-amber-400 text-slate-950 font-bold px-1.5 py-0.2 rounded-full">
                {pendingRegistrations.filter(r => r.status === 'PENDING_VERIFICATION').length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveSubTab('PROVISIONING')}
            className={`px-3.5 py-2 rounded-lg flex items-center gap-2 transition shrink-0 ${
              activeSubTab === 'PROVISIONING'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Users className="h-4 w-4" /> Staff Provisioning Hub
          </button>
          <button
            onClick={() => setActiveSubTab('AISHA')}
            className={`px-3.5 py-2 rounded-lg flex items-center gap-2 transition shrink-0 ${
              activeSubTab === 'AISHA'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Bot className="h-4 w-4" /> Aisha AI Support Agent
          </button>
          <button
            onClick={() => setActiveSubTab('WHATSAPP')}
            className={`px-3.5 py-2 rounded-lg flex items-center gap-2 transition shrink-0 ${
              activeSubTab === 'WHATSAPP'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <MessageSquare className="h-4 w-4" /> WhatsApp Cloud &amp; Webhook Setup
          </button>
          <button
            onClick={() => setActiveSubTab('KNOWLEDGE')}
            className={`px-3.5 py-2 rounded-lg flex items-center gap-2 transition shrink-0 ${
              activeSubTab === 'KNOWLEDGE'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <BookOpen className="h-4 w-4" /> Knowledge Base &amp; Rules ({knowledgeBase.length})
          </button>
          <button
            onClick={() => setActiveSubTab('ESCALATION')}
            className={`px-3.5 py-2 rounded-lg flex items-center gap-2 transition shrink-0 ${
              activeSubTab === 'ESCALATION'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <ShieldCheck className="h-4 w-4" /> SLA Triage &amp; Human Handoff
          </button>
        </div>
      </div>

      {/* Toast Notification */}
      {savedToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-600 text-white px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-2 text-xs font-semibold animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle2 className="h-4 w-4" />
          Settings saved and synchronized with DATAPOINT Cloud!
        </div>
      )}

      {/* ============================================================== */}
      {/* SUB-TAB: USER VERIFICATION DESK */}
      {/* ============================================================== */}
      {activeSubTab === 'VERIFICATION' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                  <UserCheck className="h-4 w-4 text-emerald-400" />
                  Institutional User Verification Desk
                </h3>
                <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-full font-bold">
                  {pendingRegistrations.length} in queue
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Review and approve inbound student, professor, and staff registrations against campus registrar records before granting ticket creation access.
              </p>
            </div>
          </div>

          {pendingRegistrations.length === 0 ? (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-12 text-center space-y-2">
              <CheckCircle2 className="h-10 w-10 text-emerald-400 mx-auto" />
              <h4 className="text-sm font-semibold text-white">All Registration Requests Cleared</h4>
              <p className="text-xs text-slate-400">There are no pending accounts awaiting review in the verification desk.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {pendingRegistrations.map((reg) => (
                <div 
                  key={reg.id}
                  className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl p-4 transition flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-white">{reg.fullName}</h4>
                      <span className="text-[10px] font-mono font-bold bg-indigo-900/60 text-indigo-300 border border-indigo-700/50 px-2 py-0.5 rounded">
                        {reg.campusId}
                      </span>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        reg.role === 'FACULTY' 
                          ? 'bg-purple-900/60 text-purple-300 border border-purple-700/50' 
                          : 'bg-blue-900/60 text-blue-300 border border-blue-700/50'
                      }`}>
                        {reg.role}
                      </span>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        reg.status === 'NEEDS_PROOF' 
                          ? 'bg-amber-950 text-amber-300 border border-amber-500/40' 
                          : 'bg-slate-800 text-slate-400'
                      }`}>
                        {reg.status}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-400">
                      <span>Email: <strong className="text-slate-300 font-mono">{reg.email}</strong></span>
                      <span>Dept: <strong className="text-slate-300">{reg.departmentName}</strong></span>
                      <span>Phone: <strong className="text-slate-300 font-mono">{reg.phoneNumber}</strong></span>
                      <span>Submitted: <strong className="text-slate-400">{reg.submittedAt}</strong></span>
                    </div>

                    {reg.verificationNotes && (
                      <p className="text-[11px] text-amber-300 bg-amber-950/40 border border-amber-600/30 p-2 rounded-lg mt-1">
                        <strong>Admin Note:</strong> {reg.verificationNotes}
                      </p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => approveRegistration(reg.id)}
                      className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow transition"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5" /> Approve &amp; Activate
                    </button>
                    <button
                      type="button"
                      onClick={() => requestProofRegistration(reg.id, 'Please upload official university photo ID.')}
                      className="bg-amber-600/20 hover:bg-amber-600/30 text-amber-300 border border-amber-500/30 text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition"
                    >
                      <FileQuestion className="h-3.5 w-3.5" /> Request Proof
                    </button>
                    <button
                      type="button"
                      onClick={() => rejectRegistration(reg.id, 'Identity records not found in registrar database.')}
                      className="bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/30 text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition"
                    >
                      <UserX className="h-3.5 w-3.5" /> Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ============================================================== */}
      {/* SUB-TAB: STAFF PROVISIONING HUB */}
      {/* ============================================================== */}
      {activeSubTab === 'PROVISIONING' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <Users className="h-4 w-4 text-indigo-400" />
                Support Staff &amp; Technician Provisioning Hub
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Technicians cannot self-register. Accounts are created and provisioned exclusively here with departmental functional scopes and tier levels.
              </p>
            </div>
          </div>

          <form 
            onSubmit={(e) => {
              e.preventDefault();
              showSavedToastNotification();
              setTechName('');
              setTechEmail('');
            }}
            className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4 shadow-xl"
          >
            <h4 className="text-xs font-bold text-indigo-300 uppercase tracking-wide">
              Provision New Engineering / Support Staff Account
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Staff Full Name</label>
                <input
                  type="text"
                  placeholder="e.g. Liam Foster"
                  value={techName}
                  onChange={e => setTechName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Institutional Email</label>
                <input
                  type="email"
                  placeholder="e.g. lfoster@it.campus.edu"
                  value={techEmail}
                  onChange={e => setTechEmail(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white font-mono"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Departmental Scope</label>
                <select
                  value={techDept}
                  onChange={e => setTechDept(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white"
                >
                  {departments.map(d => (
                    <option key={d.id} value={d.id}>{d.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Tier &amp; Privilege Level</label>
                <select
                  value={techTier}
                  onChange={e => setTechTier(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white"
                >
                  <option value="TECHNICIAN_T1">Tier-1 Frontline Dispatch &amp; Hardware</option>
                  <option value="TECHNICIAN_T2">Tier-2 Specialized Network / Security Engineer</option>
                  <option value="TECHNICIAN_T3">Tier-3 Infrastructure Architect &amp; Escalation</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Specialized Skills &amp; Certifications</label>
              <input
                type="text"
                value={techSkills}
                onChange={e => setTechSkills(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white"
              />
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-4 py-2 rounded-lg flex items-center gap-1.5 shadow"
              >
                <Plus className="h-4 w-4" /> Provision Technician Credentials
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ============================================================== */}
      {/* SUB-TAB 1: AISHA AGENT SETUP */}
      {/* ============================================================== */}
      {activeSubTab === 'AISHA' && (
        <form onSubmit={handleSaveAisha} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left Column: Identity & Model */}
            <div className="lg:col-span-7 space-y-6">
              
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
                <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-indigo-400" />
                  Agent Identity &amp; Voice Persona
                </h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Agent Name</label>
                    <input
                      type="text"
                      value={localAisha.name}
                      onChange={e => setLocalAisha({ ...localAisha, name: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Agent Professional Title</label>
                    <input
                      type="text"
                      value={localAisha.title}
                      onChange={e => setLocalAisha({ ...localAisha, title: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">LLM Model</label>
                    <select
                      value={localAisha.model}
                      onChange={e => setLocalAisha({ ...localAisha, model: e.target.value as any })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                    >
                      <option value="gemini-1.5-pro">Gemini 1.5 Pro (Recommended)</option>
                      <option value="gpt-4o">OpenAI GPT-4o Support</option>
                      <option value="dptech-fine-tuned-llama3">DPTech LLaMA-3 (Campus Fine-Tuned)</option>
                      <option value="claude-3-5-sonnet">Claude 3.5 Sonnet</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Voice Synthesizer</label>
                    <select
                      value={localAisha.voice}
                      onChange={e => setLocalAisha({ ...localAisha, voice: e.target.value as any })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                    >
                      <option value="en-US-Neural2-F">en-US Neural Female (Clear &amp; Empathetic)</option>
                      <option value="ur-PK-Standard-A">ur-PK Standard (Urdu / Bilingual)</option>
                      <option value="en-GB-Wavenet-A">en-GB Wavenet (British Academic)</option>
                      <option value="en-AU-Neural2-C">en-AU Neural2</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Tone &amp; Demeanor</label>
                    <select
                      value={localAisha.tone}
                      onChange={e => setLocalAisha({ ...localAisha, tone: e.target.value as any })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                    >
                      <option value="EMPATHETIC">Empathetic &amp; Reassuring</option>
                      <option value="PROFESSIONAL">Professional &amp; Crisp</option>
                      <option value="TECHNICAL">Deep Technical Engineering</option>
                    </select>
                  </div>
                </div>

                {/* System Prompt */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-medium text-slate-300">
                      Aisha System Instructions (Meta Prompt)
                    </label>
                    <span className="text-[10px] text-slate-400">Controls voice synthesis &amp; chat triage</span>
                  </div>
                  <textarea
                    rows={5}
                    value={localAisha.systemPrompt}
                    onChange={e => setLocalAisha({ ...localAisha, systemPrompt: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-xs text-slate-200 font-mono focus:outline-none focus:border-indigo-500 leading-relaxed"
                  />
                </div>

              </div>

            </div>

            {/* Right Column: Autonomous Behavior & Toggles */}
            <div className="lg:col-span-5 space-y-6">
              
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
                <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                  <Sliders className="h-4 w-4 text-indigo-400" />
                  Autonomous WhatsApp Handling
                </h3>

                <div className="space-y-3">
                  <label className="flex items-start justify-between gap-3 p-3 bg-slate-950 rounded-lg border border-slate-800 cursor-pointer hover:border-slate-700 transition">
                    <div>
                      <p className="text-xs font-medium text-white">Auto-Answer WhatsApp Calls</p>
                      <p className="text-[11px] text-slate-400">Aisha answers incoming VoIP calls with live WebRTC voice response.</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={localAisha.autoAnswerCalls}
                      onChange={e => setLocalAisha({ ...localAisha, autoAnswerCalls: e.target.checked })}
                      className="h-4 w-4 accent-indigo-600 rounded mt-0.5"
                    />
                  </label>

                  <label className="flex items-start justify-between gap-3 p-3 bg-slate-950 rounded-lg border border-slate-800 cursor-pointer hover:border-slate-700 transition">
                    <div>
                      <p className="text-xs font-medium text-white">Auto-Reply to WhatsApp Chat Messages</p>
                      <p className="text-[11px] text-slate-400">Provides instant conversational troubleshooting and guidance.</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={localAisha.autoReplyMessages}
                      onChange={e => setLocalAisha({ ...localAisha, autoReplyMessages: e.target.checked })}
                      className="h-4 w-4 accent-indigo-600 rounded mt-0.5"
                    />
                  </label>

                  <label className="flex items-start justify-between gap-3 p-3 bg-slate-950 rounded-lg border border-slate-800 cursor-pointer hover:border-slate-700 transition">
                    <div>
                      <p className="text-xs font-medium text-white">Auto-Generate Ticket on Unresolved Issues</p>
                      <p className="text-[11px] text-slate-400">Logs reference tickets with SLA urgency and full transcript.</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={localAisha.autoCreateTickets}
                      onChange={e => setLocalAisha({ ...localAisha, autoCreateTickets: e.target.checked })}
                      className="h-4 w-4 accent-indigo-600 rounded mt-0.5"
                    />
                  </label>
                </div>

                {/* Handoff trigger keywords */}
                <div className="pt-2">
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Human Escalation Trigger Keywords
                  </label>
                  <p className="text-[11px] text-slate-400 mb-2">
                    When caller/chatter types or says any of these words, Aisha bridges an on-duty human technician:
                  </p>
                  
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {localAisha.humanHandoffKeywords.map((kw, i) => (
                      <span key={i} className="inline-flex items-center gap-1 bg-slate-800 border border-slate-700 text-slate-200 text-xs px-2.5 py-1 rounded-md">
                        {kw}
                        <button
                          type="button"
                          onClick={() => handleRemoveKeyword(kw)}
                          className="text-slate-400 hover:text-rose-400 transition"
                        >
                          &times;
                        </button>
                      </span>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Add keyword (e.g. manager, emergency)..."
                      value={newKeyword}
                      onChange={e => setNewKeyword(e.target.value)}
                      onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleAddKeyword(); } }}
                      className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                    />
                    <button
                      type="button"
                      onClick={handleAddKeyword}
                      className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs px-3 py-1.5 rounded-lg border border-slate-700"
                    >
                      Add
                    </button>
                  </div>
                </div>

              </div>

            </div>

          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-5 py-2.5 rounded-lg shadow-lg shadow-indigo-600/30 flex items-center gap-2 transition"
            >
              <Save className="h-4 w-4" /> Save Aisha Configuration
            </button>
          </div>
        </form>
      )}

      {/* ============================================================== */}
      {/* SUB-TAB 2: WHATSAPP BUSINESS CLOUD API & WEBHOOK SETUP */}
      {/* ============================================================== */}
      {activeSubTab === 'WHATSAPP' && (
        <form onSubmit={handleSaveWA} className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6">
            <div>
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <Key className="h-4 w-4 text-emerald-400" />
                Meta WhatsApp Business Cloud API Credentials
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Configure your Meta Developer App and WhatsApp Business Phone Number details to handle live inbound voice and messaging.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">WhatsApp Phone Number ID</label>
                <input
                  type="text"
                  value={localWA.phoneNumberId}
                  onChange={e => setLocalWA({ ...localWA, phoneNumberId: e.target.value })}
                  placeholder="e.g. 108849201948123"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">WhatsApp Business Account ID (WABA ID)</label>
                <input
                  type="text"
                  value={localWA.wabaId}
                  onChange={e => setLocalWA({ ...localWA, wabaId: e.target.value })}
                  placeholder="e.g. 394820192839182"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Meta App ID</label>
                <input
                  type="text"
                  value={localWA.appId}
                  onChange={e => setLocalWA({ ...localWA, appId: e.target.value })}
                  placeholder="e.g. 882049182940129"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Business Display Name</label>
                <input
                  type="text"
                  value={localWA.businessDisplayName}
                  onChange={e => setLocalWA({ ...localWA, businessDisplayName: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Permanent System User Bearer Token (Meta Graph API)
              </label>
              <div className="relative">
                <input
                  type={showToken ? 'text' : 'password'}
                  value={localWA.bearerToken}
                  onChange={e => setLocalWA({ ...localWA, bearerToken: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-3 pr-10 py-2 text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowToken(!showToken)}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-200"
                >
                  {showToken ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Webhook Configuration Section */}
            <div className="bg-slate-950 border border-slate-800 rounded-lg p-4 space-y-4">
              <h4 className="text-xs font-semibold text-slate-200 flex items-center gap-2">
                <Link className="h-4 w-4 text-indigo-400" />
                Live Webhook Ingestion Configuration
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Callback URL (Configure in Meta App Dashboard)</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      readOnly
                      value={localWA.webhookUrl}
                      className="flex-1 bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-slate-300 font-mono"
                    />
                    <button
                      type="button"
                      onClick={copyWebhookUrl}
                      className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1.5 rounded text-xs flex items-center gap-1 border border-slate-700"
                    >
                      {copiedWebhook ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                      {copiedWebhook ? 'Copied' : 'Copy'}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Webhook Verify Token (Secret)</label>
                  <input
                    type="text"
                    value={localWA.verifyToken}
                    onChange={e => setLocalWA({ ...localWA, verifyToken: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-slate-200 font-mono focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
                <span className="text-[11px] text-slate-400 flex items-center gap-1">
                  <Activity className="h-3.5 w-3.5 text-emerald-400" />
                  Meta Webhook Events Subscribed: <code>messages</code>, <code>message_template_status_update</code>, <code>calls</code>
                </span>

                <button
                  type="button"
                  onClick={handleTestConnection}
                  disabled={isTestingConn}
                  className="bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition"
                >
                  <Terminal className="h-3.5 w-3.5" />
                  {isTestingConn ? 'Testing Handshake...' : 'Ping Meta Webhook Handshake'}
                </button>
              </div>

              {testResult && (
                <div className="p-2.5 bg-slate-900/90 border border-emerald-500/40 rounded text-xs font-mono text-emerald-300 animate-in fade-in">
                  {testResult}
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="submit"
                className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold px-5 py-2.5 rounded-lg shadow-lg shadow-emerald-600/30 flex items-center gap-2 transition"
              >
                <Save className="h-4 w-4" /> Save WhatsApp Configuration
              </button>
            </div>
          </div>
        </form>
      )}

      {/* ============================================================== */}
      {/* SUB-TAB 3: CAMPUS KNOWLEDGE BASE & AUTO-RESOLUTION RULES */}
      {/* ============================================================== */}
      {activeSubTab === 'KNOWLEDGE' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-indigo-400" />
                Aisha AI Knowledge Base &amp; Auto-Resolution Rules
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Define canonical solutions that Aisha cites when students or staff report recurring issues via WhatsApp voice or chat.
              </p>
            </div>
            <button
              onClick={() => setIsAddingKB(true)}
              className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-3.5 py-2 rounded-lg flex items-center gap-1.5 shadow transition"
            >
              <Plus className="h-4 w-4" /> Add Knowledge Rule
            </button>
          </div>

          {/* New Rule Modal / Drawer */}
          {isAddingKB && (
            <form onSubmit={handleCreateKB} className="bg-slate-900 border border-indigo-500/40 rounded-xl p-5 space-y-4 shadow-xl">
              <h4 className="text-xs font-bold text-indigo-300 uppercase tracking-wide">
                Create New Automated Resolution Entry
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-slate-300 mb-1">Issue Topic</label>
                  <input
                    type="text"
                    placeholder="e.g. Eduroam Certificate Trust Failure on Android 14"
                    value={kbTopic}
                    onChange={e => setKbTopic(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Category</label>
                  <select
                    value={kbCategory}
                    onChange={e => setKbCategory(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white"
                  >
                    <option value="NETWORK">Network &amp; Wi-Fi</option>
                    <option value="ACCOUNT">Identity, MFA &amp; Password</option>
                    <option value="LMS">Canvas LMS &amp; Portals</option>
                    <option value="HARDWARE">Lab Workstations &amp; Printers</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Trigger Keywords (Comma separated)
                </label>
                <input
                  type="text"
                  placeholder="e.g. cert, android, eduroam, ca certificate, untrusted"
                  value={kbKeywords}
                  onChange={e => setKbKeywords(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white font-mono"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Canonical Step-by-Step Resolution (What Aisha Explains)
                </label>
                <textarea
                  rows={4}
                  placeholder="Provide clear technical instructions for the caller/chatter..."
                  value={kbSnippet}
                  onChange={e => setKbSnippet(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-xs text-white leading-relaxed"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddingKB(false)}
                  className="text-xs text-slate-400 hover:text-slate-200 px-3 py-1.5"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-4 py-1.5 rounded-lg"
                >
                  Save Entry
                </button>
              </div>
            </form>
          )}

          {/* List of Knowledge Items */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {knowledgeBase.map((item) => (
              <div 
                key={item.id} 
                className={`p-4 rounded-xl border transition ${
                  item.active 
                    ? 'bg-slate-900 border-slate-800' 
                    : 'bg-slate-950/60 border-slate-800/60 opacity-60'
                }`}
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-indigo-900/60 text-indigo-300 border border-indigo-700/50">
                      {item.category}
                    </span>
                    <h4 className="text-sm font-semibold text-white mt-1.5">{item.topic}</h4>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={() => toggleKnowledgeItem(item.id)}
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded transition ${
                        item.active 
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30' 
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {item.active ? 'ACTIVE' : 'DISABLED'}
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteKnowledgeItem(item.id)}
                      className="text-slate-400 hover:text-rose-400 p-1 transition"
                      title="Delete rule"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800/80 my-2 text-xs text-slate-300 font-mono whitespace-pre-line leading-relaxed max-h-32 overflow-y-auto">
                  {item.resolutionSnippet}
                </div>

                <div className="flex flex-wrap gap-1 mt-2">
                  {item.triggerKeywords.map((kw, i) => (
                    <span key={i} className="text-[10px] bg-slate-800/80 text-slate-400 px-1.5 py-0.5 rounded">
                      #{kw}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

        </div>
      )}

      {/* ============================================================== */}
      {/* SUB-TAB 4: SLA TRIAGE & HUMAN HANDOFF */}
      {/* ============================================================== */}
      {activeSubTab === 'ESCALATION' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6">
          <div>
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
              SLA Priority Triage &amp; Human Technician Handoff Routing
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Configure how tickets created by Aisha are triaged across engineering departments and routed under FERPA governance.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
            <div className="bg-slate-950 p-4 rounded-xl border border-rose-500/30 space-y-1.5">
              <span className="text-[10px] font-bold text-rose-400 uppercase">P1 Critical SLA</span>
              <p className="text-lg font-bold text-white">15 Minutes</p>
              <p className="text-[11px] text-slate-400">Campus-wide outages, exam center locks, security breaches.</p>
            </div>
            <div className="bg-slate-950 p-4 rounded-xl border border-amber-500/30 space-y-1.5">
              <span className="text-[10px] font-bold text-amber-400 uppercase">P2 High SLA</span>
              <p className="text-lg font-bold text-white">1 Hour</p>
              <p className="text-[11px] text-slate-400">Inbound WhatsApp voice calls, departmental lab switches.</p>
            </div>
            <div className="bg-slate-950 p-4 rounded-xl border border-blue-500/30 space-y-1.5">
              <span className="text-[10px] font-bold text-blue-400 uppercase">P3 Medium SLA</span>
              <p className="text-lg font-bold text-white">4 Hours</p>
              <p className="text-[11px] text-slate-400">Standard student Wi-Fi tickets, general software install.</p>
            </div>
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-700/50 space-y-1.5">
              <span className="text-[10px] font-bold text-slate-400 uppercase">P4 Low SLA</span>
              <p className="text-lg font-bold text-white">24 Hours</p>
              <p className="text-[11px] text-slate-400">General queries, quota adjustments, routine requests.</p>
            </div>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
            <h4 className="text-xs font-semibold text-slate-200">Department Routing Dispatcher</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-900 rounded-lg border border-slate-800">
                <p className="font-semibold text-indigo-300">Campus Wi-Fi &amp; Core Network</p>
                <p className="text-[11px] text-slate-400 mt-0.5">Assigned Lead: Marcus Vance (Tier-1)</p>
                <p className="text-[10px] text-slate-400 font-mono mt-1">Escalation: netops@campus.edu</p>
              </div>
              <div className="p-3 bg-slate-900 rounded-lg border border-slate-800">
                <p className="font-semibold text-emerald-300">Identity &amp; Access / MFA</p>
                <p className="text-[11px] text-slate-400 mt-0.5">Assigned Lead: Elena Rostova (Tier-2 Sec)</p>
                <p className="text-[10px] text-slate-400 font-mono mt-1">Escalation: security@campus.edu</p>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

