import { Regulation } from '@/types/regulation';

export const globalRegulations: Regulation[] = [
  // EU Regulations
  {
    id: 'eu-1',
    title: 'Corporate Sustainability Reporting Directive (CSRD)',
    jurisdiction: 'EU',
    country: 'European Union',
    sector: 'All Sectors',
    framework: 'CSRD',
    description: 'Requires large companies to report on sustainability matters including environmental, social and governance factors.',
    complianceDeadline: '2025-01-01',
    status: 'active',
    source_url: 'https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32022L2464',
    tags: ['sustainability', 'reporting', 'ESG', 'EU'],
    dateAdded: '2024-01-15'
  },
  {
    id: 'eu-2',
    title: 'EU Taxonomy Regulation',
    jurisdiction: 'EU',
    country: 'European Union',
    sector: 'Finance',
    framework: 'EU Taxonomy',
    description: 'Classification system for environmentally sustainable economic activities.',
    complianceDeadline: '2022-01-01',
    status: 'active',
    source_url: 'https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32020R0852',
    tags: ['taxonomy', 'sustainable finance', 'EU'],
    dateAdded: '2024-01-15'
  },
  {
    id: 'eu-3',
    title: 'Sustainable Finance Disclosure Regulation (SFDR)',
    jurisdiction: 'EU',
    country: 'European Union',
    sector: 'Finance',
    framework: 'SFDR',
    description: 'Requires financial market participants to disclose sustainability risks and impacts.',
    complianceDeadline: '2021-03-10',
    status: 'active',
    source_url: 'https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32019R2088',
    tags: ['sustainable finance', 'disclosure', 'EU'],
    dateAdded: '2024-01-15'
  },

  // US Regulations
  {
    id: 'us-1',
    title: 'SEC Climate Disclosure Rules',
    jurisdiction: 'US',
    country: 'United States',
    sector: 'Finance',
    framework: 'SEC',
    description: 'Requires public companies to disclose climate-related risks and greenhouse gas emissions.',
    complianceDeadline: '2025-03-31',
    status: 'active',
    source_url: 'https://www.sec.gov/rules/final/2024/33-11275.pdf',
    tags: ['climate', 'disclosure', 'emissions', 'SEC'],
    dateAdded: '2024-03-06'
  },
  {
    id: 'us-2',
    title: 'California Climate Corporate Accountability Act (SB 253)',
    jurisdiction: 'US',
    country: 'United States',
    sector: 'All Sectors',
    framework: 'California SB 253',
    description: 'Requires large companies doing business in California to disclose greenhouse gas emissions.',
    complianceDeadline: '2026-01-01',
    status: 'active',
    source_url: 'https://leginfo.legislature.ca.gov/faces/billTextClient.xhtml?bill_id=202320240SB253',
    tags: ['climate', 'emissions', 'California', 'disclosure'],
    dateAdded: '2024-01-15'
  },

  // UK Regulations
  {
    id: 'uk-1',
    title: 'UK TCFD Reporting Requirements',
    jurisdiction: 'UK',
    country: 'United Kingdom',
    sector: 'Finance',
    framework: 'TCFD',
    description: 'Mandatory climate-related financial disclosures for large UK companies.',
    complianceDeadline: '2024-04-06',
    status: 'active',
    source_url: 'https://www.gov.uk/government/consultations/climate-related-financial-disclosure-regulations',
    tags: ['TCFD', 'climate', 'UK', 'disclosure'],
    dateAdded: '2022-10-27'
  },

  // Global Standards
  {
    id: 'global-1',
    title: 'ISSB Sustainability Disclosure Standards',
    jurisdiction: 'Global',
    country: 'Global',
    sector: 'All Sectors',
    framework: 'ISSB',
    description: 'Global baseline for sustainability-related financial information disclosure.',
    complianceDeadline: '2024-12-31',
    status: 'active',
    source_url: 'https://www.ifrs.org/issued-standards/issb-standards/',
    tags: ['ISSB', 'sustainability', 'financial', 'global'],
    dateAdded: '2023-06-26'
  },

  // Additional EU Countries
  {
    id: 'de-1',
    title: 'German Supply Chain Due Diligence Act',
    jurisdiction: 'EU',
    country: 'Germany',
    sector: 'All Sectors',
    framework: 'German Supply Chain Act',
    description: 'Requires companies to conduct due diligence on human rights and environmental risks in supply chains.',
    complianceDeadline: '2023-01-01',
    status: 'active',
    source_url: 'https://www.bmj.de/SharedDocs/Gesetzgebungsverfahren/Dokumente/Lieferkettensorgfaltspflichtengesetz.pdf',
    tags: ['supply chain', 'human rights', 'Germany', 'due diligence'],
    dateAdded: '2024-01-15'
  },
  {
    id: 'fr-1',
    title: 'French Corporate Duty of Vigilance Law',
    jurisdiction: 'EU',
    country: 'France',
    sector: 'All Sectors',
    framework: 'French Vigilance Law',
    description: 'Requires large companies to establish vigilance plans for human rights and environmental risks.',
    complianceDeadline: '2017-03-27',
    status: 'active',
    source_url: 'https://www.legifrance.gouv.fr/eli/loi/2017/3/27/2017-399/jo/texte',
    tags: ['vigilance', 'human rights', 'France', 'supply chain'],
    dateAdded: '2024-01-15'
  },
  {
    id: 'nl-1',
    title: 'Dutch Child Labor Due Diligence Act',
    jurisdiction: 'EU',
    country: 'Netherlands',
    sector: 'All Sectors',
    framework: 'Dutch Child Labor Act',
    description: 'Requires companies to identify and prevent child labor in supply chains.',
    complianceDeadline: '2022-01-01',
    status: 'active',
    source_url: 'https://wetten.overheid.nl/BWBR0041273/2022-01-01',
    tags: ['child labor', 'supply chain', 'Netherlands', 'due diligence'],
    dateAdded: '2024-01-15'
  },

  // Asia-Pacific
  {
    id: 'au-1',
    title: 'Australian Modern Slavery Act',
    jurisdiction: 'Asia-Pacific',
    country: 'Australia',
    sector: 'All Sectors',
    framework: 'Australian Modern Slavery Act',
    description: 'Requires large companies to report on modern slavery risks in operations and supply chains.',
    complianceDeadline: '2019-01-01',
    status: 'active',
    source_url: 'https://www.legislation.gov.au/Details/C2018A00153',
    tags: ['modern slavery', 'human rights', 'Australia', 'supply chain'],
    dateAdded: '2024-01-15'
  },
  {
    id: 'jp-1',
    title: 'Japan Corporate Governance Code',
    jurisdiction: 'Asia-Pacific',
    country: 'Japan',
    sector: 'All Sectors',
    framework: 'Japanese Corporate Governance',
    description: 'Enhanced corporate governance requirements including sustainability disclosures.',
    complianceDeadline: '2021-06-01',
    status: 'active',
    source_url: 'https://www.fsa.go.jp/en/policy/cg/20210601.html',
    tags: ['corporate governance', 'sustainability', 'Japan', 'disclosure'],
    dateAdded: '2024-01-15'
  },
  {
    id: 'sg-1',
    title: 'Singapore Green Finance Taxonomy',
    jurisdiction: 'Asia-Pacific',
    country: 'Singapore',
    sector: 'Finance',
    framework: 'Singapore Green Taxonomy',
    description: 'Classification system for green economic activities in Singapore.',
    complianceDeadline: '2022-12-01',
    status: 'active',
    source_url: 'https://www.mas.gov.sg/schemes-and-initiatives/green-finance-taxonomy',
    tags: ['green finance', 'taxonomy', 'Singapore', 'sustainable finance'],
    dateAdded: '2024-01-15'
  },

  // Additional Countries
  {
    id: 'ca-1',
    title: 'Canadian Net-Zero Emissions Accountability Act',
    jurisdiction: 'North America',
    country: 'Canada',
    sector: 'All Sectors',
    framework: 'Canadian Net-Zero Act',
    description: 'Establishes national targets for net-zero emissions by 2050.',
    complianceDeadline: '2021-06-29',
    status: 'active',
    source_url: 'https://laws-lois.justice.gc.ca/eng/acts/N-23.7/',
    tags: ['net-zero', 'emissions', 'Canada', 'climate'],
    dateAdded: '2024-01-15'
  },
  {
    id: 'br-1',
    title: 'Brazilian Green Taxonomy',
    jurisdiction: 'South America',
    country: 'Brazil',
    sector: 'Finance',
    framework: 'Brazilian Green Taxonomy',
    description: 'Classification system for sustainable economic activities in Brazil.',
    complianceDeadline: '2023-01-01',
    status: 'active',
    source_url: 'https://www.bcb.gov.br/estabilidadefinanceira/taxonomiaverde',
    tags: ['green taxonomy', 'sustainable finance', 'Brazil', 'classification'],
    dateAdded: '2024-01-15'
  },
  {
    id: 'in-1',
    title: 'Indian Business Responsibility and Sustainability Reporting',
    jurisdiction: 'Asia-Pacific',
    country: 'India',
    sector: 'All Sectors',
    framework: 'Indian BRSR',
    description: 'Mandatory sustainability reporting for listed companies in India.',
    complianceDeadline: '2022-04-01',
    status: 'active',
    source_url: 'https://www.sebi.gov.in/legal/circulars/may-2021/business-responsibility-and-sustainability-reporting-by-listed-entities_50046.html',
    tags: ['sustainability reporting', 'ESG', 'India', 'disclosure'],
    dateAdded: '2024-01-15'
  },

  // More EU Countries
  {
    id: 'it-1',
    title: 'Italian Green Bond Framework',
    jurisdiction: 'EU',
    country: 'Italy',
    sector: 'Finance',
    framework: 'Italian Green Bond',
    description: 'Framework for issuing green bonds in Italy.',
    complianceDeadline: '2021-01-01',
    status: 'active',
    source_url: 'https://www.mef.gov.it/en/focus/the-italian-green-bond-framework',
    tags: ['green bonds', 'sustainable finance', 'Italy', 'bonds'],
    dateAdded: '2024-01-15'
  },
  {
    id: 'es-1',
    title: 'Spanish Climate Change and Energy Transition Law',
    jurisdiction: 'EU',
    country: 'Spain',
    sector: 'All Sectors',
    framework: 'Spanish Climate Law',
    description: 'Establishes framework for climate action and energy transition in Spain.',
    complianceDeadline: '2021-05-22',
    status: 'active',
    source_url: 'https://www.boe.es/eli/es/l/2021/05/20/7',
    tags: ['climate change', 'energy transition', 'Spain', 'climate'],
    dateAdded: '2024-01-15'
  },
  {
    id: 'se-1',
    title: 'Swedish Climate Act',
    jurisdiction: 'EU',
    country: 'Sweden',
    sector: 'All Sectors',
    framework: 'Swedish Climate Act',
    description: 'Establishes climate policy framework and net-zero targets for Sweden.',
    complianceDeadline: '2018-01-01',
    status: 'active',
    source_url: 'https://www.riksdagen.se/sv/dokument-lagar/dokument/svensk-forfattningssamling/klimatlag-2018805_sfs-2018-805',
    tags: ['climate act', 'net-zero', 'Sweden', 'climate policy'],
    dateAdded: '2024-01-15'
  },

  // Additional Global Standards
  {
    id: 'global-2',
    title: 'GRI Universal Standards',
    jurisdiction: 'Global',
    country: 'Global',
    sector: 'All Sectors',
    framework: 'GRI',
    description: 'Global standards for sustainability reporting across all sectors.',
    complianceDeadline: '2023-01-01',
    status: 'active',
    source_url: 'https://www.globalreporting.org/standards/',
    tags: ['GRI', 'sustainability reporting', 'global', 'standards'],
    dateAdded: '2024-01-15'
  },
  {
    id: 'global-3',
    title: 'SASB Standards',
    jurisdiction: 'Global',
    country: 'Global',
    sector: 'All Sectors',
    framework: 'SASB',
    description: 'Industry-specific sustainability accounting standards.',
    complianceDeadline: '2018-01-01',
    status: 'active',
    source_url: 'https://www.sasb.org/standards/',
    tags: ['SASB', 'sustainability accounting', 'industry-specific', 'global'],
    dateAdded: '2024-01-15'
  }
];

// Export by region for easy filtering
export const regulationsByRegion = {
  'EU': globalRegulations.filter(r => r.jurisdiction === 'EU'),
  'US': globalRegulations.filter(r => r.jurisdiction === 'US'),
  'Asia-Pacific': globalRegulations.filter(r => r.jurisdiction === 'Asia-Pacific'),
  'Global': globalRegulations.filter(r => r.jurisdiction === 'Global'),
  'North America': globalRegulations.filter(r => r.jurisdiction === 'North America'),
  'South America': globalRegulations.filter(r => r.jurisdiction === 'South America')
};

// Export by framework
export const regulationsByFramework = {
  'CSRD': globalRegulations.filter(r => r.framework === 'CSRD'),
  'TCFD': globalRegulations.filter(r => r.framework === 'TCFD'),
  'ISSB': globalRegulations.filter(r => r.framework === 'ISSB'),
  'GRI': globalRegulations.filter(r => r.framework === 'GRI'),
  'SASB': globalRegulations.filter(r => r.framework === 'SASB')
};

