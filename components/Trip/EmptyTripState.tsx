"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Route, Clock, CheckCircle, Calendar, TrendingUp, Plus, Eye } from "lucide-react"
import type { TripFilterType } from "./TripFilters"

interface EmptyTripStateProps {
  filter: TripFilterType
  onCreateTrip?: () => void
  onViewAll?: () => void
  onViewScheduled?: () => void
  completedCount?: number
}

export function EmptyTripState({
  filter,
  onCreateTrip,
  onViewAll,
  onViewScheduled,
  completedCount = 0,
}: EmptyTripStateProps) {
  // Different empty states based on filter
  const getEmptyStateContent = () => {
    switch (filter) {
      case 'all':
        return {
          icon: <Route className="h-16 w-16 text-muted-foreground/50" />,
          title: "No trips scheduled yet",
          description: "Create your first trip to start earning and connecting customers with their parcels",
          primaryAction: onCreateTrip
            ? {
                label: "Create Trip",
                icon: <Plus className="h-4 w-4 mr-2" />,
                onClick: onCreateTrip,
              }
            : null,
          secondaryAction: null,
          illustration: "🚛",
        }

      case 'active':
        return {
          icon: <Clock className="h-16 w-16 text-blue-400/50" />,
          title: "No active trips right now",
          description: completedCount > 0
            ? "All your trips are completed. Great work!"
            : "You don't have any trips in progress at the moment",
          primaryAction: onViewScheduled
            ? {
                label: "View Scheduled Trips",
                icon: <Calendar className="h-4 w-4 mr-2" />,
                onClick: onViewScheduled,
              }
            : onViewAll
            ? {
                label: "View All Trips",
                icon: <Eye className="h-4 w-4 mr-2" />,
                onClick: onViewAll,
              }
            : null,
          secondaryAction: onCreateTrip
            ? {
                label: "Create New Trip",
                icon: <Plus className="h-4 w-4 mr-2" />,
                onClick: onCreateTrip,
                variant: "outline" as const,
              }
            : null,
          illustration: "⏸️",
        }

      case 'today':
        return {
          icon: <Calendar className="h-16 w-16 text-amber-400/50" />,
          title: "No trips departing today",
          description: "You don't have any trips scheduled to depart within the next 24 hours",
          primaryAction: onViewAll
            ? {
                label: "View All Trips",
                icon: <Eye className="h-4 w-4 mr-2" />,
                onClick: onViewAll,
              }
            : null,
          secondaryAction: onCreateTrip
            ? {
                label: "Create Trip",
                icon: <Plus className="h-4 w-4 mr-2" />,
                onClick: onCreateTrip,
                variant: "outline" as const,
              }
            : null,
          illustration: "📅",
        }

      case 'week':
        return {
          icon: <Calendar className="h-16 w-16 text-purple-400/50" />,
          title: "No trips this week",
          description: "You don't have any trips scheduled for the next 7 days",
          primaryAction: onViewAll
            ? {
                label: "View All Trips",
                icon: <Eye className="h-4 w-4 mr-2" />,
                onClick: onViewAll,
              }
            : null,
          secondaryAction: onCreateTrip
            ? {
                label: "Create Trip",
                icon: <Plus className="h-4 w-4 mr-2" />,
                onClick: onCreateTrip,
                variant: "outline" as const,
              }
            : null,
          illustration: "📆",
        }

      case 'completed':
        return {
          icon: <CheckCircle className="h-16 w-16 text-green-400/50" />,
          title: "No completed trips yet",
          description: "Complete your first trip to see it here. Your trip history will help track your performance",
          primaryAction: onViewAll
            ? {
                label: "View Active Trips",
                icon: <TrendingUp className="h-4 w-4 mr-2" />,
                onClick: onViewAll,
              }
            : null,
          secondaryAction: onCreateTrip
            ? {
                label: "Create Trip",
                icon: <Plus className="h-4 w-4 mr-2" />,
                onClick: onCreateTrip,
                variant: "outline" as const,
              }
            : null,
          illustration: "✅",
        }

      default:
        return {
          icon: <Route className="h-16 w-16 text-muted-foreground/50" />,
          title: "No trips found",
          description: "Try adjusting your filters or create a new trip",
          primaryAction: onCreateTrip
            ? {
                label: "Create Trip",
                icon: <Plus className="h-4 w-4 mr-2" />,
                onClick: onCreateTrip,
              }
            : null,
          secondaryAction: null,
          illustration: "🔍",
        }
    }
  }

  const content = getEmptyStateContent()

  return (
    <Card className="border-dashed border-2">
      <CardContent className="flex flex-col items-center justify-center py-12 px-6 text-center">
        {/* Illustration */}
        <div className="mb-4 text-6xl" role="img" aria-label={content.illustration}>
          {content.illustration}
        </div>

        {/* Icon */}
        <div className="mb-4">{content.icon}</div>

        {/* Title */}
        <h3 className="text-xl font-semibold mb-2">{content.title}</h3>

        {/* Description */}
        <p className="text-muted-foreground mb-6 max-w-md">{content.description}</p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          {content.primaryAction && (
            <Button
              onClick={content.primaryAction.onClick}
              className="w-full sm:w-auto min-w-[160px]"
              size="lg"
            >
              {content.primaryAction.icon}
              {content.primaryAction.label}
            </Button>
          )}

          {content.secondaryAction && (
            <Button
              onClick={content.secondaryAction.onClick}
              variant={content.secondaryAction.variant}
              className="w-full sm:w-auto min-w-[160px]"
              size="lg"
            >
              {content.secondaryAction.icon}
              {content.secondaryAction.label}
            </Button>
          )}
        </div>

        {/* Additional info for certain states */}
        {filter === 'all' && completedCount > 0 && (
          <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-800">
              <CheckCircle className="h-4 w-4 inline mr-1" />
              You've completed <strong>{completedCount}</strong> {completedCount === 1 ? 'trip' : 'trips'} so far!
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
