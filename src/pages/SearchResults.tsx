import { useState, useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { RegulationCard } from '@/components/regulations/RegulationCard';
import { FilterSidebar } from '@/components/regulations/FilterSidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useRegulations } from '@/hooks/useRegulations';
import { SearchFilters } from '@/types/regulation';
import { useAuth } from '@/contexts/AuthContext';
import { regulationAppliesToLocationFilter } from '@/lib/regulationFilter';
import { Search, ArrowLeft, Filter } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

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

export default function SearchResults() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [filters, setFilters] = useState<SearchFilters>({
    query: searchParams.get('q') || '',
    region: searchParams.get('region') || 'all',
    sector: searchParams.get('sector') || 'all',
    framework: searchParams.get('framework') || 'all',
    status: searchParams.get('status') || 'all'
  });
  const [showFiltersMobile, setShowFiltersMobile] = useState(false);
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  
  const { regulations, loading, error, refetch } = useRegulations();

  useEffect(() => {
    if (user) {
      const userBookmarks = JSON.parse(localStorage.getItem(`bookmarks_${user.id}`) || '[]');
      setBookmarks(userBookmarks);
    }
  }, [user]);

  useEffect(() => {
    refetch(filters);
  }, [filters, refetch]);

  const handleSearch = () => {
    setFilters(prev => ({ ...prev, query: searchQuery }));
    setSearchParams({ q: searchQuery });
  };

  const handleFilterChange = (key: keyof SearchFilters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    const newParams = new URLSearchParams(searchParams);
    newParams.set(key, value);
    setSearchParams(newParams);
  };

  const handleClearFilters = () => {
    setFilters({
      query: '',
      region: 'all',
      sector: 'all',
      framework: 'all',
      status: 'all'
    });
    setSearchQuery('');
    setSearchParams({});
  };

  const hasActiveFilters = filters.query || filters.region !== 'all' || filters.sector !== 'all' || filters.framework !== 'all' || filters.status !== 'all';

  const handleBookmark = (regulationId: string) => {
    if (!user) return;

    const currentBookmarks = JSON.parse(localStorage.getItem(`bookmarks_${user.id}`) || '[]');
    const isBookmarked = currentBookmarks.includes(regulationId);
    
    let updatedBookmarks;
    if (isBookmarked) {
      updatedBookmarks = currentBookmarks.filter((id: string) => id !== regulationId);
    } else {
      updatedBookmarks = [...currentBookmarks, regulationId];
    }
    
    localStorage.setItem(`bookmarks_${user.id}`, JSON.stringify(updatedBookmarks));
    setBookmarks(updatedBookmarks);
  };

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
    if (!regulationAppliesToLocationFilter(regulation, filters.region || 'all')) {
      return false;
    }
    if (filters.sector !== 'all' && regulation.sector?.toLowerCase() !== filters.sector) {
      return false;
    }
    if (filters.framework !== 'all' && regulation.framework?.toLowerCase() !== filters.framework) {
      return false;
    }
    if (filters.status !== 'all' && regulation.status !== filters.status) {
      return false;
    }
    return true;
  });

  const sidebarContent = (
    <FilterSidebar
      filters={filters}
      onFilterChange={handleFilterChange}
      onClearFilters={handleClearFilters}
      hasActiveFilters={hasActiveFilters}
    />
  );

  const activeFilterCount = [
    filters.region !== 'all',
    filters.sector !== 'all',
    filters.framework !== 'all',
    filters.status !== 'all',
  ].filter(Boolean).length;

  return (
    <div className="min-h-screen bg-earth-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
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
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-earth-text/60 w-4 h-4" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="Search regulations..."
                className="pl-10 border-earth-sand focus:border-earth-primary focus:ring-earth-primary"
              />
            </div>
            <Button onClick={handleSearch} className="bg-earth-primary hover:bg-earth-primary/90 shrink-0">
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
                <div className="flex-1 overflow-y-auto px-4 py-4 bg-earth-background">
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
