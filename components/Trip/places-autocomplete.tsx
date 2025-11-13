// components/ui/places-autocomplete.tsx
'use client'
import { Loader2 } from "lucide-react"
import { useLoadScript } from "@react-google-maps/api"
import { Input } from "@/components/ui/input"
import { useEffect, useRef, useState } from "react"

export function PlacesAutocomplete({
  label,
  onSelect,
}: {
  label: string
  onSelect: (address: string) => void
}) {
  const [searchValue, setSearchValue] = useState("")
  const autocompleteRef = useRef<google.maps.places.Autocomplete>()
  const inputRef = useRef<HTMLInputElement>(null)

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
    libraries: ["places"],
  })

  useEffect(() => {
    if (!isLoaded || !inputRef.current) return

    autocompleteRef.current = new window.google.maps.places.Autocomplete(
      inputRef.current,
      { types: ["geocode"] }
    )

    autocompleteRef.current.addListener("place_changed", () => {
      const place = autocompleteRef.current?.getPlace()
      if (place?.formatted_address) {
        onSelect(place.formatted_address)
        setSearchValue(place.formatted_address)
      }
    })
  }, [isLoaded, onSelect])

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">{label}</label>
      {!isLoaded ? (
        <div className="flex items-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Loading maps...</span>
        </div>
      ) : (
        <Input
          ref={inputRef}
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          placeholder="Search location..."
        />
      )}
    </div>
  )
}