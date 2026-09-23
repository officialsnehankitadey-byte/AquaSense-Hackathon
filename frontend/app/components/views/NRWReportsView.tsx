'use client';

import React from 'react';
import { 
  BarChart3, 
  TrendingDown, 
  Droplets, 
  DollarSign, 
  ShieldCheck, 
  FileText, 
  Download, 
  Calendar,
  Layers,
  ArrowUpRight
} from 'lucide-react';
import { mockRepairVerifications } from '../../data/mockData';

export const NRWReportsView: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* View Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl md:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Non-Revenue Water (NRW) & Financial Audit Reports
            </h1>
            <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
              Audit Verified
            </span>
          </div>
          <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Automated water balance calculations according to IWA (International Water Association) standards.
          </p>
        </div>

        <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold text-xs shadow-md shadow-cyan-600/20 transition-all">
          <Download className="w-4 h-4" />
          Export Executive NRW PDF Report
        </button>
      </div>

      {/* Highlights Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-semibold">Total Water Saved (30d)</span>
            <Droplets className="w-4 h-4 text-cyan-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-white">8.61M</span>
            <span className="text-xs font-bold text-slate-400">Liters</span>
          </div>
          <p className="text-xs font-semibold text-emerald-500 flex items-center gap-1">
            <TrendingDown className="w-3.5 h-3.5" /> 31.4% reduction in real physical water loss
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-semibold">Financial Value Recovered</span>
            <DollarSign className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">$42,500</span>
            <span className="text-xs font-bold text-slate-400">USD</span>
          </div>
          <p className="text-xs font-semibold text-emerald-500 flex items-center gap-1">
            <ArrowUpRight className="w-3.5 h-3.5" /> ROI achieved in 1.4 months on acoustic sensors
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-semibold">Infrastructure Leak Index (ILI)</span>
            <ShieldCheck className="w-4 h-4 text-purple-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-white">1.42</span>
            <span className="text-xs font-bold text-emerald-500">Category A (Excellent)</span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">World-class NRW benchmark performance</p>
        </div>
      </div>

      {/* IWA Water Balance breakdown table */}
      <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm p-6 space-y-4">
        <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <FileText className="w-5 h-5 text-cyan-500" />
          IWA Standard System Input Volume Breakdown
        </h3>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-3">
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 space-y-1">
              <div className="flex justify-between font-bold text-sm text-emerald-600 dark:text-emerald-400">
                <span>Authorized Billed Consumption</span>
                <span>84.2%</span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">Billed metered residential & commercial volume</p>
            </div>

            <div className="p-4 rounded-xl bg-cyan-500/10 border border-cyan-500/20 space-y-1">
              <div className="flex justify-between font-bold text-sm text-cyan-600 dark:text-cyan-400">
                <span>Unbilled Authorized Consumption</span>
                <span>2.8%</span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">Firefighting, main flushing, and municipal parks</p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 space-y-1">
              <div className="flex justify-between font-bold text-sm text-amber-500">
                <span>Apparent Commercial Losses</span>
                <span>3.2%</span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">Customer meter inaccuracies & unauthorized consumption</p>
            </div>

            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 space-y-1">
              <div className="flex justify-between font-bold text-sm text-red-500">
                <span>Real Physical Losses (Leaks & Bursts)</span>
                <span>9.8% (Down from 18.4%)</span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">Background leakage and pipe breaks pinpointed by AquaSense</p>
            </div>
          </div>
        </div>
      </div>

      {/* Verified Repairs Table */}
      <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm p-6 space-y-4">
        <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-500" />
          Recent Hydro-Acoustic Verified Leak Audits
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-semibold uppercase tracking-wider">
                <th className="py-3 px-3">Audit ID</th>
                <th className="py-3 px-3">Location & DMA</th>
                <th className="py-3 px-3">Repaired</th>
                <th className="py-3 px-3">Water Recovered / Day</th>
                <th className="py-3 px-3">Noise Drop</th>
                <th className="py-3 px-3 text-right">Confidence</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
              {mockRepairVerifications.map((verif) => (
                <tr key={verif.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-3 font-mono text-cyan-600 dark:text-cyan-400 font-bold">
                    {verif.incidentCode}
                  </td>
                  <td className="py-3 px-3">
                    <p className="font-semibold text-slate-900 dark:text-white">{verif.location}</p>
                    <p className="text-[10px] text-slate-400 font-mono">{verif.dmaZone}</p>
                  </td>
                  <td className="py-3 px-3 text-slate-600 dark:text-slate-300">
                    {verif.repairedAt}
                  </td>
                  <td className="py-3 px-3 font-mono font-bold text-emerald-600 dark:text-emerald-400">
                    +{(verif.waterSavedLitersPerDay / 1000000).toFixed(2)}M Liters/day
                  </td>
                  <td className="py-3 px-3 font-mono text-slate-700 dark:text-slate-300">
                    {verif.beforeAcousticNoiseDb} dB → {verif.afterAcousticNoiseDb} dB
                  </td>
                  <td className="py-3 px-3 text-right font-mono font-bold text-emerald-500">
                    {verif.verificationConfidence}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
