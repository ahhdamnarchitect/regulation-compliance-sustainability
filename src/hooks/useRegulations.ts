import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { Regulation, SearchFilters, DatabaseRegulation } from '@/types/regulation';
import { mockRegulations } from '@/data/mockRegulations';
import { countryAliases, getCountriesForRegulation } from '@/data/countryMapping';

// Smart country matching function
const getSmartCountryMatch = (query: string, regulation: Regulation): boolean => {
  const normalizedQuery = query.toLowerCase().trim();
  
  // Check if query matches any country aliases
  const matchingCountries = Object.entries(countryAliases).filter(([alias, country]) => 
    alias.toLowerCase().includes(normalizedQuery) || country.toLowerCase().includes(normalizedQuery)
  );
  
  if (matchingCountries.length > 0) {
    const countries = getCountriesForRegulation(regulation.jurisdiction, regulation.country);
    return countries.some(country => 
      matchingCountries.some(([_, mappedCountry]) => mappedCountry === country)
    );
  }
  
  // Check for common region terms
  const regionTerms: Record<string, string[]> = {
    'europe': ['eu', 'european union', 'european'],
    'america': ['us', 'usa', 'united states', 'north america'],
    'asia': ['asian', 'asia pacific', 'pacific'],
    'global': ['international', 'worldwide', 'world']
  };
  
  for (const [region, terms] of Object.entries(regionTerms)) {
    if (terms.some(term => normalizedQuery.includes(term))) {
      const countries = getCountriesForRegulation(region, '');
      return countries.length > 0;
    }
  }
  
  return false;
};

export const useRegulations = () => {
  const [regulations, setRegulations] = useState<Regulation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Transform database regulation to frontend regulation
  const transformRegulation = (dbReg: DatabaseRegulation): Regulation => ({
    id: dbReg.id.toString(),
    title: dbReg.title || 'Untitled Regulation',
    jurisdiction: dbReg.region || 'Unknown',
    country: dbReg.country || 'Unknown',
    sector: dbReg.sector || 'Unknown',
    framework: dbReg.framework || 'Unknown',
    description: dbReg.description || '',
    complianceDeadline: dbReg.reporting_year?.toString(),
    status: (dbReg.status as 'proposed' | 'active' | 'repealed') || 'proposed',
    source_url: dbReg.source_url,
    tags: dbReg.tags ? dbReg.tags.split(',').map(tag => tag.trim()) : [],
    created_at: dbReg.created_at,
    updated_at: dbReg.updated_at
  });

  const fetchRegulations = useCallback(async (filters?: SearchFilters) => {
    try {
      setLoading(true);
      setError(null);
      
      // Try to fetch from Supabase first
      let query = supabase.from('regulations').select('*');

      if (filters?.query) {
        query = query.or(`title.ilike.%${filters.query}%,description.ilike.%${filters.query}%`);
      }
      if (filters?.region && filters.region !== 'all') {
        query = query.eq('region', filters.region);
      }
      if (filters?.sector && filters.sector !== 'all') {
        query = query.eq('sector', filters.sector);
      }
      if (filters?.framework && filters.framework !== 'all') {
        query = query.eq('framework', filters.framework);
      }
      if (filters?.status && filters.status !== 'all') {
        query = query.eq('status', filters.status);
      }

      const { data, error: supabaseError } = await query.order('created_at', { ascending: false });

      if (supabaseError) {
        console.warn('Supabase error, falling back to mock data:', supabaseError);
        // Fallback to mock data with filtering
        let filteredData = [...mockRegulations];
        
        if (filters?.query) {
          const query = filters.query.toLowerCase();
          filteredData = filteredData.filter(reg => {
            // Search in title and description
            const titleMatch = reg.title.toLowerCase().includes(query);
            const descMatch = (reg.summary || reg.description || '').toLowerCase().includes(query);
            
            // Search in jurisdiction and country
            const jurisdictionMatch = (reg.jurisdiction || '').toLowerCase().includes(query);
            const countryMatch = (reg.country || '').toLowerCase().includes(query);
            
            // Search in framework and sector
            const frameworkMatch = (reg.framework || '').toLowerCase().includes(query);
            const sectorMatch = (reg.sector || '').toLowerCase().includes(query);
            
            // Search in tags
            const tagsMatch = reg.tags && reg.tags.some((tag: string) => 
              tag.toLowerCase().includes(query)
            );
            
            // Smart country/region matching
            const smartCountryMatch = getSmartCountryMatch(query, reg);
            
            return titleMatch || descMatch || jurisdictionMatch || countryMatch || 
                   frameworkMatch || sectorMatch || tagsMatch || smartCountryMatch;
          });
        }
        if (filters?.region && filters.region !== 'all') {
          filteredData = filteredData.filter(reg => {
            const jurisdiction = (reg.jurisdiction || '').toLowerCase();
            const country = (reg.country || '').toLowerCase();
            const filterRegion = filters.region.toLowerCase();
            
            // Map filter values to data values
            if (filterRegion === 'europe') {
              return jurisdiction === 'eu' || country.includes('european union');
            }
            if (filterRegion === 'north america') {
              return jurisdiction === 'us' || jurisdiction === 'canada' || country.includes('united states') || country.includes('canada');
            }
            if (filterRegion === 'asia pacific') {
              return jurisdiction === 'asia' || country.includes('china') || country.includes('japan') || country.includes('australia');
            }
            if (filterRegion === 'global') {
              return jurisdiction === 'global' || jurisdiction === 'international';
            }
            
            // Fallback to exact match
            return jurisdiction === filterRegion || country.includes(filterRegion);
          });
        }
        if (filters?.sector && filters.sector !== 'all') {
          filteredData = filteredData.filter(reg => {
            const sector = (reg.sector || '').toLowerCase();
            const filterSector = filters.sector.toLowerCase();
            
            // Handle "All Sectors" case
            if (sector === 'all sectors') {
              return true;
            }
            
            return sector === filterSector || sector.includes(filterSector);
          });
        }
        if (filters?.framework && filters.framework !== 'all') {
          filteredData = filteredData.filter(reg => reg.framework === filters.framework);
        }
        if (filters?.status && filters.status !== 'all') {
          filteredData = filteredData.filter(reg => reg.status === filters.status);
        }
        
        setRegulations(filteredData);
      } else {
        const transformedData = (data || []).map(transformRegulation);
        setRegulations(transformedData);
      }
    } catch (err) {
      console.warn('Error fetching from Supabase, using mock data:', err);
      setRegulations(mockRegulations);
    } finally {
      setLoading(false);
    }
  }, []);

  // Set up realtime subscription
  useEffect(() => {
    const channel = supabase
      .channel('regulations-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'regulations'
        },
        () => {
          // Refetch data when changes occur
          fetchRegulations();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchRegulations]);

  useEffect(() => {
    fetchRegulations();
  }, [fetchRegulations]);

  return { regulations, loading, error, refetch: fetchRegulations };
};