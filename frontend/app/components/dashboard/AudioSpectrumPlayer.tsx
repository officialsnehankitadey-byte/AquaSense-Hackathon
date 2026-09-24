'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Activity, 
  Radio, 
  X, 
  Sparkles, 
  AlertTriangle, 
  CheckCircle2, 
  RotateCcw,
  Zap
} from 'lucide-react';
import { Incident } from '../../types/dashboard';

interface AudioSpectrumPlayerProps {
  incident: Incident | null;
  onClose: () => void;
}

export const AudioSpectrumPlayer: React.FC<AudioSpectrumPlayerProps> = ({
  incident,
  onClose,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [fftBars, setFftBars] = useState<number[]>([]);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscRef = useRef<OscillatorNode | null>(null);
  const gainRef = useRef<GainNode | null>(null);
  const animFrameRef = useRef<number | null>(null);

  const duration = 15; // 15 seconds sample recording duration
  const targetFreq = incident?.acousticFreq || 340; // Peak leak frequency (e.g. 340Hz)

  // Initialize FFT spectrum frequency bars (32 bands from 50Hz to 1000Hz)
  useEffect(() => {
    const barsCount = 28;
    const initialBars = Array.from({ length: barsCount }, (_, i) => {
      const centerFreq = 50 + i * 32;
      const isPeakBand = Math.abs(centerFreq - targetFreq) < 50;
      return isPeakBand ? Math.random() * 30 + 70 : Math.random() * 25 + 10;
    });
    setFftBars(initialBars);
  }, [targetFreq]);

  // Handle Web Audio API synthetic acoustic sound generation
  const startAudio = () => {
    try {
      if (!audioCtxRef.current) {
        const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        audioCtxRef.current = new AudioContextClass();
      }

      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      // Main hydrophone tone oscillator
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(targetFreq, ctx.currentTime);

      gain.gain.setValueAtTime(isMuted ? 0 : volume * 0.15, ctx.currentTime);
      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      oscRef.current = osc;
      gainRef.current = gain;
      setIsPlaying(true);
    } catch (e) {
      console.warn('Web Audio API initialized in visual mode:', e);
      setIsPlaying(true);
    }
  };

  const stopAudio = () => {
    if (oscRef.current) {
      try {
        oscRef.current.stop();
        oscRef.current.disconnect();
      } catch (e) {
        // Ignored
      }
      oscRef.current = null;
    }
    setIsPlaying(false);
  };

  const togglePlay = () => {
    if (isPlaying) {
      stopAudio();
    } else {
      startAudio();
    }
  };

  // Animate FFT Spectrum bars while playing
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= duration) {
            stopAudio();
            return 0;
          }
          return prev + 0.1;
        });

        // Mutate FFT bars with realistic hydro-acoustic noise variation
        setFftBars((prev) =>
          prev.map((val, i) => {
            const centerFreq = 50 + i * 32;
            const isPeakBand = Math.abs(centerFreq - targetFreq) < 50;
            const baseLevel = isPeakBand ? 75 : 15;
            const randomNoise = (Math.random() - 0.5) * 20;
            return Math.min(100, Math.max(5, baseLevel + randomNoise));
          })
        );
      }, 100);
    }
    return () => {
      clearInterval(interval);
    };
  }, [isPlaying, targetFreq]);

  // Sync Gain volume
  useEffect(() => {
    if (gainRef.current && audioCtxRef.current) {
      gainRef.current.gain.setValueAtTime(isMuted ? 0 : volume * 0.15, audioCtxRef.current.currentTime);
    }
  }, [volume, isMuted]);

  useEffect(() => {
    return () => {
      stopAudio();
      if (audioCtxRef.current) {
        audioCtxRef.current.close();
      }
    };
  }, []);

  if (!incident) return null;

  const formatTime = (time: number) => {
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl text-slate-100 shadow-2xl overflow-hidden relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="p-4 md:p-5 border-b border-slate-800 bg-slate-950/80 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <Radio className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-extrabold text-white tracking-tight">
                  Hydro-Acoustic Audio Spectrum Player
                </h3>
                <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-red-500/20 text-red-400 border border-red-500/30 font-mono">
                  FFT ANALYZER
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Target Sensor: <span className="text-cyan-400 font-mono font-semibold">{incident.code}</span> ({incident.location})
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Main Content */}
        <div className="p-5 md:p-6 space-y-6">
          {/* Signal Information & Frequency Metrics Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Peak Frequency</span>
              <span className="text-sm font-extrabold text-cyan-400 font-mono mt-0.5 block">
                {incident.acousticFreq || 340} Hz
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Signal Confidence</span>
              <span className="text-sm font-extrabold text-emerald-400 font-mono mt-0.5 block">
                {incident.confidence}%
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Pressure Drop</span>
              <span className="text-sm font-extrabold text-red-400 font-mono mt-0.5 block">
                -{incident.pressureDropPsi} PSI
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Acoustic Signal/Noise</span>
              <span className="text-sm font-extrabold text-amber-400 font-mono mt-0.5 block">
                18.4 dB SNR
              </span>
            </div>
          </div>

          {/* Real-time Visualizer FFT Bar Chart Canvas */}
          <div className="relative p-5 rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden flex flex-col justify-end h-52">
            {/* Peak Frequency Overlay Marker */}
            <div className="absolute top-3 left-4 right-4 flex items-center justify-between text-[11px] font-mono text-slate-400 border-b border-slate-800/80 pb-2 z-10">
              <span className="flex items-center gap-1.5 text-cyan-400 font-bold">
                <Activity className="w-3.5 h-3.5" /> 100Hz – 800Hz Spectrum
              </span>
              <span className="px-2 py-0.5 rounded bg-red-500/20 text-red-400 border border-red-500/30 text-[10px] font-bold">
                Leak Signature Resonance: {targetFreq} Hz
              </span>
            </div>

            {/* Equalizer Bars Container */}
            <div className="flex items-end justify-between gap-1.5 h-32 pt-4 px-2">
              {fftBars.map((height, idx) => {
                const centerFreq = 50 + idx * 32;
                const isPeak = Math.abs(centerFreq - targetFreq) < 50;

                return (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-1 group relative">
                    {/* Hover Tooltip */}
                    <div className="absolute -top-7 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-800 text-white text-[9px] font-mono px-1.5 py-0.5 rounded pointer-events-none z-20">
                      {centerFreq}Hz
                    </div>
                    {/* Bar Line */}
                    <div className="w-full bg-slate-800/80 rounded-t-sm h-full flex items-end overflow-hidden">
                      <div
                        className={`w-full transition-all duration-100 rounded-t-sm ${
                          isPeak 
                            ? 'bg-gradient-to-t from-red-600 via-amber-500 to-yellow-300 animate-pulse' 
                            : 'bg-gradient-to-t from-cyan-600 to-blue-400'
                        }`}
                        style={{ height: `${height}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Frequency Axis Labels */}
            <div className="flex justify-between text-[9px] font-mono text-slate-500 pt-2 border-t border-slate-800/60 mt-2">
              <span>50 Hz</span>
              <span>250 Hz</span>
              <span className="text-red-400 font-bold">{targetFreq} Hz (PEAK)</span>
              <span>600 Hz</span>
              <span>900 Hz</span>
            </div>
          </div>

          {/* Audio Playback Controls & Scrubber */}
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-3">
            {/* Timeline Scrubber */}
            <div className="space-y-1">
              <div className="relative w-full h-2 bg-slate-800 rounded-full overflow-hidden cursor-pointer">
                <div 
                  className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full transition-all"
                  style={{ width: `${(currentTime / duration) * 100}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] font-mono text-slate-400 font-semibold">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            {/* Playback Buttons & Volume Controls */}
            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center gap-2">
                <button
                  onClick={togglePlay}
                  className="p-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold transition-all shadow-lg shadow-cyan-500/20 flex items-center gap-2 text-xs"
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
                  <span>{isPlaying ? 'Pause Sample' : 'Play Hydro-Audio'}</span>
                </button>

                <button
                  onClick={() => {
                    setCurrentTime(0);
                    if (!isPlaying) startAudio();
                  }}
                  className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                  title="Restart sample"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>

              {/* Volume Slider */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className="text-slate-400 hover:text-white p-1.5"
                >
                  {isMuted || volume === 0 ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-cyan-400" />}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={isMuted ? 0 : volume}
                  onChange={(e) => {
                    setVolume(parseFloat(e.target.value));
                    setIsMuted(false);
                  }}
                  className="w-20 accent-cyan-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
