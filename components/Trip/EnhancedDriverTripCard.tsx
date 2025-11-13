"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { ChevronRight, Euro, Package, MapPin, TrendingUp, Clock, Navigation } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Trip } from "@/types/trip"
import {
  calculateTripEarnings,
  calculateMaxEarnings,
  formatCurrency,
  getTripUrgency,
  getUrgencyColors,
  formatRelativeTime,
  getStatusColor,
  formatStatus,
  calculateCapacityUtilization,
  getCapacityColor,
  getCountryFlag,
  formatLocation,
  getContextualActions,
} from "@/lib/utils/trip-utils"

interface EnhancedDriverTripCardProps {
  trip: Trip
  onViewDetails: (id: string) => void
  onQuickAction: (id: string, action: string) => void
  isMobile: boolean
}

export function EnhancedDriverTripCard({
  trip,
  onViewDetails,
  onQuickAction,
  isMobile,
}: EnhancedDriverTripCardProps) {
  // Calculate metrics
  const currentEarnings = calculateTripEarnings(trip)
  const maxEarnings = calculateMaxEarnings(trip)
  const capacityUtilization = calculateCapacityUtilization(trip.totalCapacity, trip.remainingCapacity)
  const urgency = getTripUrgency(trip.departureTime)
  const urgencyColors = getUrgencyColors(urgency)
  const statusColors = getStatusColor(trip.status)
  const capacityColor = getCapacityColor(capacityUtilization)
  const actions = getContextualActions(trip)

  const usedCapacity = trip.totalCapacity - trip.remainingCapacity
  const parcelCount = trip.statistics?.totalBookings || 0

  // Determine if trip needs attention (high urgency or high capacity)
  const needsAttention = (urgency === 'critical' || urgency === 'high') && trip.status === 'SCHEDULED'

  return (
    <Card
      className={cn(
        "transition-all duration-200 hover:shadow-md cursor-pointer relative overflow-hidden",
        isMobile && "active:scale-[0.98]",
        needsAttention && "ring-2 ring-amber-400 shadow-lg"
      )}
      onClick={() => onViewDetails(trip.id)}
    >
      {/* Urgency indicator stripe for high-priority trips */}
      {needsAttention && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-400 animate-pulse" />
      )}

      <CardContent className="p-4 space-y-3">
        {/* Header: Status Badge + Time */}
        <div className="flex justify-between items-start">
          <Badge
            className={cn(
              "text-xs font-medium",
              statusColors.bg,
              statusColors.text,
              statusColors.border,
              "border"
            )}
          >
            {formatStatus(trip.status)}
          </Badge>

          <div
            className={cn(
              "text-sm font-medium flex items-center gap-1",
              urgencyColors.text
            )}
          >
            <Clock className="h-3 w-3" />
            {formatRelativeTime(trip.departureTime)}
          </div>
        </div>

        {/* Route with Flags */}
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <span className="text-2xl" title={trip.departureCountry}>
                {getCountryFlag(trip.departureCountry)}
              </span>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-base truncate">
                  {formatLocation(trip.departureAddress)}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {trip.departureCountry}
                </p>
              </div>
            </div>

            <ChevronRight className="h-5 w-5 text-muted-foreground mx-2 flex-shrink-0" />

            <div className="flex items-center gap-2 flex-1 min-w-0">
              <span className="text-2xl" title={trip.destinationCountry}>
                {getCountryFlag(trip.destinationCountry)}
              </span>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-base truncate">
                  {formatLocation(trip.destinationAddress)}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {trip.destinationCountry}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Key Metrics Row */}
        <div className="grid grid-cols-3 gap-2">
          {/* Earnings */}
          <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-lg p-3">
            <div className="flex items-center gap-1 mb-1">
              <Euro className="h-3 w-3 text-green-600" />
              <span className="text-xs font-medium text-green-600">Earnings</span>
            </div>
            <p className="text-lg font-bold text-green-900">
              {formatCurrency(currentEarnings, trip.price.currency)}
            </p>
            <p className="text-xs text-green-600">
              / {formatCurrency(maxEarnings, trip.price.currency)}
            </p>
          </div>

          {/* Capacity */}
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-3">
            <div className="flex items-center gap-1 mb-1">
              <Package className="h-3 w-3 text-blue-600" />
              <span className="text-xs font-medium text-blue-600">Capacity</span>
            </div>
            <p className="text-lg font-bold text-blue-900">
              {usedCapacity}/{trip.totalCapacity}
            </p>
            <p className="text-xs text-blue-600">
              {parcelCount} {parcelCount === 1 ? 'parcel' : 'parcels'}
            </p>
          </div>

          {/* Utilization */}
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-lg p-3">
            <div className="flex items-center gap-1 mb-1">
              <TrendingUp className="h-3 w-3 text-purple-600" />
              <span className="text-xs font-medium text-purple-600">Utilization</span>
            </div>
            <p className="text-lg font-bold text-purple-900">
              {capacityUtilization}%
            </p>
            <p className="text-xs text-purple-600">
              {trip.remainingCapacity}kg left
            </p>
          </div>
        </div>

        {/* Capacity Progress Bar */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span className="font-medium">Capacity utilization</span>
            <span>{capacityUtilization}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
            <div
              className={cn(
                "h-2 rounded-full transition-all duration-500",
                capacityColor
              )}
              style={{ width: `${capacityUtilization}%` }}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-1">
          <Button
            className="flex-1 h-11 font-medium"
            onClick={(e) => {
              e.stopPropagation()
              onQuickAction(trip.id, actions.primary.action)
            }}
            variant={actions.primary.variant || 'default'}
          >
            {actions.primary.label}
          </Button>

          {actions.secondary.length > 0 && (
            <Button
              variant={actions.secondary[0].variant || 'outline'}
              className="h-11"
              onClick={(e) => {
                e.stopPropagation()
                onQuickAction(trip.id, actions.secondary[0].action)
              }}
            >
              {actions.secondary[0].action === 'navigate' ? (
                <Navigation className="h-4 w-4" />
              ) : (
                actions.secondary[0].label
              )}
            </Button>
          )}

          {actions.secondary.length > 1 && !isMobile && (
            <Button
              variant={actions.secondary[1].variant || 'outline'}
              className="h-11"
              onClick={(e) => {
                e.stopPropagation()
                onQuickAction(trip.id, actions.secondary[1].action)
              }}
            >
              {actions.secondary[1].label}
            </Button>
          )}
        </div>

        {/* Attention Banner for High Priority */}
        {needsAttention && (
          <div className="bg-amber-50 border border-amber-200 rounded-md p-2 flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
            <p className="text-xs font-medium text-amber-800">
              {urgency === 'critical'
                ? 'Trip starting very soon! Please prepare.'
                : 'Trip starting in a few hours. Get ready!'}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
