"use client"

import { useState, useEffect } from "react"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import {
  Plus,
  Package,
  TrendingUp,
  Route,
  Calendar,
  RefreshCw
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { TripCreationForm } from "./trip-creation-form"
import { toast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"
import { useIsMobile } from "@/hooks/use-mobile"
import type { Trip as ApiTrip } from "@/types/trip"
import { EnhancedDriverTripCard } from "./EnhancedDriverTripCard"
import { TripFilters, type TripFilterType } from "./TripFilters"
import { TripListSkeleton, TripFiltersSkeleton, TripStatsSkeleton } from "./TripListSkeleton"
import { EmptyTripState } from "./EmptyTripState"
import { filterTrips } from "@/lib/utils/trip-utils"


async function fetchTrips(): Promise<ApiTrip[]> {
  const response = await fetch("/api/driver/trips", { credentials: "include" })
  if (!response.ok) {
    throw new Error("Failed to fetch trips")
  }
  const data = await response.json()

  // Handle nested structure from API
  let tripsArray: any[] = []
  if (Array.isArray(data)) {
    tripsArray = data
  } else if (data.trips && Array.isArray(data.trips)) {
    tripsArray = data.trips
  } else if (data.trips && data.trips.trips && Array.isArray(data.trips.trips)) {
    tripsArray = data.trips.trips
  }

  // Map API response to Trip type - fixing field mapping issue
  return tripsArray.map((item: any) => ({
    id: item.id,
    departureCountry: item.departureCountry || '',
    destinationCountry: item.destinationCountry || '',
    departureCity: item.departureCity || '',
    destinationCity: item.destinationCity || '',
    departureAddress: item.departureAddress || '',
    destinationAddress: item.destinationAddress || '',
    departureTime: item.departureTime,
    arrivalTime: item.arrivalTime,
    price: item.price || {
      basePrice: 0,
      pricePerKg: 0,
      pricePerKm: 0,
      minimumPrice: 0,
      currency: 'EUR',
      weightThreshold: 0,
      premiumFactor: 0,
    },
    dapartPoint: item.dapartPoint || { lat: 0, lng: 0 },
    arrivalPoint: item.arrivalPoint || { lat: 0, lng: 0 },
    totalCapacity: item.totalCapacity || 0,
    remainingCapacity: item.remainingCapacity || 0,
    status: item.status || 'SCHEDULED',
    stops: item.stops || [],
    estimatedDistance: item.estimatedDistance || 0,
    estimatedDuration: item.estimatedDuration || 0,
    statistics: item.statistics || {
      totalBookings: 0,
      capacityUtilized: 0,
      totalParcelWeight: 0,
      pendingBookings: 0,
      completedBookings: 0,
      totalDistanceKm: 0,
      totalDuration: 0,
      averageSpeed: 0,
    },
    route: item.route,
    driver: item.driver,
    organizationId: item.organizationId,
    organization: item.organization,
    vehicleId: item.vehicleId,
    vehicle: item.vehicle,
    ownerType: item.ownerType || 'individual_driver',
    createdBy: item.createdByUserId || item.createdBy || '',
    assignedDriverId: item.assignedDriverId,
    assignedVehicleId: item.assignedVehicleId,
  }))
}

export function StreamlinedTripsDashboard() {
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [activeFilter, setActiveFilter] = useState<TripFilterType>('all')
  const isMobile = useIsMobile()
  const queryClient = useQueryClient()
  const router = useRouter()

  const {
    data: trips,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery<ApiTrip[], Error>({
    queryKey: ["trips"],
    queryFn: fetchTrips,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes (renamed from cacheTime in v5)
    refetchOnWindowFocus: true,
  })

  // Auto-refresh for IN_PROGRESS trips every 30 seconds
  useEffect(() => {
    const hasActiveTrips = trips?.some(t => t.status === 'IN_PROGRESS')

    if (hasActiveTrips) {
      const interval = setInterval(() => {
        refetch()
      }, 30000) // 30 seconds

      return () => clearInterval(interval)
    }
  }, [trips, refetch])

  const handleViewDetails = (tripId: string) => {
    router.push(`/drivers/dashboard/trips/${tripId}`)
  }

  const handleNavigate = (tripId: string) => {
    const trip = trips?.find(t => t.id === tripId)
    if (!trip) return

    // Validate coordinates exist
    if (!trip.dapartPoint || !trip.arrivalPoint ||
        trip.dapartPoint.lat === 0 || trip.dapartPoint.lng === 0 ||
        trip.arrivalPoint.lat === 0 || trip.arrivalPoint.lng === 0) {
      toast({
        title: "Navigation unavailable",
        description: "Trip coordinates are missing or invalid.",
        variant: "destructive",
      })
      return
    }

    // Check online status
    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      toast({
        title: "You're offline",
        description: "Navigation requires an internet connection.",
        variant: "destructive",
      })
      return
    }

    // Build Google Maps URL
    const origin = `${trip.dapartPoint.lat},${trip.dapartPoint.lng}`
    const destination = `${trip.arrivalPoint.lat},${trip.arrivalPoint.lng}`
    const mapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&travelmode=driving`

    // Open in new tab/window
    window.open(mapsUrl, '_blank')

    toast({
      title: "Opening navigation",
      description: "Google Maps is loading...",
    })
  }

  const handleQuickAction = async (tripId: string, action: string) => {
    switch (action) {
      case 'details':
        router.push(`/drivers/dashboard/trips/${tripId}`)
        break

      case 'continue':
      case 'start':
        router.push(`/drivers/dashboard/trips/${tripId}?action=start`)
        break

      case 'navigate':
        handleNavigate(tripId)
        break

      case 'parcels':
        router.push(`/drivers/dashboard/trips/${tripId}?tab=parcels`)
        break

      case 'edit':
        toast({
          title: "Edit Coming Soon",
          description: "Trip editing will be available in the next update.",
        })
        break

      case 'cancel':
        await handleCancelTrip(tripId)
        break

      case 'summary':
        router.push(`/drivers/dashboard/trips/${tripId}?view=summary`)
        break

      case 'report':
        toast({
          title: "Generating report",
          description: "Your trip report will download shortly...",
        })
        // TODO: Implement PDF generation
        break

      case 'support':
        toast({
          title: "Support",
          description: "Contact support feature coming soon.",
        })
        break

      default:
        console.log(`Unknown action: ${action}`)
    }
  }

  const handleCancelTrip = async (tripId: string) => {
    // Confirmation before cancellation
    if (!confirm("Are you sure you want to cancel this trip? This action cannot be undone.")) {
      return
    }

    try {
      const response = await fetch(`/api/driver/trips/${tripId}/cancel`, {
        method: "POST",
        credentials: "include",
      })
      if (!response.ok) {
        throw new Error("Failed to cancel trip")
      }
      toast({
        title: "Success",
        description: "Trip cancelled successfully",
      })
      queryClient.invalidateQueries({ queryKey: ["trips"] })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to cancel trip. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleFilterChange = (filter: TripFilterType) => {
    setActiveFilter(filter)
  }

  const handleRefresh = () => {
    refetch()
    toast({
      title: "Refreshing",
      description: "Updating trip information...",
    })
  }

  // Filter trips based on active filter
  const filteredTrips = trips ? filterTrips(trips, activeFilter) : []

  // Statistics
  const activeTrips = trips?.filter(t => t.status === 'IN_PROGRESS') || []
  const scheduledTrips = trips?.filter(t => t.status === 'SCHEDULED') || []
  const completedTrips = trips?.filter(t => t.status === 'COMPLETED') || []
  const totalCapacity = trips?.reduce((sum, t) => sum + t.totalCapacity, 0) || 0
  const utilizedCapacity = trips?.reduce((sum, t) => sum + (t.totalCapacity - t.remainingCapacity), 0) || 0
  const utilizationRate = totalCapacity > 0 ? (utilizedCapacity / totalCapacity) * 100 : 0

  // Auto-select smart default filter on mount
  useEffect(() => {
    if (trips && activeTrips.length > 0 && activeFilter === 'all') {
      setActiveFilter('active')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // Empty deps - only run on mount

  if (isLoading) {
    return (
      <div className="space-y-4">
        <TripStatsSkeleton count={isMobile ? 2 : 4} />
        <TripFiltersSkeleton />
        <TripListSkeleton count={3} isMobile={isMobile} />
      </div>
    )
  }

  if (isError) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardContent className="p-6 text-center space-y-4">
          <p className="text-red-600 font-medium">Error loading trips: {error.message}</p>
          <Button onClick={handleRefresh} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </Button>
        </CardContent>
      </Card>
    )
  }

  // Mobile-first single screen view
  if (isMobile) {
    return (
      <div className="space-y-4">
        {/* Header with Create Button */}
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">My Trips</h2>
          <Button
            onClick={() => setShowCreateModal(true)}
            size="sm"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create
          </Button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-3">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-1">
                <Route className="h-4 w-4 text-blue-600" />
                <span className="text-xs text-blue-600 font-medium">Active Trips</span>
              </div>
              <p className="text-2xl font-bold text-blue-900">{activeTrips.length}</p>
              <p className="text-xs text-blue-600">Currently running</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp className="h-4 w-4 text-green-600" />
                <span className="text-xs text-green-600 font-medium">Utilization</span>
              </div>
              <p className="text-2xl font-bold text-green-900">{Math.round(utilizationRate)}%</p>
              <p className="text-xs text-green-600">Capacity used</p>
            </CardContent>
          </Card>
        </div>

        {/* Trip Filters */}
        {trips && trips.length > 0 && (
          <TripFilters
            trips={trips}
            activeFilter={activeFilter}
            onFilterChange={handleFilterChange}
          />
        )}

        {/* Filtered Trips List */}
        {filteredTrips.length > 0 ? (
          <div className="space-y-3">
            {filteredTrips.map(trip => (
              <EnhancedDriverTripCard
                key={trip.id}
                trip={trip}
                onViewDetails={handleViewDetails}
                onQuickAction={handleQuickAction}
                isMobile={isMobile}
              />
            ))}
          </div>
        ) : (
          <EmptyTripState
            filter={activeFilter}
            onCreateTrip={() => setShowCreateModal(true)}
            onViewAll={() => setActiveFilter('all')}
            onViewScheduled={() => setActiveFilter('week')}
            completedCount={completedTrips.length}
          />
        )}

        {/* FAB for Create (thumb zone) */}
        <Button
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg z-50"
          onClick={() => setShowCreateModal(true)}
          aria-label="Create new trip"
        >
          <Plus className="h-6 w-6" />
        </Button>

        {/* Create Trip Modal */}
        <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
          <DialogContent className="h-full w-full max-w-full m-0 p-0">
            <DialogHeader className="p-4 border-b">
              <DialogTitle>Create New Trip</DialogTitle>
            </DialogHeader>
            <div className="p-4 overflow-y-auto">
              <TripCreationForm
                onComplete={() => {
                  setShowCreateModal(false)
                  queryClient.invalidateQueries({ queryKey: ["trips"] })
                  toast({
                    title: "Success",
                    description: "Trip created successfully!",
                  })
                }}
              />
            </div>
          </DialogContent>
        </Dialog>
      </div>
    )
  }

  // Desktop view with enhanced layout
  return (
    <div className="space-y-6">
      {/* Header with Create Button */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">My Trips</h1>
        <Button onClick={() => setShowCreateModal(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Create Trip
        </Button>
      </div>

      {/* Desktop Stats */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500 rounded-lg">
                <Route className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-blue-600">Active Trips</p>
                <p className="text-2xl font-bold text-blue-900">{activeTrips.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-500 rounded-lg">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-green-600">Utilization Rate</p>
                <p className="text-2xl font-bold text-green-900">{Math.round(utilizationRate)}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-500 rounded-lg">
                <Calendar className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-amber-600">Scheduled</p>
                <p className="text-2xl font-bold text-amber-900">{scheduledTrips.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-500 rounded-lg">
                <Package className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-purple-600">Total Capacity</p>
                <p className="text-2xl font-bold text-purple-900">{totalCapacity}kg</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      {trips && trips.length > 0 && (
        <TripFilters
          trips={trips}
          activeFilter={activeFilter}
          onFilterChange={handleFilterChange}
        />
      )}

      {/* Trips Grid */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>All Trips</CardTitle>
            <CardDescription>Manage all your trips in one place</CardDescription>
          </div>
          <Button onClick={handleRefresh} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </CardHeader>
        <CardContent>
          {filteredTrips.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredTrips.map(trip => (
                <EnhancedDriverTripCard
                  key={trip.id}
                  trip={trip}
                  onViewDetails={handleViewDetails}
                  onQuickAction={handleQuickAction}
                  isMobile={isMobile}
                />
              ))}
            </div>
          ) : (
            <EmptyTripState
              filter={activeFilter}
              onCreateTrip={() => setShowCreateModal(true)}
              onViewAll={() => setActiveFilter('all')}
              onViewScheduled={() => setActiveFilter('week')}
              completedCount={completedTrips.length}
            />
          )}
        </CardContent>
      </Card>

      {/* Create Trip Modal (Desktop) */}
      <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Trip</DialogTitle>
            <DialogDescription>
              Schedule a new trip for your delivery route
            </DialogDescription>
          </DialogHeader>
          <TripCreationForm
            onComplete={() => {
              setShowCreateModal(false)
              queryClient.invalidateQueries({ queryKey: ["trips"] })
              toast({
                title: "Success",
                description: "Trip created successfully!",
              })
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}