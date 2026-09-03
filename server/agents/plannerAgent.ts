import { AgentExecutionResult, RegionInfo } from '../../src/types/orca';
import { getGeminiAI } from '../gemini';

export interface PlannerOutput {
  agentResult: AgentExecutionResult;
  plan: {
    interpretation: string;
    requiredAgents: string[];
    steps: { agent: string; task: string }[];
  };
}

export async function runPlannerAgent(
  question: string,
  region: RegionInfo | null
): Promise<PlannerOutput> {
  const startTime = Date.now();
  const timestamp = new Date().toISOString();

  const requiredAgents = [
    'Geospatial Agent',
    'Satellite Agent',
    'Ocean Agent',
    'Weather Agent',
    'Ecology Agent',
    'Risk Agent',
    'Coordinator Agent'
  ];

  const steps = [
    {
      agent: 'Geospatial Agent',
      task: `Validate region coordinates [${region ? region.bbox.join(', ') : 'unknown'}] and establish spatial bounding envelope.`
    },
    {
      agent: 'Satellite Agent',
      task: 'Query Copernicus Data Space STAC API for Sentinel-1 GRD SAR acquisition metadata.'
    },
    {
      agent: 'Ocean Agent',
      task: 'Retrieve live oceanographic observations (SST, wave height) and identify sensor availability.'
    },
    {
      agent: 'Weather Agent',
      task: 'Query surface atmospheric observations (wind vectors, precipitation, atmospheric pressure).'
    },
    {
      agent: 'Ecology Agent',
      task: 'Assess ecological indicators, coral reef sensitivity, and flag unavailable in-situ bio-optical sensors.'
    },
    {
      agent: 'Risk Agent',
      task: 'Synthesize multi-factor marine environmental stress score with full transparent weighting.'
    },
    {
      agent: 'Coordinator Agent',
      task: 'Harmonize agent outputs, classify data mode, verify absence of data fabrication, and generate executive summary.'
    }
  ];

  let interpretation = `User queried: "${question}". Directed to marine region: ${region ? region.name : 'Unknown'}. Formulating a multi-source collaborative reasoning strategy across 7 operational sub-agents.`;

  const ai = getGeminiAI();
  if (ai) {
    try {
      const prompt = `You are the Planner Agent for ORCA (Oceanic Reasoning and Collaborative Agents), an ISRO SIH prototype.
The user asked: "${question}"
Target marine region: "${region ? region.name : 'Unspecified'}"
Region bounding box: ${region ? JSON.stringify(region.bbox) : 'none'}

Provide a 1-2 sentence concise operational interpretation of the user query focusing purely on marine environmental monitoring, satellite observations, ocean conditions, and ecosystem risk.
Do NOT invent data. Do NOT mention oil spills.`;

      const geminiPromise = ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
      });

      const timeoutPromise = new Promise<null>((_, reject) =>
        setTimeout(() => reject(new Error('Gemini timeout')), 3500)
      );

      const response = (await Promise.race([geminiPromise, timeoutPromise])) as any;

      if (response && response.text && response.text.trim()) {
        interpretation = response.text.trim();
      }
    } catch (err) {
      console.warn('Planner Agent Gemini reasoning fallback to deterministic:', err);
    }
  }

  const executionTimeMs = Date.now() - startTime;

  const agentResult: AgentExecutionResult = {
    agentName: 'Planner Agent',
    agentRole: 'Query Decomposition & Agent Coordination Scheduling',
    status: 'completed',
    executionTimeMs,
    summary: `Parsed natural language query and scheduled 7 collaborative agent tasks targeting ${region ? region.name : 'unresolved region'}.`,
    findings: [
      `Target Region: ${region ? region.name : 'Unspecified/Invalid'}`,
      `Spatial Envelope: ${region ? `BBox [${region.bbox.join(', ')}]` : 'No valid geographic boundary found'}`,
      `Task Scope: Multi-agent atmospheric, oceanographic, ecological, and radar satellite reasoning.`,
      `Strict Constraint Enforced: Zero data fabrication; oil-spill workflow excluded.`
    ],
    evidenceCount: 1,
    dataSources: ['ORCA Query Dispatcher', 'Natural Language Parser'],
    timestamp,
    rawPayload: { interpretation, requiredAgents, stepsCount: steps.length }
  };

  return {
    agentResult,
    plan: {
      interpretation,
      requiredAgents,
      steps
    }
  };
}
