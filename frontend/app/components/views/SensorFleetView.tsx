'use client';

import React, { useState } from 'react';
import { 
  Cpu, 
  Radio, 
  Battery, 
  Activity, 
  CheckCircle2, 
  AlertTriangle, 
  Wifi, 
  Sliders, 
  Search, 
  Filter, 
  Zap,
  Clock,
  Settings,
  RefreshCw,
  X,
  ShieldCheck
} from 'lucide-react';
import { mockNetworkNodes } from '../../data/mockData';
import { NetworkNode } from '../../types/dashboard';

export const SensorFleetView: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [selectedSensor, setSelectedSensor] = useState<NetworkNode | null>(null);
  const [isCalibrating, setIsCalibrating] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const filteredSensors = mockNetworkNodes.filter((sensor) => {
    const matchesSearch = 
      sensor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sensor.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sensor.zone.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || sensor.status === statusFilter;
    const matchesType = typeFilter === 'ALL' || sensor.type === typeFilter;

    return matchesSearch && matchesStatus && matchesType;
  });

  const totalSensors = mockNetworkNodes.length;
  const activeSensors = mockNetworkNodes.filter(s => s.status === 'OPTIMAL').length;
  const warningSensors = mockNetworkNodes.filter(s => s.status === 'WARNING').length;
  const criticalSensors = mockNetworkNodes.filter(s => s.status === 'CRITICAL').length;

  const triggerCalibration = (sensor: NetworkNode, type: string) => {
    setIsCalibrating(true);
    setTimeout(() => {
      setIsCalibrating(false);
      setToastMsg(`Remote ${type} trigger completed successfully for device ${sensor.name} (${sensor.id})`);
      setTimeout(() => setToastMsg(null), 4000);
    }, 1200);
  };

  return (
    <div className="space-y-6">
      {/* View Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl md:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Sensor Fleet Telemetry & Device Calibration
            </h1>
            <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30">
              {totalSensors} Fleet Nodes
            </span>
          </div>
          <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Real-time status, battery levels, sampling frequencies, transducer zero-point calibration, and remote pings.
          </p>
        </div>
      </div>

      {/* Toast Notification */}
      {toastMsg && (
        <div className="p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 font-semibold text-xs flex items-center justify-between gap-2 animate-fadeIn shadow-md">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>{toastMsg}</span>
          </div>
          <span className="text-[10px] font-mono text-emerald-400">CALIBRATED</span>
        </div>
      )}

      {/* Fleet Stats Overview Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Total Nodes</p>
            <p className="text-xl font-bold text-slate-900 dark:text-white mt-1">{totalSensors}</p>
          </div>
          <div className="p-2.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
            <Cpu className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Optimal (100% Signal)</p>
            <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">{activeSensors}</p>
          </div>
          <div className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-500">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Warning / Drift</p>
            <p className="text-xl font-bold text-amber-500 mt-1">{warningSensors}</p>
          </div>
          <div className="p-2.5 rounded-lg bg-amber-500/10 text-amber-500">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Critical / Leak Signature</p>
            <p className="text-xl font-bold text-red-500 mt-1">{criticalSensors}</p>
          </div>
          <div className="p-2.5 rounded-lg bg-red-500/10 text-red-500">
            <Zap className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Sensor Table & Filters */}
      <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm p-4 md:p-6 space-y-4">
        {/* Filters bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-200 dark:border-slate-800">
          <div className="relative flex-1 min-w-[240px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search sensor ID, zone, or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs text-slate-600 dark:text-slate-300">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <span>Status:</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-transparent font-medium focus:outline-none text-slate-900 dark:text-white"
              >
                <option value="ALL" className="bg-white dark:bg-slate-900">All Statuses</option>
                <option value="OPTIMAL" className="bg-white dark:bg-slate-900">Optimal</option>
                <option value="WARNING" className="bg-white dark:bg-slate-900">Warning</option>
                <option value="CRITICAL" className="bg-white dark:bg-slate-900">Critical</option>
              </select>
            </div>

            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs text-slate-600 dark:text-slate-300">
              <span>Type:</span>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="bg-transparent font-medium focus:outline-none text-slate-900 dark:text-white"
              >
                <option value="ALL" className="bg-white dark:bg-slate-900">All Types</option>
                <option value="ACOUSTIC_SENSOR" className="bg-white dark:bg-slate-900">Acoustic Hydrophone</option>
                <option value="PRESSURE_SENSOR" className="bg-white dark:bg-slate-900">Pressure Transducer</option>
                <option value="VALVE" className="bg-white dark:bg-slate-900">Smart PRV Valve</option>
                <option value="PUMP_STATION" className="bg-white dark:bg-slate-900">Pump Station</option>
              </select>
            </div>
          </div>
        </div>

        {/* Sensors Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-semibold uppercase tracking-wider">
                <th className="py-3 px-3">Device & ID</th>
                <th className="py-3 px-3">Type</th>
                <th className="py-3 px-3">DMA Zone</th>
                <th className="py-3 px-3">Telemetry Reading</th>
                <th className="py-3 px-3">Battery</th>
                <th className="py-3 px-3">Last Ping</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
              {filteredSensors.map((node) => (
                <tr key={node.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400">
                        <Radio className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900 dark:text-white">{node.name}</p>
                        <p className="text-[10px] text-slate-400 font-mono">{node.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 text-[11px] font-mono rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      {node.type.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-slate-600 dark:text-slate-300 font-mono">
                    {node.zone}
                  </td>
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-slate-900 dark:text-white">{node.pressurePsi.toFixed(1)} PSI</span>
                      <span className="text-slate-400">|</span>
                      <span className="font-mono text-cyan-600 dark:text-cyan-400">{node.flowGpm} GPM</span>
                    </div>
                  </td>
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2">
                      <Battery className={`w-4 h-4 ${
                        (node.batteryLevel || 100) < 20 ? 'text-red-400' : 'text-emerald-400'
                      }`} />
                      <span className="font-mono text-slate-700 dark:text-slate-300">{node.batteryLevel || 95}%</span>
                    </div>
                  </td>
                  <td className="py-3 px-3 text-slate-500 dark:text-slate-400 font-mono">
                    {node.lastPing || 'Just now'}
                  </td>
                  <td className="py-3 px-3">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                      node.status === 'CRITICAL'
                        ? 'bg-red-500/15 text-red-500 border border-red-500/30'
                        : node.status === 'WARNING'
                        ? 'bg-amber-500/15 text-amber-500 border border-amber-500/30'
                        : 'bg-emerald-500/15 text-emerald-500 border border-emerald-500/30'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        node.status === 'CRITICAL' ? 'bg-red-500 animate-ping' : node.status === 'WARNING' ? 'bg-amber-500' : 'bg-emerald-500'
                      }`} />
                      {node.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={() => setSelectedSensor(node)}
                      className="px-2.5 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-cyan-500/20 text-slate-700 dark:text-slate-300 hover:text-cyan-400 transition-all font-semibold text-xs flex items-center gap-1 ml-auto"
                    >
                      <Settings className="w-3.5 h-3.5" />
                      <span>Calibrate</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Sensor Calibration & Telecommand Modal */}
      {selectedSensor && (
        <div 
          className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto"
          onClick={() => setSelectedSensor(null)}
        >
          <div 
            className="w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-900 dark:text-slate-100 shadow-2xl p-5 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-500">
                  <Settings className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white">Device Diagnostics & Calibration</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">{selectedSensor.name} ({selectedSensor.id})</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedSensor(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white bg-slate-100 dark:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 grid grid-cols-2 gap-2">
                <div>
                  <span className="text-[10px] text-slate-400 block">Battery Level</span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white">{selectedSensor.batteryLevel || 95}%</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">DMA Zone</span>
                  <span className="font-mono font-bold text-cyan-500">{selectedSensor.zone}</span>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <button
                  onClick={() => triggerCalibration(selectedSensor, 'Transducer Zero-Point Calibration')}
                  disabled={isCalibrating}
                  className="w-full p-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-cyan-500/20 text-slate-900 dark:text-white font-semibold flex items-center justify-between border border-slate-200 dark:border-slate-700/60 transition-all"
                >
                  <div className="flex items-center gap-2">
                    <RefreshCw className={`w-4 h-4 text-cyan-500 ${isCalibrating ? 'animate-spin' : ''}`} />
                    <span>Zero-Point Transducer Recalibration</span>
                  </div>
                  <span className="text-[10px] font-mono text-cyan-400 uppercase">EXECUTE</span>
                </button>

                <button
                  onClick={() => triggerCalibration(selectedSensor, 'Hydrophone FFT Sensitivity Tuning')}
                  disabled={isCalibrating}
                  className="w-full p-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-cyan-500/20 text-slate-900 dark:text-white font-semibold flex items-center justify-between border border-slate-200 dark:border-slate-700/60 transition-all"
                >
                  <div className="flex items-center gap-2">
                    <Radio className="w-4 h-4 text-purple-500" />
                    <span>Hydrophone Acoustic FFT Sensitivity Tuning</span>
                  </div>
                  <span className="text-[10px] font-mono text-purple-400 uppercase">EXECUTE</span>
                </button>

                <button
                  onClick={() => triggerCalibration(selectedSensor, 'Diagnostic Hardware Ping')}
                  disabled={isCalibrating}
                  className="w-full p-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-cyan-500/20 text-slate-900 dark:text-white font-semibold flex items-center justify-between border border-slate-200 dark:border-slate-700/60 transition-all"
                >
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-amber-500" />
                    <span>Send Immediate Telemetry Diagnostic Ping</span>
                  </div>
                  <span className="text-[10px] font-mono text-amber-400 uppercase">PING</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
