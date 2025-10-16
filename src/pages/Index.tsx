import { useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { SearchBar } from '@/components/regulations/SearchBar';
import { FilterPanel } from '@/components/regulations/FilterPanel';
import { RegulationCard } from '@/components/regulations/RegulationCard';
import { PricingSection } from '@/components/PricingSection';
import { useRegulations } from '@/hooks/useRegulations';
import { SearchFilters } from '@/types/regulation';
import { useAuth } from '@/contexts/AuthContext';

export default function Index() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    region: 'all',
    sector: 'all',
    framework: 'all',
    status: 'all'
  });
  const { regulations, loading, error, refetch } = useRegulations();
  const [bookmarks, setBookmarks] = useState<string[]>([]);

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
  };

  const handleFilterChange = (key: keyof SearchFilters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

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

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section - Google-like */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="mb-8">
            <h1 className="text-6xl md:text-8xl font-bold mb-6 text-gray-900">
              MISSICK
            </h1>
            <p className="text-2xl md:text-3xl text-gray-600 mb-8">
              Global Sustainability Regulation Intelligence
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto mb-8">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              onSearch={handleSearch}
              loading={loading}
            />
          </div>
          
          <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-600">
            <span className="px-3 py-1 bg-gray-100 rounded-full">CSRD</span>
            <span className="px-3 py-1 bg-gray-100 rounded-full">TCFD</span>
            <span className="px-3 py-1 bg-gray-100 rounded-full">ISSB</span>
            <span className="px-3 py-1 bg-gray-100 rounded-full">SEC Climate Rules</span>
            <span className="px-3 py-1 bg-gray-100 rounded-full">EU Taxonomy</span>
            <span className="px-3 py-1 bg-gray-100 rounded-full">SFDR</span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="container mx-auto px-4 py-8">
        <FilterPanel
          filters={filters}
          onFilterChange={handleFilterChange}
        />
      </div>

      {/* Results */}
      {/* Results */}
      <div className="container mx-auto px-4 pb-12">
        {loading && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Loading regulations...</p>
          </div>
        )}
        
        {error && (
          <div className="text-center py-12">
            <p className="text-red-500 text-lg">Error: {error}</p>
          </div>
        )}
        
        {!loading && !error && (
          <>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-900">
                {regulations.length} Regulations Found
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {regulations.map((regulation) => (
                <RegulationCard
                  key={regulation.id}
                  regulation={regulation}
                  isBookmarked={bookmarks.includes(regulation.id)}
                  onBookmark={handleBookmark}
                />
              ))}
            </div>
          </>
        )}

        {!loading && !error && regulations.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No regulations match your search criteria.</p>
          </div>
        )}
      </div>

      {/* Pricing Section */}
      <PricingSection />
    </div>
  );
}