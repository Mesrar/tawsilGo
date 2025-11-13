"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AvailabilityCalendar } from "./availability-calendar"
import { ServiceZoneManager } from "./service-zone-manager"

export function DriverAvailability() {
  const [activeTab, setActiveTab] = useState("availability")

  return (
    <div className="container mx-auto p-4 space-y-8">
      <h1 className="text-3xl font-bold">Manage Your Availability</h1>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="availability">Availability Calendar</TabsTrigger>
          <TabsTrigger value="zones">Service Zones</TabsTrigger>
        </TabsList>
        <TabsContent value="availability">
          <AvailabilityCalendar />
        </TabsContent>
        <TabsContent value="zones">
          <ServiceZoneManager />
        </TabsContent>
      </Tabs>
    </div>
  )
}

