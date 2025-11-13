"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useFieldArray } from "react-hook-form";
import {
  Plus,
  X,
  MapPin,
  Calendar,
  DollarSign,
  Package,
  Loader2,
  Route,
  TrendingUp,
} from "lucide-react";
import { DateTimePicker } from "./date-time-picker";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { AddressAutocomplete } from "./address-autocomplete";

const priceSchema = z.object({
  basePrice: z.number().min(0.1, "Base price must be greater than 0"),
  pricePerKg: z.number().min(0.1, "Price per kg must be greater than 0"),
  pricePerKm: z.number().min(0, "Price per km must be 0 or greater"),
  minimumPrice: z.number().min(0, "Minimum price must be 0 or greater"),
  currency: z.string().min(1, "Currency is required"),
  weightThreshold: z.number().min(0, "Weight threshold must be 0 or greater"),
  premiumFactor: z.number().min(0, "Premium factor must be 0 or greater"),
});


const stopSchema = z.object({
  id: z.string().optional(), // Add optional ID field
  location: z.string().min(1, "Location is required"),
  arrivalTime: z.date(),
  stopType: z.enum(["pickup", "delivery", "both"]),
  order: z.number().int().positive("Order must be a positive integer"),
});

const tripSchema = z.object({
  origin: z.string().min(1, "Origin is required"),
  destination: z.string().min(1, "Destination is required"),
  departureTime: z.date(),
  capacity: z.number().min(0.1, "Capacity must be greater than 0"),
  price: priceSchema, // Now using the nested schema
  stops: z.array(stopSchema).optional(),
});

type TripFormValues = z.infer<typeof tripSchema>;

interface TripTemplate {
  id: string
  origin: string
  destination: string
  basePrice: number
  pricePerKg: number
  estimatedHours: number
  popular?: boolean
}

interface TripCreationFormProps {
  initialData?: TripTemplate
  onComplete?: () => void
}

export function TripCreationForm({ initialData, onComplete }: TripCreationFormProps) {
  const form = useForm<TripFormValues>({
    resolver: zodResolver(tripSchema),
    defaultValues: {
      origin: initialData?.origin || "",
      destination: initialData?.destination || "",
      departureTime: new Date(),
      capacity: 100,
      price: {
        basePrice: initialData?.basePrice || 10,
        pricePerKg: initialData?.pricePerKg || 2,
        pricePerKm: 0,
        minimumPrice: 0,
        currency: "EUR",
        weightThreshold: 0,
        premiumFactor: 0,
      },
      stops: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "stops",
  });

  const onSubmit = async (data: TripFormValues) => {
    try {
      // Format the data to match the API's expected structure
      const formattedData = {
        origin: data.origin,
        destination: data.destination,
        departureTime: data.departureTime.toISOString(),
        capacity: data.capacity,
        price: {
          basePrice: data.price.basePrice,
          pricePerKg: data.price.pricePerKg,
          pricePerKm: data.price.pricePerKm,
          minimumPrice: data.price.minimumPrice,
          currency: data.price.currency,
          weightThreshold: data.price.weightThreshold,
          premiumFactor: data.price.premiumFactor
        },
        stops: data.stops?.map((stop) => ({
          id: stop.id || crypto.randomUUID(), // Generate UUID if not present
          location: stop.location,
          arrivalTime: stop.arrivalTime.toISOString(),
          stopType: stop.stopType,
          order: stop.order,
        })),
      };

      const response = await fetch("/api/driver/trips/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formattedData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to create trip");
      }

      toast({
        title: "🎉 Trip Created!",
        description: "Your new trip has been scheduled successfully",
      });
      form.reset();
      onComplete?.();
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to create trip",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="shadow-lg">
      <CardHeader className="border-b">
        <CardTitle className="flex items-center gap-2">
          <Route className="h-6 w-6 text-primary" />
          <span className="bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
            Create New Trip
          </span>
        </CardTitle>
      </CardHeader>

      <CardContent className="pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* Origin & Destination */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="origin"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2 text-sm font-medium">
                      <MapPin className="h-4 w-4" />
                      Origin
                    </FormLabel>
                    <AddressAutocomplete
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="Start typing origin address..."
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="destination"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2 text-sm font-medium">
                      <MapPin className="h-4 w-4" />
                      Destination
                    </FormLabel>
                    <AddressAutocomplete
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="Start typing destination address..."
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Departure Time */}
            <FormField
              control={form.control}
              name="departureTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2 text-sm font-medium">
                    <Calendar className="h-4 w-4" />
                    Departure Time
                  </FormLabel>
                  <DateTimePicker
                    selected={field.value}
                    onSelect={field.onChange}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Capacity & Price */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="capacity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2 text-sm font-medium">
                      <Package className="h-4 w-4" />
                      Capacity (kg)
                    </FormLabel>
                    <Input
                      type="number"
                      step="0.1"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                      className="bg-background"
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="price.basePrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2 text-sm font-medium">Base Price</FormLabel>
                    <div className="relative">
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          {...field}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                          className="pl-8 bg-background"
                        />
                      </FormControl>
                      <span className="absolute left-3 top-2.5 text-muted-foreground">
                        €
                      </span>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Smart Pricing Suggestions */}
            <Card className="border-amber-200 bg-amber-50/30">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <TrendingUp className="h-4 w-4 text-amber-600" />
                  <h4 className="font-medium text-sm text-amber-800">Smart Pricing Recommendations</h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                  <div className="bg-white/60 rounded-lg p-3 border border-amber-200">
                    <p className="font-medium text-amber-900 mb-1">Conservative</p>
                    <p className="text-amber-700">Base: €8, Rate: €1.8/kg</p>
                    <p className="text-muted-foreground text-xs mt-1">Quick bookings, lower risk</p>
                  </div>
                  <div className="bg-white/60 rounded-lg p-3 border border-green-200">
                    <p className="font-medium text-green-900 mb-1">Balanced ✓</p>
                    <p className="text-green-700">Base: €10, Rate: €2.2/kg</p>
                    <p className="text-muted-foreground text-xs mt-1">Optimal for most routes</p>
                  </div>
                  <div className="bg-white/60 rounded-lg p-3 border border-blue-200">
                    <p className="font-medium text-blue-900 mb-1">Premium</p>
                    <p className="text-blue-700">Base: €15, Rate: €2.8/kg</p>
                    <p className="text-muted-foreground text-xs mt-1">Maximize earnings</p>
                  </div>
                </div>
                <div className="flex gap-2 mt-3">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      form.setValue("price.basePrice", 8);
                      form.setValue("price.pricePerKg", 1.8);
                    }}
                    className="text-xs"
                  >
                    Apply Conservative
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      form.setValue("price.basePrice", 10);
                      form.setValue("price.pricePerKg", 2.2);
                    }}
                    className="text-xs"
                  >
                    Apply Balanced
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      form.setValue("price.basePrice", 15);
                      form.setValue("price.pricePerKg", 2.8);
                    }}
                    className="text-xs"
                  >
                    Apply Premium
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Additional Price Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="price.pricePerKg"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2 text-sm font-medium">Price per kg *</FormLabel>
                    <div className="relative">
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          {...field}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                          className="pl-8 bg-background"
                        />
                      </FormControl>
                      <span className="absolute left-3 top-2.5 text-muted-foreground">
                        €/kg
                      </span>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="price.pricePerKm"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2 text-sm font-medium">Price per km</FormLabel>
                    <div className="relative">
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          {...field}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                          className="pl-8 bg-background"
                        />
                      </FormControl>
                      <span className="absolute left-3 top-2.5 text-muted-foreground">
                        €/km
                      </span>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Hidden Price Fields */}
            <FormField
              control={form.control}
              name="price.currency"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input type="hidden" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="price.minimumPrice"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input type="hidden" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="price.weightThreshold"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input type="hidden" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="price.premiumFactor"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input type="hidden" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            {/* Stops Section */}
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Route className="h-5 w-5" />
                  Intermediate Stops
                </h3>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() =>
                    append({
                      id: crypto.randomUUID(), // Generate UUID for each new stop
                      location: "",
                      arrivalTime: new Date(),
                      stopType: "pickup",
                      order: fields.length + 1,
                    })
                  }
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Stop
                </Button>
              </div>

              <AnimatePresence>
                {fields.map((field, index) => (
                  <motion.div
                    key={field.id}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Card className="mb-4">
                      <CardContent className="pt-4">
                        <div className="flex gap-4 items-start">
                          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                              control={form.control}
                              name={`stops.${index}.location`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Location</FormLabel>
                                  <FormControl>
                                    <Input
                                      placeholder="Enter stop location"
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name={`stops.${index}.arrivalTime`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Arrival Time</FormLabel>
                                  <FormControl>
                                    <DateTimePicker
                                      selected={field.value}
                                      onSelect={field.onChange}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name={`stops.${index}.stopType`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Stop Type</FormLabel>
                                  <Select
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                  >
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select stop type" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      <SelectItem value="pickup">
                                        Pickup
                                      </SelectItem>
                                      <SelectItem value="delivery">
                                        Delivery
                                      </SelectItem>
                                      <SelectItem value="both">Both</SelectItem>
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name={`stops.${index}.order`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Order</FormLabel>
                                  <FormControl>
                                    <Input
                                      type="number"
                                      placeholder="Enter stop order"
                                      {...field}
                                      onChange={(e) =>
                                        field.onChange(
                                          Number.parseInt(e.target.value)
                                        )
                                      }
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => remove(index)}
                            className="text-destructive hover:text-destructive/80"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            <Button
              type="submit"
              className="w-full h-12 text-lg font-semibold"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Creating Trip...
                </>
              ) : (
                "Create Trip"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
