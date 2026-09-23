'use client';

import React, { useState } from 'react';
import { 
  Menu, 
  Search, 
  Moon, 
  Sun, 
  Bell, 
  Filter, 
  RefreshCw, 
  Radio,
  SlidersHorizontal
} from 'lucide-react';
import { DMAZone } from '../../types/dashboard';

interface HeaderProps {
  onMenuClick: () => void;
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  selectedZone: string;
  setSelectedZone: (zone: string) => void;
  dmaZones: DMAZone[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onRefresh: () => void;
  isRefreshing: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  onMenuClick,
  darkMode,
  setDarkMode,
  selectedZone,
  setSelectedZone,
  dmaZones,
  searchQuery,
  setSearchQuery,
  onRefresh,
  isRefreshing,
}) => {
  const [isLiveStream, setIsLiveStream] = useState(true);
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(3);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  const [notifications, setNotifications] = useState([
    {
      id: '1',
      title: 'Critical Burst Leak Detected',
      desc: 'DMA-02 Main Feeder • Est. 185 GPM loss',
      time: '2 mins ago',
      type: 'critical',
      read: false,
    },
    {
      id: '2',
      title: 'PRV Pressure Drop Warning',
      desc: 'Valve V-03 setpoint deviated -12.4 PSI',
      time: '14 mins ago',
      type: 'warning',
      read: false,
    },
    {
      id: '3',
      title: 'Hydrophone Calibration Sync',
      desc: 'Sensor NS-108 completed self-test',
      time: '1 hour ago',
      type: 'info',
      read: false,
    },
  ]);

  // Close notifications dropdown when clicking outside or pressing Escape
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowNotifications(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    setUnreadCount(0);
  };

  return (
    <header className="sticky top-0 z-30 h-16 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors duration-200">
      <div className="h-full px-4 md:px-6 flex items-center justify-between gap-4">
        {/* Left Side: Mobile Menu Button & Search */}
        <div className="flex items-center gap-3 flex-1 max-w-xl">
          <button
            type="button"
            onClick={onMenuClick}
            className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 lg:hidden"
            aria-label="Open Navigation Menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search leak IDs, DMA zones, valves, sensors..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs md:text-sm rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all"
            />
          </div>
        </div>

        {/* Right Side: Filters, Telemetry Badge, Theme & Profile */}
        <div className="flex items-center gap-2 md:gap-3">
          {/* DMA Zone Filter Dropdown */}
          <div className="hidden sm:flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 rounded-xl px-2.5 py-1.5">
            <Filter className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
            <select
              value={selectedZone}
              onChange={(e) => setSelectedZone(e.target.value)}
              className="bg-transparent text-xs font-medium text-slate-700 dark:text-slate-200 focus:outline-none cursor-pointer pr-1"
            >
              {dmaZones.map((zone) => (
                <option key={zone.id} value={zone.id} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">
                  {zone.name}
                </option>
              ))}
            </select>
          </div>

          {/* Live Stream Telemetry Toggle Button */}
          <button
            type="button"
            onClick={() => setIsLiveStream(!isLiveStream)}
            className={`hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
              isLiveStream
                ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20'
                : 'bg-amber-500/10 border-amber-500/20 text-amber-600 dark:text-amber-400 hover:bg-amber-500/20'
            }`}
            title={isLiveStream ? 'Live Stream Active (Click to Pause)' : 'Live Stream Paused (Click to Resume)'}
          >
            <Radio className={`w-3.5 h-3.5 ${isLiveStream ? 'animate-pulse text-emerald-500' : 'text-amber-500'}`} />
            <span>{isLiveStream ? 'Live Stream' : 'Stream Paused'}</span>
          </button>

          {/* Refresh Data Button */}
          <button
            type="button"
            onClick={onRefresh}
            disabled={isRefreshing}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700/60 transition-all cursor-pointer"
            title="Refresh Telemetry Data"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-cyan-500' : ''}`} />
          </button>

          {/* Notification Button & Popover */}
          <div className="relative" ref={dropdownRef}>
            <button 
              type="button"
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700/60 transition-all cursor-pointer relative"
              title="System Alerts & Notifications"
              aria-label="System Alerts & Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <>
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 animate-ping" />
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500" />
                </>
              )}
            </button>

            {/* Notification Popover Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl z-50 overflow-hidden text-xs transition-all">
                <div className="p-3.5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-950/60">
                  <div className="flex items-center gap-2">
                    <Bell className="w-4 h-4 text-cyan-500" />
                    <span className="font-bold text-slate-900 dark:text-white">System Alerts</span>
                    {unreadCount > 0 && (
                      <span className="px-1.5 py-0.5 rounded-full bg-red-500/15 text-red-600 dark:text-red-400 font-extrabold text-[10px]">
                        {unreadCount} new
                      </span>
                    )}
                  </div>
                  {unreadCount > 0 && (
                    <button
                      type="button"
                      onClick={handleMarkAllRead}
                      className="text-[11px] font-semibold text-cyan-600 dark:text-cyan-400 hover:underline cursor-pointer"
                    >
                      Mark all as read
                    </button>
                  )}
                </div>

                <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60">
                  {notifications.map((item) => (
                    <div 
                      key={item.id} 
                      className={`p-3 transition-colors ${item.read ? 'opacity-70 bg-transparent' : 'bg-cyan-500/5 dark:bg-cyan-500/10'}`}
                    >
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <span className={`font-bold ${
                          item.type === 'critical' ? 'text-red-500' : item.type === 'warning' ? 'text-amber-500' : 'text-cyan-500'
                        }`}>
                          {item.title}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono whitespace-nowrap">{item.time}</span>
                      </div>
                      <p className="text-slate-600 dark:text-slate-300 text-[11px]">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Dark/Light Mode Toggle */}
          <button
            type="button"
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700/60 transition-all cursor-pointer"
            title={darkMode ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
            aria-label={darkMode ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
          >
            {darkMode ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-slate-700" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
