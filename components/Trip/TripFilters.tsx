"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Filter, X } from "lucide-react"
import type { Trip } from "@/types/trip"
import { countTripsByFilter } from "@/lib/utils/trip-utils"

export type TripFilterType = 'all' | 'active' | 'today' | 'week' | 'completed'

interface TripFiltersProps {
  trips: Trip[]
  activeFilter: TripFilterType
  onFilterChange: (filter: TripFilterType) => void
  className?: string
}

interface FilterOption {
  id: TripFilterType
  label: string
  icon?: string
  description: string
}

const FILTER_OPTIONS: FilterOption[] = [
  {
    id: 'all',
    label: 'All Trips',
    icon: '📦',
    description: 'Show all trips',
  },
  {
    id: 'active',
    label: 'Active Now',
    icon: '🚛',
    description: 'Trips in progress',
  },
  {
    id: 'today',
    label: 'Today',
    icon: '📅',
    description: 'Departing within 24h',
  },
  {
    id: 'week',
    label: 'This Week',
    icon: '📆',
    description: 'Departing within 7 days',
  },
  {
    id: 'completed',
    label: 'Completed',
    icon: '✅',
    description: 'Finished trips',
  },
]

export function TripFilters({
  trips,
  activeFilter,
  onFilterChange,
  className,
}: TripFiltersProps) {
  const handleFilterClick = (filterId: TripFilterType) => {
    onFilterChange(filterId)
  }

  const handleClearFilter = () => {
    onFilterChange('all')
  }

  return (
    <div className={cn("space-y-2", className)}>
      {/* Filter Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium text-muted-foreground">Filter trips</span>
        </div>

        {activeFilter !== 'all' && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearFilter}
            className="h-7 text-xs"
          >
            <X className="h-3 w-3 mr-1" />
            Clear
          </Button>
        )}
      </div>

      {/* Horizontal Scrollable Filter Chips */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide snap-x snap-mandatory">
        {FILTER_OPTIONS.map((option) => {
          const count = countTripsByFilter(trips, option.id)
          const isActive = activeFilter === option.id

          return (
            <button
              key={option.id}
              onClick={() => handleFilterClick(option.id)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-full border-2 transition-all duration-200",
                "whitespace-nowrap snap-start flex-shrink-0 min-w-fit",
                "hover:scale-105 active:scale-95",
                isActive
                  ? "bg-primary text-primary-foreground border-primary shadow-md"
                  : "bg-background border-border hover:border-primary/50 hover:bg-accent"
              )}
              title={option.description}
            >
              {option.icon && <span className="text-base">{option.icon}</span>}
              <span className="font-medium text-sm">{option.label}</span>
              <Badge
                variant={isActive ? "secondary" : "outline"}
                className={cn(
                  "ml-1 text-xs px-1.5 py-0",
                  isActive && "bg-primary-foreground/20 text-primary-foreground border-primary-foreground/30"
                )}
              >
                {count}
              </Badge>
            </button>
          )
        })}
      </div>

      {/* Active Filter Description (Mobile) */}
      {activeFilter !== 'all' && (
        <div className="text-xs text-muted-foreground pl-1">
          {FILTER_OPTIONS.find(opt => opt.id === activeFilter)?.description}
        </div>
      )}
    </div>
  )
}

// Add custom scrollbar hiding CSS to global styles
// Or use this inline style component
export function TripFiltersWithStyle(props: TripFiltersProps) {
  return (
    <>
      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
      <TripFilters {...props} />
    </>
  )
}
