import React from 'react';
import { 
  BarChart3, 
  AlertTriangle, 
  Car, 
  MapPin, 
  TrendingUp, 
  ShieldAlert, 
  X, 
  Compass, 
  HeartPulse 
} from 'lucide-react';
import { BlackspotPoint } from '../types/gis';

interface StatisticsOverviewProps {
  points: BlackspotPoint[];
  isOpen: boolean;
  onClose: () => void;
  onSelectSeverity: (sev: 'Tinggi' | 'Sedang' | 'Waspada' | 'Semua') => void;
}

export const StatisticsOverview: React.FC<StatisticsOverviewProps> = ({
  points,
  isOpen,
  onClose,
  onSelectSeverity
}) => {
  if (!isOpen) return null;

  const total = points.length;
  const critical = points.filter(p => p.severity === 'Tinggi').length;
  const medium = points.filter(p => p.severity === 'Sedang').length;
  const warning = points.filter(p => p.severity === 'Waspada').length;

  // Breakdown by mode
  const modeCounts: Record<string, number> = {};
  points.forEach(p => {
    modeCounts[p.transportMode] = (modeCounts[p.transportMode] || 0) + 1;
  });

  // Breakdown by region
  const regionCounts: Record<string, number> = {};
  points.forEach(p => {
    regionCounts[p.region] = (regionCounts[p.region] || 0) + 1;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-3xl bg-slate-900 border border-slate-700/80 rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 bg-slate-950/70 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <BarChart3 className="w-5 h-5 text-sky-400" />
            <div>
              <h3 className="text-base font-bold text-white">
                Statistik & Analisis Kerawanan Laka Nataru 2026/2027
              </h3>
              <p className="text-xs text-slate-400">
                Data agregat titik rawan sektor transportasi seluruh koridor NKRI
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 text-xs text-slate-300">
          {/* KPI Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div 
              onClick={() => { onSelectSeverity('Semua'); onClose(); }}
              className="bg-slate-950/80 border border-slate-800 p-3.5 rounded-lg hover:border-slate-700 transition cursor-pointer"
            >
              <span className="text-[11px] text-slate-400 block">Total Titik Pantau</span>
              <span className="text-2xl font-bold font-mono tabular-nums text-white mt-1 block">
                {total}
              </span>
              <span className="text-[10px] text-slate-500 mt-1 block">100% Tercakup</span>
            </div>

            <div 
              onClick={() => { onSelectSeverity('Tinggi'); onClose(); }}
              className="bg-red-950/20 border border-red-900/40 p-3.5 rounded-lg hover:border-red-500/50 transition cursor-pointer"
            >
              <span className="text-[11px] text-red-400 block font-semibold">Tingkat Tinggi (Kritis)</span>
              <span className="text-2xl font-bold font-mono tabular-nums text-red-400 mt-1 block">
                {critical}
              </span>
              <span className="text-[10px] text-red-400/80 mt-1 block font-mono tabular-nums">
                {total > 0 ? ((critical / total) * 100).toFixed(1) : 0}% dari total
              </span>
            </div>

            <div 
              onClick={() => { onSelectSeverity('Sedang'); onClose(); }}
              className="bg-amber-950/20 border border-amber-900/40 p-3.5 rounded-lg hover:border-amber-500/50 transition cursor-pointer"
            >
              <span className="text-[11px] text-amber-400 block font-semibold">Tingkat Sedang</span>
              <span className="text-2xl font-bold font-mono tabular-nums text-amber-400 mt-1 block">
                {medium}
              </span>
              <span className="text-[10px] text-amber-400/80 mt-1 block font-mono tabular-nums">
                {total > 0 ? ((medium / total) * 100).toFixed(1) : 0}% dari total
              </span>
            </div>

            <div 
              onClick={() => { onSelectSeverity('Waspada'); onClose(); }}
              className="bg-sky-950/20 border border-sky-900/40 p-3.5 rounded-lg hover:border-sky-500/50 transition cursor-pointer"
            >
              <span className="text-[11px] text-sky-400 block font-semibold">Tingkat Waspada</span>
              <span className="text-2xl font-bold font-mono tabular-nums text-sky-400 mt-1 block">
                {warning}
              </span>
              <span className="text-[10px] text-sky-400/80 mt-1 block font-mono tabular-nums">
                {total > 0 ? ((warning / total) * 100).toFixed(1) : 0}% dari total
              </span>
            </div>
          </div>

          {/* Breakdown by Transport Mode */}
          <div>
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
              <Car className="w-4 h-4 text-sky-400" />
              <span>Distribusi Berdasarkan Moda Transportasi</span>
            </h4>
            <div className="space-y-2">
              {Object.entries(modeCounts).map(([mode, count]) => {
                const pct = total > 0 ? (count / total) * 100 : 0;
                return (
                  <div key={mode} className="bg-slate-950/60 p-2.5 rounded-lg border border-slate-800">
                    <div className="flex items-center justify-between mb-1.5 text-xs">
                      <span className="font-medium text-slate-200">{mode}</span>
                      <span className="font-mono tabular-nums text-slate-400">
                        <strong className="text-white">{count}</strong> lokasi ({pct.toFixed(0)}%)
                      </span>
                    </div>
                    <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div 
                        className="bg-sky-500 h-full rounded-full transition-all duration-500"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Breakdown by Region */}
          <div>
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-emerald-400" />
              <span>Distribusi Berdasarkan Wilayah Geografis</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {Object.entries(regionCounts).map(([reg, count]) => (
                <div key={reg} className="bg-slate-950/60 p-3 rounded-lg border border-slate-800 flex items-center justify-between">
                  <span className="text-slate-300 font-medium">{reg}</span>
                  <span className="font-mono tabular-nums font-bold text-sky-400 text-sm">
                    {count} <span className="text-xs font-normal text-slate-500">titik</span>
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Key Observations */}
          <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-lg">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block mb-1">
              Catatan Prioritas Satgas Operasi Nataru
            </span>
            <p className="text-slate-400 text-xs leading-relaxed">
              Titik lelah/fatigue terkonsentrasi di Tol Cipali KM 86-130 dan Tol Bakter KM 108. Jalur pegunungan dengan risiko rem blong tertinggi berada di Nagreg, Cangar-Pacet, dan Sitinjau Lauik. Titik penyeberangan Selat Sunda (Merak) dan Selat Bali (Ketapang) diwaspadai terhadap lonjakan antrean kendaraan dan cuaca angin monsun barat.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-semibold transition cursor-pointer"
          >
            Tutup Panel
          </button>
        </div>
      </div>
    </div>
  );
};
