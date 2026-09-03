import { RegionInfo } from '../../src/types/orca';

export const SUPPORTED_REGIONS: Record<string, RegionInfo> = {
  'gulf-of-mannar': {
    id: 'gulf-of-mannar',
    name: 'Gulf of Mannar',
    bbox: [78.5, 8.5, 80.5, 10.5],
    centroid: { lat: 9.2, lon: 79.2 },
    description: 'Shallow marine gulf between southeastern India and western Sri Lanka, known for its Biosphere Reserve and sensitive coral reefs.',
    marineDesignation: 'Gulf of Mannar Biosphere Reserve (UNESCO)',
    ecologicalNotes: 'Features 21 pristine islands, fringing coral reefs, seagrass beds, and endangered marine species like the dugong (Dugong dugon).'
  },
  'arabian-sea': {
    id: 'arabian-sea',
    name: 'Arabian Sea',
    bbox: [66.0, 10.0, 72.0, 22.0],
    centroid: { lat: 16.0, lon: 69.0 },
    description: 'Northern Indian Ocean basin bounded by India, Pakistan, Iran, and the Arabian Peninsula, characterized by seasonal monsoon reversals.',
    marineDesignation: 'Major Marine Ecosystem — Arabian Sea Basin',
    ecologicalNotes: 'Subject to intense seasonal upwelling, oxygen minimum zones (OMZ), and high pelagic productivity during the southwest monsoon.'
  },
  'bay-of-bengal': {
    id: 'bay-of-bengal',
    name: 'Bay of Bengal',
    bbox: [80.0, 8.0, 94.0, 22.0],
    centroid: { lat: 15.0, lon: 87.0 },
    description: 'World’s largest water bay, strongly influenced by massive freshwater river discharge (Ganges-Brahmaputra) and tropical cyclone tracks.',
    marineDesignation: 'Bay of Bengal Large Marine Ecosystem (BOBLME)',
    ecologicalNotes: 'Strong salinity stratification with low sea surface salinity near the delta, high cyclone vulnerability, and mangrove-estuarine interfaces.'
  },
  'indian-ocean': {
    id: 'indian-ocean',
    name: 'Indian Ocean',
    bbox: [40.0, -5.0, 100.0, 25.0],
    centroid: { lat: 10.0, lon: 70.0 },
    description: 'Third-largest of the world’s oceanic divisions, driving the global Indian Ocean Dipole (IOD) climate phenomenon.',
    marineDesignation: 'Northern Indian Ocean Equatorial Sector',
    ecologicalNotes: 'Vast oligotrophic open waters interspersed with thermal ridges, critical migratory cetacean corridors, and equatorial undercurrents.'
  }
};

export function findRegion(queryOrId?: string): RegionInfo | null {
  if (!queryOrId) return SUPPORTED_REGIONS['gulf-of-mannar'];
  const normalized = queryOrId.toLowerCase().trim();

  // Exact ID match
  if (SUPPORTED_REGIONS[normalized]) {
    return SUPPORTED_REGIONS[normalized];
  }

  // Name / keyword matching
  if (normalized.includes('mannar')) return SUPPORTED_REGIONS['gulf-of-mannar'];
  if (normalized.includes('arabian')) return SUPPORTED_REGIONS['arabian-sea'];
  if (normalized.includes('bengal')) return SUPPORTED_REGIONS['bay-of-bengal'];
  if (normalized.includes('indian ocean')) return SUPPORTED_REGIONS['indian-ocean'];

  return null;
}
