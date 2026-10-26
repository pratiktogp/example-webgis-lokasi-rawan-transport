import React from 'react';
import { BookOpen, ShieldAlert, HeartPulse, CloudRain, Anchor, Car, AlertTriangle } from 'lucide-react';

interface SafetyGuideViewProps {
  onClose: () => void;
}

export const SafetyGuideView: React.FC<SafetyGuideViewProps> = ({ onClose }) => {
  return (
    <div className="h-full w-full bg-slate-950 overflow-y-auto p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs text-sky-400 font-semibold mb-1">
            <BookOpen className="w-4 h-4" />
            <span>SOP & PANDUAN KESELAMATAN OPERASIONAL</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Panduan Mitigasi Risiko Mudik & Libur Nataru 2026/2027
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
            Protokol keselamatan bagi pengemudi, pemudik lintas pulau, dan instruksi koordinasi bagi petugas lapangan terpadu.
          </p>
        </div>

        <button
          onClick={onClose}
          className="self-start sm:self-center px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-semibold transition cursor-pointer"
        >
          Kembali ke Peta
        </button>
      </div>

      {/* Guide Cards */}
      <div className="space-y-4">
        {/* 1. Microsleep & Fatigue Management */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center gap-2.5 text-red-400 font-bold text-sm mb-2">
            <HeartPulse className="w-5 h-5" />
            <span>1. Manajemen Kelelahan & Pencegahan Micro-sleep di Jalan Tol</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed mb-3">
            Kecelakaan fatal terbanyak di Tol Trans Jawa (Cipali, Batang, Ngawi) dan Tol Trans Sumatera (Bakter, Terpeka) disebabkan oleh fenomena kehilangan kesadaran sesaat (microsleep) antara pukul 01.00 – 06.00 WIB dan 13.00 – 15.00 WIB.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
              <span className="font-semibold text-white block mb-1">Aturan 4 Jam Max</span>
              <span className="text-slate-400 leading-snug">Wajib berhenti dan istirahat minimal 30 menit setiap maksimal 4 jam berkendara terus-menerus.</span>
            </div>
            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
              <span className="font-semibold text-white block mb-1">Tukar Pengemudi</span>
              <span className="text-slate-400 leading-snug">Jangan memaksakan mengemudi sendiri jika perjalanan lebih dari 8 jam. Siapkan pengemudi pengganti.</span>
            </div>
            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
              <span className="font-semibold text-white block mb-1">Manfaatkan Rest Area</span>
              <span className="text-slate-400 leading-snug">Gunakan fasilitas pos kesehatan gratis untuk cek tekanan darah dan tidur lelap 20 menit (power nap).</span>
            </div>
          </div>
        </div>

        {/* 2. Turunan Curam & Rem Blong */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center gap-2.5 text-amber-400 font-bold text-sm mb-2">
            <AlertTriangle className="w-5 h-5" />
            <span>2. Teknik Melintasi Turunan Curam & Menghindari Rem Blong (Vapor Lock)</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed mb-3">
            Titik seperti Turunan Nagreg, Cangar-Pacet, Sitinjau Lauik, dan Tol Jatingaleh Semarang menuntut kewaspadaan tinggi terhadap panas berlebih pada piringan rem (brake fade).
          </p>
          <div className="space-y-2 text-xs text-slate-300">
            <div className="flex items-start gap-2 bg-slate-950 p-2.5 rounded-lg border border-slate-800">
              <span className="text-amber-400 font-bold">A.</span>
              <span><strong>Gunakan Gigi Rendah (Engine Brake):</strong> Pindahkan transmisi ke gigi 2 atau 1 (atau mode L/M pada matic) sebelum turunan dimulai. Biarkan putaran mesin menahan laju kendaraan.</span>
            </div>
            <div className="flex items-start gap-2 bg-slate-950 p-2.5 rounded-lg border border-slate-800">
              <span className="text-amber-400 font-bold">B.</span>
              <span><strong>Jangan Injak Rem Terus-Menerus:</strong> Pengereman terus menerus mendidihkan minyak rem dan menyebabkan rem blong total tanpa daya cengkeram.</span>
            </div>
            <div className="flex items-start gap-2 bg-slate-950 p-2.5 rounded-lg border border-slate-800">
              <span className="text-amber-400 font-bold">C.</span>
              <span><strong>Arahkan ke Jalur Penyelamat (Escape Ramp):</strong> Jika rem terasa kosong atau mengeras, segera klakson panjang, nyalakan hazard, dan arahkan roda ke hamparan kerikil jalur penyelamat darurat.</span>
            </div>
          </div>
        </div>

        {/* 3. Aquaplaning & Cuaca Hujan */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center gap-2.5 text-sky-400 font-bold text-sm mb-2">
            <CloudRain className="w-5 h-5" />
            <span>3. Antisipasi Aquaplaning / Hydroplaning Saat Hujan Muson</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed mb-3">
            Periode libur Natal dan Tahun Baru 2026/2027 bertepatan dengan puncak musim hujan di wilayah barat dan tengah Indonesia.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
              <span className="font-semibold text-rose-300 block mb-1">DILARANG:</span>
              <ul className="list-disc list-inside text-slate-400 space-y-1">
                <li>Jangan menginjak pedal rem secara mendadak saat roda melayang.</li>
                <li>Jangan memutar kemudi secara drastis (oversteering).</li>
                <li>Jangan menyalakan lampu hazard saat jalan normal hujan (hanya saat berhenti darurat).</li>
              </ul>
            </div>
            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
              <span className="font-semibold text-emerald-300 block mb-1">DIANJURKAN:</span>
              <ul className="list-disc list-inside text-slate-400 space-y-1">
                <li>Turunkan kecepatan maksimal ke 60-70 km/jam saat aspal basah tergenang.</li>
                <li>Lepaskan injakan pedal gas secara perlahan hingga traksi ban kembali.</li>
                <li>Pegang kemudi dengan kedua tangan tetap lurus mengarah ke depan.</li>
              </ul>
            </div>
          </div>
        </div>

        {/* 4. Aturan Penyeberangan Ferry */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center gap-2.5 text-teal-400 font-bold text-sm mb-2">
            <Anchor className="w-5 h-5" />
            <span>4. Protokol Penyeberangan Pelabuhan Ferry (Merak & Ketapang)</span>
          </div>
          <div className="space-y-2 text-xs text-slate-300">
            <p className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
              <strong>Radius Geofencing Ferizy:</strong> Tidak ada penjualan tiket di dalam area pelabuhan. Tiket ferry wajib sudah dibeli minimal H-1 sebelum tiba di kawasan radius 4.71 km dari Pelabuhan Merak dan 2.5 km dari Pelabuhan Ketapang.
            </p>
            <p className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
              <strong>Buffer Zone Delay System:</strong> Jika terjadi kepadatan di dermaga, kendaraan akan diarahkan parkir sementara di Rest Area KM 43 A dan KM 68 A Tol Merak, atau Lapangan Bulusan Banyuwangi untuk pengaturan aliran masuk kapal.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
