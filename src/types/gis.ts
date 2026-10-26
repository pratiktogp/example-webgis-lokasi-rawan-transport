/**
 * Types definition for WebGIS Pantauan Rawan Kecelakaan Nataru 2026/2027
 */

export type SeverityLevel = 'Tinggi' | 'Sedang' | 'Waspada';

export type TransportMode = 
  | 'Jalan Tol' 
  | 'Jalan Arteri Primer' 
  | 'Penyeberangan Ferry' 
  | 'Pelabuhan Laut' 
  | 'Jalur Wisata Pegunungan' 
  | 'Perlintasan Kereta Api';

export type RegionZone = 
  | 'Jawa - Bali' 
  | 'Sumatera' 
  | 'Kalimantan' 
  | 'Sulawesi' 
  | 'Nusa Tenggara' 
  | 'Maluku - Papua';

export interface BlackspotPoint {
  id: string;
  code: string;
  name: string;
  roadName: string;
  kmMarker?: string;
  district?: string; // Kecamatan
  province: string;
  cityRegency: string;
  region: RegionZone;
  transportMode: TransportMode;
  severity: SeverityLevel;
  coordinates: [number, number]; // [longitude, latitude] in EPSG:4326
  elevationMeters?: number;
  riskFactors: string[];
  historicalIncidentSummary?: string; // e.g. "12 Kasus Laka (2024-2025), 4 Korban Jiwa"
  recommendedSpeedKmh: number;
  mitigationActions: string[];
  nearestEmergencyPost: {
    name: string;
    distanceKm: number;
    phone: string;
  };
  facilities: string[]; // e.g. ["Jalur Penyelamat (Escape Ramp)", "Mobil Derek Gratis", "Pos Terpadu", "CCTV Korlantas"]
  description: string;
  operationalNotes2026: string;
}

export interface WfsLayerConfig {
  id: string;
  name: string;
  url: string; // e.g. http://localhost:8080/geoserver/wfs or https://ahocevar.com/geoserver/wfs
  typeName: string; // e.g. workspace:layer_name
  version?: '1.0.0' | '1.1.0' | '2.0.0';
  color: string;
  strokeWidth?: number;
  enabled: boolean;
  status?: 'idle' | 'loading' | 'loaded' | 'error';
  errorMessage?: string;
  featureCount?: number;
  sampleType?: 'remote_wfs' | 'geojson_wfs' | 'mock';
  customGeoJson?: any;
}

export interface TransportCorridor {
  id: string;
  name: string;
  code: string;
  type: 'Tol Trans Jawa' | 'Tol Trans Sumatera' | 'Lintas Arteri Pantura' | 'Lintas Pansela' | 'Penyeberangan Selat';
  coordinates: [number, number][]; // LineString coords
  lengthKm: number;
  peakPeriodEstimated: string; // e.g. "23 Des 2026 - 3 Jan 2027"
  trafficForecast: 'Sangat Padat' | 'Padat Lancar' | 'Waspada Antrean Penyeberangan' | 'Rawan Cuaca Ekstrem';
  description: string;
}

export interface EmergencyPost {
  id: string;
  name: string;
  type: 'Pos Terpadu POLRI' | 'Posko Kemenhub' | 'Kantor SAR / BASARNAS' | 'RS Rujukan Trauma Center';
  locationName: string;
  coordinates: [number, number];
  phone: string;
  active24h: boolean;
  standbyUnits: string[];
}

export interface EscapeRamp {
  id: string;
  name: string;
  corridor: string;
  locationDetails: string;
  coordinates: [number, number];
  bedMaterial: string; // e.g. "Kerikil Gravitasi & Drum Pasir"
  lastInspected: string;
}

export type BasemapId = 
  | 'google-maps' 
  | 'osm' 
  | 'google-satellite';

export interface FilterState {
  searchQuery: string;
  severity: SeverityLevel | 'Semua';
  transportMode: TransportMode | 'Semua';
  region: RegionZone | 'Semua';
  showHeatmap: boolean;
  showCorridors: boolean;
  showPosts: boolean;
  showEscapeRamps: boolean;
}
