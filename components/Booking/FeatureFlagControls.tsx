"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

// UI Components
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

// Icons
import {
  Zap,
  Search,
  Expand,
  Sidebar,
  DollarSign,
  Package,
  Box,
  User,
  Target,
  Power,
  PowerOff,
} from "lucide-react";

interface FeatureFlags {
  smartBookingFlow: boolean;
  instantSearch: boolean;
  autoExpandForm: boolean;
  inlineReview: boolean;
  priceEstimates: boolean;
  weightQuickSelect: boolean;
  simplifiedPackaging: boolean;
  autoFillProfile: boolean;
  priceAnchoring: boolean;
}

interface FeatureFlagControlsProps {
  flags: FeatureFlags;
  onToggle: (feature: keyof FeatureFlags, enabled: boolean) => void;
  onEnableAll: () => void;
  onDisableAll: () => void;
}

const featureConfig = [
  {
    key: 'smartBookingFlow' as keyof FeatureFlags,
    icon: Zap,
    title: 'Smart Booking Flow',
    description: '2-step booking experience',
    category: 'Core Flow',
    impact: 'High',
  },
  {
    key: 'instantSearch' as keyof FeatureFlags,
    icon: Search,
    title: 'Instant Search',
    description: 'Real-time search results',
    category: 'Search',
    impact: 'High',
  },
  {
    key: 'autoExpandForm' as keyof FeatureFlags,
    icon: Expand,
    title: 'Auto-Expand Form',
    description: 'Sections expand as you type',
    category: 'Form UX',
    impact: 'Medium',
  },
  {
    key: 'inlineReview' as keyof FeatureFlags,
    icon: Sidebar,
    title: 'Inline Review',
    description: 'Review in sidebar instead of separate step',
    category: 'Form UX',
    impact: 'High',
  },
  {
    key: 'priceEstimates' as keyof FeatureFlags,
    icon: DollarSign,
    title: 'Price Estimates',
    description: 'Show pricing on trip cards',
    category: 'Pricing',
    impact: 'Medium',
  },
  {
    key: 'weightQuickSelect' as keyof FeatureFlags,
    icon: Package,
    title: 'Weight Quick Select',
    description: 'Popular weight buttons',
    category: 'Form UX',
    impact: 'Low',
  },
  {
    key: 'simplifiedPackaging' as keyof FeatureFlags,
    icon: Box,
    title: 'Simplified Packaging',
    description: '3 packaging options instead of 6',
    category: 'Form UX',
    impact: 'Low',
  },
  {
    key: 'autoFillProfile' as keyof FeatureFlags,
    icon: User,
    title: 'Auto-Fill Profile',
    description: 'Prefill from user profile',
    category: 'Personalization',
    impact: 'Medium',
  },
  {
    key: 'priceAnchoring' as keyof FeatureFlags,
    icon: Target,
    title: 'Price Anchoring',
    description: 'Show competitor pricing',
    category: 'Pricing',
    impact: 'Medium',
  },
];

export function FeatureFlagControls({
  flags,
  onToggle,
  onEnableAll,
  onDisableAll,
}: FeatureFlagControlsProps) {
  const t = useTranslations('booking.demo.controls');

  const categories = Array.from(new Set(featureConfig.map(f => f.category)));
  const isAllEnabled = Object.values(flags).every(Boolean);
  const isAllDisabled = Object.values(flags).every(v => !v);

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'High': return 'bg-red-100 text-red-700';
      case 'Medium': return 'bg-amber-100 text-amber-700';
      case 'Low': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* Global Controls */}
      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
        <div>
          <h3 className="font-medium">{t('globalControls')}</h3>
          <p className="text-sm text-gray-600 mt-1">{t('globalControlsDesc')}</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={isAllEnabled ? "default" : "outline"}
            size="sm"
            onClick={onEnableAll}
            disabled={isAllEnabled}
            className="flex items-center gap-2"
          >
            <Power className="h-4 w-4" />
            {t('enableAll')}
          </Button>
          <Button
            variant={isAllDisabled ? "default" : "outline"}
            size="sm"
            onClick={onDisableAll}
            disabled={isAllDisabled}
            className="flex items-center gap-2"
          >
            <PowerOff className="h-4 w-4" />
            {t('disableAll')}
          </Button>
        </div>
      </div>

      {/* Feature Categories */}
      {categories.map((category) => (
        <Card key={category}>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">{category}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {featureConfig
              .filter((feature) => feature.category === category)
              .map((feature) => {
                const Icon = feature.icon;
                const isEnabled = flags[feature.key];

                return (
                  <div key={feature.key} className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1">
                      <div className={cn(
                        "p-2 rounded-lg transition-colors",
                        isEnabled ? "bg-primary text-primary-foreground" : "bg-gray-100 text-gray-600"
                      )}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm">{feature.title}</span>
                          <Badge
                            variant="secondary"
                            className={cn("text-xs", getImpactColor(feature.impact))}
                          >
                            {feature.impact}
                          </Badge>
                        </div>
                        <p className="text-xs text-gray-600 mt-0.5">{feature.description}</p>
                      </div>
                    </div>
                    <Switch
                      checked={isEnabled}
                      onCheckedChange={(enabled) => onToggle(feature.key, enabled)}
                    />
                  </div>
                );
              })}
          </CardContent>
        </Card>
      ))}

      {/* Status Summary */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-blue-900">{t('summary.title')}</h4>
              <p className="text-sm text-blue-700 mt-1">
                {t('summary.active', { count: Object.values(flags).filter(Boolean).length })}
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-blue-600">
                {((Object.values(flags).filter(Boolean).length / Object.keys(flags).length) * 100).toFixed(0)}%
              </div>
              <div className="text-xs text-blue-600">{t('summary.adoption')}</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}