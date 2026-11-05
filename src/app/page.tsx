'use client';

import React, { useState } from 'react';
import { AppProvider } from '@/context/AppContext';
import { NavigationHeader } from '@/components/NavigationHeader';
import { TicketList } from '@/components/TicketList';
import { TicketDetailPane } from '@/components/TicketDetailPane';
import { WhatsAppCallStudio } from '@/components/WhatsAppCallStudio';
import { CreateTicketModal } from '@/components/CreateTicketModal';
import { AuditAndGovernanceView } from '@/components/AuditAndGovernanceView';
import { 
  PlusCircle, 
  PhoneCall, 
  LayoutDashboard, 
  ShieldCheck, 
  BookOpen, 
  Activity,
  Layers,
  Sparkles
} from 'lucide-react';

export default function Home() {
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>('tkt-101');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'CONSOLE' | 'STUDIO' | 'GOVERNANCE' | 'ARCHITECTURE'>('CONSOLE');

  return (
    <AppProvider>
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
        
        {/* Navigation Header */}
        <NavigationHeader />

        {/* Global Toolbar & Mode Tabs */}
        <div className="border-b border-slate-800 bg-slate-900/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex flex-wrap items-center justify-between gap-3">
            
            {/* View Switcher Tabs */}
            <div className="flex items-center space-x-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs font-medium">
              <button
                onClick={() => setActiveTab('CONSOLE')}
                className={`px-3 py-1.5 rounded-md flex items-center gap-1.5 transition ${
                  activeTab === 'CONSOLE'
                    ? 'bg-indigo-600 text-white shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <LayoutDashboard className="h-3.5 w-3.5" /> Incident Console
              </button>
              <button
                onClick={() => setActiveTab('STUDIO')}
                className={`px-3 py-1.5 rounded-md flex items-center gap-1.5 transition ${
                  activeTab === 'STUDIO'
                    ? 'bg-emerald-600 text-white shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <PhoneCall className="h-3.5 w-3.5" /> WhatsApp Call Gateway
              </button>
              <button
                onClick={() => setActiveTab('GOVERNANCE')}
                className={`px-3 py-1.5 rounded-md flex items-center gap-1.5 transition ${
                  activeTab === 'GOVERNANCE'
                    ? 'bg-indigo-600 text-white shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <ShieldCheck className="h-3.5 w-3.5" /> FERPA & Audit Logs
              </button>
              <button
                onClick={() => setActiveTab('ARCHITECTURE')}
                className={`px-3 py-1.5 rounded-md flex items-center gap-1.5 transition ${
                  activeTab === 'ARCHITECTURE'
                    ? 'bg-indigo-600 text-white shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Layers className="h-3.5 w-3.5" /> System Architecture Spec
              </button>
            </div>

            {/* Action Button */}
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-4 py-2 rounded-lg flex items-center gap-1.5 shadow-lg shadow-indigo-600/30 transition"
            >
              <PlusCircle className="h-4 w-4" /> New Ticket / Request
            </button>
          </div>
        </div>

        {/* Main Content Area */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-1 w-full">
          
          {/* TAB 1: CONSOLE */}
          {activeTab === 'CONSOLE' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-5">
                  <TicketList
                    selectedTicketId={selectedTicketId || undefined}
                    onSelectTicket={(id) => setSelectedTicketId(id)}
                  />
                </div>
                <div className="lg:col-span-7">
                  <TicketDetailPane ticketId={selectedTicketId} />
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: WHATSAPP CALL STUDIO */}
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

          {/* TAB 3: GOVERNANCE & AUDIT LOGS */}
          {activeTab === 'GOVERNANCE' && (
            <AuditAndGovernanceView />
          )}

          {/* TAB 4: ARCHITECTURE SPEC & DATA BLUEPRINT */}
          {activeTab === 'ARCHITECTURE' && (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6 shadow-xl">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Layers className="h-5 w-5 text-indigo-400" />
                  Campus IT Enterprise Architecture & Ingestion Specs
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Reference system architecture, WhatsApp voice bridge parameters, and FERPA/GDPR compliance design.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 space-y-2">
                  <h4 className="font-semibold text-indigo-300">1. Channel Ingestion Pipeline</h4>
                  <ul className="list-disc pl-4 space-y-1 text-slate-300">
                    <li><strong>Inbound Email:</strong> AWS SES / SendGrid parser with DKIM, SPF, and DMARC verification at <code>/api/email-inbound</code>.</li>
                    <li><strong>WhatsApp Business Cloud API:</strong> Webhook listener with HMAC SHA-256 validation at <code>/api/whatsapp-webhook</code>.</li>
                    <li><strong>Voice Bridging:</strong> LiveKit WebRTC SFU bridge linking WhatsApp audio calls to technician browsers.</li>
                    <li><strong>Speech-to-Text:</strong> Automated Whisper worker running on S3-stored audio, creating transcripts & summaries.</li>
                  </ul>
                </div>

                <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 space-y-2">
                  <h4 className="font-semibold text-emerald-300">2. Identity & Access Management</h4>
                  <ul className="list-disc pl-4 space-y-1 text-slate-300">
                    <li><strong>Campus SSO:</strong> SAML 2.0 / OpenID Connect (Microsoft Entra ID & Google Workspace for Education).</li>
                    <li><strong>Phone Identity Binding:</strong> 6-digit OTP challenge before processing privileged requests via WhatsApp.</li>
                    <li><strong>Step-Up Authentication:</strong> Out-of-band push verification mandatory before clearing security-sensitive tickets.</li>
                    <li><strong>Role Isolation:</strong> Students/Faculty view only their tickets; Technicians routed via Department RLS.</li>
                  </ul>
                </div>
              </div>

              <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 font-mono text-[11px] text-slate-300 overflow-x-auto">
                <p className="text-indigo-400 font-semibold mb-2"># Live System API Endpoints</p>
                <p>POST /api/email-inbound      - Inbound email webhook parser (DKIM/DMARC checks)</p>
                <p>GET  /api/whatsapp-webhook   - Meta webhook challenge & token handshake</p>
                <p>POST /api/whatsapp-webhook   - Inbound WhatsApp message & call session dispatcher</p>
              </div>
            </div>
          )}

        </main>

        {/* Footer */}
        <footer className="border-t border-slate-800 bg-slate-950/90 py-6 mt-12 text-slate-400">
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

      </div>
    </AppProvider>
  );
}
