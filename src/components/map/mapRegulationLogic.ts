/**
 * Shared logic for map and globe: which locations get pins, which regulations apply,
 * and how to group/display them. Used by InteractiveMap and InteractiveGlobe.
 */
import { Regulation } from '@/types/regulation';
import { countryCoordinates } from '@/data/countryMapping';
import {
  getAncestors as getHierarchyAncestors,
  getRegionForLocation,
  isLocationInRegion,
  locationHierarchy,
  type RegionCode,
} from '@/data/locationHierarchy';

export type LocationLevel = 'region' | 'country' | 'state';

export type RegulationScope = 'global' | 'regional' | 'country' | 'state';

type RegulationTarget =
  | { type: 'location'; name: string }
  | { type: 'region'; region: 'EU' | 'Asia-Pacific' | 'North America' | 'South America' }
  | { type: 'global' };

const mapRegion = (r: RegionCode): RegulationTarget['region'] | null =>
  r === 'EU' || r === 'Asia-Pacific' || r === 'North America' || r === 'South America' ? r : null;

export function getLocationLevel(locationName: string): LocationLevel {
  return locationHierarchy[locationName]?.level ?? 'country';
}

export function getPrimaryLocation(regulation: Regulation): string | null {
  const jurisdiction = regulation.jurisdiction || '';
  const country = regulation.country || '';

  if (locationHierarchy[jurisdiction]?.level === 'state') {
    return countryCoordinates[jurisdiction as keyof typeof countryCoordinates] ? jurisdiction : null;
  }
  if (jurisdiction === 'US') return 'United States';
  if (jurisdiction === 'UK') return 'United Kingdom';
  if (jurisdiction === 'North America' && country === 'Canada') return 'Canada';
  if (jurisdiction === 'EU' && (country === 'European Union' || !country)) return null;
  if (jurisdiction === 'EU' && country && country !== 'European Union') {
    return countryCoordinates[country as keyof typeof countryCoordinates] ? country : null;
  }
  if (jurisdiction === 'Global' || country === 'Global') return null;
  if (['South America', 'Asia-Pacific'].includes(jurisdiction) && country) {
    const region = getRegionForLocation(country);
    if (region && (region === 'South America' || region === 'Asia-Pacific' || region === 'Oceania') && countryCoordinates[country as keyof typeof countryCoordinates]) {
      return country;
    }
  }
  const candidate = jurisdiction || country;
  if (candidate && countryCoordinates[candidate as keyof typeof countryCoordinates]) return candidate;
  return null;
}

const isAsiaPacificJurisdiction = (j: string): boolean =>
  (j || '').trim() === 'Asia-Pacific' || (j || '').trim().replace(/\s+/g, '-') === 'Asia-Pacific';

function getRegulationTarget(regulation: Regulation): RegulationTarget {
  const jurisdiction = (regulation.jurisdiction || '').trim();
  const country = (regulation.country || '').trim();

  if (jurisdiction === 'Global' || country === 'Global') return { type: 'global' };
  if (jurisdiction === 'EU') {
    if (country === 'European Union' || !country) return { type: 'region', region: 'EU' };
    if (country && countryCoordinates[country as keyof typeof countryCoordinates]) return { type: 'location', name: country };
  }
  if (isAsiaPacificJurisdiction(jurisdiction)) {
    if (country && isLocationInRegion(country, 'Asia-Pacific') && countryCoordinates[country as keyof typeof countryCoordinates]) {
      return { type: 'location', name: country };
    }
    if (country && getRegionForLocation(country) === 'Oceania' && countryCoordinates[country as keyof typeof countryCoordinates]) {
      return { type: 'location', name: country };
    }
    return { type: 'region', region: 'Asia-Pacific' };
  }
  if (jurisdiction === 'South America') {
    if (country && countryCoordinates[country as keyof typeof countryCoordinates]) return { type: 'location', name: country };
    return { type: 'region', region: 'South America' };
  }
  if (jurisdiction === 'North America') {
    if (country === 'Canada') return { type: 'location', name: 'Canada' };
    if (country === 'United States') return { type: 'location', name: 'United States' };
    return { type: 'region', region: 'North America' };
  }
  if (locationHierarchy[jurisdiction]?.level === 'state') {
    if (countryCoordinates[jurisdiction as keyof typeof countryCoordinates]) return { type: 'location', name: jurisdiction };
  }
  if (jurisdiction === 'US') return { type: 'location', name: 'United States' };
  if (jurisdiction === 'UK') return { type: 'location', name: 'United Kingdom' };
  const candidate = jurisdiction || country;
  if (candidate && countryCoordinates[candidate as keyof typeof countryCoordinates]) return { type: 'location', name: candidate };
  return { type: 'global' };
}

function getAncestors(locationName: string): string[] {
  const fromHierarchy = getHierarchyAncestors(locationName);
  return fromHierarchy.length > 0 ? fromHierarchy : ['Global'];
}

const locationBelongsToRegion = (locationName: string, region: 'EU' | 'Asia-Pacific' | 'North America' | 'South America'): boolean => {
  const r = mapRegion(getRegionForLocation(locationName) ?? ('' as RegionCode));
  return r === region;
};

export function getApplicableRegulations(locationName: string, allRegulations: Regulation[]): Regulation[] {
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
}

export function getRegulationLevel(regulation: Regulation): RegulationScope {
  const jurisdiction = regulation.jurisdiction || '';
  const country = regulation.country || '';
  if (jurisdiction === 'Global' || country === 'Global') return 'global';
  if (locationHierarchy[jurisdiction]?.level === 'state') return 'state';
  if (jurisdiction === 'EU' && country && country !== 'European Union') return 'country';
  if (isAsiaPacificJurisdiction(jurisdiction) && country) return 'country';
  if (jurisdiction === 'South America' && country) return 'country';
  if (jurisdiction === 'North America' && (country === 'Canada' || country === 'United States')) return 'country';
  if (['EU', 'Asia-Pacific', 'South America', 'North America'].includes(jurisdiction) || country === 'European Union') {
    return 'regional';
  }
  return 'country';
}

export function getRegulationLevelLabel(level: RegulationScope): string {
  switch (level) {
    case 'global': return 'Global';
    case 'regional': return 'Regional';
    case 'country': return 'National';
    case 'state': return 'State/Province';
  }
}

export function groupRegulationsByLevel(regs: Regulation[]): Record<RegulationScope, Regulation[]> {
  const grouped: Record<RegulationScope, Regulation[]> = {
    global: [],
    regional: [],
    country: [],
    state: [],
  };
  regs.forEach(reg => {
    const level = getRegulationLevel(reg);
    grouped[level].push(reg);
  });
  return grouped;
}

export const regulationLevelColors: Record<RegulationScope, { bg: string; text: string; border: string }> = {
  global: { bg: '#E0E7FF', text: '#4338CA', border: '#818CF8' },
  regional: { bg: '#C7D2FE', text: '#3730A3', border: '#6366F1' },
  country: { bg: '#D1FAE5', text: '#065F46', border: '#34D399' },
  state: { bg: '#FEF3C7', text: '#92400E', border: '#FBBF24' },
};

/** Build locations with pins and their applicable regulations (same as map). */
export function getRegulationsByLocation(regulations: Regulation[]): Record<string, Regulation[]> {
  const locations = new Set<string>();
  regulations.forEach(regulation => {
    const primary = getPrimaryLocation(regulation);
    if (primary) locations.add(primary);
  });
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
  const grouped: Record<string, Regulation[]> = {};
  locations.forEach(location => {
    const applicableRegs = getApplicableRegulations(location, regulations);
    if (applicableRegs.length > 0) {
      grouped[location] = applicableRegs;
    }
  });
  return grouped;
}

export { countryCoordinates };
