"use client"

import { useFormContext } from "react-hook-form"
import { motion } from "framer-motion"
import { User, Building2 } from "lucide-react"
import { FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Card, CardContent } from "@/components/ui/card"
import type { ParcelFormSchema } from "@/lib/schema"

const RadioOption = ({ value, icon: Icon, label }: { value: string; icon: typeof User; label: string }) => {
  const { watch } = useFormContext<ParcelFormSchema>()
  const selectedValue = watch("interestedService")
  const isSelected = selectedValue === value

  return (
    <Card
      className={`w-40 h-40 cursor-pointer transition-all duration-300 ${
        isSelected ? "ring-2 ring-primary ring-offset-2" : "hover:shadow-md"
      }`}
    >
      <CardContent className="h-full flex flex-col items-center justify-center p-4">
        <motion.div
          initial={false}
          animate={{
            scale: isSelected ? 1.1 : 1,
            color: isSelected ? "var(--primary)" : "var(--muted-foreground)",
          }}
          transition={{ duration: 0.2 }}
        >
          <Icon size={48} />
        </motion.div>
        <motion.span
          className="mt-4 text-sm font-medium"
          initial={false}
          animate={{
            color: isSelected ? "var(--primary)" : "var(--foreground)",
          }}
          transition={{ duration: 0.2 }}
        >
          {label}
        </motion.span>
      </CardContent>
    </Card>
  )
}

export function StepOne() {
  const { control } = useFormContext<ParcelFormSchema>()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <FormField
        control={control}
        name="interestedService"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-lg font-semibold text-center block mb-4">Select your service type</FormLabel>
            <div className="flex flex-wrap gap-6 justify-center">
              <label>
                <input
                  {...field}
                  type="radio"
                  value="Particular"
                  className="sr-only"
                  checked={field.value === "Particular"}
                />
                <RadioOption value="Particular" icon={User} label="Particular" />
              </label>
              <label>
                <input
                  {...field}
                  type="radio"
                  value="Company"
                  className="sr-only"
                  checked={field.value === "Company"}
                />
                <RadioOption value="Company" icon={Building2} label="Company" />
              </label>
            </div>
            <FormMessage className="text-center mt-4" />
          </FormItem>
        )}
      />
    </motion.div>
  )
}

