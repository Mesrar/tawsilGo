import { UseFormReturn } from "react-hook-form";
import { DriverApplicationFormData, timezoneOptions } from "@/lib/driver-schemas";
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { IdCard, Phone, Globe, Award } from "lucide-react";

interface ApplicationStepProps {
  form: UseFormReturn<DriverApplicationFormData>;
}

export function ApplicationStep({ form }: ApplicationStepProps) {
  return (
    <Card className="border-none shadow-lg">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
            <IdCard className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <CardTitle className="text-2xl">Driver Application</CardTitle>
            <CardDescription>
              Provide your basic information to begin the driver registration process
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* License Number */}
        <FormField
          control={form.control}
          name="license_number"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base flex items-center gap-2">
                <IdCard className="h-4 w-4 text-slate-500" />
                Driver's License Number
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="DL123456789"
                  className="h-12"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Enter your valid driver's license number
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Phone Number */}
        <FormField
          control={form.control}
          name="phone_number"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base flex items-center gap-2">
                <Phone className="h-4 w-4 text-slate-500" />
                Phone Number
              </FormLabel>
              <FormControl>
                <Input
                  type="tel"
                  placeholder="+1234567890"
                  className="h-12"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Include country code (e.g., +1 for USA, +49 for Germany)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Timezone */}
        <FormField
          control={form.control}
          name="timezone"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base flex items-center gap-2">
                <Globe className="h-4 w-4 text-slate-500" />
                Timezone
              </FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Select your timezone" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="max-h-[300px]">
                  {timezoneOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>
                Select the timezone where you'll primarily operate
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Experience Years */}
        <FormField
          control={form.control}
          name="experience_years"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base flex items-center gap-2">
                <Award className="h-4 w-4 text-slate-500" />
                Years of Driving Experience (Optional)
              </FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min="0"
                  max="70"
                  placeholder="5"
                  className="h-12"
                  {...field}
                  onChange={(e) => {
                    const value = e.target.value === "" ? undefined : Number(e.target.value);
                    field.onChange(value);
                  }}
                  value={field.value ?? ""}
                />
              </FormControl>
              <FormDescription>
                How many years have you been driving professionally?
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
}
