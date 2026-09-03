import {
  AnalysisResponse,
  EvidenceItem,
  RegionInfo
} from '../../src/types/orca';
import { runCoordinatorAgent } from '../agents/coordinatorAgent';
import { runEcologyAgent } from '../agents/ecologyAgent';
import { runGeospatialAgent } from '../agents/geospatialAgent';
import { runOceanAgent } from '../agents/oceanAgent';
import { runPlannerAgent } from '../agents/plannerAgent';
import { runRiskAgent } from '../agents/riskAgent';
import { runSatelliteAgent } from '../agents/satelliteAgent';
import { runWeatherAgent } from '../agents/weatherAgent';
import { findRegion, SUPPORTED_REGIONS } from '../data/regions';

// In-memory cache of past analyses for GET /api/v1/evidence/:id
const evidenceStore = new Map<string, EvidenceItem[]>();
const analysisStore = new Map<string, AnalysisResponse>();

export async function executeOrcaAnalysis(
  question: string,
  regionKeyOrQuery?: string
): Promise<AnalysisResponse> {
  const requestId = `ORCA-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  const timestamp = new Date().toISOString();

  // 1. Resolve Region
  const resolvedRegion: RegionInfo | null = findRegion(regionKeyOrQuery);

  // 2. Planner Agent
  const plannerOutput = await runPlannerAgent(question, resolvedRegion);

  // 3. Geospatial Agent
  const geospatialOutput = await runGeospatialAgent(resolvedRegion);

  // Default region fallback if null
  const regionToAnalyze: RegionInfo = resolvedRegion || SUPPORTED_REGIONS['gulf-of-mannar'];

  // 4. Concurrent execution of Environmental Sensing Agents
  const [satelliteOutput, oceanOutput, weatherOutput, ecologyOutput] = await Promise.all([
    runSatelliteAgent(regionToAnalyze),
    runOceanAgent(regionToAnalyze),
    runWeatherAgent(regionToAnalyze),
    runEcologyAgent(regionToAnalyze)
  ]);

  // 5. Risk Agent
  const riskOutput = await runRiskAgent(
    regionToAnalyze,
    oceanOutput.observations,
    weatherOutput.observations,
    ecologyOutput.observations,
    satelliteOutput.observations.totalFound
  );

  // 6. Coordinator Agent
  const subAgentResults = [
    plannerOutput.agentResult,
    geospatialOutput.agentResult,
    satelliteOutput.agentResult,
    oceanOutput.agentResult,
    weatherOutput.agentResult,
    ecologyOutput.agentResult,
    riskOutput.agentResult
  ];

  const coordinatorOutput = await runCoordinatorAgent(
    question,
    regionToAnalyze,
    satelliteOutput.observations.items,
    oceanOutput.observations,
    weatherOutput.observations,
    ecologyOutput.observations,
    riskOutput.risk,
    subAgentResults
  );

  // 7. Aggregate complete evidence ledger
  const evidenceLedger: EvidenceItem[] = [
    ...geospatialOutput.evidence,
    ...satelliteOutput.evidence,
    ...oceanOutput.evidence,
    ...weatherOutput.evidence,
    ...ecologyOutput.evidence,
    ...riskOutput.evidence
  ];

  // Build full response
  const response: AnalysisResponse = {
    requestId,
    timestamp,
    question,
    region: regionToAnalyze,
    dataMode: coordinatorOutput.dataMode,
    analysisPlan: plannerOutput.plan,
    risk: riskOutput.risk,
    agents: {
      planner: plannerOutput.agentResult,
      geospatial: geospatialOutput.agentResult,
      ocean: oceanOutput.agentResult,
      ecology: ecologyOutput.agentResult,
      weather: weatherOutput.agentResult,
      satellite: satelliteOutput.agentResult,
      risk: riskOutput.agentResult,
      coordinator: coordinatorOutput.agentResult
    },
    observations: {
      satellite: satelliteOutput.observations,
      ocean: oceanOutput.observations,
      ecology: ecologyOutput.observations,
      weather: weatherOutput.observations
    },
    evidenceLedger,
    limitations: coordinatorOutput.allLimitations,
    executiveSummary: coordinatorOutput.executiveSummary
  };

  // Cache in stores
  evidenceStore.set(requestId, evidenceLedger);
  analysisStore.set(requestId, response);

  return response;
}

export function getEvidenceByRequestId(requestId: string): EvidenceItem[] | null {
  return evidenceStore.get(requestId) || null;
}

export function getAnalysisByRequestId(requestId: string): AnalysisResponse | null {
  return analysisStore.get(requestId) || null;
}
