"use client";

import { useEffect, useState, useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix for Leaflet marker icons in Next.js
const fixLeafletIcons = () => {
  delete (L.Icon.Default.prototype as any)._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: "/leaflet/marker-icon-2x.png",
    iconUrl: "/leaflet/marker-icon.png",
    shadowUrl: "/leaflet/marker-shadow.png",
  });
};

// Default icons
const defaultIcons = {
  departure: new L.Icon({
    iconUrl: "/icons/departure-marker.svg",
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  }),
  arrival: new L.Icon({
    iconUrl: "/icons/arrival-marker.svg", 
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  }),
};

export interface GeoPoint {
  lat: number;
  lng: number;
}

export interface RoutePoint {
  id?: string;
  point: GeoPoint;
  label: string;
  type: 'departure' | 'arrival';
}

interface TripMapProps {
  routePolyline: [number, number][];
  departurePoint?: RoutePoint;
  arrivalPoint?: RoutePoint;
  className?: string;
  height?: string;
  routeColor?: string; 
  routeWeight?: number;
  routeOpacity?: number;
}

// Helper component to fit map to bounds when polyline changes
function FitBounds({ polyline, points }: { polyline: [number, number][]; points: GeoPoint[] }) {
  const map = useMap();
  
  useEffect(() => {
    if (polyline.length > 0) {
      const bounds = L.latLngBounds(polyline as L.LatLngTuple[]);
      map.fitBounds(bounds, { padding: [50, 50] });
    } else if (points.length > 0) {
      const bounds = L.latLngBounds(points.map(p => [p.lat, p.lng]) as L.LatLngTuple[]);
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [polyline, points, map]);
  
  return null;
}

const TripMap = ({
  routePolyline,
  departurePoint,
  arrivalPoint,
  className = "",
  height = "400px",
  routeColor = "#3B82F6",
  routeWeight = 4,
  routeOpacity = 0.7,
}: TripMapProps) => {
  // Fix marker icons on component mount
  useEffect(() => {
    fixLeafletIcons();
  }, []);
  
  // Calculate initial map center and zoom
  const defaultCenter: [number, number] = useMemo(() => {
    // Use departure point if available

    console.log(departurePoint);
    console.log(arrivalPoint);
    console.log(routePolyline);
    if (departurePoint) {
      return [departurePoint.point.lat, departurePoint.point.lng];
    }
    
    // Use arrival point if available
    if (arrivalPoint) {
      return [arrivalPoint.point.lat, arrivalPoint.point.lng];
    }
    
    // Default to center of polyline
    if (routePolyline.length > 0) {
      const midIndex = Math.floor(routePolyline.length / 2);
      return routePolyline[midIndex];
    }
    
    // Default to London if nothing else available
    return [51.505, -0.09];
  }, [departurePoint, arrivalPoint, routePolyline]);

  // Collect all points for bounds calculation
  const allPoints: GeoPoint[] = useMemo(() => {
    const points = [];
    if (departurePoint) points.push(departurePoint.point);
    if (arrivalPoint) points.push(arrivalPoint.point);
    return points;
  }, [departurePoint, arrivalPoint]);
  
  return (
    <div className={`relative rounded-lg overflow-hidden shadow-md ${className}`} style={{ height }}>
      <MapContainer
        center={defaultCenter}
        zoom={5}
        style={{ height: "100%", width: "100%" }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* Fit map to bounds */}
        <FitBounds polyline={routePolyline} points={allPoints} />
        
        {/* Departure marker */}
        {departurePoint && (
          <Marker
            position={[departurePoint.point.lat, departurePoint.point.lng]}
            icon={defaultIcons.departure}
          >
            <Popup>
              <div>
                <strong>Departure</strong>
                <p>{departurePoint.label}</p>
              </div>
            </Popup>
          </Marker>
        )}
        
        {/* Arrival marker */}
        {arrivalPoint && (
          <Marker
            position={[arrivalPoint.point.lat, arrivalPoint.point.lng]}
            icon={defaultIcons.arrival}
          >
            <Popup>
              <div>
                <strong>Arrival</strong>
                <p>{arrivalPoint.label}</p>
              </div>
            </Popup>
          </Marker>
        )}
        
        {/* Route polyline */}
        {routePolyline.length > 0 && (
          <Polyline
            positions={routePolyline}
            color={routeColor}
            weight={routeWeight}
            opacity={routeOpacity}
          />
        )}
      </MapContainer>
    </div>
  );
};

export default TripMap;