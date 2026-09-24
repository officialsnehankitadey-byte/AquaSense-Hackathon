'use client';

import React, { useState } from 'react';
import { 
  Wrench, 
  Sparkles, 
  Clock, 
  ShieldAlert, 
  CheckCircle2, 
  Flame, 
  Check, 
  UserCheck, 
  MapPin, 
  Eye, 
  X, 
  Droplets, 
  DollarSign, 
  Activity, 
  Layers, 
  ArrowUpRight,
  ShieldCheck,
  AlertTriangle
} from 'lucide-react';
import { RepairPriorityItem, DispatchStatus, SeverityLevel } from '../../types/dashboard';
import { apiService } from '../../services/api';

interface RepairPriorityCardProps {
  priorities: RepairPriorityItem[];
}

export const RepairPriorityCard: React.FC<RepairPriorityCardProps> = ({ priorities: initialPriorities }) => {
  const [items, setItems] = useState<RepairPriorityItem[]>(initialPriorities);
  const [selectedPriority, setSelectedPriority] = useState<RepairPriorityItem | null>(null);
  const [dispatchItem, setDispatchItem] = useState<RepairPriorityItem | null>(null);
  const [selectedCrew, setSelectedCrew] = useState('Alpha Crew - Rapid Response (HDPE Specialist)');
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  const handleUpdateStatus = async (id: string, newStatus: DispatchStatus, crewName?: string) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, dispatchStatus: newStatus } : item))
    );

    if (selectedPriority && selectedPriority.id === id) {
      setSelectedPriority((prev) => prev ? { ...prev, dispatchStatus: newStatus } : null);
    }

    try {
      if (newStatus === 'DISPATCHED') {
        await apiService.dispatchCrew(id, crewName || selectedCrew);
      }
    } catch (e) {
      // Offline fallback
    }

    const statusText = newStatus === 'PENDING' ? 'Pending' : newStatus === 'DISPATCHED' ? `Dispatched to ${crewName || selectedCrew}` : 'Completed';
    setFeedbackMsg(`Work Order #${id} updated: ${statusText}`);
    setTimeout(() => {
      setFeedbackMsg(null);
    }, 3500);
  };

  const getSeverityBadge = (severity: SeverityLevel) => {
    switch (severity) {
      case 'CRITICAL':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-bold rounded-md bg-red-500/15 text-red-600 dark:text-red-400 border border-red-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
            CRITICAL
          </span>
        );
      case 'HIGH':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-bold rounded-md bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30">
            HIGH
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-bold rounded-md bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/30">
            MEDIUM
          </span>
        );
    }
  };

  const getDispatchBadge = (status?: DispatchStatus) => {
    switch (status) {
      case 'DISPATCHED':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-cyan-600 dark:text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-md border border-cyan-500/20">
            <UserCheck className="w-3 h-3" /> Dispatched
          </span>
        );
      case 'COMPLETED':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
            <ShieldCheck className="w-3 h-3" /> Completed
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20">
            <Clock className="w-3 h-3" /> Pending
          </span>
        );
    }
  };

  return (
    <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm p-4 md:p-5 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20">
            <Sparkles className="w-5 h-5 text-cyan-500" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
              AI Repair Priority Matrix & ROI Dispatch
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Click any priority card for work order details & dispatch status
            </p>
          </div>
        </div>

        <span className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20">
          Ranked by AI
        </span>
      </div>

      {/* Priority Cards Queue */}
      <div className="space-y-3.5">
        {items.map((prio) => {
          const isTopRank = prio.rank === 1;
          const currentStatus = prio.dispatchStatus || 'PENDING';

          return (
            <div
              key={prio.id}
              onClick={() => setSelectedPriority(prio)}
              className={`p-4 rounded-xl border transition-all cursor-pointer group ${
                isTopRank
                  ? 'bg-gradient-to-r from-red-500/5 via-amber-500/5 to-transparent border-red-500/30 dark:border-red-500/40 hover:border-red-500/60 shadow-sm'
                  : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 hover:border-cyan-500/40'
              }`}
            >
              <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                <div className="flex items-center gap-2.5">
                  <span
                    className={`w-6 h-6 rounded-lg flex items-center justify-center font-mono text-xs font-extrabold ${
                      isTopRank
                        ? 'bg-red-500 text-white shadow-md shadow-red-500/30'
                        : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200'
                    }`}
                  >
                    #{prio.rank}
                  </span>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-cyan-500 transition-colors">
                        {prio.location}
                      </h4>
                      {getSeverityBadge(prio.severity)}
                    </div>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                      Target Isolation: <strong className="text-cyan-600 dark:text-cyan-400">{prio.targetValveToIsolate}</strong>
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {getDispatchBadge(currentStatus)}
                  <span className="text-xs font-mono font-bold text-red-600 dark:text-red-400 bg-red-500/10 px-2 py-0.5 rounded border border-red-500/20">
                    -${prio.economicLossPerDay.toLocaleString()}/day
                  </span>
                </div>
              </div>

              {/* AI Recommendation Box */}
              <p className="text-xs text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 mb-3 leading-relaxed">
                <strong className="text-cyan-600 dark:text-cyan-400 font-medium">AI Reason & Strategy:</strong> {prio.aiRecommendation}
              </p>

              {/* Structural Risk & Dispatch Actions */}
              <div className="flex flex-wrap items-center justify-between gap-3 text-[11px] text-slate-500 dark:text-slate-400 pt-1">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1">
                    <Flame className="w-3.5 h-3.5 text-amber-500" />
                    Risk Score: <strong className="text-slate-900 dark:text-white font-mono">{prio.structuralRiskScore}/100</strong>
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    Est. Time: <strong className="text-slate-900 dark:text-white font-mono">{prio.estimatedRepairHours}h</strong>
                  </span>
                </div>

                <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                  {currentStatus === 'PENDING' && (
                    <button
                      onClick={() => setDispatchItem(prio)}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-cyan-600 to-blue-600 text-white hover:opacity-90 transition-all flex items-center gap-1.5 shadow-sm"
                    >
                      <UserCheck className="w-3.5 h-3.5" /> Dispatch Crew
                    </button>
                  )}
                  {currentStatus === 'DISPATCHED' && (
                    <button
                      onClick={() => handleUpdateStatus(prio.id, 'COMPLETED')}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white transition-all flex items-center gap-1.5 shadow-sm"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" /> Mark Completed
                    </button>
                  )}
                  {currentStatus === 'COMPLETED' && (
                    <span className="text-xs font-bold text-emerald-500 flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" /> Done
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Detail Inspector Modal */}
      {selectedPriority && (
        <div 
          className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-md flex items-center justify-center p-3 md:p-6 overflow-y-auto"
          onClick={() => setSelectedPriority(null)}
        >
          <div 
            className="w-full max-w-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-900 dark:text-slate-100 shadow-2xl relative overflow-hidden my-auto max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 flex items-start justify-between gap-4 sticky top-0 z-10">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20">
                    Priority Rank #{selectedPriority.rank}
                  </span>
                  {selectedPriority.incidentCode && (
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20">
                      ID: {selectedPriority.incidentCode}
                    </span>
                  )}
                  {getSeverityBadge(selectedPriority.severity)}
                  {getDispatchBadge(selectedPriority.dispatchStatus)}
                </div>
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white mt-2 tracking-tight">
                  {selectedPriority.location}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5">
                  <Layers className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
                  {selectedPriority.dmaZone || 'DMA Network Zone'}
                </p>
              </div>
              <button 
                onClick={() => setSelectedPriority(null)}
                className="text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800/80 dark:hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 space-y-4 overflow-y-auto flex-1 text-xs">
              {/* Feedback Alert */}
              {feedbackMsg && (
                <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 font-semibold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>{feedbackMsg}</span>
                </div>
              )}

              {/* Grid 1: AI Diagnostics & Water Loss Metrics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="p-3 rounded-xl bg-slate-100/70 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60">
                  <span className="text-slate-500 dark:text-slate-400 text-[10px] uppercase font-bold tracking-wider block">AI Confidence</span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white text-sm mt-0.5 block">{selectedPriority.confidence || 95}%</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-100/70 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60">
                  <span className="text-slate-500 dark:text-slate-400 text-[10px] uppercase font-bold tracking-wider block">Est. Water Loss</span>
                  <span className="font-mono font-bold text-red-600 dark:text-red-400 text-sm mt-0.5 block">
                    {selectedPriority.estimatedLossGpm || 120} GPM
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-slate-100/70 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60">
                  <span className="text-slate-500 dark:text-slate-400 text-[10px] uppercase font-bold tracking-wider block">Economic Loss</span>
                  <span className="font-mono font-bold text-amber-600 dark:text-amber-400 text-sm mt-0.5 block">
                    -${selectedPriority.economicLossPerDay.toLocaleString()}/day
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-slate-100/70 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60">
                  <span className="text-slate-500 dark:text-slate-400 text-[10px] uppercase font-bold tracking-wider block">Risk Score</span>
                  <span className="font-mono font-bold text-red-600 dark:text-red-400 text-sm mt-0.5 block">
                    {selectedPriority.structuralRiskScore}/100
                  </span>
                </div>
              </div>

              {/* Target Isolation & Repair Logistics */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/50 space-y-2.5">
                <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                  <Wrench className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" /> Target Isolation & Work Order Timing
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="p-3 rounded-lg bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 block uppercase">Target Isolation Valve</span>
                    <span className="font-semibold text-cyan-600 dark:text-cyan-400 text-xs mt-0.5 block">
                      {selectedPriority.targetValveToIsolate}
                    </span>
                  </div>

                  <div className="p-3 rounded-lg bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 block uppercase">Est. Repair Time</span>
                    <span className="font-semibold text-slate-900 dark:text-white text-xs mt-0.5 block font-mono">
                      {selectedPriority.estimatedRepairHours} Hours
                    </span>
                  </div>

                  <div className="p-3 rounded-lg bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 block uppercase">Payback / ROI Period</span>
                    <span className="font-semibold text-emerald-600 dark:text-emerald-400 text-xs mt-0.5 block font-mono">
                      {selectedPriority.roiDays} Days
                    </span>
                  </div>
                </div>
              </div>

              {/* Repair Priority Reason & Recommended Action */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2.5">
                <h4 className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" /> Priority Reason & Recommended AI Strategy
                </h4>
                <p className="text-slate-700 dark:text-slate-200 leading-relaxed text-xs">
                  {selectedPriority.aiRecommendation}
                </p>
              </div>
            </div>

            {/* Action Footer Bar */}
            <div className="p-4 bg-slate-50/90 dark:bg-slate-950/90 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 sticky bottom-0 z-10">
              <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                Set Dispatch Work Order Status:
              </span>

              <div className="grid grid-cols-3 gap-2 w-full sm:w-auto flex-1 max-w-md">
                <button
                  onClick={() => handleUpdateStatus(selectedPriority.id, 'PENDING')}
                  className={`py-2 px-3 rounded-xl font-semibold text-xs transition-all flex items-center justify-center gap-1 border ${
                    (selectedPriority.dispatchStatus || 'PENDING') === 'PENDING'
                      ? 'bg-amber-600 text-white border-amber-500 shadow-lg shadow-amber-600/30'
                      : 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/30 hover:bg-amber-500/20'
                  }`}
                >
                  <Clock className="w-3.5 h-3.5" />
                  <span>Pending</span>
                </button>

                <button
                  onClick={() => handleUpdateStatus(selectedPriority.id, 'DISPATCHED')}
                  className={`py-2 px-3 rounded-xl font-semibold text-xs transition-all flex items-center justify-center gap-1 border ${
                    selectedPriority.dispatchStatus === 'DISPATCHED'
                      ? 'bg-cyan-600 text-white border-cyan-500 shadow-lg shadow-cyan-600/30'
                      : 'bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 border-cyan-500/30 hover:bg-cyan-500/20'
                  }`}
                >
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>Dispatched</span>
                </button>

                <button
                  onClick={() => handleUpdateStatus(selectedPriority.id, 'COMPLETED')}
                  className={`py-2 px-3 rounded-xl font-semibold text-xs transition-all flex items-center justify-center gap-1 border ${
                    selectedPriority.dispatchStatus === 'COMPLETED'
                      ? 'bg-emerald-600 text-white border-emerald-500 shadow-lg shadow-emerald-600/30'
                      : 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/20'
                  }`}
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Completed</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Technician Crew Dispatch Modal */}
      {dispatchItem && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto"
          onClick={() => setDispatchItem(null)}
        >
          <div
            className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-900 dark:text-slate-100 shadow-2xl p-5 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-500">
                  <UserCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white">Dispatch Field Crew</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">{dispatchItem.location}</p>
                </div>
              </div>
              <button
                onClick={() => setDispatchItem(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white bg-slate-100 dark:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
                  Assign Technician Response Crew:
                </label>
                <select
                  value={selectedCrew}
                  onChange={(e) => setSelectedCrew(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-white outline-none focus:border-cyan-500"
                >
                  <option value="Alpha Crew - Rapid Response (HDPE Specialist)">Alpha Crew - Rapid Response (HDPE Specialist)</option>
                  <option value="Bravo Hydro Mechanics (Ductile Iron Pipe Team)">Bravo Hydro Mechanics (Ductile Iron Pipe Team)</option>
                  <option value="Charlie Acoustic Locators (Night Shift)">Charlie Acoustic Locators (Night Shift)</option>
                </select>
              </div>

              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-300 text-[11px]">
                <strong className="block font-bold">Target Isolation Valve: {dispatchItem.targetValveToIsolate}</strong>
                Est. Work Duration: {dispatchItem.estimatedRepairHours} Hours • Priority #{dispatchItem.rank}
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                onClick={() => setDispatchItem(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  handleUpdateStatus(dispatchItem.id, 'DISPATCHED', selectedCrew);
                  setDispatchItem(null);
                }}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 text-white text-xs font-bold shadow-md hover:opacity-90 transition-all flex items-center gap-1.5"
              >
                <UserCheck className="w-4 h-4" />
                <span>Confirm Dispatch</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
