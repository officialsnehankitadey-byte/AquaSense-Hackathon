'use client';

import React, { useState } from 'react';
import { 
  AlertTriangle, 
  ShieldAlert, 
  Clock, 
  MapPin, 
  CheckCircle2, 
  UserCheck, 
  ChevronRight, 
  Activity, 
  Wrench, 
  DollarSign, 
  Zap,
  Filter,
  Eye
} from 'lucide-react';
import { Incident, SeverityLevel } from '../../types/dashboard';

interface IncidentsListProps {
  incidents: Incident[];
  onSelectIncident?: (incident: Incident) => void;
}

export const IncidentsList: React.FC<IncidentsListProps> = ({
  incidents,
  onSelectIncident,
}) => {
  const [filterSeverity, setFilterSeverity] = useState<string>('ALL');
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);

  const getSeverityBadge = (severity: SeverityLevel) => {
    switch (severity) {
      case 'CRITICAL':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold rounded-lg bg-red-500/15 text-red-600 dark:text-red-400 border border-red-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
            CRITICAL
          </span>
        );
      case 'HIGH':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold rounded-lg bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30">
            HIGH
          </span>
        );
      case 'MEDIUM':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold rounded-lg bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/30">
            MEDIUM
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold rounded-lg bg-slate-500/15 text-slate-600 dark:text-slate-400 border border-slate-500/30">
            LOW
          </span>
        );
    }
  };

  const getStatusBadge = (status: Incident['status']) => {
    switch (status) {
      case 'DISPATCHED':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
            <UserCheck className="w-3 h-3" /> Dispatched
          </span>
        );
      case 'INVESTIGATING':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20">
            <Activity className="w-3 h-3 animate-spin" /> Analyzing
          </span>
        );
      case 'REPAIRED':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-medium text-cyan-600 dark:text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-md border border-cyan-500/20">
            <CheckCircle2 className="w-3 h-3" /> Repaired
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-500 dark:text-slate-400 bg-slate-500/10 px-2 py-0.5 rounded-md border border-slate-500/20">
            Unassigned
          </span>
        );
    }
  };

  const filteredIncidents = incidents.filter(inc => {
    if (filterSeverity === 'ALL') return true;
    return inc.severity === filterSeverity;
  });

  return (
    <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col">
      {/* Table Header & Severity Filters */}
      <div className="p-4 md:p-5 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20">
            <AlertTriangle className="w-5 h-5 text-amber-500" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
              Active Leaks & AI Anomaly Detection Log
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Ranked by acoustic confidence score and pressure drop signature
            </p>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl border border-slate-200 dark:border-slate-700/60">
          {['ALL', 'CRITICAL', 'HIGH', 'MEDIUM'].map((sev) => (
            <button
              key={sev}
              onClick={() => setFilterSeverity(sev)}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                filterSeverity === sev
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              {sev}
            </button>
          ))}
        </div>
      </div>

      {/* Incidents Table View for Desktop / Responsive Cards for Mobile */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-950/50 text-slate-500 dark:text-slate-400 font-semibold border-b border-slate-200 dark:border-slate-800 uppercase tracking-wider text-[11px]">
              <th className="py-3 px-4">Incident Code</th>
              <th className="py-3 px-4">Severity</th>
              <th className="py-3 px-4">Location & Pipe Specs</th>
              <th className="py-3 px-4">AI Confidence</th>
              <th className="py-3 px-4">Est. Loss Rate</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-800/60 text-slate-700 dark:text-slate-200 font-medium">
            {filteredIncidents.map((inc) => (
              <tr 
                key={inc.id}
                className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group cursor-pointer"
                onClick={() => setSelectedIncident(inc)}
              >
                <td className="py-3.5 px-4 font-mono font-bold text-cyan-600 dark:text-cyan-400">
                  {inc.code}
                  <span className="block text-[10px] text-slate-400 font-sans font-normal">{inc.detectedTime}</span>
                </td>
                <td className="py-3.5 px-4">
                  {getSeverityBadge(inc.severity)}
                </td>
                <td className="py-3.5 px-4 max-w-xs">
                  <div className="flex items-center gap-1.5 font-semibold text-slate-900 dark:text-white">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{inc.location}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 pl-5">
                    {inc.pipeDiameter} {inc.pipeType} • {inc.dmaZone.split(' ')[0]}
                  </p>
                </td>
                <td className="py-3.5 px-4">
                  <div className="flex items-center gap-2">
                    <div className="w-12 bg-slate-200 dark:bg-slate-700 rounded-full h-1.5">
                      <div 
                        className={`h-full rounded-full ${
                          inc.confidence > 90 ? 'bg-emerald-500' : 'bg-cyan-500'
                        }`} 
                        style={{ width: `${inc.confidence}%` }}
                      />
                    </div>
                    <span className="font-bold text-slate-900 dark:text-white font-mono">{inc.confidence}%</span>
                  </div>
                </td>
                <td className="py-3.5 px-4 font-mono">
                  <span className="font-bold text-red-600 dark:text-red-400">{inc.estimatedLossGpm} GPM</span>
                  <span className="block text-[10px] text-slate-400">${inc.estimatedDailyCost}/day</span>
                </td>
                <td className="py-3.5 px-4">
                  {getStatusBadge(inc.status)}
                </td>
                <td className="py-3.5 px-4 text-right">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedIncident(inc);
                    }}
                    className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-cyan-500/20 hover:text-cyan-400 text-slate-600 dark:text-slate-300 transition-all"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Detail Inspector Drawer / Modal */}
      {selectedIncident && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl p-6 text-slate-100 shadow-2xl relative">
            <div className="flex items-start justify-between border-b border-slate-800 pb-4 mb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-cyan-400">{selectedIncident.code}</span>
                  {getSeverityBadge(selectedIncident.severity)}
                </div>
                <h3 className="text-base font-bold text-white mt-1">{selectedIncident.location}</h3>
              </div>
              <button 
                onClick={() => setSelectedIncident(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <p className="text-xs text-slate-300 bg-slate-950 p-3 rounded-xl border border-slate-800 leading-relaxed">
                {selectedIncident.summary}
              </p>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
                  <span className="text-slate-400 block text-[10px] uppercase">Acoustic Frequency</span>
                  <span className="font-mono font-bold text-cyan-400 text-sm">{selectedIncident.acousticFreq} Hz</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
                  <span className="text-slate-400 block text-[10px] uppercase">Pressure Drop</span>
                  <span className="font-mono font-bold text-red-400 text-sm">-{selectedIncident.pressureDropPsi} PSI</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
                  <span className="text-slate-400 block text-[10px] uppercase">Pipe Specification</span>
                  <span className="font-semibold text-white">{selectedIncident.pipeDiameter} {selectedIncident.pipeType}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
                  <span className="text-slate-400 block text-[10px] uppercase">Daily Economic Loss</span>
                  <span className="font-mono font-bold text-amber-400 text-sm">${selectedIncident.estimatedDailyCost}/day</span>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button 
                  onClick={() => {
                    alert(`Dispatched crew to ${selectedIncident.location}`);
                    setSelectedIncident(null);
                  }}
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-semibold text-xs hover:opacity-90 transition-all flex items-center justify-center gap-2"
                >
                  <Wrench className="w-4 h-4" /> Dispatch Field Crew
                </button>
                <button 
                  onClick={() => setSelectedIncident(null)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-semibold text-xs hover:bg-slate-700 transition-all"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
