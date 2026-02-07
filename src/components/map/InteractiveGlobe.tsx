import { useMemo, useState, useCallback, useRef, useEffect } from 'react';
import Globe from 'react-globe.gl';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, X } from 'lucide-react';
import { Regulation } from '@/types/regulation';
import { formatStatus } from '@/lib/utils';
import {
  countryCoordinates,
  getRegulationsByLocation,
  groupRegulationsByLevel,
  getRegulationLevelLabel,
  regulationLevelColors,
  type RegulationScope,
} from './mapRegulationLogic';

const EARTH_GREEN = '#1B4332';
const GLOBE_BG = '#F7F8F3';

export interface InteractiveGlobeProps {
  regulations: Regulation[];
  onRegulationClick: (regulation: Regulation) => void;
}

interface PointData {
  lat: number;
  lng: number;
  name: string;
  regulations: Regulation[];
}

export default function InteractiveGlobe({ regulations, onRegulationClick }: InteractiveGlobeProps) {
  const [selectedPoint, setSelectedPoint] = useState<PointData | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const update = () => {
      const { clientWidth, clientHeight } = el;
      setSize({ width: clientWidth, height: clientHeight });
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const regulationsByLocation = useMemo(
    () => getRegulationsByLocation(regulations),
    [regulations]
  );

  const pointsData = useMemo<PointData[]>(() => {
    const points: PointData[] = [];
    for (const [location, locationRegulations] of Object.entries(regulationsByLocation)) {
      const coords = countryCoordinates[location as keyof typeof countryCoordinates];
      if (coords && typeof coords.lat === 'number' && typeof coords.lng === 'number') {
        points.push({
          lat: coords.lat,
          lng: coords.lng,
          name: coords.name ?? location,
          regulations: locationRegulations,
        });
      }
    }
    return points;
  }, [regulationsByLocation]);

  const onPointClick = useCallback((point: PointData) => {
    setSelectedPoint(point);
  }, []);

  return (
    <div
      ref={containerRef}
      className="w-full h-[400px] sm:h-[500px] md:h-[500px] lg:h-[600px] rounded-lg overflow-hidden shadow-lg border border-earth-sand relative bg-earth-background max-w-6xl mx-auto"
    >
      {size.width > 0 && size.height > 0 && (
      <Globe
        width={size.width}
        height={size.height}
        globeImageUrl="https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
        bumpImageUrl="https://unpkg.com/three-globe/example/img/earth-topology.png"
        backgroundColor={GLOBE_BG}
        showAtmosphere
        atmosphereColor="lightskyblue"
        atmosphereAltitude={0.15}
        pointsData={pointsData}
        pointLat="lat"
        pointLng="lng"
        pointColor={() => EARTH_GREEN}
        pointAltitude={0.01}
        pointRadius={0.4}
        pointLabel={(d: unknown) => {
          const p = d as PointData;
          return `${p.name}: ${p.regulations.length} regulation${p.regulations.length !== 1 ? 's' : ''}`;
        }}
        pointsMerge={false}
        onPointClick={(point: unknown) => onPointClick(point as PointData)}
      />
      )}
      {selectedPoint && (
        <div
          className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 w-[280px] sm:w-[320px] max-h-[70vh] overflow-hidden rounded-lg shadow-lg border border-earth-sand bg-white"
          role="dialog"
          aria-label="Location regulations"
        >
          <div className="flex items-center justify-between p-2 border-b border-earth-sand/50">
            <h3 className="font-semibold text-earth-primary flex items-center text-sm">
              <MapPin className="w-4 h-4 mr-1 shrink-0" />
              {selectedPoint.name}
            </h3>
            <button
              type="button"
              onClick={() => setSelectedPoint(null)}
              className="p-1 rounded hover:bg-earth-sand/50 text-earth-text"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <p className="text-sm text-earth-text px-3 pb-2">
            {selectedPoint.regulations.length} applicable regulation
            {selectedPoint.regulations.length !== 1 ? 's' : ''}
          </p>
          <div className="space-y-3 max-h-[200px] sm:max-h-[300px] overflow-y-auto px-3 pb-3 pr-2 scrollbar-thin">
            {(['state', 'country', 'regional', 'global'] as RegulationScope[]).map((level) => {
              const grouped = groupRegulationsByLevel(selectedPoint.regulations);
              const regsForLevel = grouped[level];
              if (!regsForLevel.length) return null;
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
                                  regulation.status === 'active'
                                    ? 'bg-green-100 text-green-800'
                                    : regulation.status === 'proposed'
                                      ? 'bg-yellow-100 text-yellow-800'
                                      : 'bg-red-100 text-red-800'
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
                            onClick={() => {
                              onRegulationClick(regulation);
                              setSelectedPoint(null);
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
      )}
    </div>
  );
}
