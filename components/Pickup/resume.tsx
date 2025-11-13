"use client"

import { useFormContext } from "react-hook-form"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, User, MapPin, Truck, Mail, Phone, Home, Clock, Shield, CreditCard, Rocket } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import type { ParcelFormSchema } from "@/lib/schema"

const DetailItem = ({ 
  icon: Icon, 
  label, 
  value, 
  status,
  warning
}: { 
  icon: React.ElementType
  label: string
  value: string
  status?: "success" | "warning" | "error"
  warning?: string
}) => (
  <li className="flex items-start gap-3 py-2">
    <span className="mt-1">
      <Icon className={`h-5 w-5 ${
        status === "success" ? "text-green-500" :
        status === "warning" ? "text-amber-500" :
        status === "error" ? "text-red-500" : "text-blue-500"
      }`} />
    </span>
    <div className="flex-1">
      <div className="flex items-baseline gap-2">
        <span className="font-medium text-gray-700 dark:text-gray-300">{label}:</span>
        <span className="text-gray-600 dark:text-gray-400">{value || "Not specified"}</span>
      </div>
      {warning && (
        <span className="text-xs text-amber-600 dark:text-amber-400">{warning}</span>
      )}
    </div>
  </li>
)

const ContactSection = ({ 
  title, 
  details,
  type 
}: { 
  title: string
  details: any
  type: "sender" | "receiver"
}) => (
  <motion.section 
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    className="space-y-4"
  >
    <div className="flex items-center gap-3">
      <div className={`p-2 rounded-lg ${
        type === "sender" ? "bg-blue-100 dark:bg-blue-900/20" : "bg-purple-100 dark:bg-purple-900/20"
      }`}>
        <User className={`h-6 w-6 ${
          type === "sender" ? "text-blue-600 dark:text-blue-400" : "text-purple-600 dark:text-purple-400"
        }`} />
      </div>
      <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">{title}</h3>
    </div>
    <Card className="shadow-lg">
      <CardContent className="p-6">
        <ul className="space-y-3">
          <DetailItem icon={User} label="Name" value={details?.name} />
          <DetailItem icon={Mail} label="Email" value={details?.email} />
          <DetailItem icon={Phone} label="Phone" value={details?.phone} />
          <DetailItem 
            icon={Home} 
            label="Address" 
            value={details?.address}
            warning={!details?.address ? "Complete address required for delivery" : undefined}
          />
        </ul>
      </CardContent>
    </Card>
  </motion.section>
)

const Resume = () => {
  const { getValues } = useFormContext<ParcelFormSchema>()
  const data = getValues()

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-4xl mx-auto"
    >
      <Card className="overflow-hidden shadow-2xl">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-700 dark:to-purple-800 p-8">
          <div className="flex items-center justify-center gap-4">
            <Package className="h-8 w-8 text-white" />
            <CardTitle className="text-3xl font-bold text-white">Shipping Summary</CardTitle>
          </div>
        </CardHeader>

        <CardContent className="p-8 space-y-8">
          <div className="grid md:grid-cols-2 gap-8">
            <ContactSection title="Sender Information" details={data.senderDetails} type="sender" />
            <ContactSection title="Receiver Information" details={data.receiverDetails} type="receiver" />
          </div>

          <Separator className="bg-gray-200 dark:bg-gray-700" />

          <motion.section 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-900/20">
                <Package className="h-6 w-6 text-amber-600 dark:text-amber-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Parcel & Shipping Details</h3>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <Card className="border border-blue-100 dark:border-blue-900/30">
                <CardContent className="p-6">
                  <ul className="space-y-3">
                    <DetailItem 
                      icon={MapPin} 
                      label="Origin" 
                      value={data.departure}
                      status={data.departure === data.destination ? "error" : undefined}
                      warning={data.departure === data.destination ? "Origin and destination cannot be same" : undefined}
                    />
                    <DetailItem icon={MapPin} label="Destination" value={data.destination} />
                    <DetailItem icon={Package} label="Dimensions" value={data.dimensions} />
                    <DetailItem 
                      icon={Truck} 
                      label="Weight" 
                      value={`${data.weight} kg`}
                      status={data.weight > 30 ? "error" : undefined}
                      warning={data.weight > 30 ? "Maximum weight exceeded (30kg limit)" : undefined}
                    />
                  </ul>
                </CardContent>
              </Card>

              <Card className="border border-purple-100 dark:border-purple-900/30">
                <CardContent className="p-6">
                  <ul className="space-y-3">
                    <DetailItem 
                      icon={data.sendingMode === "Home pick" ? Home : Truck}
                      label="Collection"
                      value={data.sendingMode}
                    />
                    <DetailItem 
                      icon={data.deliveryMode === "Express" ? Rocket : Clock}
                      label="Delivery"
                      value={data.deliveryMode}
                    />
                    <DetailItem 
                      icon={Shield} 
                      label="Insurance" 
                      value="Included"
                      status="success"
                    />
                    <DetailItem 
                      icon={CreditCard}
                      label="Payment Method"
                      value="Credit Card •••• 1234"
                    />
                  </ul>
                </CardContent>
              </Card>
            </div>
          </motion.section>

          <Separator className="bg-gray-200 dark:bg-gray-700" />

          <motion.div 
            className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg"
            initial={{ y: 20 }}
            animate={{ y: 0 }}
          >
            <div className="flex items-center gap-3">
              <Truck className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              <span className="font-medium text-gray-700 dark:text-gray-300">
                Estimated Delivery: {data.deliveryMode === "Express" ? "1-2 business days" : "3-5 business days"}
              </span>
            </div>
            <Badge 
              variant="outline" 
              className="bg-green-100 text-green-800 dark:bg-green-800/30 dark:text-green-200"
            >
              Tracking Number: {Math.random().toString(36).substring(2, 10).toUpperCase()}
            </Badge>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

export default Resume