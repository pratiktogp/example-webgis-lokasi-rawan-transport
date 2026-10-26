import React from 'react';
import { 
  Search, 
  Filter, 
  MapPin, 
  Layers, 
  AlertTriangle, 
  Route, 
  Shield, 
  Compass, 
  ArrowUpRight, 
  ChevronRight,
  X
} from 'lucide-react';
import { BlackspotPoint, FilterState, RegionZone, TransportMode, SeverityLevel, BasemapId } from '../types/gis';

interface SidebarFilterProps {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  filteredPoints: BlackspotPoint[];
  selectedPoint: BlackspotPoint | null;
  onSelectPoint: (point: BlackspotPoint) => void;
  onFlyTo: (coords: [number, number]) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  basemap: BasemapId;
  setBasemap: (b: BasemapId) => void;
}

export const SidebarFilter: React.FC<SidebarFilterProps> = ({
  filters,
  setFilters,
  filteredPoints,
  selectedPoint,
  onSelectPoint,
  onFlyTo,
  isCollapsed,
  onToggleCollapse,
  basemap,
  setBasemap
}) => {
  const regions: (RegionZone | 'Semua')[] = [
    'Semua',
    'Jawa - Bali',
    'Sumatera',
    'Kalimantan',
    'Sulawesi',
    'Nusa Tenggara',
    'Maluku - Papua'
  ];

  const modes: (TransportMode | 'Semua')[] = [
    'Semua',
    'Jalan Tol',
    'Jalan Arteri Primer',
    'Penyeberangan Ferry',
    'Pelabuhan Laut',
    'Jalur Wisata Pegunungan',
    'Perlintasan Kereta Api'
  ];

  const severities: (SeverityLevel | 'Semua')[] = ['Semua', 'Tinggi', 'Sedang', 'Waspada'];

  return (
    <aside 
      className={`relative h-full bg-slate-900 border-r border-slate-800 flex flex-col z-20 transition-all duration-300 ${
        isCollapsed ? 'w-0 overflow-hidden border-r-0' : 'w-80 md:w-96'
      }`}
    >
      {/* Top Header of Sidebar */}
      <div className="p-4 border-b border-slate-800 flex items-center justify-between shrink-0">
        <div>
          <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Filter className="w-4 h-4 text-sky-400" />
            <span>Filter & Pantauan Titik</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Ditemukan <span className="font-mono tabular-nums font-semibold text-sky-400">{filteredPoints.length}</span> lokasi rawan laka
          </p>
        </div>
        <button
          onClick={onToggleCollapse}
          className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition cursor-pointer"
          title="Tutup Panel Filter"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Filter Controls Area */}
      <div className="p-4 border-b border-slate-800 space-y-3.5 shrink-0 bg-slate-900/50">
        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={filters.searchQuery}
            onChange={(e) => setFilters(prev => ({ ...prev, searchQuery: e.target.value }))}
            placeholder="Cari lokasi, KM tol, ruas jalan..."
            className="w-full bg-slate-950/80 border border-slate-700/80 rounded-lg pl-9 pr-8 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 transition"
          />
          {filters.searchQuery && (
            <button
              onClick={() => setFilters(prev => ({ ...prev, searchQuery: '' }))}
              className="absolute right-2.5 top-2.5 text-slate-400 hover:text-white text-xs cursor-pointer"
            >
              ✕
            </button>
          )}
        </div>

        {/* Severity Filter Tabs */}
        <div>
          <label className="text-[11px] font-semibold text-slate-400 block mb-1.5 uppercase tracking-wider">
            Tingkat Kerawanan
          </label>
          <div className="grid grid-cols-4 gap-1 p-1 bg-slate-950 rounded-lg border border-slate-800">
            {severities.map((sev) => {
              const active = filters.severity === sev;
              let activeClass = 'bg-slate-800 text-white font-semibold';
              if (active) {
                if (sev === 'Tinggi') activeClass = 'bg-red-500/20 text-red-300 border border-red-500/40 font-bold';
                else if (sev === 'Sedang') activeClass = 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold';
                else if (sev === 'Waspada') activeClass = 'bg-sky-500/20 text-sky-300 border border-sky-500/40 font-bold';
                else activeClass = 'bg-slate-700 text-white font-bold';
              }
              return (
                <button
                  key={sev}
                  onClick={() => setFilters(prev => ({ ...prev, severity: sev }))}
                  className={`py-1 text-[11px] rounded transition cursor-pointer text-center ${
                    active ? activeClass : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {sev}
                </button>
              );
            })}
          </div>
        </div>

        {/* Dropdowns row */}
        <div className="grid grid-cols-2 gap-2">
          {/* Region Dropdown */}
          <div>
            <label className="text-[11px] font-semibold text-slate-400 block mb-1 uppercase tracking-wider">
              Wilayah / Koridor
            </label>
            <select
              value={filters.region}
              onChange={(e) => setFilters(prev => ({ ...prev, region: e.target.value as any }))}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-sky-500 transition"
            >
              {regions.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>

          {/* Transport Mode Dropdown */}
          <div>
            <label className="text-[11px] font-semibold text-slate-400 block mb-1 uppercase tracking-wider">
              Moda Transportasi
            </label>
            <select
              value={filters.transportMode}
              onChange={(e) => setFilters(prev => ({ ...prev, transportMode: e.target.value as any }))}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-sky-500 transition"
            >
              {modes.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Layer Visibility Toggles */}
        <div className="pt-1">
          <label className="text-[11px] font-semibold text-slate-400 block mb-1.5 uppercase tracking-wider">
            Layer Aktif di Peta
          </label>
          <div className="grid grid-cols-3 gap-1.5 text-[11px]">
            <button
              onClick={() => setFilters(prev => ({ ...prev, showCorridors: !prev.showCorridors }))}
              className={`p-1.5 rounded border transition flex items-center justify-center gap-1 cursor-pointer ${
                filters.showCorridors 
                  ? 'bg-slate-800 border-sky-500/50 text-sky-300 font-medium' 
                  : 'bg-slate-950 border-slate-800 text-slate-500 hover:text-slate-300'
              }`}
            >
              <Route className="w-3 h-3" />
              <span>Jalur Tol/Arteri</span>
            </button>

            <button
              onClick={() => setFilters(prev => ({ ...prev, showPosts: !prev.showPosts }))}
              className={`p-1.5 rounded border transition flex items-center justify-center gap-1 cursor-pointer ${
                filters.showPosts 
                  ? 'bg-slate-800 border-blue-500/50 text-blue-300 font-medium' 
                  : 'bg-slate-950 border-slate-800 text-slate-500 hover:text-slate-300'
              }`}
            >
              <Shield className="w-3 h-3" />
              <span>Posko & SAR</span>
            </button>

            <button
              onClick={() => setFilters(prev => ({ ...prev, showEscapeRamps: !prev.showEscapeRamps }))}
              className={`p-1.5 rounded border transition flex items-center justify-center gap-1 cursor-pointer ${
                filters.showEscapeRamps 
                  ? 'bg-slate-800 border-teal-500/50 text-teal-300 font-medium' 
                  : 'bg-slate-950 border-slate-800 text-slate-500 hover:text-slate-300'
              }`}
            >
              <Compass className="w-3 h-3" />
              <span>Penyelamat</span>
            </button>
          </div>
        </div>

        {/* Basemap Switcher Section */}
        <div className="pt-1">
          <label className="text-[11px] font-semibold text-slate-400 block mb-1.5 uppercase tracking-wider flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-sky-400" />
              <span>Peta Dasar (Basemap)</span>
            </span>
            <span className="text-[10px] text-sky-400 font-mono">5 Sumber</span>
          </label>
          <div className="grid grid-cols-2 gap-1.5 text-xs">
            {[
              { id: 'carto-dark', label: 'Operasional Gelap', desc: 'Kontras Tinggi' },
              { id: 'carto-light', label: 'Positron Terang', desc: 'Bersih & Jelas' },
              { id: 'esri-sat', label: 'Satelit Citra', desc: 'Foto Udara Esri' },
              { id: 'osm', label: 'OpenStreetMap', desc: 'Standar Komunitas' },
              { id: 'opentopo', label: 'Topografi', desc: 'Elevasi & Kontur' }
            ].map(bm => (
              <button
                key={bm.id}
                onClick={() => setBasemap(bm.id as BasemapId)}
                className={`p-2 rounded-lg border text-left transition cursor-pointer ${
                  basemap === bm.id
                    ? 'bg-sky-500/20 border-sky-400 text-sky-200 font-bold shadow-sm'
                    : 'bg-slate-950/70 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-[11px] truncate">{bm.label}</span>
                  {basemap === bm.id && <span className="w-1.5 h-1.5 rounded-full bg-sky-400 shrink-0 ml-1"></span>}
                </div>
                <div className="text-[10px] text-slate-500 font-normal truncate">{bm.desc}</div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Filtered Points List (Scrollable) */}
      <div className="flex-1 overflow-y-auto divide-y divide-slate-800/60 p-2 space-y-1">
        {filteredPoints.length === 0 ? (
          <div className="text-center py-10 px-4 text-slate-500 text-xs">
            Tidak ditemukan titik rawan sesuai kriteria pencarian / filter. Silakan reset kata kunci.
          </div>
        ) : (
          filteredPoints.map((pt) => {
            const isSelected = selectedPoint?.id === pt.id;
            return (
              <div
                key={pt.id}
                onClick={() => {
                  onSelectPoint(pt);
                  onFlyTo(pt.coordinates);
                }}
                className={`p-3 rounded-lg transition-all cursor-pointer text-left ${
                  isSelected 
                    ? 'bg-sky-500/15 border border-sky-500/40' 
                    : 'hover:bg-slate-800/60 border border-transparent'
                }`}
              >
                {/* Header row: Severity status + Code (Zero-pill text styling) */}
                <div className="flex items-center justify-between gap-2 text-xs mb-1">
                  <div className="flex items-center gap-1.5">
                    <span className={`w-2 h-2 rounded-full ${
                      pt.severity === 'Tinggi' ? 'bg-red-500' : pt.severity === 'Sedang' ? 'bg-amber-400' : 'bg-sky-400'
                    }`} />
                    <span className={`font-semibold ${
                      pt.severity === 'Tinggi' ? 'text-red-400' : pt.severity === 'Sedang' ? 'text-amber-400' : 'text-sky-400'
                    }`}>
                      {pt.severity}
                    </span>
                    <span className="text-slate-500" aria-hidden="true">·</span>
                    <span className="text-slate-400">{pt.transportMode}</span>
                  </div>
                  <span className="font-mono text-[10px] text-slate-500">{pt.code}</span>
                </div>

                {/* Location Title */}
                <h4 className="text-xs font-semibold text-slate-100 leading-snug line-clamp-1">
                  {pt.name}
                </h4>

                {/* Road details */}
                <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                  {pt.roadName} {pt.kmMarker ? `(${pt.kmMarker})` : ''}
                </p>

                {/* Unboxed Metadata row */}
                <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-2">
                  <span>{pt.province}</span>
                  <span aria-hidden="true">·</span>
                  <span className="font-mono tabular-nums text-slate-300">Batas {pt.recommendedSpeedKmh} km/j</span>
                  <span aria-hidden="true">·</span>
                  <span className="text-sky-400 flex items-center gap-0.5 ml-auto">
                    Fokus <ArrowUpRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Bottom Summary Bar */}
      <div className="p-3 border-t border-slate-800 bg-slate-950/80 text-[11px] text-slate-400 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <span>Kesiapsiagaan Posko:</span>
          <span className="font-mono tabular-nums text-emerald-400 font-semibold">24 Jam Standby</span>
        </div>
        <button
          onClick={() => {
            setFilters({
              searchQuery: '',
              severity: 'Semua',
              transportMode: 'Semua',
              region: 'Semua',
              showHeatmap: false,
              showCorridors: true,
              showPosts: true,
              showEscapeRamps: true
            });
          }}
          className="text-xs text-slate-400 hover:text-white underline cursor-pointer"
        >
          Reset Filter
        </button>
      </div>
    </aside>
  );
};
