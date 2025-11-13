// app/driver/dashboard/components/trips/trip-dashboard.tsx
'use client'

import { Progress } from '@/components/ui/progress'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'

import { error } from 'console'
import { Badge } from '@/components/ui/badge'
import { MapContainer } from 'react-leaflet'
import { Label } from '../ui/label'
import { useQuery } from '@tanstack/react-query'
import { ReactNode } from 'react'
import { DataTable } from './data-table'



const bookingColumns = [
  {
    accessorKey: "id",
    header: "Booking ID"
  },
  {
    accessorKey: "customer",
    header: "Customer"
  },
  {
    accessorKey: "weight",
    header: "Weight (kg)"
  },
  {
    accessorKey: "status",
    header: "Status"
  }
]

const statusVariants = {
  pending: "secondary",
  inProgress: "default",
  completed: "outline",
  cancelled: "destructive"
} as const

type TripStatus = keyof typeof statusVariants;

export function TripDashboard({ tripId }: { tripId: string }) {
    // Mocked data for testing
    const mockData = {
        usedCapacity: 750,
        totalCapacity: 1000,
        status: 'inProgress' as TripStatus,
        estimatedEarnings: 1250,
        bookings: [
            { id: '1', customer: 'John Doe', weight: 200, status: 'completed' },
            { id: '2', customer: 'Jane Smith', weight: 300, status: 'inProgress' },
            { id: '3', customer: 'Bob Wilson', weight: 250, status: 'pending' },
        ]
    };

    // Use mock data instead of API call
    const { data, error } = {
        data: mockData,
        error: null
    };
  
  if (error) return <div>Failed to load trip data</div>
  if (!data) return <div>Loading...</div>

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Trip Overview</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <Label>Capacity Utilization</Label>
            <Progress value={(data.usedCapacity / data.totalCapacity) * 100} />
            <div className="text-sm text-muted-foreground">
              {data.usedCapacity}kg / {data.totalCapacity}kg
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>Current Status</Label>
            <Badge variant={statusVariants[data.status] || 'default'}>
              {data.status}
            </Badge>
          </div>
          
          <div className="space-y-2">
            <Label>Estimated Earnings</Label>
            <div className="text-2xl font-bold">
              ${data.estimatedEarnings}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Route Map</CardTitle>
        </CardHeader>
        <CardContent className="h-[400px]">
          <MapContainer center={[51.505, -0.09]} zoom={13} style={{ height: '100%', width: '100%' }}>
            {/* Add your route visualization components here */}
          </MapContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Bookings</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={bookingColumns}
            data={data.bookings}
          />
        </CardContent>
      </Card>
    </div>
  )
}