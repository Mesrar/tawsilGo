"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TrendingUp, DollarSign } from "lucide-react";
import { cn } from "@/lib/utils";

// Sample data - replace with real data from API
const weeklyData = [
  { day: "Mon", earnings: 120, label: "M" },
  { day: "Tue", earnings: 180, label: "T" },
  { day: "Wed", earnings: 150, label: "W" },
  { day: "Thu", earnings: 220, label: "T" },
  { day: "Fri", earnings: 280, label: "F" },
  { day: "Sat", earnings: 320, label: "S" },
  { day: "Sun", earnings: 250, label: "S" },
];

const monthlyData = [
  { day: "Week 1", earnings: 1050, label: "W1" },
  { day: "Week 2", earnings: 1250, label: "W2" },
  { day: "Week 3", earnings: 1150, label: "W3" },
  { day: "Week 4", earnings: 1420, label: "W4" },
];

interface BarChartProps {
  data: typeof weeklyData;
}

function SimpleBarChart({ data }: BarChartProps) {
  const maxValue = Math.max(...data.map((d) => d.earnings));

  return (
    <div className="space-y-2">
      <div className="flex items-end justify-between gap-2 h-[200px]">
        {data.map((item, index) => {
          const heightPercent = (item.earnings / maxValue) * 100;
          return (
            <div key={index} className="flex flex-col items-center flex-1 gap-2">
              <div className="w-full flex flex-col items-center justify-end h-full">
                <div className="text-xs font-medium text-muted-foreground mb-1">
                  ${item.earnings}
                </div>
                <div
                  className={cn(
                    "w-full rounded-t-md bg-gradient-to-t from-emerald-600 to-emerald-400",
                    "transition-all duration-500 ease-out hover:from-emerald-500 hover:to-emerald-300",
                    "cursor-pointer"
                  )}
                  style={{ height: `${heightPercent}%` }}
                  title={`${item.day}: $${item.earnings}`}
                />
              </div>
              <div className="text-xs font-medium text-muted-foreground">
                {item.label}
              </div>
            </div>
          );
        })}
      </div>
      <div className="flex justify-between text-xs text-muted-foreground px-1">
        {data.map((item, index) => (
          <span key={index} className="flex-1 text-center">
            {item.day}
          </span>
        ))}
      </div>
    </div>
  );
}

interface EarningsChartProps {
  className?: string;
}

export function EarningsChart({ className }: EarningsChartProps) {
  // Calculate total and trend
  const weeklyTotal = weeklyData.reduce((sum, item) => sum + item.earnings, 0);
  const monthlyTotal = monthlyData.reduce((sum, item) => sum + item.earnings, 0);

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Earnings Overview</CardTitle>
            <CardDescription>Your earnings performance over time</CardDescription>
          </div>
          <div className="flex items-center gap-2 text-emerald-600">
            <TrendingUp className="h-4 w-4" />
            <span className="text-sm font-medium">+12.5%</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="week" className="space-y-4">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="week">This Week</TabsTrigger>
            <TabsTrigger value="month">This Month</TabsTrigger>
          </TabsList>

          <TabsContent value="week" className="space-y-4">
            <div className="flex items-baseline gap-2">
              <div className="flex items-center gap-1">
                <DollarSign className="h-5 w-5 text-emerald-600" />
                <span className="text-3xl font-bold">{weeklyTotal}</span>
              </div>
              <span className="text-sm text-muted-foreground">this week</span>
            </div>
            <SimpleBarChart data={weeklyData} />
          </TabsContent>

          <TabsContent value="month" className="space-y-4">
            <div className="flex items-baseline gap-2">
              <div className="flex items-center gap-1">
                <DollarSign className="h-5 w-5 text-emerald-600" />
                <span className="text-3xl font-bold">{monthlyTotal}</span>
              </div>
              <span className="text-sm text-muted-foreground">this month</span>
            </div>
            <SimpleBarChart data={monthlyData} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
