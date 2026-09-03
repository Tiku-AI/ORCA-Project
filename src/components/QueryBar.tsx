import React from 'react';
import { Search, Loader2, Sparkles, MapPin, Compass, HelpCircle, ArrowRight } from 'lucide-react';
import { RegionInfo } from '../types/orca';

interface QueryBarProps {
  question: string;
  setQuestion: (q: string) => void;
  selectedRegion: string;
  setSelectedRegion: (r: string) => void;
  supportedRegions: RegionInfo[];
  onAnalyze: () => void;
  isLoading: boolean;
}

interface PresetTopic {
  label: string;
  icon: string;
  query: string;
  description: string;
}

const PRESET_TOPICS: PresetTopic[] = [
  {
    label: 'Coral Reef & Temperature Stress',
    icon: '🌡️',
    query: 'Assess the environmental condition of the Gulf of Mannar.',
    description: 'Checks sea surface temperatures against coral bleaching thermal thresholds.'
  },
  {
    label: 'Wave Heights & Marine Weather',
    icon: '🌊',
    query: 'What environmental factors indicate stress in this region?',
    description: 'Evaluates significant wave heights, wind shear, and monsoon agitation.'
  },
  {
    label: 'Copernicus Satellite Radar Passes',
    icon: '🛰️',
    query: 'Are satellite observations available for this region?',
    description: 'Queries Sentinel-1 SAR acquisition footprints and ground coverage.'
  },
  {
    label: 'Scientific Integrity & Sensor Audit',
    icon: '🛡️',
    query: 'Explain the confidence and limitations of this assessment.',
    description: 'Explains verified sensors vs unmeasured variables (like offline salinity).'
  }
];

export const QueryBar: React.FC<QueryBarProps> = ({
  question,
  setQuestion,
  selectedRegion,
  setSelectedRegion,
  supportedRegions,
  onAnalyze,
  isLoading
}) => {
  const currentRegion = supportedRegions.find(r => r.id === selectedRegion);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoading && question.trim()) {
      onAnalyze();
    }
  };

  const handleSelectPreset = (presetQuery: string) => {
    setQuestion(presetQuery);
    // Note: onAnalyze will be called when user clicks button or we can call it directly
  };

  return (
    <div className="bg-[#0D1527] border border-[#1E293B] rounded-2xl p-5 sm:p-6 shadow-xl shadow-black/30 space-y-5">
      
      {/* Friendly Guide / Instructions for the User */}
      <div className="bg-[#0A0F1D] border border-[#1E293B] rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-300">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 shrink-0 mt-0.5">
            <HelpCircle className="w-4 h-4" />
          </div>
          <div>
            <span className="font-bold text-white text-sm block">How to use ORCA in 2 simple steps:</span>
            <p className="text-slate-400 text-xs mt-0.5">
              1. Choose a target marine region &nbsp;•&nbsp; 2. Pick a suggested environmental query or write your own &nbsp;•&nbsp; Click <b>"Analyze Ocean"</b> to get a synthesized answer backed by satellite radar and marine buoys.
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        
        {/* Step 1 & Step 2 Row */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          
          {/* STEP 1: Region Selection */}
          <div className="lg:col-span-4 flex flex-col justify-between space-y-2">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="w-5 h-5 rounded-full bg-cyan-500 text-slate-950 font-bold text-xs flex items-center justify-center">
                  1
                </span>
                <label htmlFor="region-select" className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                  Select Ocean Region
                </label>
              </div>

              <div className="relative">
                <select
                  id="region-select"
                  value={selectedRegion}
                  onChange={(e) => setSelectedRegion(e.target.value)}
                  disabled={isLoading}
                  className="w-full bg-[#0A0F1D] border border-[#1E293B] hover:border-slate-700 text-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all font-medium appearance-none cursor-pointer pr-10"
                >
                  {supportedRegions.map(r => (
                    <option key={r.id} value={r.id} className="bg-[#0D1527] text-slate-200">
                      {r.name} {r.id === 'gulf-of-mannar' ? '★ Primary ISRO Demo' : ''}
                    </option>
                  ))}
                </select>
                <Compass className="w-4 h-4 text-slate-400 absolute right-3.5 top-3.5 pointer-events-none" />
              </div>
            </div>

            {/* Region Details Pill */}
            {currentRegion && (
              <div className="bg-[#0A0F1D] border border-[#1E293B] rounded-xl p-3 text-xs text-slate-400 space-y-1">
                <div className="font-semibold text-slate-200 truncate">
                  {currentRegion.marineDesignation || currentRegion.name}
                </div>
                <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                  {currentRegion.description}
                </p>
                <div className="font-mono text-[10px] text-cyan-400/90 pt-1 border-t border-[#1E293B]">
                  Centroid: {currentRegion.centroid.lat}°N, {currentRegion.centroid.lon}°E
                </div>
              </div>
            )}
          </div>

          {/* STEP 2: Question & Action Button */}
          <div className="lg:col-span-8 flex flex-col justify-between space-y-2">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="w-5 h-5 rounded-full bg-cyan-500 text-slate-950 font-bold text-xs flex items-center justify-center">
                  2
                </span>
                <label htmlFor="question-input" className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  Your Environmental Question
                </label>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <input
                    id="question-input"
                    type="text"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    placeholder="e.g. Assess the environmental condition of the Gulf of Mannar..."
                    disabled={isLoading}
                    className="w-full bg-[#0A0F1D] border border-[#1E293B] text-slate-100 placeholder-slate-500 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all font-medium"
                  />
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                </div>

                <button
                  id="submit-analysis-btn"
                  type="submit"
                  disabled={isLoading || !question.trim()}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-sm bg-gradient-to-r from-cyan-500 to-teal-400 hover:from-cyan-400 hover:to-teal-300 text-slate-950 shadow-lg shadow-cyan-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all shrink-0 cursor-pointer active:scale-95"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Analyzing Ocean...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Analyze Ocean</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Helper text explaining what this does */}
            <p className="text-xs text-slate-400 flex items-center gap-1.5">
              <span>💡 You can ask anything about water temperatures, wave hazards, coral reef bleaching, or satellite coverage.</span>
            </p>
          </div>

        </div>

        {/* Quick Question Presets (Categorized & Easy to Click) */}
        <div className="pt-2 border-t border-[#1E293B]">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2.5">
            Or choose a suggested assessment topic:
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
            {PRESET_TOPICS.map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectPreset(preset.query)}
                disabled={isLoading}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  question === preset.query
                    ? 'bg-cyan-950/40 border-cyan-500/60 ring-1 ring-cyan-500/40'
                    : 'bg-[#0A0F1D] hover:bg-[#1E293B]/70 border-[#1E293B] text-slate-300'
                }`}
              >
                <div>
                  <div className="flex items-center gap-2 font-semibold text-xs text-white mb-1">
                    <span>{preset.icon}</span>
                    <span>{preset.label}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 line-clamp-2">
                    {preset.description}
                  </p>
                </div>
                <div className="mt-2 text-[10px] text-cyan-400 font-medium flex items-center gap-1">
                  <span>Load question</span>
                  <ArrowRight className="w-3 h-3" />
                </div>
              </button>
            ))}
          </div>
        </div>

      </form>
    </div>
  );
};
