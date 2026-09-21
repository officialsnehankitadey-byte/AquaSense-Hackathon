'use client';

import React, { useState } from 'react';
import { 
  Network, 
  Layers, 
  ZoomIn, 
  ZoomOut, 
  Maximize2, 
  AlertTriangle, 
  Activity, 
  Radio, 
  Zap, 
  Info,
  X,
  Gauge,
  Waves,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { NetworkNode, PipeSegment } from '../../types/dashboard';

interface NetworkTopologyMapProps {
  nodes: NetworkNode[];
  pipes: PipeSegment[];
  onSelectNode?: (node: NetworkNode) => void;
}

export const NetworkTopologyMap: React.FC<NetworkTopologyMapProps> = ({
  nodes,
  pipes,
  onSelectNode,
}) => {
  const [selectedNode, setSelectedNode] = useState<NetworkNode | null>(nodes.find(n => n.status === 'CRITICAL') || nodes[0]);
  const [showPipes, setShowPipes] = useState(true);
  const [showHeatmap, setShowHeatmap] = useState(true);
  const [zoomLevel, setZoomLevel] = useState(1);

  const handleNodeClick = (node: NetworkNode) => {
    setSelectedNode(node);
    if (onSelectNode) onSelectNode(node);
  };

  const getPipeColor = (status: PipeSegment['status']) => {
    switch (status) {
      case 'LEAK_DETECTED':
        return '#ef4444'; // Red glowing leak
      case 'HIGH_PRESSURE':
        return '#f59e0b'; // Amber warning
      case 'MAINTENANCE':
        return '#64748b'; // Muted grey
      default:
        return '#38bdf8'; // Cyan normal flow
    }
  };

  const getNodeColor = (status: NetworkNode['status']) => {
    switch (status) {
      case 'CRITICAL':
        return 'bg-red-500 border-red-400 text-white shadow-red-500/50';
      case 'WARNING':
        return 'bg-amber-500 border-amber-400 text-white shadow-amber-500/50';
      case 'OFFLINE':
        return 'bg-slate-600 border-slate-500 text-slate-300';
      default:
        return 'bg-cyan-500 border-cyan-400 text-white shadow-cyan-500/50';
    }
  };

  return (
    <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col">
      {/* Topology Header & Controls */}
      <div className="p-4 md:p-5 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20">
              <Network className="w-5 h-5 text-cyan-500" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
                Network GIS Topology & Acoustic Heatmap
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Real-time hydro-acoustic sensor nodes & pipeline pressure vectors
              </p>
            </div>
          </div>
        </div>

        {/* Map Layers & Zoom controls */}
        <div className="flex items-center gap-2">
          {/* Layer Toggle */}
          <button
            onClick={() => setShowPipes(!showPipes)}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium border flex items-center gap-1.5 transition-all ${
              showPipes
                ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-600 dark:text-cyan-400'
                : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Pipes</span>
          </button>

          <button
            onClick={() => setShowHeatmap(!showHeatmap)}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium border flex items-center gap-1.5 transition-all ${
              showHeatmap
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400'
                : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500'
            }`}
          >
            <Waves className="w-3.5 h-3.5" />
            <span>Pressure Heatmap</span>
          </button>

          {/* Zoom Buttons */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700/60 p-0.5">
            <button
              onClick={() => setZoomLevel(Math.max(0.8, zoomLevel - 0.2))}
              className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg text-slate-600 dark:text-slate-300"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="px-2 text-[11px] font-mono text-slate-500 dark:text-slate-400">
              {Math.round(zoomLevel * 100)}%
            </span>
            <button
              onClick={() => setZoomLevel(Math.min(1.6, zoomLevel + 0.2))}
              className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg text-slate-600 dark:text-slate-300"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Map Viewport Area */}
      <div className="relative w-full h-[420px] md:h-[480px] bg-slate-950 overflow-hidden select-none">
        {/* Map Grid Background Overlay */}
        <div 
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(56, 189, 248, 0.4) 1px, transparent 0)`,
            backgroundSize: '24px 24px',
            transform: `scale(${zoomLevel})`,
            transformOrigin: 'center center',
          }}
        />

        {/* Dynamic Acoustic Heatmap Wave Layers */}
        {showHeatmap && (
          <div 
            className="absolute inset-0 pointer-events-none opacity-40 transition-transform duration-300"
            style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'center center' }}
          >
            {/* Critical Leak Pulsing Radial Aura at Node 7 */}
            <div className="absolute top-[44%] left-[72%] -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full bg-gradient-radial from-red-500/40 via-red-500/10 to-transparent animate-pulse" />
            {/* Warning Aura at Node 3 */}
            <div className="absolute top-[22%] left-[42%] -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full bg-gradient-radial from-amber-500/30 via-amber-500/5 to-transparent" />
            {/* Normal High-Pressure Gradient Intake at Node 1 */}
            <div className="absolute top-[30%] left-[12%] -translate-x-1/2 -translate-y-1/2 w-40 h-40 rounded-full bg-gradient-radial from-cyan-500/25 via-cyan-500/5 to-transparent" />
          </div>
        )}

        {/* SVG Pipeline Vectors Container */}
        <div 
          className="absolute inset-0 transition-transform duration-300"
          style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'center center' }}
        >
          <svg className="w-full h-full">
            <defs>
              <linearGradient id="pipeNormal" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#0284c7" />
                <stop offset="100%" stopColor="#38bdf8" />
              </linearGradient>
              <linearGradient id="pipeLeak" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#f59e0b" />
                <stop offset="100%" stopColor="#ef4444" />
              </linearGradient>

              {/* Animated Pipe Flow Marker */}
              <pattern id="flowPattern" width="20" height="20" patternUnits="userSpaceOnUse">
                <circle cx="5" cy="5" r="2" fill="#38bdf8" className="animate-pulse" />
              </pattern>
            </defs>

            {/* Pipe Segment Lines */}
            {showPipes && pipes.map((pipe) => {
              const fromNode = nodes.find(n => n.id === pipe.fromNodeId);
              const toNode = nodes.find(n => n.id === pipe.toNodeId);
              if (!fromNode || !toNode) return null;

              const isLeak = pipe.status === 'LEAK_DETECTED';

              return (
                <g key={pipe.id}>
                  {/* Outer Glow Path */}
                  <line
                    x1={`${fromNode.x}%`}
                    y1={`${fromNode.y}%`}
                    x2={`${toNode.x}%`}
                    y2={`${toNode.y}%`}
                    stroke={getPipeColor(pipe.status)}
                    strokeWidth={isLeak ? 6 : 4}
                    strokeOpacity={isLeak ? 0.6 : 0.3}
                    strokeLinecap="round"
                  />
                  {/* Core Pipe Line */}
                  <line
                    x1={`${fromNode.x}%`}
                    y1={`${fromNode.y}%`}
                    x2={`${toNode.x}%`}
                    y2={`${toNode.y}%`}
                    stroke={getPipeColor(pipe.status)}
                    strokeWidth={isLeak ? 3 : 2}
                    strokeDasharray={isLeak ? "6 4" : "none"}
                    className={isLeak ? "animate-pulse" : ""}
                    strokeLinecap="round"
                  />
                </g>
              );
            })}

            {/* Interactive Node Markers */}
            {nodes.map((node) => {
              const isSelected = selectedNode?.id === node.id;
              const isCritical = node.status === 'CRITICAL';
              const isWarning = node.status === 'WARNING';

              return (
                <g 
                  key={node.id} 
                  transform={`translate(${node.x * 8.5}, ${node.y * 3.8})`}
                  onClick={() => handleNodeClick(node)}
                  className="cursor-pointer group"
                >
                  {/* Pulsing Outer Ring for Leaks */}
                  {isCritical && (
                    <circle
                      cx={`${node.x}%`}
                      cy={`${node.y}%`}
                      r="18"
                      className="fill-red-500/20 stroke-red-500/60 animate-ping"
                    />
                  )}

                  {/* Node Base Pin */}
                  <circle
                    cx={`${node.x}%`}
                    cy={`${node.y}%`}
                    r={isSelected ? 10 : 7}
                    fill={isCritical ? '#ef4444' : isWarning ? '#f59e0b' : '#0284c7'}
                    stroke={isSelected ? '#ffffff' : '#0f172a'}
                    strokeWidth="2.5"
                    className="transition-all duration-200 hover:scale-125"
                  />

                  {/* Node Label Tooltip on Map */}
                  <text
                    x={`${node.x}%`}
                    y={`${node.y - 3}%`}
                    textAnchor="middle"
                    fill="#e2e8f0"
                    fontSize="9"
                    fontWeight="600"
                    className="font-mono pointer-events-none drop-shadow-md opacity-90 group-hover:opacity-100"
                  >
                    {node.name.split(' ')[0]}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Floating Node Telemetry Inspector Panel */}
        {selectedNode && (
          <div className="absolute bottom-4 left-4 right-4 md:right-auto md:w-80 p-4 rounded-2xl bg-slate-900/90 border border-slate-700/80 backdrop-blur-md shadow-2xl text-slate-100 z-10 animate-in fade-in slide-in-from-bottom-2 duration-200">
            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full ${
                  selectedNode.status === 'CRITICAL' ? 'bg-red-500 animate-ping' :
                  selectedNode.status === 'WARNING' ? 'bg-amber-500' : 'bg-emerald-400'
                }`} />
                <div>
                  <h4 className="text-xs font-bold text-white leading-tight">{selectedNode.name}</h4>
                  <p className="text-[10px] text-cyan-400 font-mono">{selectedNode.zone} • ID: {selectedNode.id}</p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedNode(null)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 my-3 p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
              <div className="flex items-center gap-2">
                <Gauge className="w-4 h-4 text-cyan-400" />
                <div>
                  <p className="text-[10px] text-slate-400 uppercase">Pressure</p>
                  <p className="text-xs font-bold text-white font-mono">{selectedNode.pressurePsi} PSI</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-400" />
                <div>
                  <p className="text-[10px] text-slate-400 uppercase">Flow Rate</p>
                  <p className="text-xs font-bold text-white font-mono">{selectedNode.flowGpm} GPM</p>
                </div>
              </div>
            </div>

            {selectedNode.status === 'CRITICAL' && (
              <div className="p-2 rounded-lg bg-red-500/10 border border-red-500/30 text-[11px] text-red-300 flex items-center gap-2 mb-2">
                <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
                <span>AI Anomaly Score: <strong>97/100</strong> (Acoustic resonance burst detected)</span>
              </div>
            )}

            <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-800">
              <span>Battery: {selectedNode.batteryLevel}%</span>
              <span>Last Ping: {selectedNode.lastPing}</span>
            </div>
          </div>
        )}

        {/* GIS Map Legend */}
        <div className="absolute top-4 left-4 px-3 py-2 rounded-xl bg-slate-900/80 border border-slate-800 backdrop-blur-sm text-[11px] text-slate-300 flex items-center gap-3">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" /> Normal Flow
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400" /> High Pressure
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" /> Leak Pinpoint
          </span>
        </div>
      </div>
    </div>
  );
};
