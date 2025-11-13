"use client";

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  Circle,
  ZoomControl,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useState } from "react";
import {
  ChevronRight,
  Clock,
  MapPin,
  Navigation,
  PackageCheck,
  Truck,
  Warehouse,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

// Fix Leaflet marker icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

/**
 * Custom icon generator.
 * @param emoji - The main icon (e.g., 📦, ✔️, 🏭, 🚗)
 * @param status - Step status: pending, current, or completed.
 * @param label - Optional step number.
 * @param agentColor - The driver/agent’s distinct color.
 */
const createDriverIcon = (
  emoji: string,
  status: "pending" | "current" | "completed",
  label?: number,
  agentColor: string = "#3b82f6"
) => {
  // Define colors based on status, using agentColor for the current step.
  const statusColors = {
    pending: "#94a3b8",
    current: agentColor,
    completed: "#10b981",
  };

  return L.divIcon({
    html: `
      <div style="
        background: ${statusColors[status]};
        width: 48px;
        height: 48px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
       
        border: 2px solid ${agentColor};
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        font-size: 20px;
        position: relative;
        transition: all 0.3s ease;
      ">
        ${emoji}
        ${label !== undefined ? `<div style="...">${label}</div>` : ""}
      </div>
    `,
    iconSize: [48, 48],
    iconAnchor: [24, 24],
  });
};

/**
 * A simple legend component placed at the bottom-right of the map.
 */
const MapLegend = ({ agentColor }: { agentColor: string }) => (
  <div className="bg-background/90 backdrop-blur-sm p-4 rounded-xl shadow-lg border">
    <div className="flex items-center gap-2 mb-3">
      <MapPin className="w-5 h-5 text-primary" />
      <h3 className="font-semibold">Map Legend</h3>
    </div>
    <div className="space-y-2 text-sm">
      <div className="flex items-center gap-2">
        <span className="text-2xl">
          <Truck />
        </span>
        <span>Start Location</span>
      </div>
      <div className="flex items-center gap-2">
        <Warehouse className="w-4 h-4 text-orange-500" />
        <span>Warehouse</span>
      </div>
      <div className="flex items-center gap-2">
        <PackageCheck className="w-4 h-4 text-green-500" />
        <span>Pickup/Delivery</span>
      </div>
      <div className="flex items-center gap-2 mt-2">
        <div className="w-3 h-3 rounded-full bg-blue-500" />
        <span>Agent Route</span>
      </div>
    </div>
  </div>
);

interface RouteMapProps {
  routeData: any;
  agentColor?: string;
  agentNumber?: number;
}

const RouteMap = ({
  routeData,
  agentColor = "#3b82f6",
  agentNumber = 1,
}: RouteMapProps) => {
  const [activeStep, setActiveStep] = useState(0);
  const [showDetails, setShowDetails] = useState(false);
  const [mapInstance, setMapInstance] = useState<L.Map | null>(null);

  if (typeof window === "undefined") return null;

  // Extract key locations
  const warehouse = routeData.properties.params.locations.find(
    (l: any) => l.id === "warehouse"
  );
  const waypoints = routeData.features[0].properties.waypoints;
  const currentLocation = waypoints[activeStep]?.location;

  // Progress tracking
  const totalSteps = waypoints.length;
  const legs = routeData.features[0].properties.legs;
  const totalDistance =
    legs
      .slice(activeStep)
      .reduce((sum: number, leg: any) => sum + leg.distance, 0) / 1000;

  // Create timeline steps with extra details and step number (starting at 1)
  const timelineSteps = waypoints.map((wp: any, index: number) => ({
    stepNumber: index + 1,
    type: wp.actions[0].type,
    location: wp.original_location_id,
    time: new Date(wp.start_time * 1000).toLocaleTimeString(),
    address:
      wp.original_location_id === "warehouse"
        ? "Main Warehouse, 123 Logistics Park"
        : "Customer Location, 456 Delivery Street",
    coordinates: wp.location,
    shipmentId: wp.actions[0]?.shipment_id || "",
    duration: wp.actions[0]?.duration || 0,
    distanceToNext: legs[index] ? legs[index].distance / 1000 : null,
  }));
    // Recenter map functionality
    const recenterMap = () => {
      if (mapInstance && currentLocation) {
        mapInstance.flyTo(currentLocation[1], currentLocation[0]);
      }
    };

      // Time calculation example
  const calculateTotalTime = () => {
    const totalSeconds = timelineSteps.reduce((sum: number, wp: { duration: number }) => sum + wp.duration, 0);
    return Math.round(totalSeconds / 60);
  };

  return (
    <div className="h-screen flex flex-col bg-gradient-to-b from-gray-50 to-white">
      {/* Enhanced Header */}
      <div className="bg-white p-6 shadow-sm border-b">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-white"
              style={{ backgroundColor: agentColor }}
            >
              {agentNumber}
            </div>

            <div>
              <h1 className="text-xl font-semibold">Delivery Route #D-{agentNumber}</h1>
              <p className="text-sm text-muted-foreground flex items-center gap-1">
                <Clock className="w-4 h-4" />
                Estimated completion: {calculateTotalTime()} minutes
              </p>
            </div>
        
          </div>

          <div className="flex items-center gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-100 hover:bg-emerald-200 text-emerald-700"
              onClick={() => setShowDetails(!showDetails)}
            >
              {showDetails ? "Hide" : "Show"} Details
              <ChevronRight
                className={`w-4 h-4 transition-transform ${showDetails ? "rotate-90" : ""}`}
              />
            </motion.button>
          </div>
        </div>
      </div>

      {/* Animated Timeline */}
      <AnimatePresence>
        {showDetails && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white border-b"
          >
            <div className="max-w-7xl mx-auto p-6">
              <div className="flex gap-4 overflow-x-auto pb-4">
                {timelineSteps.map((step: {
                  stepNumber: number;
                  type: string;
                  location: string;
                  time: string;
                  address: string;
                  coordinates: [number, number];
                  shipmentId: string;
                  duration: number;
                  distanceToNext: number | null;
                }, index: number) => (
                  <motion.div
                    key={index}
                    whileHover={{ y: -4 }}
                    className={`flex flex-col items-center p-4 rounded-xl cursor-pointer transition-all relative 
                      ${activeStep === index ? "bg-blue-50 border-2 border-blue-500" : "bg-gray-50"}
                      ${index <= activeStep ? "opacity-100" : "opacity-50"}`}
                    style={{ minWidth: "220px" }}
                  >
                    <div className="absolute top-4 right-4">
                      {step.type === "pickup" ? (
                        <PackageCheck className="w-5 h-5 text-green-500" />
                      ) : (
                        <Warehouse className="w-5 h-5 text-orange-500" />
                      )}
                    </div>
                    <div className="flex flex-col items-center text-center">
                      <span className="text-xs font-medium text-muted-foreground mb-1">
                        Step {step.stepNumber}
                      </span>
                      <h3 className="font-medium mb-2 capitalize">
                        {step.type}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        {step.time}
                      </p>
                      <div className="h-[2px] w-full bg-gray-200 mb-2 relative">
                        {index < timelineSteps.length - 1 && (
                          <div
                            className="absolute h-full bg-blue-500 transition-all duration-500"
                            style={{
                              width: `${index < activeStep ? "100%" : "0%"}`,
                            }}
                          />
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Next: {step.distanceToNext?.toFixed(1)} km
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Enhanced Map Container */}
      <div className="flex-1 relative">
        <MapContainer
          center={
            currentLocation
              ? [currentLocation[1], currentLocation[0]]
              : [48.8426, 2.3217]
          }
          zoom={13}
          style={{ height: "100%", width: "100%" }}
          zoomControl={false}
          className="rounded-xl"
        >
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />

          {/* Animated Route */}
          <Polyline
            positions={routeData.features[0].geometry.coordinates
              .flat()
              .map((c: any) => [c[1], c[0]])}
            pathOptions={{
              color: agentColor,
              weight: 5,
              dashArray: activeStep > 0 ? "10,10" : "0",
              lineCap: "round",
            }}
          />

          {/* Glowing Current Location */}
          {currentLocation && (
            <Circle
              center={[currentLocation[1], currentLocation[0]]}
              radius={200}
              pathOptions={{
                fillColor: agentColor,
                fillOpacity: 0.1,
                color: agentColor,
                opacity: 0.3,
              }}
            />
          )}

          {/* Enhanced Markers */}
          {waypoints.map((wp: any, index: number) => {
            // Add this line to get the current step from timelineSteps
            const currentStep = timelineSteps[index];

            return (
              <Marker
                key={index}
                position={[wp.location[1], wp.location[0]]}
                icon={createDriverIcon(
                  getStepEmoji(wp),
                  getStepStatus(index, activeStep),
                  currentStep.stepNumber,
                  agentColor
                )}
              >
                <Popup className="rounded-xl shadow-xl">
                  <div className="min-w-[260px] space-y-3">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-white"
                        style={{ backgroundColor: agentColor }}
                      >
                        {currentStep.stepNumber}
                      </div>
                      <div>
                        <h3 className="font-semibold">
                          {wp.actions[0].type.toUpperCase()}
                        </h3>
                        {/* Use currentStep instead of step */}
                        <p className="text-sm text-muted-foreground">
                          {currentStep.address}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        {/* Use currentStep instead of step */}
                        {currentStep.time}
                      </div>
                      <div className="flex items-center gap-2">
                        <PackageCheck className="w-4 h-4" />
                        {/* Use currentStep instead of step */}
                        {currentStep.shipmentId}
                      </div>
                    </div>

                    <button
                      className="w-full flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg transition-colors"
                      onClick={() =>
                        window.open(
                          `https://www.google.com/maps/dir/?api=1&destination=${wp.location[1]},${wp.location[0]}`,
                          "_blank"
                        )
                      }
                    >
                      <Navigation className="w-4 h-4" />
                      Start Navigation
                    </button>
                  </div>
                </Popup>
              </Marker>
            );
          })}

          {/* Enhanced Controls */}
          <div className="leaflet-top leaflet-right space-y-2 mr-4 mt-20">
            <ZoomControl position="topright" />
            <motion.button
              whileHover={{ scale: 1.05 }}
              className="leaflet-control bg-white p-2 rounded-lg shadow-md border"
              onClick={() => recenterMap()}
            >
              <Navigation className="w-5 h-5 text-blue-500" />
            </motion.button>
          </div>

          <MapLegend agentColor={agentColor} />
        </MapContainer>

        {/* Floating Progress Card */}
        {!showDetails && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="absolute bottom-6 left-6 right-6 max-w-md mx-auto"
          >
            <div className="bg-white rounded-2xl p-6 shadow-2xl border space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold flex items-center gap-2">
                  <PackageCheck className="w-5 h-5 text-green-500" />
                  Current Shipments
                </h3>
                <span className="text-sm text-muted-foreground">
                  {totalDistance.toFixed(1)} km remaining
                </span>
              </div>

              <div className="space-y-3">
                {routeData.properties.params.shipments.map((shipment: any) => (
                  <div
                    key={shipment.id}
                    className="p-3 rounded-lg bg-gray-50 border"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">
                        #{shipment.id.slice(0, 6)}
                      </span>
                      <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-700">
                        {activeStep >= 1 ? "In Transit" : "Awaiting Pickup"}
                      </span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {shipment.pickup.location_index === 1
                        ? "Customer Location"
                        : "Warehouse"}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <div
                  className="h-2 flex-1 bg-gray-200 rounded-full overflow-hidden"
                  title="Route progress"
                >
                  <div
                    className="h-full bg-blue-500 transition-all duration-500"
                    style={{
                      width: `${(activeStep / timelineSteps.length) * 100}%`,
                    }}
                  />
                </div>
                <span>
                  {Math.round((activeStep / timelineSteps.length) * 100)}%
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

// Utility functions
const getStepEmoji = (waypoint: any) => {
  if (waypoint.original_location_id === "warehouse") return "🏭";
  if (waypoint.actions[0].type === "pickup") return "📦";
  return "🚚";
};

const getStepStatus = (index: number, activeStep: number) => {
  if (index < activeStep) return "completed";
  if (index === activeStep) return "current";
  return "pending";
};

export default RouteMap;
