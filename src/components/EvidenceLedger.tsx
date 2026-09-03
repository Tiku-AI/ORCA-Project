import React, { useState } from 'react';
import { FileCheck, Search, Filter, ExternalLink, CheckCircle, AlertTriangle, XCircle, Download } from 'lucide-react';
import { EvidenceItem } from '../types/orca';

interface EvidenceLedgerProps {
  evidence: EvidenceItem[];
  requestId: string;
}

export const EvidenceLedger: React.FC<EvidenceLedgerProps> = ({ evidence, requestId }) => {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  const filtered = evidence.filter((item) => {
    const matchesSearch =
      item.parameter.toLowerCase().includes(search.toLowerCase()) ||
      item.agent.toLowerCase().includes(search.toLowerCase()) ||
      item.source.toLowerCase().includes(search.toLowerCase()) ||
      item.value.toLowerCase().includes(search.toLowerCase());

    const matchesCat = categoryFilter === 'all' || item.category === categoryFilter;

    return matchesSearch && matchesCat;
  });

  return (
    <div className="bg-[#0D1527] border border-[#1E293B] rounded-2xl p-5 sm:p-6 shadow-xl shadow-black/20 space-y-4">
      
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1E293B] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <FileCheck className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Immutable Evidence Ledger & Grounded Audit Trail
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Cryptographically grounded log of all empirical observations, sensors, and confidence ratings (Run: {requestId})
          </p>
        </div>

        {/* Filter Controls */}
        <div className="flex items-center gap-3 flex-wrap">
          {/* Search */}
          <div className="relative">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search observations..."
              className="bg-[#0A0F1D] border border-[#1E293B] text-xs text-white rounded-xl pl-9 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 font-mono w-48 sm:w-60"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
          </div>

          {/* Category Dropdown */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-[#0A0F1D] border border-[#1E293B] text-xs text-slate-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 font-medium cursor-pointer"
          >
            <option value="all">All Sensor Domains</option>
            <option value="satellite">Satellite Radar (SAR)</option>
            <option value="ocean">Ocean Conditions (SST/Waves)</option>
            <option value="weather">Atmospheric Weather</option>
            <option value="ecology">Protected Marine Ecology</option>
            <option value="geospatial">Geospatial Domain</option>
            <option value="risk">Risk Synthesis</option>
          </select>

          {/* JSON Export API Link */}
          <a
            href={`/api/v1/evidence/${requestId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs bg-[#0A0F1D] hover:bg-[#1E293B] text-cyan-400 px-3 py-2 rounded-xl border border-[#1E293B] transition-all font-mono font-medium cursor-pointer"
            title="Inspect raw JSON evidence payload"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Audit JSON</span>
          </a>
        </div>
      </div>

      {/* Evidence Table */}
      <div className="overflow-x-auto rounded-xl border border-[#1E293B]">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-[#0A0F1D] text-slate-400 uppercase tracking-wider text-[11px] font-mono border-b border-[#1E293B]">
            <tr>
              <th className="px-4 py-3 font-semibold">Evidence ID</th>
              <th className="px-4 py-3 font-semibold">Agent</th>
              <th className="px-4 py-3 font-semibold">Parameter / Observation</th>
              <th className="px-4 py-3 font-semibold">Observed Value</th>
              <th className="px-4 py-3 font-semibold">Status</th>
              <th className="px-4 py-3 font-semibold">Source</th>
              <th className="px-4 py-3 font-semibold">Confidence</th>
              <th className="px-4 py-3 font-semibold">Timestamp</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1E293B]">
            {filtered.map((item) => (
              <tr key={item.id} className="hover:bg-[#0A0F1D]/70 transition-colors">
                <td className="px-4 py-3 font-mono text-[11px] text-cyan-400 font-semibold">
                  {item.id}
                </td>
                <td className="px-4 py-3 font-medium text-slate-200">
                  {item.agent.replace(' Agent', '')}
                </td>
                <td className="px-4 py-3">
                  <span className="font-semibold text-white block text-xs">{item.parameter}</span>
                  {item.notes && <span className="text-[11px] text-slate-400 block mt-0.5">{item.notes}</span>}
                </td>
                <td className="px-4 py-3 font-mono text-xs font-bold text-slate-100 max-w-xs truncate">
                  {item.value} {item.unit || ''}
                </td>
                <td className="px-4 py-3">
                  {item.status === 'available' ? (
                    <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded font-bold bg-emerald-950 text-emerald-300 border border-emerald-800/60 uppercase">
                      <CheckCircle className="w-3 h-3" />
                      AVAILABLE
                    </span>
                  ) : item.status === 'partial' ? (
                    <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded font-bold bg-amber-950 text-amber-300 border border-amber-800/60 uppercase">
                      <AlertTriangle className="w-3 h-3" />
                      PARTIAL
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded font-bold bg-rose-950 text-rose-300 border border-rose-800/60 uppercase">
                      <XCircle className="w-3 h-3" />
                      UNAVAILABLE
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 text-xs text-slate-400 max-w-[200px] truncate">
                  {item.source}
                </td>
                <td className="px-4 py-3 font-mono text-xs font-semibold text-cyan-300">
                  {item.confidence}%
                </td>
                <td className="px-4 py-3 text-xs font-mono text-slate-400 whitespace-nowrap">
                  {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 pt-2 gap-2">
        <span>Showing {filtered.length} of {evidence.length} verified evidence records.</span>
        <span>Every observation traces to real telemetry or explicit unmeasured notice.</span>
      </div>

    </div>
  );
};
