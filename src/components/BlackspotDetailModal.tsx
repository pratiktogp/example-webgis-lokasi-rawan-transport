import React, { useState } from 'react';
import { 
  X, 
  AlertTriangle, 
  Phone, 
  MapPin, 
  ShieldCheck, 
  Gauge, 
  ExternalLink, 
  Copy, 
  Check, 
  Clock, 
  Radio, 
  Car,
  LifeBuoy
} from 'lucide-react';
import { BlackspotPoint } from '../types/gis';

interface BlackspotDetailModalProps {
  point: BlackspotPoint | null;
  onClose: () => void;
  onFlyTo: (coords: [number, number]) => void;
}

export const BlackspotDetailModal: React.FC<BlackspotDetailModalProps> = ({
  point,
  onClose,
  onFlyTo
}) => {
  const [copiedCoords, setCopiedCoords] = useState(false);

  if (!point) return null;

  const copyCoordinates = () => {
    const text = `${point.coordinates[1].toFixed(6)}, ${point.coordinates[0].toFixed(6)}`;
    navigator.clipboard.writeText(text);
    setCopiedCoords(true);
    setTimeout(() => setCopiedCoords(false), 2000);
  };

  const gmapsUrl = `https://www.google.com/maps?q=${point.coordinates[1]},${point.coordinates[0]}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="p-4 sm:p-5 border-b border-slate-800 bg-slate-950/70 flex items-start justify-between gap-4 shrink-0">
          <div>
            <div className="flex items-center gap-2 text-xs mb-1.5">
              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold ${
                point.severity === 'Tinggi' 
                  ? 'bg-red-500/20 text-red-300 border border-red-500/40' 
                  : point.severity === 'Sedang'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  : 'bg-sky-500/20 text-sky-300 border border-sky-500/40'
              }`}>
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Rawan {point.severity}</span>
              </span>
              <span className="text-slate-500" aria-hidden="true">·</span>
              <span className="font-mono text-slate-400 text-xs">{point.code}</span>
              <span className="text-slate-500" aria-hidden="true">·</span>
              <span className="text-slate-300 text-xs">{point.transportMode}</span>
            </div>

            <h3 className="text-base sm:text-lg font-bold text-white tracking-tight leading-snug">
              {point.name}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              {point.roadName} {point.kmMarker ? `· ${point.kmMarker}` : ''} ({point.cityRegency}, {point.province})
            </p>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition cursor-pointer"
            title="Tutup Modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body (Scrollable) */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 text-xs text-slate-300">
          {/* Quick Metrics Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-3 bg-slate-950/70 border border-slate-800 rounded-lg">
            <div>
              <span className="text-[11px] text-slate-500 block">Batas Kecepatan</span>
              <span className="text-sm font-bold font-mono tabular-nums text-white flex items-center gap-1 mt-0.5">
                <Gauge className="w-3.5 h-3.5 text-sky-400" />
                <span>{point.recommendedSpeedKmh} km/jam</span>
              </span>
            </div>

            <div>
              <span className="text-[11px] text-slate-500 block">Elevasi Medan</span>
              <span className="text-sm font-bold font-mono tabular-nums text-white mt-0.5 block">
                {point.elevationMeters ? `${point.elevationMeters} mdpl` : '-'}
              </span>
            </div>

            <div>
              <span className="text-[11px] text-slate-500 block">Status Operasi</span>
              <span className="text-sm font-bold text-emerald-400 mt-0.5 block">
                Siaga Nataru
              </span>
            </div>

            <div>
              <span className="text-[11px] text-slate-500 block">Wilayah Zonasi</span>
              <span className="text-sm font-bold text-slate-200 mt-0.5 block">
                {point.region}
              </span>
            </div>
          </div>

          {/* Description */}
          <div>
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <span>Gambaran Karakteristik Jalur</span>
            </h4>
            <p className="text-slate-300 leading-relaxed text-xs bg-slate-800/40 p-3 rounded-lg border border-slate-800">
              {point.description}
            </p>
          </div>

          {/* Risk Factors */}
          <div>
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <span>Faktor Risiko & Penyebab Kerawanan</span>
            </h4>
            <ul className="space-y-1.5">
              {point.riskFactors.map((factor, idx) => (
                <li key={idx} className="flex items-start gap-2 bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/80">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                  <span className="text-slate-300 leading-snug">{factor}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Historical Incident */}
          <div>
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-1.5">
              Catatan Historis Kecelakaan (2024 - 2025)
            </h4>
            <div className="p-3 bg-red-950/20 border border-red-900/40 rounded-lg text-red-200 font-mono text-xs font-medium">
              {point.historicalIncidentSummary}
            </div>
          </div>

          {/* Mitigations & Field SOP */}
          <div>
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Rencana Mitigasi & Pengamanan Lapangan</span>
            </h4>
            <div className="space-y-1.5">
              {point.mitigationActions.map((mit, idx) => (
                <div key={idx} className="flex items-start gap-2 bg-slate-950/60 p-2 rounded-lg border border-slate-800">
                  <span className="text-emerald-400 font-mono text-[11px] font-bold shrink-0">{idx + 1}.</span>
                  <span className="text-slate-300 leading-snug">{mit}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Operational Notes 2026/2027 */}
          <div>
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <Radio className="w-4 h-4 text-sky-400" />
              <span>Instruksi Khusus Operasi Nataru 2026/2027</span>
            </h4>
            <div className="p-3 bg-sky-950/30 border border-sky-800/40 rounded-lg text-sky-200 text-xs">
              {point.operationalNotes2026}
            </div>
          </div>

          {/* Nearest Emergency Post */}
          <div>
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Phone className="w-4 h-4 text-sky-400" />
              <span>Posko Tanggap Darurat Terdekat</span>
            </h4>
            <div className="p-3.5 bg-slate-950/80 border border-slate-800 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="font-semibold text-white block">{point.nearestEmergencyPost.name}</span>
                <span className="text-slate-400 text-[11px] mt-0.5 block">
                  Jarak evakuasi: <span className="font-mono text-sky-400 font-semibold">{point.nearestEmergencyPost.distanceKm} km</span> dari titik lokasi
                </span>
              </div>
              <a
                href={`tel:${point.nearestEmergencyPost.phone.replace(/[^0-9]/g, '')}`}
                className="px-3 py-1.5 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold rounded-lg text-xs flex items-center justify-center gap-1.5 transition shrink-0"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>{point.nearestEmergencyPost.phone}</span>
              </a>
            </div>
          </div>

          {/* Available Facilities */}
          <div>
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-2">
              Fasilitas Keselamatan di Lokasi
            </h4>
            <div className="flex flex-wrap gap-2">
              {point.facilities.map((fac, idx) => (
                <span 
                  key={idx}
                  className="px-2.5 py-1 bg-slate-800 text-slate-300 rounded text-xs border border-slate-700/60 flex items-center gap-1.5"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
                  <span>{fac}</span>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-800 bg-slate-950 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2">
            <button
              onClick={copyCoordinates}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg text-xs font-medium flex items-center gap-1.5 transition cursor-pointer"
              title="Salin Koordinat Geografis"
            >
              {copiedCoords ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedCoords ? 'Tersalin' : 'Salin Koordinat'}</span>
            </button>

            <a
              href={gmapsUrl}
              target="_blank"
              rel="noreferrer"
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg text-xs font-medium flex items-center gap-1.5 transition"
              title="Buka Lokasi di Google Maps"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Google Maps</span>
            </a>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onFlyTo(point.coordinates);
                onClose();
              }}
              className="px-4 py-1.5 bg-sky-500 hover:bg-sky-400 active:bg-sky-600 text-slate-950 font-bold rounded-lg text-xs flex items-center gap-1.5 transition cursor-pointer shadow-md shadow-sky-500/20"
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>Fokus di Peta</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
