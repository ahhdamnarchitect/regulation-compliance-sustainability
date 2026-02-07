export interface Regulation {
  id: string;
  title: string;
  jurisdiction: string;
  country: string;
  sector: string;
  framework: string;
  description: string;
  summary?: string;
  complianceDeadline?: string;
  reporting_date?: string;
  status: 'proposed' | 'active' | 'repealed';
  source_url?: string;
  tags: string[];
  dateAdded?: string;
  created_at?: string;
  updated_at?: string;
}

export interface User {
  id: string;
  email: string;
  full_name?: string;
  role: 'admin' | 'user';
  bookmarks: string[];
  plan?: 'free' | 'professional' | 'enterprise';
  region?: string;
  trial_used_at?: string | null;
  created_at?: string;
}

export interface SearchFilters {
  query: string;
  region: string[];
  sector: string[];
  framework: string[];
  status: string[];
}

export interface DatabaseRegulation {
  id: number;
  title: string | null;
  region: string | null;
  country: string | null;
  framework: string | null;
  sector: string | null;
  description: string | null;
  reporting_year: string | number | null;
  status: string | null;
  source_url: string | null;
  tags: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface ExportOptions {
  format: 'csv' | 'pdf';
  includeBookmarks?: boolean;
  filters?: SearchFilters;
}