import React, { useEffect, useRef, useState, useCallback } from 'react';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import HeatmapLayer from 'ol/layer/Heatmap';
import OSM from 'ol/source/OSM';
import XYZ from 'ol/source/XYZ';
import VectorSource from 'ol/source/Vector';
import Feature, { FeatureLike } from 'ol/Feature';
import Point from 'ol/geom/Point';
import LineString from 'ol/geom/LineString';
import { fromLonLat, toLonLat } from 'ol/proj';
import { Style, Fill, Stroke, Circle as CircleStyle, Text } from 'ol/style';
import Overlay from 'ol/Overlay';
import { ScaleLine } from 'ol/control';
import Draw from 'ol/interaction/Draw';
import { getLength } from 'ol/sphere';

import { BlackspotPoint, BasemapId, FilterState } from '../types/gis';
import { TRANSPORT_CORRIDORS, EMERGENCY_POSTS, ESCAPE_RAMPS } from '../data/nataruData';
import { 
  Ruler, 
  Layers, 
  Maximize2, 
  RotateCcw, 
  MapPin, 
  Flame, 
  ShieldCheck, 
  Compass, 
  Activity,
  X,
  ChevronDown
} from 'lucide-react';

interface MapContainerProps {
  filteredPoints: BlackspotPoint[];
  selectedPoint: BlackspotPoint | null;
  onSelectPoint: (point: BlackspotPoint | null) => void;
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  basemap: BasemapId;
  setBasemap: (b: BasemapId) => void;
  focusTarget: [number, number] | null;
}

export const MapContainer: React.FC<MapContainerProps> = ({
  filteredPoints,
  selectedPoint,
  onSelectPoint,
  filters,
  setFilters,
  basemap,
  setBasemap,
  focusTarget
}) => {
  const mapElementRef = useRef<HTMLDivElement>(null);
  const hoverTooltipRef = useRef<HTMLDivElement>(null);
  const measureTooltipRef = useRef<HTMLDivElement>(null);

  const mapInstanceRef = useRef<Map | null>(null);
  const baseLayerRef = useRef<TileLayer<XYZ | OSM> | null>(null);
  const blackspotSourceRef = useRef<VectorSource>(new VectorSource());
  const blackspotLayerRef = useRef<VectorLayer<VectorSource> | null>(null);
  const heatmapLayerRef = useRef<HeatmapLayer | null>(null);
  const corridorLayerRef = useRef<VectorLayer<VectorSource> | null>(null);
  const postLayerRef = useRef<VectorLayer<VectorSource> | null>(null);
  const escapeRampLayerRef = useRef<VectorLayer<VectorSource> | null>(null);

  const measureSourceRef = useRef<VectorSource>(new VectorSource());
  const measureLayerRef = useRef<VectorLayer<VectorSource> | null>(null);
  const drawInteractionRef = useRef<Draw | null>(null);
  const measureOverlayRef = useRef<Overlay | null>(null);

  const [hoverInfo, setHoverInfo] = useState<{ point: BlackspotPoint; x: number; y: number } | null>(null);
  const [coordsHUD, setCoordsHUD] = useState<{ lon: string; lat: string; zoom: number }>({
    lon: '110.0000',
    lat: '-7.0000',
    zoom: 6
  });
  const [isMeasuring, setIsMeasuring] = useState(false);
  const [measuredDistance, setMeasuredDistance] = useState<string | null>(null);
  const [showBasemapMenu, setShowBasemapMenu] = useState(false);

  // Quick preset regions
  const quickPresets = [
    { label: 'NKRI Overview', coords: [118.0, -2.5] as [number, number], zoom: 5 },
    { label: 'Tol Trans Jawa', coords: [110.2, -7.0] as [number, number], zoom: 7.5 },
    { label: 'Selat Sunda (Merak)', coords: [105.88, -5.90] as [number, number], zoom: 11 },
    { label: 'Selat Bali (Ketapang)', coords: [114.42, -8.15] as [number, number], zoom: 12 },
    { label: 'Trans Sumatera', coords: [104.5, -4.5] as [number, number], zoom: 7 },
    { label: 'Sulawesi & Kaltim', coords: [118.5, -1.0] as [number, number], zoom: 6.5 }
  ];

  // Helper for Basemap Source: Google Maps, OSM, Google Satellite
  const getBasemapSource = (type: BasemapId) => {
    if (type === 'osm') {
      return new OSM();
    }
    if (type === 'google-satellite') {
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

  // Create style for blackspot points
  const getBlackspotStyle = useCallback((feature: FeatureLike) => {
    const severity = feature.get('severity') as string;
    const isSelected = selectedPoint && selectedPoint.id === feature.get('id');
    
    let mainColor = '#0284c7'; // Waspada - Sky Blue
    let haloColor = 'rgba(2, 132, 199, 0.3)';

    if (severity === 'Tinggi') {
      mainColor = '#ef4444'; // Red
      haloColor = 'rgba(239, 68, 68, 0.35)';
    } else if (severity === 'Sedang') {
      mainColor = '#f59e0b'; // Amber
      haloColor = 'rgba(245, 158, 11, 0.35)';
    }

    const radius = isSelected ? 12 : 8;

    return [
      // Outer glowing halo
      new Style({
        image: new CircleStyle({
          radius: radius + 6,
          fill: new Fill({ color: haloColor })
        })
      }),
      // Main circle marker
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
  }, [selectedPoint]);

  // Initialize OpenLayers Map once
  useEffect(() => {
    if (!mapElementRef.current || mapInstanceRef.current) return;

    // Basemap
    const baseTile = new TileLayer({
      source: getBasemapSource(basemap)
    });
    baseLayerRef.current = baseTile;

    // Corridor Vector Layer
    const corridorSource = new VectorSource<Feature<LineString>>();
    TRANSPORT_CORRIDORS.forEach((cor) => {
      const lineCoords = cor.coordinates.map((c) => fromLonLat(c));
      const feat = new Feature({
        geometry: new LineString(lineCoords),
        id: cor.id,
        name: cor.name,
        type: cor.type,
        trafficForecast: cor.trafficForecast
      });
      corridorSource.addFeature(feat);
    });

    const corridorLayer = new VectorLayer({
      source: corridorSource,
      style: (feat) => {
        const type = feat.get('type');
        let strokeColor = '#38bdf8'; // Blue for Pantura/Arteri
        let strokeWidth = 3;
        let lineDash: number[] | undefined = undefined;

        if (type === 'Tol Trans Jawa') {
          strokeColor = '#e11d48'; // Rose red
          strokeWidth = 4;
        } else if (type === 'Tol Trans Sumatera') {
          strokeColor = '#f97316'; // Orange
          strokeWidth = 3.5;
        } else if (type === 'Penyeberangan Selat') {
          strokeColor = '#06b6d4'; // Cyan dashed
          strokeWidth = 3;
          lineDash = [8, 6];
        }

        return [
          // Outer casing
          new Style({
            stroke: new Stroke({
              color: 'rgba(15, 23, 42, 0.7)',
              width: strokeWidth + 3
            })
          }),
          // Core line
          new Style({
            stroke: new Stroke({
              color: strokeColor,
              width: strokeWidth,
              lineDash
            })
          })
        ];
      }
    });
    corridorLayerRef.current = corridorLayer;

    // Emergency Posts Layer
    const postSource = new VectorSource<Feature<Point>>();
    EMERGENCY_POSTS.forEach((post) => {
      const feat = new Feature({
        geometry: new Point(fromLonLat(post.coordinates)),
        id: post.id,
        name: post.name,
        type: post.type,
        phone: post.phone
      });
      postSource.addFeature(feat);
    });

    const postLayer = new VectorLayer({
      source: postSource,
      style: (feat) => {
        const type = feat.get('type') as string;
        const isFaskes = type.includes('RS Rujukan');
        const isSAR = type.includes('SAR');
        const color = isFaskes ? '#10b981' : isSAR ? '#f97316' : '#3b82f6';

        return new Style({
          image: new CircleStyle({
            radius: 6,
            fill: new Fill({ color }),
            stroke: new Stroke({ color: '#ffffff', width: 2 })
          })
        });
      }
    });
    postLayerRef.current = postLayer;

    // Escape Ramps Layer
    const rampSource = new VectorSource<Feature<Point>>();
    ESCAPE_RAMPS.forEach((ramp) => {
      const feat = new Feature({
        geometry: new Point(fromLonLat(ramp.coordinates)),
        id: ramp.id,
        name: ramp.name,
        corridor: ramp.corridor
      });
      rampSource.addFeature(feat);
    });

    const escapeRampLayer = new VectorLayer({
      source: rampSource,
      style: new Style({
        image: new CircleStyle({
          radius: 6.5,
          fill: new Fill({ color: '#14b8a6' }), // Teal
          stroke: new Stroke({ color: '#f8fafc', width: 2 })
        })
      })
    });
    escapeRampLayerRef.current = escapeRampLayer;

    // Blackspot Points Layer
    const blackspotLayer = new VectorLayer({
      source: blackspotSourceRef.current,
      style: getBlackspotStyle
    });
    blackspotLayerRef.current = blackspotLayer;

    // Heatmap Layer
    const heatmapLayer = new HeatmapLayer({
      source: blackspotSourceRef.current,
      blur: 18,
      radius: 14,
      weight: (feat) => {
        const sev = feat.get('severity');
        if (sev === 'Tinggi') return 1.0;
        if (sev === 'Sedang') return 0.65;
        return 0.35;
      },
      visible: filters.showHeatmap
    });
    heatmapLayerRef.current = heatmapLayer;

    // Measure Layer
    const measureLayer = new VectorLayer({
      source: measureSourceRef.current,
      style: new Style({
        fill: new Fill({ color: 'rgba(56, 189, 248, 0.15)' }),
        stroke: new Stroke({
          color: '#38bdf8',
          width: 3,
          lineDash: [6, 6]
        })
      })
    });
    measureLayerRef.current = measureLayer;

    // Map View centered on Java/Indonesia
    const view = new View({
      center: fromLonLat([110.0, -7.0]),
      zoom: 6.8,
      minZoom: 4.5,
      maxZoom: 18
    });

    // Create Map
    const map = new Map({
      target: mapElementRef.current,
      layers: [
        baseTile,
        corridorLayer,
        heatmapLayer,
        postLayer,
        escapeRampLayer,
        blackspotLayer,
        measureLayer
      ],
      view,
      controls: [
        new ScaleLine({ units: 'metric', bar: false, steps: 4, text: true })
      ]
    });

    mapInstanceRef.current = map;

    // Pointer move listener for Coordinates HUD & Hover Tooltip
    map.on('pointermove', (evt) => {
      if (evt.dragging) return;
      const pixel = map.getEventPixel(evt.originalEvent);
      const coord = map.getCoordinateFromPixel(pixel);
      if (coord) {
        const lonLat = toLonLat(coord);
        setCoordsHUD({
          lon: lonLat[0].toFixed(4),
          lat: lonLat[1].toFixed(4),
          zoom: Math.round(map.getView().getZoom() || 6)
        });
      }

      // Check if hovering a blackspot feature
      const hit = map.forEachFeatureAtPixel(pixel, (feature, layer) => {
        if (layer === blackspotLayerRef.current) {
          const pt = feature.get('data') as BlackspotPoint;
          return pt;
        }
        return null;
      });

      const targetEl = map.getTargetElement();
      if (hit) {
        setHoverInfo({ point: hit, x: evt.pixel[0], y: evt.pixel[1] });
        if (targetEl) targetEl.style.cursor = 'pointer';
      } else {
        setHoverInfo(null);
        if (targetEl) targetEl.style.cursor = isMeasuring ? 'crosshair' : '';
      }
    });

    // Click listener to select feature
    map.on('singleclick', (evt) => {
      if (isMeasuring) return;

      const hit = map.forEachFeatureAtPixel(evt.pixel, (feature, layer) => {
        if (layer === blackspotLayerRef.current) {
          return feature.get('data') as BlackspotPoint;
        }
        return null;
      });

      if (hit) {
        onSelectPoint(hit);
      }
    });

    return () => {
      map.setTarget(undefined);
      mapInstanceRef.current = null;
    };
  }, []);

  // Update Basemap tile layer when changed
  useEffect(() => {
    if (!baseLayerRef.current) return;
    baseLayerRef.current.setSource(getBasemapSource(basemap));
  }, [basemap]);

  // Update Blackspot Features when filteredPoints change
  useEffect(() => {
    const src = blackspotSourceRef.current;
    src.clear();

    filteredPoints.forEach((pt) => {
      const feat = new Feature({
        geometry: new Point(fromLonLat(pt.coordinates)),
        id: pt.id,
        code: pt.code,
        name: pt.name,
        severity: pt.severity,
        data: pt
      });
      src.addFeature(feat);
    });
  }, [filteredPoints]);

  // Update layer visibility
  useEffect(() => {
    if (corridorLayerRef.current) {
      corridorLayerRef.current.setVisible(filters.showCorridors);
    }
    if (postLayerRef.current) {
      postLayerRef.current.setVisible(filters.showPosts);
    }
    if (escapeRampLayerRef.current) {
      escapeRampLayerRef.current.setVisible(filters.showEscapeRamps);
    }
    if (heatmapLayerRef.current) {
      heatmapLayerRef.current.setVisible(filters.showHeatmap);
    }
    if (blackspotLayerRef.current) {
      // If heatmap is on, show slightly diminished points or hide
      blackspotLayerRef.current.setOpacity(filters.showHeatmap ? 0.6 : 1.0);
    }
  }, [filters]);

  // Re-style blackspots when selectedPoint changes
  useEffect(() => {
    if (blackspotLayerRef.current) {
      blackspotLayerRef.current.setStyle(getBlackspotStyle);
    }
  }, [selectedPoint, getBlackspotStyle]);

  // Handle focusTarget (fly-to coordinate)
  useEffect(() => {
    if (!focusTarget || !mapInstanceRef.current) return;
    const view = mapInstanceRef.current.getView();
    view.animate({
      center: fromLonLat(focusTarget),
      zoom: 12.5,
      duration: 700
    });
  }, [focusTarget]);

  // Measurement Interaction Handler
  const toggleMeasure = () => {
    if (!mapInstanceRef.current) return;

    if (isMeasuring) {
      // Disable
      if (drawInteractionRef.current) {
        mapInstanceRef.current.removeInteraction(drawInteractionRef.current);
        drawInteractionRef.current = null;
      }
      measureSourceRef.current.clear();
      setIsMeasuring(false);
      setMeasuredDistance(null);
      const targetEl = mapInstanceRef.current.getTargetElement();
      if (targetEl) {
        targetEl.style.cursor = '';
      }
    } else {
      // Enable
      setIsMeasuring(true);
      measureSourceRef.current.clear();
      setMeasuredDistance(null);

      const draw = new Draw({
        source: measureSourceRef.current,
        type: 'LineString'
      });

      draw.on('drawstart', (evt) => {
        measureSourceRef.current.clear();
        setMeasuredDistance('Mengukur...');
        const geom = evt.feature.getGeometry() as LineString;
        geom.on('change', () => {
          const length = getLength(geom);
          if (length > 1000) {
            setMeasuredDistance(`${(length / 1000).toFixed(2)} km`);
          } else {
            setMeasuredDistance(`${Math.round(length)} meter`);
          }
        });
      });

      draw.on('drawend', (evt) => {
        const geom = evt.feature.getGeometry() as LineString;
        const length = getLength(geom);
        setMeasuredDistance(`${(length / 1000).toFixed(2)} km`);
      });

      mapInstanceRef.current.addInteraction(draw);
      drawInteractionRef.current = draw;
      const targetEl = mapInstanceRef.current.getTargetElement();
      if (targetEl) {
        targetEl.style.cursor = 'crosshair';
      }
    }
  };

  // Zoom helpers
  const handleZoomIn = () => {
    if (!mapInstanceRef.current) return;
    const view = mapInstanceRef.current.getView();
    view.animate({ zoom: (view.getZoom() || 6) + 1, duration: 250 });
  };

  const handleZoomOut = () => {
    if (!mapInstanceRef.current) return;
    const view = mapInstanceRef.current.getView();
    view.animate({ zoom: (view.getZoom() || 6) - 1, duration: 250 });
  };

  const handleResetOrientation = () => {
    if (!mapInstanceRef.current) return;
    const view = mapInstanceRef.current.getView();
    view.animate({ rotation: 0, duration: 300 });
  };

  return (
    <div className="relative w-full h-full overflow-hidden bg-slate-950 flex flex-col">
      {/* Map DOM Element */}
      <div ref={mapElementRef} className="w-full h-full" />

      {/* Top Floating Presets Bar */}
      <div className="absolute top-3 left-14 z-10 hidden sm:flex items-center gap-1.5 p-1 bg-slate-900/90 backdrop-blur-md border border-slate-700/80 rounded-lg shadow-xl shadow-black/40">
        <span className="text-[11px] font-semibold text-slate-400 px-2 flex items-center gap-1">
          <Compass className="w-3.5 h-3.5 text-sky-400" />
          <span>Fokus:</span>
        </span>
        {quickPresets.map((preset) => (
          <button
            key={preset.label}
            onClick={() => {
              if (mapInstanceRef.current) {
                mapInstanceRef.current.getView().animate({
                  center: fromLonLat(preset.coords),
                  zoom: preset.zoom,
                  duration: 800
                });
              }
            }}
            className="px-2.5 py-1 text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800 rounded transition-colors whitespace-nowrap cursor-pointer"
          >
            {preset.label}
          </button>
        ))}
      </div>

      {/* Floating Basemap & Tool Controls (Top-Right) */}
      <div className="absolute top-3 right-3 z-20 flex flex-col gap-2 items-end">
        {/* Basemap Switcher Button */}
        <div className="relative">
          <button
            onClick={() => setShowBasemapMenu(!showBasemapMenu)}
            className="flex items-center gap-2 px-3 py-2 bg-slate-900/95 backdrop-blur-md border border-slate-700 hover:border-sky-500 text-slate-200 text-xs font-semibold rounded-lg shadow-xl hover:text-white transition cursor-pointer"
            title="Ganti Peta Dasar (Basemap)"
          >
            <Layers className="w-4 h-4 text-sky-400" />
            <span className="text-slate-400">Peta:</span>
            <span className="text-sky-300 font-bold">
              {basemap === 'google-maps' ? 'Google Maps' :
               basemap === 'osm' ? 'OpenStreetMap' : 'Google Satelit'}
            </span>
            <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${showBasemapMenu ? 'rotate-180' : ''}`} />
          </button>

          {showBasemapMenu && (
            <>
              {/* Click-outside backdrop */}
              <div 
                className="fixed inset-0 z-20" 
                onClick={() => setShowBasemapMenu(false)}
              />
              <div className="absolute right-0 mt-2 w-52 bg-slate-900/98 backdrop-blur-md border border-slate-700 rounded-xl shadow-2xl p-2 z-30 space-y-1 animate-in fade-in duration-150">
                <div className="text-[10px] uppercase font-bold text-slate-400 px-2 py-1 flex items-center justify-between border-b border-slate-800 pb-1 mb-1">
                  <span>Pilihan Peta Dasar</span>
                  <span className="text-sky-400 font-mono">3 Pilihan</span>
                </div>
                {[
                  { id: 'google-maps', name: 'Google Maps', sub: 'Peta jalan navigasi rinci' },
                  { id: 'osm', name: 'OpenStreetMap (OSM)', sub: 'Peta jalan komunitas global' },
                  { id: 'google-satellite', name: 'Google Satelit', sub: 'Citra satelit bumi riil & label' }
                ].map((b) => (
                  <button
                    key={b.id}
                    onClick={() => {
                      setBasemap(b.id as BasemapId);
                      setShowBasemapMenu(false);
                    }}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg transition flex items-center justify-between cursor-pointer ${
                      basemap === b.id 
                        ? 'bg-sky-500/20 text-sky-300 font-bold border border-sky-500/40' 
                        : 'text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <div>
                      <div className="text-xs font-semibold">{b.name}</div>
                      <div className="text-[10px] text-slate-400">{b.sub}</div>
                    </div>
                    {basemap === b.id && <span className="w-2 h-2 rounded-full bg-sky-400 shadow-sm shadow-sky-400/50"></span>}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Action button: Toggle Heatmap */}
        <button
          onClick={() => setFilters(prev => ({ ...prev, showHeatmap: !prev.showHeatmap }))}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold backdrop-blur-md border shadow-lg transition cursor-pointer ${
            filters.showHeatmap
              ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 shadow-rose-900/30'
              : 'bg-slate-900/90 text-slate-300 border-slate-700/80 hover:bg-slate-800'
          }`}
          title="Mode Peta Kepadatan Kerawanan (Heatmap)"
        >
          <Flame className="w-4 h-4 text-rose-400" />
          <span>Heatmap {filters.showHeatmap ? 'Aktif' : 'Mati'}</span>
        </button>

        {/* Action button: Measurement Tool */}
        <button
          onClick={toggleMeasure}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold backdrop-blur-md border shadow-lg transition cursor-pointer ${
            isMeasuring
              ? 'bg-sky-500 text-slate-950 font-bold border-sky-400 shadow-sky-500/40'
              : 'bg-slate-900/90 text-slate-300 border-slate-700/80 hover:bg-slate-800'
          }`}
          title="Ukur Jarak Titik Rawan (Distance Tool)"
        >
          <Ruler className="w-4 h-4" />
          <span>{isMeasuring ? 'Batal Ukur' : 'Ukur Jarak'}</span>
        </button>

        {/* Measurement floating result indicator */}
        {isMeasuring && measuredDistance && (
          <div className="bg-slate-900/95 border border-sky-400 text-white px-3 py-2 rounded-lg text-xs font-mono shadow-2xl flex items-center gap-2">
            <span className="text-sky-400 font-bold">Jarak:</span>
            <span className="font-semibold tabular-nums text-white">{measuredDistance}</span>
            <button 
              onClick={() => {
                measureSourceRef.current.clear();
                setMeasuredDistance(null);
              }}
              className="ml-1 text-slate-400 hover:text-white"
              title="Reset Pengukuran"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Floating Custom Zoom & Orientation Controls (Right-Center) */}
      <div className="absolute right-3 bottom-14 z-10 flex flex-col gap-1.5">
        <button
          onClick={handleZoomIn}
          className="w-9 h-9 flex items-center justify-center bg-slate-900/90 backdrop-blur-md border border-slate-700 text-slate-200 hover:text-white hover:bg-slate-800 rounded-lg shadow-lg font-bold text-lg transition cursor-pointer"
          title="Perbesar Peta (+)"
        >
          +
        </button>
        <button
          onClick={handleZoomOut}
          className="w-9 h-9 flex items-center justify-center bg-slate-900/90 backdrop-blur-md border border-slate-700 text-slate-200 hover:text-white hover:bg-slate-800 rounded-lg shadow-lg font-bold text-lg transition cursor-pointer"
          title="Perkecil Peta (-)"
        >
          −
        </button>
        <button
          onClick={handleResetOrientation}
          className="w-9 h-9 flex items-center justify-center bg-slate-900/90 backdrop-blur-md border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg shadow-lg transition cursor-pointer"
          title="Reset Orientasi Utara"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Live Coordinate & Status HUD (Bottom-Center / Left) */}
      <div className="absolute bottom-2 left-32 z-10 hidden md:flex items-center gap-3 px-3 py-1.5 bg-slate-900/90 backdrop-blur-md border border-slate-700/80 rounded-lg text-[11px] font-mono text-slate-300 shadow-lg">
        <div className="flex items-center gap-1.5">
          <span className="text-slate-500">LON:</span>
          <span className="text-sky-300 tabular-nums">{coordsHUD.lon}° E</span>
        </div>
        <span className="text-slate-600">|</span>
        <div className="flex items-center gap-1.5">
          <span className="text-slate-500">LAT:</span>
          <span className="text-sky-300 tabular-nums">{coordsHUD.lat}° S</span>
        </div>
        <span className="text-slate-600">|</span>
        <div className="flex items-center gap-1.5">
          <span className="text-slate-500">ZOOM:</span>
          <span className="text-emerald-400 tabular-nums">{coordsHUD.zoom}</span>
        </div>
        <span className="text-slate-600">|</span>
        <div className="flex items-center gap-1.5 text-slate-400">
          <span>PROYEKSI:</span>
          <span className="text-slate-200 font-sans font-medium">EPSG:3857 (WGS84)</span>
        </div>
      </div>

      {/* Floating Hover Tooltip */}
      {hoverInfo && !selectedPoint && (
        <div
          ref={hoverTooltipRef}
          style={{
            position: 'absolute',
            left: `${hoverInfo.x + 15}px`,
            top: `${hoverInfo.y - 15}px`,
            pointerEvents: 'none'
          }}
          className="z-30 max-w-xs bg-slate-900/95 border border-slate-600 rounded-lg shadow-2xl p-2.5 text-white backdrop-blur-md transition-all animate-in fade-in duration-100"
        >
          <div className="flex items-center justify-between gap-2 mb-1">
            <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${
              hoverInfo.point.severity === 'Tinggi' 
                ? 'bg-red-500/20 text-red-300 border border-red-500/40' 
                : hoverInfo.point.severity === 'Sedang'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                : 'bg-sky-500/20 text-sky-300 border border-sky-500/40'
            }`}>
              Rawan {hoverInfo.point.severity}
            </span>
            <span className="text-[10px] font-mono text-slate-400">{hoverInfo.point.code}</span>
          </div>
          <div className="font-bold text-xs text-white leading-snug">{hoverInfo.point.name}</div>
          <div className="text-[11px] text-slate-400 mt-0.5">{hoverInfo.point.roadName}</div>
          <div className="text-[10px] text-sky-400 mt-1 flex items-center gap-1">
            <span>Klik untuk inspeksi detail operasional</span>
          </div>
        </div>
      )}
    </div>
  );
};
