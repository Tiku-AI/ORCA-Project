import React from 'react';
import { ShieldAlert, AlertTriangle, CheckCircle, Info, Activity, ArrowUpRight, Thermometer, Waves, Wind } from 'lucide-react';
import { RiskAssessment } from '../types/orca';

interface RiskHeroProps {
  risk: RiskAssessment;
  regionName: string;
}

export const RiskHero: React.FC<RiskHeroProps> = ({ risk, regionName }) => {
  const getLevelBadge = (level: string) => {
    switch (level) {
      case 'High':
        return {
          bg: 'bg-rose-950/80 text-rose-300 border-rose-800/80',
          bar: 'bg-rose-500',
          pill: 'bg-rose-500',
          text: 'text-rose-400',
          desc: 'High environmental stress observed. Elevated sea surface temperatures or storm waves present.'
        };
      case 'Elevated':
        return {
          bg: 'bg-amber-950/80 text-amber-300 border-amber-800/80',
          bar: 'bg-amber-500',
          pill: 'bg-amber-500',
          text: 'text-amber-400',
          desc: 'Elevated stress observed. Approaching critical thresholds for marine coral or coastal agitation.'
        };
      case 'Moderate':
        return {
          bg: 'bg-yellow-950/80 text-yellow-300 border-yellow-800/80',
          bar: 'bg-yellow-500',
          pill: 'bg-yellow-500',
          text: 'text-yellow-400',
          desc: 'Moderate environmental conditions. Normal seasonal winds and waves, with stable ecological indicators.'
        };
      default:
        return {
          bg: 'bg-emerald-950/80 text-emerald-300 border-emerald-800/80',
          bar: 'bg-emerald-500',
          pill: 'bg-emerald-500',
          text: 'text-emerald-400',
          desc: 'Low environmental stress. Marine parameters are calm and well within benign historical baselines.'
        };
    }
  };

  const badgeStyle = getLevelBadge(risk.level);

  return (
    <div className="bg-[#0D1527] border border-[#1E293B] rounded-2xl p-5 sm:p-6 shadow-xl shadow-black/20 space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#1E293B] pb-4">
        <div>
          <span className="text-xs uppercase tracking-wider font-semibold text-cyan-400 flex items-center gap-1.5 font-mono">
            <Activity className="w-4 h-4 text-cyan-400" />
            Environmental Risk & Stress Synthesis
          </span>
          <h2 className="text-lg sm:text-xl font-bold text-white mt-1 tracking-tight">
            {regionName} Environmental Health Scorecard
          </h2>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-[11px] uppercase tracking-wider text-slate-400 block font-mono">Data Completeness</span>
            <span className="text-sm font-bold text-cyan-400 font-mono">{risk.confidence}% Verified</span>
          </div>
          <div className={`px-3.5 py-1.5 rounded-xl border font-bold text-xs sm:text-sm flex items-center gap-2 uppercase tracking-wide font-mono ${badgeStyle.bg}`}>
            <span className="w-2.5 h-2.5 rounded-full animate-pulse bg-current"></span>
            {risk.level} Stress
          </div>
        </div>
      </div>

      {/* Main Score & Breakdown Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Score Dial & Summary Box */}
        <div className="lg:col-span-5 bg-[#0A0F1D] border border-[#1E293B] rounded-xl p-5 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
                Environmental Stress Index (ESI)
              </span>
              <span className={`text-xs font-bold ${badgeStyle.text}`}>
                {risk.level} Level
              </span>
            </div>

            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight font-mono">
                {risk.score}
              </span>
              <span className="text-slate-400 font-mono text-sm">/ 100</span>
            </div>

            {/* Score Progress Bar */}
            <div className="w-full bg-[#1E293B] h-3 rounded-full overflow-hidden mb-3">
              <div
                className={`h-full transition-all duration-700 ${badgeStyle.bar}`}
                style={{ width: `${Math.min(100, Math.max(0, risk.score))}%` }}
              ></div>
            </div>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {risk.summary}
            </p>
          </div>

          {/* Primary Stressors */}
          {risk.primaryStressors.length > 0 && (
            <div className="pt-3 border-t border-[#1E293B]">
              <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-2">
                Primary Monitored Factors:
              </span>
              <ul className="space-y-1.5">
                {risk.primaryStressors.map((stressor, idx) => (
                  <li key={idx} className="text-xs text-slate-300 flex items-start gap-2">
                    <span className="text-cyan-400 font-bold">•</span>
                    <span>{stressor}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Factors Breakdown */}
        <div className="lg:col-span-7 flex flex-col justify-between space-y-4">
          <div>
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3 flex items-center justify-between">
              <span>Transparent Stress Factor Breakdown</span>
              <span className="text-slate-400 font-normal text-[11px]">Normalized (0 - 100)</span>
            </h3>

            <div className="space-y-3">
              {risk.factors.map((factor, idx) => (
                <div key={idx} className="bg-[#0A0F1D] border border-[#1E293B] rounded-xl p-3.5 space-y-2">
                  <div className="flex items-center justify-between text-xs sm:text-sm">
                    <span className="font-semibold text-white">{factor.name}</span>
                    <div className="flex items-center gap-3 font-mono">
                      <span className="text-slate-400 text-xs">Weight: {Math.round(factor.weight * 100)}%</span>
                      <span className="font-bold text-white text-xs sm:text-sm">{factor.contribution} / 100</span>
                    </div>
                  </div>

                  <div className="w-full bg-[#1E293B] h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-500 ${
                        factor.contribution > 65
                          ? 'bg-rose-500'
                          : factor.contribution > 40
                          ? 'bg-amber-500'
                          : 'bg-emerald-500'
                      }`}
                      style={{ width: `${Math.min(100, Math.max(0, factor.contribution))}%` }}
                    ></div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-400 pt-0.5">
                    <span className="truncate max-w-md">{factor.description}</span>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-semibold uppercase ${
                      factor.status === 'measured' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800/40' :
                      factor.status === 'baseline' ? 'bg-blue-950 text-blue-300 border border-blue-800/40' :
                      'bg-slate-800 text-slate-400'
                    }`}>
                      {factor.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Actionable Recommendations */}
          {risk.recommendations.length > 0 && (
            <div className="bg-[#0A0F1D] border border-cyan-900/40 rounded-xl p-4">
              <span className="text-xs font-bold text-cyan-300 uppercase tracking-wider block mb-2 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-cyan-400" />
                Actionable Recommendations:
              </span>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-slate-300">
                {risk.recommendations.map((rec, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <ArrowUpRight className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

        </div>

      </div>

      {/* Scientific Integrity / Disclaimer */}
      <div className="pt-3 border-t border-[#1E293B] flex items-start gap-2 text-xs text-slate-400">
        <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
        <p>
          <strong className="text-slate-300 font-semibold">Scientific Integrity Notice:</strong> {risk.disclaimer}
        </p>
      </div>

    </div>
  );
};
