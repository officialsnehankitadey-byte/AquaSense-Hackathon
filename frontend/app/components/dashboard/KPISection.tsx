'use client';

import React from 'react';
import { 
  Activity, 
  Radio, 
  AlertTriangle, 
  Droplets, 
  ArrowUpRight, 
  ArrowDownRight,
  ShieldCheck,
  Zap,
  TrendingDown
} from 'lucide-react';
import { KPIMetric } from '../../types/dashboard';

interface KPISectionProps {
  metrics: KPIMetric[];
}

export const KPISection: React.FC<KPISectionProps> = ({ metrics }) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Activity':
        return <Activity className="w-5 h-5 text-cyan-500" />;
      case 'Radio':
        return <Radio className="w-5 h-5 text-emerald-500" />;
      case 'AlertTriangle':
        return <AlertTriangle className="w-5 h-5 text-amber-500" />;
      case 'Droplets':
        return <Droplets className="w-5 h-5 text-blue-500" />;
      default:
        return <Activity className="w-5 h-5 text-cyan-500" />;
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
      {/* 1. Network Health Index Card */}
      <div className="relative overflow-hidden rounded-2xl p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-cyan-500/40 transition-all group">
        <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/5 rounded-full blur-xl group-hover:bg-cyan-500/10 transition-all" />
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Network Health Index
          </span>
          <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20">
            {getIcon('Activity')}
          </div>
        </div>
        
        <div className="flex items-baseline gap-2 mb-1">
          <span className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight font-mono">
            {metrics[0]?.value || '94.2%'}
          </span>
          <span className="inline-flex items-center gap-0.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 px-1.5 py-0.5 rounded-full bg-emerald-500/10">
            <ArrowUpRight className="w-3 h-3" />
            {metrics[0]?.change || '+1.8%'}
          </span>
        </div>

        <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
          {metrics[0]?.secondaryInfo || 'Optimal operating state'}
        </p>

        {/* Progress Bar Visualizer */}
        <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
          <div className="bg-gradient-to-r from-cyan-500 to-emerald-500 h-full rounded-full w-[94.2%]" />
        </div>
      </div>

      {/* 2. Sensors Online Card */}
      <div className="relative overflow-hidden rounded-2xl p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-emerald-500/40 transition-all group">
        <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-xl group-hover:bg-emerald-500/10 transition-all" />
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Sensors Online
          </span>
          <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
            {getIcon('Radio')}
          </div>
        </div>

        <div className="flex items-baseline gap-2 mb-1">
          <span className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight font-mono">
            {metrics[1]?.value || '1,482'}
          </span>
          <span className="text-xs font-medium text-slate-400">
            {metrics[1]?.unit || '/ 1,500'}
          </span>
          <span className="inline-flex items-center gap-0.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 px-1.5 py-0.5 rounded-full bg-emerald-500/10 ml-auto">
            {metrics[1]?.change || '98.8%'}
          </span>
        </div>

        <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
          {metrics[1]?.secondaryInfo || '18 sensors in scheduled sync'}
        </p>

        {/* Status Indicators */}
        <div className="flex items-center gap-3 text-[11px] text-slate-500 dark:text-slate-400 font-medium">
          <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> 1,482 Active
          </span>
          <span className="flex items-center gap-1 text-amber-500">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" /> 18 Syncing
          </span>
        </div>
      </div>

      {/* 3. Active Incidents Card */}
      <div className="relative overflow-hidden rounded-2xl p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-amber-500/40 transition-all group">
        <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-xl group-hover:bg-amber-500/10 transition-all" />
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Active Incidents
          </span>
          <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 relative">
            {getIcon('AlertTriangle')}
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full animate-ping" />
          </div>
        </div>

        <div className="flex items-baseline gap-2 mb-1">
          <span className="text-3xl font-extrabold text-amber-500 tracking-tight font-mono">
            {metrics[2]?.value || '4'}
          </span>
          <span className="inline-flex items-center gap-0.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 px-1.5 py-0.5 rounded-full bg-emerald-500/10">
            <TrendingDown className="w-3 h-3" />
            {metrics[2]?.change || '-2 from yesterday'}
          </span>
        </div>

        <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
          {metrics[2]?.secondaryInfo || '1 Critical • 2 High • 1 Medium'}
        </p>

        {/* Severity Pill Micro Grid */}
        <div className="flex items-center gap-1.5">
          <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-red-500/15 text-red-600 dark:text-red-400 border border-red-500/20">
            1 Critical
          </span>
          <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/20">
            2 High
          </span>
          <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/20">
            1 Med
          </span>
        </div>
      </div>

      {/* 4. Water Saved Card */}
      <div className="relative overflow-hidden rounded-2xl p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-blue-500/40 transition-all group">
        <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full blur-xl group-hover:bg-blue-500/10 transition-all" />
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Water Saved (30d)
          </span>
          <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20">
            {getIcon('Droplets')}
          </div>
        </div>

        <div className="flex items-baseline gap-2 mb-1">
          <span className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight font-mono">
            {metrics[3]?.value || '4.82M'}
          </span>
          <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 font-mono">
            {metrics[3]?.unit || 'Liters'}
          </span>
          <span className="inline-flex items-center gap-0.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 px-1.5 py-0.5 rounded-full bg-emerald-500/10 ml-auto">
            {metrics[3]?.change || '+$42,500'}
          </span>
        </div>

        <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
          {metrics[3]?.secondaryInfo || 'NRW loss reduced by 31.4%'}
        </p>

        <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-cyan-400 h-full rounded-full w-[78%]" />
        </div>
      </div>
    </div>
  );
};
