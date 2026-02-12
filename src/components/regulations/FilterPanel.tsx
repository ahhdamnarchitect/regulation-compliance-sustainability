import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SearchFilters } from "@/types/regulation";

interface FilterPanelProps {
  filters: SearchFilters;
  onFilterChange: (key: keyof SearchFilters, value: string) => void;
}

export const FilterPanel = ({ filters, onFilterChange }: FilterPanelProps) => {
  const regions = ['All', 'Global', 'North America', 'Europe', 'Asia Pacific', 'Latin America', 'Africa'];
  const sectors = ['All', 'Finance', 'Energy', 'Consumer Goods', 'Technology', 'Healthcare'];
  const frameworks = ['All', 'CSRD', 'TCFD', 'ISSB', 'GRI', 'SEC', 'SASB'];
  const statuses = ['All', 'Proposed', 'Enacted'];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-6 bg-gray-50 rounded-lg">
      <div>
        <label className="text-sm font-medium text-gray-700 mb-2 block">Region</label>
        <Select value={filters.region} onValueChange={(value) => onFilterChange('region', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select region" />
          </SelectTrigger>
          <SelectContent>
            {regions.map((region) => (
              <SelectItem key={region} value={region.toLowerCase()}>
                {region}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="text-sm font-medium text-gray-700 mb-2 block">Sector</label>
        <Select value={filters.sector} onValueChange={(value) => onFilterChange('sector', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select sector" />
          </SelectTrigger>
          <SelectContent>
            {sectors.map((sector) => (
              <SelectItem key={sector} value={sector.toLowerCase()}>
                {sector}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="text-sm font-medium text-gray-700 mb-2 block">Framework</label>
        <Select value={filters.framework} onValueChange={(value) => onFilterChange('framework', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select framework" />
          </SelectTrigger>
          <SelectContent>
            {frameworks.map((framework) => (
              <SelectItem key={framework} value={framework.toLowerCase()}>
                {framework}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="text-sm font-medium text-gray-700 mb-2 block">Status</label>
        <Select value={filters.status} onValueChange={(value) => onFilterChange('status', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            {statuses.map((status) => (
              <SelectItem key={status} value={status === 'All' ? 'all' : status.toLowerCase()}>
                {status}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};