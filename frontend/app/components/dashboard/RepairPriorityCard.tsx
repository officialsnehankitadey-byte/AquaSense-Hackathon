'use client';

import React from 'react';
import { 
  Wrench, 
  Sparkles, 
  ArrowRight, 
  Clock, 
  DollarSign, 
  ShieldAlert, 
  CheckCircle2, 
  Layers,
  Flame,
  Check
} from 'lucide-react';
import { RepairPriorityItem } from '../../types/dashboard';

interface RepairPriorityCardProps {
  priorities: RepairPriorityItem[];
}

export const RepairPriorityCard: React.FC<RepairPriorityCardProps> = ({ priorities }) => {
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
              Optimal work order dispatch sequence computed by economic & erosion risk factors
            </p>
          </div>
        </div>

        <span className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20">
          Ranked by AI
        </span>
      </div>

      {/* Priority Cards Queue */}
      <div className="space-y-3.5">
        {priorities.map((prio) => {
          const isTopRank = prio.rank === 1;

          return (
            <div
              key={prio.id}
              className={`p-4 rounded-xl border transition-all ${
                isTopRank
                  ? 'bg-gradient-to-r from-red-500/5 via-amber-500/5 to-transparent border-red-500/30 dark:border-red-500/40 shadow-sm'
                  : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800'
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
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                      {prio.location}
                    </h4>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                      Target Isolation: <strong className="text-cyan-600 dark:text-cyan-400">{prio.targetValveToIsolate}</strong>
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                    ROI: {prio.roiDays}d
                  </span>
                  <span className="text-xs font-mono font-bold text-red-600 dark:text-red-400 bg-red-500/10 px-2 py-0.5 rounded border border-red-500/20">
                    -${prio.economicLossPerDay}/day
                  </span>
                </div>
              </div>

              {/* AI Recommendation Box */}
              <p className="text-xs text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 mb-3 leading-relaxed">
                <strong className="text-cyan-600 dark:text-cyan-400 font-medium">AI Strategy:</strong> {prio.aiRecommendation}
              </p>

              {/* Structural Risk & Dispatch Stats */}
              <div className="flex flex-wrap items-center justify-between gap-3 text-[11px] text-slate-500 dark:text-slate-400 pt-1">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1">
                    <Flame className="w-3.5 h-3.5 text-amber-500" />
                    Structural Risk: <strong className="text-slate-900 dark:text-white font-mono">{prio.structuralRiskScore}/100</strong>
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    Est. Duration: <strong className="text-slate-900 dark:text-white font-mono">{prio.estimatedRepairHours}h</strong>
                  </span>
                </div>

                <button
                  onClick={() => alert(`Work order #${prio.rank} dispatched to field response team!`)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                    isTopRank
                      ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white hover:opacity-90 shadow-md shadow-cyan-600/20'
                      : 'bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-600'
                  }`}
                >
                  <Wrench className="w-3.5 h-3.5" /> Approve Work Order
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
