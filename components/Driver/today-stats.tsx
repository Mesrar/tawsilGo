"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Package, MapPin, Clock, DollarSign } from "lucide-react";
import { motion } from "framer-motion";

interface Stat {
  icon: React.ElementType;
  label: string;
  value: number;
  suffix: string;
  prefix?: string;
  color: string;
}

const stats: Stat[] = [
  {
    icon: Package,
    label: "Orders Completed",
    value: 12,
    suffix: "",
    color: "text-blue-600 bg-blue-100 dark:bg-blue-950/30",
  },
  {
    icon: DollarSign,
    label: "Today's Earnings",
    value: 280,
    prefix: "$",
    suffix: "",
    color: "text-emerald-600 bg-emerald-100 dark:bg-emerald-950/30",
  },
  {
    icon: MapPin,
    label: "Distance Traveled",
    value: 85,
    suffix: " mi",
    color: "text-purple-600 bg-purple-100 dark:bg-purple-950/30",
  },
  {
    icon: Clock,
    label: "Hours Worked",
    value: 7.5,
    suffix: " hrs",
    color: "text-amber-600 bg-amber-100 dark:bg-amber-950/30",
  },
];

function AnimatedNumber({ value, prefix = "", suffix = "" }: { value: number; prefix?: string; suffix?: string }) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = value;
    const duration = 1000; // 1 second
    const increment = end / (duration / 16); // 60fps

    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setDisplayValue(end);
        clearInterval(timer);
      } else {
        setDisplayValue(Math.floor(start * 10) / 10);
      }
    }, 16);

    return () => clearInterval(timer);
  }, [value]);

  return (
    <span className="text-3xl font-bold tabular-nums">
      {prefix}
      {displayValue.toLocaleString()}
      {suffix}
    </span>
  );
}

interface TodayStatsProps {
  className?: string;
}

export function TodayStats({ className }: TodayStatsProps) {
  return (
    <div className={className}>
      <h2 className="text-2xl font-bold mb-4">Today's Performance</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.3 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                    <AnimatedNumber
                      value={stat.value}
                      prefix={stat.prefix}
                      suffix={stat.suffix}
                    />
                  </div>
                  <div className={`rounded-full p-3 ${stat.color}`}>
                    <stat.icon className="h-5 w-5" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
