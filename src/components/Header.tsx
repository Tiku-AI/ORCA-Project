import React from 'react';
import { Shield, Radio, Satellite, AlertCircle, Compass, Waves, GitMerge, FileCheck } from 'lucide-react';
import { DataMode } from '../types/orca';

export type PageId = 'assessment' | 'telemetry' | 'agents';

interface HeaderProps {
  dataMode?: DataMode;
  isHealthy?: boolean;
  currentPage: PageId;
  onPageChange: (page: PageId) => void;
}

export const Header: React.FC<HeaderProps> = ({
  dataMode = 'partial_real_data',
  isHealthy = true,
  currentPage,
  onPageChange
}) => {
  return (
    <header className="border-b border-[#1E293B] bg-[#0A0F1D]/95 backdrop-blur-md sticky top-0 z-40 shadow-lg shadow-black/20">
      
      {/* Top Branding Row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          
          {/* Brand & Organization Title */}
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-teal-400 p-0.5 shadow-md shadow-cyan-900/30 flex items-center justify-center shrink-0">
              <div className="h-full w-full bg-[#0A0F1D] rounded-[10px] flex items-center justify-center">
                <Satellite className="w-5 h-5 text-cyan-400" />
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2.5">
                <span className="font-extrabold text-lg sm:text-xl tracking-tight text-white">
                  ORCA
                </span>
                <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-md font-bold bg-cyan-950/80 border border-cyan-800/60 text-cyan-300">
                  ISRO SIH26176
                </span>
                <span className="hidden sm:inline-flex items-center gap-1.5 text-[11px] font-mono px-2.5 py-0.5 rounded-md bg-emerald-950/70 border border-emerald-800/50 text-emerald-300">
                  <Radio className="w-3 h-3 animate-pulse text-emerald-400" />
                  {isHealthy ? 'LIVE SENSORS' : 'OFFLINE'}
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium">
                Oceanic Reasoning & Collaborative Agents • Marine Environmental Intelligence
              </p>
            </div>
          </div>

          {/* Right Status Badges */}
          <div className="flex items-center gap-2.5 self-start md:self-auto font-mono text-xs">
            {/* Data Mode Pill */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border bg-[#0D1527] border-[#1E293B]">
              <span className="text-slate-400 text-[11px] uppercase">Data:</span>
              {dataMode === 'real_data' && (
                <span className="text-emerald-400 flex items-center gap-1.5 font-bold">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                  real_data
                </span>
              )}
              {dataMode === 'partial_real_data' && (
                <span className="text-amber-400 flex items-center gap-1.5 font-bold">
                  <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                  partial_real_data
                </span>
              )}
              {dataMode === 'prototype_demo' && (
                <span className="text-blue-400 flex items-center gap-1.5 font-bold">
                  <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                  prototype_demo
                </span>
              )}
            </div>

            <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0D1527] border border-[#1E293B] text-slate-300">
              <Shield className="w-3.5 h-3.5 text-cyan-400" />
              <span>8 Agents Active</span>
            </div>
          </div>

        </div>
      </div>

      {/* Primary Page Navigation Tabs */}
      <div className="border-t border-[#1E293B]/70 bg-[#0D1527]/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 overflow-x-auto py-2 no-scrollbar" aria-label="Tabs">
            
            {/* Tab 1: Ocean Assessment */}
            <button
              onClick={() => onPageChange('assessment')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap cursor-pointer ${
                currentPage === 'assessment'
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20 font-bold'
                  : 'text-slate-300 hover:text-white hover:bg-[#1E293B]/60'
              }`}
            >
              <Compass className="w-4 h-4" />
              <span>Page 1: Ocean Assessment & Map</span>
            </button>

            {/* Tab 2: Sensors & Telemetry */}
            <button
              onClick={() => onPageChange('telemetry')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap cursor-pointer ${
                currentPage === 'telemetry'
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20 font-bold'
                  : 'text-slate-300 hover:text-white hover:bg-[#1E293B]/60'
              }`}
            >
              <Waves className="w-4 h-4" />
              <span>Page 2: Live Sensors & Telemetry</span>
            </button>

            {/* Tab 3: Multi-Agent Intelligence */}
            <button
              onClick={() => onPageChange('agents')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap cursor-pointer ${
                currentPage === 'agents'
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20 font-bold'
                  : 'text-slate-300 hover:text-white hover:bg-[#1E293B]/60'
              }`}
            >
              <GitMerge className="w-4 h-4" />
              <span>Page 3: Multi-Agent Team & Evidence Audit</span>
            </button>

          </nav>
        </div>
      </div>

    </header>
  );
};
