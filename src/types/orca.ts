export interface RegionInfo {
  id: string;
  name: string;
  bbox: [number, number, number, number]; // [minLon, minLat, maxLon, maxLat]
  centroid: { lat: number; lon: number };
  description: string;
  marineDesignation?: string;
  ecologicalNotes: string;
}

export type DataMode = 'real_data' | 'partial_real_data' | 'prototype_demo';

export type AgentStatus = 'idle' | 'running' | 'completed' | 'partial' | 'unavailable';

export interface AgentExecutionResult {
  agentName: string;
  agentRole: string;
  status: AgentStatus;
  executionTimeMs: number;
  summary: string;
  findings: string[];
  evidenceCount: number;
  dataSources: string[];
  limitations?: string[];
  timestamp: string;
  rawPayload?: Record<string, any>;
}

export interface SatelliteObservationItem {
  id: string;
  platform: string;
  collection: string;
  sensor: string;
  acquisitionTime: string;
  bbox: [number, number, number, number];
  orbitDirection: string;
  polarization: string[];
  thumbnailUrl?: string;
  sourceUrl: string;
  assetsSummary: string[];
}

export interface OceanObservationData {
  seaSurfaceTemperature?: {
    value: number;
    unit: string;
    status: 'available' | 'unavailable';
    anomalyStatus?: 'normal' | 'elevated' | 'critical';
  };
  waveHeight?: {
    value: number;
    unit: string;
    status: 'available' | 'unavailable';
    condition?: 'calm' | 'moderate' | 'rough' | 'high';
  };
  wavePeriod?: {
    value: number;
    unit: string;
    status: 'available' | 'unavailable';
  };
  salinity?: {
    status: 'unavailable';
    reason: string;
  };
  source: string;
  timestamp: string;
  location: { lat: number; lon: number };
}

export interface EcologyObservationData {
  chlorophyllA: {
    status: 'unavailable' | 'available';
    value?: number;
    unit?: string;
    note: string;
  };
  coralReefVulnerability: {
    status: 'available' | 'unavailable';
    rating?: string;
    zoneName: string;
    ecologicalSignificance: string;
  };
  biodiversityIndicator: {
    status: 'available' | 'unavailable';
    summary: string;
  };
  source: string;
  timestamp: string;
  limitations: string[];
}

export interface WeatherObservationData {
  windSpeed: {
    value: number;
    unit: string;
    windDirectionDeg?: number;
    status: 'available' | 'unavailable';
  };
  windGusts?: {
    value: number;
    unit: string;
    status: 'available' | 'unavailable';
  };
  precipitation: {
    value: number;
    unit: string;
    status: 'available' | 'unavailable';
  };
  surfaceTemperature: {
    value: number;
    unit: string;
    status: 'available' | 'unavailable';
  };
  surfacePressure: {
    value: number;
    unit: string;
    status: 'available' | 'unavailable';
  };
  source: string;
  timestamp: string;
}

export interface EvidenceItem {
  id: string;
  agent: string;
  category: 'satellite' | 'ocean' | 'ecology' | 'weather' | 'geospatial' | 'risk';
  parameter: string;
  value: string;
  unit?: string;
  status: 'available' | 'unavailable' | 'partial';
  source: string;
  timestamp: string;
  confidence: number; // 0 - 100
  notes?: string;
}

export type RiskLevel = 'Low' | 'Moderate' | 'Elevated' | 'High';

export interface RiskFactor {
  name: string;
  contribution: number; // e.g., 0 to 100 scale impact
  weight: number;
  description: string;
  status: 'measured' | 'baseline' | 'unavailable';
}

export interface RiskAssessment {
  score: number; // 0 to 100
  level: RiskLevel;
  confidence: number; // 0 to 100%
  primaryStressors: string[];
  factors: RiskFactor[];
  summary: string;
  recommendations: string[];
  limitations: string[];
  disclaimer: string;
}

export interface AnalysisResponse {
  requestId: string;
  timestamp: string;
  question: string;
  region: RegionInfo;
  dataMode: DataMode;
  analysisPlan: {
    interpretation: string;
    requiredAgents: string[];
    steps: { agent: string; task: string }[];
  };
  risk: RiskAssessment;
  agents: {
    planner: AgentExecutionResult;
    geospatial: AgentExecutionResult;
    ocean: AgentExecutionResult;
    ecology: AgentExecutionResult;
    weather: AgentExecutionResult;
    satellite: AgentExecutionResult;
    risk: AgentExecutionResult;
    coordinator: AgentExecutionResult;
  };
  observations: {
    satellite: {
      items: SatelliteObservationItem[];
      totalFound: number;
      stacSource: string;
      status: string;
    };
    ocean: OceanObservationData;
    ecology: EcologyObservationData;
    weather: WeatherObservationData;
  };
  evidenceLedger: EvidenceItem[];
  limitations: string[];
  executiveSummary: string;
}
