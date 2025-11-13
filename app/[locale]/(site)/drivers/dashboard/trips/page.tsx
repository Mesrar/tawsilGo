// app/driver/dashboard/page.tsx
"use client";
import { StreamlinedTripsDashboard } from "@/components/Trip/streamlined-trips-dashboard";

export default function DriverDashboard() {
  return (
    <div className="max-w-7xl mx-auto p-4 space-y-6">
      <StreamlinedTripsDashboard />
    </div>
  );
}