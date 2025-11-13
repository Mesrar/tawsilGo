"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Power, PowerOff } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Status, StatusIndicator, StatusLabel } from "@/components/ui/status";
import { cn } from "@/lib/utils";

interface AvailabilityToggleProps {
  isAvailable?: boolean;
  onToggle?: (available: boolean) => void;
  className?: string;
}

export function AvailabilityToggle({
  isAvailable = false,
  onToggle,
  className,
}: AvailabilityToggleProps) {
  const [available, setAvailable] = useState(isAvailable);

  const handleToggle = (checked: boolean) => {
    setAvailable(checked);
    onToggle?.(checked);
  };

  return (
    <Card className={cn("border-2", className, available ? "border-emerald-500/50 bg-emerald-50/50 dark:bg-emerald-950/20" : "border-gray-200 dark:border-gray-800")}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <motion.div
              animate={{
                scale: available ? [1, 1.1, 1] : 1,
              }}
              transition={{
                duration: 0.5,
                repeat: available ? Infinity : 0,
                repeatDelay: 2,
              }}
              className={cn(
                "flex h-14 w-14 items-center justify-center rounded-full",
                available
                  ? "bg-emerald-500 text-white"
                  : "bg-gray-200 text-gray-500 dark:bg-gray-800 dark:text-gray-400"
              )}
            >
              {available ? <Power className="h-7 w-7" /> : <PowerOff className="h-7 w-7" />}
            </motion.div>
            <div className="space-y-1">
              <h3 className="text-lg font-semibold">Availability Status</h3>
              <Status status={available ? "online" : "offline"} className="w-fit">
                <StatusIndicator />
                <StatusLabel />
              </Status>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <Switch
              checked={available}
              onCheckedChange={handleToggle}
              className="data-[state=checked]:bg-emerald-500"
            />
            <span className="text-xs text-muted-foreground">
              {available ? "You're accepting orders" : "You're offline"}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
