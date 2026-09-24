'use client';

import React, { useState } from 'react';
import { 
  Zap, 
  Flame, 
  Wrench, 
  RotateCcw, 
  Activity, 
  CheckCircle2, 
  Sparkles,
  Play
} from 'lucide-react';
import { apiService } from '../../services/api';

interface DemoControlBarProps {
  onInjectBurst?: () => void;
  onSimulateRepair?: () => void;
  onResetGrid?: () => void;
}

export const DemoControlBar: React.FC<DemoControlBarProps> = ({
  onInjectBurst,
  onSimulateRepair,
  onResetGrid,
}) => {
  const [activeScenario, setActiveScenario] = useState<string | null>(null);
  const [toastFeedback, setToastFeedback] = useState<string | null>(null);

  const triggerScenario = async (name: string, action?: () => void) => {
    setActiveScenario(name);
    if (action) action();

    setToastFeedback(`Demo Event Triggered: "${name}"`);
    setTimeout(() => {
      setActiveScenario(null);
      setToastFeedback(null);
    }, 3000);
  };

  return (
    <div className="bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 border-b border-cyan-500/30 text-white px-4 py-2 text-xs transition-colors duration-200 shadow-md">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Left Badge: Hackathon Presenter Mode */}
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 text-[10px] font-extrabold uppercase font-mono tracking-wider flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-cyan-400 animate-spin" /> LIVE DEMO SUITE
          </span>
          <span className="text-[11px] text-slate-300 font-medium hidden sm:inline">
            Interactive Presentation Controls:
          </span>
        </div>

        {/* Action Triggers */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Burst Inject Button */}
          <button
            onClick={() => triggerScenario('Pipe Burst Injection (240 GPM Loss)', onInjectBurst)}
            disabled={activeScenario !== null}
            className="px-2.5 py-1 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/40 font-bold transition-all flex items-center gap-1.5 shadow-sm active:scale-95 disabled:opacity-50"
            title="Inject simulated pipe burst leak"
          >
            <Flame className="w-3.5 h-3.5 text-red-400 animate-pulse" />
            <span>Inject Pipe Burst</span>
          </button>

          {/* Repair Verification Button */}
          <button
            onClick={() => triggerScenario('Repair Verified (Water Saved: 145,000 L/day)', onSimulateRepair)}
            disabled={activeScenario !== null}
            className="px-2.5 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 font-bold transition-all flex items-center gap-1.5 shadow-sm active:scale-95 disabled:opacity-50"
            title="Simulate successful repair verification"
          >
            <Wrench className="w-3.5 h-3.5 text-emerald-400" />
            <span>Simulate Repair</span>
          </button>

          {/* Telemetry Pulse */}
          <button
            onClick={() => triggerScenario('1Hz Telemetry Pulse Stream Broadcast')}
            disabled={activeScenario !== null}
            className="px-2.5 py-1 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 font-bold transition-all flex items-center gap-1.5 shadow-sm active:scale-95 disabled:opacity-50"
            title="Trigger high-frequency sensor update"
          >
            <Zap className="w-3.5 h-3.5 text-cyan-400" />
            <span>SCADA Pulse</span>
          </button>

          {/* Reset Grid */}
          <button
            onClick={() => triggerScenario('SCADA Network Reset', onResetGrid)}
            disabled={activeScenario !== null}
            className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 font-semibold transition-all flex items-center gap-1 active:scale-95 disabled:opacity-50"
            title="Reset telemetry & incidents to baseline"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
            <span>Reset Grid</span>
          </button>
        </div>
      </div>

      {/* Toast Feedback Banner */}
      {toastFeedback && (
        <div className="mt-1.5 max-w-7xl mx-auto p-2 rounded-lg bg-cyan-500/20 border border-cyan-500/40 text-cyan-200 font-bold text-[11px] flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
          <span>{toastFeedback}</span>
        </div>
      )}
    </div>
  );
};
