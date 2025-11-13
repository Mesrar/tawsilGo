// app/driver/onboarding/components/vehicle-info-step.tsx
import { useForm, UseFormReturn } from "react-hook-form";
import { Step2Data } from "../../app/(site)/auth/signup/driver/page";
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface VehicleInfoStepProps {
  form: UseFormReturn<Step2Data>;
}

export function VehicleInfoStep({ form }: VehicleInfoStepProps) {
    const vehicleTypes = ["car", "van", "truck"] as const
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Vehicle Information</h2>
      <FormField
        control={form.control}
        name="vehicle_type"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Vehicle Type</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select vehicle type" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {vehicleTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="license_number"
        render={({ field }) => (
          <FormItem>
            <FormLabel>License Number</FormLabel>
            <FormControl>
              <Input placeholder="FR-123-AB" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="operating_zones"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Operating Zones</FormLabel>
            <FormControl>
              <Input placeholder="Casablanca, Paris" {...field} />
            </FormControl>
            <FormDescription>Separate multiple zones with commas</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="address"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Address</FormLabel>
            <FormControl>
              <Input placeholder="123 Main St, Casablanca" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="vehicle_capacity"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Vehicle Capacity (kg)</FormLabel>
            <FormControl>
              <Input
                type="number"
                placeholder="1000.5"
                {...field}
                onChange={(e) => field.onChange(Number.parseFloat(e.target.value))}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
