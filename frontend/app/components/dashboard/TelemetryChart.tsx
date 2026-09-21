'use client';

import React from 'react';
import { Activity, Gauge, TrendingUp, Radio } from 'lucide-react';
import { mockTelemetryHistory } from '../../data/mockData';

export const TelemetryChart: React.FC = () => {
  // Compute max values for dynamic SVG scaling
  const maxGpm = 2500;
  const minGpm = 500;
  const maxDb = 100;

  const pointsBaseline = mockTelemetryHistory.map((d, i) => {
    const x = (i / (mockTelemetryHistory.length - 1)) * 100;
    const y = 100 - ((d.baselineGpm - minGpm) / (maxGpm - minGpm)) * 80 - 10;
    return `${x},${y}`;
  }).join(' ');

  const pointsActual = mockTelemetryHistory.map((d, i) => {
    const x = (i / (mockTelemetryHistory.length - 1)) * 100;
    const y = 100 - ((d.actualGpm - minGpm) / (maxGpm - minGpm)) * 80 - 10;
    return `${x},${y}`;
  }).join(' ');

  return (
    <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm p-4 md:p-5 flex flex-col">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4 pb-3 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20">
            <Activity className="w-5 h-5 text-cyan-500" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
              Hydro-Acoustic & Pressure Time-Series Telemetry
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Comparing expected consumption baseline against acoustic sensors over 24 hours
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs font-semibold">
          <span className="flex items-center gap-1.5 text-cyan-600 dark:text-cyan-400">
            <span className="w-3 h-0.5 bg-cyan-500 rounded-full" /> Actual Flow (GPM)
          </span>
          <span className="flex items-center gap-1.5 text-slate-400">
            <span className="w-3 h-0.5 bg-slate-400 stroke-dasharray rounded-full" /> Expected Baseline
          </span>
          <span className="flex items-center gap-1.5 text-red-500">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" /> Burst Spike (14:00)
          </span>
        </div>
      </div>

      {/* SVG Time Series Chart Container */}
      <div className="relative w-full h-56 bg-slate-950/60 rounded-xl border border-slate-800 p-4 overflow-hidden">
        {/* Background Grid Lines */}
        <div className="absolute inset-0 flex flex-col justify-between p-4 pointer-events-none opacity-20">
          <div className="w-full border-b border-slate-500 border-dashed" />
          <div className="w-full border-b border-slate-500 border-dashed" />
          <div className="w-full border-b border-slate-500 border-dashed" />
        </div>

        <svg className="w-full h-full overflow-visible" viewBox="0 0 100 100" preserveAspectRatio="none">
          {/* Fill under actual curve */}
          <polygon
            points={`0,100 ${pointsActual} 100,100`}
            fill="rgba(56, 189, 248, 0.12)"
          />

          {/* Baseline Curve */}
          <polyline
            fill="none"
            stroke="#64748b"
            strokeWidth="1.5"
            strokeDasharray="2 2"
            points={pointsBaseline}
          />

          {/* Actual Flow Curve */}
          <polyline
            fill="none"
            stroke="#38bdf8"
            strokeWidth="2.5"
            points={pointsActual}
          />
        </svg>

        {/* Hour Labels */}
        <div className="flex justify-between text-[10px] font-mono text-slate-400 mt-2">
          {mockTelemetryHistory.map((item) => (
            <span key={item.time}>{item.time}</span>
          ))}
        </div>
      </div>
    </div>
  );
};
