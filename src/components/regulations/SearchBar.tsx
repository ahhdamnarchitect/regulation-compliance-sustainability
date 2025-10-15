import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Loader2 } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSearch: () => void;
  loading?: boolean;
}

export const SearchBar = ({ value, onChange, onSearch, loading = false }: SearchBarProps) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onSearch();
    }
  };

  return (
    <div className="relative max-w-2xl mx-auto">
      <div className={`relative transition-all duration-200 ${isFocused ? 'scale-105' : ''}`}>
        <Input
          type="text"
          placeholder="Search regulations by title, description, or keywords..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyPress={handleKeyPress}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className="pr-12 h-12 text-lg"
          disabled={loading}
        />
        <Button
          onClick={onSearch}
          disabled={loading || !value.trim()}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 px-3"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Search className="w-4 h-4" />
          )}
        </Button>
      </div>
    </div>
  );
};