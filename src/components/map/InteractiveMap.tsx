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

// Location level types (based on the pin location, not regulation jurisdiction)
type LocationLevel = 'region' | 'country' | 'state';

// Earth theme colors for pins
const earthThemeColors = {
  primary: '#1B4332',    // Deep forest green
  accent: '#A8C686',     // Soft sage
  sand: '#DAD7CD',       // Muted sand
};

// Define location hierarchies
const usStates = ['California', 'Texas', 'New York', 'Florida', 'Illinois', 'Pennsylvania', 'Ohio', 'Georgia', 'North Carolina', 'Michigan'];
const canadianProvinces = ['Ontario', 'Quebec', 'British Columbia', 'Alberta', 'Manitoba', 'Saskatchewan'];
const germanStates = ['Bavaria', 'Baden-Württemberg', 'North Rhine-Westphalia', 'Berlin', 'Hamburg'];
const euCountries = ['Germany', 'France', 'Italy', 'Spain', 'Netherlands', 'Belgium', 'Austria', 'Sweden', 'Denmark', 'Finland', 'Poland', 'Czech Republic', 'Hungary', 'Romania', 'Bulgaria', 'Croatia', 'Slovenia', 'Slovakia', 'Estonia', 'Latvia', 'Lithuania', 'Ireland', 'Portugal', 'Greece', 'Cyprus', 'Malta', 'Luxembourg'];

// Determine the location level for a given location name
const getLocationLevel = (locationName: string): LocationLevel => {
  if (usStates.includes(locationName) || canadianProvinces.includes(locationName) || germanStates.includes(locationName)) {
    return 'state';
  }
  // Region-level locations don't have their own pins - they apply to countries
  return 'country';
};

// Get all regulations that apply to a specific location (hierarchical)
const getApplicableRegulations = (locationName: string, allRegulations: Regulation[]): Regulation[] => {
  const applicable: Regulation[] = [];
  const addedIds = new Set<string>();
  
  allRegulations.forEach(regulation => {
    const jurisdiction = regulation.jurisdiction || '';
    const country = regulation.country || '';
    
    // Check if this regulation applies to the location
    let applies = false;
    
    // 1. Direct match - regulation is specifically for this location
    if (jurisdiction === locationName || country === locationName) {
      applies = true;
    }
    
    // 2. US States inherit US federal and Global regulations
    if (usStates.includes(locationName)) {
      if (jurisdiction === 'US' || country === 'United States') {
        applies = true;
      }
      if (jurisdiction === 'Global' || country === 'Global') {
        applies = true;
      }
    }
    
    // 3. Canadian Provinces inherit Canadian and Global regulations
    if (canadianProvinces.includes(locationName)) {
      if (jurisdiction === 'North America' || country === 'Canada') {
        applies = true;
      }
      if (jurisdiction === 'Global' || country === 'Global') {
        applies = true;
      }
    }
    
    // 4. German States inherit German, EU, and Global regulations
    if (germanStates.includes(locationName)) {
      if (jurisdiction === 'Germany' || country === 'Germany') {
        applies = true;
      }
      if (jurisdiction === 'EU' || country === 'European Union') {
        applies = true;
      }
      if (jurisdiction === 'Global' || country === 'Global') {
        applies = true;
      }
    }
    
    // 5. EU Countries inherit EU-wide and Global regulations
    if (euCountries.includes(locationName)) {
      if (jurisdiction === 'EU' || country === 'European Union') {
        applies = true;
      }
      if (jurisdiction === 'Global' || country === 'Global') {
        applies = true;
      }
    }
    
    // 6. Major countries (US, UK, Canada, etc.) inherit Global regulations
    if (['United States', 'United Kingdom', 'Canada', 'Australia', 'Japan', 'China', 'India', 'Brazil', 'Singapore'].includes(locationName)) {
      if (jurisdiction === 'Global' || country === 'Global') {
        applies = true;
      }
    }
    
    // 7. Asia-Pacific countries inherit Asia-Pacific regional regulations
    if (['Australia', 'Japan', 'Singapore', 'India', 'China', 'South Korea', 'Hong Kong', 'Taiwan'].includes(locationName)) {
      if (jurisdiction === 'Asia-Pacific') {
        applies = true;
      }
    }
    
    if (applies && !addedIds.has(regulation.id)) {
      applicable.push(regulation);
      addedIds.add(regulation.id);
    }
  });
  
  return applicable;
};

// Get the jurisdiction level of a specific regulation
const getRegulationLevel = (regulation: Regulation): LocationLevel => {
  const jurisdiction = regulation.jurisdiction || '';
  
  // Region-wide regulations
  if (['EU', 'Global', 'Asia-Pacific', 'South America', 'North America'].includes(jurisdiction) ||
      regulation.country === 'European Union' || regulation.country === 'Global') {
    return 'region';
  }
  
  // State/Province level
  if (usStates.includes(jurisdiction) || canadianProvinces.includes(jurisdiction) || germanStates.includes(jurisdiction)) {
    return 'state';
  }
  
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

// Colors for regulation level badges in popups
const regulationLevelColors = {
  region: { bg: '#E0E7FF', text: '#4338CA', border: '#818CF8' },    // Indigo for global/regional
  country: { bg: '#D1FAE5', text: '#065F46', border: '#34D399' },   // Green for national
  state: { bg: '#FEF3C7', text: '#92400E', border: '#FBBF24' },     // Amber for state
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
    // Get all unique locations that should have pins
    const locations = new Set<string>();
    
    regulations.forEach(regulation => {
      const countries = getCountriesForRegulation(regulation.jurisdiction, regulation.country);
      countries.forEach(country => locations.add(country));
    });
    
    // For each location, get ALL applicable regulations (hierarchical)
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

  // Get regulation level label for display
  const getRegulationLevelLabel = (level: LocationLevel): string => {
    switch (level) {
      case 'region': return 'Global/Regional';
      case 'country': return 'National';
      case 'state': return 'State/Province';
    }
  };

  // Group regulations by their level for display
  const groupRegulationsByLevel = (regs: Regulation[]): Record<LocationLevel, Regulation[]> => {
    const grouped: Record<LocationLevel, Regulation[]> = {
      region: [],
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

  return (
    <div className="w-full h-[400px] sm:h-[500px] md:h-[500px] lg:h-[600px] rounded-lg overflow-hidden shadow-lg border border-earth-sand relative bg-earth-background max-w-6xl mx-auto">
      
      {/* Map Legend */}
      <div className="absolute bottom-4 left-4 z-[1000] bg-white/95 backdrop-blur-sm rounded-lg shadow-md p-3 text-xs">
        <div className="font-semibold text-earth-text mb-2">Regulation Scope</div>
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: regulationLevelColors.region.border }}></div>
            <span className="text-earth-text/80">Global/Regional</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: regulationLevelColors.country.border }}></div>
            <span className="text-earth-text/80">National</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: regulationLevelColors.state.border }}></div>
            <span className="text-earth-text/80">State/Province</span>
          </div>
        </div>
        <div className="mt-2 pt-2 border-t border-earth-sand/50 text-earth-text/60">
          Click a pin to see all<br/>applicable regulations
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
                    {/* Show regulations grouped by level */}
                    {(['state', 'country', 'region'] as LocationLevel[]).map(level => {
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
                                        {regulation.status}
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
