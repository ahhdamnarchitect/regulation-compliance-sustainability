import { useState, useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { RegulationCard } from '@/components/regulations/RegulationCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectGroup, SelectLabel } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useRegulations } from '@/hooks/useRegulations';
import { SearchFilters } from '@/types/regulation';
import { useAuth } from '@/contexts/AuthContext';
import { Search, Filter, ArrowLeft, X } from 'lucide-react';

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
  const [showFilters, setShowFilters] = useState(false);
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

  // Define region groups for filtering
  const europeJurisdictions = ['EU', 'France', 'Germany', 'UK', 'Netherlands', 'Italy', 'Spain', 'Sweden', 'Bavaria'];
  const northAmericaJurisdictions = ['US', 'California', 'Texas', 'North America', 'Ontario'];

  // Check if a regulation matches a region filter
  const matchesRegionFilter = (regulation: { jurisdiction?: string; country?: string }, regionFilter: string): boolean => {
    if (regionFilter === 'all') return true;
    
    const jurisdiction = regulation.jurisdiction || '';
    const country = regulation.country || '';
    
    // Handle grouped regions
    if (regionFilter === 'europe-all') {
      return europeJurisdictions.includes(jurisdiction) || country === 'European Union' || europeJurisdictions.some(j => country.includes(j));
    }
    if (regionFilter === 'north-america-all') {
      return northAmericaJurisdictions.includes(jurisdiction) || country === 'United States' || country === 'Canada';
    }
    
    // Handle direct jurisdiction match
    return jurisdiction === regionFilter;
  };

  const filteredRegulations = regulations.filter(regulation => {
    if (filters.query) {
      const query = filters.query.trim();
      // Use smart search for various fields
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
    if (!matchesRegionFilter(regulation, filters.region || 'all')) {
      return false;
    }
    if (filters.sector !== 'all' && regulation.sector !== filters.sector) {
      return false;
    }
    if (filters.framework !== 'all' && regulation.framework !== filters.framework) {
      return false;
    }
    if (filters.status !== 'all' && regulation.status !== filters.status) {
      return false;
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-earth-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Link to="/" className="inline-flex items-center text-earth-primary hover:text-earth-primary/80 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Map
          </Link>
        </div>

        {/* Search Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-earth-text mb-4">
            Search Results
          </h1>
          
          {/* Search Bar */}
          <div className="flex gap-4 mb-4">
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
            <Button onClick={handleSearch} className="bg-earth-primary hover:bg-earth-primary/90">
              Search
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setShowFilters(!showFilters)}
              className="border-earth-sand hover:bg-earth-sand"
            >
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>
          </div>

          {/* Expandable Filters */}
          {showFilters && (
            <Card className="mb-6 border-earth-sand">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg text-earth-text">Filter Results</CardTitle>
                {hasActiveFilters && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleClearFilters}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <X className="w-4 h-4 mr-1" />
                    Clear All
                  </Button>
                )}
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="text-sm font-medium text-earth-text mb-2 block">Region</label>
                    <Select value={filters.region} onValueChange={(value) => handleFilterChange('region', value)}>
                      <SelectTrigger className="border-earth-sand">
                        <SelectValue placeholder="Select region" />
                      </SelectTrigger>
                      <SelectContent className="max-h-[300px]">
                        <SelectItem value="all">All Regions</SelectItem>
                        <SelectItem value="Global">Global Standards</SelectItem>
                        
                        <SelectGroup>
                          <SelectLabel className="text-earth-primary font-semibold">Europe</SelectLabel>
                          <SelectItem value="europe-all">All Europe</SelectItem>
                          <SelectItem value="EU">EU (Region-wide)</SelectItem>
                          <SelectItem value="France">France</SelectItem>
                          <SelectItem value="Germany">Germany</SelectItem>
                          <SelectItem value="UK">United Kingdom</SelectItem>
                        </SelectGroup>
                        
                        <SelectGroup>
                          <SelectLabel className="text-earth-primary font-semibold">North America</SelectLabel>
                          <SelectItem value="north-america-all">All North America</SelectItem>
                          <SelectItem value="US">United States (Federal)</SelectItem>
                          <SelectItem value="California">California</SelectItem>
                          <SelectItem value="Texas">Texas</SelectItem>
                          <SelectItem value="North America">Canada</SelectItem>
                          <SelectItem value="Ontario">Ontario</SelectItem>
                        </SelectGroup>
                        
                        <SelectGroup>
                          <SelectLabel className="text-earth-primary font-semibold">Asia Pacific</SelectLabel>
                          <SelectItem value="Asia-Pacific">All Asia Pacific</SelectItem>
                        </SelectGroup>
                        
                        <SelectGroup>
                          <SelectLabel className="text-earth-primary font-semibold">South America</SelectLabel>
                          <SelectItem value="South America">All South America</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-earth-text mb-2 block">Sector</label>
                    <Select value={filters.sector} onValueChange={(value) => handleFilterChange('sector', value)}>
                      <SelectTrigger className="border-earth-sand">
                        <SelectValue placeholder="Select sector" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Sectors</SelectItem>
                        <SelectItem value="Finance">Finance</SelectItem>
                        <SelectItem value="Energy">Energy</SelectItem>
                        <SelectItem value="Technology">Technology</SelectItem>
                        <SelectItem value="Healthcare">Healthcare</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-earth-text mb-2 block">Framework</label>
                    <Select value={filters.framework} onValueChange={(value) => handleFilterChange('framework', value)}>
                      <SelectTrigger className="border-earth-sand">
                        <SelectValue placeholder="Select framework" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Frameworks</SelectItem>
                        <SelectItem value="CSRD">CSRD</SelectItem>
                        <SelectItem value="TCFD">TCFD</SelectItem>
                        <SelectItem value="ISSB">ISSB</SelectItem>
                        <SelectItem value="SEC">SEC</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-earth-text mb-2 block">Status</label>
                    <Select value={filters.status} onValueChange={(value) => handleFilterChange('status', value)}>
                      <SelectTrigger className="border-earth-sand">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="proposed">Proposed</SelectItem>
                        <SelectItem value="repealed">Repealed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Results Count */}
          <div className="flex items-center justify-between">
            <p className="text-earth-text">
              {loading ? 'Loading...' : `${filteredRegulations.length} regulations found`}
            </p>
          </div>
        </div>

        {/* Results */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-earth-primary mx-auto"></div>
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
      <Footer />
    </div>
  );
}
