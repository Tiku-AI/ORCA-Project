import React, { useState, useEffect } from 'react';
import { Header, PageId } from './components/Header';
import { QueryBar } from './components/QueryBar';
import { AgentTimeline } from './components/AgentTimeline';
import { RiskHero } from './components/RiskHero';
import { InteractiveMap } from './components/InteractiveMap';
import { ObservationsPanel } from './components/ObservationsPanel';
import { AgentCardsGrid } from './components/AgentCardsGrid';
import { EvidenceLedger } from './components/EvidenceLedger';
import { ExecutiveSummary } from './components/ExecutiveSummary';
import { AnalysisResponse, RegionInfo } from './types/orca';
import {
  Loader2,
  AlertTriangle,
  RefreshCw,
  Satellite,
  Radio,
  Compass,
  Waves,
  GitMerge,
  ArrowRight,
  ShieldCheck,
  Activity,
  Thermometer,
  Wind
} from 'lucide-react';

const DEFAULT_REGIONS: RegionInfo[] = [
  {
    id: 'gulf-of-mannar',
    name: 'Gulf of Mannar',
    bbox: [78.5, 8.5, 80.5, 10.5],
    centroid: { lat: 9.2, lon: 79.2 },
    description: 'Shallow marine gulf between southeastern India and western Sri Lanka, known for its Biosphere Reserve and sensitive coral reefs.',
    marineDesignation: 'Gulf of Mannar Biosphere Reserve (UNESCO)',
    ecologicalNotes: 'Features 21 pristine islands, fringing coral reefs, seagrass beds, and endangered Dugong dugon.'
  },
  {
    id: 'arabian-sea',
    name: 'Arabian Sea',
    bbox: [66.0, 10.0, 72.0, 22.0],
    centroid: { lat: 16.0, lon: 69.0 },
    description: 'Northern Indian Ocean basin bounded by India and the Arabian Peninsula, characterized by seasonal monsoon reversals.',
    marineDesignation: 'Major Marine Ecosystem — Arabian Sea Basin',
    ecologicalNotes: 'Subject to seasonal upwelling, oxygen minimum zones (OMZ), and high pelagic productivity.'
  },
  {
    id: 'bay-of-bengal',
    name: 'Bay of Bengal',
    bbox: [80.0, 8.0, 94.0, 22.0],
    centroid: { lat: 15.0, lon: 87.0 },
    description: 'World’s largest water bay, strongly influenced by freshwater river discharge and tropical cyclone tracks.',
    marineDesignation: 'Bay of Bengal Large Marine Ecosystem (BOBLME)',
    ecologicalNotes: 'Strong salinity stratification with low sea surface salinity near deltaic discharges.'
  },
  {
    id: 'indian-ocean',
    name: 'Indian Ocean',
    bbox: [40.0, -5.0, 100.0, 25.0],
    centroid: { lat: 10.0, lon: 70.0 },
    description: 'Third-largest oceanic division driving the global Indian Ocean Dipole (IOD) climate pattern.',
    marineDesignation: 'Northern Indian Ocean Equatorial Sector',
    ecologicalNotes: 'Vast open waters with thermal ridges and critical cetacean corridors.'
  }
];

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageId>('assessment');
  const [question, setQuestion] = useState('Assess the environmental condition of the Gulf of Mannar.');
  const [selectedRegion, setSelectedRegion] = useState('gulf-of-mannar');
  const [supportedRegions, setSupportedRegions] = useState<RegionInfo[]>(DEFAULT_REGIONS);
  const [analysis, setAnalysis] = useState<AnalysisResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isHealthy, setIsHealthy] = useState(true);

  // Initial load: Fetch regions & trigger default assessment for Gulf of Mannar
  useEffect(() => {
    fetch('/api/v1/regions')
      .then(res => res.json())
      .then(data => {
        if (data && Array.isArray(data.regions) && data.regions.length > 0) {
          setSupportedRegions(data.regions);
        }
      })
      .catch(() => {
        // Fallback to local default regions
      });

    fetch('/health')
      .then(res => res.json())
      .then(d => {
        if (d.status === 'healthy') setIsHealthy(true);
      })
      .catch(() => setIsHealthy(false));

    // Run initial analysis for the primary demonstration region
    handleAnalyze('Assess the environmental condition of the Gulf of Mannar.', 'gulf-of-mannar');
  }, []);

  const handleAnalyze = async (overrideQ?: string, overrideR?: string) => {
    const q = overrideQ || question;
    const r = overrideR || selectedRegion;

    if (!q.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/v1/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: q, region: r })
      });

      if (!res.ok) {
        throw new Error(`Server returned HTTP ${res.status}: ${res.statusText}`);
      }

      const data: AnalysisResponse = await res.json();
      setAnalysis(data);
    } catch (err: any) {
      console.error('Analysis error:', err);
      setError(err.message || 'Failed to communicate with multi-agent orchestration service.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0F1D] text-slate-200 flex flex-col font-sans selection:bg-cyan-500 selection:text-slate-950 tech-grid-pattern">
      
      {/* Navigation & Header with Page Tabs */}
      <Header
        dataMode={analysis?.dataMode}
        isHealthy={isHealthy}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* Error Alert */}
        {error && (
          <div className="bg-rose-950/70 border border-rose-800/80 text-rose-200 p-4 rounded-xl flex items-center justify-between gap-3 text-sm shadow-lg">
            <div className="flex items-center gap-2.5">
              <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />
              <span>{error}</span>
            </div>
            <button
              onClick={() => handleAnalyze()}
              className="px-3.5 py-1.5 bg-rose-900 hover:bg-rose-800 text-white rounded-lg font-semibold flex items-center gap-1.5 cursor-pointer transition-all text-xs"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Retry Analysis
            </button>
          </div>
        )}

        {/* ========================================================================= */}
        {/* PAGE 1: OCEAN ASSESSMENT & MAP */}
        {/* ========================================================================= */}
        {currentPage === 'assessment' && (
          <div className="space-y-6">
            
            {/* Step-by-Step Guided Query Bar */}
            <QueryBar
              question={question}
              setQuestion={setQuestion}
              selectedRegion={selectedRegion}
              setSelectedRegion={setSelectedRegion}
              supportedRegions={supportedRegions}
              onAnalyze={() => handleAnalyze()}
              isLoading={isLoading}
            />

            {/* Active Analysis Loading Indicator */}
            {isLoading && (
              <div className="bg-[#0D1527] border border-cyan-500/40 rounded-2xl p-8 text-center space-y-3 shadow-xl">
                <Loader2 className="w-8 h-8 text-cyan-400 animate-spin mx-auto" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Analyzing Marine Observations & Satellite Radar...
                </h3>
                <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
                  The Planner Agent is dispatching Satellite, Ocean, Weather, and Ecology agents to synthesize findings for {selectedRegion}.
                </p>
              </div>
            )}

            {/* Analysis Results View */}
            {analysis && !isLoading && (
              <div className="space-y-6">
                
                {/* 1. Quick Metrics At A Glance */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="bg-[#0D1527] border border-[#1E293B] rounded-2xl p-4 space-y-1">
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide flex items-center gap-1.5">
                      <Thermometer className="w-4 h-4 text-rose-400" />
                      Water Temp
                    </span>
                    <div className="flex items-baseline gap-1 font-mono">
                      <span className="text-2xl font-bold text-white">
                        {analysis.observations.ocean.seaSurfaceTemperature?.value ?? 'N/A'}
                      </span>
                      <span className="text-xs text-slate-400">°C</span>
                    </div>
                    <span className="text-[11px] text-emerald-400 block font-medium">
                      {analysis.observations.ocean.seaSurfaceTemperature?.anomalyStatus === 'normal' ? 'Normal Baseline' : 'Elevated Anomaly'}
                    </span>
                  </div>

                  <div className="bg-[#0D1527] border border-[#1E293B] rounded-2xl p-4 space-y-1">
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide flex items-center gap-1.5">
                      <Waves className="w-4 h-4 text-teal-400" />
                      Wave Height (Hs)
                    </span>
                    <div className="flex items-baseline gap-1 font-mono">
                      <span className="text-2xl font-bold text-white">
                        {analysis.observations.ocean.waveHeight?.value ?? 'N/A'}
                      </span>
                      <span className="text-xs text-slate-400">m</span>
                    </div>
                    <span className="text-[11px] text-teal-400 block font-medium capitalize">
                      {analysis.observations.ocean.waveHeight?.condition || 'Moderate Sea'}
                    </span>
                  </div>

                  <div className="bg-[#0D1527] border border-[#1E293B] rounded-2xl p-4 space-y-1">
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide flex items-center gap-1.5">
                      <Wind className="w-4 h-4 text-cyan-400" />
                      Wind Velocity
                    </span>
                    <div className="flex items-baseline gap-1 font-mono">
                      <span className="text-2xl font-bold text-white">
                        {analysis.observations.weather.windSpeed.value}
                      </span>
                      <span className="text-xs text-slate-400">km/h</span>
                    </div>
                    <span className="text-[11px] text-cyan-400 block font-mono">
                      {Math.round((analysis.observations.weather.windSpeed.value / 1.852) * 10) / 10} knots
                    </span>
                  </div>

                  <div className="bg-[#0D1527] border border-[#1E293B] rounded-2xl p-4 space-y-1">
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide flex items-center gap-1.5">
                      <Activity className="w-4 h-4 text-amber-400" />
                      Stress Score
                    </span>
                    <div className="flex items-baseline gap-1 font-mono">
                      <span className="text-2xl font-bold text-white">
                        {analysis.risk.score}
                      </span>
                      <span className="text-xs text-slate-400">/ 100</span>
                    </div>
                    <span className="text-[11px] text-amber-400 block font-medium">
                      {analysis.risk.level} Environmental Stress
                    </span>
                  </div>
                </div>

                {/* 2. Executive Summary / Plain-Language Direct Answer */}
                <ExecutiveSummary
                  summary={analysis.executiveSummary}
                  plan={analysis.analysisPlan}
                  limitations={analysis.limitations}
                  userQuestion={question}
                />

                {/* 3. Spacious Interactive Map (Watermark-free, with Basemap Switcher) */}
                <InteractiveMap
                  region={analysis.region}
                  satelliteItems={analysis.observations.satellite.items}
                  oceanSST={analysis.observations.ocean.seaSurfaceTemperature?.value}
                  waveHeight={analysis.observations.ocean.waveHeight?.value}
                  windSpeed={analysis.observations.weather.windSpeed?.value}
                />

                {/* 4. Environmental Health & Risk Scorecard */}
                <RiskHero risk={analysis.risk} regionName={analysis.region.name} />

                {/* Next Steps / Explore Other Pages Navigation Card */}
                <div className="bg-[#0D1527] border border-[#1E293B] rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div>
                    <h4 className="text-sm font-bold text-white">
                      Want to inspect the raw sensor feeds or agent audit trails?
                    </h4>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Explore detailed radar scenes, marine weather, or the 8 collaborative agents' verification logs.
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setCurrentPage('telemetry')}
                      className="px-4 py-2.5 rounded-xl bg-[#0A0F1D] hover:bg-[#1E293B] border border-[#1E293B] text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition-all cursor-pointer flex items-center gap-1.5"
                    >
                      <Waves className="w-3.5 h-3.5" />
                      <span>Page 2: Live Sensors</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setCurrentPage('agents')}
                      className="px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-md shadow-cyan-500/20"
                    >
                      <GitMerge className="w-3.5 h-3.5" />
                      <span>Page 3: Agent Audit</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* PAGE 2: LIVE SENSORS & TELEMETRY */}
        {/* ========================================================================= */}
        {currentPage === 'telemetry' && (
          <div className="space-y-6">
            
            {/* Header intro card */}
            <div className="bg-[#0D1527] border border-[#1E293B] rounded-2xl p-6 shadow-xl space-y-2">
              <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono font-bold uppercase">
                <Satellite className="w-4 h-4" />
                <span>Page 2: Marine Environmental Sensor Feeds</span>
              </div>
              <h2 className="text-xl font-extrabold text-white">
                Empirical Telemetry & Satellite Swaths ({analysis?.region.name || 'Selected Region'})
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
                ORCA ingests radar observations from the Copernicus Data Space STAC catalog (Sentinel-1 Synthetic Aperture Radar), real-time physical ocean conditions (Sea Surface Temperature & Wave Heights), and marine meteorology. Per the ISRO Zero-Fabrication integrity guideline, offline or unmeasured parameters (such as salinity) are explicitly reported as unavailable.
              </p>
            </div>

            {/* Observations Panel */}
            {analysis && (
              <ObservationsPanel
                satellite={analysis.observations.satellite}
                ocean={analysis.observations.ocean}
                weather={analysis.observations.weather}
                ecology={analysis.observations.ecology}
              />
            )}

            {/* Spatial Context Map for Telemetry */}
            {analysis && (
              <InteractiveMap
                region={analysis.region}
                satelliteItems={analysis.observations.satellite.items}
                oceanSST={analysis.observations.ocean.seaSurfaceTemperature?.value}
                waveHeight={analysis.observations.ocean.waveHeight?.value}
                windSpeed={analysis.observations.weather.windSpeed?.value}
              />
            )}

          </div>
        )}

        {/* ========================================================================= */}
        {/* PAGE 3: MULTI-AGENT TEAM & EVIDENCE AUDIT */}
        {/* ========================================================================= */}
        {currentPage === 'agents' && (
          <div className="space-y-6">
            
            {/* Header intro card */}
            <div className="bg-[#0D1527] border border-[#1E293B] rounded-2xl p-6 shadow-xl space-y-2">
              <div className="flex items-center gap-2 text-purple-400 text-xs font-mono font-bold uppercase">
                <GitMerge className="w-4 h-4" />
                <span>Page 3: Multi-Agent Architecture & Verification</span>
              </div>
              <h2 className="text-xl font-extrabold text-white">
                Collaborative 8-Agent Orchestration & Grounded Evidence Ledger
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
                Every conclusion generated by ORCA is produced by a modular, cooperative agent pipeline. Below you can inspect each agent's execution latency, specific verification findings, verified data sources, and the full immutable Evidence Ledger with confidence scores.
              </p>
            </div>

            {/* Orchestration Pipeline */}
            <AgentTimeline agents={analysis?.agents} isLoading={isLoading} />

            {/* Specialized 8 Agent Dossiers */}
            {analysis && <AgentCardsGrid agents={analysis.agents} />}

            {/* Grounded Evidence Ledger Table */}
            {analysis && (
              <EvidenceLedger
                evidence={analysis.evidenceLedger}
                requestId={analysis.requestId}
              />
            )}

          </div>
        )}

      </main>

      {/* Spacious Footer */}
      <footer className="border-t border-[#1E293B] bg-[#080D1A] py-6 mt-12 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <span className="font-bold text-white text-sm">ORCA</span>
            <span className="text-slate-600">•</span>
            <span className="font-mono text-cyan-400">ISRO SIH26176</span>
            <span className="text-slate-600">•</span>
            <span>Oceanic Reasoning & Collaborative Agents</span>
          </div>
          <p className="text-xs text-slate-400 font-mono text-center md:text-right">
            Real Copernicus Sentinel-1 STAC • Open-Meteo Marine • Zero Data Fabrication
          </p>
        </div>
      </footer>

    </div>
  );
}
