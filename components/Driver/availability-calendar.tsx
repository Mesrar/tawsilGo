"use client"
import React, { useState } from "react"
import { format, addDays, startOfWeek } from "date-fns"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { Info, Copy, CheckCircle2 } from "lucide-react"

const HOURS = Array.from({ length: 19 }, (_, i) => i + 6) // 6 AM to 12 AM

export function AvailabilityCalendar() {
  const [selectedDate] = useState(new Date())
  const [availability, setAvailability] = useState<{ [key: string]: boolean }>({})
  const [copySource, setCopySource] = useState<Date | null>(null)

  const weekStart = startOfWeek(selectedDate)
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i))

  const toggleAvailability = (day: Date, hour: number) => {
    const key = `${format(day, "yyyy-MM-dd")}-${hour}`
    setAvailability((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  const handleDragSelection = (day: Date, hour: number) => {
    // Implement drag selection logic here
  }

  const copyDaySchedule = (sourceDay: Date) => {
    setCopySource(sourceDay)
  }

  const applyCopiedSchedule = (targetDay: Date) => {
    if (!copySource) return
    const newAvailability = { ...availability }
    HOURS.forEach(hour => {
      const sourceKey = `${format(copySource, "yyyy-MM-dd")}-${hour}`
      const targetKey = `${format(targetDay, "yyyy-MM-dd")}-${hour}`
      newAvailability[targetKey] = availability[sourceKey] || false
    })
    setAvailability(newAvailability)
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto p-4">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Schedule Your Availability</h2>
          <p className="text-muted-foreground flex items-center gap-2 mt-1">
            <Info className="h-4 w-4" />
            Click or drag to select time slots
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setCopySource(null)}>
            <Copy className="mr-2 h-4 w-4" />
            Copy Day
          </Button>
          <Button variant="secondary">Save Changes</Button>
        </div>
      </div>

      <div className="border rounded-lg p-4 bg-muted/5">
        <ScrollArea className="h-[60vh] pr-4">
          <div className="grid grid-cols-1 md:grid-cols-8 gap-4 min-w-[800px]">
            {/* Time Column */}
            <div className="md:col-span-1 space-y-1 pt-8">
              {HOURS.map(hour => (
                <div key={hour} className="h-[40px] text-sm text-muted-foreground flex items-center">
                  {hour}:00
                </div>
              ))}
            </div>

            {/* Day Columns */}
            {weekDays.map(day => {
              const isWeekend = [0, 6].includes(day.getDay())
              return (
                <div key={day.toISOString()} 
                  className={cn("space-y-1", isWeekend && "bg-muted/10 rounded-lg p-2")}>
                  <div className="flex flex-col items-center gap-2 h-16">
                    <div className="font-medium text-center">
                      {format(day, "EEE")}
                      <span className="block text-sm text-muted-foreground">
                        {format(day, "dd/MM")}
                      </span>
                    </div>
                    {copySource?.toDateString() === day.toDateString() ? (
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                    ) : (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-6"
                        onClick={() => copySource ? applyCopiedSchedule(day) : copyDaySchedule(day)}
                      >
                        {copySource ? "Apply" : "Copy"}
                      </Button>
                    )}
                  </div>

                  {HOURS.map(hour => {
                    const key = `${format(day, "yyyy-MM-dd")}-${hour}`
                    return (
                      <div
                        key={key}
                        className={cn(
                          "h-[40px] rounded-md cursor-pointer transition-colors",
                          availability[key] 
                            ? "bg-green-500 hover:bg-green-600" 
                            : "bg-muted hover:bg-muted/50"
                        )}
                        onClick={() => toggleAvailability(day, hour)}
                        onMouseEnter={(e) => {
                          if (e.buttons === 1) handleDragSelection(day, hour)
                        }}
                        onMouseDown={() => handleDragSelection(day, hour)}
                      />
                    )
                  })}
                </div>
              )
            })}
          </div>
        </ScrollArea>
      </div>

      <div className="flex flex-col md:flex-row gap-4 justify-between items-center p-4 border rounded-lg">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 rounded-md bg-green-500" />
            <span className="text-sm">Available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 rounded-md bg-muted" />
            <span className="text-sm">Unavailable</span>
          </div>
        </div>
        <div className="text-sm text-muted-foreground">
          Selected hours: {Object.values(availability).filter(Boolean).length * 0.5} hours
        </div>
      </div>
    </div>
  )
}