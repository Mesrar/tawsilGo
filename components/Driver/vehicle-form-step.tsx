import { UseFormReturn } from "react-hook-form";
import { VehicleFormData, vehicleTypeOptions } from "@/lib/driver-schemas";
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Truck, Hash, Calendar, Palette, Box, Weight, Package } from "lucide-react";

interface VehicleFormStepProps {
  form: UseFormReturn<VehicleFormData>;
}

export function VehicleFormStep({ form }: VehicleFormStepProps) {
  return (
    <Card className="border-none shadow-lg">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
            <Truck className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <CardTitle className="text-2xl">Vehicle Information</CardTitle>
            <CardDescription>
              Tell us about the vehicle you'll use for deliveries
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Vehicle Name */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base flex items-center gap-2">
                <Truck className="h-4 w-4 text-slate-500" />
                Vehicle Name
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Toyota Camry 2020"
                  className="h-12"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                A descriptive name for your vehicle
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Vehicle Type */}
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base flex items-center gap-2">
                <Truck className="h-4 w-4 text-slate-500" />
                Vehicle Type
              </FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Select vehicle type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {vehicleTypeOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>
                Choose the type that best describes your vehicle
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Plate Number */}
        <FormField
          control={form.control}
          name="plate_number"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base flex items-center gap-2">
                <Hash className="h-4 w-4 text-slate-500" />
                Plate Number
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="ABC-1234"
                  className="h-12"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Your vehicle's license plate number
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Manufacture Year */}
          <FormField
            control={form.control}
            name="manufacture_year"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-slate-500" />
                  Year (Optional)
                </FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min="1900"
                    max={new Date().getFullYear() + 1}
                    placeholder="2020"
                    className="h-12"
                    {...field}
                    onChange={(e) => {
                      const value = e.target.value === "" ? undefined : Number(e.target.value);
                      field.onChange(value);
                    }}
                    value={field.value ?? ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Color */}
          <FormField
            control={form.control}
            name="color"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  <Palette className="h-4 w-4 text-slate-500" />
                  Color (Optional)
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Silver"
                    className="h-12"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Model */}
        <FormField
          control={form.control}
          name="model"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2">
                <Box className="h-4 w-4 text-slate-500" />
                Model (Optional)
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Camry"
                  className="h-12"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Divider */}
        <div className="pt-4 border-t">
          <h3 className="text-lg font-semibold mb-4">Capacity Information</h3>
          <p className="text-sm text-muted-foreground mb-6">
            Specify your vehicle's carrying capacity
          </p>
        </div>

        {/* Max Weight */}
        <FormField
          control={form.control}
          name="max_weight"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base flex items-center gap-2">
                <Weight className="h-4 w-4 text-slate-500" />
                Maximum Weight (kg)
              </FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min="0.1"
                  step="0.1"
                  placeholder="500"
                  className="h-12"
                  {...field}
                  onChange={(e) => {
                    const value = e.target.value === "" ? 0 : Number(e.target.value);
                    field.onChange(value);
                  }}
                  value={field.value || ""}
                />
              </FormControl>
              <FormDescription>
                Maximum weight your vehicle can carry in kilograms
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Max Volume */}
        <FormField
          control={form.control}
          name="max_volume"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base flex items-center gap-2">
                <Box className="h-4 w-4 text-slate-500" />
                Maximum Volume (m³)
              </FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min="0.1"
                  step="0.1"
                  placeholder="2.5"
                  className="h-12"
                  {...field}
                  onChange={(e) => {
                    const value = e.target.value === "" ? 0 : Number(e.target.value);
                    field.onChange(value);
                  }}
                  value={field.value || ""}
                />
              </FormControl>
              <FormDescription>
                Maximum cargo volume in cubic meters
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Max Packages */}
        <FormField
          control={form.control}
          name="max_packages"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base flex items-center gap-2">
                <Package className="h-4 w-4 text-slate-500" />
                Maximum Packages
              </FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min="1"
                  step="1"
                  placeholder="10"
                  className="h-12"
                  {...field}
                  onChange={(e) => {
                    const value = e.target.value === "" ? 1 : Number(e.target.value);
                    field.onChange(value);
                  }}
                  value={field.value || ""}
                />
              </FormControl>
              <FormDescription>
                Maximum number of packages you can deliver at once
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
}
