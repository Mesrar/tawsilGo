"use client"

import { useFormContext, type FieldPath } from "react-hook-form"
import { motion } from "framer-motion"
import type { ParcelFormSchema } from "@/lib/schema"
import { FormField, FormItem, FormLabel, FormMessage, FormControl } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { User, Mail, Phone, MapPin, type LucideIcon, TruckIcon, PackageIcon } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

const formFields: Array<{
  name: FieldPath<ParcelFormSchema["senderDetails"] | ParcelFormSchema["receiverDetails"]>
  label: string
  type: string
  placeholder: string
  icon: LucideIcon
  tooltip?: string
}> = [
  { 
    name: "name", 
    label: "Full Name", 
    type: "text", 
    placeholder: "John Doe", 
    icon: User,
    tooltip: "Enter the full legal name"
  },
  { 
    name: "email", 
    label: "Email Address", 
    type: "email", 
    placeholder: "john@example.com", 
    icon: Mail,
    tooltip: "For shipment notifications"
  },
  { 
    name: "phone", 
    label: "Phone Number", 
    type: "tel", 
    placeholder: "+1 234 567 890", 
    icon: Phone,
    tooltip: "With country code"
  },
  { 
    name: "address", 
    label: "Complete Address", 
    type: "text", 
    placeholder: "123 Main St, City, Country", 
    icon: MapPin,
    tooltip: "Include street, city, and postal code"
  },
]

const ContactForm = ({ type }: { type: "sender" | "receiver" }) => {
  const { control } = useFormContext<ParcelFormSchema>()

  return (
    <Card className="border-none shadow-sm">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-white dark:from-gray-800 dark:to-gray-900">
        <CardTitle className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/20">
            {type === "sender" ? (
              <TruckIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            ) : (
              <PackageIcon className="w-5 h-5 text-green-600 dark:text-green-400" />
            )}
          </div>
          <span>{type === "sender" ? "Sender" : "Receiver"} Information</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-6">
          {formFields.map((field) => (
            <FormField
              key={`${type}Details.${field.name}`}
              control={control}
              name={`${type}Details.${field.name}` as any}
              render={({ field: formField }) => (
                <FormItem>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <FormLabel className="flex items-center space-x-2">
                          <field.icon className="w-4 h-4 text-muted-foreground" />
                          <span>{field.label}</span>
                        </FormLabel>
                      </TooltipTrigger>
                      {field.tooltip && (
                        <TooltipContent>
                          <p>{field.tooltip}</p>
                        </TooltipContent>
                      )}
                    </Tooltip>
                  </TooltipProvider>
                  <FormControl>
                    <Input
                      type={field.type}
                      placeholder={field.placeholder}
                      {...formField}
                      value={formField.value as string}
                      className="focus:ring-2 focus:ring-primary"
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export function StepThree() {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
      }}
      initial="hidden"
      animate="visible"
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      <motion.div
        variants={{
          hidden: { opacity: 0, x: -20 },
          visible: { opacity: 1, x: 0 },
        }}
        transition={{ delay: 0.2 }}
      >
        <ContactForm type="sender" />
      </motion.div>
      
      <motion.div
        variants={{
          hidden: { opacity: 0, x: 20 },
          visible: { opacity: 1, x: 0 },
        }}
        transition={{ delay: 0.4 }}
      >
        <ContactForm type="receiver" />
      </motion.div>
    </motion.div>
  )
}