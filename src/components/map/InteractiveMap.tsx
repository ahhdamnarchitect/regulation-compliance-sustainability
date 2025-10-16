import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Icon } from 'leaflet';
import { useEffect, useState } from 'react';
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
  
  .regulation-panel {
    max-height: 80vh !important;
    overflow-y: auto !important;
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

// Custom marker icon
const createCustomIcon = (color: string) => new Icon({
  iconUrl: `data:image/svg+xml;base64,${btoa(`
    <svg width="25" height="41" viewBox="0 0 25 41" xmlns="http://www.w3.org/2000/svg">
      <path d="M12.5 0C5.6 0 0 5.6 0 12.5c0 12.5 12.5 28.5 12.5 28.5s12.5-16 12.5-28.5C25 5.6 19.4 0 12.5 0z" fill="${color}"/>
      <circle cx="12.5" cy="12.5" r="8" fill="white"/>
    </svg>
  `)}`,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [0, -41],
});

const InteractiveMap: React.FC<InteractiveMapProps> = ({ regulations, onRegulationClick }) => {
  const [regulationsByCountry, setRegulationsByCountry] = useState<Record<string, Regulation[]>>({});
  const [openPopup, setOpenPopup] = useState<string | null>(null);
  const [mapRef, setMapRef] = useState<any>(null);
  const [selectedRegulation, setSelectedRegulation] = useState<Regulation | null>(null);

  // Inject custom CSS to remove gridlines
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = mapStyles;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  // Close popup when map changes
  useEffect(() => {
    if (mapRef) {
      const handleZoom = () => {
        setOpenPopup(null);
        // Force close all popups
        mapRef.closePopup();
      };
      
      mapRef.on('zoom', handleZoom);
      mapRef.on('move', handleZoom);
      
      return () => {
        mapRef.off('zoom', handleZoom);
        mapRef.off('move', handleZoom);
      };
    }
  }, [mapRef]);

  // Close other popups when a new one opens
  useEffect(() => {
    if (mapRef && openPopup) {
      // Close all popups except the current one
      const allPopups = document.querySelectorAll('.leaflet-popup');
      allPopups.forEach(popup => {
        if (!popup.querySelector(`[data-country="${openPopup}"]`)) {
          popup.remove();
        }
      });
    }
  }, [openPopup, mapRef]);

  // Click outside to close fixed panel
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectedRegulation && !(event.target as Element).closest('.regulation-panel')) {
        setSelectedRegulation(null);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [selectedRegulation]);

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return '#10B981'; // green
      case 'proposed': return '#F59E0B'; // yellow
      case 'repealed': return '#EF4444'; // red
      default: return '#6B7280'; // gray
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
          
          const activeRegulations = countryRegulations.filter(r => r.status === 'active');
          const color = activeRegulations.length > 0 ? getStatusColor('active') : '#6B7280';
          
          return (
            <Marker
              key={country}
              position={[coords.lat, coords.lng]}
              icon={createCustomIcon(color)}
              data-country={country}
            >
              <Popup 
                className="map-popup"
                maxWidth={320}
                minWidth={280}
                closeButton={true}
                autoClose={false}
                closeOnClick={false}
                offset={[0, -25]}
                position="top"
                onOpen={() => {
                  // Only set the popup as open, don't interfere with opening
                  setOpenPopup(country);
                }}
                onClose={() => setOpenPopup(null)}
              >
                <div className="p-2 w-full max-w-[280px] sm:max-w-[350px]">
                  <h3 className="font-semibold text-earth-primary mb-2 flex items-center">
                    <MapPin className="w-4 h-4 mr-1" />
                    {coords.name}
                  </h3>
                  <p className="text-sm text-earth-text mb-3">
                    {countryRegulations.length} regulation{countryRegulations.length !== 1 ? 's' : ''}
                  </p>
                  
                  <div className="space-y-2 max-h-[200px] sm:max-h-[300px] overflow-y-auto pr-1">
                    {countryRegulations.map((regulation) => (
                      <Card key={regulation.id} className="p-2 sm:p-3 border border-earth-sand hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-medium text-xs sm:text-sm text-earth-text line-clamp-2 mb-2">
                              {regulation.title}
                            </h4>
                            <div className="flex items-center gap-2 mb-2">
                              <Badge 
                                className={`text-xs ${
                                  regulation.status === 'active' ? 'bg-green-100 text-green-800' :
                                  regulation.status === 'proposed' ? 'bg-yellow-100 text-yellow-800' :
                                  'bg-red-100 text-red-800'
                                }`}
                              >
                                {regulation.status}
                              </Badge>
                              <span className="text-xs text-earth-text">
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
                              onClick={() => setSelectedRegulation(regulation)}
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
      
      {/* Fixed Regulation Panel - like earthday.org */}
      {selectedRegulation && (
        <div className="regulation-panel fixed right-4 top-1/2 transform -translate-y-1/2 w-80 max-w-[90vw] bg-white shadow-xl rounded-lg z-50 border border-earth-sand">
          <div className="p-4">
            <div className="flex items-start justify-between mb-3">
              <h3 className="font-semibold text-earth-primary text-lg">
                {selectedRegulation.title}
              </h3>
              <Button
                size="sm"
                variant="ghost"
                className="text-gray-500 hover:text-gray-700"
                onClick={() => setSelectedRegulation(null)}
              >
                ✕
              </Button>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Badge 
                  className={`text-xs ${
                    selectedRegulation.status === 'active' ? 'bg-green-100 text-green-800' :
                    selectedRegulation.status === 'proposed' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}
                >
                  {selectedRegulation.status}
                </Badge>
                <span className="text-sm text-earth-text/70">
                  {selectedRegulation.framework}
                </span>
              </div>
              
              <div className="text-sm text-earth-text">
                <p className="mb-2">
                  <strong>Jurisdiction:</strong> {selectedRegulation.jurisdiction}
                </p>
                <p className="mb-2">
                  <strong>Country:</strong> {selectedRegulation.country}
                </p>
                <p className="mb-2">
                  <strong>Sector:</strong> {selectedRegulation.sector}
                </p>
                {selectedRegulation.complianceDeadline && (
                  <p className="mb-2">
                    <strong>Deadline:</strong> {new Date(selectedRegulation.complianceDeadline).toLocaleDateString()}
                  </p>
                )}
              </div>
              
              <div className="text-sm text-earth-text">
                <strong>Description:</strong>
                <p className="mt-1 text-earth-text/80">
                  {selectedRegulation.summary || selectedRegulation.description || 'No description available'}
                </p>
              </div>
              
              {selectedRegulation.sourceUrl && (
                <div className="pt-2 border-t border-earth-sand">
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full"
                    onClick={() => window.open(selectedRegulation.sourceUrl, '_blank')}
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    View Source
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InteractiveMap;
