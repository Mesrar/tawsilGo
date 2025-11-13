"use client"
import MapClient from "@/components/Map/MapClient";
import { Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

async function fetchRouteData() {
  const response = await fetch("/api/driver/pickup-route", {
    credentials: "include",
  });
  if (!response.ok) {
    throw new Error("Failed to fetch route data");
  }
  const jsonResponse = await response.json();
  console.log("Route API response:", jsonResponse);
  // If a "data" property is in the response, return it; otherwise return the response directly.
  return jsonResponse.data ? jsonResponse.data : jsonResponse;
}

export default function AvailableOrders() {
  const { data: routeData, isLoading, error } = useQuery({
    queryKey: ["pickup-route"],
    queryFn: fetchRouteData,
    staleTime: 60_000,
  });

  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-4">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  if (error) {
    return <p>Error: {(error as Error).message}</p>;
  }
  // Ensure routeData is defined and has features
   // Log the routeData for debugging
   console.log("Route Data:", routeData);
  if (!routeData || !routeData.features) {
    return <p>No route data available.</p>;
  }


  return (
    <div className="container">
    <h1>Route Visualization</h1>
    <MapClient routeData={routeData} />
  </div>
  );
}
