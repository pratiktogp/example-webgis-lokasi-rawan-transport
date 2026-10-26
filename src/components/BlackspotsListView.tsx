import React, { useState } from 'react';
import { Search, Download, MapPin, Eye, ArrowUpDown, Filter, ChevronRight } from 'lucide-react';
import { BLACKSPOT_POINTS } from '../data/nataruData';
import { BlackspotPoint, SeverityLevel } from '../types/gis';

interface BlackspotsListViewProps {
  onSelectPoint: (point: BlackspotPoint) => void;
  onFlyTo: (coords: [number, number]) => void;
  onClose: () => void;
}

export const BlackspotsListView: React.FC<BlackspotsListViewProps> = ({
  onSelectPoint,
  onFlyTo,
  onClose
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSeverity, setSelectedSeverity] = useState<SeverityLevel | 'Semua'>('Semua');
  const [sortBy, setSortBy] = useState<'name' | 'severity' | 'speed'>('severity');
  const [sortAsc, setSortAsc] = useState(true);

  const filtered = BLACKSPOT_POINTS.filter((p) => {
    const matchesSearch = 
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.roadName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.cityRegency.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.province.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.code.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSeverity = selectedSeverity === 'Semua' || p.severity === selectedSeverity;
    return matchesSearch && matchesSeverity;
  }).sort((a, b) => {
    if (sortBy === 'name') {
      return sortAsc ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
    }
    if (sortBy === 'speed') {
      return sortAsc ? a.recommendedSpeedKmh - b.recommendedSpeedKmh : b.recommendedSpeedKmh - a.recommendedSpeedKmh;
    }
    // Severity sort (Tinggi -> Sedang -> Waspada)
    const weight = { 'Tinggi': 3, 'Sedang': 2, 'Waspada': 1 };
    return sortAsc ? weight[b.severity] - weight[a.severity] : weight[a.severity] - weight[b.severity];
  });

  const exportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(BLACKSPOT_POINTS, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", "titik_rawan_laka_nataru_2026_2027.json");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const exportCSV = () => {
    const headers = ["Kode", "Nama Lokasi", "Ruas Jalan", "KM", "Provinsi", "Kabupaten/Kota", "Wilayah", "Moda Transportasi", "Tingkat Kerawanan", "Longitude", "Latitude", "Batas Kecepatan KMH", "Catatan Historis"];
    const rows = BLACKSPOT_POINTS.map(p => [
      p.code,
      `"${p.name.replace(/"/g, '""')}"`,
      `"${p.roadName.replace(/"/g, '""')}"`,
      `"${p.kmMarker || ''}"`,
      `"${p.province}"`,
      `"${p.cityRegency}"`,
      `"${p.region}"`,
      `"${p.transportMode}"`,
      p.severity,
      p.coordinates[0],
      p.coordinates[1],
      p.recommendedSpeedKmh,
      `"${(p.historicalIncidentSummary || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'data_blackspot_nataru_2026_2027.csv');
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  return (
    <div className="h-full w-full bg-slate-950 overflow-y-auto p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs text-sky-400 font-semibold mb-1">
            <Filter className="w-4 h-4" />
            <span>DATABASE SPASIAL NASIONAL</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Daftar Lengkap Titik Rawan Kecelakaan (Blackspot)
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Total {BLACKSPOT_POINTS.length} titik pantauan prioritas Operasi Lilin & Angkutan Nataru 2026/2027 seluruh wilayah NKRI.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={exportCSV}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
            title="Unduh format spreadsheet CSV"
          >
            <Download className="w-3.5 h-3.5 text-emerald-400" />
            <span>Ekspor CSV</span>
          </button>
          
          <button
            onClick={exportJSON}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
            title="Unduh format GeoJSON"
          >
            <Download className="w-3.5 h-3.5 text-sky-400" />
            <span>Ekspor JSON</span>
          </button>

          <button
            onClick={onClose}
            className="px-3 py-1.5 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold rounded-lg text-xs transition cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>

      {/* Toolbar filter */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between bg-slate-900 p-3 rounded-xl border border-slate-800">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari kode, nama jalan, kota, provinsi..."
            className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 text-xs">
            {(['Semua', 'Tinggi', 'Sedang', 'Waspada'] as const).map((sev) => (
              <button
                key={sev}
                onClick={() => setSelectedSeverity(sev)}
                className={`px-2.5 py-1 text-xs rounded transition cursor-pointer ${
                  selectedSeverity === sev 
                    ? 'bg-sky-500/20 text-sky-300 font-bold border border-sky-500/40' 
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                {sev}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Table view */}
      <div className="overflow-x-auto bg-slate-900 border border-slate-800 rounded-xl">
        <table className="w-full text-left text-xs text-slate-300 divide-y divide-slate-800">
          <thead className="bg-slate-950 text-[11px] text-slate-400 uppercase font-semibold">
            <tr>
              <th className="p-3">Kode & Lokasi</th>
              <th className="p-3">Ruas Jalan / KM</th>
              <th className="p-3">Wilayah</th>
              <th className="p-3">Moda Transportasi</th>
              <th className="p-3">Tingkat Kerawanan</th>
              <th className="p-3 text-right">Batas Kecepatan</th>
              <th className="p-3 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-8 text-center text-slate-500 text-xs">
                  Tidak ada titik yang cocok dengan kriteria pencarian.
                </td>
              </tr>
            ) : (
              filtered.map((pt) => (
                <tr key={pt.id} className="hover:bg-slate-800/40 transition">
                  <td className="p-3">
                    <span className="font-mono text-[10px] text-slate-400 block">{pt.code}</span>
                    <span className="font-semibold text-white text-xs">{pt.name}</span>
                  </td>
                  <td className="p-3 text-slate-300">
                    <div>{pt.roadName}</div>
                    {pt.kmMarker && <div className="text-[11px] font-mono text-slate-400">{pt.kmMarker}</div>}
                  </td>
                  <td className="p-3 text-slate-400">
                    <div>{pt.cityRegency}</div>
                    <div className="text-[11px] text-slate-500">{pt.province}</div>
                  </td>
                  <td className="p-3 text-slate-300">{pt.transportMode}</td>
                  <td className="p-3">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold ${
                      pt.severity === 'Tinggi' 
                        ? 'bg-red-500/20 text-red-300 border border-red-500/40' 
                        : pt.severity === 'Sedang'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                        : 'bg-sky-500/20 text-sky-300 border border-sky-500/40'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        pt.severity === 'Tinggi' ? 'bg-red-500' : pt.severity === 'Sedang' ? 'bg-amber-400' : 'bg-sky-400'
                      }`} />
                      <span>{pt.severity}</span>
                    </span>
                  </td>
                  <td className="p-3 text-right font-mono tabular-nums font-semibold text-slate-200">
                    {pt.recommendedSpeedKmh} km/j
                  </td>
                  <td className="p-3 text-right space-x-1.5 whitespace-nowrap">
                    <button
                      onClick={() => onSelectPoint(pt)}
                      className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-xs transition cursor-pointer"
                      title="Lihat Detail Inspeksi"
                    >
                      <Eye className="w-3.5 h-3.5 inline mr-1 text-sky-400" />
                      Detail
                    </button>
                    <button
                      onClick={() => {
                        onFlyTo(pt.coordinates);
                        onClose();
                      }}
                      className="px-2 py-1 bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 rounded text-xs font-semibold transition cursor-pointer"
                      title="Buka Posisi di Peta"
                    >
                      <MapPin className="w-3.5 h-3.5 inline mr-1" />
                      Peta
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
