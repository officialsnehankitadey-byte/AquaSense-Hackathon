'use client';

import React, { useState } from 'react';
import { 
  Settings, 
  Sliders, 
  Bell, 
  ShieldCheck, 
  Cpu, 
  Radio, 
  Save, 
  Check, 
  Database,
  Wifi,
  Lock
} from 'lucide-react';

export const SystemSettingsView: React.FC = () => {
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* View Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl md:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              System Settings & AI Model Parameters
            </h1>
            <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30">
              v2.4 Core
            </span>
          </div>
          <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Configure acoustic cross-correlation thresholds, leak probability triggers, and notification webhooks.
          </p>
        </div>

        <button 
          onClick={handleSave}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold text-xs shadow-md shadow-cyan-600/20 transition-all"
        >
          {saved ? <Check className="w-4 h-4 text-emerald-400" /> : <Save className="w-4 h-4" />}
          {saved ? 'Settings Applied' : 'Save System Parameters'}
        </button>
      </div>

      {/* Settings Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* AI Correlation Thresholds */}
        <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm p-6 space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
            <Cpu className="w-5 h-5 text-cyan-500" />
            <h3 className="font-bold text-base text-slate-900 dark:text-white">AI Acoustic Model Engine</h3>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <div className="flex justify-between mb-1 font-semibold text-slate-700 dark:text-slate-300">
                <span>Leak Confidence Alert Trigger Threshold</span>
                <span className="font-mono text-cyan-500">85%</span>
              </div>
              <input type="range" min="50" max="98" defaultValue="85" className="w-full accent-cyan-500" />
              <p className="text-[11px] text-slate-400 mt-1">Minimum confidence score required before automatically flagging an incident to emergency dispatch.</p>
            </div>

            <div>
              <div className="flex justify-between mb-1 font-semibold text-slate-700 dark:text-slate-300">
                <span>Sampling Frequency Rate</span>
                <span className="font-mono text-cyan-500">1000 Hz</span>
              </div>
              <select className="w-full p-2 rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 font-mono text-slate-900 dark:text-white">
                <option>250 Hz (Low Power Mode)</option>
                <option>500 Hz (Standard Telemetry)</option>
                <option selected>1000 Hz (High Resolution Hydrophone)</option>
                <option>2000 Hz (Burst Acoustic Correlation)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Notifications & Alert Dispatch */}
        <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm p-6 space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
            <Bell className="w-5 h-5 text-amber-500" />
            <h3 className="font-bold text-base text-slate-900 dark:text-white">Dispatch & Alert Subscriptions</h3>
          </div>

          <div className="space-y-3 text-xs">
            <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/50 cursor-pointer">
              <div>
                <p className="font-bold text-slate-900 dark:text-white">Critical Pressure Drop Webhooks</p>
                <p className="text-[11px] text-slate-400">Trigger immediate SMS & SCADA integration on pressure drops &gt;10 PSI</p>
              </div>
              <input type="checkbox" defaultChecked className="w-4 h-4 accent-cyan-500 rounded" />
            </label>

            <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/50 cursor-pointer">
              <div>
                <p className="font-bold text-slate-900 dark:text-white">Automated AI Crew Pre-Dispatch</p>
                <p className="text-[11px] text-slate-400">Auto-assign nearest field technician for rank #1 critical leaks</p>
              </div>
              <input type="checkbox" defaultChecked className="w-4 h-4 accent-cyan-500 rounded" />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};
