import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { ChevronDown, ChevronUp, X } from 'lucide-react';
import {
  locationHierarchy,
  getLocationsInRegion,
  REGION_LEVEL_NAMES,
  type RegionCode,
} from '@/data/locationHierarchy';
import { SearchFilters } from '@/types/regulation';

const DEFAULT_VISIBLE = 5;

const REGION_OPTIONS = [...REGION_LEVEL_NAMES];

const SECTORS = ['Finance', 'Energy', 'Consumer Goods', 'Technology', 'Healthcare'].sort((a, b) => a.localeCompare(b));
const FRAMEWORKS = ['CSRD', 'TCFD', 'ISSB', 'GRI', 'SEC', 'SASB'].sort((a, b) => a.localeCompare(b));
const STATUSES = ['active', 'proposed', 'repealed'].sort((a, b) => a.localeCompare(b));

const REGION_CODES = new Set<string>(['North America', 'South America', 'EU', 'Europe', 'Asia-Pacific', 'Asia', 'Africa', 'Middle East', 'Oceania']);

function getCountriesAlphabetical(): string[] {
  const names = new Set<string>();
  for (const [name, meta] of Object.entries(locationHierarchy)) {
    if (meta.level === 'country') names.add(name);
  }
  return Array.from(names).sort((a, b) => a.localeCompare(b));
}

function getStatesAlphabetical(): string[] {
  const names: string[] = [];
  for (const [name, meta] of Object.entries(locationHierarchy)) {
    if (meta.level === 'state') names.push(name);
  }
  return names.sort((a, b) => a.localeCompare(b));
}

/** Countries that belong to any of the selected region names (cascading). */
function getCountriesForSelectedRegions(selectedRegions: string[]): string[] {
  if (selectedRegions.length === 0) return getCountriesAlphabetical();
  const set = new Set<string>();
  for (const r of selectedRegions) {
    if (r === 'Global') continue;
    if (REGION_CODES.has(r)) {
      const locations = getLocationsInRegion(r as RegionCode);
      locations.forEach((name) => {
        if (locationHierarchy[name]?.level === 'country') set.add(name);
      });
    }
  }
  if (set.size === 0) return getCountriesAlphabetical();
  return Array.from(set).sort((a, b) => a.localeCompare(b));
}

/** States that belong to selected regions and/or selected countries (cascading). */
function getStatesForSelectedRegionsAndCountries(selectedRegions: string[], selectedCountries: string[]): string[] {
  if (selectedCountries.length > 0) {
    const set = new Set<string>();
    for (const [name, meta] of Object.entries(locationHierarchy)) {
      if (meta.level === 'state' && meta.parentCountry && selectedCountries.includes(meta.parentCountry)) set.add(name);
    }
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }
  if (selectedRegions.length > 0) {
    const set = new Set<string>();
    for (const r of selectedRegions) {
      if (r === 'Global') continue;
      if (REGION_CODES.has(r)) {
        const locations = getLocationsInRegion(r as RegionCode);
        locations.forEach((name) => {
          if (locationHierarchy[name]?.level === 'state') set.add(name);
        });
      }
    }
    if (set.size === 0) return getStatesAlphabetical();
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }
  return getStatesAlphabetical();
}

export type LocationClearScope = 'region' | 'country' | 'state';

type FilterKey = 'region' | 'sector' | 'framework' | 'status';

interface FilterSectionProps {
  title: string;
  options: string[];
  filterKey: FilterKey;
  selectedValues: string[];
  onToggle: (key: FilterKey, value: string, checked: boolean, clearScope?: LocationClearScope) => void;
  defaultVisible?: number;
  useDisplayValue?: boolean;
  clearScope?: LocationClearScope;
  /** When set, use this for "All" checkbox state (e.g. true when no selections in this section only). */
  isAllSelectedOverride?: boolean;
}

function FilterSection({
  title,
  options,
  filterKey,
  selectedValues,
  onToggle,
  defaultVisible = DEFAULT_VISIBLE,
  useDisplayValue = false,
  clearScope,
  isAllSelectedOverride,
}: FilterSectionProps) {
  const [expanded, setExpanded] = useState(false);
  const showCount = expanded ? options.length : Math.min(defaultVisible, options.length);
  const hasMore = options.length > defaultVisible;
  const visibleOptions = options.slice(0, showCount);

  if (options.length === 0) return null;

  const toFilterValue = (opt: string) =>
    useDisplayValue ? opt : opt.toLowerCase().replace(/\s+/g, '-');

  const isAllSelected = isAllSelectedOverride !== undefined ? isAllSelectedOverride : selectedValues.length === 0;

  return (
    <div className="border-b border-earth-sand/50 pb-4 mb-4 last:border-0 last:mb-0">
      <div className="font-semibold text-earth-text mb-2 text-sm">{title}</div>
      <ul className="space-y-1 text-sm">
        <li>
          <label className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-earth-sand/50 cursor-pointer">
            <Checkbox
              checked={isAllSelected}
              onCheckedChange={(checked) => {
                if (checked) onToggle(filterKey, '__clear__', false, clearScope);
              }}
              className="border-earth-text/50 data-[state=checked]:bg-earth-primary data-[state=checked]:border-earth-primary"
            />
            <span className={isAllSelected ? 'text-earth-primary font-medium' : 'text-earth-text/90'}>All</span>
          </label>
        </li>
        {visibleOptions.map((opt) => {
          const value = toFilterValue(opt);
          const isSelected = selectedValues.includes(value) || selectedValues.includes(opt);
          return (
            <li key={opt}>
              <label className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-earth-sand/50 cursor-pointer">
                <Checkbox
                  checked={!!isSelected}
                  onCheckedChange={(checked) => onToggle(filterKey, value, !!checked)}
                  className="border-earth-text/50 data-[state=checked]:bg-earth-primary data-[state=checked]:border-earth-primary"
                />
                <span className={isSelected ? 'text-earth-primary font-medium' : 'text-earth-text/90'}>{opt}</span>
              </label>
            </li>
          );
        })}
        {hasMore && (
          <li>
            <button
              type="button"
              onClick={() => setExpanded(!expanded)}
              className="flex items-center gap-1 text-earth-primary hover:underline text-sm px-2 py-1"
            >
              {expanded ? (
                <>
                  <ChevronUp className="w-3.5 h-3.5" />
                  See less
                </>
              ) : (
                <>
                  <ChevronDown className="w-3.5 h-3.5" />
                  See more
                </>
              )}
            </button>
          </li>
        )}
      </ul>
    </div>
  );
}

interface FilterSidebarProps {
  filters: SearchFilters;
  onFilterToggle: (key: FilterKey, value: string, checked: boolean, clearScope?: LocationClearScope) => void;
  onClearFilters: () => void;
  hasActiveFilters: boolean;
}

export function FilterSidebar({ filters, onFilterToggle, onClearFilters, hasActiveFilters }: FilterSidebarProps) {
  const regionValues = filters.region ?? [];
  const sectorValues = filters.sector ?? [];
  const frameworkValues = filters.framework ?? [];
  const statusValues = filters.status ?? [];

  const selectedRegions = useMemo(
    () => regionValues.filter((v) => REGION_LEVEL_NAMES.includes(v)),
    [regionValues]
  );
  const selectedCountries = useMemo(
    () => regionValues.filter((v) => locationHierarchy[v]?.level === 'country'),
    [regionValues]
  );
  const selectedStates = useMemo(
    () => regionValues.filter((v) => locationHierarchy[v]?.level === 'state'),
    [regionValues]
  );

  const countryOptions = useMemo(
    () => getCountriesForSelectedRegions(selectedRegions),
    [selectedRegions]
  );
  const stateOptions = useMemo(
    () => getStatesForSelectedRegionsAndCountries(selectedRegions, selectedCountries),
    [selectedRegions, selectedCountries]
  );

  const handleToggle = (key: FilterKey, value: string, checked: boolean, clearScope?: LocationClearScope) => {
    if (value === '__clear__') {
      onFilterToggle(key, '', false, clearScope);
      return;
    }
    onFilterToggle(key, value, checked);
  };

  return (
    <aside className="w-full lg:w-64 shrink-0 bg-white border border-earth-sand rounded-lg p-4 shadow-sm h-fit">
      <div className="flex items-center justify-between mb-4">
        <span className="font-bold text-earth-text">Filters</span>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            className="text-red-600 hover:text-red-700 hover:bg-red-50 h-8 px-2"
          >
            <X className="w-3.5 h-3.5 mr-1" />
            Clear
          </Button>
        )}
      </div>

      <FilterSection
        title="Region"
        options={REGION_OPTIONS}
        filterKey="region"
        selectedValues={regionValues}
        onToggle={handleToggle}
        defaultVisible={6}
        useDisplayValue
        clearScope="region"
        isAllSelectedOverride={selectedRegions.length === 0}
      />
      <FilterSection
        title="Country / Jurisdiction"
        options={countryOptions}
        filterKey="region"
        selectedValues={regionValues}
        onToggle={handleToggle}
        useDisplayValue
        clearScope="country"
        isAllSelectedOverride={selectedCountries.length === 0}
      />
      <FilterSection
        title="State / Province"
        options={stateOptions}
        filterKey="region"
        selectedValues={regionValues}
        onToggle={handleToggle}
        useDisplayValue
        clearScope="state"
        isAllSelectedOverride={selectedStates.length === 0}
      />
      <FilterSection
        title="Sector"
        options={SECTORS}
        filterKey="sector"
        selectedValues={sectorValues}
        onToggle={handleToggle}
      />
      <FilterSection
        title="Framework"
        options={FRAMEWORKS}
        filterKey="framework"
        selectedValues={frameworkValues}
        onToggle={handleToggle}
      />
      <FilterSection
        title="Status"
        options={STATUSES}
        filterKey="status"
        selectedValues={statusValues}
        onToggle={handleToggle}
        defaultVisible={10}
      />
    </aside>
  );
}
