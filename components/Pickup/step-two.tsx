"use client"

import { MapPin, Package, Send, Truck, Weight, Info, Ruler, Clock, Rocket, Home, Warehouse } from "lucide-react"
import { useFormContext } from "react-hook-form"
import { motion } from "framer-motion"
import { FormField, FormItem, FormLabel, FormMessage, FormControl, FormDescription } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { countries,countryCodeMap, type ParcelFormSchema } from "@/lib/schema"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import { FlagIcon, FlagIconCode } from "react-flag-kit";
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 }
}

export function StepTwo() {
  const { control, watch } = useFormContext<ParcelFormSchema>()
  const weight = watch("weight")

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="space-y-6"
    >
      <Card className="border-none shadow-lg">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-white dark:from-gray-800 dark:to-gray-900">
          <CardTitle className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/20">
              <Package className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <span>Shipping Details</span>
          </CardTitle>
        </CardHeader>
        
        <CardContent className="pt-6 space-y-8">
          {/* Origin & Destination */}
          <motion.div variants={itemVariants} className="grid sm:grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={control}
              name="departure"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <span>Departure Country</span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="w-4 h-4 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Select the shipment origin country</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder="Select country" />
                    </SelectTrigger>
                    <SelectContent>
                      {countries.map((country) => (
                        <SelectItem key={country} value={country}>
                          <div className="flex items-center gap-3">
                          <FlagIcon code={(countryCodeMap[country] || "UN") as FlagIconCode} className="w-5 h-5" />
                            <span>{country}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="destination"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <span>Destination Country</span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="w-4 h-4 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Select the shipment destination country</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder="Select country" />
                    </SelectTrigger>
                    <SelectContent>
                      {countries.map((country) => (
                        <SelectItem key={country} value={country}>
                          <div className="flex items-center gap-3">
                          <FlagIcon code={(countryCodeMap[country] || "UN") as FlagIconCode} className="w-5 h-5" />

                            <span>{country}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </motion.div>

          {/* Package Details */}
          <motion.div variants={itemVariants} className="grid sm:grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={control}
              name="dimensions"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <Ruler className="w-4 h-4" />
                    <span>Package Size</span>
                  </FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder="Select package size" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Standard">
                        <div className="space-y-1">
                          <span>Standard</span>
                          <p className="text-xs text-muted-foreground">Max 40x30x20cm</p>
                        </div>
                      </SelectItem>
                      <SelectItem value="Large">
                        <div className="space-y-1">
                          <span>Large</span>
                          <p className="text-xs text-muted-foreground">Max 60x40x30cm</p>
                        </div>
                      </SelectItem>
                      <SelectItem value="Custom">
                        <div className="space-y-1">
                          <span>Custom</span>
                          <p className="text-xs text-muted-foreground">Contact support</p>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="weight"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <Weight className="w-4 h-4" />
                    <span>Weight</span>
                    <span className="text-muted-foreground">(kilograms)</span>
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type="number"
                        placeholder="0.00"
                        className={cn(
                          "pr-12 h-12",
                          weight > 30 && "border-red-500 focus:ring-red-500"
                        )}
                        {...field}
                        value={field.value ?? ""}
                        onChange={(e) => {
                          const value = e.target.value
                          field.onChange(value === "" ? undefined : Number.parseFloat(value))
                        }}
                      />
                      <span className="absolute right-4 top-3.5 text-muted-foreground">kg</span>
                    </div>
                  </FormControl>
                  <FormDescription className={cn(
                    weight > 30 && "text-red-600"
                  )}>
                    {weight > 30 ? (
                      "Maximum weight exceeded (30kg limit)"
                    ) : (
                      "Precise weight helps calculate shipping costs"
                    )}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </motion.div>

          {/* Shipping Options */}
          <motion.div variants={itemVariants} className="grid sm:grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={control}
              name="sendingMode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <Truck className="w-4 h-4" />
                    <span>Collection Method</span>
                  </FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder="Select collection method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Point of Collection">
                        <div className="flex items-center gap-3">
                          <Warehouse className="w-5 h-5" />
                          <div>
                            <span>Collection Point</span>
                            <p className="text-xs text-muted-foreground">Drop off at nearest hub</p>
                          </div>
                        </div>
                      </SelectItem>
                      <SelectItem value="Home Pickup">
                        <div className="flex items-center gap-3">
                          <Home className="w-5 h-5" />
                          <div>
                            <span>Home Pickup</span>
                            <p className="text-xs text-muted-foreground">+ €8.00 fee</p>
                          </div>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="deliveryMode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>Delivery Speed</span>
                  </FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder="Select delivery speed" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Standard">
                        <div className="flex items-center gap-3">
                          <Truck className="w-5 h-5" />
                          <div>
                            <span>Standard (3-5 days)</span>
                            <p className="text-xs text-muted-foreground">Economy shipping</p>
                          </div>
                        </div>
                      </SelectItem>
                      <SelectItem value="Express">
                        <div className="flex items-center gap-3">
                          <Rocket className="w-5 h-5" />
                          <div>
                            <span>Express (24-48h)</span>
                            <p className="text-xs text-muted-foreground">Priority air shipping</p>
                          </div>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  )
}