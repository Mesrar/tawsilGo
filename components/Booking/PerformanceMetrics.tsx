"use client";

import React from "react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

// UI Components
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

// Icons
import {
  TrendingUp,
  Clock,
  Users,
  DollarSign,
  Target,
  ArrowRight,
} from "lucide-react";

interface DemoStats {
  conversionRate: number;
  avgCompletionTime: number;
  dropOffRate: number;
  userSatisfaction: number;
  totalBookings: number;
  revenue: number;
}

interface PerformanceMetricsProps {
  original: DemoStats;
  smart: DemoStats;
  formatCurrency: (amount: number) => string;
  formatTime: (seconds: number) => string;
}

interface Metric {
  label: string;
  value: string;
  change: number;
  unit: string;
  icon: React.ComponentType<{ className?: string }>;
}

export function PerformanceMetrics({
  original,
  smart,
  formatCurrency,
  formatTime,
}: PerformanceMetricsProps) {
  const t = useTranslations('booking.demo.performance');

  const calculateROI = () => {
    const additionalRevenue = smart.revenue - original.revenue;
    const improvementPercent = ((smart.conversionRate - original.conversionRate) / original.conversionRate) * 100;
    return {
      additionalRevenue,
      improvementPercent,
      roiPerPercent: additionalRevenue / improvementPercent,
    };
  };

  const roi = calculateROI();

  const metrics: Metric[] = [
    {
      label: t('conversionRate'),
      value: `${smart.conversionRate.toFixed(1)}%`,
      change: ((smart.conversionRate - original.conversionRate) / original.conversionRate) * 100,
      unit: '%',
      icon: TrendingUp,
    },
    {
      label: t('completionTime'),
      value: formatTime(smart.avgCompletionTime),
      change: -((smart.avgCompletionTime - original.avgCompletionTime) / original.avgCompletionTime) * 100,
      unit: '%',
      icon: Clock,
    },
    {
      label: t('dropOffRate'),
      value: `${smart.dropOffRate.toFixed(1)}%`,
      change: -((smart.dropOffRate - original.dropOffRate) / original.dropOffRate) * 100,
      unit: '%',
      icon: Users,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Headline Metrics */}
      <div className="text-center py-6">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-full font-medium"
        >
          <Target className="h-4 w-4" />
          {((smart.conversionRate - original.conversionRate) / original.conversionRate * 100).toFixed(0)}% {t('conversionImprovement')}
        </motion.div>
      </div>

      {/* Individual Metrics */}
      <div className="space-y-4">
        {metrics.map((metric, index) => {
          const Icon = metric.icon;
          const isPositive = metric.change > 0;

          return (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="overflow-hidden">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${
                        isPositive ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'
                      }`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="font-medium text-sm">{metric.label}</div>
                        <div className="text-xs text-gray-500">{t('vsOriginal')}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-lg">{metric.value}</div>
                      <div className={`text-sm flex items-center gap-1 ${
                        isPositive ? 'text-green-600' : 'text-blue-600'
                      }`}>
                        <ArrowRight className="h-3 w-3" />
                        {metric.change > 0 ? '+' : ''}{metric.change.toFixed(1)}{metric.unit}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>{t('improvement')}</span>
                      <span>{Math.abs(metric.change).toFixed(1)}{metric.unit}</span>
                    </div>
                    <Progress
                      value={Math.min(Math.abs(metric.change), 100)}
                      className="h-2"
                      indicatorClassName={isPositive ? 'bg-green-500' : 'bg-blue-500'}
                    />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Revenue Impact */}
      {smart.revenue > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="bg-gradient-to-r from-emerald-50 to-green-50 border-green-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-green-600" />
                  <h3 className="font-semibold text-green-900">{t('revenueImpact')}</h3>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div className="bg-white/70 rounded-lg p-4">
                  <div className="text-sm text-green-700 mb-1">{t('additionalRevenue')}</div>
                  <div className="text-2xl font-bold text-green-800">
                    {formatCurrency(roi.additionalRevenue)}
                  </div>
                  <div className="text-xs text-green-600 mt-1">
                    {t('perYear', {
                      amount: formatCurrency(roi.additionalRevenue),
                      improvement: roi.improvementPercent.toFixed(0)
                    })}
                  </div>
                </div>

                <div className="bg-white/70 rounded-lg p-4">
                  <div className="text-sm text-green-700 mb-1">{t('roiPerPercent')}</div>
                  <div className="text-xl font-bold text-green-800">
                    {formatCurrency(roi.roiPerPercent)}
                  </div>
                  <div className="text-xs text-green-600 mt-1">
                    {t('perConversionPoint')}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Projected Annual Growth */}
      {smart.revenue > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-4">
              <h4 className="font-medium text-blue-900 mb-3">{t('projections.title')}</h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-blue-700">{t('projections.current')}</span>
                  <span className="font-medium">{formatCurrency(original.revenue)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-blue-700">{t('projections.projected')}</span>
                  <span className="font-bold text-blue-800">{formatCurrency(smart.revenue)}</span>
                </div>
                <div className="h-px bg-blue-200 my-2" />
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-blue-800">{t('projections.growth')}</span>
                  <span className="font-bold text-green-600">
                    +{formatCurrency(roi.additionalRevenue)} (
                    +{((roi.additionalRevenue / original.revenue) * 100).toFixed(0)}%)
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}