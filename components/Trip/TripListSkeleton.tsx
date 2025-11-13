"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

interface TripListSkeletonProps {
  count?: number
  isMobile?: boolean
}

export function TripListSkeleton({ count = 3, isMobile = false }: TripListSkeletonProps) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, index) => (
        <TripCardSkeleton key={index} isMobile={isMobile} />
      ))}
    </div>
  )
}

function TripCardSkeleton({ isMobile }: { isMobile: boolean }) {
  return (
    <Card className="transition-all duration-200">
      <CardContent className="p-4 space-y-3">
        {/* Header: Status Badge + Time */}
        <div className="flex justify-between items-start">
          <Skeleton className="h-6 w-24 rounded-full" />
          <Skeleton className="h-5 w-32 rounded" />
        </div>

        {/* Route with Flags */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            {/* Origin */}
            <div className="flex items-center gap-2 flex-1">
              <Skeleton className="h-8 w-8 rounded" />
              <div className="flex-1 space-y-1">
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-3 w-16" />
              </div>
            </div>

            {/* Arrow */}
            <Skeleton className="h-5 w-5 rounded mx-2" />

            {/* Destination */}
            <div className="flex items-center gap-2 flex-1">
              <Skeleton className="h-8 w-8 rounded" />
              <div className="flex-1 space-y-1">
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-3 w-16" />
              </div>
            </div>
          </div>
        </div>

        {/* Key Metrics Row */}
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 space-y-2">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-6 w-20" />
            <Skeleton className="h-3 w-16" />
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 space-y-2">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-6 w-20" />
            <Skeleton className="h-3 w-16" />
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 space-y-2">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-6 w-20" />
            <Skeleton className="h-3 w-16" />
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-1">
          <div className="flex justify-between">
            <Skeleton className="h-3 w-32" />
            <Skeleton className="h-3 w-8" />
          </div>
          <Skeleton className="h-2 w-full rounded-full" />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-1">
          <Skeleton className="h-11 flex-1 rounded-md" />
          <Skeleton className="h-11 w-20 rounded-md" />
          {!isMobile && <Skeleton className="h-11 w-20 rounded-md" />}
        </div>
      </CardContent>
    </Card>
  )
}

// Loading state for filters
export function TripFiltersSkeleton() {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-7 w-16 rounded" />
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2">
        {Array.from({ length: 5 }).map((_, index) => (
          <Skeleton key={index} className="h-9 w-32 rounded-full flex-shrink-0" />
        ))}
      </div>
    </div>
  )
}

// Loading state for stats cards
export function TripStatsSkeleton({ count = 2 }: { count?: number }) {
  return (
    <div className={cn("grid gap-3", count === 2 ? "grid-cols-2" : "grid-cols-4")}>
      {Array.from({ length: count }).map((_, index) => (
        <Card key={index} className="bg-gray-50 border-gray-200">
          <CardContent className="p-4 space-y-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-8 w-12" />
            <Skeleton className="h-3 w-24" />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
