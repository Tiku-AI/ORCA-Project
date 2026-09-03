import React, { useState } from 'react';
import {
  Satellite,
  Waves,
  CloudSun,
  Leaf,
  ExternalLink,
  Clock,
  Compass,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  Thermometer,
  Wind
} from 'lucide-react';
import {
  EcologyObservationData,
  OceanObservationData,
  SatelliteObservationItem,
  WeatherObservationData
} from '../types/orca';

interface ObservationsPanelProps {
  satellite: {
    items: SatelliteObservationItem[];
    totalFound: number;
    stacSource: string;
    status: string;
  };
  ocean: OceanObservationData;
  weather: WeatherObservationData;
  ecology: EcologyObservationData;
}

export const ObservationsPanel: React.FC<ObservationsPanelProps> = ({
  satellite,
  ocean,
  weather,
  ecology
}) => {
  const [activeTab, setActiveTab] = useState<'satellite' | 'ocean' | 'weather' | 'ecology'>('satellite');

  return (
    <div className="bg-[#0D1527] border border-[#1E293B] rounded-2xl p-5 sm:p-6 shadow-xl shadow-black/20 flex flex-col h-full space-y-5">
      
      {/* Header & Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1E293B] pb-4">
        <div>
          <h3 className="text-base font-bold text-white tracking-tight">
            Environmental Observations & Sensor Telemetry
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Real observation data paired with explicit unavailable sensor states (ISRO Zero-Fabrication Protocol)
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center gap-1.5 bg-[#0A0F1D] p-1.5 rounded-xl border border-[#1E293B] self-start sm:self-auto flex-wrap">
          <button
            id="tab-btn-satellite"
            onClick={() => setActiveTab('satellite')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'satellite'
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Satellite className="w-3.5 h-3.5" />
            <span>SAR Satellite ({satellite.items.length})</span>
          </button>

          <button
            id="tab-btn-ocean"
            onClick={() => setActiveTab('ocean')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'ocean'
                ? 'bg-teal-500 text-slate-950 font-bold shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Waves className="w-3.5 h-3.5" />
            <span>Ocean Conditions</span>
          </button>

          <button
            id="tab-btn-weather"
            onClick={() => setActiveTab('weather')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'weather'
                ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <CloudSun className="w-3.5 h-3.5" />
            <span>Weather</span>
          </button>

          <button
            id="tab-btn-ecology"
            onClick={() => setActiveTab('ecology')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'ecology'
                ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Leaf className="w-3.5 h-3.5" />
            <span>Ecology</span>
          </button>
        </div>
      </div>

      {/* Tab 1: Satellite Observations */}
      {activeTab === 'satellite' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-300 bg-[#0A0F1D] p-3 rounded-xl border border-[#1E293B]">
            <span className="truncate">
              <b>STAC Source:</b> {satellite.stacSource} (Collection: <code>sentinel-1-grd</code>)
            </span>
            <span className="text-emerald-400 font-semibold shrink-0 ml-2 font-mono">
              ✓ {satellite.totalFound} Radar Scenes Catalogued
            </span>
          </div>

          <div className="space-y-3">
            {satellite.items.map((item, idx) => (
              <div
                key={idx}
                className="bg-[#0A0F1D] border border-[#1E293B] hover:border-slate-600 rounded-xl p-4 transition-all space-y-2.5"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                  <span className="font-mono text-xs font-bold text-cyan-300 break-all">
                    {item.id}
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded font-bold bg-cyan-950 border border-cyan-800 text-cyan-300 self-start sm:self-auto shrink-0 uppercase">
                    {item.orbitDirection} ORBIT PASS
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs text-slate-300">
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase font-mono">Platform:</span>
                    <span className="font-semibold text-white">{item.platform} • {item.sensor}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase font-mono">Acquired (UTC):</span>
                    <span className="font-medium text-white">
                      {new Date(item.acquisitionTime).toLocaleString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase font-mono">Polarization:</span>
                    <span className="font-mono text-white">{item.polarization.join(' / ')}</span>
                  </div>
                  <div className="flex items-end">
                    <a
                      href={item.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs text-cyan-400 hover:text-cyan-300 underline font-semibold"
                    >
                      <span>Copernicus Browser</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>

                {item.assetsSummary.length > 0 && (
                  <div className="text-[11px] text-slate-400 flex items-center gap-2 pt-1 border-t border-[#1E293B] font-mono">
                    <span className="text-slate-400 font-semibold">Granule Assets:</span>
                    <span className="truncate">
                      {item.assetsSummary.join(', ')}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Ocean Observations */}
      {activeTab === 'ocean' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Sea Surface Temp */}
            <div className="bg-[#0A0F1D] border border-[#1E293B] rounded-xl p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-300 flex items-center gap-2 uppercase tracking-wide">
                  <Thermometer className="w-4 h-4 text-rose-400" />
                  Sea Surface Temperature (SST)
                </span>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
                  ocean.seaSurfaceTemperature?.anomalyStatus === 'critical'
                    ? 'bg-rose-950 text-rose-300 border border-rose-800'
                    : ocean.seaSurfaceTemperature?.anomalyStatus === 'elevated'
                    ? 'bg-amber-950 text-amber-300 border border-amber-800'
                    : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                }`}>
                  {ocean.seaSurfaceTemperature?.anomalyStatus || 'NORMAL'}
                </span>
              </div>
              <div className="flex items-baseline gap-2 font-mono">
                <span className="text-3xl font-extrabold text-white">
                  {ocean.seaSurfaceTemperature?.value ?? 'N/A'}
                </span>
                <span className="text-sm font-semibold text-slate-400">°C</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Critical threshold is &gt;30.0°C for triggering coral bleaching thermal stress warnings.
              </p>
            </div>

            {/* Significant Wave Height */}
            <div className="bg-[#0A0F1D] border border-[#1E293B] rounded-xl p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-300 flex items-center gap-2 uppercase tracking-wide">
                  <Waves className="w-4 h-4 text-teal-400" />
                  Significant Wave Height (Hs)
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded font-bold bg-teal-950 text-teal-300 border border-teal-800 uppercase">
                  {ocean.waveHeight?.condition || 'MODERATE'}
                </span>
              </div>
              <div className="flex items-baseline gap-2 font-mono">
                <span className="text-3xl font-extrabold text-white">
                  {ocean.waveHeight?.value ?? 'N/A'}
                </span>
                <span className="text-sm font-semibold text-slate-400">meters</span>
                {ocean.wavePeriod?.value && (
                  <span className="text-xs text-slate-400 font-mono ml-2">
                    (Wave Period: {ocean.wavePeriod.value}s)
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Hydrodynamic wave energy influencing small craft navigation and coastal sediment resuspension.
              </p>
            </div>

          </div>

          {/* Salinity - Explicitly Unavailable Notification */}
          <div className="bg-[#0A0F1D] border border-amber-800/40 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-amber-300">
                    Sea Surface Salinity (SSS): Parameter Unavailable
                  </span>
                  <span className="text-[10px] bg-amber-900/60 text-amber-200 px-2 py-0.5 rounded font-mono font-bold">
                    SENSOR DISCONNECTED
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {ocean.salinity?.reason || 'Continuous in-situ salinometer telemetry is unavailable for this station coordinate.'}
                </p>
                <span className="text-xs text-amber-400/90 font-medium block">
                  ✓ Scientific Integrity Directive: Parameter withheld to prevent empirical fabrication.
                </span>
              </div>
            </div>
          </div>

          {/* Ocean Metadata Source */}
          <div className="text-xs font-mono text-slate-400 pt-2 border-t border-[#1E293B] flex items-center justify-between">
            <span><b>Ocean Data Ingest:</b> {ocean.source}</span>
            <span>{new Date(ocean.timestamp).toUTCString()}</span>
          </div>
        </div>
      )}

      {/* Tab 3: Weather Observations */}
      {activeTab === 'weather' && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            
            {/* Wind Speed */}
            <div className="bg-[#0A0F1D] border border-[#1E293B] rounded-xl p-3.5 space-y-1">
              <span className="text-xs font-mono text-slate-400 block uppercase">Wind Speed</span>
              <div className="flex items-baseline gap-1 font-mono">
                <span className="text-2xl font-bold text-white">{weather.windSpeed.value}</span>
                <span className="text-xs text-slate-400">km/h</span>
              </div>
              <span className="text-xs text-cyan-400 font-mono block">
                {Math.round((weather.windSpeed.value / 1.852) * 10) / 10} knots
              </span>
            </div>

            {/* Wind Direction */}
            <div className="bg-[#0A0F1D] border border-[#1E293B] rounded-xl p-3.5 space-y-1">
              <span className="text-xs font-mono text-slate-400 block uppercase">Wind Direction</span>
              <div className="flex items-baseline gap-1 font-mono">
                <span className="text-2xl font-bold text-white">
                  {weather.windSpeed.windDirectionDeg ?? 0}°
                </span>
              </div>
              <span className="text-xs text-slate-400 block">Surface (10m)</span>
            </div>

            {/* Precipitation */}
            <div className="bg-[#0A0F1D] border border-[#1E293B] rounded-xl p-3.5 space-y-1">
              <span className="text-xs font-mono text-slate-400 block uppercase">Precipitation</span>
              <div className="flex items-baseline gap-1 font-mono">
                <span className="text-2xl font-bold text-white">{weather.precipitation.value}</span>
                <span className="text-xs text-slate-400">mm/h</span>
              </div>
              <span className="text-xs text-slate-400 block truncate">
                {weather.precipitation.value > 0 ? 'Convective Showers' : 'Dry / Clear'}
              </span>
            </div>

            {/* Surface Pressure */}
            <div className="bg-[#0A0F1D] border border-[#1E293B] rounded-xl p-3.5 space-y-1">
              <span className="text-xs font-mono text-slate-400 block uppercase">Pressure</span>
              <div className="flex items-baseline gap-1 font-mono">
                <span className="text-2xl font-bold text-white">{weather.surfacePressure.value}</span>
                <span className="text-xs text-slate-400">hPa</span>
              </div>
              <span className="text-xs text-slate-400 block truncate">MSL Gradient</span>
            </div>

          </div>

          <div className="text-xs font-mono text-slate-400 pt-2 border-t border-[#1E293B] flex items-center justify-between">
            <span><b>Atmospheric Source:</b> {weather.source}</span>
            <span>{new Date(weather.timestamp).toUTCString()}</span>
          </div>
        </div>
      )}

      {/* Tab 4: Ecology Observations */}
      {activeTab === 'ecology' && (
        <div className="space-y-4">
          
          {/* Protected Habitat Box */}
          <div className="bg-[#0A0F1D] border border-[#1E293B] rounded-xl p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-300 uppercase tracking-wide">
                Marine Ecological Zone & Habitat Vulnerability
              </span>
              <span className="text-[10px] font-mono px-2.5 py-0.5 rounded font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">
                {ecology.coralReefVulnerability.rating}
              </span>
            </div>
            <h4 className="text-sm font-bold text-white">
              {ecology.coralReefVulnerability.zoneName}
            </h4>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {ecology.coralReefVulnerability.ecologicalSignificance}
            </p>
          </div>

          {/* Chlorophyll-a Unavailable Notice */}
          <div className="bg-[#0A0F1D] border border-amber-800/40 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-amber-300">
                    Chlorophyll-a Bio-Optical Density: Parameter Unavailable
                  </span>
                  <span className="text-[10px] bg-amber-900/60 text-amber-200 px-2 py-0.5 rounded font-mono font-bold">
                    UNMEASURED
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {ecology.chlorophyllA.note}
                </p>
                <span className="text-xs text-amber-400/90 font-medium block">
                  ✓ Scientific Integrity Directive: No synthetic bio-optical values are generated without ground-truth sensors.
                </span>
              </div>
            </div>
          </div>

          <div className="text-xs font-mono text-slate-400 pt-2 border-t border-[#1E293B] flex items-center justify-between">
            <span><b>Ecology Reference:</b> {ecology.source}</span>
            <span>{new Date(ecology.timestamp).toUTCString()}</span>
          </div>

        </div>
      )}

    </div>
  );
};
