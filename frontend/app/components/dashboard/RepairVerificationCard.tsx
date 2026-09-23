'use client';

import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Droplets, 
  TrendingDown, 
  Clock, 
  Gauge, 
  Sparkles, 
  CheckCircle2, 
  MapPin, 
  Activity, 
  ChevronDown,
  Layers,
  ArrowRight,
  BarChart3
} from 'lucide-react';
import { RepairVerification } from '../../types/dashboard';

interface RepairVerificationCardProps {
  verifications: RepairVerification[];
}

export const RepairVerificationCard: React.FC<RepairVerificationCardProps> = ({ verifications }) => {
  const [selectedId, setSelectedId] = useState<string>(verifications[0]?.id || '');

  const current = verifications.find((v) => v.id === selectedId) || verifications[0];

  if (!current) return null;

  const pressureDiff = (current.afterPressurePsi - current.beforePressurePsi).toFixed(1);
  const flowDiff = (current.beforeFlowGpm - current.afterFlowGpm).toFixed(0);

  return (
    <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm p-4 md:p-5 flex flex-col space-y-4">
      {/* Header & Incident Selector Dropdown */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
            <ShieldCheck className="w-5 h-5 text-emerald-500" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
              Repair Verification Dashboard
              <span className="inline-flex items-center gap-1 text-[11px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                <CheckCircle2 className="w-3 h-3" /> Verified Repaired
              </span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              AI hydro-acoustic telemetry post-repair validation & Non-Revenue Water recovery analytics
            </p>
          </div>
        </div>

        {/* Incident Switcher Pills / Dropdown */}
        <div className="relative">
          <select
            value={selectedId}
            onChange={(e) => setSelectedId(e.target.value)}
            className="appearance-none bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-bold py-1.5 pl-3 pr-8 rounded-xl border border-slate-200 dark:border-slate-700 cursor-pointer focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
          >
            {verifications.map((v) => (
              <option key={v.id} value={v.id}>
                {v.incidentCode} • {v.dmaZone.split(' ')[0]}
              </option>
            ))}
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>

      {/* Repaired Incident Quick Info Header */}
      <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono font-extrabold text-cyan-600 dark:text-cyan-400 text-sm">
              {current.incidentCode}
            </span>
            <span className="text-slate-400">•</span>
            <span className="font-semibold text-slate-900 dark:text-white flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              {current.location}
            </span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 pl-0 sm:pl-5">
            {current.dmaZone} • {current.pipeDiameter} {current.pipeType}
          </p>
        </div>

        <div className="flex items-center gap-3 text-[11px]">
          <div className="text-right">
            <span className="text-slate-400 block text-[10px] uppercase">Completion</span>
            <span className="font-mono font-bold text-slate-900 dark:text-white flex items-center gap-1">
              <Clock className="w-3 h-3 text-slate-400" /> {current.repairedAt}
            </span>
          </div>
          <div className="text-right pl-3 border-l border-slate-200 dark:border-slate-800">
            <span className="text-slate-400 block text-[10px] uppercase">AI Confidence</span>
            <span className="font-mono font-bold text-emerald-500 text-sm">
              {current.verificationConfidence}%
            </span>
          </div>
        </div>
      </div>

      {/* KPI Metric Summary Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
        {/* Metric 1: Water Saved */}
        <div className="p-3.5 rounded-xl bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-transparent border border-emerald-500/20 flex flex-col justify-between">
          <span className="text-slate-500 dark:text-slate-400 text-[10px] uppercase font-bold tracking-wider flex items-center gap-1">
            <Droplets className="w-3.5 h-3.5 text-emerald-500" /> Water Saved (L/day)
          </span>
          <div className="mt-1">
            <span className="text-lg font-mono font-extrabold text-emerald-600 dark:text-emerald-400">
              {current.waterSavedLitersPerDay.toLocaleString('en-US')} L
            </span>
            <span className="block text-[10px] text-emerald-600/80 dark:text-emerald-400/80 font-medium">
              Daily NRW Recovery
            </span>
          </div>
        </div>

        {/* Metric 2: Loss Reduction % */}
        <div className="p-3.5 rounded-xl bg-gradient-to-br from-cyan-500/10 via-cyan-500/5 to-transparent border border-cyan-500/20 flex flex-col justify-between">
          <span className="text-slate-500 dark:text-slate-400 text-[10px] uppercase font-bold tracking-wider flex items-center gap-1">
            <TrendingDown className="w-3.5 h-3.5 text-cyan-500" /> Loss Reduction
          </span>
          <div className="mt-1">
            <span className="text-lg font-mono font-extrabold text-cyan-600 dark:text-cyan-400">
              {current.waterLossReductionPercent}%
            </span>
            <span className="block text-[10px] text-cyan-600/80 dark:text-cyan-400/80 font-medium">
              Leak Flow Elimination
            </span>
          </div>
        </div>

        {/* Metric 3: Pressure Restoration */}
        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 flex flex-col justify-between">
          <span className="text-slate-500 dark:text-slate-400 text-[10px] uppercase font-bold tracking-wider flex items-center gap-1">
            <Gauge className="w-3.5 h-3.5 text-blue-500" /> Pressure Delta
          </span>
          <div className="mt-1">
            <span className="text-base font-mono font-bold text-slate-900 dark:text-white">
              {current.beforePressurePsi} → {current.afterPressurePsi} PSI
            </span>
            <span className="block text-[10px] font-mono text-emerald-500 font-semibold">
              +{pressureDiff} PSI restored
            </span>
          </div>
        </div>

        {/* Metric 4: Repair Time */}
        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 flex flex-col justify-between">
          <span className="text-slate-500 dark:text-slate-400 text-[10px] uppercase font-bold tracking-wider flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-amber-500" /> Repair Duration
          </span>
          <div className="mt-1">
            <span className="text-base font-mono font-bold text-slate-900 dark:text-white">
              {current.repairDuration}
            </span>
            <span className="block text-[10px] text-slate-400 font-medium">
              Field Crew Lead Time
            </span>
          </div>
        </div>
      </div>

      {/* Simple Before/After Visual Chart */}
      <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5 uppercase tracking-wider">
            <BarChart3 className="w-4 h-4 text-cyan-500" /> Telemetry Comparison (Before vs After)
          </h4>
          <div className="flex items-center gap-3 text-[11px] font-medium">
            <span className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
              <span className="w-2.5 h-2.5 rounded-sm bg-red-500/80" /> Before Repair
            </span>
            <span className="flex items-center gap-1.5 text-slate-900 dark:text-white">
              <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500" /> After Repair
            </span>
          </div>
        </div>

        {/* Dual Bar Charts */}
        <div className="space-y-3.5 text-xs">
          {/* Bar 1: Main Line Pressure (PSI) */}
          <div>
            <div className="flex items-center justify-between mb-1 text-[11px] font-semibold">
              <span className="text-slate-700 dark:text-slate-300">System Pressure (PSI)</span>
              <span className="font-mono text-emerald-600 dark:text-emerald-400">
                {current.beforePressurePsi} PSI → {current.afterPressurePsi} PSI (+{pressureDiff} PSI)
              </span>
            </div>
            <div className="space-y-1.5">
              {/* Before Bar */}
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono text-slate-400 w-12 text-right">BEFORE</span>
                <div className="flex-1 bg-slate-200 dark:bg-slate-800 h-3 rounded-md overflow-hidden">
                  <div 
                    className="bg-red-500/80 h-full rounded-md transition-all duration-500" 
                    style={{ width: `${(current.beforePressurePsi / 80) * 100}%` }}
                  />
                </div>
                <span className="text-[10px] font-mono text-slate-500 w-12">{current.beforePressurePsi} PSI</span>
              </div>
              {/* After Bar */}
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono text-emerald-500 font-bold w-12 text-right">AFTER</span>
                <div className="flex-1 bg-slate-200 dark:bg-slate-800 h-3 rounded-md overflow-hidden">
                  <div 
                    className="bg-emerald-500 h-full rounded-md transition-all duration-500" 
                    style={{ width: `${(current.afterPressurePsi / 80) * 100}%` }}
                  />
                </div>
                <span className="text-[10px] font-mono font-bold text-emerald-500 w-12">{current.afterPressurePsi} PSI</span>
              </div>
            </div>
          </div>

          {/* Bar 2: District Flow Rate (GPM) */}
          <div>
            <div className="flex items-center justify-between mb-1 text-[11px] font-semibold">
              <span className="text-slate-700 dark:text-slate-300">District Water Flow Rate (GPM)</span>
              <span className="font-mono text-cyan-600 dark:text-cyan-400">
                {current.beforeFlowGpm} GPM → {current.afterFlowGpm} GPM (-{flowDiff} GPM leak loss)
              </span>
            </div>
            <div className="space-y-1.5">
              {/* Before Bar */}
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono text-slate-400 w-12 text-right">BEFORE</span>
                <div className="flex-1 bg-slate-200 dark:bg-slate-800 h-3 rounded-md overflow-hidden">
                  <div 
                    className="bg-amber-500/80 h-full rounded-md transition-all duration-500" 
                    style={{ width: `${(current.beforeFlowGpm / 2500) * 100}%` }}
                  />
                </div>
                <span className="text-[10px] font-mono text-slate-500 w-12">{current.beforeFlowGpm} GPM</span>
              </div>
              {/* After Bar */}
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono text-cyan-500 font-bold w-12 text-right">AFTER</span>
                <div className="flex-1 bg-slate-200 dark:bg-slate-800 h-3 rounded-md overflow-hidden">
                  <div 
                    className="bg-cyan-500 h-full rounded-md transition-all duration-500" 
                    style={{ width: `${(current.afterFlowGpm / 2500) * 100}%` }}
                  />
                </div>
                <span className="text-[10px] font-mono font-bold text-cyan-500 w-12">{current.afterFlowGpm} GPM</span>
              </div>
            </div>
          </div>

          {/* Bar 3: Acoustic Noise Signature (dB) */}
          <div>
            <div className="flex items-center justify-between mb-1 text-[11px] font-semibold">
              <span className="text-slate-700 dark:text-slate-300">Acoustic Sensor Leak Signature (dB)</span>
              <span className="font-mono text-emerald-600 dark:text-emerald-400">
                {current.beforeAcousticNoiseDb} dB → {current.afterAcousticNoiseDb} dB (Zero Leak Noise)
              </span>
            </div>
            <div className="space-y-1.5">
              {/* Before Bar */}
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono text-slate-400 w-12 text-right">BEFORE</span>
                <div className="flex-1 bg-slate-200 dark:bg-slate-800 h-3 rounded-md overflow-hidden">
                  <div 
                    className="bg-red-500 h-full rounded-md transition-all duration-500" 
                    style={{ width: `${(current.beforeAcousticNoiseDb / 100) * 100}%` }}
                  />
                </div>
                <span className="text-[10px] font-mono text-red-400 w-12">{current.beforeAcousticNoiseDb} dB</span>
              </div>
              {/* After Bar */}
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono text-emerald-500 font-bold w-12 text-right">AFTER</span>
                <div className="flex-1 bg-slate-200 dark:bg-slate-800 h-3 rounded-md overflow-hidden">
                  <div 
                    className="bg-emerald-500 h-full rounded-md transition-all duration-500" 
                    style={{ width: `${(current.afterAcousticNoiseDb / 100) * 100}%` }}
                  />
                </div>
                <span className="text-[10px] font-mono font-bold text-emerald-500 w-12">{current.afterAcousticNoiseDb} dB</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Verification AI Summary Box */}
      <p className="text-xs text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-950/40 p-3 rounded-xl border border-slate-200 dark:border-slate-800/80 leading-relaxed">
        <strong className="text-emerald-600 dark:text-emerald-400 font-semibold">AI Verification Audit:</strong> {current.summary}
      </p>
    </div>
  );
};
