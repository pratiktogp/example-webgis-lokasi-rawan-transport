import React from 'react';
import { PhoneCall, Shield, Hospital, LifeBuoy, Compass, MapPin, CheckCircle2, AlertOctagon } from 'lucide-react';
import { OPERATIONAL_HOTLINES, EMERGENCY_POSTS, ESCAPE_RAMPS } from '../data/nataruData';

interface EmergencyDirectoryViewProps {
  onFlyTo: (coords: [number, number]) => void;
  onClose: () => void;
}

export const EmergencyDirectoryView: React.FC<EmergencyDirectoryViewProps> = ({ onFlyTo, onClose }) => {
  return (
    <div className="h-full w-full bg-slate-950 overflow-y-auto p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs text-sky-400 font-semibold mb-1">
            <PhoneCall className="w-4 h-4" />
            <span>JARINGAN TANGGAP DARURAT OPERASIONAL NATARU</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Direktori Hotline, Posko Terpadu & Jalur Penyelamat
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-3xl">
            Pusat koordinasi darurat 24 jam penanganan insiden, derek tol gratis, evakuasi medis, SAR maritim, dan mitigasi rem blong se-Indonesia.
          </p>
        </div>

        <button
          onClick={onClose}
          className="self-start sm:self-center px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-semibold transition cursor-pointer"
        >
          Kembali ke Peta
        </button>
      </div>

      {/* 1. National Hotlines Grid */}
      <div>
        <h2 className="text-sm font-bold text-white uppercase tracking-wider mb-3 flex items-center gap-2">
          <PhoneCall className="w-4 h-4 text-sky-400" />
          <span>Nomor Darurat Nasional Terpadu (Bebas Pulsa / 24 Jam)</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {OPERATIONAL_HOTLINES.map((h) => (
            <div 
              key={h.number}
              className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col justify-between hover:border-slate-700 transition"
            >
              <div>
                <span className="text-xs font-semibold text-slate-200 block">{h.name}</span>
                <span className="text-[11px] text-slate-400 mt-1 block leading-relaxed">{h.desc}</span>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
                <span className="text-base font-bold font-mono text-sky-400">{h.number}</span>
                <a
                  href={`tel:${h.number.split('/')[0].replace(/[^0-9]/g, '')}`}
                  className="px-2.5 py-1 bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 text-xs font-semibold rounded-lg transition"
                >
                  Panggil
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Integrated Posts */}
      <div>
        <h2 className="text-sm font-bold text-white uppercase tracking-wider mb-3 flex items-center gap-2">
          <Shield className="w-4 h-4 text-emerald-400" />
          <span>Posko Pelayanan Terpadu & RS Rujukan Trauma Center</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {EMERGENCY_POSTS.map((post) => (
            <div 
              key={post.id}
              className="bg-slate-900 border border-slate-800 rounded-xl p-4.5 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="text-emerald-400 font-semibold flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>{post.type}</span>
                  </span>
                  <span className="font-mono text-slate-400 text-[11px]">Siaga 24 Jam</span>
                </div>

                <h3 className="text-sm font-bold text-white mb-1 leading-snug">
                  {post.name}
                </h3>
                <p className="text-xs text-slate-400 mb-3">
                  {post.locationName}
                </p>

                <div className="space-y-1 mb-4">
                  <span className="text-[11px] text-slate-500 block font-medium">Unit Siaga di Lokasi:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {post.standbyUnits.map((u, i) => (
                      <span key={i} className="text-[11px] bg-slate-950 text-slate-300 px-2 py-0.5 rounded border border-slate-800">
                        {u}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-800 text-xs">
                <span className="font-mono text-sky-400 font-semibold">{post.phone}</span>
                <button
                  onClick={() => onFlyTo(post.coordinates)}
                  className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-medium flex items-center gap-1 transition cursor-pointer"
                >
                  <MapPin className="w-3.5 h-3.5 text-sky-400" />
                  <span>Lihat di Peta</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Emergency Escape Ramps */}
      <div>
        <h2 className="text-sm font-bold text-white uppercase tracking-wider mb-3 flex items-center gap-2">
          <AlertOctagon className="w-4 h-4 text-teal-400" />
          <span>Jalur Penyelamat Darurat (Emergency Escape Ramps) Terverifikasi</span>
        </h2>

        <div className="overflow-x-auto bg-slate-900 border border-slate-800 rounded-xl">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-[11px] text-slate-400 uppercase font-semibold border-b border-slate-800">
              <tr>
                <th className="p-3">Nama Jalur Penyelamat</th>
                <th className="p-3">Ruas Koridor</th>
                <th className="p-3">Material Dasar Rem</th>
                <th className="p-3">Status Inspeksi 2026</th>
                <th className="p-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {ESCAPE_RAMPS.map((ramp) => (
                <tr key={ramp.id} className="hover:bg-slate-800/50 transition">
                  <td className="p-3 font-semibold text-white">
                    {ramp.name}
                    <div className="text-[11px] text-slate-400 font-normal">{ramp.locationDetails}</div>
                  </td>
                  <td className="p-3 text-slate-300">{ramp.corridor}</td>
                  <td className="p-3 text-slate-400 font-mono text-[11px]">{ramp.bedMaterial}</td>
                  <td className="p-3 text-emerald-400 font-medium">
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                      <span>{ramp.lastInspected}</span>
                    </div>
                  </td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => onFlyTo(ramp.coordinates)}
                      className="px-2.5 py-1 bg-teal-500/20 hover:bg-teal-500/30 text-teal-300 rounded font-semibold text-xs transition cursor-pointer"
                    >
                      Peta
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
