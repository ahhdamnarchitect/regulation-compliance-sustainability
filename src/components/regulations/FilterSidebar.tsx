import { useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { X } from 'lucide-react';
import {
  locationHierarchy,
  REGION_LEVEL_NAMES,
  getCountriesForSelectedRegions,
  getStatesForSelectedRegionsAndCountries,
} from '@/data/locationHierarchy';
import { SearchFilters } from '@/types/regulation';
import { formatStatus } from '@/lib/utils';

const FILTER_SECTION_MAX_HEIGHT = '12rem';

const REGION_OPTIONS = [...REGION_LEVEL_NAMES];

const SECTORS_DEFAULT = ['Finance', 'Energy', 'Consumer Goods', 'Technology', 'Healthcare'].sort((a, b) => a.localeCompare(b));
const FRAMEWORKS_DEFAULT = ['CSRD', 'TCFD', 'ISSB', 'GRI', 'SEC', 'SASB'].sort((a, b) => a.localeCompare(b));
const STATUS_VALUES = ['proposed', 'enacted'];

export type LocationClearScope = 'region' | 'country' | 'state';

type FilterKey = 'region' | 'sector' | 'framework' | 'status';

interface FilterSectionProps {
  title: string;
  options: string[];
  filterKey: FilterKey;
  selectedValues: string[];
  onToggle: (key: FilterKey, value: string, checked: boolean, clearScope?: LocationClearScope, optionsToRemove?: string[]) => void;
  useDisplayValue?: boolean;
  clearScope?: LocationClearScope;
  /** When true, show a "Clear" button for this section. */
  showClear?: boolean;
  /** When set, use this instead of selectedValues.length > 0 to show Clear (e.g. for Region/Country/State). */
  hasSelectionInSectionOverride?: boolean;
}

function FilterSection({
  title,
  options,
  filterKey,
  selectedValues,
  onToggle,
  useDisplayValue = false,
  clearScope,
  showClear = false,
  hasSelectionInSectionOverride,
}: FilterSectionProps) {
  const hasSelectionInSection = hasSelectionInSectionOverride !== undefined ? hasSelectionInSectionOverride : selectedValues.length > 0;

  if (options.length === 0) return null;

  const toFilterValue = (opt: string) =>
    useDisplayValue ? opt : opt.toLowerCase().replace(/\s+/g, '-');

  const handleClearSection = () => {
    onToggle(filterKey, '__clear__', false, clearScope, options);
  };

  return (
    <div className="border-b border-earth-sand/50 pb-4 mb-4 last:border-0 last:mb-0">
      <div className="flex items-center justify-between mb-2">
        <span className="font-semibold text-earth-text text-sm">{title}</span>
        {showClear && hasSelectionInSection && (
          <button
            type="button"
            onClick={handleClearSection}
            className="text-earth-primary hover:underline text-xs font-medium"
          >
            Clear
          </button>
        )}
      </div>
      <div
        className="overflow-y-auto overscroll-contain pr-1 -mr-1 space-y-1 text-sm"
        style={{ maxHeight: FILTER_SECTION_MAX_HEIGHT }}
      >
        <ul className="space-y-1">
          {options.map((opt) => {
            const value = toFilterValue(opt);
            const isSelected = selectedValues.includes(value) || selectedValues.includes(opt);
            const displayLabel = filterKey === 'status' ? formatStatus(opt) : opt;
            return (
              <li key={opt}>
                <label className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-earth-sand/50 cursor-pointer">
                  <Checkbox
                    checked={!!isSelected}
                    onCheckedChange={(checked) => onToggle(filterKey, value, !!checked)}
                    className="border-earth-text/50 data-[state=checked]:bg-earth-primary data-[state=checked]:border-earth-primary"
                  />
                  <span className={isSelected ? 'text-earth-primary font-medium' : 'text-earth-text/90'}>{displayLabel}</span>
                </label>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

interface FilterSidebarProps {
  filters: SearchFilters;
  onFilterToggle: (key: FilterKey, value: string, checked: boolean, clearScope?: LocationClearScope, optionsToRemove?: string[]) => void;
  onClearFilters: () => void;
  hasActiveFilters: boolean;
  /** Sector options from current filtered results; when set, only these are shown. */
  availableSectors?: string[];
  /** Framework options from current filtered results; when set, only these are shown. */
  availableFrameworks?: string[];
  /** Status options from current filtered results (lowercase); when set, only these are shown. */
  availableStatuses?: string[];
}

export function FilterSidebar({
  filters,
  onFilterToggle,
  onClearFilters,
  hasActiveFilters,
  availableSectors,
  availableFrameworks,
  availableStatuses,
}: FilterSidebarProps) {
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

  const handleToggle = (key: FilterKey, value: string, checked: boolean, clearScope?: LocationClearScope, optionsToRemove?: string[]) => {
    if (value === '__clear__') {
      onFilterToggle(key, '__clear__', false, clearScope, optionsToRemove);
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
            className="text-earth-primary hover:bg-earth-sand/50 h-8 px-2 font-medium"
          >
            <X className="w-3.5 h-3.5 mr-1" />
            Clear All
          </Button>
        )}
      </div>

      <FilterSection
        title="Region"
        options={REGION_OPTIONS}
        filterKey="region"
        selectedValues={regionValues}
        onToggle={handleToggle}
        useDisplayValue
        clearScope="region"
        showClear
        hasSelectionInSectionOverride={selectedRegions.length > 0}
      />
      {countryOptions.length > 0 && (
      <FilterSection
        title="Country / Jurisdiction"
        options={countryOptions}
        filterKey="region"
        selectedValues={regionValues}
        onToggle={handleToggle}
        useDisplayValue
        clearScope="country"
        showClear
        hasSelectionInSectionOverride={selectedCountries.length > 0}
      />
      )}
      {stateOptions.length > 0 && (
      <FilterSection
        title="State / Province"
        options={stateOptions}
        filterKey="region"
        selectedValues={regionValues}
        onToggle={handleToggle}
        useDisplayValue
        clearScope="state"
        showClear
        hasSelectionInSectionOverride={selectedStates.length > 0}
      />
      )}
      <FilterSection
        title="Sector"
        options={availableSectors && availableSectors.length > 0 ? availableSectors.sort((a, b) => a.localeCompare(b)) : SECTORS_DEFAULT}
        filterKey="sector"
        selectedValues={sectorValues}
        onToggle={handleToggle}
        showClear
      />
      <FilterSection
        title="Framework"
        options={availableFrameworks && availableFrameworks.length > 0 ? availableFrameworks.sort((a, b) => a.localeCompare(b)) : FRAMEWORKS_DEFAULT}
        filterKey="framework"
        selectedValues={frameworkValues}
        onToggle={handleToggle}
        showClear
      />
      <FilterSection
        title="Status"
        options={STATUS_VALUES}
        filterKey="status"
        selectedValues={statusValues}
        onToggle={handleToggle}
        showClear
      />
    </aside>
  );
}
