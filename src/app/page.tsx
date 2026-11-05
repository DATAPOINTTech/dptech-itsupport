'use client';

import React, { useState } from 'react';
import { AppProvider, useApp } from '@/context/AppContext';
import { NavigationHeader } from '@/components/NavigationHeader';
import { TicketList } from '@/components/TicketList';
import { TicketDetailPane } from '@/components/TicketDetailPane';
import { WhatsAppCallStudio } from '@/components/WhatsAppCallStudio';
import { CreateTicketModal } from '@/components/CreateTicketModal';
import { AuditAndGovernanceView } from '@/components/AuditAndGovernanceView';
import { AdminPanel } from '@/components/AdminPanel';
import { AnalyticsDashboard } from '@/components/AnalyticsDashboard';
import { PublicFacilitiesShowcase } from '@/components/PublicFacilitiesShowcase';
import { SelfRegistrationModal } from '@/components/SelfRegistrationModal';
import { Facility } from '@/types';
import { 
  PlusCircle, 
  PhoneCall, 
  LayoutDashboard, 
  ShieldCheck, 
  BookOpen, 
  Activity,
  Layers,
  Sparkles,
  Settings,
  Bot,
  BarChart3,
  Building2,
  UserPlus
} from 'lucide-react';

export default function Home() {
  return (
    <AppProvider>
      <MainDashboardApp />
    </AppProvider>
  );
}

function MainDashboardApp() {
  const { theme, tickets, facilities } = useApp();
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>('tkt-101');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'FACILITIES' | 'DASHBOARD' | 'CONSOLE' | 'STUDIO' | 'GOVERNANCE' | 'ARCHITECTURE' | 'ADMIN'>('FACILITIES');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // Handle navigation from dashboard cards to incident console
  const handleNavigateToTickets = (filterStatus?: string) => {
    if (filterStatus) {
      setStatusFilter(filterStatus);
    }
    setActiveTab('CONSOLE');
  };

  const handleReportFacility = (facility: Facility) => {
    setIsCreateModalOpen(true);
  };

  // Theme-dependent styles
  const isMidnight = theme === 'midnight-blue';
  const themeBackgroundClass = isMidnight 
    ? 'bg-[#030712] text-slate-100 selection:bg-blue-600 selection:text-white' 
    : 'bg-[#070b14] text-slate-100 selection:bg-indigo-600 selection:text-white';

  const resolvedCount = tickets.filter(t => t.status === 'RESOLVED' || t.status === 'CLOSED').length;
  const newCount = tickets.filter(t => t.status === 'NEW').length;

  return (
    <div className={`min-h-screen ${themeBackgroundClass} flex flex-col font-sans transition-colors duration-300`}>
      
      {/* Navigation Header */}
      <NavigationHeader />

      {/* Global Toolbar & Mode Tabs */}
      <div className={`border-b border-slate-800/80 ${isMidnight ? 'bg-[#0b1329]/70' : 'bg-slate-900/60'} backdrop-blur-md sticky top-16 z-40`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex flex-wrap items-center justify-between gap-3">
          
          {/* View Switcher Tabs */}
          <div className="flex items-center space-x-1 bg-slate-950/80 p-1 rounded-xl border border-slate-800 text-xs font-medium overflow-x-auto shadow-inner">
            
            {/* TAB 0: PUBLIC FACILITIES SHOWCASE */}
            <button
              onClick={() => setActiveTab('FACILITIES')}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition ${
                activeTab === 'FACILITIES'
                  ? 'bg-indigo-600 text-white shadow-md font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
              }`}
            >
              <Building2 className="h-3.5 w-3.5 text-indigo-300" /> Public Facilities
              <span className="text-[10px] bg-slate-800/90 text-slate-300 border border-slate-700/50 px-1.5 py-0.2 rounded-full font-mono">
                {facilities.length}
              </span>
            </button>

            {/* TAB 1: EXECUTIVE DASHBOARD */}
            <button
              onClick={() => setActiveTab('DASHBOARD')}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition ${
                activeTab === 'DASHBOARD'
                  ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-md font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
              }`}
            >
              <BarChart3 className="h-3.5 w-3.5 text-indigo-300" /> Executive Dashboard
              <span className="text-[10px] bg-slate-800/90 text-emerald-300 border border-emerald-500/30 px-1.5 py-0.2 rounded-full font-mono">
                {resolvedCount} Res
              </span>
            </button>

            {/* TAB 2: INCIDENT CONSOLE */}
            <button
              onClick={() => setActiveTab('CONSOLE')}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition ${
                activeTab === 'CONSOLE'
                  ? 'bg-indigo-600 text-white shadow font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
              }`}
            >
              <LayoutDashboard className="h-3.5 w-3.5" /> Incident Console
              {newCount > 0 && (
                <span className="text-[10px] bg-blue-500/20 text-blue-300 border border-blue-500/40 px-1.5 py-0.2 rounded-full font-mono font-bold">
                  {newCount} New
                </span>
              )}
            </button>

            {/* TAB 3: WHATSAPP CALL & AISHA GATEWAY */}
            <button
              onClick={() => setActiveTab('STUDIO')}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition ${
                activeTab === 'STUDIO'
                  ? 'bg-emerald-600 text-white shadow font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
              }`}
            >
              <PhoneCall className="h-3.5 w-3.5" /> WhatsApp &amp; Aisha Gateway
            </button>

            {/* TAB 4: ADMIN SETUP & AISHA CONFIG */}
            <button
              onClick={() => setActiveTab('ADMIN')}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition ${
                activeTab === 'ADMIN'
                  ? 'bg-indigo-600 text-white shadow font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
              }`}
            >
              <Settings className="h-3.5 w-3.5" /> Admin Setup &amp; Config
            </button>

            {/* TAB 5: FERPA GOVERNANCE */}
            <button
              onClick={() => setActiveTab('GOVERNANCE')}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition ${
                activeTab === 'GOVERNANCE'
                  ? 'bg-indigo-600 text-white shadow font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
              }`}
            >
              <ShieldCheck className="h-3.5 w-3.5" /> FERPA &amp; Audit Logs
            </button>

            {/* TAB 6: ARCHITECTURE */}
            <button
              onClick={() => setActiveTab('ARCHITECTURE')}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition ${
                activeTab === 'ARCHITECTURE'
                  ? 'bg-indigo-600 text-white shadow font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
              }`}
            >
              <Layers className="h-3.5 w-3.5" /> System Specs
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsRegisterModalOpen(true)}
              className="bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 hover:border-slate-600 text-xs font-semibold px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition"
            >
              <UserPlus className="h-4 w-4 text-indigo-400" /> Self-Register
            </button>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-lg shadow-indigo-600/30 transition"
            >
              <PlusCircle className="h-4 w-4" /> New Ticket
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-1 w-full">
        
        {/* VIEW 0: PUBLIC FACILITIES SHOWCASE */}
        {activeTab === 'FACILITIES' && (
          <PublicFacilitiesShowcase
            onReportFacilityIssue={handleReportFacility}
            onOpenRegisterModal={() => setIsRegisterModalOpen(true)}
          />
        )}

        {/* VIEW 1: EXECUTIVE COMMAND DASHBOARD */}
        {activeTab === 'DASHBOARD' && (
          <AnalyticsDashboard onNavigateToTickets={handleNavigateToTickets} />
        )}

        {/* VIEW 2: INCIDENT CONSOLE */}
        {activeTab === 'CONSOLE' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-5">
                <TicketList
                  selectedTicketId={selectedTicketId || undefined}
                  onSelectTicket={(id) => setSelectedTicketId(id)}
                  initialStatusFilter={statusFilter}
                />
              </div>
              <div className="lg:col-span-7">
                <TicketDetailPane ticketId={selectedTicketId} />
              </div>
            </div>
          </div>
        )}

        {/* VIEW 3: WHATSAPP CALL STUDIO */}
        {activeTab === 'STUDIO' && (
          <div className="space-y-6">
            <WhatsAppCallStudio
              onOpenTicket={(tktId) => {
                setSelectedTicketId(tktId);
                setActiveTab('CONSOLE');
              }}
            />
          </div>
        )}

        {/* VIEW 4: ADMIN & AISHA CONFIGURATION */}
        {activeTab === 'ADMIN' && (
          <AdminPanel />
        )}

        {/* VIEW 5: GOVERNANCE & AUDIT LOGS */}
        {activeTab === 'GOVERNANCE' && (
          <AuditAndGovernanceView />
        )}

        {/* VIEW 6: ARCHITECTURE SPEC & DATA BLUEPRINT */}
        {activeTab === 'ARCHITECTURE' && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Layers className="h-5 w-5 text-indigo-400" />
                Campus IT Enterprise Architecture &amp; Ingestion Specs
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Reference system architecture, WhatsApp voice bridge parameters, and FERPA/GDPR compliance design.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                <h4 className="font-semibold text-indigo-300">1. Channel Ingestion Pipeline</h4>
                <ul className="list-disc pl-4 space-y-1 text-slate-300">
                  <li><strong>Inbound Email:</strong> AWS SES / SendGrid parser with DKIM, SPF, and DMARC verification at <code>/api/email-inbound</code>.</li>
                  <li><strong>WhatsApp Business Cloud API:</strong> Webhook listener with HMAC SHA-256 validation at <code>/api/whatsapp-webhook</code>.</li>
                  <li><strong>Voice Bridging:</strong> LiveKit WebRTC SFU bridge linking WhatsApp audio calls to technician browsers.</li>
                  <li><strong>Speech-to-Text:</strong> Automated Whisper worker running on S3-stored audio, creating transcripts &amp; summaries.</li>
                </ul>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                <h4 className="font-semibold text-emerald-300">2. Identity &amp; Access Management</h4>
                <ul className="list-disc pl-4 space-y-1 text-slate-300">
                  <li><strong>Campus SSO:</strong> SAML 2.0 / OpenID Connect (Microsoft Entra ID &amp; Google Workspace for Education).</li>
                  <li><strong>Phone Identity Binding:</strong> 6-digit OTP challenge before processing privileged requests via WhatsApp.</li>
                  <li><strong>Step-Up Authentication:</strong> Out-of-band push verification mandatory before clearing security-sensitive tickets.</li>
                  <li><strong>Role Isolation:</strong> Students/Faculty view only their tickets; Technicians routed via Department RLS.</li>
                </ul>
              </div>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-[11px] text-slate-300 overflow-x-auto">
              <p className="text-indigo-400 font-semibold mb-2"># Live System API Endpoints</p>
              <p>POST /api/email-inbound      - Inbound email webhook parser (DKIM/DMARC checks)</p>
              <p>GET  /api/whatsapp-webhook   - Meta webhook challenge &amp; token handshake</p>
              <p>POST /api/whatsapp-webhook   - Inbound WhatsApp message &amp; call session dispatcher</p>
            </div>
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950/90 py-6 mt-12 text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="h-8 w-8 rounded-lg bg-white p-0.5 flex items-center justify-center shadow-sm shrink-0">
              <img
                src="/datapoint-logo.png"
                alt="DATAPOINT Technologies"
                className="h-full w-full object-contain"
              />
            </div>
            <p className="text-xs text-slate-300">
              Powered by <span className="font-bold text-white">DATAPOINT Technologies</span> &mdash;{' '}
              <span className="text-blue-400">Smart Solutions. Intelligent Future.</span>
            </p>
          </div>

          <div className="flex items-center space-x-4 text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Campus Grid Online
            </span>
            <span>•</span>
            <span>Enterprise Voice &amp; Dispatch v2.4</span>
            <span>•</span>
            <span>&copy; 2026 DATAPOINT Technologies</span>
          </div>
        </div>
      </footer>

      {/* Create Ticket Modal */}
      <CreateTicketModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />

      {/* Self Registration Modal */}
      <SelfRegistrationModal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
      />

    </div>
  );
}
