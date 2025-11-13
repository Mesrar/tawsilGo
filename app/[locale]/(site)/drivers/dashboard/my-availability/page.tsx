import { DriverAvailability } from "@/components/Driver/driver-availability"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

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

