import React, { useState } from 'react';
import { X, Copy, Check, Server, ShieldCheck, Globe, Database, AlertCircle, HelpCircle } from 'lucide-react';

interface GeoServerGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GeoServerGuideModal: React.FC<GeoServerGuideModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'cors' | 'geojson' | 'crs' | 'publishing'>('cors');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  if (!isOpen) return null;

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  const corsXmlSnippet = `<!-- Buka file: <CATALINA_HOME>/webapps/geoserver/WEB-INF/web.xml -->
<!-- Cari atau tambahkan filter CorsFilter berikut sebelum </web-app> : -->

<filter>
  <filter-name>CorsFilter</filter-name>
  <filter-class>org.apache.catalina.filters.CorsFilter</filter-class>
  <init-param>
    <param-name>cors.allowed.origins</param-name>
    <param-value>*</param-value>
  </init-param>
  <init-param>
    <param-name>cors.allowed.methods</param-name>
    <param-value>GET,POST,HEAD,OPTIONS</param-value>
  </init-param>
  <init-param>
    <param-name>cors.allowed.headers</param-name>
    <param-value>Content-Type,X-Requested-With,accept,Origin,Access-Control-Request-Method,Access-Control-Request-Headers</param-value>
  </init-param>
</filter>

<filter-mapping>
  <filter-name>CorsFilter</filter-name>
  <url-pattern>/*</url-pattern>
</filter-mapping>`;

  const wfsUrlExample = `http://localhost:8080/geoserver/wfs?service=WFS&version=1.1.0&request=GetFeature&typename=workspace:nama_layer&outputFormat=application/json&srsname=EPSG:3857`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="fixed inset-0" 
        onClick={onClose} 
        aria-hidden="true" 
      />

      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] z-10 text-slate-200">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-slate-950 border-b border-slate-800 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-sky-500/20 border border-sky-500/40 flex items-center justify-center text-sky-400">
              <Server className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">
                Panduan Integrasi GeoServer WFS
              </h2>
              <p className="text-xs text-slate-400">
                Langkah & syarat yang wajib dipenuhi agar data spasial GeoServer dapat ditarik oleh aplikasi
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
            title="Tutup"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 px-4 pt-3 border-b border-slate-800 bg-slate-950/60 overflow-x-auto text-xs">
          <button
            onClick={() => setActiveTab('cors')}
            className={`px-3 py-2 rounded-t-lg font-semibold flex items-center gap-1.5 transition cursor-pointer border-b-2 ${
              activeTab === 'cors'
                ? 'border-sky-500 text-sky-400 bg-slate-900'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>1. Aktifkan CORS (Wajib)</span>
          </button>
          <button
            onClick={() => setActiveTab('geojson')}
            className={`px-3 py-2 rounded-t-lg font-semibold flex items-center gap-1.5 transition cursor-pointer border-b-2 ${
              activeTab === 'geojson'
                ? 'border-sky-500 text-sky-400 bg-slate-900'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>2. Format GeoJSON</span>
          </button>
          <button
            onClick={() => setActiveTab('crs')}
            className={`px-3 py-2 rounded-t-lg font-semibold flex items-center gap-1.5 transition cursor-pointer border-b-2 ${
              activeTab === 'crs'
                ? 'border-sky-500 text-sky-400 bg-slate-900'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>3. Sistem Koordinat (SRS)</span>
          </button>
          <button
            onClick={() => setActiveTab('publishing')}
            className={`px-3 py-2 rounded-t-lg font-semibold flex items-center gap-1.5 transition cursor-pointer border-b-2 ${
              activeTab === 'publishing'
                ? 'border-sky-500 text-sky-400 bg-slate-900'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>4. Checklist & URL WFS</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 text-xs leading-relaxed">
          {activeTab === 'cors' && (
            <div className="space-y-3.5">
              <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl flex items-start gap-2.5 text-amber-300">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block">Paling Penting: Masalah CORS (Cross-Origin Resource Sharing)</span>
                  Browser secara default memblokir request JavaScript dari aplikasi web ke GeoServer Anda jika header CORS belum diizinkan di web server (Tomcat/Jetty).
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-white text-sm">Cara Mengaktifkan CORS di Apache Tomcat (GeoServer):</h4>
                <ol className="list-decimal list-inside space-y-1.5 text-slate-300 pl-1">
                  <li>Buka direktori instalasi GeoServer, masuk ke folder: <code className="px-1.5 py-0.5 bg-slate-800 text-sky-300 rounded font-mono">webapps/geoserver/WEB-INF/</code></li>
                  <li>Buka file <code className="px-1.5 py-0.5 bg-slate-800 text-sky-300 rounded font-mono">web.xml</code> dengan text editor (Notepad, VS Code, atau nano).</li>
                  <li>Cari bagian filter <code className="text-amber-300 font-mono">&lt;!-- CorsFilter --&gt;</code> dan hapus tanda komentar, atau salin kode berikut ke dalam file:</li>
                </ol>

                <div className="relative mt-2">
                  <pre className="p-3 bg-slate-950 border border-slate-800 rounded-xl font-mono text-[11px] text-emerald-400 overflow-x-auto">
                    {corsXmlSnippet}
                  </pre>
                  <button
                    onClick={() => copyToClipboard(corsXmlSnippet, 'cors-snippet')}
                    className="absolute top-2.5 right-2.5 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-md text-[11px] font-semibold flex items-center gap-1 transition cursor-pointer"
                  >
                    {copiedCode === 'cors-snippet' ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">Tersalin!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Salin XML</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-xl text-slate-400 mt-2">
                  <span className="text-white font-semibold block mb-0.5">Catatan Penting:</span>
                  Setelah mengubah file <code className="text-sky-300 font-mono">web.xml</code>, Anda <strong className="text-white">wajib merestart service Tomcat/GeoServer</strong> agar pengaturan CORS aktif.
                </div>
              </div>
            </div>
          )}

          {activeTab === 'geojson' && (
            <div className="space-y-3">
              <h4 className="font-bold text-white text-sm">Output Format: application/json (GeoJSON)</h4>
              <p className="text-slate-300">
                Aplikasi peta web modern (OpenLayers) membaca data vektor secara dinamis dalam format <strong className="text-sky-300">GeoJSON</strong>.
              </p>
              
              <div className="space-y-2 bg-slate-950/60 p-3.5 rounded-xl border border-slate-800">
                <div className="font-semibold text-white">Langkah verifikasi di GeoServer Web Admin:</div>
                <ul className="list-disc list-inside space-y-1 text-slate-300">
                  <li>Masuk ke menu <strong className="text-white">Services &gt; WFS</strong>.</li>
                  <li>Pastikan opsi <strong className="text-emerald-400">Service Level: Complete</strong> atau <strong className="text-emerald-400">Basic</strong> dicentang.</li>
                  <li>GeoServer versi 2.x ke atas sudah menyertakan plugin GeoJSON secara bawaan.</li>
                  <li>Buka browser dan uji URL WFS Anda secara manual. Jika mengunduh file JSON atau menampilkan struktur GeoJSON, berarti sudah benar.</li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'crs' && (
            <div className="space-y-3">
              <h4 className="font-bold text-white text-sm">Sistem Proyeksi Koordinat (CRS / SRS)</h4>
              <p className="text-slate-300">
                Agar data muncul tepat pada posisi geografis di atas basemap (Google Maps/OSM), layer di GeoServer harus memiliki definisi koordinat yang valid:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl">
                  <span className="font-bold text-sky-400 block mb-1">EPSG:4326 (WGS 84)</span>
                  <p className="text-slate-400 text-[11px]">
                    Koordinat derajat geografis lintang dan bujur (Longitude, Latitude). Format standar GPS dan data batas wilayah.
                  </p>
                </div>

                <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl">
                  <span className="font-bold text-emerald-400 block mb-1">EPSG:3857 (Web Mercator)</span>
                  <p className="text-slate-400 text-[11px]">
                    Sistem proyeksi standar peta web yang digunakan oleh Google Maps, OpenStreetMap, dan OpenLayers.
                  </p>
                </div>
              </div>

              <p className="text-slate-300">
                Di menu <strong>Layers &gt; Edit Layer &gt; Coordinate Reference Systems</strong>, pilih opsi <code className="text-amber-300 font-mono">Force Declared</code> atau <code className="text-amber-300 font-mono">Reproject native to declared</code> jika data asli Anda menggunakan koordinat UTM atau TM-3.
              </p>
            </div>
          )}

          {activeTab === 'publishing' && (
            <div className="space-y-3">
              <h4 className="font-bold text-white text-sm">Format URL GetFeature WFS</h4>
              <p className="text-slate-300">
                Aplikasi ini akan otomatis menyusun URL WFS GetFeature berdasarkan input yang Anda masukkan di Sidebar:
              </p>

              <div className="relative">
                <pre className="p-3 bg-slate-950 border border-slate-800 rounded-xl font-mono text-[11px] text-sky-300 overflow-x-auto whitespace-pre-wrap break-all">
                  {wfsUrlExample}
                </pre>
                <button
                  onClick={() => copyToClipboard(wfsUrlExample, 'wfs-url')}
                  className="mt-1 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-md text-[11px] font-semibold flex items-center gap-1 transition cursor-pointer"
                >
                  {copiedCode === 'wfs-url' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedCode === 'wfs-url' ? 'Tersalin!' : 'Salin Contoh URL'}</span>
                </button>
              </div>

              <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
                <span className="font-bold text-white block">Ringkasan Syarat yang Harus Dipenuhi:</span>
                <div className="space-y-1.5 text-slate-300">
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>GeoServer berjalan (running) dan dapat diakses dari browser.</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>CORS sudah diaktifkan di Tomcat/GeoServer.</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Layer berstatus Published dan memiliki izin Read publik (Anonymous).</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Typename layer sesuai format <code className="text-amber-300">workspace:nama_layer</code>.</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3.5 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
          <span className="text-[11px] text-slate-500">
            Dukungan WFS v1.0.0, v1.1.0, dan v2.0.0 (OpenLayers GeoJSON)
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold rounded-lg text-xs transition cursor-pointer"
          >
            Tutup Panduan
          </button>
        </div>
      </div>
    </div>
  );
};
