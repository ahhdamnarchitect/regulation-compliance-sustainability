/**
 * Global location hierarchy for regulation mapping.
 * Used to place pins and classify regulations by region/country/state.
 * Based on ISO 3166-1 (countries) and ISO 3166-2 (subdivisions) where applicable.
 * Regulatory regions (EU, Asia-Pacific, etc.) align with common sustainability reporting scopes.
 */

export type LocationLevel = 'state' | 'country';

export type RegionCode =
  | 'North America'
  | 'South America'
  | 'EU'
  | 'Europe'
  | 'Asia-Pacific'
  | 'Asia'
  | 'Africa'
  | 'Middle East'
  | 'Oceania';

export interface LocationMeta {
  parentCountry?: string;
  region: RegionCode;
  level: LocationLevel;
}

// EU member states (27) – used for regulatory scope
const EU_MEMBER_COUNTRIES = new Set([
  'Austria', 'Belgium', 'Bulgaria', 'Croatia', 'Cyprus', 'Czech Republic', 'Czechia', 'Denmark',
  'Estonia', 'Finland', 'France', 'Germany', 'Greece', 'Hungary', 'Ireland', 'Italy', 'Latvia',
  'Lithuania', 'Luxembourg', 'Malta', 'Netherlands', 'Poland', 'Portugal', 'Romania', 'Slovakia',
  'Slovenia', 'Spain', 'Sweden',
]);

// All 50 US states + DC
const US_STATES = [
  'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut',
  'Delaware', 'District of Columbia', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois',
  'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts',
  'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada',
  'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota',
  'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota',
  'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia',
  'Wisconsin', 'Wyoming',
];

// Canadian provinces and territories
const CANADIAN_PROVINCES_TERRITORIES = [
  'Alberta', 'British Columbia', 'Manitoba', 'New Brunswick', 'Newfoundland and Labrador',
  'Northwest Territories', 'Nova Scotia', 'Nunavut', 'Ontario', 'Prince Edward Island',
  'Quebec', 'Saskatchewan', 'Yukon',
];

// German states (Bundesländer) – commonly used in sustainability regulation
const GERMAN_STATES = [
  'Baden-Württemberg', 'Bavaria', 'Berlin', 'Brandenburg', 'Bremen', 'Hamburg', 'Hesse',
  'Lower Saxony', 'Mecklenburg-Vorpommern', 'North Rhine-Westphalia', 'Rhineland-Palatinate',
  'Saarland', 'Saxony', 'Saxony-Anhalt', 'Schleswig-Holstein', 'Thuringia',
];

/** Normalized country name for hierarchy key (matches countryCoordinates where possible) */
const COUNTRY_NAME_ALIASES: Record<string, string> = {
  'United States of America': 'United States',
  'Czechia': 'Czech Republic',
  'Bolivia (Plurinational State of)': 'Bolivia',
  'Venezuela (Bolivarian Republic of)': 'Venezuela',
  'Iran (Islamic Republic of)': 'Iran',
  'Republic of Korea': 'South Korea',
  'Democratic People\'s Republic of Korea': 'North Korea',
  'Taiwan, Province of China': 'Taiwan',
  'Türkiye': 'Turkey',
  'Côte d\'Ivoire': 'Ivory Coast',
  'Brunei Darussalam': 'Brunei',
  'Cabo Verde': 'Cape Verde',
  'Eswatini': 'Swaziland',
  'Lao People\'s Democratic Republic': 'Laos',
  'Myanmar': 'Myanmar',
  'Republic of Moldova': 'Moldova',
  'Russian Federation': 'Russia',
  'Syrian Arab Republic': 'Syria',
  'United Republic of Tanzania': 'Tanzania',
  'United Kingdom of Great Britain and Northern Ireland': 'United Kingdom',
  'Viet Nam': 'Vietnam',
};

/** Countries with region (UN M49 / regulatory). Americas split into North America vs South America + Central America/Caribbean. */
const COUNTRY_REGIONS: Record<string, RegionCode> = {
  // North America
  'United States': 'North America',
  'Canada': 'North America',
  'Mexico': 'North America',
  'Greenland': 'North America',
  'Bermuda': 'North America',
  'Saint Pierre and Miquelon': 'North America',
  // Central America
  'Belize': 'North America',
  'Costa Rica': 'North America',
  'El Salvador': 'North America',
  'Guatemala': 'North America',
  'Honduras': 'North America',
  'Nicaragua': 'North America',
  'Panama': 'North America',
  // Caribbean
  'Antigua and Barbuda': 'North America',
  'Bahamas': 'North America',
  'Barbados': 'North America',
  'Cuba': 'North America',
  'Dominica': 'North America',
  'Dominican Republic': 'North America',
  'Grenada': 'North America',
  'Haiti': 'North America',
  'Jamaica': 'North America',
  'Saint Kitts and Nevis': 'North America',
  'Saint Lucia': 'North America',
  'Saint Vincent and the Grenadines': 'North America',
  'Trinidad and Tobago': 'North America',
  // South America
  'Argentina': 'South America',
  'Bolivia': 'South America',
  'Brazil': 'South America',
  'Chile': 'South America',
  'Colombia': 'South America',
  'Ecuador': 'South America',
  'Guyana': 'South America',
  'Paraguay': 'South America',
  'Peru': 'South America',
  'Suriname': 'South America',
  'Uruguay': 'South America',
  'Venezuela': 'South America',
  // Europe (non-EU overwritten below for EU members)
  'Albania': 'Europe',
  'Andorra': 'Europe',
  'Armenia': 'Europe',
  'Austria': 'EU',
  'Belgium': 'EU',
  'Bosnia and Herzegovina': 'Europe',
  'Bulgaria': 'EU',
  'Croatia': 'EU',
  'Cyprus': 'EU',
  'Czech Republic': 'EU',
  'Denmark': 'EU',
  'Estonia': 'EU',
  'Finland': 'EU',
  'France': 'EU',
  'Germany': 'EU',
  'Greece': 'EU',
  'Hungary': 'EU',
  'Iceland': 'Europe',
  'Ireland': 'EU',
  'Italy': 'EU',
  'Kosovo': 'Europe',
  'Latvia': 'EU',
  'Lithuania': 'EU',
  'Luxembourg': 'EU',
  'Malta': 'EU',
  'Moldova': 'Europe',
  'Monaco': 'Europe',
  'Montenegro': 'Europe',
  'Netherlands': 'EU',
  'North Macedonia': 'Europe',
  'Norway': 'Europe',
  'Poland': 'EU',
  'Portugal': 'EU',
  'Romania': 'EU',
  'Russia': 'Europe',
  'San Marino': 'Europe',
  'Serbia': 'Europe',
  'Slovakia': 'EU',
  'Slovenia': 'EU',
  'Spain': 'EU',
  'Sweden': 'EU',
  'Switzerland': 'Europe',
  'Turkey': 'Europe',
  'Ukraine': 'Europe',
  'United Kingdom': 'Europe',
  'Vatican City': 'Europe',
  // Asia-Pacific / Asia
  'Afghanistan': 'Asia',
  'Australia': 'Asia-Pacific',
  'Bangladesh': 'Asia-Pacific',
  'Bhutan': 'Asia-Pacific',
  'Brunei': 'Asia-Pacific',
  'Cambodia': 'Asia-Pacific',
  'China': 'Asia-Pacific',
  'Hong Kong': 'Asia-Pacific',
  'India': 'Asia-Pacific',
  'Indonesia': 'Asia-Pacific',
  'Japan': 'Asia-Pacific',
  'Laos': 'Asia-Pacific',
  'Macau': 'Asia-Pacific',
  'Malaysia': 'Asia-Pacific',
  'Maldives': 'Asia-Pacific',
  'Mongolia': 'Asia-Pacific',
  'Nepal': 'Asia-Pacific',
  'New Zealand': 'Oceania',
  'North Korea': 'Asia',
  'Pakistan': 'Asia',
  'Philippines': 'Asia-Pacific',
  'Singapore': 'Asia-Pacific',
  'South Korea': 'Asia-Pacific',
  'Sri Lanka': 'Asia-Pacific',
  'Taiwan': 'Asia-Pacific',
  'Thailand': 'Asia-Pacific',
  'Vietnam': 'Asia-Pacific',
  // Middle East (Western Asia)
  'Bahrain': 'Middle East',
  'Iran': 'Middle East',
  'Iraq': 'Middle East',
  'Israel': 'Middle East',
  'Jordan': 'Middle East',
  'Kuwait': 'Middle East',
  'Lebanon': 'Middle East',
  'Oman': 'Middle East',
  'Qatar': 'Middle East',
  'Saudi Arabia': 'Middle East',
  'Syria': 'Middle East',
  'United Arab Emirates': 'Middle East',
  'Yemen': 'Middle East',
  'Georgia': 'Middle East',
  'Azerbaijan': 'Middle East',
  // Africa
  'Algeria': 'Africa',
  'Angola': 'Africa',
  'Benin': 'Africa',
  'Botswana': 'Africa',
  'Burkina Faso': 'Africa',
  'Burundi': 'Africa',
  'Cameroon': 'Africa',
  'Cape Verde': 'Africa',
  'Central African Republic': 'Africa',
  'Chad': 'Africa',
  'Comoros': 'Africa',
  'Congo': 'Africa',
  'Democratic Republic of the Congo': 'Africa',
  'Djibouti': 'Africa',
  'Egypt': 'Africa',
  'Equatorial Guinea': 'Africa',
  'Eritrea': 'Africa',
  'Ethiopia': 'Africa',
  'Gabon': 'Africa',
  'Gambia': 'Africa',
  'Ghana': 'Africa',
  'Guinea': 'Africa',
  'Guinea-Bissau': 'Africa',
  'Ivory Coast': 'Africa',
  'Kenya': 'Africa',
  'Lesotho': 'Africa',
  'Liberia': 'Africa',
  'Libya': 'Africa',
  'Madagascar': 'Africa',
  'Malawi': 'Africa',
  'Mali': 'Africa',
  'Mauritania': 'Africa',
  'Mauritius': 'Africa',
  'Morocco': 'Africa',
  'Mozambique': 'Africa',
  'Namibia': 'Africa',
  'Niger': 'Africa',
  'Nigeria': 'Africa',
  'Rwanda': 'Africa',
  'Sao Tome and Principe': 'Africa',
  'Senegal': 'Africa',
  'Seychelles': 'Africa',
  'Sierra Leone': 'Africa',
  'Somalia': 'Africa',
  'South Africa': 'Africa',
  'South Sudan': 'Africa',
  'Sudan': 'Africa',
  'Swaziland': 'Africa',
  'Tanzania': 'Africa',
  'Togo': 'Africa',
  'Tunisia': 'Africa',
  'Uganda': 'Africa',
  'Zambia': 'Africa',
  'Zimbabwe': 'Africa',
  // Oceania (beyond Asia-Pacific)
  'Fiji': 'Oceania',
  'Papua New Guinea': 'Oceania',
  'Solomon Islands': 'Oceania',
  'Vanuatu': 'Oceania',
  'Samoa': 'Oceania',
  'Kiribati': 'Oceania',
  'Micronesia': 'Oceania',
  'Marshall Islands': 'Oceania',
  'Palau': 'Oceania',
  'Tonga': 'Oceania',
  'Tuvalu': 'Oceania',
  'Nauru': 'Oceania',
};

function normalizeCountryName(name: string): string {
  return COUNTRY_NAME_ALIASES[name] ?? name;
}

/** Build the full location hierarchy: countries first, then subdivisions. */
function buildLocationHierarchy(): Record<string, LocationMeta> {
  const out: Record<string, LocationMeta> = {};

  // 1. Countries: use COUNTRY_REGIONS; EU members get region EU
  for (const [country, region] of Object.entries(COUNTRY_REGIONS)) {
    const normalized = normalizeCountryName(country);
    const meta: LocationMeta = { region, level: 'country' };
    if (EU_MEMBER_COUNTRIES.has(country) || EU_MEMBER_COUNTRIES.has(normalized)) {
      meta.region = 'EU';
    }
    out[normalized] = meta;
    if (normalized !== country) out[country] = meta;
  }

  // Ensure Czechia and Czech Republic both point to same meta
  if (out['Czech Republic'] && !out['Czechia']) out['Czechia'] = out['Czech Republic'];

  // 2. US states
  for (const state of US_STATES) {
    out[state] = { parentCountry: 'United States', region: 'North America', level: 'state' };
  }

  // 3. Canadian provinces/territories
  for (const prov of CANADIAN_PROVINCES_TERRITORIES) {
    out[prov] = { parentCountry: 'Canada', region: 'North America', level: 'state' };
  }

  // 4. German states
  for (const state of GERMAN_STATES) {
    out[state] = { parentCountry: 'Germany', region: 'EU', level: 'state' };
  }

  return out;
}

export const locationHierarchy: Record<string, LocationMeta> = buildLocationHierarchy();

/** Get ordered ancestors (parent country → region → Global) for a location. */
export function getAncestors(locationName: string): string[] {
  const meta = locationHierarchy[locationName];
  if (!meta) return ['Global'];

  const ancestors: string[] = [];
  if (meta.parentCountry) ancestors.push(meta.parentCountry);
  if (meta.region !== 'Global') ancestors.push(meta.region);
  ancestors.push('Global');
  return ancestors;
}

/** Get the region code for a location, or undefined if unknown. */
export function getRegionForLocation(locationName: string): RegionCode | undefined {
  return locationHierarchy[locationName]?.region;
}

/** Check if a location belongs to a given region (including via parent). */
export function isLocationInRegion(locationName: string, region: RegionCode): boolean {
  const meta = locationHierarchy[locationName];
  if (!meta) return false;
  if (meta.region === region) return true;
  if (meta.parentCountry) {
    const parentMeta = locationHierarchy[meta.parentCountry];
    return parentMeta?.region === region ?? false;
  }
  return false;
}

/** Get all location names that belong to a region (countries + states in that region). */
export function getLocationsInRegion(region: RegionCode): string[] {
  return Object.entries(locationHierarchy)
    .filter(([, meta]) => meta.region === region || (meta.parentCountry && locationHierarchy[meta.parentCountry]?.region === region))
    .map(([name]) => name);
}

/** Check if a string is a known location in the hierarchy. */
export function isKnownLocation(locationName: string): boolean {
  return locationName in locationHierarchy;
}

/** Names that count as "region" level for filter clear scope (sidebar Region section). */
export const REGION_LEVEL_NAMES: string[] = [
  'Global', 'Africa', 'Asia', 'Asia-Pacific', 'EU', 'Europe', 'Middle East', 'North America', 'Oceania', 'South America',
].sort((a, b) => a.localeCompare(b));

/** All country names in the hierarchy (for filter clear scope). */
export function getCountryNames(): string[] {
  return Object.entries(locationHierarchy)
    .filter(([, meta]) => meta.level === 'country')
    .map(([name]) => name);
}

/** All state/subdivision names in the hierarchy (for filter clear scope). */
export function getStateNames(): string[] {
  return Object.entries(locationHierarchy)
    .filter(([, meta]) => meta.level === 'state')
    .map(([name]) => name);
}
