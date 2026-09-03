import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { Layers, MapPin, Satellite, Waves, Eye, Compass, RefreshCw } from 'lucide-react';
import { RegionInfo, SatelliteObservationItem } from '../types/orca';

interface InteractiveMapProps {
  region: RegionInfo;
  satelliteItems: SatelliteObservationItem[];
  oceanSST?: number;
  waveHeight?: number;
  windSpeed?: number;
}

type BasemapId = 'ocean' | 'satellite' | 'streets';

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  region,
  satelliteItems,
  oceanSST,
  waveHeight,
  windSpeed
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const baseTileLayerRef = useRef<L.TileLayer | null>(null);
  const overlayGroupRef = useRef<L.LayerGroup | null>(null);

  const [basemap, setBasemap] = useState<BasemapId>('ocean');

  // Tile layer configurations without ANY API key requirements or watermarks
  const TILE_CONFIGS: Record<BasemapId, { url: string; options: L.TileLayerOptions; name: string }> = {
    ocean: {
      name: 'Ocean Bathymetry',
      url: 'https://services.arcgisonline.com/arcgis/rest/services/Ocean/World_Ocean_Base/MapServer/tile/{z}/{y}/{x}',
      options: {
        maxZoom: 13,
        attribution: 'Esri, GEBCO, NOAA, National Geographic'
      }
    },
    satellite: {
      name: 'Satellite View',
      url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      options: {
        maxZoom: 18,
        attribution: 'Esri, Maxar, Earthstar Geographics'
      }
    },
    streets: {
      name: 'Coastlines & Land',
      url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
      options: {
        maxZoom: 18,
        attribution: 'OpenStreetMap contributors'
      }
    }
  };

  // Initialize map once
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [region.centroid.lat, region.centroid.lon],
        zoom: region.id === 'gulf-of-mannar' ? 8 : 6,
        zoomControl: false, // We'll add custom top-right zoom control
        attributionControl: false
      });

      // Add Zoom control at top-right
      L.control.zoom({ position: 'topright' }).addTo(map);

      // Add default basemap
      const initialTile = L.tileLayer(TILE_CONFIGS.ocean.url, TILE_CONFIGS.ocean.options).addTo(map);
      baseTileLayerRef.current = initialTile;

      // Overlay group for markers, boundaries, swaths
      const overlayGroup = L.layerGroup().addTo(map);
      overlayGroupRef.current = overlayGroup;

      mapInstanceRef.current = map;
    }
  }, []);

  // Update basemap when selection changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (baseTileLayerRef.current) {
      map.removeLayer(baseTileLayerRef.current);
    }

    const cfg = TILE_CONFIGS[basemap];
    const newTile = L.tileLayer(cfg.url, cfg.options).addTo(map);
    // Ensure base tile stays behind overlay vectors
    newTile.bringToBack();
    baseTileLayerRef.current = newTile;
  }, [basemap]);

  // Update vectors and boundaries when region or data changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    const overlayGroup = overlayGroupRef.current;
    if (!map || !overlayGroup) return;

    // Clear previous vector graphics
    overlayGroup.clearLayers();

    const [minLon, minLat, maxLon, maxLat] = region.bbox;

    // 1. Region Bounding Box Envelope
    const bounds: L.LatLngBoundsExpression = [
      [minLat, minLon],
      [maxLat, maxLon]
    ];

    const bboxPolygon = L.rectangle(bounds, {
      color: '#06b6d4', // cyan-500
      weight: 2.5,
      dashArray: '6, 6',
      fillColor: '#06b6d4',
      fillOpacity: 0.08
    }).addTo(overlayGroup);

    bboxPolygon.bindPopup(`
      <div style="font-family: system-ui, sans-serif; font-size: 13px; color: #0f172a; padding: 4px; min-width: 220px; line-height: 1.5;">
        <div style="font-weight: 700; font-size: 14px; color: #0891b2; margin-bottom: 4px; border-bottom: 1px solid #e2e8f0; padding-bottom: 3px;">
          📍 ${region.name} Study Boundary
        </div>
        <div><b>Coordinates:</b> [${minLon}°E, ${minLat}°N] to [${maxLon}°E, ${maxLat}°N]</div>
        <div style="margin-top: 4px; font-size: 12px; color: #475569;">
          <b>Designation:</b> ${region.marineDesignation || region.description}
        </div>
      </div>
    `);

    // 2. Centroid Observation Station Marker
    const centroidIcon = L.divIcon({
      className: 'custom-centroid-marker',
      html: `
        <div style="
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: #0ea5e9;
          border: 3px solid #ffffff;
          box-shadow: 0 0 16px rgba(14, 165, 233, 0.9);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          cursor: pointer;
        ">
          <div style="width: 8px; height: 8px; background: white; border-radius: 50%;"></div>
        </div>
      `,
      iconSize: [32, 32],
      iconAnchor: [16, 16]
    });

    const centroidMarker = L.marker([region.centroid.lat, region.centroid.lon], {
      icon: centroidIcon
    }).addTo(overlayGroup);

    centroidMarker.bindPopup(`
      <div style="font-family: system-ui, sans-serif; font-size: 13px; color: #0f172a; padding: 6px; min-width: 250px; line-height: 1.6;">
        <div style="font-weight: 700; font-size: 14px; color: #0284c7; margin-bottom: 4px; border-bottom: 1px solid #e2e8f0; padding-bottom: 3px;">
          ⚓ ${region.name} Centroid Station
        </div>
        <div><b>Coordinates:</b> ${region.centroid.lat}°N, ${region.centroid.lon}°E</div>
        ${oceanSST !== undefined ? `<div style="color: #e11d48; font-weight: 600;">🌡️ Sea Surface Temp: ${oceanSST}°C</div>` : ''}
        ${waveHeight !== undefined ? `<div style="color: #0d9488; font-weight: 600;">🌊 Wave Height (Hs): ${waveHeight} meters</div>` : ''}
        ${windSpeed !== undefined ? `<div style="color: #0284c7; font-weight: 600;">💨 Wind Velocity: ${windSpeed} km/h (${Math.round((windSpeed / 1.852) * 10) / 10} kn)</div>` : ''}
        <div style="margin-top: 6px; font-size: 11px; color: #64748b; background: #f8fafc; padding: 4px 6px; border-radius: 4px;">
          Sensor Source: Open-Meteo Marine & NOAA GFS Ingest
        </div>
      </div>
    `);

    // 3. Satellite SAR Footprints
    satelliteItems.forEach((item) => {
      if (item.bbox && item.bbox.length === 4) {
        const [sMinLon, sMinLat, sMaxLon, sMaxLat] = item.bbox;
        const satBounds: L.LatLngBoundsExpression = [
          [sMinLat, sMinLon],
          [sMaxLat, sMaxLon]
        ];

        const satRect = L.rectangle(satBounds, {
          color: '#10b981', // emerald-500
          weight: 2,
          fillColor: '#10b981',
          fillOpacity: 0.15
        }).addTo(overlayGroup);

        satRect.bindPopup(`
          <div style="font-family: system-ui, sans-serif; font-size: 12px; color: #0f172a; max-width: 260px; line-height: 1.5; padding: 4px;">
            <div style="background: #ecfdf5; color: #047857; padding: 3px 8px; border-radius: 6px; font-weight: bold; font-size: 11px; display: inline-block; margin-bottom: 6px;">
              🛰️ Copernicus Sentinel-1 (${item.orbitDirection})
            </div>
            <div style="font-family: monospace; font-size: 10px; color: #334155; word-break: break-all; margin-bottom: 6px;">
              ${item.id}
            </div>
            <div><b>Acquired:</b> ${new Date(item.acquisitionTime).toUTCString()}</div>
            <div><b>Sensor Mode:</b> ${item.sensor} (${item.polarization.join('/')})</div>
            <div style="margin-top: 8px;">
              <a href="${item.sourceUrl}" target="_blank" rel="noopener noreferrer" style="color: #0284c7; text-decoration: underline; font-weight: bold; font-size: 11px;">
                Open in Copernicus Browser ↗
              </a>
            </div>
          </div>
        `);
      }
    });

    // Zoom map smoothly to region bounds
    map.fitBounds(bounds, { padding: [40, 40] });

  }, [region, satelliteItems, oceanSST, waveHeight, windSpeed]);

  // Resize observer to handle layout size changes
  useEffect(() => {
    if (!mapContainerRef.current) return;
    const observer = new ResizeObserver(() => {
      mapInstanceRef.current?.invalidateSize();
    });
    observer.observe(mapContainerRef.current);
    return () => observer.disconnect();
  }, []);

  const handleResetView = () => {
    if (!mapInstanceRef.current) return;
    const [minLon, minLat, maxLon, maxLat] = region.bbox;
    mapInstanceRef.current.fitBounds(
      [
        [minLat, minLon],
        [maxLat, maxLon]
      ],
      { padding: [40, 40] }
    );
  };

  return (
    <div className="bg-[#0D1527] border border-[#1E293B] rounded-2xl p-5 sm:p-6 flex flex-col h-full shadow-lg shadow-black/20">
      
      {/* Map Control Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-bold text-white tracking-wide">
              Interactive Geospatial Marine Domain
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Georeferenced spatial boundary, telemetry station, and real Sentinel-1 SAR footprints
          </p>
        </div>

        {/* Basemap Switcher & Reset Button */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="bg-[#0A0F1D] border border-[#1E293B] p-1 rounded-xl flex items-center gap-1">
            <button
              onClick={() => setBasemap('ocean')}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                basemap === 'ocean'
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="NOAA/GEBCO Ocean Bathymetry"
            >
              🌊 Ocean
            </button>
            <button
              onClick={() => setBasemap('satellite')}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                basemap === 'satellite'
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Esri World Satellite Imagery"
            >
              🛰️ Satellite
            </button>
            <button
              onClick={() => setBasemap('streets')}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                basemap === 'streets'
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="OpenStreetMap Coastlines"
            >
              🗺️ Coastlines
            </button>
          </div>

          <button
            onClick={handleResetView}
            className="p-1.5 rounded-xl bg-[#0A0F1D] hover:bg-[#1E293B] border border-[#1E293B] text-slate-400 hover:text-white transition-all cursor-pointer flex items-center gap-1 text-xs px-2.5"
            title="Reset zoom to study region"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset View</span>
          </button>
        </div>
      </div>

      {/* Map Canvas Container (Taller, spacious, clean styling) */}
      <div className="relative w-full h-[380px] sm:h-[460px] rounded-xl overflow-hidden border border-[#1E293B] bg-[#0A0F1D] shadow-inner">
        <div ref={mapContainerRef} className="w-full h-full z-10" />

        {/* Floating Quick Legend */}
        <div className="absolute bottom-3 left-3 z-20 bg-[#0A0F1D]/90 backdrop-blur-md border border-[#1E293B] rounded-xl px-3 py-2 text-xs shadow-lg space-y-1.5 max-w-xs">
          <div className="font-semibold text-slate-300 text-[11px] uppercase tracking-wider mb-1">
            Map Legend
          </div>
          <div className="flex items-center gap-2 text-slate-300 text-[11px]">
            <span className="w-3 h-3 border-2 border-cyan-400 border-dashed rounded-sm bg-cyan-400/20 shrink-0"></span>
            <span>Study Boundary [{region.name}]</span>
          </div>
          <div className="flex items-center gap-2 text-slate-300 text-[11px]">
            <span className="w-3 h-3 border-2 border-emerald-400 rounded-sm bg-emerald-400/20 shrink-0"></span>
            <span>Sentinel-1 Radar Swaths ({satelliteItems.length})</span>
          </div>
          <div className="flex items-center gap-2 text-slate-300 text-[11px]">
            <span className="w-3 h-3 rounded-full bg-sky-500 border-2 border-white shrink-0"></span>
            <span>Ocean Telemetry Station</span>
          </div>
        </div>
      </div>

      {/* Bottom Coordinates & Summary */}
      <div className="mt-4 pt-3 border-t border-[#1E293B] flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-400 gap-2">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-cyan-400 shrink-0" />
          <span>
            <b>Bounding Coordinates:</b> [{region.bbox.join(', ')}] • Centroid: {region.centroid.lat}°N, {region.centroid.lon}°E
          </span>
        </div>
        <div className="flex items-center gap-2 font-mono text-[11px] text-emerald-400">
          <Satellite className="w-3.5 h-3.5 shrink-0" />
          <span>Watermark-free live tile feed • {basemap.toUpperCase()}</span>
        </div>
      </div>
    </div>
  );
};
