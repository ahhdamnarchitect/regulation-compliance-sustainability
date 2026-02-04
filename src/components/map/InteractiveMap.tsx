import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Icon } from 'leaflet';
import { useEffect, useState, useRef, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExternalLink, Calendar, MapPin } from 'lucide-react';
import { Regulation } from '@/types/regulation';
import { countryCoordinates, getCountriesForRegulation } from '@/data/countryMapping';
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
}

// Country coordinates are now imported from countryMapping.ts

// Jurisdiction level types
type JurisdictionLevel = 'region' | 'country' | 'state';

// Determine jurisdiction level based on the regulations at a location
const getJurisdictionLevel = (regulations: Regulation[]): JurisdictionLevel => {
  // Check if any regulation is region-wide (EU, Global, Asia-Pacific, etc.)
  const hasRegionWide = regulations.some(r => 
    ['EU', 'Global', 'Asia-Pacific', 'South America', 'North America'].includes(r.jurisdiction || '') ||
    r.country === 'European Union' || r.country === 'Global'
  );
  if (hasRegionWide) return 'region';
  
  // Check if any regulation is state/province level
  const stateProvinces = ['California', 'Texas', 'Ontario', 'Bavaria', 'Quebec', 'British Columbia', 'Alberta'];
  const hasStateLevel = regulations.some(r => 
    stateProvinces.includes(r.jurisdiction || '')
  );
  if (hasStateLevel) return 'state';
  
  // Default to country level
  return 'country';
};

// Colors for different jurisdiction levels
const jurisdictionColors = {
  region: '#6366F1',   // Indigo/purple for region-wide
  country: '#10B981',  // Green for country-wide
  state: '#F59E0B',    // Amber/orange for state/province
};

// Custom marker icon with different shapes for jurisdiction levels
const createCustomIcon = (level: JurisdictionLevel) => {
  const color = jurisdictionColors[level];
  
  // Different shapes for different levels
  if (level === 'region') {
    // Diamond shape for region-wide
    return new Icon({
      iconUrl: `data:image/svg+xml;base64,${btoa(`
        <svg width="30" height="42" viewBox="0 0 30 42" xmlns="http://www.w3.org/2000/svg">
          <path d="M15 0L30 15L15 42L0 15Z" fill="${color}" stroke="#fff" stroke-width="2"/>
          <circle cx="15" cy="15" r="6" fill="white"/>
        </svg>
      `)}`,
      iconSize: [30, 42],
      iconAnchor: [15, 42],
      popupAnchor: [0, -42],
    });
  } else if (level === 'state') {
    // Square/rounded for state/province
    return new Icon({
      iconUrl: `data:image/svg+xml;base64,${btoa(`
        <svg width="28" height="38" viewBox="0 0 28 38" xmlns="http://www.w3.org/2000/svg">
          <path d="M4 0h20c2.2 0 4 1.8 4 4v20c0 2.2-1.8 4-4 4h-6l-4 10-4-10H4c-2.2 0-4-1.8-4-4V4c0-2.2 1.8-4 4-4z" fill="${color}" stroke="#fff" stroke-width="1.5"/>
          <circle cx="14" cy="12" r="6" fill="white"/>
        </svg>
      `)}`,
      iconSize: [28, 38],
      iconAnchor: [14, 38],
      popupAnchor: [0, -38],
    });
  } else {
    // Standard pin for country
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
  }
};

const InteractiveMap: React.FC<InteractiveMapProps> = ({ regulations, onRegulationClick }) => {
  const [regulationsByCountry, setRegulationsByCountry] = useState<Record<string, Regulation[]>>({});
  const [mapRef, setMapRef] = useState<any>(null);
  const popupOpenTimeRef = useRef<number>(0);

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
      // Open popup after zoom animation completes
      setTimeout(() => {
        popupOpenTimeRef.current = Date.now();
        const marker = markerRefs.current[country];
        if (marker) {
          marker.openPopup();
        }
      }, 400);
    } else {
      // Just center and open popup
      mapRef.setView([coords.lat, coords.lng], currentZoom, { animate: true });
      setTimeout(() => {
        popupOpenTimeRef.current = Date.now();
        const marker = markerRefs.current[country];
        if (marker) {
          marker.openPopup();
        }
      }, 150);
    }
  }, [mapRef]);


  useEffect(() => {
    // Group regulations by country using the new mapping system
    const grouped: Record<string, Regulation[]> = {};
    
    regulations.forEach(regulation => {
      const countries = getCountriesForRegulation(regulation.jurisdiction, regulation.country);
      
      countries.forEach(country => {
        if (!grouped[country]) {
          grouped[country] = [];
        }
        grouped[country].push(regulation);
      });
    });
    
    setRegulationsByCountry(grouped);
  }, [regulations]);

  const getCountryCoordinates = (country: string) => {
    return countryCoordinates[country as keyof typeof countryCoordinates] || null;
  };

  // Get jurisdiction level label for display
  const getJurisdictionLabel = (level: JurisdictionLevel): string => {
    switch (level) {
      case 'region': return 'Region-wide';
      case 'country': return 'National';
      case 'state': return 'State/Province';
    }
  };

  const getTileLayerUrl = (language: string) => {
    // Use CartoDB Voyager tiles with Earth-friendly colors and no gridlines
    // This provides a clean, professional look that complements the Earth theme
    return 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';
  };

  const getTileLayerAttribution = (language: string) => {
    return '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>';
  };

  return (
    <div className="w-full h-[400px] sm:h-[500px] md:h-[500px] lg:h-[600px] rounded-lg overflow-hidden shadow-lg border border-earth-sand relative bg-earth-background max-w-6xl mx-auto">
      
      {/* Map Legend */}
      <div className="absolute bottom-4 left-4 z-[1000] bg-white/95 backdrop-blur-sm rounded-lg shadow-md p-3 text-xs">
        <div className="font-semibold text-earth-text mb-2">Legend</div>
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rotate-45" style={{ backgroundColor: jurisdictionColors.region }}></div>
            <span className="text-earth-text/80">Region-wide (EU, Global)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: jurisdictionColors.country }}></div>
            <span className="text-earth-text/80">National</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: jurisdictionColors.state }}></div>
            <span className="text-earth-text/80">State/Province</span>
          </div>
        </div>
      </div>
      
      <MapContainer
        center={[20, 0]}
        zoom={2}
        style={{ 
          height: '100%', 
          width: '100%',
          backgroundColor: '#F7F8F3' // Earth background color
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
        
        {Object.entries(regulationsByCountry).map(([country, countryRegulations]) => {
          const coords = getCountryCoordinates(country);
          if (!coords) return null;
          
          const jurisdictionLevel = getJurisdictionLevel(countryRegulations);
          
          return (
            <Marker
              key={country}
              position={[coords.lat, coords.lng]}
              icon={createCustomIcon(jurisdictionLevel)}
              ref={(ref) => {
                if (ref) {
                  markerRefs.current[country] = ref;
                }
              }}
              eventHandlers={{
                click: (e) => {
                  e.originalEvent.stopPropagation();
                  handleMarkerClick(country, coords);
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
                  <div className="flex items-center gap-2 mb-2">
                    <Badge 
                      className="text-xs"
                      style={{ 
                        backgroundColor: `${jurisdictionColors[jurisdictionLevel]}20`,
                        color: jurisdictionColors[jurisdictionLevel],
                        border: `1px solid ${jurisdictionColors[jurisdictionLevel]}`
                      }}
                    >
                      {getJurisdictionLabel(jurisdictionLevel)}
                    </Badge>
                    <span className="text-sm text-earth-text">
                      {countryRegulations.length} regulation{countryRegulations.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                  
                  <div className="space-y-2 max-h-[150px] sm:max-h-[250px] overflow-y-auto pr-1 scrollbar-thin">
                    {countryRegulations.map((regulation) => (
                      <Card key={regulation.id} className="p-2 sm:p-3 border border-earth-sand hover:shadow-md transition-shadow cursor-pointer">
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-xs sm:text-sm text-earth-text line-clamp-2 mb-2">
                              {regulation.title}
                            </h4>
                            <div className="flex items-center gap-2 mb-2 flex-wrap">
                              <Badge 
                                className={`text-xs ${
                                  regulation.status === 'active' ? 'bg-green-100 text-green-800' :
                                  regulation.status === 'proposed' ? 'bg-yellow-100 text-yellow-800' :
                                  'bg-red-100 text-red-800'
                                }`}
                              >
                                {regulation.status}
                              </Badge>
                              <span className="text-xs text-earth-text truncate max-w-[100px]">
                                {regulation.framework}
                              </span>
                            </div>
                            <p className="text-xs text-earth-text/70 line-clamp-2">
                              {regulation.summary || regulation.description || 'No description available'}
                            </p>
                          </div>
                          <Button
                            size="sm"
                            variant="outline"
                            className="ml-1 sm:ml-2 text-xs flex-shrink-0 px-2 py-1"
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
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
      
    </div>
  );
};

export default InteractiveMap;
