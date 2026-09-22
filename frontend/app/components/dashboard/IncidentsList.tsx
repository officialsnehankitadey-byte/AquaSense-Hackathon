'use client';

import React, { useState } from 'react';
import { 
  AlertTriangle, 
  Clock, 
  MapPin, 
  CheckCircle2, 
  UserCheck, 
  Activity, 
  Wrench, 
  DollarSign, 
  Eye,
  Check,
  ShieldCheck,
  Droplets,
  Gauge,
  Info,
  X,
  Layers,
  Sparkles,
  ArrowUpRight
} from 'lucide-react';
import { Incident, SeverityLevel, IncidentStatus } from '../../types/dashboard';

interface IncidentsListProps {
  incidents: Incident[];
  onSelectIncident?: (incident: Incident) => void;
  onUpdateIncidentStatus?: (incidentId: string, newStatus: IncidentStatus) => void;
}

export const IncidentsList: React.FC<IncidentsListProps> = ({
  incidents,
  onSelectIncident,
  onUpdateIncidentStatus,
}) => {
  const [filterSeverity, setFilterSeverity] = useState<string>('ALL');
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);

  const handleStatusChange = (incidentId: string, newStatus: IncidentStatus) => {
    if (onUpdateIncidentStatus) {
      onUpdateIncidentStatus(incidentId, newStatus);
    }
    
    // Update local selected incident state to reflect instantly
    if (selectedIncident && selectedIncident.id === incidentId) {
      setSelectedIncident({ ...selectedIncident, status: newStatus });
    }

    const statusLabels: Record<IncidentStatus, string> = {
      UNASSIGNED: 'Unassigned',
      ACKNOWLEDGED: 'Acknowledged',
      INVESTIGATING: 'Investigating',
      DISPATCHED: 'Dispatched',
      REPAIR_IN_PROGRESS: 'Repair in Progress',
      REPAIRED: 'Repaired',
      RESOLVED: 'Resolved',
    };

    setActionFeedback(`Status updated to "${statusLabels[newStatus]}"`);
    setTimeout(() => {
      setActionFeedback(null);
    }, 3000);
  };

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

  const getStatusBadge = (status: IncidentStatus) => {
    switch (status) {
      case 'ACKNOWLEDGED':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded-md border border-indigo-500/20">
            <Check className="w-3 h-3" /> Acknowledged
          </span>
        );
      case 'REPAIR_IN_PROGRESS':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-md border border-amber-500/20">
            <Wrench className="w-3 h-3 animate-bounce" /> Repair in Progress
          </span>
        );
      case 'RESOLVED':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/20">
            <ShieldCheck className="w-3 h-3" /> Resolved
          </span>
        );
      case 'DISPATCHED':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-cyan-600 dark:text-cyan-400 bg-cyan-500/10 px-2.5 py-1 rounded-md border border-cyan-500/20">
            <UserCheck className="w-3 h-3" /> Dispatched
          </span>
        );
      case 'INVESTIGATING':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-md border border-amber-500/20">
            <Activity className="w-3 h-3 animate-spin" /> Investigating
          </span>
        );
      case 'REPAIRED':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-teal-600 dark:text-teal-400 bg-teal-500/10 px-2.5 py-1 rounded-md border border-teal-500/20">
            <CheckCircle2 className="w-3 h-3" /> Repaired
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 dark:text-slate-400 bg-slate-500/10 px-2.5 py-1 rounded-md border border-slate-500/20">
            Unassigned
          </span>
        );
    }
  };

  const filteredIncidents = incidents.filter(inc => {
    if (filterSeverity === 'ALL') return true;
    return inc.severity === filterSeverity;
  });

  const handleRowClick = (inc: Incident) => {
    setSelectedIncident(inc);
    if (onSelectIncident) {
      onSelectIncident(inc);
    }
  };

  return (
    <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col">
      {/* Table Header & Severity Filters */}
      <div className="p-4 md:p-5 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20">
            <AlertTriangle className="w-5 h-5 text-amber-500" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
              Active Leaks & AI Anomaly Detection Log
              <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20 font-mono font-medium">
                {filteredIncidents.length} active
              </span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Select any incident row or card to view detailed diagnostics and trigger repair workflows
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

      {/* Incidents Table View for Desktop */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-950/50 text-slate-500 dark:text-slate-400 font-semibold border-b border-slate-200 dark:border-slate-800 uppercase tracking-wider text-[11px]">
              <th className="py-3.5 px-4">Incident Code</th>
              <th className="py-3.5 px-4">Severity</th>
              <th className="py-3.5 px-4">Location & DMA Zone</th>
              <th className="py-3.5 px-4">AI Confidence</th>
              <th className="py-3.5 px-4">Est. Loss Rate</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-800/60 text-slate-700 dark:text-slate-200 font-medium">
            {filteredIncidents.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-slate-400">
                  No active incidents match the selected severity filter.
                </td>
              </tr>
            ) : (
              filteredIncidents.map((inc) => (
                <tr 
                  key={inc.id}
                  className="hover:bg-cyan-500/5 dark:hover:bg-slate-800/60 transition-all cursor-pointer group"
                  onClick={() => handleRowClick(inc)}
                >
                  <td className="py-3.5 px-4 font-mono font-bold text-cyan-600 dark:text-cyan-400 group-hover:underline">
                    <div className="flex items-center gap-1.5">
                      <span>{inc.code}</span>
                      <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-cyan-500" />
                    </div>
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
                    <p className="text-[11px] text-slate-400 pl-5 truncate">
                      {inc.dmaZone}
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
                    <span className="block text-[10px] text-slate-400">${inc.estimatedDailyCost.toLocaleString()}/day</span>
                  </td>
                  <td className="py-3.5 px-4">
                    {getStatusBadge(inc.status)}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRowClick(inc);
                      }}
                      className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-cyan-500/20 hover:text-cyan-400 text-slate-600 dark:text-slate-300 transition-all inline-flex items-center gap-1 text-xs font-semibold"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Inspect</span>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Responsive Cards View for Mobile */}
      <div className="block md:hidden p-4 space-y-3">
        {filteredIncidents.length === 0 ? (
          <p className="py-6 text-center text-xs text-slate-400">
            No active incidents match the selected severity filter.
          </p>
        ) : (
          filteredIncidents.map((inc) => (
            <div
              key={inc.id}
              onClick={() => handleRowClick(inc)}
              className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 hover:border-cyan-500/40 transition-all cursor-pointer space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-xs text-cyan-600 dark:text-cyan-400">{inc.code}</span>
                  {getSeverityBadge(inc.severity)}
                </div>
                {getStatusBadge(inc.status)}
              </div>

              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  {inc.location}
                </h4>
                <p className="text-[11px] text-slate-400 mt-0.5 pl-4">{inc.dmaZone}</p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px] bg-slate-100 dark:bg-slate-900 p-2.5 rounded-lg">
                <div>
                  <span className="text-slate-400 block text-[10px]">Confidence</span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white">{inc.confidence}%</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Est. Water Loss</span>
                  <span className="font-mono font-bold text-red-500">{inc.estimatedLossGpm} GPM</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {inc.detectedTime}
                </span>
                <span className="text-cyan-600 dark:text-cyan-400 font-semibold flex items-center gap-1">
                  Tap for full panel <ArrowUpRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Detailed Incident Modal / Drawer */}
      {selectedIncident && (
        <div 
          className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-md flex items-center justify-center p-3 md:p-6 overflow-y-auto"
          onClick={() => setSelectedIncident(null)}
        >
          <div 
            className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl text-slate-100 shadow-2xl relative overflow-hidden my-auto max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-800 bg-slate-950/60 flex items-start justify-between gap-4 sticky top-0 z-10">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                    ID: {selectedIncident.code}
                  </span>
                  {getSeverityBadge(selectedIncident.severity)}
                  {getStatusBadge(selectedIncident.status)}
                </div>
                <h3 className="text-lg font-extrabold text-white mt-2 tracking-tight">
                  {selectedIncident.location}
                </h3>
                <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
                  <Layers className="w-3.5 h-3.5 text-cyan-400" />
                  {selectedIncident.dmaZone}
                </p>
              </div>
              <button 
                onClick={() => setSelectedIncident(null)}
                className="text-slate-400 hover:text-white p-2 rounded-xl bg-slate-800/80 hover:bg-slate-800 transition-colors"
                title="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 space-y-5 overflow-y-auto flex-1 text-xs">
              {/* Toast Feedback Notification */}
              {actionFeedback && (
                <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-semibold flex items-center gap-2 animate-fadeIn">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{actionFeedback}</span>
                </div>
              )}

              {/* Grid 1: Comprehensive Anomaly Metrics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="p-3.5 rounded-xl bg-slate-800/50 border border-slate-700/60 flex flex-col justify-between">
                  <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider flex items-center gap-1">
                    <Clock className="w-3 h-3 text-cyan-400" /> Detection Time
                  </span>
                  <span className="font-semibold text-white text-sm mt-1">{selectedIncident.detectedTime}</span>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-800/50 border border-slate-700/60 flex flex-col justify-between">
                  <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-cyan-400" /> AI Confidence
                  </span>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="font-mono font-bold text-white text-sm">{selectedIncident.confidence}%</span>
                    <div className="flex-1 bg-slate-700 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-cyan-400 h-full rounded-full" style={{ width: `${selectedIncident.confidence}%` }} />
                    </div>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-800/50 border border-slate-700/60 flex flex-col justify-between">
                  <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider flex items-center gap-1">
                    <Gauge className="w-3 h-3 text-red-400" /> Pressure Anomaly
                  </span>
                  <span className="font-mono font-bold text-red-400 text-sm mt-1">
                    -{selectedIncident.pressureDropPsi} PSI drop
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-800/50 border border-slate-700/60 flex flex-col justify-between">
                  <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider flex items-center gap-1">
                    <Droplets className="w-3 h-3 text-amber-400" /> Est. Loss Rate
                  </span>
                  <div>
                    <span className="font-mono font-bold text-amber-400 text-sm">{selectedIncident.estimatedLossGpm} GPM</span>
                    <span className="block text-[10px] text-slate-400 font-mono">${selectedIncident.estimatedDailyCost.toLocaleString()}/day</span>
                  </div>
                </div>
              </div>

              {/* Technical Specifications Section */}
              <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/50 space-y-3">
                <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5 text-cyan-400" /> Technical & Infrastructure Specifications
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800">
                    <span className="text-[10px] text-slate-400 block uppercase">Suspected Pipe / Segment</span>
                    <span className="font-semibold text-white text-xs mt-0.5 block truncate" title={selectedIncident.suspectedSegment}>
                      {selectedIncident.suspectedSegment || 'Main Feeder Line'}
                    </span>
                  </div>

                  <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800">
                    <span className="text-[10px] text-slate-400 block uppercase">Pipe Material & Size</span>
                    <span className="font-semibold text-white text-xs mt-0.5 block">
                      {selectedIncident.pipeDiameter} • {selectedIncident.pipeType}
                    </span>
                  </div>

                  <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800">
                    <span className="text-[10px] text-slate-400 block uppercase">Repair Priority</span>
                    <span className="font-mono font-bold text-amber-400 text-xs mt-0.5 block">
                      Priority #{selectedIncident.repairPriority || 1}
                    </span>
                  </div>
                </div>
              </div>

              {/* Summary & Recommended Action */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                <div>
                  <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Activity className="w-3.5 h-3.5 text-amber-400" /> Acoustic Sensor Anomaly Signature
                  </h4>
                  <p className="text-slate-300 mt-1 leading-relaxed text-xs">
                    {selectedIncident.summary}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-800/80">
                  <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-cyan-400" /> AI Recommended Action
                  </h4>
                  <p className="text-slate-200 mt-1 leading-relaxed text-xs font-medium">
                    {selectedIncident.recommendedAction || selectedIncident.summary}
                  </p>
                </div>
              </div>
            </div>

            {/* Action Footer Bar */}
            <div className="p-4 bg-slate-950/90 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 sticky bottom-0 z-10">
              <span className="text-[11px] text-slate-400 font-medium self-start sm:self-auto">
                Update Status:
              </span>

              <div className="grid grid-cols-3 gap-2 w-full sm:w-auto flex-1 max-w-md">
                <button
                  onClick={() => handleStatusChange(selectedIncident.id, 'ACKNOWLEDGED')}
                  className={`py-2 px-3 rounded-xl font-semibold text-xs transition-all flex items-center justify-center gap-1.5 border ${
                    selectedIncident.status === 'ACKNOWLEDGED'
                      ? 'bg-indigo-600 text-white border-indigo-500 shadow-lg shadow-indigo-600/30'
                      : 'bg-indigo-500/10 text-indigo-300 border-indigo-500/30 hover:bg-indigo-500/20'
                  }`}
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Acknowledged</span>
                </button>

                <button
                  onClick={() => handleStatusChange(selectedIncident.id, 'REPAIR_IN_PROGRESS')}
                  className={`py-2 px-3 rounded-xl font-semibold text-xs transition-all flex items-center justify-center gap-1.5 border ${
                    selectedIncident.status === 'REPAIR_IN_PROGRESS'
                      ? 'bg-amber-600 text-white border-amber-500 shadow-lg shadow-amber-600/30'
                      : 'bg-amber-500/10 text-amber-300 border-amber-500/30 hover:bg-amber-500/20'
                  }`}
                >
                  <Wrench className="w-3.5 h-3.5" />
                  <span>In Progress</span>
                </button>

                <button
                  onClick={() => handleStatusChange(selectedIncident.id, 'RESOLVED')}
                  className={`py-2 px-3 rounded-xl font-semibold text-xs transition-all flex items-center justify-center gap-1.5 border ${
                    selectedIncident.status === 'RESOLVED'
                      ? 'bg-emerald-600 text-white border-emerald-500 shadow-lg shadow-emerald-600/30'
                      : 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/20'
                  }`}
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Resolved</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
