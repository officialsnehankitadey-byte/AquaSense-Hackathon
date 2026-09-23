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
  BarChart2
} from 'lucide-react';
import { TelemetryChart } from '../dashboard/TelemetryChart';
import { mockDMAZones, mockTelemetryHistory } from '../../data/mockData';

export const FlowPressureView: React.FC = () => {
  const [selectedDMA, setSelectedDMA] = useState('all');

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
              Transient Pressure Engine Active
            </span>
          </div>
          <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Continuous hydraulic head pressure monitoring, minimum night-flow analysis, and hydrodynamic surge telemetry.
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

      {/* Hydraulic Performance Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-semibold">Average Grid Pressure</span>
            <Gauge className="w-4 h-4 text-cyan-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-slate-900 dark:text-white">64.5</span>
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
            <span className="text-xs font-bold text-emerald-500 ml-auto">PRV-12 Suppressed</span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">Peak dynamic shockwave: 88 PSI at 14:02 PM</p>
        </div>
      </div>

      {/* Main Time-series Chart */}
      <TelemetryChart />

      {/* DMA Zone Pressure Grid */}
      <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm p-5 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <BarChart2 className="w-4 h-4 text-cyan-500" />
            District Metered Area (DMA) Pressure Balances
          </h3>
          <span className="text-xs text-slate-400 font-mono">Updated 1 min ago</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {mockDMAZones.filter(z => z.id !== 'all').map((dma) => (
            <div key={dma.id} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-slate-900 dark:text-white">{dma.name}</span>
                <span className={`px-2 py-0.5 text-[10px] font-bold rounded ${
                  dma.activeLeaks > 0 ? 'bg-amber-500/20 text-amber-400' : 'bg-emerald-500/20 text-emerald-400'
                }`}>
                  {dma.activeLeaks > 0 ? `${dma.activeLeaks} Active Leaks` : 'Optimal'}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <p className="text-slate-400">Avg Pressure</p>
                  <p className="font-mono font-bold text-slate-900 dark:text-white mt-0.5">{dma.avgPressurePsi} PSI</p>
                </div>
                <div>
                  <p className="text-slate-400">Water Loss Rate</p>
                  <p className="font-mono font-bold text-cyan-500 mt-0.5">{dma.waterLossRate}%</p>
                </div>
              </div>

              {/* Visual pressure bar */}
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                  <span>Normal Operating Band</span>
                  <span>{dma.avgPressurePsi} / 80 PSI</span>
                </div>
                <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full"
                    style={{ width: `${(dma.avgPressurePsi / 90) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
