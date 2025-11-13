"use client";

import React from "react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

// UI Components
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

// Icons
import {
  TrendingUp,
  TrendingDown,
  Clock,
  Users,
  DollarSign,
  Star,
  ArrowUp,
  ArrowDown,
  CheckCircle,
  XCircle,
} from "lucide-react";

interface DemoStats {
  conversionRate: number;
  avgCompletionTime: number;
  dropOffRate: number;
  userSatisfaction: number;
  totalBookings: number;
  revenue: number;
}

interface FlowComparisonProps {
  originalStats: DemoStats;
  smartStats: DemoStats;
  formatCurrency: (amount: number) => string;
  formatTime: (seconds: number) => string;
}

interface ComparisonMetric {
  key: keyof DemoStats;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  formatter?: (value: number) => string;
  higherIsBetter: boolean;
  unit?: string;
}

export function FlowComparison({
  originalStats,
  smartStats,
  formatCurrency,
  formatTime,
}: FlowComparisonProps) {
  const t = useTranslations('booking.demo.comparison');

  const metrics: ComparisonMetric[] = [
    {
      key: 'conversionRate',
      label: t('metrics.conversion'),
      icon: TrendingUp,
      higherIsBetter: true,
      unit: '%',
    },
    {
      key: 'avgCompletionTime',
      label: t('metrics.completionTime'),
      icon: Clock,
      higherIsBetter: false,
      formatter: formatTime,
    },
    {
      key: 'dropOffRate',
      label: t('metrics.dropOff'),
      icon: Users,
      higherIsBetter: false,
      unit: '%',
    },
    {
      key: 'userSatisfaction',
      label: t('metrics.satisfaction'),
      icon: Star,
      higherIsBetter: true,
      unit: '/5.0',
    },
    {
      key: 'revenue',
      label: t('metrics.revenue'),
      icon: DollarSign,
      higherIsBetter: true,
      formatter: formatCurrency,
    },
  ];

  const calculateImprovement = (original: number, smart: number, higherIsBetter: boolean) => {
    if (original === 0) return 0;
    const change = ((smart - original) / original) * 100;
    return higherIsBetter ? change : -change;
  };

  const getImprovementColor = (improvement: number) => {
    if (improvement > 0) return 'text-green-600';
    if (improvement < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  const getProgressColor = (improvement: number) => {
    if (improvement > 0) return 'bg-green-500';
    if (improvement < 0) return 'bg-red-500';
    return 'bg-gray-500';
  };

  return (
    <div className="space-y-6">
      {/* Summary Card */}
      <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
        <CardContent className="p-6">
          <div className="text-center">
            <div className="text-sm text-green-700 font-medium mb-2">{t('overallImprovement')}</div>
            <div className="text-4xl font-bold text-green-600 mb-1">
              +{calculateImprovement(originalStats.conversionRate, smartStats.conversionRate, true).toFixed(0)}%
            </div>
            <div className="text-sm text-green-600">{t('conversionLift')}</div>
          </div>
        </CardContent>
      </Card>

      {/* Metrics Comparison */}
      <div className="space-y-4">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          const originalValue = originalStats[metric.key];
          const smartValue = smartStats[metric.key];
          const improvement = calculateImprovement(originalValue, smartValue, metric.higherIsBetter);
          const formattedOriginal = metric.formatter ? metric.formatter(originalValue) : `${originalValue}${metric.unit || ''}`;
          const formattedSmart = metric.formatter ? metric.formatter(smartValue) : `${smartValue}${metric.unit || ''}`;

          if (smartValue === 0 && metric.key !== 'avgCompletionTime') {
            return null; // Skip metrics that haven't been calculated yet
          }

          return (
            <motion.div
              key={metric.key}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: metrics.indexOf(metric) * 0.1 }}
            >
              <Card className="overflow-hidden">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Icon className="h-4 w-4 text-gray-600" />
                      <span className="font-medium text-sm">{metric.label}</span>
                    </div>
                    {smartValue > 0 && (
                      <Badge
                        variant={improvement > 0 ? "default" : "secondary"}
                        className={cn(
                          "flex items-center gap-1",
                          improvement > 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                        )}
                      >
                        {improvement > 0 ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
                        {Math.abs(improvement).toFixed(0)}%
                      </Badge>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-3">
                    <div>
                      <div className="text-xs text-gray-500 mb-1">{t('original')}</div>
                      <div className="font-semibold">{formattedOriginal}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 mb-1">{t('smart')}</div>
                      <div className={cn("font-semibold", getImprovementColor(improvement))}>
                        {smartValue > 0 ? formattedSmart : '--'}
                      </div>
                    </div>
                  </div>

                  {smartValue > 0 && (
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>{t('improvement')}</span>
                        <span className={getImprovementColor(improvement)}>
                          {improvement > 0 ? '+' : ''}{improvement.toFixed(1)}%
                        </span>
                      </div>
                      <Progress
                        value={Math.min(Math.abs(improvement), 100)}
                        className="h-2"
                        indicatorClassName={getProgressColor(improvement)}
                      />
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Key Insights */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <h4 className="font-medium text-blue-900 mb-3">{t('insights.title')}</h4>
          <div className="space-y-2">
            <div className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-blue-800">{t('insights.conversion')}</p>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-blue-800">{t('insights.time')}</p>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-blue-800">{t('insights.experience')}</p>
            </div>
            {smartStats.revenue > 0 && (
              <div className="flex items-start gap-2">
                <DollarSign className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-blue-800">
                  {t('insights.revenue', { revenue: formatCurrency(smartStats.revenue) })}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}