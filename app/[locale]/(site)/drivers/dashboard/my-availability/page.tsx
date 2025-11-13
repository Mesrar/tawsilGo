"use client";

import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

// Dynamically import DriverAvailability to avoid SSR issues with Leaflet
const DriverAvailability = dynamic(
  () => import("@/components/Driver/driver-availability").then((mod) => mod.DriverAvailability),
  {
    ssr: false,
    loading: () => (
      <div className="container mx-auto p-4">
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    )
  }
);

export default function DriverAvailabilityPage() {
  // This is a mock-up. In a real application, you'd fetch this data from your backend.
  const orders = [
    { id: 1, pickup: "123 Main St", dropoff: "456 Elm St", distance: "5 miles" },
    { id: 2, pickup: "789 Oak Ave", dropoff: "101 Pine Rd", distance: "3 miles" },
  ]

  return (
    <div>
     <DriverAvailability />
    </div>
  )
}

