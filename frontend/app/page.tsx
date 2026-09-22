'use client';

import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { KPISection } from './components/dashboard/KPISection';
import { NetworkTopologyMap } from './components/dashboard/NetworkTopologyMap';
import { IncidentsList } from './components/dashboard/IncidentsList';
import { RepairPriorityCard } from './components/dashboard/RepairPriorityCard';
import { TelemetryChart } from './components/dashboard/TelemetryChart';
import { RepairVerificationCard } from './components/dashboard/RepairVerificationCard';
import { 
  mockKPIs, 
  mockIncidents, 
  mockNetworkNodes, 
  mockPipeSegments, 
  mockRepairPriorities, 
  mockDMAZones,
  mockRepairVerifications
} from './data/mockData';
import { Incident, IncidentStatus } from './types/dashboard';

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [selectedZone, setSelectedZone] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [incidents, setIncidents] = useState<Incident[]>(mockIncidents);

  // Sync dark class on html root element
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  };

  const handleUpdateIncidentStatus = (incidentId: string, newStatus: IncidentStatus) => {
    setIncidents(prev =>
      prev.map(inc => (inc.id === incidentId ? { ...inc, status: newStatus } : inc))
    );
  };

  // Filtered incidents based on search & DMA zone
  const filteredIncidents = incidents.filter((inc) => {
    const matchesSearch = 
      inc.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inc.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inc.dmaZone.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesZone = selectedZone === 'all' || inc.dmaZone.toLowerCase().includes(selectedZone.toLowerCase());

    return matchesSearch && matchesZone;
  });

  // Filtered nodes based on zone
  const filteredNodes = mockNetworkNodes.filter((node) => {
    if (selectedZone === 'all') return true;
    const targetZoneObj = mockDMAZones.find(z => z.id === selectedZone);
    if (!targetZoneObj) return true;
    return node.zone === targetZoneObj.name.split(' ')[0];
  });

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-[#090d16] text-slate-900 dark:text-slate-100 flex transition-colors duration-200">
      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      {/* Main Dashboard Layout */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
        {/* Top Header */}
        <Header
          onMenuClick={() => setMobileOpen(true)}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          selectedZone={selectedZone}
          setSelectedZone={setSelectedZone}
          dmaZones={mockDMAZones}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onRefresh={handleRefresh}
          isRefreshing={isRefreshing}
        />

        {/* Content Body Container */}
        <main className="flex-1 p-4 md:p-6 space-y-6 max-w-7xl mx-auto w-full">
          {/* Top Banner Context / Page Title */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl md:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  Water Intelligence Control Room
                </h1>
                <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                  Telemetry Active
                </span>
              </div>
              <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                AI hydro-acoustic correlation & real-time non-revenue water (NRW) leak pinpointing
              </p>
            </div>
          </div>

          {/* KPI Cards Section */}
          <KPISection metrics={mockKPIs} />

          {/* Network GIS Topology Map Section */}
          <NetworkTopologyMap nodes={filteredNodes} pipes={mockPipeSegments} />

          {/* Grid Layout: Active Incidents & Repair Priority Matrix */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {/* Telemetry Chart */}
              <TelemetryChart />
              
              {/* Incidents Log */}
              <IncidentsList 
                incidents={filteredIncidents} 
                onUpdateIncidentStatus={handleUpdateIncidentStatus}
              />
            </div>

            <div className="lg:col-span-1 space-y-6">
              {/* Repair Priority Section */}
              <RepairPriorityCard priorities={mockRepairPriorities} />

              {/* Repair Verification Section */}
              <RepairVerificationCard verifications={mockRepairVerifications} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
