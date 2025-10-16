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
                <div className="p-2 min-w-[350px] max-w-[400px]">
                  <h3 className="font-semibold text-earth-primary mb-2 flex items-center">
                    <MapPin className="w-4 h-4 mr-1" />
                    {coords.name}
                  </h3>
                  <p className="text-sm text-earth-text mb-3">
                    {countryRegulations.length} regulation{countryRegulations.length !== 1 ? 's' : ''}
                  </p>
                  
                  <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
                    {countryRegulations.map((regulation) => (
                      <Card key={regulation.id} className="p-3 border border-earth-sand hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-medium text-sm text-earth-text line-clamp-2 mb-2">
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
                            className="ml-2 text-xs flex-shrink-0"
                            onClick={() => onRegulationClick(regulation)}
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
