import { useMemo, useState, useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import type { Regulation } from '@/types/regulation';
import { getRegulationTitleSuggestions, getLocationSuggestions } from '@/lib/inquiryAutocomplete';

const MIN_CHARS = 1;
const MAX_RESULTS = 3;

export type InquiryAutocompleteVariant = 'regulation-title' | 'location';

export interface InquiryAutocompleteInputProps {
  id?: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  regulations: Regulation[];
  variant: InquiryAutocompleteVariant;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  inputClassName?: string;
}

export function InquiryAutocompleteInput({
  id,
  label,
  value,
  onChange,
  regulations,
  variant,
  placeholder,
  disabled = false,
  className = '',
  inputClassName = '',
}: InquiryAutocompleteInputProps) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const listId = `${id || 'inquiry-ac'}-listbox`;

  const suggestions = useMemo(() => {
    if (disabled || value.length < MIN_CHARS) return [];
    return variant === 'regulation-title'
      ? getRegulationTitleSuggestions(regulations, value, MAX_RESULTS)
      : getLocationSuggestions(regulations, value, MAX_RESULTS);
  }, [regulations, value, variant, disabled]);

  const shouldShow = !disabled && value.length >= MIN_CHARS && suggestions.length > 0 && showDropdown;

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);

  useEffect(() => {
    setHighlightedIndex(0);
  }, [suggestions.length, value]);

  const selectItem = (s: string) => {
    onChange(s);
    setShowDropdown(false);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (disabled) return;
    if (!shouldShow) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex((i) => (i < suggestions.length - 1 ? i + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex((i) => (i > 0 ? i - 1 : suggestions.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      selectItem(suggestions[highlightedIndex]);
    } else if (e.key === 'Escape') {
      setShowDropdown(false);
    }
  };

  return (
    <div className={`space-y-1.5 ${className}`} ref={wrapperRef}>
      <label htmlFor={id} className="text-sm font-medium text-earth-text">
        {label}
      </label>
      <div className="relative">
        <Input
          id={id}
          value={value}
          disabled={disabled}
          onChange={(e) => {
            onChange(e.target.value);
            setShowDropdown(true);
          }}
          onFocus={() => {
            if (!disabled && value.length >= MIN_CHARS && suggestions.length > 0) setShowDropdown(true);
          }}
          onKeyDown={onKeyDown}
          placeholder={placeholder}
          autoComplete="off"
          role="combobox"
          aria-expanded={shouldShow}
          aria-controls={listId}
          aria-autocomplete="list"
          className={`border-earth-sand focus-visible:ring-earth-primary ${inputClassName}`}
        />
        {shouldShow && (
          <ul
            id={listId}
            role="listbox"
            className="absolute left-0 right-0 top-full z-50 mt-1 max-h-48 overflow-y-auto rounded-md border border-earth-sand bg-popover shadow-md"
          >
            {suggestions.map((s, i) => (
              <li
                key={`${s}-${i}`}
                role="option"
                aria-selected={i === highlightedIndex}
                className={`cursor-pointer px-3 py-2.5 text-sm ${
                  i === highlightedIndex ? 'bg-earth-primary/10 text-earth-primary' : 'text-foreground hover:bg-muted'
                }`}
                onMouseEnter={() => setHighlightedIndex(i)}
                onMouseDown={(e) => {
                  e.preventDefault();
                  selectItem(s);
                }}
              >
                {s}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
