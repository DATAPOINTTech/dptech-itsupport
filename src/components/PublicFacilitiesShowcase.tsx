'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Facility, FacilityType, FacilityStatus } from '@/types';
import { 
  Monitor, 
  Wifi, 
  Printer, 
  Presentation, 
  DownloadCloud, 
  Search, 
  Filter, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  MapPin, 
  Users, 
  Cpu, 
  Wrench, 
  ExternalLink,
  ShieldCheck,
  UserPlus
} from 'lucide-react';

export function PublicFacilitiesShowcase({ 
  onReportFacilityIssue, 
  onOpenRegisterModal 
}: { 
  onReportFacilityIssue: (facility: Facility) => void;
  onOpenRegisterModal: () => void;
}) {
  const { facilities } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');

  const filteredFacilities = facilities.filter(fac => {
    if (selectedType !== 'ALL' && fac.type !== selectedType) return false;
    if (selectedStatus !== 'ALL' && fac.status !== selectedStatus) return false;
    if (searchTerm) {
      const match = fac.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    fac.building.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    fac.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    fac.roomNumber.toLowerCase().includes(searchTerm.toLowerCase());
      if (!match) return false;
    }
    return true;
  });

  const getTypeIcon = (type: FacilityType) => {
    switch (type) {
      case 'COMPUTER_LAB':
        return <Monitor className="h-5 w-5 text-indigo-400" />;
      case 'WIFI_ZONE':
        return <Wifi className="h-5 w-5 text-emerald-400" />;
      case 'PRINT_KIOSK':
        return <Printer className="h-5 w-5 text-teal-400" />;
      case 'AUDITORIUM_AV':
        return <Presentation className="h-5 w-5 text-amber-400" />;
      case 'SOFTWARE_REPO':
        return <DownloadCloud className="h-5 w-5 text-blue-400" />;
    }
  };

  const getStatusBadge = (status: FacilityStatus) => {
    switch (status) {
      case 'OPERATIONAL':
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-500/30">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Operational
          </span>
        );
      case 'DEGRADED':
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-950/80 text-amber-300 border border-amber-500/30">
            <AlertTriangle className="h-3 w-3 text-amber-400" />
            Degraded Performance
          </span>
        );
      case 'SCHEDULED_MAINTENANCE':
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-950/80 text-blue-300 border border-blue-500/30">
            <Clock className="h-3 w-3 text-blue-400" />
            Maintenance
          </span>
        );
      case 'OFFLINE':
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-rose-950/80 text-rose-300 border border-rose-500/30">
            <span className="h-2 w-2 rounded-full bg-rose-500"></span>
            Offline
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Hero Showcase Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/70 to-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-300 bg-indigo-900/60 border border-indigo-700/50 px-2.5 py-0.5 rounded-full">
                Public Resource Catalog
              </span>
              <span className="text-[11px] text-slate-400 font-mono">
                Live Status Telemetry
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Campus IT Facilities &amp; Resource Center
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
              Explore open computing labs, high-density Wi-Fi zones, contactless cloud printing kiosks, and institutional software repositories with real-time operational diagnostics.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={onOpenRegisterModal}
              className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 transition"
            >
              <UserPlus className="h-4 w-4" /> Register Campus Account
            </button>
          </div>
        </div>

        {/* Global Summary Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-slate-800/80 text-xs">
          <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800">
            <p className="text-slate-400 text-[11px]">Total Facilities</p>
            <p className="text-xl font-bold text-white font-mono mt-0.5">{facilities.length}</p>
          </div>
          <div className="bg-slate-950/70 p-3 rounded-xl border border-emerald-500/30">
            <p className="text-emerald-400 text-[11px]">Operational</p>
            <p className="text-xl font-bold text-white font-mono mt-0.5">
              {facilities.filter(f => f.status === 'OPERATIONAL').length}
            </p>
          </div>
          <div className="bg-slate-950/70 p-3 rounded-xl border border-amber-500/30">
            <p className="text-amber-400 text-[11px]">Degraded / Under Repair</p>
            <p className="text-xl font-bold text-white font-mono mt-0.5">
              {facilities.filter(f => f.status === 'DEGRADED').length}
            </p>
          </div>
          <div className="bg-slate-950/70 p-3 rounded-xl border border-blue-500/30">
            <p className="text-blue-400 text-[11px]">Scheduled Maintenance</p>
            <p className="text-xl font-bold text-white font-mono mt-0.5">
              {facilities.filter(f => f.status === 'SCHEDULED_MAINTENANCE').length}
            </p>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-3 shadow-xl">
        <div className="relative w-full md:w-96">
          <Search className="h-4 w-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search facility name, building, room number..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700/80 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <select
            value={selectedType}
            onChange={e => setSelectedType(e.target.value)}
            className="bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
          >
            <option value="ALL">All Resource Types</option>
            <option value="COMPUTER_LAB">Computer Labs</option>
            <option value="WIFI_ZONE">Wi-Fi Zones</option>
            <option value="PRINT_KIOSK">Printing &amp; Kiosks</option>
            <option value="AUDITORIUM_AV">Auditorium &amp; AV</option>
            <option value="SOFTWARE_REPO">Software Repos</option>
          </select>

          <select
            value={selectedStatus}
            onChange={e => setSelectedStatus(e.target.value)}
            className="bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
          >
            <option value="ALL">All Statuses</option>
            <option value="OPERATIONAL">Operational</option>
            <option value="DEGRADED">Degraded</option>
            <option value="SCHEDULED_MAINTENANCE">Maintenance</option>
          </select>
        </div>
      </div>

      {/* Facilities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredFacilities.map((facility) => (
          <div 
            key={facility.id}
            className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 shadow-xl flex flex-col justify-between transition-all duration-300 hover:shadow-indigo-500/5 group"
          >
            <div>
              {/* Header with Type & Status */}
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center space-x-2.5">
                  <div className="h-10 w-10 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center shrink-0 shadow">
                    {getTypeIcon(facility.type)}
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-slate-400 font-semibold">{facility.code}</span>
                    <h3 className="text-sm font-bold text-white group-hover:text-indigo-300 transition leading-snug">
                      {facility.name}
                    </h3>
                  </div>
                </div>
              </div>

              {/* Status Badge */}
              <div className="mb-3">
                {getStatusBadge(facility.status)}
              </div>

              {/* Location & Capacity */}
              <div className="space-y-1.5 text-xs text-slate-300 bg-slate-950/80 p-3 rounded-xl border border-slate-800/80 mb-3">
                <div className="flex items-center gap-1.5 text-slate-400">
                  <MapPin className="h-3.5 w-3.5 text-indigo-400 shrink-0" />
                  <span>{facility.building} &bull; <strong className="text-slate-200">{facility.roomNumber}</strong></span>
                </div>
                {facility.capacitySeats && (
                  <div className="flex items-center gap-1.5 text-slate-400">
                    <Users className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                    <span>Capacity: <strong className="text-slate-200">{facility.capacitySeats} workstations</strong></span>
                  </div>
                )}
                <div className="flex items-center gap-1.5 text-slate-400">
                  <Clock className="h-3.5 w-3.5 text-blue-400 shrink-0" />
                  <span>Hours: <span className="text-slate-300">{facility.operatingHours}</span></span>
                </div>
              </div>

              {/* Hardware / Facility Specifications */}
              <div className="space-y-1.5 text-xs text-slate-300 mb-4">
                {facility.specs.workstations && (
                  <p className="text-[11px] text-slate-300">
                    <strong className="text-slate-400">Hardware:</strong> {facility.specs.workstations}
                  </p>
                )}
                {facility.specs.gpus && (
                  <p className="text-[11px] text-indigo-300">
                    <strong className="text-slate-400">GPU:</strong> {facility.specs.gpus}
                  </p>
                )}
                {facility.specs.features && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {facility.specs.features.map((feat, i) => (
                      <span key={i} className="text-[10px] bg-slate-800/80 text-slate-300 px-2 py-0.5 rounded-md border border-slate-700/50">
                        {feat}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {facility.statusNote && (
                <div className={`p-2.5 rounded-lg border text-[11px] mb-4 ${
                  facility.status === 'DEGRADED' 
                    ? 'bg-amber-950/40 border-amber-600/30 text-amber-200' 
                    : facility.status === 'SCHEDULED_MAINTENANCE'
                    ? 'bg-blue-950/40 border-blue-600/30 text-blue-200'
                    : 'bg-slate-950 border-slate-800 text-slate-400'
                }`}>
                  <strong>Notice:</strong> {facility.statusNote}
                </div>
              )}
            </div>

            {/* Action Bar */}
            <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
              <span className="text-[10px] text-slate-500 font-mono">DATAPOINT Monitored</span>
              <button
                type="button"
                onClick={() => onReportFacilityIssue(facility)}
                className="bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 hover:text-white border border-indigo-500/30 px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition"
              >
                <Wrench className="h-3.5 w-3.5" /> Report Issue
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
