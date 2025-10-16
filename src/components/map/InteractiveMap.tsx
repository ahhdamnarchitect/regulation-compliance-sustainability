import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Icon } from 'leaflet';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExternalLink, Calendar, MapPin } from 'lucide-react';
import { Regulation } from '@/types/regulation';
import 'leaflet/dist/leaflet.css';

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

// Country coordinates for major regions
const countryCoordinates = {
  'EU': { lat: 54.5260, lng: 15.2551, name: 'European Union' },
  'US': { lat: 39.8283, lng: -98.5795, name: 'United States' },
  'CA': { lat: 56.1304, lng: -106.3468, name: 'Canada' },
  'UK': { lat: 55.3781, lng: -3.4360, name: 'United Kingdom' },
  'AU': { lat: -25.2744, lng: 133.7751, name: 'Australia' },
  'JP': { lat: 36.2048, lng: 138.2529, name: 'Japan' },
  'CN': { lat: 35.8617, lng: 104.1954, name: 'China' },
  'IN': { lat: 20.5937, lng: 78.9629, name: 'India' },
  'BR': { lat: -14.2350, lng: -51.9253, name: 'Brazil' },
  'MX': { lat: 23.6345, lng: -102.5528, name: 'Mexico' },
  'ZA': { lat: -30.5595, lng: 22.9375, name: 'South Africa' },
  'SG': { lat: 1.3521, lng: 103.8198, name: 'Singapore' },
};

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

  useEffect(() => {
    // Group regulations by country/jurisdiction
    const grouped: Record<string, Regulation[]> = {};
    
    regulations.forEach(regulation => {
      const key = regulation.jurisdiction || regulation.country || 'Unknown';
      if (!grouped[key]) {
        grouped[key] = [];
      }
      grouped[key].push(regulation);
    });
    
    setRegulationsByCountry(grouped);
  }, [regulations]);

  const getCountryCoordinates = (jurisdiction: string) => {
    // Map jurisdiction to country coordinates
    const mapping: Record<string, string> = {
      'EU': 'EU',
      'European Union': 'EU',
      'US': 'US',
      'United States': 'US',
      'Canada': 'CA',
      'UK': 'UK',
      'United Kingdom': 'UK',
      'Australia': 'AU',
      'Japan': 'JP',
      'China': 'CN',
      'India': 'IN',
      'Brazil': 'BR',
      'Mexico': 'MX',
      'South Africa': 'ZA',
      'Singapore': 'SG',
    };
    
    const countryKey = mapping[jurisdiction] || jurisdiction;
    return countryCoordinates[countryKey as keyof typeof countryCoordinates] || null;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return '#10B981'; // green
      case 'proposed': return '#F59E0B'; // yellow
      case 'repealed': return '#EF4444'; // red
      default: return '#6B7280'; // gray
    }
  };

  return (
    <div className="w-full h-[600px] rounded-lg overflow-hidden shadow-lg border border-earth-sand">
      <MapContainer
        center={[20, 0]}
        zoom={2}
        style={{ height: '100%', width: '100%' }}
        className="z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
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
            >
              <Popup className="map-popup">
                <div className="p-2 min-w-[300px]">
                  <h3 className="font-semibold text-earth-primary mb-2 flex items-center">
                    <MapPin className="w-4 h-4 mr-1" />
                    {coords.name}
                  </h3>
                  <p className="text-sm text-earth-text mb-3">
                    {countryRegulations.length} regulation{countryRegulations.length !== 1 ? 's' : ''}
                  </p>
                  
                  <div className="space-y-2 max-h-[200px] overflow-y-auto">
                    {countryRegulations.slice(0, 5).map((regulation) => (
                      <Card key={regulation.id} className="p-2 border border-earth-sand">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-medium text-sm text-earth-text line-clamp-2">
                              {regulation.title}
                            </h4>
                            <div className="flex items-center gap-2 mt-1">
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
                          </div>
                          <Button
                            size="sm"
                            variant="outline"
                            className="ml-2 text-xs"
                            onClick={() => onRegulationClick(regulation)}
                          >
                            View
                          </Button>
                        </div>
                      </Card>
                    ))}
                    
                    {countryRegulations.length > 5 && (
                      <p className="text-xs text-earth-text text-center">
                        +{countryRegulations.length - 5} more regulations
                      </p>
                    )}
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
