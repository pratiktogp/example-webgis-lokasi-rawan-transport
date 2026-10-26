import React, { useState } from 'react';
import { 
  X, 
  Plus, 
  Layers, 
  Radio, 
  Trash2, 
  HelpCircle, 
  ExternalLink, 
  CheckCircle2, 
  AlertTriangle, 
  RefreshCw, 
  Flame,
  Globe,
  Palette,
  Eye,
  EyeOff
} from 'lucide-react';
import { WfsLayerConfig } from '../types/gis';

interface WfsSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  showBlackspots: boolean;
  onToggleBlackspots: (show: boolean) => void;
  showHeatmap: boolean;
  onToggleHeatmap: (show: boolean) => void;
  wfsLayers: WfsLayerConfig[];
  onToggleWfsLayer: (id: string, enabled: boolean) => void;
  onAddWfsLayer: (layer: WfsLayerConfig) => void;
  onDeleteWfsLayer: (id: string) => void;
  onOpenGuide: () => void;
  onLoadPreset: (presetId: string) => void;
}

export const WfsSidebar: React.FC<WfsSidebarProps> = ({
  isOpen,
  onClose,
  showBlackspots,
  onToggleBlackspots,
  showHeatmap,
  onToggleHeatmap,
  wfsLayers,
  onToggleWfsLayer,
  onAddWfsLayer,
  onDeleteWfsLayer,
  onOpenGuide,
  onLoadPreset
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  
  // Form states
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [typeName, setTypeName] = useState('');
  const [version, setVersion] = useState<'1.0.0' | '1.1.0' | '2.0.0'>('1.1.0');
  const [color, setColor] = useState('#38bdf8');
  const [formError, setFormError] = useState<string | null>(null);

  if (!isOpen) return null;

  const colorPalette = [
    { label: 'Biru Cerah', hex: '#38bdf8' },
    { label: 'Hijau Emerald', hex: '#10b981' },
    { label: 'Kuning Amber', hex: '#f59e0b' },
    { label: 'Ungu Violet', hex: '#a855f7' },
    { label: 'Merah Rose', hex: '#f43f5e' },
    { label: 'Cyan Teal', hex: '#14b8a6' }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!url.trim()) {
      setFormError('URL WFS GeoServer wajib diisi.');
      return;
    }
    if (!typeName.trim()) {
      setFormError('Typename layer wajib diisi (misal: workspace:nama_layer).');
      return;
    }

    const newLayer: WfsLayerConfig = {
      id: `wfs-custom-${Date.now()}`,
      name: name.trim() || typeName.trim(),
      url: url.trim(),
      typeName: typeName.trim(),
      version,
      color,
      strokeWidth: 2.5,
      enabled: true,
      status: 'loading'
    };

    onAddWfsLayer(newLayer);
    setName('');
    setUrl('');
    setTypeName('');
    setShowAddForm(false);
  };

  return (
    <div className="fixed inset-y-0 right-0 z-40 w-full sm:w-96 bg-slate-900/98 backdrop-blur-xl border-l border-slate-800 shadow-2xl flex flex-col font-sans text-slate-200 animate-in slide-in-from-right duration-250">
      {/* Sidebar Header */}
      <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between gap-2 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-sky-500/20 border border-sky-500/30 flex items-center justify-center text-sky-400">
            <Radio className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white tracking-tight flex items-center gap-1.5">
              <span>Kelola Layer & WFS</span>
            </h2>
            <p className="text-[10px] text-slate-400">
              Integrasi Data Spasial GeoServer
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={onOpenGuide}
            className="p-1.5 text-slate-400 hover:text-sky-300 hover:bg-slate-800 rounded-lg transition text-xs flex items-center gap-1 cursor-pointer"
            title="Buka Panduan Setup GeoServer"
          >
            <HelpCircle className="w-4 h-4 text-sky-400" />
            <span className="hidden sm:inline text-[11px] font-semibold text-sky-400">Panduan</span>
          </button>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition cursor-pointer"
            title="Tutup Panel"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Sidebar Body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-5 text-xs">
        {/* Layer Bawaan Section */}
        <div className="space-y-2">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
            <span>Layer Bawaan Sistem</span>
            <span className="text-[9px] text-slate-500">2 Layer</span>
          </div>

          {/* 1. Titik Rawan Marker */}
          <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500 border border-white"></span>
              </span>
              <div>
                <span className="font-semibold text-white block text-xs">Titik Rawan Nataru (Marker)</span>
                <span className="text-[10px] text-slate-400 block">Simbologi Berkedip 800ms / 2.000ms</span>
              </div>
            </div>

            <button
              onClick={() => onToggleBlackspots(!showBlackspots)}
              className={`p-1.5 rounded-lg border transition cursor-pointer flex items-center gap-1 text-[11px] font-semibold ${
                showBlackspots
                  ? 'bg-sky-500/20 text-sky-300 border-sky-500/40'
                  : 'bg-slate-800 text-slate-500 border-slate-700'
              }`}
              title={showBlackspots ? 'Klik untuk sembunyikan' : 'Klik untuk tampilkan'}
            >
              {showBlackspots ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
              <span>{showBlackspots ? 'Aktif' : 'Nonaktif'}</span>
            </button>
          </div>

          {/* 2. Heatmap Kerawanan */}
          <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-orange-500/20 border border-orange-500/30 flex items-center justify-center text-orange-400 shrink-0">
                <Flame className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-semibold text-white block text-xs">Heatmap Kerawanan</span>
                  <span className="px-1.5 py-0.2 text-[8px] font-bold bg-orange-500/20 text-orange-300 border border-orange-500/30 rounded">
                    Densitas
                  </span>
                </div>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <div className="w-10 h-1.5 rounded-full bg-gradient-to-r from-blue-500 via-amber-400 to-red-600" />
                  <span className="text-[10px] text-slate-400">Tinggi · Sedang · Waspada</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => onToggleHeatmap(!showHeatmap)}
              className={`p-1.5 rounded-lg border transition cursor-pointer flex items-center gap-1 text-[11px] font-semibold ${
                showHeatmap
                  ? 'bg-orange-500/20 text-orange-300 border-orange-500/40'
                  : 'bg-slate-800 text-slate-500 border-slate-700'
              }`}
              title={showHeatmap ? 'Klik untuk nonaktifkan Heatmap' : 'Klik untuk aktifkan Heatmap'}
            >
              {showHeatmap ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
              <span>{showHeatmap ? 'Aktif' : 'Nonaktif'}</span>
            </button>
          </div>
        </div>

        {/* WFS GeoServer Layers Section */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <span>Layer WFS GeoServer</span>
              <span className="px-1.5 py-0.2 bg-slate-800 text-slate-300 rounded font-mono text-[9px]">
                {wfsLayers.length}
              </span>
            </div>

            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="text-[11px] font-semibold text-sky-400 hover:text-sky-300 flex items-center gap-1 transition cursor-pointer"
            >
              <Plus className="w-3 h-3" />
              <span>{showAddForm ? 'Batal' : 'Tambah Layer WFS'}</span>
            </button>
          </div>

          {/* Form Tambah Layer WFS */}
          {showAddForm && (
            <form onSubmit={handleSubmit} className="p-3.5 bg-slate-950 border border-sky-500/30 rounded-xl space-y-3 animate-in fade-in duration-200">
              <div className="flex items-center justify-between pb-1 border-b border-slate-800">
                <span className="font-bold text-white text-xs">Tambah Sumber WFS</span>
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="text-slate-400 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              {formError && (
                <div className="p-2 bg-red-950/40 border border-red-800/50 rounded text-red-300 text-[11px]">
                  {formError}
                </div>
              )}

              <div>
                <label className="block text-[10px] font-semibold text-slate-400 mb-1">
                  Nama Label Layer:
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Contoh: Batas Jalan / Titik Longsor"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-slate-400 mb-1">
                  URL Endpoint WFS GeoServer: <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="http://localhost:8080/geoserver/wfs"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-slate-500 font-mono text-[11px] focus:outline-none focus:border-sky-500"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-slate-400 mb-1">
                  Typename / FeatureType: <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={typeName}
                  onChange={(e) => setTypeName(e.target.value)}
                  placeholder="workspace:nama_layer (contoh: osm:roads)"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-slate-500 font-mono text-[11px] focus:outline-none focus:border-sky-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-semibold text-slate-400 mb-1">
                    Versi WFS:
                  </label>
                  <select
                    value={version}
                    onChange={(e) => setVersion(e.target.value as any)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2 py-1.5 text-xs text-white focus:outline-none focus:border-sky-500"
                  >
                    <option value="1.1.0">WFS 1.1.0 (Standar)</option>
                    <option value="2.0.0">WFS 2.0.0</option>
                    <option value="1.0.0">WFS 1.0.0</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-semibold text-slate-400 mb-1">
                    Warna Garis / Simbol:
                  </label>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    {colorPalette.map((cp) => (
                      <button
                        key={cp.hex}
                        type="button"
                        onClick={() => setColor(cp.hex)}
                        className={`w-5 h-5 rounded-full transition cursor-pointer border ${
                          color === cp.hex ? 'ring-2 ring-white scale-110' : 'opacity-80 hover:opacity-100'
                        }`}
                        style={{ backgroundColor: cp.hex }}
                        title={cp.label}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold rounded-lg text-xs transition cursor-pointer flex items-center justify-center gap-1.5 shadow-lg shadow-sky-500/20"
              >
                <Plus className="w-4 h-4" />
                <span>Tarik Data & Aktifkan Layer</span>
              </button>
            </form>
          )}

          {/* List Layer WFS */}
          {wfsLayers.length === 0 ? (
            <div className="p-4 bg-slate-950/40 border border-dashed border-slate-800 rounded-xl text-center space-y-2">
              <Globe className="w-6 h-6 text-slate-600 mx-auto" />
              <p className="text-slate-400 text-[11px]">
                Belum ada layer WFS eksternal. Anda dapat menambahkan layer GeoServer Anda sendiri atau coba preset demo di bawah.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {wfsLayers.map((layer) => (
                <div
                  key={layer.id}
                  className={`p-3 rounded-xl border transition ${
                    layer.enabled 
                      ? 'bg-slate-950 border-slate-700 shadow-md' 
                      : 'bg-slate-950/40 border-slate-800/80 opacity-75'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-2.5 min-w-0">
                      <span 
                        className="w-3 h-3 rounded-full shrink-0 mt-0.5 border border-white/50" 
                        style={{ backgroundColor: layer.color }}
                      />
                      <div className="min-w-0">
                        <div className="font-semibold text-white truncate text-xs">
                          {layer.name}
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono truncate">
                          {layer.typeName}
                        </div>
                        <div className="text-[9px] text-slate-500 truncate mt-0.5">
                          {layer.url}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => onToggleWfsLayer(layer.id, !layer.enabled)}
                        className={`p-1.5 rounded-lg border transition cursor-pointer flex items-center gap-1 text-[10px] font-semibold ${
                          layer.enabled
                            ? 'bg-sky-500/20 text-sky-300 border-sky-500/40'
                            : 'bg-slate-800 text-slate-500 border-slate-700'
                        }`}
                        title={layer.enabled ? 'Sembunyikan layer' : 'Tampilkan layer'}
                      >
                        {layer.enabled ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                      </button>

                      <button
                        onClick={() => onDeleteWfsLayer(layer.id)}
                        className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-slate-800 rounded-lg transition cursor-pointer"
                        title="Hapus Layer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Status Indicator */}
                  <div className="mt-2 pt-2 border-t border-slate-800/60 flex items-center justify-between text-[10px]">
                    <span className="text-slate-500">Status:</span>
                    {layer.status === 'loading' && (
                      <span className="text-amber-400 flex items-center gap-1 font-medium animate-pulse">
                        <RefreshCw className="w-3 h-3 animate-spin" />
                        <span>Memuat fitur...</span>
                      </span>
                    )}
                    {layer.status === 'loaded' && (
                      <span className="text-emerald-400 flex items-center gap-1 font-medium">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Terkoneksi ({layer.featureCount ?? 'Aktif'})</span>
                      </span>
                    )}
                    {layer.status === 'error' && (
                      <div className="flex items-center gap-1 text-red-400 font-medium" title={layer.errorMessage || 'CORS terblokir atau server offline'}>
                        <AlertTriangle className="w-3 h-3 shrink-0" />
                        <span className="truncate max-w-[170px]">{layer.errorMessage || 'Gagal / Periksa CORS'}</span>
                      </div>
                    )}
                    {layer.status === 'idle' && (
                      <span className="text-slate-400">Siap</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Test Presets */}
        <div className="space-y-2 pt-2 border-t border-slate-800">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Coba Contoh Layer WFS Demo:
          </div>
          <div className="grid grid-cols-1 gap-1.5">
            <button
              onClick={() => onLoadPreset('wfs-preset-1')}
              className="w-full text-left p-2.5 bg-slate-950/80 hover:bg-slate-800 border border-slate-800 rounded-lg text-[11px] transition cursor-pointer flex items-center justify-between"
            >
              <div>
                <span className="font-semibold text-sky-300 block">Jalur Jalan OSM (GeoServer Demo)</span>
                <span className="text-[9px] text-slate-400 block font-mono">osm:roads · ahocevar.com</span>
              </div>
              <Plus className="w-3.5 h-3.5 text-sky-400 shrink-0 ml-1" />
            </button>

            <button
              onClick={() => onLoadPreset('wfs-preset-2')}
              className="w-full text-left p-2.5 bg-slate-950/80 hover:bg-slate-800 border border-slate-800 rounded-lg text-[11px] transition cursor-pointer flex items-center justify-between"
            >
              <div>
                <span className="font-semibold text-purple-300 block">Batas Wilayah Poligon (Topp States)</span>
                <span className="text-[9px] text-slate-400 block font-mono">topp:states · ahocevar.com</span>
              </div>
              <Plus className="w-3.5 h-3.5 text-purple-400 shrink-0 ml-1" />
            </button>
          </div>
        </div>

        {/* Banner Panduan Setup GeoServer */}
        <div className="p-3 bg-gradient-to-br from-sky-950/50 to-slate-900 border border-sky-800/40 rounded-xl space-y-2">
          <div className="flex items-center gap-2 text-sky-300 font-bold text-xs">
            <HelpCircle className="w-4 h-4 shrink-0" />
            <span>Bagaimana langkah menghubungkan GeoServer Anda?</span>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Jika Anda memiliki data di GeoServer lokal atau VPS, Anda perlu mengaktifkan <strong className="text-white">CORS di web.xml Tomcat</strong> dan mempublikasikan layer dalam format <strong className="text-white">GeoJSON</strong>.
          </p>
          <button
            onClick={onOpenGuide}
            className="w-full py-1.5 bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 border border-sky-500/40 font-semibold rounded-lg text-xs transition cursor-pointer flex items-center justify-center gap-1.5"
          >
            <span>Buka Panduan Lengkap Step-by-Step</span>
            <ExternalLink className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Sidebar Footer */}
      <div className="p-3 bg-slate-950 border-t border-slate-800 text-center text-[10px] text-slate-500 shrink-0">
        OpenLayers WFS Connector · Standard OGC Web Feature Service
      </div>
    </div>
  );
};
