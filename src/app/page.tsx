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
import { CentralLandingPortal } from '@/components/CentralLandingPortal';
import { TechnicianWorkspace } from '@/components/TechnicianWorkspace';
import { AuthModal } from '@/components/AuthModal';
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
  UserPlus,
  Lock,
  Wrench,
  ArrowLeft
} from 'lucide-react';

export default function Home() {
  return (
    <AppProvider>
      <MainDashboardApp />
    </AppProvider>
  );
}

function MainDashboardApp() {
  const { theme, tickets, facilities, portalMode, setPortalMode, logout } = useApp();
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>('tkt-101');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  
  // Auth Modal State
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authTargetRole, setAuthTargetRole] = useState<'ADMIN' | 'TECHNICIAN' | 'STUDENT'>('TECHNICIAN');

  // Internal tab states for Admin Portal
  const [adminTab, setAdminTab] = useState<'DASHBOARD' | 'CONSOLE' | 'STUDIO' | 'ADMIN' | 'GOVERNANCE' | 'ARCHITECTURE'>('DASHBOARD');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // Handle navigation from dashboard cards to incident console
  const handleNavigateToTickets = (filterStatus?: string) => {
    if (filterStatus) {
      setStatusFilter(filterStatus);
    }
    setAdminTab('CONSOLE');
  };

  const handleReportFacility = (facility: Facility) => {
    setIsCreateModalOpen(true);
  };

  const openAuthWithRole = (role: 'ADMIN' | 'TECHNICIAN' | 'STUDENT') => {
    setAuthTargetRole(role);
    setIsAuthModalOpen(true);
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

      {/* ============================================================== */}
      {/* 1. CENTRAL LANDING PAGE OF CAMPUS IT SUPPORT PORTAL */}
      {/* ============================================================== */}
      {portalMode === 'CENTRAL_LANDING' && (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-1 w-full">
          <CentralLandingPortal 
            onOpenAuthModal={openAuthWithRole}
            onOpenRegisterModal={() => setIsRegisterModalOpen(true)}
            onOpenCreateTicketModal={() => setIsCreateModalOpen(true)}
            onOpenWhatsAppStudio={() => {
              setPortalMode('PUBLIC_PORTAL');
            }}
          />
        </main>
      )}

      {/* ============================================================== */}
      {/* 2. TECHNICIAN'S OWN PORTAL (ACCESSED VIA USERNAME & PASSWORD) */}
      {/* ============================================================== */}
      {portalMode === 'TECHNICIAN_PORTAL' && (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-1 w-full">
          <TechnicianWorkspace onReturnToLanding={logout} />
        </main>
      )}

      {/* ============================================================== */}
      {/* 3. CENTRAL ADMIN MANAGEMENT & TICKETING PORTAL (GATED) */}
      {/* ============================================================== */}
      {portalMode === 'ADMIN_PORTAL' && (
        <div className="flex-1 flex flex-col">
          {/* Admin Toolbar & Navigation Tabs */}
          <div className={`border-b border-slate-800/80 ${isMidnight ? 'bg-[#0b1329]/70' : 'bg-slate-900/60'} backdrop-blur-md sticky top-16 z-40`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex flex-wrap items-center justify-between gap-3">
              
              <div className="flex items-center space-x-1 bg-slate-950/80 p-1 rounded-xl border border-slate-800 text-xs font-medium overflow-x-auto shadow-inner">
                {/* TAB 1: EXECUTIVE DASHBOARD */}
                <button
                  onClick={() => setAdminTab('DASHBOARD')}
                  className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition ${
                    adminTab === 'DASHBOARD'
                      ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow font-semibold'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                  }`}
                >
                  <BarChart3 className="h-3.5 w-3.5 text-indigo-300" /> Executive Dashboard
                  <span className="text-[10px] bg-slate-800/90 text-emerald-300 border border-emerald-500/30 px-1.5 py-0.2 rounded-full font-mono">
                    {resolvedCount} Res
                  </span>
                </button>

                {/* TAB 2: MASTER TICKETING CONSOLE */}
                <button
                  onClick={() => setAdminTab('CONSOLE')}
                  className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition ${
                    adminTab === 'CONSOLE'
                      ? 'bg-indigo-600 text-white shadow font-semibold'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                  }`}
                >
                  <LayoutDashboard className="h-3.5 w-3.5" /> Global Ticketing Console
                  {newCount > 0 && (
                    <span className="text-[10px] bg-blue-500/20 text-blue-300 border border-blue-500/40 px-1.5 py-0.2 rounded-full font-mono font-bold">
                      {newCount} New
                    </span>
                  )}
                </button>

                {/* TAB 3: ADMIN SETUP, VERIFICATION & CONFIG */}
                <button
                  onClick={() => setAdminTab('ADMIN')}
                  className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition ${
                    adminTab === 'ADMIN'
                      ? 'bg-purple-600 text-white shadow font-semibold'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                  }`}
                >
                  <Settings className="h-3.5 w-3.5" /> Verification Desk &amp; Config
                </button>

                {/* TAB 4: WHATSAPP VOICE & AISHA GATEWAY */}
                <button
                  onClick={() => setAdminTab('STUDIO')}
                  className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition ${
                    adminTab === 'STUDIO'
                      ? 'bg-emerald-600 text-white shadow font-semibold'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                  }`}
                >
                  <PhoneCall className="h-3.5 w-3.5" /> WhatsApp &amp; Voice Studio
                </button>

                {/* TAB 5: FERPA AUDIT LOGS */}
                <button
                  onClick={() => setAdminTab('GOVERNANCE')}
                  className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition ${
                    adminTab === 'GOVERNANCE'
                      ? 'bg-indigo-600 text-white shadow font-semibold'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                  }`}
                >
                  <ShieldCheck className="h-3.5 w-3.5" /> Audit Logs
                </button>

                {/* TAB 6: SPECS */}
                <button
                  onClick={() => setAdminTab('ARCHITECTURE')}
                  className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition ${
                    adminTab === 'ARCHITECTURE'
                      ? 'bg-indigo-600 text-white shadow font-semibold'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                  }`}
                >
                  <Layers className="h-3.5 w-3.5" /> Architecture Specs
                </button>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setIsCreateModalOpen(true)}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-lg shadow-indigo-600/30 transition"
                >
                  <PlusCircle className="h-4 w-4" /> New Ticket
                </button>
                <button
                  onClick={logout}
                  className="bg-slate-900 hover:bg-slate-800 text-rose-300 border border-slate-700 text-xs font-semibold px-3 py-2 rounded-xl flex items-center gap-1 transition"
                  title="Sign out of Admin Portal"
                >
                  <ArrowLeft className="h-3.5 w-3.5" /> Exit
                </button>
              </div>

            </div>
          </div>

          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-1 w-full">
            {adminTab === 'DASHBOARD' && (
              <AnalyticsDashboard onNavigateToTickets={handleNavigateToTickets} />
            )}

            {adminTab === 'CONSOLE' && (
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
            )}

            {adminTab === 'ADMIN' && (
              <AdminPanel />
            )}

            {adminTab === 'STUDIO' && (
              <WhatsAppCallStudio
                onOpenTicket={(tktId) => {
                  setSelectedTicketId(tktId);
                  setAdminTab('CONSOLE');
                }}
              />
            )}

            {adminTab === 'GOVERNANCE' && (
              <AuditAndGovernanceView />
            )}

            {adminTab === 'ARCHITECTURE' && (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl text-xs text-slate-300">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Layers className="h-4 w-4 text-indigo-400" />
                  Campus IT Enterprise Architecture Specs
                </h3>
                <p className="text-slate-400">
                  Detailed documentation available in <code>campus-it-facilities-ticketing-specification.md</code>.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                    <p className="font-semibold text-indigo-300">RBAC Isolation</p>
                    <p className="text-[11px] text-slate-400 mt-1">Multi-tenant PostgreSQL Row-Level Security separating Student, Technician, and Admin views.</p>
                  </div>
                  <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                    <p className="font-semibold text-emerald-300">WhatsApp Voice Bridge</p>
                    <p className="text-[11px] text-slate-400 mt-1">LiveKit WebRTC SFU bridge with automated Whisper STT archiving to S3 WORM buckets.</p>
                  </div>
                </div>
              </div>
            )}
          </main>
        </div>
      )}

      {/* ============================================================== */}
      {/* 4. PUBLIC & STUDENT PORTAL */}
      {/* ============================================================== */}
      {portalMode === 'PUBLIC_PORTAL' && (
        <div className="flex-1 flex flex-col">
          {/* Public Portal Toolbar */}
          <div className="border-b border-slate-800 bg-slate-900/60 backdrop-blur-md sticky top-16 z-40">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Building2 className="h-4 w-4 text-indigo-400" />
                  Campus Facilities &amp; Student Help Center
                </span>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setIsRegisterModalOpen(true)}
                  className="bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 text-xs font-semibold px-3 py-1.5 rounded-xl flex items-center gap-1 transition"
                >
                  <UserPlus className="h-3.5 w-3.5 text-indigo-400" /> Self-Register
                </button>
                <button
                  onClick={() => setIsCreateModalOpen(true)}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-3.5 py-1.5 rounded-xl flex items-center gap-1 shadow transition"
                >
                  <PlusCircle className="h-3.5 w-3.5" /> Submit Ticket
                </button>
                <button
                  onClick={() => setPortalMode('CENTRAL_LANDING')}
                  className="text-slate-400 hover:text-white text-xs flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-800 transition"
                >
                  <ArrowLeft className="h-3 w-3" /> Central Portal
                </button>
              </div>
            </div>
          </div>

          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-1 w-full space-y-8">
            <PublicFacilitiesShowcase
              onReportFacilityIssue={handleReportFacility}
              onOpenRegisterModal={() => setIsRegisterModalOpen(true)}
            />
          </main>
        </div>
      )}

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

      {/* Auth / Credential Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        targetRole={authTargetRole}
      />

    </div>
  );
}
