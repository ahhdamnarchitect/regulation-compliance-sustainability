import type { Regulation } from '@/types/regulation';
import { countryCoordinates } from '@/data/countryMapping';
import {
  getAncestors,
  getRegionForLocation,
  isLocationInRegion,
  locationHierarchy,
  type RegionCode,
} from '@/data/locationHierarchy';

type RegulationTarget =
  | { type: 'global' }
  | { type: 'region'; region: 'EU' | 'Asia-Pacific' | 'North America' | 'South America' }
  | { type: 'location'; name: string };

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

const mapRegion = (r: RegionCode | undefined): RegulationTarget['region'] | null =>
  r === 'EU' || r === 'Asia-Pacific' || r === 'North America' || r === 'South America' ? r : null;

/** Returns true if the regulation applies to the given location filter value (e.g. "Global", "North America", "France", "California"). */
export function regulationAppliesToLocationFilter(regulation: Regulation, filterValue: string): boolean {
  if (!filterValue || filterValue === 'all') return true;

  const target = getRegulationTarget(regulation);
  const filterRegion = getRegionForLocation(filterValue);
  const filterAsRegion = mapRegion(filterRegion);

  // Filter is Global: only global regulations
  if (filterValue === 'Global') {
    return target.type === 'global';
  }

  // Filter is a region name (e.g. North America, EU, Asia-Pacific)
  if (filterAsRegion && filterValue === filterAsRegion) {
    if (target.type === 'global') return true;
    if (target.type === 'region') return target.region === filterAsRegion;
    if (target.type === 'location') return isLocationInRegion(target.name, filterRegion!);
    return false;
  }

  // Filter is Europe (region name; not a location in hierarchy)
  if (filterValue === 'Europe') {
    if (target.type === 'global') return true;
    if (target.type === 'region') return target.region === 'EU';
    if (target.type === 'location') return getRegionForLocation(target.name) === 'Europe' || getRegionForLocation(target.name) === 'EU';
    return false;
  }
  // Other region names from sidebar (Africa, Asia, etc.) when not found as location
  if (['Africa', 'Asia', 'Middle East', 'Oceania'].includes(filterValue)) {
    if (target.type === 'global') return true;
    if (target.type === 'location') return getRegionForLocation(target.name) === filterValue;
    return false;
  }

  // Filter is a specific location (country or state): show reg if it applies to that location
  if (target.type === 'global') return true;
  if (target.type === 'region') {
    return isLocationInRegion(filterValue, target.region);
  }
  if (target.type === 'location') {
    if (target.name === filterValue) return true;
    // Regulation applies to filter location if filter's ancestors include the target (e.g. US federal applies to California)
    const ancestorsOfFilter = getAncestors(filterValue);
    return ancestorsOfFilter.includes(target.name);
  }
  return false;
}
