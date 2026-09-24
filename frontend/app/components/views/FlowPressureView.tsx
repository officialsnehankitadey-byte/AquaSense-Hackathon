'use client';

import React, { useState } from 'react';
import { 
  Activity, 
  Gauge, 
  TrendingDown, 
  TrendingUp, 
  Waves, 
  Sliders, 
  AlertCircle,
  Zap,
  BarChart2,
  CheckCircle2,
  RefreshCw,
  ShieldCheck,
  Radio
} from 'lucide-react';
import { TelemetryChart } from '../dashboard/TelemetryChart';
import { mockDMAZones } from '../../data/mockData';
import { apiService } from '../../services/api';

interface PRVValve {
  id: string;
  name: string;
  zone: string;
  setpointPsi: number;
  currentPsi: number;
  flowGpm: number;
  status: 'OPTIMAL' | 'ADJUSTING' | 'WARNING';
}

const initialPRVs: PRVValve[] = [
  { id: 'PRV-101', name: 'PRV Main Intake Alpha', zone: 'North Central', setpointPsi: 65, currentPsi: 64.8, flowGpm: 1250, status: 'OPTIMAL' },
  { id: 'PRV-102', name: 'PRV High-Elevation Booster', zone: 'East Highland', setpointPsi: 72, currentPsi: 71.5, flowGpm: 840, status: 'OPTIMAL' },
  { id: 'PRV-103', name: 'PRV Industrial Zone Loop', zone: 'Industrial Bay', setpointPsi: 58, currentPsi: 54.2, flowGpm: 1680, status: 'WARNING' },
  { id: 'PRV-104', name: 'PRV Residential Sub-Grid', zone: 'South Sector', setpointPsi: 60, currentPsi: 60.1, flowGpm: 920, status: 'OPTIMAL' },
];

export const FlowPressureView: React.FC = () => {
  const [selectedDMA, setSelectedDMA] = useState('all');
  const [prvs, setPrvs] = useState<PRVValve[]>(initialPRVs);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const handleSliderChange = (id: string, newSetpoint: number) => {
    setPrvs(prev =>
      prev.map(p => (p.id === id ? { ...p, setpointPsi: newSetpoint } : p))
    );
  };

  const handleApplyPRV = async (prv: PRVValve) => {
    setUpdatingId(prv.id);
    setPrvs(prev => prev.map(p => (p.id === prv.id ? { ...p, status: 'ADJUSTING' } : p)));

    try {
      await apiService.setPRVPressure(prv.id, prv.setpointPsi);
    } catch (e) {
      // Offline fallback
    }

    setTimeout(() => {
      setPrvs(prev =>
        prev.map(p =>
          p.id === prv.id
            ? { ...p, currentPsi: prv.setpointPsi, status: 'OPTIMAL' }
            : p
        )
      );
      setUpdatingId(null);
      setToastMsg(`Remote PRV Telecommand Sent: ${prv.name} setpoint calibrated to ${prv.setpointPsi} PSI`);
      setTimeout(() => setToastMsg(null), 4000);
    }, 800);
  };

  const avgGridPressure = (
    prvs.reduce((acc, curr) => acc + curr.currentPsi, 0) / prvs.length
  ).toFixed(1);

  return (
    <div className="space-y-6">
      {/* View Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl md:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Flow & Pressure Hydraulics Analytics
            </h1>
            <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30">
              PRV Telecommand Active
            </span>
          </div>
          <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Continuous hydraulic head pressure monitoring, PRV setpoint remote control, and hydrodynamic surge telemetry.
          </p>
        </div>

        {/* DMA Selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">DMA Filter:</span>
          <select
            value={selectedDMA}
            onChange={(e) => setSelectedDMA(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none"
          >
            {mockDMAZones.map((zone) => (
              <option key={zone.id} value={zone.id}>
                {zone.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Toast Notification Bar */}
      {toastMsg && (
        <div className="p-3.5 rounded-xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-700 dark:text-cyan-300 font-semibold text-xs flex items-center justify-between gap-2 animate-fadeIn shadow-md">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-cyan-500 shrink-0" />
            <span>{toastMsg}</span>
          </div>
          <span className="text-[10px] font-mono text-cyan-400">SYNC OK</span>
        </div>
      )}

      {/* Hydraulic Performance Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-semibold">Average Grid Pressure</span>
            <Gauge className="w-4 h-4 text-cyan-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-slate-900 dark:text-white">{avgGridPressure}</span>
            <span className="text-xs font-bold text-slate-400">PSI</span>
            <span className="text-xs font-bold text-emerald-500 ml-auto">+0.4 PSI steady</span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">Target Range: 55.0 - 75.0 PSI across all PRV zones</p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-semibold">Min Night Flow (MNF)</span>
            <Waves className="w-4 h-4 text-amber-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-slate-900 dark:text-white">840</span>
            <span className="text-xs font-bold text-slate-400">GPM</span>
            <span className="text-xs font-bold text-red-500 ml-auto">+18% Anomaly</span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">Measured at 03:30 AM baseline window</p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-semibold">Transient Water Hammer Events</span>
            <Zap className="w-4 h-4 text-purple-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-slate-900 dark:text-white">2</span>
            <span className="text-xs font-bold text-slate-400">surges</span>
            <span className="text-xs font-bold text-emerald-500 ml-auto">PRV-102 Active</span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">Peak dynamic shockwave: 88 PSI at 14:02 PM</p>
        </div>
      </div>

      {/* Interactive PRV Remote Control Panel */}
      <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm p-5 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-500">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
                Pressure Reducing Valve (PRV) Remote Setpoint Telecommand
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Adjust hydraulic pressure setpoints to reduce background leakage & prevent pipe bursts
              </p>
            </div>
          </div>
          <span className="px-2.5 py-1 text-xs font-mono font-bold rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            4 ACTIVE VALVES
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {prvs.map((prv) => (
            <div key={prv.id} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">{prv.name}</h4>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">{prv.id} • {prv.zone}</p>
                </div>
                <span className={`px-2 py-0.5 text-[10px] font-bold rounded ${
                  prv.status === 'ADJUSTING' ? 'bg-cyan-500/20 text-cyan-400 animate-pulse' :
                  prv.status === 'WARNING' ? 'bg-amber-500/20 text-amber-400' : 'bg-emerald-500/20 text-emerald-400'
                }`}>
                  {prv.status}
                </span>
              </div>

              {/* Pressure Stats Grid */}
              <div className="grid grid-cols-3 gap-2 text-xs p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <div>
                  <span className="text-[10px] text-slate-400 block">Actual Reading</span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white">{prv.currentPsi} PSI</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Target Setpoint</span>
                  <span className="font-mono font-bold text-cyan-500">{prv.setpointPsi} PSI</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Main Flow</span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white">{prv.flowGpm} GPM</span>
                </div>
              </div>

              {/* Slider Control */}
              <div className="space-y-1.5 pt-1">
                <div className="flex justify-between text-[10px] font-mono text-slate-400">
                  <span>30 PSI</span>
                  <span className="text-cyan-500 font-bold">Slider: {prv.setpointPsi} PSI</span>
                  <span>90 PSI</span>
                </div>
                <input
                  type="range"
                  min="30"
                  max="90"
                  step="1"
                  value={prv.setpointPsi}
                  onChange={(e) => handleSliderChange(prv.id, parseInt(e.target.value))}
                  className="w-full accent-cyan-500 h-2 bg-slate-200 dark:bg-slate-700 rounded-lg cursor-pointer"
                />
              </div>

              {/* Dispatch Command Button */}
              <div className="pt-1 flex justify-end">
                <button
                  onClick={() => handleApplyPRV(prv)}
                  disabled={updatingId === prv.id}
                  className="px-3 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 disabled:opacity-50"
                >
                  {updatingId === prv.id ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Sliders className="w-3.5 h-3.5" />
                  )}
                  <span>{updatingId === prv.id ? 'Sending Signal...' : 'Apply Telecommand'}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Time-series Chart */}
      <TelemetryChart />
    </div>
  );
};
