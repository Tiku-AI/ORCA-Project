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
  Clock,
  Database,
  FileText,
  AlertCircle,
  ExternalLink
} from 'lucide-react';
import { AgentExecutionResult } from '../types/orca';

interface AgentCardsGridProps {
  agents: {
    planner: AgentExecutionResult;
    geospatial: AgentExecutionResult;
    satellite: AgentExecutionResult;
    ocean: AgentExecutionResult;
    weather: AgentExecutionResult;
    ecology: AgentExecutionResult;
    risk: AgentExecutionResult;
    coordinator: AgentExecutionResult;
  };
}

const AGENT_METADATA = [
  { key: 'planner', name: 'Planner Agent', icon: Brain, badge: 'purple', borderColor: 'border-purple-500/30' },
  { key: 'geospatial', name: 'Geospatial Agent', icon: Map, badge: 'blue', borderColor: 'border-blue-500/30' },
  { key: 'satellite', name: 'Satellite Agent', icon: Satellite, badge: 'cyan', borderColor: 'border-cyan-500/30' },
  { key: 'ocean', name: 'Ocean Agent', icon: Waves, badge: 'teal', borderColor: 'border-teal-500/30' },
  { key: 'weather', name: 'Weather Agent', icon: CloudSun, badge: 'amber', borderColor: 'border-amber-500/30' },
  { key: 'ecology', name: 'Ecology Agent', icon: Leaf, badge: 'emerald', borderColor: 'border-emerald-500/30' },
  { key: 'risk', name: 'Risk Agent', icon: ShieldAlert, badge: 'rose', borderColor: 'border-rose-500/30' },
  { key: 'coordinator', name: 'Coordinator Agent', icon: GitMerge, badge: 'indigo', borderColor: 'border-indigo-500/30' },
];

export const AgentCardsGrid: React.FC<AgentCardsGridProps> = ({ agents }) => {
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Database className="w-4 h-4 text-cyan-400" />
            Specialized Agent Inspection Dossiers (8 Agents)
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Internal reasoning logs, verified data sources, empirical findings, and scientific scope boundaries
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {AGENT_METADATA.map((meta) => {
          const agent = (agents as any)[meta.key] as AgentExecutionResult | undefined;
          if (!agent) return null;

          const Icon = meta.icon;

          return (
            <div
              key={meta.key}
              id={`agent-card-${meta.key}`}
              className={`bg-[#0D1527] border border-[#1E293B] hover:border-slate-600 rounded-2xl p-5 flex flex-col justify-between transition-all shadow-md shadow-black/20`}
            >
              <div className="space-y-3">
                {/* Agent Header */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-[#0A0F1D] border border-[#1E293B] text-cyan-400">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white">{agent.agentName}</h4>
                      <span className="text-[10px] text-slate-400 block leading-tight truncate max-w-[150px]">
                        {agent.agentRole}
                      </span>
                    </div>
                  </div>

                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold uppercase shrink-0 ${
                      agent.status === 'completed'
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                        : agent.status === 'partial'
                        ? 'bg-amber-950 text-amber-300 border border-amber-800'
                        : 'bg-slate-800 text-slate-400 border border-slate-700'
                    }`}
                  >
                    {agent.status}
                  </span>
                </div>

                {/* Summary */}
                <p className="text-xs text-slate-300 leading-relaxed bg-[#0A0F1D] p-3 rounded-xl border border-[#1E293B]">
                  {agent.summary}
                </p>

                {/* Findings List */}
                <div className="space-y-1.5">
                  <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 block font-mono">
                    Verified Findings:
                  </span>
                  <ul className="space-y-1">
                    {agent.findings.slice(0, 3).map((finding, idx) => (
                      <li key={idx} className="text-xs text-slate-300 flex items-start gap-1.5 leading-snug">
                        <span className="text-cyan-400 font-bold shrink-0">•</span>
                        <span>{finding}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Bottom Metadata */}
              <div className="mt-4 pt-3 border-t border-[#1E293B] text-xs text-slate-400 space-y-1 font-mono">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-400" />
                    {agent.executionTimeMs} ms
                  </span>
                  <span className="flex items-center gap-1 font-semibold text-cyan-400">
                    <FileText className="w-3 h-3" />
                    {agent.evidenceCount} Evidence Item{agent.evidenceCount !== 1 ? 's' : ''}
                  </span>
                </div>
                <div className="truncate text-slate-400 text-[10px]">
                  <b>Source:</b> {agent.dataSources.join(', ')}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
