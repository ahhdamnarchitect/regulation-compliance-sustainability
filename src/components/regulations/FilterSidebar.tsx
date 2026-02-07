import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
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

type FilterKey = 'region' | 'sector' | 'framework' | 'status';

interface FilterSectionProps {
  title: string;
  options: string[];
  filterKey: FilterKey;
  selectedValues: string[];
  onToggle: (key: FilterKey, value: string, checked: boolean) => void;
  defaultVisible?: number;
  useDisplayValue?: boolean;
}

function FilterSection({
  title,
  options,
  filterKey,
  selectedValues,
  onToggle,
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

  const isAllSelected = selectedValues.length === 0;

  return (
    <div className="border-b border-earth-sand/50 pb-4 mb-4 last:border-0 last:mb-0">
      <div className="font-semibold text-earth-text mb-2 text-sm">{title}</div>
      <ul className="space-y-1 text-sm">
        <li>
          <label className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-earth-sand/50 cursor-pointer">
            <Checkbox
              checked={isAllSelected}
              onCheckedChange={(checked) => {
                if (checked) onToggle(filterKey, '__clear__', false);
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
  onFilterToggle: (key: FilterKey, value: string, checked: boolean) => void;
  onClearFilters: () => void;
  hasActiveFilters: boolean;
}

export function FilterSidebar({ filters, onFilterToggle, onClearFilters, hasActiveFilters }: FilterSidebarProps) {
  const countries = getCountriesAlphabetical();
  const states = getStatesAlphabetical();

  const regionValues = filters.region ?? [];
  const sectorValues = filters.sector ?? [];
  const frameworkValues = filters.framework ?? [];
  const statusValues = filters.status ?? [];

  const handleToggle = (key: FilterKey, value: string, checked: boolean) => {
    if (value === '__clear__') {
      onFilterToggle(key, '', false);
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
      />
      <FilterSection
        title="Country / Jurisdiction"
        options={countries}
        filterKey="region"
        selectedValues={regionValues}
        onToggle={handleToggle}
        useDisplayValue
      />
      <FilterSection
        title="State / Province"
        options={states}
        filterKey="region"
        selectedValues={regionValues}
        onToggle={handleToggle}
        useDisplayValue
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
