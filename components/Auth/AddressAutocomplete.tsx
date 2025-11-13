"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Loader2, Home, Check } from "lucide-react";
import { Input } from "../ui/input";
import { cn } from "@/lib/utils";
import {
  fetchAddressSuggestions,
  formatSuggestionDisplay,
  parseAddressComponents,
  debounce,
  type AddressSuggestion,
} from "@/lib/geoapify/autocomplete";

interface AddressAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  onSelect?: (address: ReturnType<typeof parseAddressComponents>) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  error?: boolean;
}

export function AddressAutocomplete({
  value,
  onChange,
  onSelect,
  placeholder = "Start typing your address...",
  className,
  disabled = false,
  error = false,
}: AddressAutocompleteProps) {
  const [suggestions, setSuggestions] = useState<AddressSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [manualInput, setManualInput] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Debounced search function
  const debouncedSearch = useRef(
    debounce(async (query: string) => {
      if (!query || query.length < 3 || manualInput) {
        setSuggestions([]);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const results = await fetchAddressSuggestions(query, {
          limit: 5,
        });
        setSuggestions(results);
        setShowDropdown(results.length > 0);
      } catch (error) {
        console.error("Address autocomplete error:", error);
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    }, 400)
  ).current;

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);
    setManualInput(false);
    setSelectedIndex(-1);
    debouncedSearch(newValue);
  };

  // Handle suggestion selection
  const handleSelect = (suggestion: AddressSuggestion) => {
    const formatted = formatSuggestionDisplay(suggestion);
    onChange(formatted);
    setShowDropdown(false);
    setSuggestions([]);
    setManualInput(true);

    if (onSelect) {
      const parsed = parseAddressComponents(suggestion);
      onSelect(parsed);
    }
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showDropdown || suggestions.length === 0) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case "Enter":
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
          handleSelect(suggestions[selectedIndex]);
        }
        break;
      case "Escape":
        setShowDropdown(false);
        setSelectedIndex(-1);
        break;
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative w-full">
      <div className="relative group">
        <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 transition-colors group-focus-within:text-blue-500" />
        <Input
          ref={inputRef}
          type="text"
          value={value}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (suggestions.length > 0) setShowDropdown(true);
          }}
          placeholder={placeholder}
          disabled={disabled}
          className={cn(
            "pl-10 pr-10 h-12 border-slate-200 dark:border-slate-700",
            "focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 dark:focus:border-blue-400",
            "transition-all duration-200",
            "text-base placeholder:text-slate-500 dark:placeholder:text-slate-400",
            error && "border-red-300 focus:ring-red-400/20 focus:border-red-400",
            className
          )}
          autoComplete="off"
        />
        {isLoading && (
          <Loader2 className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-slate-400" />
        )}
      </div>

      {/* Dropdown with suggestions */}
      <AnimatePresence>
        {showDropdown && suggestions.length > 0 && (
          <motion.div
            ref={dropdownRef}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            className="absolute z-50 w-full mt-2 bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden"
          >
            <div className="py-1">
              {suggestions.map((suggestion, index) => (
                <button
                  key={suggestion.placeId || index}
                  type="button"
                  onClick={() => handleSelect(suggestion)}
                  className={cn(
                    "w-full px-4 py-4 text-left flex items-start gap-3 transition-colors min-h-[56px]",
                    "hover:bg-blue-50 dark:hover:bg-blue-900/20",
                    "focus:bg-blue-50 dark:focus:bg-blue-900/20 focus:outline-none",
                    selectedIndex === index &&
                      "bg-blue-50 dark:bg-blue-900/20"
                  )}
                  onMouseEnter={() => setSelectedIndex(index)}
                >
                  <div className="flex-shrink-0 mt-1">
                    <div className="h-6 w-6 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                      <Home className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">
                      {suggestion.addressLine1 || suggestion.formatted}
                    </p>
                    {suggestion.addressLine2 && (
                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
                        {suggestion.addressLine2}
                      </p>
                    )}
                    <p className="text-xs text-slate-400 dark:text-slate-500 truncate mt-0.5">
                      {[suggestion.city, suggestion.country]
                        .filter(Boolean)
                        .join(", ")}
                    </p>
                  </div>
                  {selectedIndex === index && (
                    <Check className="flex-shrink-0 h-4 w-4 text-blue-600 dark:text-blue-400 mt-1" />
                  )}
                </button>
              ))}
            </div>
            <div className="px-4 py-2 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-200 dark:border-slate-700">
              <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                Powered by Geoapify
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Manual entry hint */}
      {value && !manualInput && suggestions.length === 0 && !isLoading && value.length >= 3 && (
        <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
          No suggestions found. You can enter your address manually.
        </p>
      )}
    </div>
  );
}
