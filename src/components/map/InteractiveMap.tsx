import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Icon } from 'leaflet';
import { useEffect, useState, useRef, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExternalLink, Calendar, MapPin } from 'lucide-react';
import { Regulation } from '@/types/regulation';
import { formatStatus } from '@/lib/utils';
import { countryCoordinates } from '@/data/countryMapping';
import {
  getAncestors as getHierarchyAncestors,
  getRegionForLocation,
  isLocationInRegion,
  locationHierarchy,
  type RegionCode,
} from '@/data/locationHierarchy';
import 'leaflet/dist/leaflet.css';

// Custom CSS to remove tile gridlines - more aggressive approach
const mapStyles = `
  .leaflet-tile {
    border: none !important;
    outline: none !important;
    image-rendering: -webkit-optimize-contrast;
    image-rendering: crisp-edges;
    filter: none !important;
    box-shadow: none !important;
  }
  .leaflet-tile-pane {
    border: none !important;
    outline: none !important;
    box-shadow: none !important;
  }
  .leaflet-tile-container {
    border: none !important;
    outline: none !important;
    box-shadow: none !important;
  }
  .leaflet-layer {
    border: none !important;
    outline: none !important;
    box-shadow: none !important;
  }
  .leaflet-map-pane {
    border: none !important;
    outline: none !important;
    box-shadow: none !important;
  }
  .leaflet-tile-pane img {
    border: none !important;
    outline: none !important;
    box-shadow: none !important;
    filter: none !important;
  }
  .leaflet-zoom-animated {
    border: none !important;
    outline: none !important;
    box-shadow: none !important;
  }
  .leaflet-tile-pane canvas {
    border: none !important;
    outline: none !important;
    box-shadow: none !important;
  }
  
  .leaflet-popup {
    max-width: 320px !important;
    min-width: 280px !important;
    width: 320px !important;
  }
  
  .leaflet-popup-content-wrapper {
    border-radius: 8px !important;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06) !important;
    min-width: 280px !important;
    max-width: 320px !important;
    width: 320px !important;
  }
  
  .leaflet-popup-tip {
    background: white !important;
    border: 1px solid #ccc !important;
  }
  
  .leaflet-popup-content {
    margin: 0 !important;
    padding: 0 !important;
    min-width: 280px !important;
    max-width: 320px !important;
    width: 320px !important;
  }
  
  .map-popup {
    min-width: 280px !important;
    max-width: 320px !important;
    width: 320px !important;
  }
  
  .leaflet-popup-pane {
    z-index: 1000 !important;
  }
  
  .leaflet-popup-scroll {
    max-height: 300px !important;
    overflow-y: auto !important;
  }
  
  /* Mobile-friendly popup styles */
  @media (max-width: 640px) {
    .leaflet-popup {
      max-width: 280px !important;
      min-width: 250px !important;
      width: 280px !important;
    }
    
    .leaflet-popup-content-wrapper {
      min-width: 250px !important;
      max-width: 280px !important;
      width: 280px !important;
    }
    
    .leaflet-popup-content {
      min-width: 250px !important;
      max-width: 280px !important;
      width: 280px !important;
    }
    
    .map-popup {
      min-width: 250px !important;
      max-width: 280px !important;
      width: 280px !important;
    }
  }
  
  /* Scrollbar styling for popup content */
  .scrollbar-thin::-webkit-scrollbar {
    width: 4px;
  }
  
  .scrollbar-thin::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 2px;
  }
  
  .scrollbar-thin::-webkit-scrollbar-thumb {
    background: #c1c1c1;
    border-radius: 2px;
  }
  
  .scrollbar-thin::-webkit-scrollbar-thumb:hover {
    background: #a1a1a1;
  }
  
`;

// Fix for default markers in react-leaflet
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// @ts-ignore
delete Icon.Default.prototype._getIconUrl;
Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

interface InteractiveMapProps {
  regulations: Regulation[];
  onRegulationClick: (regulation: Regulation) => void;
  /** When true, hide the map legend (e.g. when login overlay is visible so it doesn't appear on top) */
}

// Country coordinates are now imported from countryMapping.ts

// Location level for pin placement (state vs country)
type LocationLevel = 'region' | 'country' | 'state';

// Regulation scope: Global, Regional, National, State/Province
type RegulationScope = 'global' | 'regional' | 'country' | 'state';

// Earth theme colors for pins
const earthThemeColors = {
  primary: '#1B4332',    // Deep forest green
  accent: '#A8C686',     // Soft sage
  sand: '#DAD7CD',       // Muted sand
};

type RegulationTarget =
  | { type: 'location'; name: string }
  | { type: 'region'; region: 'EU' | 'Asia-Pacific' | 'North America' | 'South America' }
  | { type: 'global' };

const mapRegion = (r: RegionCode): RegulationTarget['region'] | null =>
  r === 'EU' || r === 'Asia-Pacific' || r === 'North America' || r === 'South America' ? r : null;

// Determine the location level for a given location name (from global hierarchy)
const getLocationLevel = (locationName: string): LocationLevel => {
  return locationHierarchy[locationName]?.level ?? 'country';
};

// Return the single "local" location for a regulation that should get a pin, or null if no pin.
// Pins only appear where there is at least one regulation that is specifically from that place.
const getPrimaryLocation = (regulation: Regulation): string | null => {
  const jurisdiction = regulation.jurisdiction || '';
  const country = regulation.country || '';

  // State/province level → pin on that state/province (from global hierarchy)
  if (locationHierarchy[jurisdiction]?.level === 'state') {
    return countryCoordinates[jurisdiction as keyof typeof countryCoordinates] ? jurisdiction : null;
  }

  // US federal → pin on United States
  if (jurisdiction === 'US') return 'United States';

  // UK → pin on United Kingdom
  if (jurisdiction === 'UK') return 'United Kingdom';

  // Canada-wide (North America + Canada) → pin on Canada
  if (jurisdiction === 'North America' && country === 'Canada') return 'Canada';

  // EU with country 'European Union' → no pin (EU-wide only, no single local place)
  if (jurisdiction === 'EU' && (country === 'European Union' || !country)) return null;

  // EU with a specific member state (e.g. Swedish, Italian law) → pin on that country
  if (jurisdiction === 'EU' && country && country !== 'European Union') {
    return countryCoordinates[country as keyof typeof countryCoordinates] ? country : null;
  }

  // Global → no pin
  if (jurisdiction === 'Global' || country === 'Global') return null;

  // Regional jurisdiction with specific country (South America → Brazil, Asia-Pacific → Japan, etc.)
  if (['South America', 'Asia-Pacific'].includes(jurisdiction) && country) {
    const region = getRegionForLocation(country);
    if (region && (region === 'South America' || region === 'Asia-Pacific' || region === 'Oceania') && countryCoordinates[country as keyof typeof countryCoordinates]) {
      return country;
    }
  }

  // Country-level or region with specific country (France, Germany, etc.)
  const candidate = jurisdiction || country;
  if (candidate && countryCoordinates[candidate as keyof typeof countryCoordinates]) return candidate;

  return null;
};

// Normalize jurisdiction for region comparison (e.g. "Asia Pacific" or "Asia-Pacific" both match)
const isAsiaPacificJurisdiction = (j: string): boolean =>
  (j || '').trim() === 'Asia-Pacific' || (j || '').trim().replace(/\s+/g, '-') === 'Asia-Pacific';

// Universal: regulation's effective target (lowest-level location, or region-wide, or global).
const getRegulationTarget = (regulation: Regulation): RegulationTarget => {
  const jurisdiction = (regulation.jurisdiction || '').trim();
  const country = (regulation.country || '').trim();

  if (jurisdiction === 'Global' || country === 'Global') return { type: 'global' };

  // EU: region-wide vs country-specific
  if (jurisdiction === 'EU') {
    if (country === 'European Union' || !country) return { type: 'region', region: 'EU' };
    if (country && countryCoordinates[country as keyof typeof countryCoordinates]) return { type: 'location', name: country };
  }

  // Asia-Pacific: region-wide vs country-specific; country-specific only shows in that country
  if (isAsiaPacificJurisdiction(jurisdiction)) {
    if (country && isLocationInRegion(country, 'Asia-Pacific') && countryCoordinates[country as keyof typeof countryCoordinates]) {
      return { type: 'location', name: country };
    }
    if (country && getRegionForLocation(country) === 'Oceania' && countryCoordinates[country as keyof typeof countryCoordinates]) {
      return { type: 'location', name: country };
    }
    return { type: 'region', region: 'Asia-Pacific' };
  }

  // South America: region-wide vs country-specific
  if (jurisdiction === 'South America') {
    if (country && countryCoordinates[country as keyof typeof countryCoordinates]) return { type: 'location', name: country };
    return { type: 'region', region: 'South America' };
  }

  // North America: Canada-wide, US, or region-wide
  if (jurisdiction === 'North America') {
    if (country === 'Canada') return { type: 'location', name: 'Canada' };
    if (country === 'United States') return { type: 'location', name: 'United States' };
    return { type: 'region', region: 'North America' };
  }

  // State/province level → specific location (from global hierarchy)
  if (locationHierarchy[jurisdiction]?.level === 'state') {
    if (countryCoordinates[jurisdiction as keyof typeof countryCoordinates]) return { type: 'location', name: jurisdiction };
  }

  if (jurisdiction === 'US') return { type: 'location', name: 'United States' };
  if (jurisdiction === 'UK') return { type: 'location', name: 'United Kingdom' };

  // Country-level (France, Germany, Japan, etc.)
  const candidate = jurisdiction || country;
  if (candidate && countryCoordinates[candidate as keyof typeof countryCoordinates]) return { type: 'location', name: candidate };

  return { type: 'global' };
};

// Ancestors of a pin location (from global hierarchy; includes parent country and region).
const getAncestors = (locationName: string): string[] => {
  const fromHierarchy = getHierarchyAncestors(locationName);
  return fromHierarchy.length > 0 ? fromHierarchy : ['Global'];
};

const locationBelongsToRegion = (locationName: string, region: 'EU' | 'Asia-Pacific' | 'North America' | 'South America'): boolean => {
  const r = mapRegion(getRegionForLocation(locationName) ?? ('' as RegionCode));
  return r === region;
};

// Get all regulations that apply to a specific location (universal rule).
// A regulation applies to location L if: (1) its target is L or an ancestor of L, (2) its target is region-wide and L is in that region, or (3) its target is global.
const getApplicableRegulations = (locationName: string, allRegulations: Regulation[]): Regulation[] => {
  const applicable: Regulation[] = [];
  const addedIds = new Set<string>();
  const ancestors = getAncestors(locationName);

  allRegulations.forEach(regulation => {
    const target = getRegulationTarget(regulation);

    let applies = false;
    if (target.type === 'global') {
      applies = true;
    } else if (target.type === 'location') {
      applies = target.name === locationName || ancestors.includes(target.name);
    } else {
      applies = locationBelongsToRegion(locationName, target.region);
    }

    if (applies && !addedIds.has(regulation.id)) {
      applicable.push(regulation);
      addedIds.add(regulation.id);
    }
  });

  return applicable;
};

// Get the scope of a specific regulation: Global, Regional, National, or State/Province
const getRegulationLevel = (regulation: Regulation): RegulationScope => {
  const jurisdiction = regulation.jurisdiction || '';
  const country = regulation.country || '';
  
  // Global — applies everywhere (ISSB, GRI, SASB)
  if (jurisdiction === 'Global' || country === 'Global') {
    return 'global';
  }
  
  // State/Province — sub-national (from global hierarchy)
  if (locationHierarchy[jurisdiction]?.level === 'state') {
    return 'state';
  }
  
  // National — regional jurisdiction but with a specific country (e.g. South America + Brazil, Asia-Pacific + Japan)
  if (jurisdiction === 'EU' && country && country !== 'European Union') return 'country';
  if (isAsiaPacificJurisdiction(jurisdiction) && country) return 'country';
  if (jurisdiction === 'South America' && country) return 'country';
  if (jurisdiction === 'North America' && (country === 'Canada' || country === 'United States')) return 'country';
  
  // Regional — multi-country region with no specific country (EU-wide, Asia-Pacific-wide, etc.)
  if (['EU', 'Asia-Pacific', 'South America', 'North America'].includes(jurisdiction) || country === 'European Union') {
    return 'regional';
  }
  
  // National — country-level (France, Germany, Japan, etc.)
  return 'country';
};

// Create custom marker icon using earth theme colors
const createCustomIcon = (locationLevel: LocationLevel) => {
  // Use earth theme - darker green for more specific (state), lighter for broader (country)
  const color = locationLevel === 'state' ? earthThemeColors.primary : earthThemeColors.primary;
  
  // All pins use the same earth-themed style, just standard pin shape
  return new Icon({
    iconUrl: `data:image/svg+xml;base64,${btoa(`
      <svg width="25" height="41" viewBox="0 0 25 41" xmlns="http://www.w3.org/2000/svg">
        <path d="M12.5 0C5.6 0 0 5.6 0 12.5c0 12.5 12.5 28.5 12.5 28.5s12.5-16 12.5-28.5C25 5.6 19.4 0 12.5 0z" fill="${color}" stroke="#fff" stroke-width="1.5"/>
        <circle cx="12.5" cy="12.5" r="6" fill="white"/>
      </svg>
    `)}`,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [0, -41],
  });
};

// Colors for regulation scope badges in popups
const regulationLevelColors: Record<RegulationScope, { bg: string; text: string; border: string }> = {
  global: { bg: '#E0E7FF', text: '#4338CA', border: '#818CF8' },     // Indigo for global
  regional: { bg: '#C7D2FE', text: '#3730A3', border: '#6366F1' },  // Lighter indigo for regional
  country: { bg: '#D1FAE5', text: '#065F46', border: '#34D399' },   // Green for national
  state: { bg: '#FEF3C7', text: '#92400E', border: '#FBBF24' },     // Amber for state/province
};

const InteractiveMap: React.FC<InteractiveMapProps> = ({ regulations, onRegulationClick }) => {
  const [regulationsByCountry, setRegulationsByCountry] = useState<Record<string, Regulation[]>>({});
  const [mapRef, setMapRef] = useState<any>(null);
  const popupOpenTimeRef = useRef<number>(0);
  const worldMinZoomRef = useRef<number>(2);

  // Inject custom CSS to remove gridlines
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = mapStyles;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  // Store marker refs for programmatic popup control
  const markerRefs = useRef<Record<string, any>>({});

  // Handle marker click - ensure proper zoom and popup display
  const handleMarkerClick = useCallback((country: string, coords: { lat: number; lng: number }) => {
    if (!mapRef) return;
    
    // Close any existing popup first
    mapRef.closePopup();
    
    // Get current zoom level
    const currentZoom = mapRef.getZoom();
    const minZoomForPopup = 3;
    
    // If zoomed out too far, zoom in first then open popup
    if (currentZoom < minZoomForPopup) {
      mapRef.setView([coords.lat, coords.lng], minZoomForPopup, { animate: true });
      // Open popup after zoom animation completes; lock min zoom so user can't zoom out past this view
      setTimeout(() => {
        popupOpenTimeRef.current = Date.now();
        const marker = markerRefs.current[country];
        if (marker) {
          marker.openPopup();
        }
        mapRef.setMinZoom(mapRef.getZoom());
      }, 400);
    } else {
      // Just center and open popup; lock min zoom
      mapRef.setView([coords.lat, coords.lng], currentZoom, { animate: true });
      setTimeout(() => {
        popupOpenTimeRef.current = Date.now();
        const marker = markerRefs.current[country];
        if (marker) {
          marker.openPopup();
        }
        mapRef.setMinZoom(mapRef.getZoom());
      }, 150);
    }
  }, [mapRef]);

  // Fit world to container on load and when zoomed all the way out; set minZoom to prevent zooming out past that
  const WORLD_BOUNDS: [[number, number], [number, number]] = [[-85, -180], [85, 180]];
  const fitWorld = useCallback((map: any) => {
    map.fitBounds(WORLD_BOUNDS, { padding: [0, 0], maxZoom: 2 });
    const zoomAfterFit = map.getZoom();
    map.setMinZoom(zoomAfterFit);
  }, []);

  useEffect(() => {
    if (!mapRef) return;
    fitWorld(mapRef);
    worldMinZoomRef.current = mapRef.getMinZoom();
    // Re-fit after a short delay so container has final size (removes sliver on first load)
    const t = setTimeout(() => {
      fitWorld(mapRef);
      worldMinZoomRef.current = mapRef.getMinZoom();
    }, 100);

    const onZoomEnd = () => {
      if (mapRef.getZoom() === mapRef.getMinZoom()) {
        mapRef.fitBounds(WORLD_BOUNDS, { padding: [0, 0], maxZoom: 2 });
      }
    };
    const onResize = () => {
      mapRef.invalidateSize();
      if (mapRef.getZoom() === mapRef.getMinZoom()) {
        mapRef.fitBounds(WORLD_BOUNDS, { padding: [0, 0], maxZoom: 2 });
      }
    };
    const onPopupClose = () => {
      mapRef.setMinZoom(worldMinZoomRef.current);
    };

    mapRef.on('zoomend', onZoomEnd);
    mapRef.on('popupclose', onPopupClose);
    window.addEventListener('resize', onResize);

    return () => {
      clearTimeout(t);
      mapRef.off('zoomend', onZoomEnd);
      mapRef.off('popupclose', onPopupClose);
      window.removeEventListener('resize', onResize);
    };
  }, [mapRef, fitWorld]);

  useEffect(() => {
    // 1. Pin only where there's a local regulation: use primary location per regulation (no EU-wide or Global pins)
    const locations = new Set<string>();

    regulations.forEach(regulation => {
      const primary = getPrimaryLocation(regulation);
      if (primary) locations.add(primary);
    });

    // 2. Only show the most specific pin: remove parent when a subsidiary exists (using global hierarchy)
    for (const loc of locations) {
      const meta = locationHierarchy[loc];
      if (meta?.parentCountry === 'United States') {
        locations.delete('United States');
        break;
      }
    }
    for (const loc of locations) {
      const meta = locationHierarchy[loc];
      if (meta?.parentCountry === 'Canada') {
        locations.delete('Canada');
        break;
      }
    }
    for (const loc of locations) {
      const meta = locationHierarchy[loc];
      if (meta?.parentCountry === 'Germany') {
        locations.delete('Germany');
        break;
      }
    }

    // 3. For each remaining location, get ALL applicable regulations (hierarchical)
    const grouped: Record<string, Regulation[]> = {};

    locations.forEach(location => {
      const applicableRegs = getApplicableRegulations(location, regulations);
      if (applicableRegs.length > 0) {
        grouped[location] = applicableRegs;
      }
    });

    setRegulationsByCountry(grouped);
  }, [regulations]);

  const getCountryCoordinates = (country: string) => {
    return countryCoordinates[country as keyof typeof countryCoordinates] || null;
  };

  // Get regulation scope label for display
  const getRegulationLevelLabel = (level: RegulationScope): string => {
    switch (level) {
      case 'global': return 'Global';
      case 'regional': return 'Regional';
      case 'country': return 'National';
      case 'state': return 'State/Province';
    }
  };

  // Group regulations by scope for display (state, country, regional, global)
  const groupRegulationsByLevel = (regs: Regulation[]): Record<RegulationScope, Regulation[]> => {
    const grouped: Record<RegulationScope, Regulation[]> = {
      global: [],
      regional: [],
      country: [],
      state: []
    };
    
    regs.forEach(reg => {
      const level = getRegulationLevel(reg);
      grouped[level].push(reg);
    });
    
    return grouped;
  };

  const getTileLayerUrl = (language: string) => {
    // Use CartoDB Voyager tiles with Earth-friendly colors and no gridlines
    // This provides a clean, professional look that complements the Earth theme
    return 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';
  };

  const getTileLayerAttribution = (language: string) => {
    return '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>';
  };

  // Match Voyager water so the top sliver blends in (lighter than before)
  const MAP_WATER_BG = '#C5DFE8';

  return (
    <div className="w-full h-[400px] sm:h-[500px] md:h-[500px] lg:h-[600px] rounded-lg overflow-hidden shadow-lg border border-earth-sand relative max-w-6xl mx-auto" style={{ backgroundColor: MAP_WATER_BG }}>
      
      <MapContainer
        center={[20, 0]}
        zoom={2}
        style={{ 
          height: '100%', 
          width: '100%',
          backgroundColor: MAP_WATER_BG
        }}
        className="z-0 rounded-lg"
        maxBounds={[[-85, -180], [85, 180]]}
        maxBoundsViscosity={1.0}
        worldCopyJump={false}
        zoomControl={true}
        scrollWheelZoom={true}
        doubleClickZoom={true}
        touchZoom={true}
        ref={setMapRef}
      >
        <TileLayer
          attribution={getTileLayerAttribution('en')}
          url={getTileLayerUrl('en')}
        />
        
        {Object.entries(regulationsByCountry).map(([location, locationRegulations]) => {
          const coords = getCountryCoordinates(location);
          if (!coords) return null;
          
          const locationLevel = getLocationLevel(location);
          const groupedRegs = groupRegulationsByLevel(locationRegulations);
          
          return (
            <Marker
              key={location}
              position={[coords.lat, coords.lng]}
              icon={createCustomIcon(locationLevel)}
              ref={(ref) => {
                if (ref) {
                  markerRefs.current[location] = ref;
                }
              }}
              eventHandlers={{
                click: (e) => {
                  e.originalEvent.stopPropagation();
                  handleMarkerClick(location, coords);
                }
              }}
            >
              <Popup 
                className="map-popup"
                maxWidth={320}
                minWidth={280}
                closeButton={true}
                autoClose={true}
                closeOnClick={false}
                autoPan={true}
                autoPanPadding={[50, 50]}
                keepInView={true}
                offset={[0, -35]}
              >
                <div className="p-2 w-full max-w-[280px] sm:max-w-[320px]">
                  <h3 className="font-semibold text-earth-primary mb-1 flex items-center">
                    <MapPin className="w-4 h-4 mr-1" />
                    {coords.name}
                  </h3>
                  <p className="text-sm text-earth-text mb-3">
                    {locationRegulations.length} applicable regulation{locationRegulations.length !== 1 ? 's' : ''}
                  </p>
                  
                  <div className="space-y-3 max-h-[200px] sm:max-h-[300px] overflow-y-auto pr-1 scrollbar-thin">
                    {/* Show regulations grouped by scope: State/Province → National → Regional → Global */}
                    {(['state', 'country', 'regional', 'global'] as RegulationScope[]).map(level => {
                      const regsForLevel = groupedRegs[level];
                      if (regsForLevel.length === 0) return null;
                      
                      const colors = regulationLevelColors[level];
                      
                      return (
                        <div key={level}>
                          <div 
                            className="text-xs font-semibold mb-1.5 px-2 py-1 rounded"
                            style={{ backgroundColor: colors.bg, color: colors.text }}
                          >
                            {getRegulationLevelLabel(level)} ({regsForLevel.length})
                          </div>
                          <div className="space-y-1.5">
                            {regsForLevel.map((regulation) => (
                              <Card 
                                key={regulation.id} 
                                className="p-2 border hover:shadow-md transition-shadow cursor-pointer"
                                style={{ borderColor: colors.border }}
                              >
                                <div className="flex items-start justify-between">
                                  <div className="flex-1 min-w-0">
                                    <h4 className="font-medium text-xs text-earth-text line-clamp-2 mb-1">
                                      {regulation.title}
                                    </h4>
                                    <div className="flex items-center gap-1.5 flex-wrap">
                                      <Badge 
                                        className={`text-[10px] px-1.5 py-0 ${
                                          regulation.status === 'active' ? 'bg-green-100 text-green-800' :
                                          regulation.status === 'proposed' ? 'bg-yellow-100 text-yellow-800' :
                                          'bg-red-100 text-red-800'
                                        }`}
                                      >
                                        {formatStatus(regulation.status)}
                                      </Badge>
                                      <span className="text-[10px] text-earth-text/60">
                                        {regulation.jurisdiction}
                                      </span>
                                    </div>
                                  </div>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="ml-1 text-[10px] flex-shrink-0 px-1.5 py-0.5 h-6"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      onRegulationClick(regulation);
                                    }}
                                  >
                                    View
                                  </Button>
                                </div>
                              </Card>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
      
    </div>
  );
};

export default InteractiveMap;
