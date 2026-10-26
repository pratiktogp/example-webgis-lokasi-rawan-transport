import React from 'react';
import { Printer, MapPin, ShieldAlert, Route, PhoneCall, BookOpen } from 'lucide-react';

interface TopNavbarProps {
  activeView: 'map' | 'list' | 'corridors' | 'emergency' | 'guide';
  setActiveView: (view: 'map' | 'list' | 'corridors' | 'emergency' | 'guide') => void;
  onPrintReport: () => void;
  totalBlackspots: number;
  criticalCount: number;
}

export const TopNavbar: React.FC<TopNavbarProps> = ({
  activeView,
  setActiveView,
  onPrintReport,
  totalBlackspots,
  criticalCount
}) => {
  return (
    <header className="h-14 border-b border-slate-800 bg-slate-950/95 backdrop-blur-md px-4 lg:px-6 flex items-center justify-between gap-8 z-30 shrink-0">
      {/* Zone 1: Single text element wordmark */}
      <a 
        href="#"
        onClick={(e) => { e.preventDefault(); setActiveView('map'); }}
        className="text-base lg:text-lg font-bold tracking-tight text-white hover:text-sky-400 transition-colors whitespace-nowrap shrink-0 flex items-center gap-2"
      >
        <span className="w-2.5 h-2.5 rounded-full bg-red-500 shadow-sm shadow-red-500/50"></span>
        <span>SIG Pantauan Rawan Laka Nataru 2026/2027</span>
      </a>

      {/* Zone 2: 4-5 clean single-line text navigation links */}
      <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
        <button
          onClick={() => setActiveView('map')}
          className={`flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
            activeView === 'map' ? 'text-sky-400 font-semibold' : 'hover:text-white text-slate-400'
          }`}
        >
          <MapPin className="w-4 h-4" />
          <span>Peta Operasi</span>
        </button>

        <button
          onClick={() => setActiveView('list')}
          className={`flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
            activeView === 'list' ? 'text-sky-400 font-semibold' : 'hover:text-white text-slate-400'
          }`}
        >
          <ShieldAlert className="w-4 h-4" />
          <span>Daftar Titik Rawan</span>
          <span className="ml-1 text-xs px-1.5 py-0.2 bg-slate-800 text-slate-300 rounded font-mono tabular-nums">
            {totalBlackspots}
          </span>
        </button>

        <button
          onClick={() => setActiveView('corridors')}
          className={`flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
            activeView === 'corridors' ? 'text-sky-400 font-semibold' : 'hover:text-white text-slate-400'
          }`}
        >
          <Route className="w-4 h-4" />
          <span>Koridor Strategis</span>
        </button>

        <button
          onClick={() => setActiveView('emergency')}
          className={`flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
            activeView === 'emergency' ? 'text-sky-400 font-semibold' : 'hover:text-white text-slate-400'
          }`}
        >
          <PhoneCall className="w-4 h-4" />
          <span>Posko & Hotline</span>
        </button>

        <button
          onClick={() => setActiveView('guide')}
          className={`flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
            activeView === 'guide' ? 'text-sky-400 font-semibold' : 'hover:text-white text-slate-400'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>SOP Mitigasi</span>
        </button>
      </nav>

      {/* Zone 3: 1 primary action */}
      <div className="flex items-center gap-3 shrink-0">
        <div className="hidden xl:flex items-center gap-2 text-xs text-slate-400 mr-2">
          <span>Kritis:</span>
          <span className="font-mono tabular-nums text-red-400 font-semibold">{criticalCount} Lokasi</span>
          <span aria-hidden="true">·</span>
          <span>Status:</span>
          <span className="text-emerald-400 font-medium">Siaga Nataru</span>
        </div>
        
        <button
          onClick={onPrintReport}
          className="px-3.5 py-1.5 text-xs font-semibold text-slate-900 bg-sky-400 hover:bg-sky-300 active:bg-sky-500 rounded-lg transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 shadow-sm shadow-sky-500/20 cursor-pointer"
        >
          <Printer className="w-3.5 h-3.5" />
          <span>Cetak Laporan</span>
        </button>
      </div>
    </header>
  );
};
