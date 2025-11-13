"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Star, TrendingUp, Award, Target } from "lucide-react";
import { cn } from "@/lib/utils";

interface PerformanceCardProps {
  rating?: number;
  totalDeliveries?: number;
  successRate?: number;
  onTimeRate?: number;
  className?: string;
}

export function PerformanceCard({
  rating = 4.8,
  totalDeliveries = 234,
  successRate = 98,
  onTimeRate = 95,
  className,
}: PerformanceCardProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Award className="h-5 w-5 text-amber-500" />
          Performance Metrics
        </CardTitle>
        <CardDescription>Your delivery performance statistics</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Rating Section */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">Customer Rating</p>
            <div className="flex items-center gap-2">
              <span className="text-4xl font-bold">{rating}</span>
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={cn(
                      "h-5 w-5",
                      star <= Math.round(rating)
                        ? "fill-amber-500 text-amber-500"
                        : "text-gray-300 dark:text-gray-700"
                    )}
                  />
                ))}
              </div>
            </div>
            <p className="text-xs text-muted-foreground">Based on {totalDeliveries} deliveries</p>
          </div>
          <div className="rounded-full bg-amber-100 dark:bg-amber-950/30 p-4">
            <TrendingUp className="h-8 w-8 text-amber-600" />
          </div>
        </div>

        <div className="h-px bg-border" />

        {/* Metrics Section */}
        <div className="space-y-4">
          {/* Success Rate */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">Delivery Success Rate</span>
              <span className="text-emerald-600 font-semibold">{successRate}%</span>
            </div>
            <Progress value={successRate} className="h-2" />
          </div>

          {/* On-Time Rate */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">On-Time Delivery Rate</span>
              <span className="text-blue-600 font-semibold">{onTimeRate}%</span>
            </div>
            <Progress value={onTimeRate} className="h-2" />
          </div>
        </div>

        {/* Achievement Badge */}
        {rating >= 4.5 && successRate >= 95 && (
          <div className="rounded-lg border border-amber-200 bg-amber-50 dark:border-amber-900/30 dark:bg-amber-950/20 p-3">
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5 text-amber-600" />
              <div className="flex-1">
                <p className="text-sm font-medium text-amber-900 dark:text-amber-100">
                  Top Performer
                </p>
                <p className="text-xs text-amber-700 dark:text-amber-300">
                  You're in the top 10% of drivers!
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
