import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { SUPPORTED_REGIONS } from './server/data/regions';
import { executeOrcaAnalysis, getAnalysisByRequestId, getEvidenceByRequestId } from './server/services/analysisService';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Request logging
  app.use((req, res, next) => {
    if (req.path.startsWith('/api') || req.path === '/health') {
      console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
    }
    next();
  });

  // GET /health - Backend health check
  app.get('/health', (req, res) => {
    res.json({
      status: 'healthy',
      service: 'ORCA — Oceanic Reasoning and Collaborative Agents',
      sihProblemStatement: 'SIH26176',
      organization: 'ISRO',
      agentsCount: 8,
      timestamp: new Date().toISOString()
    });
  });

  // GET /api/v1/service-info
  app.get('/api/v1/service-info', (req, res) => {
    res.json({
      name: 'ORCA — Oceanic Reasoning and Collaborative Agents',
      problemStatement: 'SIH26176 — ORCA: Marine EcOsystem Reasoning with Collaborative Agents',
      organization: 'ISRO',
      supportedRegions: Object.keys(SUPPORTED_REGIONS),
      agents: [
        'Planner Agent',
        'Ocean Agent',
        'Ecology Agent',
        'Weather Agent',
        'Satellite Agent',
        'Geospatial Agent',
        'Risk Agent',
        'Coordinator Agent'
      ],
      dataSources: {
        satellite: 'Copernicus Data Space STAC API (Sentinel-1 GRD SAR)',
        ocean: 'Open-Meteo Marine / Copernicus Marine baseline',
        weather: 'Open-Meteo Atmospheric Forecast API',
        ecology: 'UNESCO World Heritage Marine / INCOIS Baseline'
      }
    });
  });

  // GET /api/v1/regions - Return supported marine regions
  app.get('/api/v1/regions', (req, res) => {
    res.json({
      regions: Object.values(SUPPORTED_REGIONS)
    });
  });

  // POST /api/v1/analyze - Multi-agent collaborative analysis
  app.post('/api/v1/analyze', async (req, res) => {
    try {
      const { question, region } = req.body || {};
      const userQuestion = question && typeof question === 'string' && question.trim()
        ? question.trim()
        : 'Assess the environmental condition of the Gulf of Mannar.';
      const targetRegion = region && typeof region === 'string' ? region.trim() : 'gulf-of-mannar';

      const result = await executeOrcaAnalysis(userQuestion, targetRegion);
      res.json(result);
    } catch (err: any) {
      console.error('Error during ORCA analysis:', err);
      res.status(500).json({
        error: 'Analysis processing failed',
        message: err.message || 'Internal agent execution error'
      });
    }
  });

  // GET /api/v1/evidence/:request_id - Return evidence associated with an analysis
  app.get('/api/v1/evidence/:request_id', (req, res) => {
    const requestId = req.params.request_id;
    const evidence = getEvidenceByRequestId(requestId);
    if (!evidence) {
      return res.status(404).json({
        error: 'Evidence record not found',
        requestId
      });
    }
    res.json({
      requestId,
      count: evidence.length,
      evidence
    });
  });

  // GET /api/v1/analysis/:request_id - Retrieve full cached run
  app.get('/api/v1/analysis/:request_id', (req, res) => {
    const requestId = req.params.request_id;
    const analysis = getAnalysisByRequestId(requestId);
    if (!analysis) {
      return res.status(404).json({
        error: 'Analysis not found',
        requestId
      });
    }
    res.json(analysis);
  });

  // Vite middleware setup
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`ORCA Backend Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Fatal startup error:', err);
  process.exit(1);
});
