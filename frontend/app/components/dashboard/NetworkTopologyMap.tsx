'use client';

import React, { useState } from 'react';
import { 
  Network, 
  Layers, 
  ZoomIn, 
  ZoomOut, 
  AlertTriangle, 
  Activity, 
  Radio, 
  X,
  Gauge,
  Waves,
  ShieldCheck,
  Target,
  LocateFixed,
  Compass
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
  const [selectedNode, setSelectedNode] = useState<NetworkNode | null>(null);
  const [hoveredNode, setHoveredNode] = useState<NetworkNode | null>(null);
  const [showPipes, setShowPipes] = useState(true);
  const [showHeatmap, setShowHeatmap] = useState(true);
  const [showContours, setShowContours] = useState(true);
  const [pipeFilter, setPipeFilter] = useState<'ALL' | 'LEAK_ONLY' | 'HIGH_PRESSURE'>('ALL');
  const [zoomLevel, setZoomLevel] = useState(1);

  // Suspected leak node reference
  const leakNode = nodes.find(n => n.status === 'CRITICAL');

  const handleNodeClick = (node: NetworkNode) => {
    setSelectedNode(node);
    if (onSelectNode) onSelectNode(node);
  };

  const focusLeakArea = () => {
    if (leakNode) {
      setSelectedNode(leakNode);
      setZoomLevel(1.2);
    }
  };

  const getPipeColor = (status: PipeSegment['status']) => {
    switch (status) {
      case 'LEAK_DETECTED':
        return '#ef4444'; // Red leak vector
      case 'HIGH_PRESSURE':
        return '#f59e0b'; // Amber high-pressure warning
      case 'MAINTENANCE':
        return '#64748b'; // Maintenance gray
      default:
        return '#0284c7'; // Cyan normal operational flow
    }
  };

  const getNodeBadgeClass = (status: NetworkNode['status']) => {
    switch (status) {
      case 'CRITICAL':
        return 'bg-red-500/20 text-red-400 border-red-500/40';
      case 'WARNING':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/40';
      case 'OFFLINE':
        return 'bg-slate-500/20 text-slate-400 border-slate-500/40';
      default:
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40';
    }
  };

  const activeDisplayNode = hoveredNode || selectedNode;

  return (
    <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col">
      {/* GIS Operational Map Header */}
      <div className="p-4 md:p-5 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-500/30 text-cyan-500">
            <Network className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
                Network GIS Topology & Operational Map
              </h3>
              <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20 font-mono">
                GIS REAL-TIME
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Live pressure vectors, flow nodes, acoustic leak localization & pipe segments
            </p>
          </div>
        </div>

        {/* Map View & Layer Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Focus Suspected Leak Button */}
          {leakNode && (
            <button
              onClick={focusLeakArea}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 border border-red-500/30 flex items-center gap-1.5 transition-all shadow-sm"
              title="Center map on active leak area"
            >
              <Target className="w-3.5 h-3.5 animate-spin" />
              <span>Locate Suspected Leak</span>
            </button>
          )}

          {/* Toggle Pipe Layer */}
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

          {/* Toggle Heatmap */}
          <button
            onClick={() => setShowHeatmap(!showHeatmap)}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium border flex items-center gap-1.5 transition-all ${
              showHeatmap
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400'
                : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500'
            }`}
          >
            <Waves className="w-3.5 h-3.5" />
            <span>Heatmap</span>
          </button>

          {/* Toggle Pressure Contours */}
          <button
            onClick={() => setShowContours(!showContours)}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium border flex items-center gap-1.5 transition-all ${
              showContours
                ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-600 dark:text-indigo-400'
                : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>DMA Contours</span>
          </button>

          {/* Pipe Filter Select */}
          <select
            value={pipeFilter}
            onChange={(e) => setPipeFilter(e.target.value as 'ALL' | 'LEAK_ONLY' | 'HIGH_PRESSURE')}
            className="px-2.5 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 outline-none"
          >
            <option value="ALL">All Pipes</option>
            <option value="LEAK_ONLY">Leaks Only</option>
            <option value="HIGH_PRESSURE">High Pressure</option>
          </select>

          {/* Zoom Controls */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700/60 p-0.5">
            <button
              onClick={() => setZoomLevel(Math.max(0.8, zoomLevel - 0.2))}
              className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg text-slate-600 dark:text-slate-300"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="px-2 text-[11px] font-mono text-slate-500 dark:text-slate-400 font-semibold">
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

      {/* Main Map GIS Canvas Viewport */}
      <div 
        className="relative w-full h-[450px] md:h-[500px] bg-slate-100 dark:bg-slate-950 overflow-hidden select-none border-t border-b border-slate-200 dark:border-slate-800 transition-colors duration-200"
        onClick={() => setSelectedNode(null)}
      >
        {/* Dark Grid Lines Overlay */}
        <div 
          className="absolute inset-0 opacity-40 dark:opacity-25 pointer-events-none transition-transform duration-300"
          style={{
            backgroundImage: `linear-gradient(to right, rgba(2, 132, 199, 0.15) 1px, transparent 1px), linear-gradient(to bottom, rgba(2, 132, 199, 0.15) 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
            transform: `scale(${zoomLevel})`,
            transformOrigin: 'center center',
          }}
        />

        {/* Dynamic Acoustic Heatmap Overlay */}
        {showHeatmap && (
          <div 
            className="absolute inset-0 pointer-events-none opacity-45 transition-transform duration-300"
            style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'center center' }}
          >
            {/* Suspected Leak Aura at 72%, 44% */}
            <div className="absolute top-[44%] left-[72%] -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-gradient-radial from-red-500/50 via-red-500/15 to-transparent animate-pulse" />
            {/* Warning Aura at 42%, 22% */}
            <div className="absolute top-[22%] left-[42%] -translate-x-1/2 -translate-y-1/2 w-40 h-40 rounded-full bg-gradient-radial from-amber-500/35 via-amber-500/10 to-transparent" />
            {/* Optimal Intake Aura at 12%, 30% */}
            <div className="absolute top-[30%] left-[12%] -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full bg-gradient-radial from-cyan-500/30 via-cyan-500/5 to-transparent" />
          </div>
        )}

        {/* Operational GIS Vector Canvas */}
        <div 
          className="absolute inset-0 transition-transform duration-300"
          style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'center center' }}
        >
          <svg className="w-full h-full" viewBox="0 0 1000 500" preserveAspectRatio="none">
            <defs>
              {/* Pipe Flow Gradient */}
              <linearGradient id="normalFlowGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#0284c7" />
                <stop offset="100%" stopColor="#38bdf8" />
              </linearGradient>

              {/* Arrow Marker for Pipeline Flow */}
              <marker
                id="flowArrow"
                viewBox="0 0 10 10"
                refX="6"
                refY="5"
                markerWidth="5"
                markerHeight="5"
                orient="auto-start-reverse"
              >
                <path d="M 0 1 L 8 5 L 0 9 z" fill="#38bdf8" opacity="0.8" />
              </marker>

              <marker
                id="leakArrow"
                viewBox="0 0 10 10"
                refX="6"
                refY="5"
                markerWidth="5"
                markerHeight="5"
                orient="auto-start-reverse"
              >
                <path d="M 0 1 L 8 5 L 0 9 z" fill="#ef4444" opacity="0.9" />
              </marker>
            </defs>

            {/* DMA Pressure Iso-Contours Layer */}
            {showContours && (
              <g className="pointer-events-none opacity-30">
                <path d="M 50 120 Q 250 80 450 140 T 850 110" fill="none" stroke="#6366f1" strokeWidth="2" strokeDasharray="6 6" />
                <text x="70" y="115" fill="#818cf8" fontSize="10" fontFamily="monospace">65 PSI Contour</text>
                
                <path d="M 80 260 Q 350 200 650 280 T 950 240" fill="none" stroke="#3b82f6" strokeWidth="2" strokeDasharray="6 6" />
                <text x="100" y="255" fill="#60a5fa" fontSize="10" fontFamily="monospace">55 PSI Contour</text>

                <path d="M 600 180 Q 750 140 900 260" fill="none" stroke="#ef4444" strokeWidth="2" strokeDasharray="4 4" />
                <text x="720" y="170" fill="#f87171" fontSize="10" fontFamily="monospace" fontWeight="bold">Pressure Drop Anomaly Zone (42 PSI)</text>
              </g>
            )}

            {/* Pipeline Vector Connections */}
            {showPipes && pipes
              .filter(p => {
                if (pipeFilter === 'LEAK_ONLY') return p.status === 'LEAK_DETECTED';
                if (pipeFilter === 'HIGH_PRESSURE') return p.status === 'HIGH_PRESSURE';
                return true;
              })
              .map((pipe) => {
              const fromNode = nodes.find(n => n.id === pipe.fromNodeId);
              const toNode = nodes.find(n => n.id === pipe.toNodeId);
              if (!fromNode || !toNode) return null;

              const x1 = fromNode.x * 10;
              const y1 = fromNode.y * 5;
              const x2 = toNode.x * 10;
              const y2 = toNode.y * 5;

              const isLeakPipe = pipe.status === 'LEAK_DETECTED';
              const isWarningPipe = pipe.status === 'HIGH_PRESSURE';

              return (
                <g key={pipe.id} className="group/pipe cursor-pointer">
                  {/* Outer Pipeline Glow */}
                  <line
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    stroke={getPipeColor(pipe.status)}
                    strokeWidth={isLeakPipe ? 8 : isWarningPipe ? 6 : 4}
                    strokeOpacity={isLeakPipe ? 0.7 : 0.3}
                    strokeLinecap="round"
                  />

                  {/* Core Pipe Line */}
                  <line
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    stroke={getPipeColor(pipe.status)}
                    strokeWidth={isLeakPipe ? 3.5 : 2.5}
                    strokeDasharray={isLeakPipe ? "8 5" : "none"}
                    className={isLeakPipe ? "animate-pulse" : ""}
                    markerEnd={isLeakPipe ? "url(#leakArrow)" : "url(#flowArrow)"}
                    strokeLinecap="round"
                  />

                  {/* Pipe Flow Label on Hover */}
                  <title>{`${pipe.id}: ${pipe.diameterInches}" Main (${pipe.flowRateGpm} GPM)`}</title>
                </g>
              );
            })}

            {/* Operational Nodes Rendering */}
            {nodes.map((node) => {
              const cx = node.x * 10;
              const cy = node.y * 5;

              const isSelected = selectedNode?.id === node.id;
              const isHovered = hoveredNode?.id === node.id;
              const isCritical = node.status === 'CRITICAL';
              const isWarning = node.status === 'WARNING';

              return (
                <g
                  key={node.id}
                  transform={`translate(${cx}, ${cy})`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleNodeClick(node);
                  }}
                  onMouseEnter={() => setHoveredNode(node)}
                  onMouseLeave={() => setHoveredNode(null)}
                  className="cursor-pointer group/node"
                >
                  {/* Suspected Leak Target Radar Scope Ring */}
                  {isCritical && (
                    <g>
                      <circle
                        r="26"
                        className="fill-red-500/10 stroke-red-500/50 animate-ping"
                        strokeWidth="1.5"
                      />
                      <circle
                        r="38"
                        className="fill-none stroke-red-500/30"
                        strokeDasharray="4 4"
                        strokeWidth="1"
                      />
                    </g>
                  )}

                  {/* Node Type Geometry */}
                  {node.type === 'RESERVOIR' ? (
                    // Reservoir Intake Diamond
                    <polygon
                      points="0,-14 14,0 0,14 -14,0"
                      fill="#0284c7"
                      stroke={isSelected ? '#ffffff' : '#38bdf8'}
                      strokeWidth={isSelected ? "3" : "2"}
                      className="shadow-lg shadow-cyan-500/50"
                    />
                  ) : node.type === 'PUMP_STATION' ? (
                    // Pump Station Octagon
                    <polygon
                      points="-10,-10 10,-10 14,0 10,10 -10,10 -14,0"
                      fill="#0d9488"
                      stroke={isSelected ? '#ffffff' : '#2dd4bf'}
                      strokeWidth={isSelected ? "3" : "2"}
                    />
                  ) : (
                    // Smart Acoustic Sensor Pin
                    <circle
                      r={isSelected || isHovered ? 12 : 9}
                      fill={isCritical ? '#ef4444' : isWarning ? '#f59e0b' : '#38bdf8'}
                      stroke={isSelected ? '#ffffff' : isHovered ? '#cbd5e1' : '#0f172a'}
                      strokeWidth={isSelected ? "3" : "2"}
                      className="transition-all duration-150"
                    />
                  )}

                  {/* Internal Status Icon */}
                  {isCritical && (
                    <circle r="4" fill="#ffffff" className="animate-pulse" />
                  )}

                  {/* Node Name Label */}
                  <text
                    y="-16"
                    textAnchor="middle"
                    fontSize="11"
                    fontWeight="700"
                    className="font-mono pointer-events-none fill-slate-900 dark:fill-slate-100 drop-shadow-[0_1px_2px_rgba(255,255,255,0.9)] dark:drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]"
                  >
                    {node.name.split(' ')[0]}
                  </text>

                  {/* Sensor Reading Quick Tag on Map */}
                  <text
                    y="24"
                    textAnchor="middle"
                    fill={isCritical ? '#f87171' : isWarning ? '#fbbf24' : '#0284c7'}
                    fontSize="9"
                    fontWeight="600"
                    className="font-mono pointer-events-none drop-shadow-md"
                  >
                    {node.pressurePsi} PSI
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Suspected Leak Banner Notice */}
        {leakNode && (
          <div 
            onClick={(e) => e.stopPropagation()}
            className="absolute top-4 left-4 right-4 md:right-auto max-w-md px-3.5 py-2 rounded-xl bg-red-100/90 dark:bg-red-950/80 border border-red-300 dark:border-red-500/50 backdrop-blur-md text-red-900 dark:text-red-200 flex items-center justify-between gap-3 shadow-lg z-10 animate-pulse"
          >
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-600 dark:text-red-400 shrink-0" />
              <div className="text-xs">
                <span className="font-bold text-red-950 dark:text-white uppercase tracking-wider block">Suspected Leak Pinpointed</span>
                <span className="text-[11px] text-red-800 dark:text-red-300 font-mono">{leakNode.name} ({leakNode.zone})</span>
              </div>
            </div>
            <button
              onClick={() => focusLeakArea()}
              className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-red-600 hover:bg-red-500 text-white shrink-0 transition-colors"
            >
              Focus Zone
            </button>
          </div>
        )}

        {/* Selected Sensor Telemetry Card Inspector (Opens on node click, hides on close/outside click) */}
        {selectedNode && (
          <div 
            onClick={(e) => e.stopPropagation()}
            className="absolute bottom-4 left-4 right-4 md:right-auto md:w-84 p-4 rounded-2xl bg-white/95 dark:bg-slate-900/95 border border-slate-200 dark:border-slate-700/80 backdrop-blur-lg shadow-2xl text-slate-900 dark:text-slate-100 z-20 transition-all duration-200"
          >
            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="flex items-center gap-2">
                <span className={`w-3 h-3 rounded-full ${
                  selectedNode.status === 'CRITICAL' ? 'bg-red-500 animate-ping' :
                  selectedNode.status === 'WARNING' ? 'bg-amber-500' : 'bg-emerald-400'
                }`} />
                <div>
                  <h4 className="text-xs font-extrabold text-slate-900 dark:text-white leading-tight">{selectedNode.name}</h4>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[10px] text-cyan-600 dark:text-cyan-400 font-mono font-semibold">{selectedNode.zone}</span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">ID: {selectedNode.id}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className={`px-2 py-0.5 text-[10px] font-bold rounded border ${getNodeBadgeClass(selectedNode.status)}`}>
                  {selectedNode.status}
                </span>
                <button
                  onClick={() => setSelectedNode(null)}
                  className="p-1 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800 transition-colors"
                  title="Close panel"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Live Sensor Readings Grid */}
            <div className="grid grid-cols-2 gap-2 my-3 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-600 dark:text-cyan-400">
                  <Gauge className="w-3.5 h-3.5" />
                </div>
                <div>
                  <p className="text-[9px] text-slate-500 dark:text-slate-400 uppercase font-semibold">Live Pressure</p>
                  <p className="text-xs font-bold text-slate-900 dark:text-white font-mono">{selectedNode.pressurePsi} PSI</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  <Activity className="w-3.5 h-3.5" />
                </div>
                <div>
                  <p className="text-[9px] text-slate-500 dark:text-slate-400 uppercase font-semibold">Flow Rate</p>
                  <p className="text-xs font-bold text-slate-900 dark:text-white font-mono">{selectedNode.flowGpm} GPM</p>
                </div>
              </div>
            </div>

            {/* Critical Alert Details */}
            {selectedNode.status === 'CRITICAL' && (
              <div className="p-2.5 rounded-xl bg-red-500/15 border border-red-500/30 text-[11px] text-red-700 dark:text-red-200 mb-2">
                <div className="flex items-center gap-1.5 font-bold text-red-600 dark:text-red-400 mb-1">
                  <AlertTriangle className="w-3.5 h-3.5" /> AI Hydro-Acoustic Alert
                </div>
                <p className="text-[10px] text-red-700/90 dark:text-red-200/90 leading-tight">
                  High-frequency acoustic resonance at 340 Hz with -14.2 PSI pressure drop. Suspected pipe rupture.
                </p>
              </div>
            )}

            {/* Sensor Health Metadata */}
            <div className="flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-200 dark:border-slate-800 font-mono">
              <span className="flex items-center gap-1">
                <Radio className="w-3 h-3 text-emerald-600 dark:text-emerald-400" /> Battery: {selectedNode.batteryLevel || 95}%
              </span>
              <span>Last Sync: {selectedNode.lastPing || 'Just now'}</span>
            </div>
          </div>
        )}

        {/* GIS Operational Map Legend */}
        <div 
          onClick={(e) => e.stopPropagation()}
          className="absolute bottom-4 right-4 px-3 py-2 rounded-xl bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 backdrop-blur-md text-[11px] text-slate-700 dark:text-slate-300 flex flex-wrap items-center gap-3 shadow-lg z-10"
        >
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" /> Healthy / Normal
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400" /> Warning Node
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" /> Suspected Leak
          </span>
          <span className="flex items-center gap-1.5 text-slate-400 border-l border-slate-700 pl-3">
            <span className="w-3 h-0.5 bg-cyan-400" /> Pipeline Flow
          </span>
        </div>
      </div>
    </div>
  );
};
