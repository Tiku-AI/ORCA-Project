import React, { useState } from 'react';
import { GitMerge, Sparkles, ShieldCheck, Check, Copy, MessageSquareText, ChevronDown, ChevronUp } from 'lucide-react';

interface ExecutiveSummaryProps {
  summary: string;
  plan: {
    interpretation: string;
    requiredAgents: string[];
    steps: { agent: string; task: string }[];
  };
  limitations: string[];
  userQuestion?: string;
}

export const ExecutiveSummary: React.FC<ExecutiveSummaryProps> = ({
  summary,
  plan,
  limitations,
  userQuestion
}) => {
  const [copied, setCopied] = useState(false);
  const [showPlanDetails, setShowPlanDetails] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-[#0D1527] border border-[#1E293B] rounded-2xl p-5 sm:p-6 shadow-xl shadow-black/20 space-y-5">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#1E293B] pb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400">
            <MessageSquareText className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white tracking-tight">
              Coordinator Synthesis & Direct Answer
            </h3>
            <p className="text-xs text-slate-400">
              Plain-language explanation synthesized by the Coordinator Agent from all 8 domains
            </p>
          </div>
        </div>

        <button
          onClick={handleCopy}
          className="self-start sm:self-auto text-xs font-medium flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#0A0F1D] hover:bg-[#1E293B] text-slate-200 border border-[#1E293B] hover:border-slate-600 cursor-pointer transition-all active:scale-95"
          title="Copy response to clipboard"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 text-emerald-400" />
              <span className="text-emerald-400 font-semibold">Copied to Clipboard</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4 text-slate-400" />
              <span>Copy Assessment</span>
            </>
          )}
        </button>
      </div>

      {/* User's Prompt echo */}
      {userQuestion && (
        <div className="bg-[#0A0F1D] border-l-4 border-cyan-500 rounded-r-xl p-3.5 text-xs">
          <span className="text-slate-400 block uppercase tracking-wider font-semibold text-[10px] mb-0.5">
            Your Question:
          </span>
          <span className="text-slate-100 font-medium text-sm">"{userQuestion}"</span>
        </div>
      )}

      {/* Structured Executive Summary in Breathable Layout */}
      <div className="bg-[#0A0F1D] border border-[#1E293B] rounded-xl p-5 sm:p-6 shadow-inner">
        <div className="text-sm sm:text-base text-slate-200 leading-relaxed space-y-3 font-normal">
          {summary.split('\n\n').map((paragraph, idx) => (
            <p key={idx} className="leading-relaxed">
              {paragraph}
            </p>
          ))}
        </div>
      </div>

      {/* Multi-Agent Execution Plan (Expandable for clean aesthetics) */}
      <div className="bg-[#0A0F1D] border border-purple-900/30 rounded-xl overflow-hidden transition-all">
        <button
          onClick={() => setShowPlanDetails(!showPlanDetails)}
          className="w-full p-4 flex items-center justify-between text-left hover:bg-purple-950/20 transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <div>
              <h4 className="text-xs font-bold text-purple-200 uppercase tracking-wider">
                Planner Agent Collaborative Strategy ({plan.steps.length} Steps)
              </h4>
              <p className="text-xs text-slate-400 italic">
                "{plan.interpretation}"
              </p>
            </div>
          </div>
          <div className="text-slate-400 flex items-center gap-1 text-xs">
            <span>{showPlanDetails ? 'Hide Steps' : 'View Steps'}</span>
            {showPlanDetails ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </div>
        </button>

        {showPlanDetails && (
          <div className="p-4 pt-0 border-t border-[#1E293B] space-y-2.5 mt-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
              {plan.steps.map((step, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-2.5 bg-[#0D1527] p-3 rounded-xl border border-[#1E293B] text-xs"
                >
                  <span className="font-mono font-bold text-purple-400 shrink-0 text-sm">
                    0{idx + 1}.
                  </span>
                  <div>
                    <strong className="text-slate-100 block font-semibold">{step.agent}</strong>
                    <span className="text-slate-400">{step.task}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Scientific Safeguards Notice */}
      <div className="bg-[#0A0F1D] border border-[#1E293B] rounded-xl p-4 flex items-start gap-3 text-xs text-slate-400">
        <ShieldCheck className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-bold text-slate-200 block uppercase tracking-wider text-[11px]">
            Scientific Integrity & No-Hallucination Scope:
          </span>
          <ul className="space-y-1 list-disc list-inside text-slate-400">
            {limitations.map((lim, idx) => (
              <li key={idx}>{lim}</li>
            ))}
            <li>Zero oil-spill or synthetic anomalies generated; all findings trace to empirical data.</li>
          </ul>
        </div>
      </div>

    </div>
  );
};
