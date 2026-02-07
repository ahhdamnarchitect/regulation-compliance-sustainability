import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp, X } from 'lucide-react';
import { locationHierarchy } from '@/data/locationHierarchy';
import { SearchFilters } from '@/types/regulation';

const DEFAULT_VISIBLE = 5;

const REGION_OPTIONS: string[] = [
  'Global',
  'Africa',
  'Asia',
  'Asia-Pacific',
  'EU',
  'Europe',
  'Middle East',
  'North America',
  'Oceania',
  'South America',
].sort((a, b) => a.localeCompare(b));

const SECTORS = ['Finance', 'Energy', 'Consumer Goods', 'Technology', 'Healthcare'].sort((a, b) => a.localeCompare(b));
const FRAMEWORKS = ['CSRD', 'TCFD', 'ISSB', 'GRI', 'SEC', 'SASB'].sort((a, b) => a.localeCompare(b));
const STATUSES = ['active', 'proposed', 'repealed'].sort((a, b) => a.localeCompare(b));

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

interface FilterSectionProps {
  title: string;
  options: string[];
  filterKey: keyof SearchFilters;
  currentValue: string;
  onSelect: (key: keyof SearchFilters, value: string) => void;
  defaultVisible?: number;
  /** When true, use option as-is for filter value (e.g. "France"); otherwise lowercase/dash (e.g. "finance") */
  useDisplayValue?: boolean;
}

function FilterSection({
  title,
  options,
  filterKey,
  currentValue,
  onSelect,
  defaultVisible = DEFAULT_VISIBLE,
  useDisplayValue = false,
}: FilterSectionProps) {
  const [expanded, setExpanded] = useState(false);
  const showCount = expanded ? options.length : Math.min(defaultVisible, options.length);
  const hasMore = options.length > defaultVisible;
  const visibleOptions = options.slice(0, showCount);

  if (options.length === 0) return null;

  const toFilterValue = (opt: string) =>
    useDisplayValue ? opt : opt.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className="border-b border-earth-sand/50 pb-4 mb-4 last:border-0 last:mb-0">
      <div className="font-semibold text-earth-text mb-2 text-sm">{title}</div>
      <ul className="space-y-1 text-sm">
        <li>
          <button
            type="button"
            onClick={() => onSelect(filterKey, 'all')}
            className={`w-full text-left px-2 py-1 rounded hover:bg-earth-sand/50 transition-colors ${
              currentValue === 'all' ? 'text-earth-primary font-medium bg-earth-sand/30' : 'text-earth-text/90'
            }`}
          >
            All
          </button>
        </li>
        {visibleOptions.map((opt) => {
          const value = toFilterValue(opt);
          const isSelected = currentValue === value || currentValue === opt;
          return (
            <li key={opt}>
              <button
                type="button"
                onClick={() => onSelect(filterKey, value)}
                className={`w-full text-left px-2 py-1 rounded hover:bg-earth-sand/50 transition-colors ${
                  isSelected ? 'text-earth-primary font-medium bg-earth-sand/30' : 'text-earth-text/90'
                }`}
              >
                {opt}
              </button>
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
  onFilterChange: (key: keyof SearchFilters, value: string) => void;
  onClearFilters: () => void;
  hasActiveFilters: boolean;
}

export function FilterSidebar({ filters, onFilterChange, onClearFilters, hasActiveFilters }: FilterSidebarProps) {
  const countries = getCountriesAlphabetical();
  const states = getStatesAlphabetical();

  // Normalize display: region filter can store "global", "north america", "france", "california" etc.
  const regionValue = filters.region || 'all';

  const handleLocationSelect = (value: string) => {
    onFilterChange('region', value === 'all' ? 'all' : value);
  };

  return (
    <aside className="w-full lg:w-64 shrink-0 bg-white border border-earth-sand rounded-lg p-4 shadow-sm h-fit lg:sticky lg:top-4">
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

      {/* Order: highest level region → lowest level subsidiary (Region → Country → State), then Sector, Framework, Status */}
      <FilterSection
        title="Region"
        options={REGION_OPTIONS}
        filterKey="region"
        currentValue={regionValue}
        onSelect={handleLocationSelect}
        defaultVisible={6}
        useDisplayValue
      />
      <FilterSection
        title="Country / Jurisdiction"
        options={countries}
        filterKey="region"
        currentValue={regionValue}
        onSelect={handleLocationSelect}
        useDisplayValue
      />
      <FilterSection
        title="State / Province"
        options={states}
        filterKey="region"
        currentValue={regionValue}
        onSelect={handleLocationSelect}
        useDisplayValue
      />
      <FilterSection
        title="Sector"
        options={SECTORS}
        filterKey="sector"
        currentValue={filters.sector || 'all'}
        onSelect={onFilterChange}
      />
      <FilterSection
        title="Framework"
        options={FRAMEWORKS}
        filterKey="framework"
        currentValue={filters.framework || 'all'}
        onSelect={onFilterChange}
      />
      <FilterSection
        title="Status"
        options={STATUSES}
        filterKey="status"
        currentValue={filters.status || 'all'}
        onSelect={onFilterChange}
        defaultVisible={10}
      />
    </aside>
  );
}
