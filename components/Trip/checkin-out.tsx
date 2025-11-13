// app/driver/dashboard/components/parcels/checkin-out.tsx
'use client'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Input } from '@/components/ui/input'
import { Form, FormField } from '@/components/ui/form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Label } from '@radix-ui/react-dropdown-menu'
import toast from 'react-hot-toast'
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card'

const checkinSchema = z.object({
  parcelId: z.string().min(1),
  location: z.string().min(1),
  action: z.enum(['checkin', 'checkout']),
})

export function ParcelCheckInOut({ tripId }: { tripId: string }) {
  const [scanning, setScanning] = useState(false)
  const form = useForm<z.infer<typeof checkinSchema>>({
    resolver: zodResolver(checkinSchema),
  })

  const handleScan = async () => {
    setScanning(true)
    // Mock QR scanning logic
    setTimeout(() => {
      form.setValue('parcelId', 'SCANNED-12345')
      setScanning(false)
    }, 1000)
  }

  const onSubmit = async (values: z.infer<typeof checkinSchema>) => {
    console.log(values)
    toast.success(`Parcel ${values.parcelId} has been ${values.action === 'checkin' ? 'checked in' : 'checked out'}`)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Parcel Check-In/Out</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              name="action"
              render={({ field }) => (
                <div className="flex items-center gap-4">
                  <Label>Action Type:</Label>
                  <Switch
                    checked={field.value === 'checkout'}
                    onCheckedChange={checked => 
                      field.onChange(checked ? 'checkout' : 'checkin')
                    }
                  />
                  <Label>
                    {field.value === 'checkin' ? 'Check-In' : 'Check-Out'}
                  </Label>
                </div>
              )}
            />

            <FormField
              name="parcelId"
              render={({ field }) => (
                <div className="flex gap-2">
                  <Input
                    {...field}
                    placeholder="Scan or enter parcel ID"
                    disabled={scanning}
                  />
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={handleScan}
                    disabled={scanning}
                  >
                    {scanning ? 'Scanning...' : 'Scan QR'}
                  </Button>
                </div>
              )}
            />

            <FormField
              name="location"
              render={({ field }) => (
                <Input {...field} placeholder="location" />

              )}
            />

            <Button type="submit" className="w-full">
              Confirm {form.watch('action') === 'checkin' ? 'Check-In' : 'Check-Out'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}