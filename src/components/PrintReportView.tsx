import React from 'react';
import { Printer, X, ShieldAlert, Route, PhoneCall, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { BLACKSPOT_POINTS, TRANSPORT_CORRIDORS, OPERATIONAL_HOTLINES } from '../data/nataruData';

interface PrintReportViewProps {
  onClose: () => void;
}

export const PrintReportView: React.FC<PrintReportViewProps> = ({ onClose }) => {
  const criticalPoints = BLACKSPOT_POINTS.filter(p => p.severity === 'Tinggi');
  const mediumPoints = BLACKSPOT_POINTS.filter(p => p.severity === 'Sedang');
  const warningPoints = BLACKSPOT_POINTS.filter(p => p.severity === 'Waspada');

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950 p-4 sm:p-6 lg:p-8">
      {/* Top action bar (hidden during print) */}
      <div className="no-print max-w-4xl mx-auto mb-6 flex items-center justify-between bg-slate-900 border border-slate-800 p-4 rounded-xl shadow-lg">
        <div>
          <h2 className="text-sm font-bold text-white">Laporan Eksekutif Kesiapsiagaan Nataru 2026/2027</h2>
          <p className="text-xs text-slate-400">Siap dicetak atau disimpan sebagai dokumen PDF resmi operasional lapangan.</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="px-4 py-2 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold rounded-lg text-xs flex items-center gap-1.5 transition cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak / Cetak ke PDF</span>
          </button>
          <button
            onClick={onClose}
            className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold transition cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>

      {/* Printable Document Container (A4 styling) */}
      <div className="max-w-4xl mx-auto bg-white text-slate-900 p-8 sm:p-12 rounded-xl shadow-2xl border border-slate-300 print:shadow-none print:border-0 print:p-0">
        {/* Header Document */}
        <div className="border-b-2 border-slate-900 pb-4 mb-6">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[11px] font-mono tracking-widest uppercase text-slate-600 block">
                REPUBLIK INDONESIA · POSKO TERPADU ANGKUTAN NATARU 2026/2027
              </span>
              <h1 className="text-xl sm:text-2xl font-black text-slate-950 tracking-tight mt-1 uppercase">
                Laporan Pemetaan Titik Rawan Kecelakaan (Blackspot)
              </h1>
              <p className="text-xs text-slate-700 mt-1">
                Sektor Transportasi Darat, Penyeberangan & Laut Wilayah Negara Kesatuan Republik Indonesia
              </p>
            </div>
            <div className="text-right text-xs font-mono text-slate-600">
              <div>Klasifikasi: <strong>TERBATAS / OPERASIONAL</strong></div>
              <div>Periode: <strong>Des 2026 - Jan 2027</strong></div>
              <div>Tanggal Cetak: <strong>{new Date().toLocaleDateString('id-ID')}</strong></div>
            </div>
          </div>
        </div>

        {/* Executive Summary Stats */}
        <div className="mb-6">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-2 border-b border-slate-300 pb-1">
            I. Ringkasan Status Kesiapsiagaan Spasial
          </h2>
          <div className="grid grid-cols-4 gap-3 text-center">
            <div className="border border-slate-300 p-3 rounded bg-slate-50">
              <span className="text-[11px] text-slate-600 block">Total Titik Pantauan</span>
              <span className="text-xl font-bold font-mono tabular-nums text-slate-900">{BLACKSPOT_POINTS.length}</span>
            </div>
            <div className="border border-red-300 p-3 rounded bg-red-50 text-red-900">
              <span className="text-[11px] text-red-700 block font-semibold">Tingkat Rawan Tinggi</span>
              <span className="text-xl font-bold font-mono tabular-nums">{criticalPoints.length}</span>
            </div>
            <div className="border border-amber-300 p-3 rounded bg-amber-50 text-amber-900">
              <span className="text-[11px] text-amber-700 block font-semibold">Tingkat Sedang</span>
              <span className="text-xl font-bold font-mono tabular-nums">{mediumPoints.length}</span>
            </div>
            <div className="border border-sky-300 p-3 rounded bg-sky-50 text-sky-900">
              <span className="text-[11px] text-sky-700 block font-semibold">Tingkat Waspada</span>
              <span className="text-xl font-bold font-mono tabular-nums">{warningPoints.length}</span>
            </div>
          </div>
        </div>

        {/* Critical Blackspots Table */}
        <div className="mb-6">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-2 border-b border-slate-300 pb-1 flex items-center justify-between">
            <span>II. Daftar Titik Rawan Kritis (Prioritas Penanganan Merah)</span>
            <span className="text-[10px] text-slate-500 font-normal">Total {criticalPoints.length} Lokasi</span>
          </h2>
          <table className="w-full text-left text-xs border border-slate-300">
            <thead className="bg-slate-100 font-bold border-b border-slate-300 text-[10px] uppercase">
              <tr>
                <th className="p-2 border-r border-slate-300">Kode</th>
                <th className="p-2 border-r border-slate-300">Lokasi & Ruas Jalan</th>
                <th className="p-2 border-r border-slate-300">Wilayah</th>
                <th className="p-2 border-r border-slate-300">Faktor Risiko Dominan</th>
                <th className="p-2 text-right">Batas Kecepatan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {criticalPoints.map((pt) => (
                <tr key={pt.id} className="text-[11px]">
                  <td className="p-2 border-r border-slate-300 font-mono font-bold">{pt.code}</td>
                  <td className="p-2 border-r border-slate-300">
                    <strong>{pt.name}</strong>
                    <div className="text-[10px] text-slate-600">{pt.roadName} {pt.kmMarker ? `(${pt.kmMarker})` : ''}</div>
                  </td>
                  <td className="p-2 border-r border-slate-300">{pt.cityRegency}, {pt.province}</td>
                  <td className="p-2 border-r border-slate-300 text-[10px] text-slate-700">
                    {pt.riskFactors[0]}
                  </td>
                  <td className="p-2 text-right font-mono font-bold">{pt.recommendedSpeedKmh} km/j</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Strategic Corridors Summary */}
        <div className="mb-6">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-2 border-b border-slate-300 pb-1">
            III. Koridor Transportasi Arus Puncak
          </h2>
          <div className="grid grid-cols-2 gap-2 text-xs">
            {TRANSPORT_CORRIDORS.map(c => (
              <div key={c.id} className="border border-slate-300 p-2.5 rounded bg-slate-50">
                <span className="font-bold text-slate-900 block">{c.name}</span>
                <span className="text-[10px] text-slate-600 block mt-0.5">Panjang: {c.lengthKm} km · Prediksi: <strong>{c.trafficForecast}</strong></span>
                <span className="text-[10px] font-mono text-slate-500 mt-1 block">Puncak: {c.peakPeriodEstimated}</span>
              </div>
            ))}
          </div>
        </div>

        {/* National Hotlines */}
        <div className="mb-6">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-2 border-b border-slate-300 pb-1">
            IV. Direktori Hotline Darurat Lapangan
          </h2>
          <div className="grid grid-cols-3 gap-2 text-xs">
            {OPERATIONAL_HOTLINES.slice(0, 6).map(h => (
              <div key={h.number} className="border border-slate-300 p-2 rounded">
                <span className="font-bold text-slate-900 block">{h.name}</span>
                <span className="text-sm font-bold font-mono text-blue-700 block mt-0.5">{h.number}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Signatures */}
        <div className="pt-8 border-t border-slate-300 grid grid-cols-2 text-center text-xs text-slate-700">
          <div>
            <div className="mb-14">Koordinator Posko Pemantauan Spasial,</div>
            <div className="font-bold uppercase text-slate-950 underline">KOMANDO SATGAS OPS NATARU</div>
            <div className="text-[10px] text-slate-500">Korlantas Polri · Ditjen Hubdat Kemenhub</div>
          </div>
          <div>
            <div className="mb-14">Mengetahui,</div>
            <div className="font-bold uppercase text-slate-950 underline">BADAN NASIONAL PENCARIAN & PERTOLONGAN</div>
            <div className="text-[10px] text-slate-500">Direktorat Kesiapsiagaan Operasi BASARNAS</div>
          </div>
        </div>
      </div>
    </div>
  );
};
