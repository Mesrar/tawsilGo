"use client"

import { useQuery, useQueryClient } from "@tanstack/react-query"
import { format } from "date-fns"
import { Eye, Edit, X, Loader2 } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import toast from "react-hot-toast"
import { useRouter } from "next/navigation"
import { StatusBadge } from "../Status-Bagde/status-badge"

interface Stop {
  id: string
  location: string
  arrivalTime: string
  stopType: string
  order: number
}

interface Trip {
  id: string // Changed from number to string for UUID
  origin: string
  destination: string
  departureTime: string
  arrivalTime: string
  capacity: number
  remainingCapacity: number
  status: string
  stops: Stop[]
  price: number
}

async function fetchTrips(): Promise<Trip[]> {
  const response = await fetch("/api/driver/trips", { credentials: "include" })
  if (!response.ok) {
    throw new Error("Failed to fetch trips")
  }
  const data = await response.json()

  // Handle nested structure: { trips: { trips: [...] } }
  let tripsArray: any[] = []
  if (Array.isArray(data)) {
    tripsArray = data
  } else if (data.trips && Array.isArray(data.trips)) {
    tripsArray = data.trips
  } else if (data.trips && data.trips.trips && Array.isArray(data.trips.trips)) {
    tripsArray = data.trips.trips
  }

  return tripsArray.map((item: any) => ({
    id: item.id,
    origin: item.departureLocation,
    destination: item.arrivalLocation,
    departureTime: item.departureTime,
    arrivalTime: item.arrivalTime,
    capacity: item.totalCapacityKg,
    remainingCapacity: item.remainingCapacityKg,
    price: 0, // Update if you get pricing information
    status: item.status,
    stops: item.stops || []
  }))
}

export function TripList() {
  const queryClient = useQueryClient()
  const router = useRouter() 
  
  const {
    data: trips,
    isLoading,
    isError,
    error,
  } = useQuery<Trip[], Error>({
    queryKey: ["trips"],
    queryFn: fetchTrips,
  })

  const handleViewDetails = (tripId: string) => {
    // Implement view details logic
    console.log(`View details for trip ${tripId}`)
    router.push(`/drivers/dashboard/trips/${tripId}`)
  }

  const handleEditTrip = (tripId: string) => {
    // Implement edit trip logic
    console.log(`Edit trip ${tripId}`)
  }

  const handleCancelTrip = async (tripId: string) => {
    try {
      const response = await fetch(`/api/driver/trips/${tripId}/cancel`, {
        method: "POST",
        credentials: "include",
      })
      if (!response.ok) {
        throw new Error("Failed to cancel trip")
      }
      toast.success("Trip cancelled successfully")
      
      // Refetch trips to update the list
      queryClient.invalidateQueries({queryKey: ["trips"]})
    } catch (error) {
      toast.error("Failed to cancel trip. Please try again.")
    }
  }


  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (isError) {
    return <div className="text-center text-red-500">Error: {error.message}</div>
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Your Trips</CardTitle>
        <CardDescription>Manage and view your created trips</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Origin</TableHead>
              <TableHead>Destination</TableHead>
              <TableHead>Departure</TableHead>
              <TableHead>Arrival</TableHead>
              <TableHead>Capacity</TableHead>
              <TableHead>Available</TableHead>
              <TableHead>Stops</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {trips && trips.length > 0 ? (
              trips.map((trip) => (
                <TableRow key={trip.id}>
                  <TableCell className="max-w-[150px] truncate" title={trip.origin}>
                    {trip.origin}
                  </TableCell>
                  <TableCell className="max-w-[150px] truncate" title={trip.destination}>
                    {trip.destination}
                  </TableCell>
                  <TableCell>{format(new Date(trip.departureTime), "PPp")}</TableCell>
                  <TableCell>{format(new Date(trip.arrivalTime), "PPp")}</TableCell>
                  <TableCell>{trip.capacity} kg</TableCell>
                  <TableCell>{trip.remainingCapacity} kg</TableCell>
                  <TableCell>{trip.stops?.length || 0}</TableCell>
                  <TableCell><StatusBadge status={trip.status} /></TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" onClick={() => handleViewDetails(trip.id)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleEditTrip(trip.id)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleCancelTrip(trip.id)}
                        disabled={trip.status !== "SCHEDULED"}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-8">
                  No trips found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}