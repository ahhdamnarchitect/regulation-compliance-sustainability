import { useState, useMemo, useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import type { Regulation } from '@/types/regulation';

const MIN_CHARS = 2;
const MAX_SUGGESTIONS = 7;

function buildSuggestions(regulations: Regulation[], query: string): string[] {
  if (!query || query.length < MIN_CHARS) return [];
  const q = query.toLowerCase().trim();
  const seen = new Set<string>();
  const out: string[] = [];

  // Add matching regulation titles (dedupe by title)
  for (const r of regulations) {
    if (out.length >= MAX_SUGGESTIONS) break;
    const title = (r.title || '').trim();
    if (title && !seen.has(title) && title.toLowerCase().includes(q)) {
      seen.add(title);
      out.push(title);
    }
  }

  // Add distinct frameworks that match
  const frameworks = [...new Set(regulations.map((r) => (r.framework || '').trim()).filter(Boolean))];
  for (const fw of frameworks) {
    if (out.length >= MAX_SUGGESTIONS) break;
    if (!seen.has(fw) && fw.toLowerCase().includes(q)) {
      seen.add(fw);
      out.push(fw);
    }
  }

  // Add distinct jurisdictions/countries that match
  const locations = new Set<string>();
  for (const r of regulations) {
    if ((r.jurisdiction || '').trim()) locations.add((r.jurisdiction || '').trim());
    if ((r.country || '').trim()) locations.add((r.country || '').trim());
  }
  for (const loc of locations) {
    if (out.length >= MAX_SUGGESTIONS) break;
    if (!seen.has(loc) && loc.toLowerCase().includes(q)) {
      seen.add(loc);
      out.push(loc);
    }
  }

  return out.slice(0, MAX_SUGGESTIONS);
}

export interface SearchInputWithSuggestionsProps {
  value: string;
  onChange: (value: string) => void;
  onSearch: (term?: string) => void;
  placeholder?: string;
  regulations: Regulation[];
  className?: string;
  inputClassName?: string;
  minChars?: number;
  maxSuggestions?: number;
}

export function SearchInputWithSuggestions({
  value,
  onChange,
  onSearch,
  placeholder = 'Search regulations...',
  regulations,
  className = '',
  inputClassName = '',
  minChars = MIN_CHARS,
  maxSuggestions = MAX_SUGGESTIONS,
}: SearchInputWithSuggestionsProps) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const suggestions = useMemo(
    () => buildSuggestions(regulations, value).slice(0, maxSuggestions),
    [regulations, value, maxSuggestions]
  );

  const shouldShowDropdown = value.length >= minChars && suggestions.length > 0 && showDropdown;

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Reset highlight when suggestions change
  useEffect(() => {
    setHighlightedIndex(0);
  }, [suggestions.length, value]);

  const handleSelect = (suggestion: string) => {
    onChange(suggestion);
    setShowDropdown(false);
    onSearch(suggestion);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!shouldShowDropdown) {
      if (e.key === 'Enter') onSearch();
      return;
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex((i) => (i < suggestions.length - 1 ? i + 1 : 0));
      return;
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex((i) => (i > 0 ? i - 1 : suggestions.length - 1));
      return;
    }
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSelect(suggestions[highlightedIndex]);
      return;
    }
    if (e.key === 'Escape') {
      setShowDropdown(false);
    }
  };

  return (
    <div className={`relative flex-1 ${className}`} ref={wrapperRef}>
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-earth-text/60 w-4 h-4 pointer-events-none z-10" />
      <Input
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          setShowDropdown(true);
        }}
        onFocus={() => value.length >= minChars && suggestions.length > 0 && setShowDropdown(true)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className={`pl-10 ${inputClassName}`}
        autoComplete="off"
        role="combobox"
        aria-expanded={shouldShowDropdown}
        aria-autocomplete="list"
        aria-controls="search-suggestions-list"
        id="search-suggestions-input"
      />
      {shouldShowDropdown && (
        <ul
          id="search-suggestions-list"
          role="listbox"
          className="absolute left-0 right-0 top-full mt-1 bg-white border border-earth-sand rounded-md shadow-lg z-50 max-h-56 overflow-y-auto"
        >
          {suggestions.map((s, i) => (
            <li
              key={`${s}-${i}`}
              role="option"
              aria-selected={i === highlightedIndex}
              className={`px-3 py-2.5 text-sm cursor-pointer transition-colors ${
                i === highlightedIndex ? 'bg-earth-primary/10 text-earth-primary' : 'text-earth-text hover:bg-earth-sand/50'
              }`}
              onMouseEnter={() => setHighlightedIndex(i)}
              onMouseDown={(e) => {
                e.preventDefault();
                handleSelect(s);
              }}
            >
              {s}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
