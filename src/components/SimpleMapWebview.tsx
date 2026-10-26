import React, { useEffect, useRef, useState, useCallback } from 'react';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import Heatmap from 'ol/layer/Heatmap';
import OSM from 'ol/source/OSM';
import XYZ from 'ol/source/XYZ';
import VectorSource from 'ol/source/Vector';
import Feature, { FeatureLike } from 'ol/Feature';
import Point from 'ol/geom/Point';
import Overlay from 'ol/Overlay';
import { fromLonLat, toLonLat } from 'ol/proj';
import { Style, Fill, Stroke, Circle as CircleStyle } from 'ol/style';
import { ScaleLine } from 'ol/control';
import { getVectorContext } from 'ol/render';
import GeoJSON from 'ol/format/GeoJSON';

import { BLACKSPOT_POINTS } from '../data/nataruData';
import { BlackspotPoint, BasemapId, WfsLayerConfig } from '../types/gis';
import { DEFAULT_WFS_PRESETS, getKecamatanName } from '../data/wfsPresets';
import { WfsSidebar } from './WfsSidebar';
import { GeoServerGuideModal } from './GeoServerGuideModal';

import { 
  Layers, 
  Search, 
  X, 
  MapPin, 
  AlertTriangle, 
  ExternalLink, 
  Copy, 
  Check, 
  Compass, 
  Radio, 
  HelpCircle, 
  Maximize2,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Info,
  Ruler,
  Flame,
  Plus,
  Minus,
  RotateCcw,
  SlidersHorizontal,
  Eye,
  EyeOff
} from 'lucide-react';

// Format atribut individual untuk popup dengan judul dan nilai
export interface FeatureAttribute {
  label: string; // Judul atribut yang ramah pengguna
  value: string; // Nilai asli atribut
}

// Format info fitur (baik bawaan sistem maupun WFS)
export interface GenericFeatureInfo {
  title: string; // Nilai asli objek (BUKAN nama field teknis)
  subtitle?: string;
  attributes: FeatureAttribute[];
  severity?: 'Tinggi' | 'Sedang' | 'Waspada' | 'Info';
  coordinates: [number, number];
  isWfsFeature?: boolean;
}

// Helper formatting label dari nama kolom teknis WFS menjadi label ramah pengguna
function formatAttributeLabel(key: string): string {
  const dictionary: Record<string, string> = {
    state_name: 'Nama Wilayah / State',
    state_abbr: 'Kode Singkatan',
    state_fips: 'Kode FIPS Wilayah',
    sub_region: 'Sub Wilayah',
    pop1990: 'Populasi (1990)',
    persons: 'Jumlah Penduduk',
    families: 'Jumlah Keluarga',
    houshold: 'Jumlah Rumah Tangga',
    male: 'Penduduk Laki-laki',
    female: 'Penduduk Perempuan',
    employed: 'Tenaga Kerja',
    unemploy: 'Tingkat Pengangguran',
    land_km: 'Luas Daratan (km²)',
    water_km: 'Luas Perairan (km²)',
    road_name: 'Nama Ruas Jalan',
    highway: 'Klasifikasi Jalan',
    maxspeed: 'Batas Kecepatan',
    oneway: 'Satu Arah',
    surface: 'Jenis Perkerasan',
    lanes: 'Jumlah Lajur',
    kecamatan: 'Kecamatan',
    kabupaten: 'Kabupaten / Kota',
    kota: 'Kabupaten / Kota',
    provinsi: 'Provinsi',
    alamat: 'Alamat / Lokasi',
    status: 'Status Operasional',
    keterangan: 'Keterangan',
    penyebab: 'Penyebab Kerawanan',
    tipe: 'Tipe Objek',
    panjang: 'Panjang Ruas',
    lebar: 'Lebar Jalan'
  };

  const lower = key.toLowerCase();
  if (dictionary[lower]) {
    return dictionary[lower];
  }

  // Format snake_case, camelCase, UPPER_CASE ke Title Case yang rapi
  return key
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/[_-]+/g, ' ')
    .trim()
    .split(/\s+/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

// Helper formatting value atribut
function formatAttributeValue(val: any): string {
  if (val === null || val === undefined) return '-';
  if (typeof val === 'number') {
    return val.toLocaleString('id-ID');
  }
  if (typeof val === 'boolean') {
    return val ? 'Ya' : 'Tidak';
  }
  if (Array.isArray(val)) {
    return val.filter(Boolean).join(', ');
  }
  return String(val).trim();
}

// Helper deteksi nilai asli untuk dijadikan title popup (BUKAN nama field teknis)
function extractFeatureTitle(props: Record<string, any>, fallback = 'Fitur Spasial'): string {
  // Prioritas key yang nilainya merepresentasikan identitas objek
  const candidateKeys = [
    'name', 'nama', 'NAMA', 'NAME',
    'nama_objek', 'NAMOBJ', 'nama_jalan', 'nama_lokasi',
    'ROAD_NAME', 'road_name', 'jalan', 'JALAN',
    'STATE_NAME', 'state_name', 'WILAYAH',
    'title', 'TITLE', 'label', 'keterangan'
  ];

  for (const k of candidateKeys) {
    const v = props[k];
    if (v && typeof v === 'string' && v.trim().length > 0) {
      return v.trim();
    }
  }

  // Jika tidak ada di candidateKeys, cari properti string pertama yang valid dan bermakna
  for (const [key, val] of Object.entries(props)) {
    const lk = key.toLowerCase();
    if (['geometry', 'the_geom', 'geom', 'bbox', 'id', 'layer_id', 'gid'].includes(lk)) continue;
    if (typeof val === 'string' && val.trim().length >= 3 && val.trim().length <= 60 && !val.startsWith('http')) {
      return val.trim();
    }
  }

  if (props.id || props.ID || props.gid || props.FID) {
    return `Fitur #${props.id || props.ID || props.gid || props.FID}`;
  }

  return fallback;
}

// Helper untuk format data titik rawan bawaan sistem
function createBlackspotPopupData(pt: BlackspotPoint): GenericFeatureInfo {
  const attributes: FeatureAttribute[] = [
    {
      label: 'Alamat / Ruas Jalan',
      value: `${pt.roadName} ${pt.kmMarker ? `(${pt.kmMarker})` : ''}`.trim()
    },
    {
      label: 'Kecamatan',
      value: getKecamatanName(pt)
    },
    {
      label: 'Kabupaten / Kota',
      value: pt.cityRegency
    },
    {
      label: 'Provinsi',
      value: pt.province
    },
    {
      label: 'Penyebab Kerawanan',
      value: (pt.riskFactors && pt.riskFactors.length > 0)
        ? pt.riskFactors.join(', ')
        : 'Jalur rawan kecelakaan'
    },
    {
      label: 'Tingkat Kerawanan',
      value: pt.severity
    },
    {
      label: 'Batas Kecepatan Aman',
      value: pt.recommendedSpeedKmh ? `${pt.recommendedSpeedKmh} km/jam` : 'Maksimal 60 km/jam'
    },
    {
      label: 'Koordinat Spasial',
      value: `${pt.coordinates[1].toFixed(5)}, ${pt.coordinates[0].toFixed(5)}`
    }
  ];

  return {
    title: pt.name, // Nilai asli nama lokasi titik rawan
    subtitle: `${getKecamatanName(pt)}, ${pt.cityRegency}`,
    attributes,
    severity: pt.severity,
    coordinates: pt.coordinates,
    isWfsFeature: false
  };
}

// Helper untuk format data dari layer WFS GeoServer
function createWfsPopupData(feature: FeatureLike, coords: [number, number]): GenericFeatureInfo {
  const props = feature.getProperties();
  const title = extractFeatureTitle(props, 'Fitur Spasial WFS');

  const excludedKeys = new Set([
    'geometry', 'the_geom', 'geom', 'bbox', 'boundedBy',
    'id', 'layer_id', '_id', 'shape_leng', 'shape_area', 'objectid_1'
  ]);

  const attributes: FeatureAttribute[] = [];
  const keys = Object.keys(props).filter(k => !excludedKeys.has(k));

  keys.forEach((key) => {
    const rawVal = props[key];
    if (rawVal === undefined || rawVal === null || rawVal === '') return;
    if (typeof rawVal === 'object' && !Array.isArray(rawVal)) return;

    attributes.push({
      label: formatAttributeLabel(key),
      value: formatAttributeValue(rawVal)
    });
  });

  attributes.push({
    label: 'Koordinat Spasial',
    value: `${coords[1].toFixed(5)}, ${coords[0].toFixed(5)}`
  });

  return {
    title, // Nilai asli fitur WFS (BUKAN nama kolom)
    subtitle: 'Data Fitur WFS GeoServer',
    attributes,
    severity: 'Info',
    coordinates: coords,
    isWfsFeature: true
  };
}

export const SimpleMapWebview: React.FC = () => {
  const mapElementRef = useRef<HTMLDivElement>(null);
  const popupElementRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<Map | null>(null);
  const popupOverlayRef = useRef<Overlay | null>(null);
  const baseLayerRef = useRef<TileLayer<XYZ | OSM> | null>(null);
  const vectorSourceRef = useRef<VectorSource>(new VectorSource());
  const vectorLayerRef = useRef<VectorLayer<VectorSource> | null>(null);
  const heatmapLayerRef = useRef<Heatmap | null>(null);
  const scaleLineTargetRef = useRef<HTMLDivElement>(null);

  // Map Zoom & View State
  const [currentZoom, setCurrentZoom] = useState<number>(6.8);

  // Dynamic WFS Layers map references (keyed by layer id)
  const wfsLayersMapRef = useRef<globalThis.Map<string, { layer: VectorLayer<any>; source: VectorSource<any> }>>(new globalThis.Map());

  // App States
  const [activeBasemap, setActiveBasemap] = useState<BasemapId>('google-maps');
  const [showBasemapDropdown, setShowBasemapDropdown] = useState(false);
  const [showBlackspots, setShowBlackspots] = useState(true);
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [isWfsSidebarOpen, setIsWfsSidebarOpen] = useState(false);
  const [isGuideModalOpen, setIsGuideModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedCoords, setCopiedCoords] = useState(false);

  // Responsive Mobile/Tablet States
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [isGroupMenuOpen, setIsGroupMenuOpen] = useState(false);

  // Selected Item for Center Popup & Pagination State
  const [activePopupData, setActivePopupData] = useState<GenericFeatureInfo | null>(null);
  const [popupPage, setPopupPage] = useState(1);
  const [isPopupMinimized, setIsPopupMinimized] = useState(false);

  // WFS Layers State
  const [wfsLayers, setWfsLayers] = useState<WfsLayerConfig[]>([
    DEFAULT_WFS_PRESETS[0], // OSM Roads
    DEFAULT_WFS_PRESETS[1]  // Topp States
  ]);

  // Basemap sources helper: Google Maps, OSM, Google Satellite
  const getBasemapSource = (id: BasemapId) => {
    if (id === 'osm') {
      return new OSM();
    }
    if (id === 'google-satellite') {
      return new XYZ({
        url: 'https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}',
        attributions: '© Google Maps Satellite'
      });
    }
    // Default: Google Maps (Standar / Jalan)
    return new XYZ({
      url: 'https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',
      attributions: '© Google Maps'
    });
  };

  // Styling for blackspot points on map
  const getPointStyle = useCallback((feature: FeatureLike) => {
    const sev = feature.get('severity') as string;
    const isSelected = activePopupData && activePopupData.title === feature.get('name');

    let mainColor = '#0284c7'; // Waspada - Sky Blue
    let haloColor = 'rgba(2, 132, 199, 0.25)';

    if (sev === 'Tinggi') {
      mainColor = '#ef4444'; // Red
      haloColor = 'rgba(239, 68, 68, 0.35)';
    } else if (sev === 'Sedang') {
      mainColor = '#f59e0b'; // Amber
      haloColor = 'rgba(245, 158, 11, 0.3)';
    }

    const radius = isSelected ? 12 : 8;

    return [
      // Base halo
      new Style({
        image: new CircleStyle({
          radius: radius + 4,
          fill: new Fill({ color: haloColor })
        })
      }),
      // Main marker dot with crisp white stroke
      new Style({
        image: new CircleStyle({
          radius: radius,
          fill: new Fill({ color: mainColor }),
          stroke: new Stroke({
            color: '#ffffff',
            width: isSelected ? 3 : 2
          })
        })
      })
    ];
  }, [activePopupData]);

  // Helper untuk menutup popup & reset posisi overlay
  const handleClosePopup = useCallback(() => {
    setActivePopupData(null);
    setIsPopupMinimized(false);
    popupOverlayRef.current?.setPosition(undefined);
  }, []);

  // Helper saat user klik langsung data pada peta:
  // "tapi jika saya sendiri yang klik data nya, maka jangan didekatkan" (pertahankan posisi & zoom apa adanya)
  const handleFeatureSelect = useCallback((data: GenericFeatureInfo) => {
    setActivePopupData(data);
    setPopupPage(1); // Selalu reset ke halaman 1 saat objek baru dipilih
    setIsPopupMinimized(false);

    // Segera posisikan overlay tepat di koordinat objek (tanpa menggeser atau mengubah zoom peta)
    if (popupOverlayRef.current) {
      popupOverlayRef.current.setPosition(fromLonLat(data.coordinates));
    }
  }, []);

  // Helper saat user menggunakan fitur Search:
  // "jika saya menggunakan fitur search dan tampilan saya jauh dari titik/ data nya, maka perdekatkan"
  const handleSearchSelect = useCallback((data: GenericFeatureInfo) => {
    setActivePopupData(data);
    setPopupPage(1);
    setIsPopupMinimized(false);
    setSearchQuery('');
    setIsMobileSearchOpen(false);
    setIsGroupMenuOpen(false);

    // Pastikan layer titik aktif agar user dapat melihat objek yang dicari
    setShowBlackspots(true);

    const map = mapInstanceRef.current;
    if (map) {
      const view = map.getView();
      const currentZ = view.getZoom() ?? 6.8;

      // Jika tampilan saat ini sedang jauh (zoom < 13, misalnya zoom 5 s/d 12),
      // maka perdekatkan ke titik target dengan zoom 13.5 secara mulus.
      // Jika tampilan sudah dekat (zoom >= 13), cukup animasikan posisi ke titik tersebut.
      const targetZoom = currentZ < 13 ? 13.5 : currentZ;

      view.animate({
        center: fromLonLat(data.coordinates),
        zoom: targetZoom,
        duration: 700
      });
    }

    if (popupOverlayRef.current) {
      popupOverlayRef.current.setPosition(fromLonLat(data.coordinates));
    }
  }, []);

  // Initialize Map
  useEffect(() => {
    if (!mapElementRef.current || mapInstanceRef.current) return;

    // Basemap Layer
    const baseTile = new TileLayer({
      source: getBasemapSource(activeBasemap)
    });
    baseLayerRef.current = baseTile;

    // Load Points into Vector Source
    BLACKSPOT_POINTS.forEach((pt) => {
      const feat = new Feature({
        geometry: new Point(fromLonLat(pt.coordinates)),
        id: pt.id,
        name: pt.name,
        severity: pt.severity,
        data: pt
      });
      vectorSourceRef.current.addFeature(feat);
    });

    // Heatmap Layer untuk Titik Lokasi Kerawanan (Tinggi, Sedang, Waspada)
    const heatmapLayer = new Heatmap({
      source: vectorSourceRef.current,
      blur: 24,
      radius: 20,
      weight: (feature) => {
        const sev = feature.get('severity');
        if (sev === 'Tinggi') return 1.0;
        if (sev === 'Sedang') return 0.65;
        if (sev === 'Waspada') return 0.35;
        return 0.2;
      },
      gradient: ['#0000ff', '#00ffff', '#00ff00', '#ffff00', '#ff0000'],
      visible: showHeatmap
    });
    heatmapLayerRef.current = heatmapLayer;

    // Vector Layer for Blackspots
    const vectorLayer = new VectorLayer({
      source: vectorSourceRef.current,
      style: getPointStyle,
      visible: showBlackspots
    });
    vectorLayerRef.current = vectorLayer;

    // Pulsing & Blinking Animation Listener
    // - Tinggi (Merah): Blink 800ms (pendaran shockwave merah murni tanpa warna putih transisi)
    // - Sedang (Oranye): Blink Perlahan 2000ms (lingkaran amber halus)
    // - Waspada (Biru): Tidak Blink (tetap solid & stabil)
    vectorLayer.on('postrender', (event: any) => {
      if (!vectorLayerRef.current?.getVisible()) return;

      const vectorContext = getVectorContext(event);
      const frameState = event.frameState;
      if (!frameState) return;

      const time = frameState.time;
      const features = vectorSourceRef.current.getFeatures();

      for (let i = 0; i < features.length; i++) {
        const feat = features[i];
        const geom = feat.getGeometry();
        if (!geom) continue;

        const sev = feat.get('severity');

        if (sev === 'Tinggi') {
          // BLINK TINGGI: cycle 800ms
          const duration = 800;
          const phase = (time % duration) / duration; // 0 s/d 1
          
          // Cincin shockwave membesar dengan ritme 800ms
          const ringRadius = 8 + phase * 16;
          const ringOpacity = Math.max(0, 1 - phase);

          const ringStyle = new Style({
            image: new CircleStyle({
              radius: ringRadius,
              stroke: new Stroke({
                color: `rgba(239, 68, 68, ${ringOpacity * 0.95})`,
                width: 2.2 * (1 - phase) + 0.5
              }),
              fill: new Fill({
                color: `rgba(239, 68, 68, ${ringOpacity * 0.22})`
              })
            })
          });
          vectorContext.setStyle(ringStyle);
          vectorContext.drawGeometry(geom);

          // Pendaran merah (murni merah, tanpa warna putih saat transisi)
          const coreGlow = new Style({
            image: new CircleStyle({
              radius: 9 + (1 - phase) * 2,
              fill: new Fill({ color: `rgba(239, 68, 68, ${0.4 * (1 - phase)})` })
            })
          });
          vectorContext.setStyle(coreGlow);
          vectorContext.drawGeometry(geom);
        } else if (sev === 'Sedang') {
          // BLINK SEDANG (ORANYE): cycle 2000ms (kedipan tenang perlahan)
          const duration = 2000;
          const phase = (time % duration) / duration;

          const ringRadius = 8 + phase * 11;
          const ringOpacity = Math.max(0, 0.75 * (1 - phase));

          const ringStyle = new Style({
            image: new CircleStyle({
              radius: ringRadius,
              stroke: new Stroke({
                color: `rgba(245, 158, 11, ${ringOpacity * 0.85})`,
                width: 1.6 * (1 - phase) + 0.4
              }),
              fill: new Fill({
                color: `rgba(245, 158, 11, ${ringOpacity * 0.15})`
              })
            })
          });
          vectorContext.setStyle(ringStyle);
          vectorContext.drawGeometry(geom);
        }
      }

      if (mapInstanceRef.current) {
        mapInstanceRef.current.render();
      }
    });

    // View: Indonesia Center
    const view = new View({
      center: fromLonLat([110.0, -7.0]),
      zoom: 6.8,
      minZoom: 4.5,
      maxZoom: 18
    });

    // Update zoom state dynamically as user zooms
    view.on('change:resolution', () => {
      const z = view.getZoom();
      if (z !== undefined) {
        setCurrentZoom(z);
      }
    });

    // Skala Peta: Metric scale line dengan target elemen dekat legenda
    const scaleLineControl = new ScaleLine({
      target: scaleLineTargetRef.current || undefined,
      units: 'metric',
      bar: false,
      text: false,
      minWidth: 55
    });

    const map = new Map({
      target: mapElementRef.current,
      layers: [baseTile, heatmapLayer, vectorLayer],
      view,
      controls: [scaleLineControl]
    });

    // Inisialisasi Overlay untuk popup yang menempel langsung pada koordinat titik peta
    if (popupElementRef.current) {
      const popupOverlay = new Overlay({
        element: popupElementRef.current,
        positioning: 'bottom-center',
        stopEvent: true,
        offset: [0, -18],
        autoPan: false // Jangan paksa peta pindah ke tengah; biarkan user geser map sendiri secara manual
      });
      map.addOverlay(popupOverlay);
      popupOverlayRef.current = popupOverlay;
    }

    mapInstanceRef.current = map;

    // Click handler to select point & show popup menempel di atas marker
    map.on('singleclick', (evt) => {
      let foundInfo: GenericFeatureInfo | null = null;

      map.forEachFeatureAtPixel(evt.pixel, (feature, layer) => {
        // 1. Cek apakah layer Blackspot Bawaan Sistem (Vector Points atau Heatmap)
        if (layer === vectorLayerRef.current || layer === heatmapLayerRef.current) {
          const pt = feature.get('data') as BlackspotPoint;
          if (pt) {
            foundInfo = createBlackspotPopupData(pt);
            return true;
          }
        }

        // 2. Cek apakah layer dari WFS GeoServer
        const geom = feature.getGeometry();
        if (geom) {
          let coords: [number, number] = [110.0, -7.0];
          try {
            const extent = geom.getExtent();
            const center = [(extent[0] + extent[2]) / 2, (extent[1] + extent[3]) / 2];
            const [lon, lat] = toLonLat(center);
            coords = [Number(lon.toFixed(5)), Number(lat.toFixed(5))];
          } catch {
            coords = [110.0, -7.0];
          }

          foundInfo = createWfsPopupData(feature, coords);
          return true;
        }

        return false;
      });

      if (foundInfo) {
        handleFeatureSelect(foundInfo);
      } else {
        // Klik di area peta kosong menutup popup
        setActivePopupData(null);
        popupOverlayRef.current?.setPosition(undefined);
      }
    });

    // Pointer hover effect
    map.on('pointermove', (evt) => {
      if (evt.dragging) return;
      const pixel = map.getEventPixel(evt.originalEvent);
      const hit = map.hasFeatureAtPixel(pixel);
      const targetEl = map.getTargetElement();
      if (targetEl) {
        targetEl.style.cursor = hit ? 'pointer' : '';
      }
    });

    return () => {
      map.setTarget(undefined);
      mapInstanceRef.current = null;
      popupOverlayRef.current = null;
      heatmapLayerRef.current = null;
    };
  }, [handleFeatureSelect]);

  // Sinkronisasi posisi overlay saat activePopupData berubah
  useEffect(() => {
    if (!popupOverlayRef.current) return;
    if (activePopupData) {
      popupOverlayRef.current.setPosition(fromLonLat(activePopupData.coordinates));
    } else {
      popupOverlayRef.current.setPosition(undefined);
    }
  }, [activePopupData]);

  // Update Basemap when changed
  useEffect(() => {
    if (!baseLayerRef.current) return;
    baseLayerRef.current.setSource(getBasemapSource(activeBasemap));
  }, [activeBasemap]);

  // Toggle Visibility of Blackspots Layer
  useEffect(() => {
    if (vectorLayerRef.current) {
      vectorLayerRef.current.setVisible(showBlackspots);
    }
  }, [showBlackspots]);

  // Toggle Visibility of Heatmap Layer
  useEffect(() => {
    if (heatmapLayerRef.current) {
      heatmapLayerRef.current.setVisible(showHeatmap);
    }
  }, [showHeatmap]);

  // Re-style markers when activePopupData changes
  useEffect(() => {
    if (vectorLayerRef.current) {
      vectorLayerRef.current.setStyle(getPointStyle);
    }
  }, [activePopupData, getPointStyle]);

  // Dynamic WFS Layers Management in OpenLayers
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    wfsLayers.forEach((cfg) => {
      let registered = wfsLayersMapRef.current.get(cfg.id);

      // Jika layer belum ada di map
      if (!registered) {
        const source = new VectorSource({
          format: new GeoJSON()
        });

        const layer = new VectorLayer({
          source,
          visible: cfg.enabled,
          style: (feature) => {
            const geomType = feature.getGeometry()?.getType();
            if (geomType === 'Point' || geomType === 'MultiPoint') {
              return new Style({
                image: new CircleStyle({
                  radius: 7,
                  fill: new Fill({ color: cfg.color }),
                  stroke: new Stroke({ color: '#ffffff', width: 2 })
                })
              });
            }
            if (geomType === 'LineString' || geomType === 'MultiLineString') {
              return new Style({
                stroke: new Stroke({
                  color: cfg.color,
                  width: cfg.strokeWidth || 3
                })
              });
            }
            // Polygon
            return new Style({
              fill: new Fill({ color: `${cfg.color}33` }), // 20% opacity
              stroke: new Stroke({
                color: cfg.color,
                width: cfg.strokeWidth || 2
              })
            });
          }
        });

        map.addLayer(layer);
        registered = { layer, source };
        wfsLayersMapRef.current.set(cfg.id, registered);

        // Jika layer di-enable, muat datanya dari WFS
        if (cfg.enabled) {
          fetchWfsData(cfg, source);
        }
      } else {
        // Update visibility
        registered.layer.setVisible(cfg.enabled);

        // Jika baru diaktifkan dan belum ada fitur, muat
        if (cfg.enabled && registered.source.getFeatures().length === 0 && cfg.status !== 'error') {
          fetchWfsData(cfg, registered.source);
        }
      }
    });

    // Cleanup layer yang sudah dihapus dari state
    const currentIds = new Set(wfsLayers.map(l => l.id));
    wfsLayersMapRef.current.forEach((val: { layer: VectorLayer<any>; source: VectorSource<any> }, id: string) => {
      if (!currentIds.has(id)) {
        map.removeLayer(val.layer);
        wfsLayersMapRef.current.delete(id);
      }
    });
  }, [wfsLayers]);

  // Helper untuk melakukan query GetFeature WFS GeoServer
  const fetchWfsData = async (cfg: WfsLayerConfig, source: VectorSource<any>) => {
    // Update status ke loading
    setWfsLayers(prev => prev.map(l => l.id === cfg.id ? { ...l, status: 'loading', errorMessage: undefined } : l));

    // Bangun URL WFS standar OGC GetFeature
    const separator = cfg.url.includes('?') ? '&' : '?';
    const wfsUrl = `${cfg.url}${separator}service=WFS&version=${cfg.version || '1.1.0'}&request=GetFeature&typename=${encodeURIComponent(cfg.typeName)}&outputFormat=application/json&srsname=EPSG:3857`;

    try {
      const response = await fetch(wfsUrl, {
        headers: { 'Accept': 'application/json' },
        mode: 'cors'
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const geojsonData = await response.json();
      const features = new GeoJSON().readFeatures(geojsonData, {
        featureProjection: 'EPSG:3857'
      });

      source.clear();
      source.addFeatures(features);

      setWfsLayers(prev => prev.map(l => l.id === cfg.id ? {
        ...l,
        status: 'loaded',
        featureCount: features.length
      } : l));
    } catch (err: any) {
      console.warn(`WFS Fetch Warning [${cfg.name}]:`, err.message);
      let errorMsg = 'Gagal memuat. Pastikan CORS Tomcat aktif.';
      if (err.message && err.message.includes('Failed to fetch')) {
        errorMsg = 'CORS terblokir / Server offline (Periksa web.xml)';
      }
      setWfsLayers(prev => prev.map(l => l.id === cfg.id ? {
        ...l,
        status: 'error',
        errorMessage: errorMsg
      } : l));
    }
  };

  // Toggle on/off WFS layer
  const handleToggleWfsLayer = (id: string, enabled: boolean) => {
    setWfsLayers(prev => prev.map(l => l.id === id ? { ...l, enabled } : l));
  };

  // Add new WFS layer from user form
  const handleAddWfsLayer = (newLayer: WfsLayerConfig) => {
    setWfsLayers(prev => [newLayer, ...prev]);
  };

  // Delete WFS layer
  const handleDeleteWfsLayer = (id: string) => {
    setWfsLayers(prev => prev.filter(l => l.id !== id));
  };

  // Load preset demo
  const handleLoadPreset = (presetId: string) => {
    const preset = DEFAULT_WFS_PRESETS.find(p => p.id === presetId);
    if (!preset) return;
    
    // Cek apakah sudah ada
    const exists = wfsLayers.find(l => l.typeName === preset.typeName && l.url === preset.url);
    if (exists) {
      handleToggleWfsLayer(exists.id, true);
    } else {
      const newPresetLayer = {
        ...preset,
        id: `preset-${Date.now()}`,
        enabled: true,
        status: 'loading' as const
      };
      setWfsLayers(prev => [newPresetLayer, ...prev]);
    }
  };

  // Filter points when search query changes
  const filteredSearchList = BLACKSPOT_POINTS.filter((p) => {
    if (!searchQuery) return false;
    const q = searchQuery.toLowerCase();
    const kec = getKecamatanName(p).toLowerCase();
    return (
      p.name.toLowerCase().includes(q) ||
      p.roadName.toLowerCase().includes(q) ||
      (p.kmMarker && p.kmMarker.toLowerCase().includes(q)) ||
      p.province.toLowerCase().includes(q) ||
      p.cityRegency.toLowerCase().includes(q) ||
      kec.includes(q)
    );
  }).slice(0, 5);

  const copyCoords = (coords: [number, number]) => {
    const text = `${coords[1].toFixed(6)}, ${coords[0].toFixed(6)}`;
    navigator.clipboard.writeText(text);
    setCopiedCoords(true);
    setTimeout(() => setCopiedCoords(false), 2000);
  };

  // Region presets
  const presets = [
    { label: 'NKRI', coords: [118.0, -2.5] as [number, number], zoom: 5 },
    { label: 'Jawa', coords: [110.2, -7.0] as [number, number], zoom: 7.2 },
    { label: 'Sumatera', coords: [104.5, -4.5] as [number, number], zoom: 6.8 },
    { label: 'Bali-Lombok', coords: [115.2, -8.4] as [number, number], zoom: 8.8 },
    { label: 'Kalimantan', coords: [114.5, -1.5] as [number, number], zoom: 6.5 },
    { label: 'Sulawesi', coords: [120.5, -2.5] as [number, number], zoom: 6.5 }
  ];

  // Close popup modal on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActivePopupData(null);
        setIsWfsSidebarOpen(false);
        setIsGuideModalOpen(false);
        setIsMobileSearchOpen(false);
        setIsGroupMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-slate-950 font-sans select-none flex flex-col">
      {/* Minimal Top Header (Webview Bar) with Full Multi-Device Responsiveness */}
      <header className="h-13 bg-slate-950/95 backdrop-blur-md border-b border-slate-800 px-2.5 sm:px-4 flex items-center justify-between gap-1.5 sm:gap-3 z-20 shrink-0 relative">
        {/* Mobile Search Overlay Bar (Active when isMobileSearchOpen is true) */}
        {isMobileSearchOpen ? (
          <div className="absolute inset-0 bg-slate-950 px-2.5 sm:px-4 flex items-center gap-2 z-30 animate-in fade-in slide-in-from-top-1 duration-150">
            <Search className="w-4 h-4 text-sky-400 shrink-0" />
            <input
              type="text"
              autoFocus
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && filteredSearchList.length > 0) {
                  handleSearchSelect(createBlackspotPopupData(filteredSearchList[0]));
                }
              }}
              placeholder="Cari lokasi, ruas jalan, kecamatan..."
              className="flex-1 bg-transparent text-white text-xs placeholder-slate-500 focus:outline-none"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="p-1 text-slate-400 hover:text-white text-xs cursor-pointer"
              >
                ✕
              </button>
            )}
            <button
              onClick={() => {
                setIsMobileSearchOpen(false);
                setSearchQuery('');
              }}
              className="px-2.5 py-1 text-xs text-slate-300 hover:text-white rounded-lg bg-slate-900 border border-slate-700 cursor-pointer font-medium"
            >
              Batal
            </button>

            {/* Mobile Autocomplete Suggestions Dropdown */}
            {filteredSearchList.length > 0 && (
              <div className="absolute top-full left-0 right-0 bg-slate-900/98 backdrop-blur-xl border-b border-x border-slate-700 shadow-2xl p-1.5 z-40 max-h-64 overflow-y-auto space-y-0.5">
                {filteredSearchList.map((pt) => (
                  <button
                    key={pt.id}
                    onClick={() => handleSearchSelect(createBlackspotPopupData(pt))}
                    className="w-full text-left p-2 rounded-lg hover:bg-slate-800 text-xs transition cursor-pointer flex items-center justify-between"
                  >
                    <div className="truncate pr-2">
                      <span className="font-semibold text-white block truncate">{pt.name}</span>
                      <span className="text-[10px] text-slate-400 block truncate">
                        {getKecamatanName(pt)} · {pt.cityRegency}
                      </span>
                    </div>
                    <span className={`text-[10px] font-bold shrink-0 ${
                      pt.severity === 'Tinggi' ? 'text-red-400' : pt.severity === 'Sedang' ? 'text-amber-400' : 'text-sky-400'
                    }`}>
                      {pt.severity}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        ) : null}

        {/* Brand wordmark - Responsive Label */}
        <div className="flex items-center gap-2 shrink-0">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500 shadow-sm shadow-red-500/50"></span>
          </span>
          {/* Responsive Brand Titles */}
          <h1 className="text-xs sm:text-sm font-bold text-white tracking-tight">
            <span className="inline sm:hidden">WebGIS Nataru</span>
            <span className="hidden sm:inline lg:hidden">WebGIS Nataru 2026/2027</span>
            <span className="hidden lg:inline">WebGIS Natal dan Tahun Baru 2026/2027</span>
          </h1>
        </div>

        {/* Quick Search - Desktop & Tablet (sm:block) */}
        <div className="relative flex-1 max-w-xs hidden sm:block">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && filteredSearchList.length > 0) {
                handleSearchSelect(createBlackspotPopupData(filteredSearchList[0]));
              }
            }}
            placeholder="Cari lokasi, kecamatan, ruas jalan..."
            className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-8 pr-7 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2 top-2 text-slate-400 hover:text-white text-xs cursor-pointer"
            >
              ✕
            </button>
          )}

          {/* Autocomplete dropdown */}
          {filteredSearchList.length > 0 && (
            <div className="absolute left-0 right-0 mt-1 bg-slate-900 border border-slate-700 rounded-lg shadow-2xl p-1 z-30 space-y-0.5">
              {filteredSearchList.map((pt) => (
                <button
                  key={pt.id}
                  onClick={() => handleSearchSelect(createBlackspotPopupData(pt))}
                  className="w-full text-left p-2 rounded hover:bg-slate-800 text-xs transition cursor-pointer flex items-center justify-between"
                >
                  <div className="truncate pr-2">
                    <span className="font-semibold text-white block truncate">{pt.name}</span>
                    <span className="text-[10px] text-slate-400 block truncate">
                      {getKecamatanName(pt)} · {pt.cityRegency}
                    </span>
                  </div>
                  <span className={`text-[10px] font-bold ml-2 shrink-0 ${
                    pt.severity === 'Tinggi' ? 'text-red-400' : pt.severity === 'Sedang' ? 'text-amber-400' : 'text-sky-400'
                  }`}>
                    {pt.severity}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Action Controls: Responsive Buttons + Grouped Menu */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Mobile Search Toggle Button (Tampil hanya di layar kecil < sm) */}
          <button
            onClick={() => setIsMobileSearchOpen(true)}
            className="sm:hidden p-2 text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded-lg transition cursor-pointer"
            title="Buka Pencarian"
          >
            <Search className="w-3.5 h-3.5 text-sky-400" />
          </button>

          {/* Tombol Cepat Heatmap Kerawanan */}
          <button
            onClick={() => setShowHeatmap(!showHeatmap)}
            className={`flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1.5 text-xs font-semibold rounded-lg border transition cursor-pointer shadow-sm ${
              showHeatmap
                ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 border-orange-400 font-bold shadow-orange-500/25 ring-2 ring-orange-400/30'
                : 'bg-slate-900 hover:bg-slate-800 border-slate-700 hover:border-orange-500/50 text-slate-200'
            }`}
            title="Aktifkan / Nonaktifkan Layer Heatmap Titik Kerawanan"
          >
            <Flame className={`w-3.5 h-3.5 ${showHeatmap ? 'text-slate-950 fill-slate-950' : 'text-orange-400'}`} />
            <span className="hidden sm:inline">Heatmap</span>
            <span className={`px-1 sm:px-1.5 py-0.2 rounded font-mono text-[9px] ${
              showHeatmap ? 'bg-orange-700 text-white font-bold' : 'bg-slate-800 text-slate-400'
            }`}>
              {showHeatmap ? 'ON' : 'OFF'}
            </span>
          </button>

          {/* ============================================================== */}
          {/* DESKTOP CONTROLS: Tampil penuh di laptop/komputer (md:flex)   */}
          {/* ============================================================== */}
          <div className="hidden md:flex items-center gap-2">
            {/* Tombol Sidebar Kelola Layer & WFS */}
            <button
              onClick={() => setIsWfsSidebarOpen(true)}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border transition cursor-pointer shadow-sm ${
                isWfsSidebarOpen
                  ? 'bg-sky-500 text-slate-950 border-sky-400'
                  : 'bg-slate-900 hover:bg-slate-800 border-slate-700 hover:border-sky-500 text-slate-200'
              }`}
              title="Buka Panel Kelola Layer & WFS GeoServer"
            >
              <Radio className="w-3.5 h-3.5 text-sky-400" />
              <span>Layer & WFS</span>
              <span className="px-1.5 py-0.2 bg-sky-950 text-sky-300 border border-sky-800/80 rounded font-mono text-[9px]">
                {wfsLayers.filter(l => l.enabled).length + (showBlackspots ? 1 : 0) + (showHeatmap ? 1 : 0)}
              </span>
            </button>

            {/* Basemap Switcher dropdown button */}
            <div className="relative">
              <button
                onClick={() => setShowBasemapDropdown(!showBasemapDropdown)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-sky-500 text-slate-200 text-xs font-semibold rounded-lg transition cursor-pointer"
                title="Pilih Tampilan Peta Dasar"
              >
                <Layers className="w-3.5 h-3.5 text-sky-400" />
                <span className="text-slate-400 font-normal">Peta:</span>
                <span className="text-sky-300 font-bold capitalize">
                  {activeBasemap === 'google-maps' ? 'Google Maps' :
                   activeBasemap === 'osm' ? 'OpenStreetMap' : 'Google Satelit'}
                </span>
              </button>

              {showBasemapDropdown && (
                <>
                  <div 
                    className="fixed inset-0 z-30" 
                    onClick={() => setShowBasemapDropdown(false)}
                  />
                  <div className="absolute right-0 mt-1.5 w-52 bg-slate-900/98 border border-slate-700 rounded-xl shadow-2xl p-2 z-40 space-y-1">
                    <div className="text-[10px] uppercase font-bold text-slate-400 px-2 py-1 border-b border-slate-800 pb-1 mb-1 flex items-center justify-between">
                      <span>Pilihan Peta Dasar</span>
                      <span className="text-sky-400 font-mono text-[9px]">3 Pilihan</span>
                    </div>
                    {[
                      { id: 'google-maps', name: 'Google Maps', sub: 'Peta Jalan & Navigasi' },
                      { id: 'osm', name: 'OpenStreetMap', sub: 'Peta Komunitas Global (OSM)' },
                      { id: 'google-satellite', name: 'Google Satelit', sub: 'Citra Satelit & Hybrid' }
                    ].map((bm) => (
                      <button
                        key={bm.id}
                        onClick={() => {
                          setActiveBasemap(bm.id as BasemapId);
                          setShowBasemapDropdown(false);
                        }}
                        className={`w-full text-left px-2.5 py-1.5 text-xs rounded-lg transition flex items-center justify-between cursor-pointer ${
                          activeBasemap === bm.id 
                            ? 'bg-sky-500/20 text-sky-300 font-bold border border-sky-500/40' 
                            : 'text-slate-300 hover:bg-slate-800'
                        }`}
                      >
                        <div>
                          <div className="font-semibold text-xs">{bm.name}</div>
                          <div className="text-[10px] text-slate-500">{bm.sub}</div>
                        </div>
                        {activeBasemap === bm.id && <span className="w-1.5 h-1.5 rounded-full bg-sky-400"></span>}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* ============================================================== */}
          {/* MOBILE & TABLET GROUPED MENU: Dibuat group agar menu tidak      */}
          {/* tertutup di layar HP & Tab (< md)                               */}
          {/* ============================================================== */}
          <div className="relative md:hidden">
            <button
              onClick={() => setIsGroupMenuOpen(!isGroupMenuOpen)}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-lg border transition cursor-pointer shadow-sm ${
                isGroupMenuOpen
                  ? 'bg-sky-500 text-slate-950 border-sky-400'
                  : 'bg-slate-900 hover:bg-slate-800 border-slate-700 hover:border-sky-500 text-slate-200'
              }`}
              title="Menu Pengaturan & Lapisan Peta"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-sky-400" />
              <span className="text-[11px]">Menu</span>
              <span className="px-1.5 py-0.2 bg-sky-950 text-sky-300 border border-sky-800 rounded font-mono text-[9px]">
                {wfsLayers.filter(l => l.enabled).length + (showBlackspots ? 1 : 0) + (showHeatmap ? 1 : 0)}
              </span>
              <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform ${isGroupMenuOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Grouped Menu Dropdown Panel */}
            {isGroupMenuOpen && (
              <>
                <div
                  className="fixed inset-0 z-30 bg-black/60 backdrop-blur-xs"
                  onClick={() => setIsGroupMenuOpen(false)}
                />
                <div className="absolute right-0 top-full mt-2 w-[min(320px,calc(100vw-20px))] bg-slate-900/98 backdrop-blur-xl border border-slate-700/90 rounded-2xl shadow-2xl p-3 z-40 space-y-3 animate-in fade-in zoom-in-95 duration-150 max-h-[calc(100vh-70px)] overflow-y-auto">
                  {/* Header Drawer */}
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                    <div className="flex items-center gap-1.5">
                      <SlidersHorizontal className="w-4 h-4 text-sky-400" />
                      <span className="font-bold text-white text-xs">Menu & Lapisan Peta</span>
                    </div>
                    <button
                      onClick={() => setIsGroupMenuOpen(false)}
                      className="p-1 text-slate-400 hover:text-white rounded-md hover:bg-slate-800 transition cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Group 1: Peta Dasar (Basemap) */}
                  <div className="space-y-1.5">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
                      <span>Peta Dasar (Basemap)</span>
                      <span className="text-[9px] text-sky-400 font-semibold capitalize">{activeBasemap.replace('-', ' ')}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-1.5">
                      {[
                        { id: 'google-maps', name: 'Google', sub: 'Jalan' },
                        { id: 'osm', name: 'OSM', sub: 'Standar' },
                        { id: 'google-satellite', name: 'Satelit', sub: 'Hybrid' }
                      ].map((bm) => (
                        <button
                          key={bm.id}
                          onClick={() => {
                            setActiveBasemap(bm.id as BasemapId);
                          }}
                          className={`p-2 rounded-lg border text-center transition cursor-pointer ${
                            activeBasemap === bm.id
                              ? 'bg-sky-500/20 border-sky-400 text-sky-300 font-bold'
                              : 'bg-slate-950/70 border-slate-800 text-slate-300 hover:bg-slate-800'
                          }`}
                        >
                          <div className="text-xs font-semibold leading-tight">{bm.name}</div>
                          <div className="text-[9px] text-slate-400">{bm.sub}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Group 2: Lapisan Tematik (Marker, Heatmap, WFS) */}
                  <div className="space-y-2 pt-1 border-t border-slate-800/80">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
                      <span>Lapisan Spasial</span>
                      <span className="text-[9px] text-slate-500">
                        {wfsLayers.filter(l => l.enabled).length + (showBlackspots ? 1 : 0) + (showHeatmap ? 1 : 0)} Aktif
                      </span>
                    </div>

                    {/* Titik Rawan Marker */}
                    <div className="flex items-center justify-between p-2 bg-slate-950/60 rounded-xl border border-slate-800">
                      <div className="flex items-center gap-2">
                        <span className="relative flex h-2.5 w-2.5">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
                        </span>
                        <span className="text-xs font-medium text-white">Titik Rawan (Marker)</span>
                      </div>
                      <button
                        onClick={() => setShowBlackspots(!showBlackspots)}
                        className={`px-2 py-1 rounded-md text-[10px] font-semibold border transition cursor-pointer flex items-center gap-1 ${
                          showBlackspots
                            ? 'bg-sky-500/20 text-sky-300 border-sky-500/40'
                            : 'bg-slate-800 text-slate-500 border-slate-700'
                        }`}
                      >
                        {showBlackspots ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                        <span>{showBlackspots ? 'Aktif' : 'Off'}</span>
                      </button>
                    </div>

                    {/* Heatmap Kerawanan */}
                    <div className="flex items-center justify-between p-2 bg-slate-950/60 rounded-xl border border-slate-800">
                      <div className="flex items-center gap-2">
                        <Flame className="w-3.5 h-3.5 text-orange-400" />
                        <span className="text-xs font-medium text-white">Heatmap Densitas</span>
                      </div>
                      <button
                        onClick={() => setShowHeatmap(!showHeatmap)}
                        className={`px-2 py-1 rounded-md text-[10px] font-semibold border transition cursor-pointer flex items-center gap-1 ${
                          showHeatmap
                            ? 'bg-orange-500/20 text-orange-300 border-orange-500/40'
                            : 'bg-slate-800 text-slate-500 border-slate-700'
                        }`}
                      >
                        {showHeatmap ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                        <span>{showHeatmap ? 'Aktif' : 'Off'}</span>
                      </button>
                    </div>

                    {/* Buka Kelola WFS GeoServer */}
                    <button
                      onClick={() => {
                        setIsGroupMenuOpen(false);
                        setIsWfsSidebarOpen(true);
                      }}
                      className="w-full flex items-center justify-between p-2 bg-slate-950/80 hover:bg-slate-800/80 rounded-xl border border-slate-800 hover:border-sky-500/50 text-xs font-medium text-white transition cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <Radio className="w-3.5 h-3.5 text-sky-400" />
                        <span>Kelola Layer & WFS GeoServer</span>
                      </div>
                      <span className="px-1.5 py-0.2 bg-sky-950 text-sky-300 border border-sky-800 rounded font-mono text-[9px]">
                        {wfsLayers.length} Layer
                      </span>
                    </button>
                  </div>

                  {/* Group 3: Fokus Wilayah Cepat */}
                  <div className="space-y-1.5 pt-1 border-t border-slate-800/80">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                      <Compass className="w-3 h-3 text-sky-400" />
                      <span>Fokus Wilayah</span>
                    </div>
                    <div className="grid grid-cols-3 gap-1">
                      {presets.map((p) => (
                        <button
                          key={p.label}
                          onClick={() => {
                            if (mapInstanceRef.current) {
                              mapInstanceRef.current.getView().animate({
                                center: fromLonLat(p.coords),
                                zoom: p.zoom,
                                duration: 650
                              });
                            }
                            setIsGroupMenuOpen(false);
                          }}
                          className="px-2 py-1 bg-slate-950/80 hover:bg-slate-800 border border-slate-800 rounded text-center text-[10px] text-slate-300 hover:text-white transition cursor-pointer truncate"
                        >
                          {p.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Group 4: Panduan GeoServer */}
                  <div className="pt-1 border-t border-slate-800/80">
                    <button
                      onClick={() => {
                        setIsGroupMenuOpen(false);
                        setIsGuideModalOpen(true);
                      }}
                      className="w-full py-1.5 px-2 bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-sky-500 rounded-lg text-slate-300 hover:text-white flex items-center justify-center gap-1.5 text-xs font-semibold transition cursor-pointer"
                    >
                      <HelpCircle className="w-3.5 h-3.5 text-sky-400" />
                      <span>Panduan Setup GeoServer WFS</span>
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Main Map Viewport */}
      <main className="relative flex-1 w-full h-full overflow-hidden">
        {/* OpenLayers Map Div */}
        <div ref={mapElementRef} className="w-full h-full" />

        {/* Quick Region Presets Floating Bar - Responsive Horizontal Swipe */}
        <div className="absolute top-3 left-3 z-10 flex items-center gap-1 p-1 bg-slate-900/90 backdrop-blur-md border border-slate-700/80 rounded-lg shadow-lg max-w-[calc(100vw-64px)] sm:max-w-max overflow-x-auto no-scrollbar whitespace-nowrap">
          <span className="text-[10px] font-semibold text-slate-400 px-1.5 hidden sm:flex items-center gap-1 shrink-0">
            <Compass className="w-3 h-3 text-sky-400" />
            <span>Fokus:</span>
          </span>
          {presets.map((p) => (
            <button
              key={p.label}
              onClick={() => {
                if (mapInstanceRef.current) {
                  mapInstanceRef.current.getView().animate({
                    center: fromLonLat(p.coords),
                    zoom: p.zoom,
                    duration: 650
                  });
                }
              }}
              className="px-2 py-0.5 sm:py-1 text-[10px] sm:text-[11px] font-medium text-slate-300 hover:text-white hover:bg-slate-800 rounded transition cursor-pointer shrink-0"
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* Floating Zoom & Map Navigation Controls */}
        <div className="absolute top-14 right-3 z-10 flex flex-col gap-1 bg-slate-900/90 backdrop-blur-md border border-slate-700/80 rounded-lg shadow-xl p-1">
          <button
            onClick={() => {
              if (mapInstanceRef.current) {
                const view = mapInstanceRef.current.getView();
                const cur = view.getZoom() ?? 6.8;
                view.animate({ zoom: Math.min(18, cur + 1), duration: 250 });
              }
            }}
            className="w-7 h-7 flex items-center justify-center text-slate-300 hover:text-white hover:bg-slate-800 rounded transition cursor-pointer"
            title="Perbesar Peta (Zoom In)"
          >
            <Plus className="w-4 h-4" />
          </button>
          <div className="w-full h-[1px] bg-slate-800" />
          <button
            onClick={() => {
              if (mapInstanceRef.current) {
                const view = mapInstanceRef.current.getView();
                const cur = view.getZoom() ?? 6.8;
                view.animate({ zoom: Math.max(4.5, cur - 1), duration: 250 });
              }
            }}
            className="w-7 h-7 flex items-center justify-center text-slate-300 hover:text-white hover:bg-slate-800 rounded transition cursor-pointer"
            title="Perkecil Peta (Zoom Out)"
          >
            <Minus className="w-4 h-4" />
          </button>
          <div className="w-full h-[1px] bg-slate-800" />
          <button
            onClick={() => {
              if (mapInstanceRef.current) {
                mapInstanceRef.current.getView().animate({
                  center: fromLonLat([110.0, -7.0]),
                  zoom: 6.8,
                  duration: 500
                });
              }
            }}
            className="w-7 h-7 flex items-center justify-center text-slate-300 hover:text-white hover:bg-slate-800 rounded transition cursor-pointer"
            title="Reset Pandangan ke Indonesia (Pusat)"
          >
            <RotateCcw className="w-3.5 h-3.5 text-sky-400" />
          </button>
        </div>

        {/* Bottom-Left Controls: Legenda & Skala Peta (Dekat Box Legenda) */}
        <div className="absolute bottom-3 left-3 z-10 flex flex-wrap items-center gap-1.5 sm:gap-2 max-w-[calc(100vw-24px)] pointer-events-auto">
          {/* Minimal Legend Floating Pill */}
          <div className="bg-slate-900/95 backdrop-blur-md border border-slate-700/80 rounded-lg px-2 sm:px-3 py-1 sm:py-1.5 shadow-xl flex items-center gap-2 sm:gap-3.5 text-[10px] sm:text-[11px] text-slate-300">
            <span className="text-[9px] sm:text-[10px] uppercase font-bold text-slate-400 mr-0.5 hidden xs:inline">Legenda:</span>
            
            {/* Tinggi: Fast blink 800ms */}
            <div className="flex items-center gap-1 sm:gap-1.5">
              <span className="relative flex h-2 w-2 sm:h-2.5 sm:w-2.5 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 sm:h-2.5 sm:w-2.5 bg-red-500 border border-white"></span>
              </span>
              <span className="text-red-400 font-semibold text-[10px] sm:text-[11px]">Tinggi</span>
            </div>

            {/* Sedang: Slow pulse 2000ms */}
            <div className="flex items-center gap-1 sm:gap-1.5">
              <span className="relative flex h-2 w-2 sm:h-2.5 sm:w-2.5 shrink-0">
                <span className="animate-pulse absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-60"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 sm:h-2.5 sm:w-2.5 bg-amber-400 border border-white"></span>
              </span>
              <span className="text-amber-400 font-semibold text-[10px] sm:text-[11px]">Sedang</span>
            </div>

            {/* Waspada: No blink */}
            <div className="flex items-center gap-1 sm:gap-1.5">
              <span className="inline-flex rounded-full h-2 w-2 sm:h-2.5 sm:w-2.5 bg-sky-400 border border-white shrink-0"></span>
              <span className="text-sky-400 font-semibold text-[10px] sm:text-[11px]">Waspada</span>
            </div>

            {/* Heatmap Spectrum Indicator when Active */}
            {showHeatmap && (
              <div className="flex items-center gap-1 sm:gap-1.5 pl-2 sm:pl-3 border-l border-slate-700/80 animate-in fade-in duration-200">
                <Flame className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-orange-400 shrink-0" />
                <span className="text-[9px] sm:text-[10px] text-slate-400 font-medium hidden sm:inline">Heatmap:</span>
                <div className="flex items-center gap-1">
                  <div className="w-10 sm:w-14 h-1.5 sm:h-2 rounded-full bg-gradient-to-r from-blue-500 via-amber-400 to-red-600 shadow-inner" />
                </div>
              </div>
            )}
          </div>

          {/* Scale Box (Dekat Box Legenda) */}
          <div className="bg-slate-900/95 backdrop-blur-md border border-slate-700/80 rounded-lg px-2 sm:px-2.5 py-1 sm:py-1.5 shadow-xl flex items-center gap-2 sm:gap-2.5 text-[10px] sm:text-[11px] text-slate-300">
            <div className="flex items-center gap-1 sm:gap-1.5">
              <span className="text-[9px] sm:text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
                <Ruler className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-cyan-400 shrink-0" />
                <span className="hidden xs:inline">Skala:</span>
              </span>
              <div 
                ref={scaleLineTargetRef} 
                className="custom-scale-wrapper flex items-center min-w-[45px] sm:min-w-[55px]" 
              />
            </div>

            <div className="w-[1px] h-3 bg-slate-700/80" />

            <span className="text-[9px] sm:text-[10px] font-mono text-slate-400 flex items-center gap-1">
              <span className="hidden xs:inline">Zoom</span>
              <span className="text-cyan-400 font-semibold">{currentZoom.toFixed(1)}</span>
            </span>
          </div>
        </div>

        {/* Instruction badge at bottom-right */}
        <div className="absolute bottom-3 right-3 z-10 hidden sm:flex items-center gap-2 bg-slate-900/80 backdrop-blur-md border border-slate-700/70 rounded-lg px-2.5 py-1 text-[11px] text-slate-400">
          <span>Klik titik atau objek untuk melihat popup informasi</span>
        </div>

        {/* =========================================================================
            ANCHORED MAP POPUP (OPENLAYERS OVERLAY)
            - Menempel langsung pada titik koordinat fitur (BUKAN modal di tengah web)
            - Tidak menutupi titik / data yang sedang diselect
            - Dilengkapi ekor panah penunjuk (beak) yang mengarah tepat ke atas marker
            - Judul dan nilai popup berdasarkan nilai pada fitur (BUKAN nama field teknis)
            - Dilengkapi navigasi paginasi jika atribut berjumlah banyak
            - Tidak mengubah skala zoom peta saat diklik ("seperti semula saja")
            - Tanpa data historis kejadian / jumlah korban
           ========================================================================= */}
        <div
          ref={popupElementRef}
          className="pointer-events-auto select-auto"
          style={{ display: activePopupData ? 'block' : 'none' }}
        >
          {activePopupData && (() => {
            const totalAttrs = activePopupData.attributes.length;
            const itemsPerPage = 2; // Dibuat 2 atribut per halaman agar popup sangat ramping di HP & Tablet
            const totalPages = Math.max(1, Math.ceil(totalAttrs / itemsPerPage));
            const currentPageSafe = Math.min(Math.max(1, popupPage), totalPages);
            const currentAttributes = activePopupData.attributes.slice(
              (currentPageSafe - 1) * itemsPerPage,
              currentPageSafe * itemsPerPage
            );

            // Mode Terlipat (Minimized): Berupa chip mini agar layar ponsel tetap 95% terbuka untuk zoom & pan
            if (isPopupMinimized) {
              return (
                <div className="relative bg-slate-900/98 backdrop-blur-md border border-slate-700/90 rounded-xl shadow-2xl px-2.5 py-1.5 text-slate-200 flex items-center gap-1.5 max-w-[230px] xs:max-w-[260px] mb-1 animate-in fade-in zoom-in-95 duration-100">
                  <span className={`w-2 h-2 rounded-full shrink-0 ${
                    activePopupData.severity === 'Tinggi' 
                      ? 'bg-red-500 ring-2 ring-red-400/40' 
                      : activePopupData.severity === 'Sedang' 
                      ? 'bg-amber-400 ring-2 ring-amber-400/40' 
                      : 'bg-sky-400 ring-2 ring-sky-400/40'
                  }`} />
                  <span className="font-bold text-[11px] text-white truncate flex-1">
                    {activePopupData.title}
                  </span>
                  <button
                    onClick={() => setIsPopupMinimized(false)}
                    className="px-1.5 py-0.5 rounded bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 text-[9px] font-semibold transition cursor-pointer shrink-0"
                    title="Buka Rincian Informasi"
                  >
                    Buka
                  </button>
                  <button
                    onClick={handleClosePopup}
                    className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition cursor-pointer shrink-0"
                    title="Tutup"
                  >
                    <X className="w-3 h-3" />
                  </button>
                  {/* Mini Pointer Beak */}
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-slate-900 border-r border-b border-slate-700/90 rotate-45 pointer-events-none" />
                </div>
              );
            }

            // Mode Lengkap tapi Super Ramping (Compact) khusus HP & Tablet
            return (
              <div className="relative w-[230px] xs:w-[255px] sm:w-[280px] max-w-[calc(100vw-24px)] bg-slate-900/98 backdrop-blur-md border border-slate-700/90 rounded-xl shadow-2xl overflow-visible text-slate-200 flex flex-col mb-1 animate-in fade-in zoom-in-95 duration-150">
                {/* Header: Judul Nilai Fitur & Tombol Aksi */}
                <div className="p-2 sm:p-2.5 bg-slate-950/95 border-b border-slate-800 rounded-t-xl flex items-start justify-between gap-1.5 shrink-0">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1 mb-0.5 flex-wrap">
                      {activePopupData.severity && activePopupData.severity !== 'Info' ? (
                        <span className={`inline-flex items-center gap-1 px-1.5 py-0.2 rounded text-[9px] font-bold ${
                          activePopupData.severity === 'Tinggi'
                            ? 'bg-red-500/20 text-red-300 border border-red-500/40'
                            : activePopupData.severity === 'Sedang'
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                            : 'bg-sky-500/20 text-sky-300 border border-sky-500/40'
                        }`}>
                          <AlertTriangle className="w-2.5 h-2.5" />
                          <span>{activePopupData.severity}</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded text-[9px] font-bold bg-sky-500/20 text-sky-300 border border-sky-500/40">
                          <Radio className="w-2.5 h-2.5" />
                          <span>WFS</span>
                        </span>
                      )}
                    </div>

                    {/* Judul Objek */}
                    <h3 className="font-bold text-xs text-white leading-tight truncate">
                      {activePopupData.title}
                    </h3>
                    {activePopupData.subtitle && (
                      <p className="text-[10px] text-slate-400 mt-0.2 truncate">
                        {activePopupData.subtitle}
                      </p>
                    )}
                  </div>

                  {/* Tombol Minimize & Close */}
                  <div className="flex items-center gap-0.5 shrink-0">
                    <button
                      onClick={() => setIsPopupMinimized(true)}
                      className="p-1 text-slate-400 hover:text-sky-300 hover:bg-slate-800 rounded transition cursor-pointer"
                      title="Kecilkan popup agar tidak menutupi peta"
                    >
                      <ChevronDown className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={handleClosePopup}
                      className="p-1 text-slate-400 hover:text-white hover:bg-slate-800 rounded transition cursor-pointer"
                      title="Tutup Popup"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Body: Paginated Attribute List (Hanya 2 Atribut per halaman agar pendek) */}
                <div className="p-2 space-y-1.5 text-xs">
                  {/* Top Pagination Bar jika atribut lebih dari 1 halaman */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-between bg-slate-950/80 px-2 py-0.5 rounded-lg border border-slate-800/80 text-[10px]">
                      <span className="text-slate-400 font-medium">
                        {(currentPageSafe - 1) * itemsPerPage + 1}–{Math.min(currentPageSafe * itemsPerPage, totalAttrs)} dari {totalAttrs}
                      </span>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => setPopupPage(p => Math.max(1, p - 1))}
                          disabled={currentPageSafe <= 1}
                          className="px-1 py-0.2 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:pointer-events-none text-slate-200 font-semibold flex items-center gap-0.5 transition cursor-pointer text-[9px]"
                          title="Halaman Sebelumnya"
                        >
                          <ChevronLeft className="w-2.5 h-2.5" />
                          <span>Prev</span>
                        </button>

                        <span className="px-1 rounded bg-slate-900 border border-slate-700/80 text-sky-300 font-mono text-[9px]">
                          {currentPageSafe}/{totalPages}
                        </span>

                        <button
                          onClick={() => setPopupPage(p => Math.min(totalPages, p + 1))}
                          disabled={currentPageSafe >= totalPages}
                          className="px-1 py-0.2 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:pointer-events-none text-slate-200 font-semibold flex items-center gap-0.5 transition cursor-pointer text-[9px]"
                          title="Halaman Berikutnya"
                        >
                          <span>Next</span>
                          <ChevronRight className="w-2.5 h-2.5" />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Attribute Cards (Kompak & Padat) */}
                  <div className="space-y-1">
                    {currentAttributes.map((attr, idx) => (
                      <div 
                        key={idx} 
                        className="bg-slate-950/60 p-1.5 rounded-md border border-slate-800/80"
                      >
                        <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5 leading-none">
                          {attr.label}:
                        </span>
                        <div className="text-white font-medium text-[11px] leading-snug break-words">
                          {attr.value}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Pagination Dots indicator */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-center gap-1 pt-0.5">
                      {Array.from({ length: totalPages }).map((_, i) => (
                        <button
                          key={i}
                          onClick={() => setPopupPage(i + 1)}
                          className={`h-1 rounded-full transition-all cursor-pointer ${
                            currentPageSafe === i + 1 
                              ? 'w-3 bg-sky-400' 
                              : 'w-1 bg-slate-700 hover:bg-slate-600'
                          }`}
                          title={`Ke halaman ${i + 1}`}
                        />
                      ))}
                    </div>
                  )}
                </div>

                {/* Footer: Tombol Aksi Praktis Kompak */}
                <div className="p-1.5 sm:p-2 bg-slate-950/95 border-t border-slate-800 rounded-b-xl flex items-center justify-between gap-1.5 text-[10px] shrink-0">
                  <button
                    onClick={() => copyCoords(activePopupData.coordinates)}
                    className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded font-medium flex items-center gap-1 transition cursor-pointer text-[10px]"
                    title="Salin Koordinat Spasial"
                  >
                    {copiedCoords ? <Check className="w-2.5 h-2.5 text-emerald-400" /> : <Copy className="w-2.5 h-2.5 text-slate-300" />}
                    <span>{copiedCoords ? 'Tersalin' : 'Salin'}</span>
                  </button>

                  <a
                    href={`https://www.google.com/maps?q=${activePopupData.coordinates[1]},${activePopupData.coordinates[0]}`}
                    target="_blank"
                    rel="noreferrer"
                    className="px-2 py-1 bg-sky-500 hover:bg-sky-400 text-slate-950 rounded font-bold flex items-center gap-1 transition text-[10px]"
                    title="Buka di Navigasi Google Maps"
                  >
                    <span>Google Maps</span>
                    <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                </div>

                {/* Pointer Beak / Ekor panah mengarah tepat ke marker titik di peta */}
                <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-slate-950 border-r border-b border-slate-700/90 rotate-45 pointer-events-none shadow-sm" />
              </div>
            );
          })()}
        </div>

        {/* Sidebar WFS GeoServer */}
        <WfsSidebar
          isOpen={isWfsSidebarOpen}
          onClose={() => setIsWfsSidebarOpen(false)}
          showBlackspots={showBlackspots}
          onToggleBlackspots={setShowBlackspots}
          showHeatmap={showHeatmap}
          onToggleHeatmap={setShowHeatmap}
          wfsLayers={wfsLayers}
          onToggleWfsLayer={handleToggleWfsLayer}
          onAddWfsLayer={handleAddWfsLayer}
          onDeleteWfsLayer={handleDeleteWfsLayer}
          onOpenGuide={() => {
            setIsWfsSidebarOpen(false);
            setIsGuideModalOpen(true);
          }}
          onLoadPreset={handleLoadPreset}
        />

        {/* Modal Panduan Lengkap GeoServer */}
        <GeoServerGuideModal
          isOpen={isGuideModalOpen}
          onClose={() => setIsGuideModalOpen(false)}
        />
      </main>
    </div>
  );
};
