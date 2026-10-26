import React from 'react';
import { Route, Clock, AlertTriangle, ArrowRight, MapPin, Gauge, Shield } from 'lucide-react';
import { TRANSPORT_CORRIDORS, BLACKSPOT_POINTS } from '../data/nataruData';
import { TransportCorridor } from '../types/gis';

interface CorridorsViewProps {
  onFocusCorridor: (coords: [number, number]) => void;
  onClose: () => void;
}

export const CorridorsView: React.FC<CorridorsViewProps> = ({ onFocusCorridor, onClose }) => {
  return (
    <div className="h-full w-full bg-slate-950 overflow-y-auto p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs text-sky-400 font-semibold mb-1">
            <Route className="w-4 h-4" />
            <span>KORIDOR UTAMA TRANSPORTASI NKRI</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Pemantauan Koridor Strategis Angkutan Nataru 2026/2027
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-3xl">
            Sistem pemantauan jalur arteri, jalan tol bebas hambatan, dan perlintasan ferry antarpulau yang diproyeksikan mengalami lonjakan mobilitas puncak.
          </p>
        </div>

        <button
          onClick={onClose}
          className="self-start sm:self-center px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-semibold transition cursor-pointer"
        >
          Kembali ke Peta
        </button>
      </div>

      {/* Corridor Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {TRANSPORT_CORRIDORS.map((corridor) => {
          // Count blackspots within this corridor
          const matchedPoints = BLACKSPOT_POINTS.filter(p => 
            p.roadName.toLowerCase().includes(corridor.name.toLowerCase().split(' ')[0]) ||
            p.description.toLowerCase().includes(corridor.code.toLowerCase())
          );

          let statusBadgeClass = 'text-sky-300 bg-sky-950/60 border-sky-800/60';
          if (corridor.trafficForecast === 'Sangat Padat') {
            statusBadgeClass = 'text-red-300 bg-red-950/60 border-red-800/60';
          } else if (corridor.trafficForecast.includes('Antrean')) {
            statusBadgeClass = 'text-amber-300 bg-amber-950/60 border-amber-800/60';
          }

          const midCoords = corridor.coordinates[Math.floor(corridor.coordinates.length / 2)];

          return (
            <div 
              key={corridor.id}
              className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col justify-between hover:border-slate-700 transition"
            >
              <div>
                <div className="flex items-center justify-between gap-2 text-xs mb-2">
                  <span className="font-mono text-slate-400">{corridor.code}</span>
                  <span className={`px-2 py-0.5 rounded text-[11px] font-semibold border ${statusBadgeClass}`}>
                    {corridor.trafficForecast}
                  </span>
                </div>

                <h3 className="text-base font-bold text-white mb-2 leading-snug">
                  {corridor.name}
                </h3>

                <p className="text-xs text-slate-300 mb-4 leading-relaxed">
                  {corridor.description}
                </p>

                {/* Corridor Specs Strip */}
                <div className="grid grid-cols-2 gap-2 text-xs bg-slate-950/80 p-3 rounded-lg border border-slate-800/80 mb-4">
                  <div>
                    <span className="text-[11px] text-slate-500 block">Panjang Koridor</span>
                    <span className="font-mono tabular-nums font-bold text-white mt-0.5 block">
                      {corridor.lengthKm.toLocaleString()} km
                    </span>
                  </div>

                  <div>
                    <span className="text-[11px] text-slate-500 block">Estimasi Puncak Arus</span>
                    <span className="font-mono text-[11px] font-semibold text-sky-300 mt-0.5 block">
                      {corridor.peakPeriodEstimated}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action row */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-800 text-xs">
                <span className="text-slate-400">
                  {corridor.type}
                </span>

                <button
                  onClick={() => onFocusCorridor(midCoords)}
                  className="px-3 py-1.5 bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 border border-sky-500/40 rounded-lg font-semibold flex items-center gap-1.5 transition cursor-pointer"
                >
                  <MapPin className="w-3.5 h-3.5" />
                  <span>Lihat di Peta</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
