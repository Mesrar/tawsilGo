"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { MapContainer, TileLayer, Circle, Polygon, useMapEvents } from "react-leaflet"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import "leaflet-draw/dist/leaflet.draw.css"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

// Fix Leaflet icon issues
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
})

function MapEventHandler({ onLocationFound }: { onLocationFound: (latlng: L.LatLng) => void }) {
  const map = useMapEvents({
    locationfound(e) {
      onLocationFound(e.latlng)
      map.flyTo(e.latlng, map.getZoom())
    },
  })

  useEffect(() => {
    map.locate()
  }, [map])

  return null
}

export function ServiceZoneManager() {
  const [center, setCenter] = useState<L.LatLng | null>(null)
  const [radius, setRadius] = useState(10)
  const [mode, setMode] = useState<"radius" | "polygon">("radius")
  const [polygonPoints, setPolygonPoints] = useState<L.LatLng[]>([])
  const [zoneType, setZoneType] = useState<"pickup" | "delivery">("pickup")
  const mapRef = useRef<L.Map | null>(null)

  const handleLocationFound = (latlng: L.LatLng) => {
    setCenter(latlng)
  }

  const handleMapClick = (e: L.LeafletMouseEvent) => {
    if (mode === "polygon") {
      setPolygonPoints((prev) => [...prev, e.latlng])
    }
  }

  const clearPolygon = () => {
    setPolygonPoints([])
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">Service Zone Management</h2>
      <div className="flex space-x-4 items-center">
        <ToggleGroup type="single" value={mode} onValueChange={(value) => setMode(value as "radius" | "polygon")}>
          <ToggleGroupItem value="radius">Radius</ToggleGroupItem>
          <ToggleGroupItem value="polygon">Polygon</ToggleGroupItem>
        </ToggleGroup>
        <ToggleGroup
          type="single"
          value={zoneType}
          onValueChange={(value) => setZoneType(value as "pickup" | "delivery")}
        >
          <ToggleGroupItem
            value="pickup"
            className="bg-green-100 data-[state=on]:bg-green-500 data-[state=on]:text-white"
          >
            Pickup
          </ToggleGroupItem>
          <ToggleGroupItem
            value="delivery"
            className="bg-blue-100 data-[state=on]:bg-blue-500 data-[state=on]:text-white"
          >
            Delivery
          </ToggleGroupItem>
        </ToggleGroup>
      </div>
      {mode === "radius" && (
        <div className="flex items-center space-x-4">
          <Label htmlFor="radius-slider">Radius: {radius} km</Label>
          <Slider
            id="radius-slider"
            min={5}
            max={50}
            step={1}
            value={[radius]}
            onValueChange={(value) => setRadius(value[0])}
            className="w-[200px]"
          />
        </div>
      )}
      {mode === "polygon" && <Button onClick={clearPolygon}>Clear Polygon</Button>}
      <div className="h-[500px] w-full">
        <MapContainer center={[51.505, -0.09]} zoom={13} style={{ height: "100%", width: "100%" }} ref={mapRef}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <MapEventHandler onLocationFound={handleLocationFound} />
          {center && mode === "radius" && (
            <Circle
              center={center}
              radius={radius * 1000}
              pathOptions={{ color: zoneType === "pickup" ? "green" : "blue" }}
            />
          )}
          {mode === "polygon" && polygonPoints.length > 2 && (
            <Polygon positions={polygonPoints} pathOptions={{ color: zoneType === "pickup" ? "green" : "blue" }} />
          )}
          {mapRef.current && (
            <div
              onClick={(e: React.MouseEvent) => {
                const map = mapRef.current
                if (map) {
                  const point = map.mouseEventToLatLng(e.nativeEvent)
                  handleMapClick({ latlng: point } as L.LeafletMouseEvent)
                }
              }}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                cursor: mode === "polygon" ? "crosshair" : "default",
              }}
            />
          )}
        </MapContainer>
      </div>
    </div>
  )
}

