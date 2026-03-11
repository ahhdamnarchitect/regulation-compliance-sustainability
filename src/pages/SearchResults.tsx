import { useState, useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { RegulationCard } from '@/components/regulations/RegulationCard';
import { FilterSidebar } from '@/components/regulations/FilterSidebar';
import { Button } from '@/components/ui/button';
import { useRegulations } from '@/hooks/useRegulations';
import { SearchFilters } from '@/types/regulation';
import { useAuth } from '@/contexts/AuthContext';
import { regulationAppliesToLocationFilter } from '@/lib/regulationFilter';
import { statusMatchesFilter } from '@/lib/utils';
import {
  REGION_LEVEL_NAMES,
  getCountryNames,
  getStateNames,
  getCountriesForSelectedRegions,
  getStatesForSelectedRegionsAndCountries,
  locationHierarchy,
} from '@/data/locationHierarchy';
import type { LocationClearScope } from '@/components/regulations/FilterSidebar';
import { ArrowLeft, Filter } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { SearchInputWithSuggestions } from '@/components/search/SearchInputWithSuggestions';

// Smart search function that uses word boundary matching for short terms
const smartSearch = (text: string, query: string): boolean => {
  if (!text || !query) return false;
  const normalizedQuery = query.toLowerCase().trim();
  const normalizedText = text.toLowerCase();
  
  // For short search terms (3 chars or less), use word boundary matching
  if (normalizedQuery.length <= 3) {
    // Match as whole word or at start/end of compound terms
    const wordBoundaryRegex = new RegExp(`(^|[\\s,._-])${normalizedQuery}($|[\\s,._-])`, 'i');
    return wordBoundaryRegex.test(normalizedText);
  }
  
  // For longer terms, use contains matching
  return normalizedText.includes(normalizedQuery);
};

const parseArrayParam = (s: string | null): string[] =>
  (s ?? '').split(',').map((v) => v.trim()).filter(Boolean);

export default function SearchResults() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, updateBookmarks } = useAuth();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [filters, setFilters] = useState<SearchFilters>(() => ({
    query: searchParams.get('q') || '',
    region: parseArrayParam(searchParams.get('region')),
    sector: parseArrayParam(searchParams.get('sector')),
    framework: parseArrayParam(searchParams.get('framework')),
    status: parseArrayParam(searchParams.get('status')),
  }));
  const [showFiltersMobile, setShowFiltersMobile] = useState(false);
  const bookmarks = user?.bookmarks ?? [];

  const { regulations, loading, error, refetch } = useRegulations();

  useEffect(() => {
    refetch(filters);
  }, [filters, refetch]);

  // Sanitize region filter: when region-level selection changes, remove any country/state that is no longer in the current options
  useEffect(() => {
    const region = filters.region ?? [];
    const selectedRegionsOnly = region.filter((v) => REGION_LEVEL_NAMES.includes(v));
    const validCountrySet = new Set(getCountriesForSelectedRegions(selectedRegionsOnly));
    const selectedCountriesValid = region.filter((v) => locationHierarchy[v]?.level === 'country' && validCountrySet.has(v));
    const validStateSet = new Set(getStatesForSelectedRegionsAndCountries(selectedRegionsOnly, selectedCountriesValid));
    const sanitized = region.filter(
      (v) => REGION_LEVEL_NAMES.includes(v) || validCountrySet.has(v) || validStateSet.has(v)
    );
    if (sanitized.length !== region.length || sanitized.some((v, i) => v !== region[i])) {
      setFilters((prev) => ({ ...prev, region: sanitized }));
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        if (sanitized.length) next.set('region', sanitized.join(','));
        else next.delete('region');
        return next;
      });
    }
  }, [filters.region]);

  const handleSearch = (term?: string) => {
    const q = (term ?? searchQuery).trim();
    setSearchQuery(q);
    setFilters(prev => ({ ...prev, query: q }));
    setSearchParams(prev => {
      const next = new URLSearchParams(prev);
      if (q) next.set('q', q);
      else next.delete('q');
      return next;
    });
  };

  type FilterKey = 'region' | 'sector' | 'framework' | 'status';
  const handleFilterToggle = (key: FilterKey, value: string, checked: boolean, clearScope?: LocationClearScope, optionsToRemove?: string[]) => {
    if (value === '__clear__' && key === 'region' && (clearScope || optionsToRemove?.length)) {
      const toRemove = optionsToRemove && optionsToRemove.length > 0
        ? new Set(optionsToRemove)
        : new Set<string>(clearScope === 'region' ? REGION_LEVEL_NAMES : clearScope === 'country' ? getCountryNames() : getStateNames());
      const nextRegion = (filters.region ?? []).filter((v) => !toRemove.has(v));
      setFilters(prev => ({ ...prev, region: nextRegion }));
      setSearchParams(prev => {
        const next = new URLSearchParams(prev);
        if (nextRegion.length) next.set('region', nextRegion.join(','));
        else next.delete('region');
        return next;
      });
      return;
    }
    if (value === '__clear__') {
      setFilters(prev => ({ ...prev, [key]: [] }));
      setSearchParams(prev => {
        const next = new URLSearchParams(prev);
        next.delete(key);
        return next;
      });
      return;
    }
    const arr = filters[key] ?? [];
    const nextArr = checked ? (arr.includes(value) ? arr : [...arr, value]) : arr.filter((v) => v !== value);
    setFilters(prev => ({ ...prev, [key]: nextArr }));
    setSearchParams(prev => {
      const np = new URLSearchParams(prev);
      if (nextArr.length) np.set(key, nextArr.join(','));
      else np.delete(key);
      return np;
    });
  };

  const handleClearFilters = () => {
    setFilters({
      query: '',
      region: [],
      sector: [],
      framework: [],
      status: [],
    });
    setSearchQuery('');
    setSearchParams({});
  };

  const hasActiveFilters =
    !!filters.query ||
    (filters.region?.length ?? 0) > 0 ||
    (filters.sector?.length ?? 0) > 0 ||
    (filters.framework?.length ?? 0) > 0 ||
    (filters.status?.length ?? 0) > 0;

  const handleBookmark = (regulationId: string) => {
    if (!user) return;
    const currentBookmarks = user.bookmarks ?? [];
    const isBookmarked = currentBookmarks.includes(regulationId);
    const updatedBookmarks = isBookmarked
      ? currentBookmarks.filter((id: string) => id !== regulationId)
      : [...currentBookmarks, regulationId];
    updateBookmarks(updatedBookmarks);
  };

  const norm = (s: string | undefined) => (s ?? '').toLowerCase().trim().replace(/\s+/g, '-');
  const regions = filters.region ?? [];
  const sectors = filters.sector ?? [];
  const frameworks = filters.framework ?? [];
  const statuses = filters.status ?? [];

  const selectedCountries = regions.filter((r) => locationHierarchy[r]?.level === 'country');
  const selectedStates = regions.filter((r) => locationHierarchy[r]?.level === 'state');
  const selectedRegionsOnly = regions.filter((r) => REGION_LEVEL_NAMES.includes(r));

  const filteredRegulations = regulations.filter(regulation => {
    if (filters.query) {
      const query = filters.query.trim();
      const titleMatch = smartSearch(regulation.title, query);
      const descMatch = smartSearch(regulation.summary || regulation.description || '', query);
      const jurisdictionMatch = smartSearch(regulation.jurisdiction || '', query);
      const countryMatch = smartSearch(regulation.country || '', query);
      const frameworkMatch = smartSearch(regulation.framework || '', query);
      const tagsMatch = regulation.tags?.some(tag => smartSearch(tag, query)) || false;
      if (!titleMatch && !descMatch && !jurisdictionMatch && !countryMatch && !frameworkMatch && !tagsMatch) {
        return false;
      }
    }
    if (regions.length > 0) {
      if (selectedStates.length > 0) {
        if (!selectedStates.some((r) => regulationAppliesToLocationFilter(regulation, r))) return false;
      } else if (selectedCountries.length > 0) {
        if (!selectedCountries.some((r) => regulationAppliesToLocationFilter(regulation, r))) return false;
      } else {
        if (!selectedRegionsOnly.some((r) => regulationAppliesToLocationFilter(regulation, r))) return false;
      }
    }
    if (sectors.length > 0 && !sectors.some((s) => norm(regulation.sector) === norm(s))) {
      return false;
    }
    if (frameworks.length > 0 && !frameworks.some((f) => norm(regulation.framework) === norm(f))) {
      return false;
    }
    if (statuses.length > 0 && !statuses.some((s) => statusMatchesFilter(regulation.status, s))) {
      return false;
    }
    return true;
  });

  const availableSectors = filteredRegulations.length > 0
    ? [...new Set(filteredRegulations.map((r) => r.sector).filter(Boolean))] as string[]
    : undefined;
  const availableFrameworks = filteredRegulations.length > 0
    ? [...new Set(filteredRegulations.map((r) => r.framework).filter(Boolean))] as string[]
    : undefined;
  const availableStatuses = filteredRegulations.length > 0
    ? [...new Set(filteredRegulations.map((r) => (r.status === 'proposed' ? 'proposed' : 'enacted')))] as string[]
    : undefined;

  const sidebarContent = (
    <FilterSidebar
      filters={filters}
      onFilterToggle={handleFilterToggle}
      onClearFilters={handleClearFilters}
      hasActiveFilters={hasActiveFilters}
      availableSectors={availableSectors}
      availableFrameworks={availableFrameworks}
      availableStatuses={availableStatuses}
    />
  );

  const activeFilterCount =
    (filters.region?.length ?? 0) +
    (filters.sector?.length ?? 0) +
    (filters.framework?.length ?? 0) +
    (filters.status?.length ?? 0);

  return (
    <div className="min-h-screen flex flex-col bg-transparent">
      <Header />
      <div className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-4">
          <Link to="/" className="inline-flex items-center text-earth-primary hover:text-earth-primary/80 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Map
          </Link>
        </div>

        <h1 className="text-3xl font-bold text-earth-text mb-4">Search Results</h1>

        {/* Search bar + Filter bar (filters up top on mobile) */}
        <div className="space-y-3 mb-6">
          <div className="flex gap-2 sm:gap-4">
            <SearchInputWithSuggestions
              value={searchQuery}
              onChange={setSearchQuery}
              onSearch={handleSearch}
              placeholder="Search regulations..."
              regulations={regulations}
              suggestionsEnabled={false}
              inputClassName="border-earth-sand focus:border-earth-primary focus:ring-earth-primary"
            />
            <Button onClick={() => handleSearch()} className="bg-earth-primary hover:bg-earth-primary/90 shrink-0">
              Search
            </Button>
          </div>
          {/* Mobile: filter bar up top with one clear filter-settings button */}
          <div className="flex items-center lg:hidden">
            <Sheet open={showFiltersMobile} onOpenChange={setShowFiltersMobile}>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full sm:w-auto border-earth-sand hover:bg-earth-sand justify-center gap-2"
                >
                  <Filter className="w-4 h-4" />
                  Filters
                  {activeFilterCount > 0 && (
                    <span className="bg-earth-primary text-white text-xs font-medium min-w-[1.25rem] h-5 px-1.5 rounded-full flex items-center justify-center">
                      {activeFilterCount}
                    </span>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent
                side="left"
                className="w-full max-w-full sm:max-w-full h-full rounded-none border-0 flex flex-col p-0 lg:hidden"
              >
                <div className="flex items-center justify-between shrink-0 border-b border-earth-sand px-4 pt-3 pb-3 pr-14 bg-white">
                  <h2 className="text-lg font-bold text-earth-text">Filters</h2>
                </div>
                <div className="flex-1 overflow-y-auto px-4 py-4 bg-transparent">
                  {sidebarContent}
                </div>
                <div className="shrink-0 border-t border-earth-sand bg-white p-4 safe-area-pb">
                  <Button
                    className="w-full bg-earth-primary hover:bg-earth-primary/90 text-white py-3"
                    onClick={() => setShowFiltersMobile(false)}
                  >
                    Show {filteredRegulations.length} results
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        <div className="flex gap-8 flex-col lg:flex-row">
          {/* Left sidebar - hidden on mobile (use Sheet instead) */}
          <div className="hidden lg:block shrink-0">
            {sidebarContent}
          </div>

          {/* Main content */}
          <div className="flex-1 min-w-0">
            <p className="text-earth-text mb-6">
              {loading ? 'Loading...' : `${filteredRegulations.length} regulations found`}
            </p>

            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-earth-primary mx-auto" />
                <p className="text-earth-text mt-4">Loading regulations...</p>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <p className="text-red-600">Error loading regulations: {error}</p>
              </div>
            ) : filteredRegulations.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-earth-text text-lg">No regulations found matching your criteria.</p>
                <p className="text-earth-text/60 mt-2">Try adjusting your search terms or filters.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredRegulations.map((regulation) => (
                  <div
                    key={regulation.id}
                    className="cursor-pointer hover:scale-105 transition-transform duration-200"
                    onClick={() => navigate(`/regulation/${regulation.id}`)}
                  >
                    <RegulationCard
                      regulation={regulation}
                      isBookmarked={bookmarks.includes(regulation.id)}
                      onBookmark={(e, id) => {
                        e.stopPropagation();
                        handleBookmark(id);
                      }}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
