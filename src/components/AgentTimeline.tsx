import React from 'react';
import {
  Brain,
  Map,
  Satellite,
  Waves,
  CloudSun,
  Leaf,
  ShieldAlert,
  GitMerge,
  CheckCircle2,
  Clock,
  AlertTriangle
} from 'lucide-react';
import { AgentExecutionResult } from '../types/orca';

interface AgentTimelineProps {
  agents?: {
    planner?: AgentExecutionResult;
    geospatial?: AgentExecutionResult;
    satellite?: AgentExecutionResult;
    ocean?: AgentExecutionResult;
    weather?: AgentExecutionResult;
    ecology?: AgentExecutionResult;
    risk?: AgentExecutionResult;
    coordinator?: AgentExecutionResult;
  };
  isLoading: boolean;
}

const AGENT_CONFIGS = [
  { key: 'planner', name: 'Planner Agent', icon: Brain, color: 'text-purple-400', border: 'border-purple-500/30', bg: 'bg-purple-950/20' },
  { key: 'geospatial', name: 'Geospatial Agent', icon: Map, color: 'text-blue-400', border: 'border-blue-500/30', bg: 'bg-blue-950/20' },
  { key: 'satellite', name: 'Satellite Agent', icon: Satellite, color: 'text-cyan-400', border: 'border-cyan-500/30', bg: 'bg-cyan-950/20' },
  { key: 'ocean', name: 'Ocean Agent', icon: Waves, color: 'text-teal-400', border: 'border-teal-500/30', bg: 'bg-teal-950/20' },
  { key: 'weather', name: 'Weather Agent', icon: CloudSun, color: 'text-amber-400', border: 'border-amber-500/30', bg: 'bg-amber-950/20' },
  { key: 'ecology', name: 'Ecology Agent', icon: Leaf, color: 'text-emerald-400', border: 'border-emerald-500/30', bg: 'bg-emerald-950/20' },
  { key: 'risk', name: 'Risk Agent', icon: ShieldAlert, color: 'text-rose-400', border: 'border-rose-500/30', bg: 'bg-rose-950/20' },
  { key: 'coordinator', name: 'Coordinator Agent', icon: GitMerge, color: 'text-indigo-400', border: 'border-indigo-500/30', bg: 'bg-indigo-950/20' },
];

export const AgentTimeline: React.FC<AgentTimelineProps> = ({ agents, isLoading }) => {
  return (
    <div className="bg-[#0D1527] border border-[#1E293B] rounded-xl p-3 shadow-md shadow-black/20">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2.5">
        <h3 className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
          <GitMerge className="w-3.5 h-3.5 text-cyan-400" />
          Collaborative Agent Orchestration Pipeline (8 Specialized Agents)
        </h3>
        <span className="text-[10px] font-mono text-slate-400">
          Zero Oil-Spill Scope • Scientific Integrity Standard
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
        {AGENT_CONFIGS.map((cfg, index) => {
          const agentData = agents ? (agents as any)[cfg.key] : null;
          const Icon = cfg.icon;
          const isComplete = agentData?.status === 'completed';
          const isPartial = agentData?.status === 'partial';
          const isUnavailable = agentData?.status === 'unavailable';

          return (
            <div
              key={cfg.key}
              id={`agent-timeline-step-${index + 1}`}
              className={`rounded-lg p-2 border transition-all relative overflow-hidden ${
                agentData ? `bg-[#0A0F1D] ${cfg.border}` : 'bg-[#0A0F1D] border-[#1E293B]'
              }`}
            >
              {/* Top Step & Status */}
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-mono font-bold text-slate-400">
                  0{index + 1}
                </span>
                {isLoading ? (
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping"></span>
                ) : isComplete ? (
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                ) : isPartial ? (
                  <span className="flex items-center text-[9px] text-amber-400 font-semibold gap-0.5">
                    <AlertTriangle className="w-2.5 h-2.5" />
                    Partial
                  </span>
                ) : isUnavailable ? (
                  <span className="text-[9px] font-mono text-slate-400">N/A</span>
                ) : (
                  <Clock className="w-3 h-3 text-slate-400" />
                )}
              </div>

              {/* Agent Icon & Name */}
              <div className="flex items-center gap-1.5 mb-1">
                <Icon className={`w-3.5 h-3.5 ${cfg.color}`} />
                <span className="text-[11px] font-bold text-slate-200 truncate">
                  {cfg.name.replace(' Agent', '')}
                </span>
              </div>

              {/* Runtime & Evidence Count */}
              <div className="text-[10px] font-mono text-slate-400 flex items-center justify-between">
                <span>{agentData?.executionTimeMs ? `${agentData.executionTimeMs}ms` : 'Ready'}</span>
                {agentData && (
                  <span className="text-cyan-400 font-medium">
                    {agentData.evidenceCount} ev
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
