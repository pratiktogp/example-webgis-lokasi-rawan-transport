import { WfsLayerConfig } from '../types/gis';

/**
 * Preset data & konfigurasi layer WFS GeoServer
 */
export const DEFAULT_WFS_PRESETS: WfsLayerConfig[] = [
  {
    id: 'wfs-preset-1',
    name: 'Jalur Tol & Koridor Utama (GeoServer WFS)',
    url: 'https://ahocevar.com/geoserver/wfs',
    typeName: 'osm:roads',
    version: '1.1.0',
    color: '#38bdf8', // Sky blue
    strokeWidth: 3,
    enabled: false,
    status: 'idle',
    sampleType: 'remote_wfs'
  },
  {
    id: 'wfs-preset-2',
    name: 'Batas Wilayah / States (GeoServer Topp)',
    url: 'https://ahocevar.com/geoserver/wfs',
    typeName: 'topp:states',
    version: '1.1.0',
    color: '#a855f7', // Purple
    strokeWidth: 2,
    enabled: false,
    status: 'idle',
    sampleType: 'remote_wfs'
  },
  {
    id: 'wfs-preset-3',
    name: 'Layer GeoServer Lokal Anda (Default Template)',
    url: 'http://localhost:8080/geoserver/wfs',
    typeName: 'nataru:titik_rawan',
    version: '1.1.0',
    color: '#10b981', // Emerald green
    strokeWidth: 2.5,
    enabled: false,
    status: 'idle',
    sampleType: 'remote_wfs'
  }
];

/**
 * Mapping Kecamatan untuk titik-titik rawan kecelakaan (Blackspots)
 */
export const BLACKSPOT_DISTRICT_MAP: Record<string, string> = {
  'bs-01': 'Kecamatan Cipeundeuy',
  'bs-02': 'Kecamatan Gantar',
  'bs-03': 'Kecamatan Nagreg',
  'bs-04': 'Kecamatan Gringsing',
  'bs-05': 'Kecamatan Gringsing',
  'bs-06': 'Kecamatan Tembalang',
  'bs-07': 'Kecamatan Pacet',
  'bs-08': 'Kecamatan Lawang',
  'bs-09': 'Kecamatan Bandar Kedungmulyo',
  'bs-10': 'Kecamatan Grogol',
  'bs-11': 'Kecamatan Cisarua',
  'bs-12': 'Kecamatan Sukatani',
  'bs-13': 'Kecamatan Bakauheni',
  'bs-14': 'Kecamatan Lubuk Kilangan',
  'bs-15': 'Kecamatan Harau',
  'bs-16': 'Kecamatan Praya Barat',
  'bs-17': 'Kecamatan Melaya',
  'bs-18': 'Kecamatan Samboja',
  'bs-19': 'Kecamatan Tanete Rilau',
  'bs-20': 'Kecamatan Likupang Timur',
  'bs-21': 'Kecamatan Baturiti',
  'bs-22': 'Kecamatan Sukasada',
  'bs-23': 'Kecamatan Pagelaran',
  'bs-24': 'Kecamatan Bayah',
};

export const getKecamatanName = (point: { id?: string; name?: string; cityRegency?: string; district?: string }): string => {
  if (point.district) return point.district;
  if (point.id && BLACKSPOT_DISTRICT_MAP[point.id]) {
    return BLACKSPOT_DISTRICT_MAP[point.id];
  }
  // Cek apakah ada kata "Kec." di dalam nama
  if (point.name && point.name.includes('Kec.')) {
    const parts = point.name.split('Kec.');
    return `Kecamatan ${parts[1].trim().split(' ')[0]}`;
  }
  return `Kecamatan di ${point.cityRegency || 'Wilayah Terkait'}`;
};
