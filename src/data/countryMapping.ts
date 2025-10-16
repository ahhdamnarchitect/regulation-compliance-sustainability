// Comprehensive country and region mapping for regulations
export const countryCoordinates = {
  // Europe
  'Germany': { lat: 51.1657, lng: 10.4515, name: 'Germany' },
  'France': { lat: 46.2276, lng: 2.2137, name: 'France' },
  'Italy': { lat: 41.8719, lng: 12.5674, name: 'Italy' },
  'Spain': { lat: 40.4637, lng: -3.7492, name: 'Spain' },
  'Netherlands': { lat: 52.1326, lng: 5.2913, name: 'Netherlands' },
  'Belgium': { lat: 50.5039, lng: 4.4699, name: 'Belgium' },
  'Austria': { lat: 47.5162, lng: 14.5501, name: 'Austria' },
  'Sweden': { lat: 60.1282, lng: 18.6435, name: 'Sweden' },
  'Denmark': { lat: 56.2639, lng: 9.5018, name: 'Denmark' },
  'Finland': { lat: 61.9241, lng: 25.7482, name: 'Finland' },
  'Norway': { lat: 60.4720, lng: 8.4689, name: 'Norway' },
  'Switzerland': { lat: 46.8182, lng: 8.2275, name: 'Switzerland' },
  'Poland': { lat: 51.9194, lng: 19.1451, name: 'Poland' },
  'Czech Republic': { lat: 49.8175, lng: 15.4730, name: 'Czech Republic' },
  'Hungary': { lat: 47.1625, lng: 19.5033, name: 'Hungary' },
  'Romania': { lat: 45.9432, lng: 24.9668, name: 'Romania' },
  'Bulgaria': { lat: 42.7339, lng: 25.4858, name: 'Bulgaria' },
  'Croatia': { lat: 45.1000, lng: 15.2000, name: 'Croatia' },
  'Slovenia': { lat: 46.1512, lng: 14.9955, name: 'Slovenia' },
  'Slovakia': { lat: 48.6690, lng: 19.6990, name: 'Slovakia' },
  'Estonia': { lat: 58.5953, lng: 25.0136, name: 'Estonia' },
  'Latvia': { lat: 56.8796, lng: 24.6032, name: 'Latvia' },
  'Lithuania': { lat: 55.1694, lng: 23.8813, name: 'Lithuania' },
  'Ireland': { lat: 53.4129, lng: -8.2439, name: 'Ireland' },
  'Portugal': { lat: 39.3999, lng: -8.2245, name: 'Portugal' },
  'Greece': { lat: 39.0742, lng: 21.8243, name: 'Greece' },
  'Cyprus': { lat: 35.1264, lng: 33.4299, name: 'Cyprus' },
  'Malta': { lat: 35.9375, lng: 14.3754, name: 'Malta' },
  'Luxembourg': { lat: 49.8153, lng: 6.1296, name: 'Luxembourg' },

  // North America
  'United States': { lat: 39.8283, lng: -98.5795, name: 'United States' },
  'Canada': { lat: 56.1304, lng: -106.3468, name: 'Canada' },
  'Mexico': { lat: 23.6345, lng: -102.5528, name: 'Mexico' },

  // Asia Pacific
  'China': { lat: 35.8617, lng: 104.1954, name: 'China' },
  'Japan': { lat: 36.2048, lng: 138.2529, name: 'Japan' },
  'South Korea': { lat: 35.9078, lng: 127.7669, name: 'South Korea' },
  'India': { lat: 20.5937, lng: 78.9629, name: 'India' },
  'Australia': { lat: -25.2744, lng: 133.7751, name: 'Australia' },
  'New Zealand': { lat: -40.9006, lng: 174.8860, name: 'New Zealand' },
  'Singapore': { lat: 1.3521, lng: 103.8198, name: 'Singapore' },
  'Hong Kong': { lat: 22.3193, lng: 114.1694, name: 'Hong Kong' },
  'Taiwan': { lat: 23.6978, lng: 120.9605, name: 'Taiwan' },
  'Thailand': { lat: 15.8700, lng: 100.9925, name: 'Thailand' },
  'Malaysia': { lat: 4.2105, lng: 101.9758, name: 'Malaysia' },
  'Indonesia': { lat: -0.7893, lng: 113.9213, name: 'Indonesia' },
  'Philippines': { lat: 12.8797, lng: 121.7740, name: 'Philippines' },
  'Vietnam': { lat: 14.0583, lng: 108.2772, name: 'Vietnam' },

  // Other regions
  'United Kingdom': { lat: 55.3781, lng: -3.4360, name: 'United Kingdom' },
  'Brazil': { lat: -14.2350, lng: -51.9253, name: 'Brazil' },
  'Argentina': { lat: -38.4161, lng: -63.6167, name: 'Argentina' },
  'Chile': { lat: -35.6751, lng: -71.5430, name: 'Chile' },
  'South Africa': { lat: -30.5595, lng: 22.9375, name: 'South Africa' },
  'Nigeria': { lat: 9.0820, lng: 8.6753, name: 'Nigeria' },
  'Kenya': { lat: -0.0236, lng: 37.9062, name: 'Kenya' },
  'Egypt': { lat: 26.0975, lng: 30.0444, name: 'Egypt' },
  'Morocco': { lat: 31.6295, lng: -7.9811, name: 'Morocco' },
  'Turkey': { lat: 38.9637, lng: 35.2433, name: 'Turkey' },
  'Israel': { lat: 31.0461, lng: 34.8516, name: 'Israel' },
  'Saudi Arabia': { lat: 23.8859, lng: 45.0792, name: 'Saudi Arabia' },
  'United Arab Emirates': { lat: 23.4241, lng: 53.8478, name: 'United Arab Emirates' },
  'Russia': { lat: 61.5240, lng: 105.3188, name: 'Russia' },
};

// EU member countries
export const euCountries = [
  'Germany', 'France', 'Italy', 'Spain', 'Netherlands', 'Belgium', 'Austria',
  'Sweden', 'Denmark', 'Finland', 'Poland', 'Czech Republic', 'Hungary',
  'Romania', 'Bulgaria', 'Croatia', 'Slovenia', 'Slovakia', 'Estonia',
  'Latvia', 'Lithuania', 'Ireland', 'Portugal', 'Greece', 'Cyprus',
  'Malta', 'Luxembourg'
];

// NAFTA countries
export const naftaCountries = ['United States', 'Canada', 'Mexico'];

// ASEAN countries
export const aseanCountries = [
  'Thailand', 'Malaysia', 'Indonesia', 'Philippines', 'Vietnam', 'Singapore',
  'Brunei', 'Cambodia', 'Laos', 'Myanmar'
];

// Country name variations and aliases
export const countryAliases: Record<string, string> = {
  'EU': 'European Union',
  'Europe': 'European Union',
  'European Union': 'European Union',
  'USA': 'United States',
  'US': 'United States',
  'America': 'United States',
  'United States of America': 'United States',
  'UK': 'United Kingdom',
  'Britain': 'United Kingdom',
  'Great Britain': 'United Kingdom',
  'Deutschland': 'Germany',
  'Deutschland': 'Germany',
  'España': 'Spain',
  'Espagne': 'Spain',
  'Italia': 'Italy',
  'Italie': 'Italy',
  'Nederland': 'Netherlands',
  'Holland': 'Netherlands',
  'België': 'Belgium',
  'Belgique': 'Belgium',
  'Österreich': 'Austria',
  'Autriche': 'Austria',
  'Sverige': 'Sweden',
  'Suède': 'Sweden',
  'Danmark': 'Denmark',
  'Suomi': 'Finland',
  'Norge': 'Norway',
  'Schweiz': 'Switzerland',
  'Suisse': 'Switzerland',
  'Polska': 'Poland',
  'Česká republika': 'Czech Republic',
  'Magyarország': 'Hungary',
  'România': 'Romania',
  'България': 'Bulgaria',
  'Hrvatska': 'Croatia',
  'Slovenija': 'Slovenia',
  'Slovensko': 'Slovakia',
  'Eesti': 'Estonia',
  'Latvija': 'Latvia',
  'Lietuva': 'Lithuania',
  'Éire': 'Ireland',
  'Portugal': 'Portugal',
  'Ελλάδα': 'Greece',
  'Κύπρος': 'Cyprus',
  'Malta': 'Malta',
  'Luxembourg': 'Luxembourg',
  '中国': 'China',
  '日本': 'Japan',
  '대한민국': 'South Korea',
  'भारत': 'India',
  'Australia': 'Australia',
  'Aotearoa': 'New Zealand',
  '新加坡': 'Singapore',
  '香港': 'Hong Kong',
  '台灣': 'Taiwan',
  'ประเทศไทย': 'Thailand',
  'Malaysia': 'Malaysia',
  'Indonesia': 'Indonesia',
  'Pilipinas': 'Philippines',
  'Việt Nam': 'Vietnam',
  'Brasil': 'Brazil',
  'Argentina': 'Argentina',
  'Chile': 'Chile',
  'South Africa': 'South Africa',
  'Nigeria': 'Nigeria',
  'Kenya': 'Kenya',
  'مصر': 'Egypt',
  'المغرب': 'Morocco',
  'Türkiye': 'Turkey',
  'ישראל': 'Israel',
  'المملكة العربية السعودية': 'Saudi Arabia',
  'الإمارات العربية المتحدة': 'United Arab Emirates',
  'Россия': 'Russia',
};

// Get all countries that should show a regulation based on jurisdiction
export const getCountriesForRegulation = (jurisdiction: string, country: string): string[] => {
  const countries: string[] = [];
  
  // Handle specific country
  if (country && country !== 'Unknown' && country !== 'Global') {
    const normalizedCountry = countryAliases[country] || country;
    if (countryCoordinates[normalizedCountry as keyof typeof countryCoordinates]) {
      countries.push(normalizedCountry);
    }
  }
  
  // Handle jurisdiction-based mapping
  switch (jurisdiction?.toLowerCase()) {
    case 'eu':
    case 'europe':
    case 'european union':
      countries.push(...euCountries);
      break;
    case 'us':
    case 'usa':
    case 'united states':
    case 'north america':
      countries.push('United States');
      break;
    case 'canada':
      countries.push('Canada');
      break;
    case 'mexico':
      countries.push('Mexico');
      break;
    case 'nafta':
      countries.push(...naftaCountries);
      break;
    case 'asia':
    case 'asia pacific':
    case 'asian':
      countries.push('China', 'Japan', 'South Korea', 'India', 'Australia', 'Singapore', 'Hong Kong', 'Taiwan', 'Thailand', 'Malaysia', 'Indonesia', 'Philippines', 'Vietnam');
      break;
    case 'global':
    case 'international':
      // For global regulations, show in major countries
      countries.push('United States', 'China', 'Germany', 'United Kingdom', 'Japan', 'France', 'India', 'Brazil', 'Canada', 'Australia');
      break;
    default:
      // Try to match jurisdiction to a specific country
      const normalizedJurisdiction = countryAliases[jurisdiction] || jurisdiction;
      if (countryCoordinates[normalizedJurisdiction as keyof typeof countryCoordinates]) {
        countries.push(normalizedJurisdiction);
      }
  }
  
  return [...new Set(countries)]; // Remove duplicates
};
