// components/address-autocomplete.tsx
'use client'
import { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Loader2 } from 'lucide-react'
import { debounce } from '@/lib/utils'

export function AddressAutocomplete({
  value,
  onChange,
  placeholder = 'Search address...'
}: {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}) {
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const fetchSuggestions = async (query: string) => {
    if (query.length < 3) return
    setIsLoading(true)
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`
      )
      const data = await response.json()
      setSuggestions(data.map((item: any) => item.display_name))
    } finally {
      setIsLoading(false)
    }
  }

  const debouncedFetch = debounce(fetchSuggestions, 300)

  return (
    <div className="relative">
      <Input
        value={value}
        onChange={(e) => {
          onChange(e.target.value)
          debouncedFetch(e.target.value)
        }}
        placeholder={placeholder}
      />
      
      {(isLoading || suggestions.length > 0) && (
        <div className="absolute z-50 w-full mt-1 bg-background shadow-lg rounded-md border">
          {isLoading ? (
            <div className="p-2 text-sm flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              Searching...
            </div>
          ) : (
            suggestions.map((suggestion, index) => (
              <button
                key={index}
                type="button"
                onClick={() => {
                  onChange(suggestion)
                  setSuggestions([])
                }}
                className="w-full text-left p-2 hover:bg-accent text-sm transition-colors"
              >
                {suggestion}
              </button>
            ))
          )}
        </div>
      )}
    </div>
  )
}