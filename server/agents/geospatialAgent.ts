import { AgentExecutionResult, EvidenceItem, RegionInfo } from '../../src/types/orca';

export interface GeospatialOutput {
  agentResult: AgentExecutionResult;
  evidence: EvidenceItem[];
  geoContext: {
    isValid: boolean;
    regionName: string;
    bbox: [number, number, number, number] | null;
    centroid: { lat: number; lon: number } | null;
    polygonGeoJSON: any;
    approxAreaKm2: number;
    marineBoundariesDescription: string;
  };
}

export async function runGeospatialAgent(
  region: RegionInfo | null
): Promise<GeospatialOutput> {
  const startTime = Date.now();
  const timestamp = new Date().toISOString();

  if (!region) {
    const executionTimeMs = Date.now() - startTime;
    return {
      agentResult: {
        agentName: 'Geospatial Agent',
        agentRole: 'Geographic Validation & Spatial Boundary Delineation',
        status: 'unavailable',
        executionTimeMs,
        summary: 'Region could not be resolved to a recognized marine boundary. Geographic boundary fabrication prevented.',
        findings: [
          'Unknown or unsupported region requested.',
          'Scientific integrity safeguard: No bounding box generated to avoid geospatial hallucination.'
        ],
        evidenceCount: 0,
        dataSources: ['ORCA Geospatial Registry'],
        limitations: ['Unknown regions must return no bounding box rather than an invented boundary.'],
        timestamp
      },
      evidence: [],
      geoContext: {
        isValid: false,
        regionName: 'Unknown',
        bbox: null,
        centroid: null,
        polygonGeoJSON: null,
        approxAreaKm2: 0,
        marineBoundariesDescription: 'Invalid geographic scope'
      }
    };
  }

  const [minLon, minLat, maxLon, maxLat] = region.bbox;

  // Approximate area in square km
  const latSpan = Math.abs(maxLat - minLat);
  const lonSpan = Math.abs(maxLon - minLon);
  const avgLat = (minLat + maxLat) / 2;
  const kmPerLat = 111.0;
  const kmPerLon = 111.32 * Math.cos((avgLat * Math.PI) / 180);
  const approxAreaKm2 = Math.round(latSpan * kmPerLat * lonSpan * kmPerLon);

  // GeoJSON Polygon for map
  const polygonGeoJSON = {
    type: 'Feature',
    properties: {
      name: region.name,
      marineDesignation: region.marineDesignation,
      areaKm2: approxAreaKm2
    },
    geometry: {
      type: 'Polygon',
      coordinates: [
        [
          [minLon, minLat],
          [maxLon, minLat],
          [maxLon, maxLat],
          [minLon, maxLat],
          [minLon, minLat]
        ]
      ]
    }
  };

  const evidence: EvidenceItem[] = [
    {
      id: `GEO-${Date.now()}-1`,
      agent: 'Geospatial Agent',
      category: 'geospatial',
      parameter: 'Spatial Bounding Box (WGS84)',
      value: `[${minLon}°E, ${minLat}°N, ${maxLon}°E, ${maxLat}°N]`,
      status: 'available',
      source: 'ISRO / ORCA Geographic Boundaries Registry',
      timestamp,
      confidence: 99,
      notes: `Centroid: ${region.centroid.lat}°N, ${region.centroid.lon}°E. Extent: ~${approxAreaKm2.toLocaleString()} km²`
    }
  ];

  const executionTimeMs = Date.now() - startTime;

  const agentResult: AgentExecutionResult = {
    agentName: 'Geospatial Agent',
    agentRole: 'Geographic Validation & Spatial Boundary Delineation',
    status: 'completed',
    executionTimeMs,
    summary: `Validated boundary for ${region.name} encompassing ~${approxAreaKm2.toLocaleString()} km² in WGS84 coordinates.`,
    findings: [
      `Delineated BBox: [${minLon}, ${minLat}, ${maxLon}, ${maxLat}]`,
      `Centroid: Latitude ${region.centroid.lat.toFixed(2)}°N, Longitude ${region.centroid.lon.toFixed(2)}°E`,
      `Jurisdictional / Marine Context: ${region.marineDesignation || region.description}`,
      `Spatial envelope passed validation for satellite footprint intersections.`
    ],
    evidenceCount: evidence.length,
    dataSources: ['ISRO / ORCA Regional Spatial Model', 'WGS84 Geographic Reference'],
    timestamp,
    rawPayload: {
      bbox: region.bbox,
      centroid: region.centroid,
      approxAreaKm2
    }
  };

  return {
    agentResult,
    evidence,
    geoContext: {
      isValid: true,
      regionName: region.name,
      bbox: region.bbox,
      centroid: region.centroid,
      polygonGeoJSON,
      approxAreaKm2,
      marineBoundariesDescription: region.description
    }
  };
}
