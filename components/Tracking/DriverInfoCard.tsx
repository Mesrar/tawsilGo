"use client";

import { motion } from "framer-motion";
import { Phone, MessageCircle, Star, ShieldCheck, Bus, AlertCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import type { DriverInfo } from "@/types/booking";

interface DriverInfoCardProps {
  driver: DriverInfo;
  contactEnabled: boolean;
  isDelayed?: boolean;
  onContactDriver?: () => void;
  onCallDriver?: () => void;
}

export function DriverInfoCard({
  driver,
  contactEnabled,
  isDelayed = false,
  onContactDriver,
  onCallDriver,
}: DriverInfoCardProps) {
  const {
    name,
    photo,
    rating,
    completedDeliveries,
    isVerified,
    phone,
    vehicleInfo,
  } = driver;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.2 }}
    >
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
            Your Driver
          </h3>

          {/* Driver Profile */}
          <div className="flex items-start gap-4 mb-6">
            {/* Avatar */}
            <div className="relative flex-shrink-0">
              {photo ? (
                <img
                  src={photo}
                  alt={name}
                  className="h-20 w-20 rounded-full object-cover border-2 border-moroccan-mint/20"
                />
              ) : (
                <div className="h-20 w-20 rounded-full bg-moroccan-mint/20 flex items-center justify-center">
                  <span className="text-2xl font-bold text-moroccan-mint">
                    {name.charAt(0)}
                  </span>
                </div>
              )}
              {isVerified && (
                <div className="absolute -bottom-1 -right-1 h-7 w-7 rounded-full bg-moroccan-mint flex items-center justify-center border-2 border-white dark:border-slate-900">
                  <ShieldCheck className="h-4 w-4 text-white" />
                </div>
              )}
            </div>

            {/* Driver Info */}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="text-xl font-bold text-slate-900 dark:text-white">
                  {name}
                </h4>
                {isVerified && (
                  <Badge className="bg-moroccan-mint text-white text-xs">
                    Verified
                  </Badge>
                )}
              </div>

              {/* Rating */}
              <div className="flex items-center gap-2 mb-2">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-moroccan-gold text-moroccan-gold" />
                  <span className="text-lg font-bold text-slate-900 dark:text-white">
                    {rating.toFixed(1)}
                  </span>
                </div>
                <span className="text-sm text-slate-500 dark:text-slate-400">
                  ({completedDeliveries} deliveries)
                </span>
              </div>

              {/* Vehicle Info */}
              {vehicleInfo && (
                <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                  <Bus className="h-4 w-4" />
                  <span>
                    {vehicleInfo.type} • {vehicleInfo.company}
                  </span>
                  {vehicleInfo.busNumber && (
                    <Badge variant="outline" className="text-xs">
                      #{vehicleInfo.busNumber}
                    </Badge>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Contact Options */}
          {contactEnabled ? (
            <div className="space-y-3">
              {isDelayed && (
                <Alert className="border-amber-200 dark:border-amber-900 bg-amber-50 dark:bg-amber-900/20">
                  <AlertCircle className="h-4 w-4 text-amber-600" />
                  <AlertDescription className="text-sm text-amber-800 dark:text-amber-300">
                    Your delivery is running behind schedule. You can now contact {name.split(' ')[0]} directly for updates.
                  </AlertDescription>
                </Alert>
              )}

              <div className="grid grid-cols-2 gap-3">
                <Button
                  onClick={onContactDriver}
                  variant="default"
                  className="bg-moroccan-mint hover:bg-moroccan-mint-600"
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Chat
                </Button>
                {phone && isDelayed && (
                  <Button
                    onClick={onCallDriver}
                    variant="outline"
                    className="border-moroccan-mint text-moroccan-mint hover:bg-moroccan-mint/10"
                  >
                    <Phone className="h-4 w-4 mr-2" />
                    Call
                  </Button>
                )}
              </div>

              <p className="text-xs text-slate-500 dark:text-slate-400 text-center">
                All conversations are logged for quality and safety
              </p>
            </div>
          ) : (
            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg text-center">
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Driver contact will be available once your package is out for delivery or if there's a delay.
              </p>
            </div>
          )}

          {/* Driver Stats */}
          <div className="mt-6 pt-6 border-t grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-moroccan-mint">{rating.toFixed(1)}</p>
              <p className="text-xs text-slate-600 dark:text-slate-400">Rating</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-moroccan-mint">
                {completedDeliveries}
              </p>
              <p className="text-xs text-slate-600 dark:text-slate-400">Deliveries</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-moroccan-mint">
                {Math.floor((rating / 5) * 100)}%
              </p>
              <p className="text-xs text-slate-600 dark:text-slate-400">Success Rate</p>
            </div>
          </div>

          {/* Trust Indicators */}
          <div className="mt-6 pt-6 border-t">
            <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">
              Safety Features
            </h4>
            <div className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-green-600" />
                <span>Background-checked & verified driver</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-green-600" />
                <span>Climate-controlled cargo hold</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-green-600" />
                <span>GPS tracked throughout journey</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-green-600" />
                <span>Insurance coverage up to €500</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
