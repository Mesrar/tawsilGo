"use client";

import React from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { WeightQuickSelect as WeightQuickSelectType } from '@/types/booking';
import { Package, TrendingUp } from 'lucide-react';

interface WeightQuickSelectProps {
  value: number;
  onChange: (value: number) => void;
  maxCapacity?: number;
  selectedTrip?: any;
  disabled?: boolean;
  showCustomInput?: boolean;
  className?: string;
}

/**
 * Quick weight selection buttons with custom input option
 * Shows popular weights and visual capacity indicator
 */
export function WeightQuickSelect({
  value,
  onChange,
  maxCapacity = 100,
  selectedTrip,
  disabled = false,
  showCustomInput = true,
  className,
}: WeightQuickSelectProps) {
  const t = useTranslations('booking.weight');

  // Popular weight options based on typical parcel weights
  const weightOptions: WeightQuickSelectType[] = [
    {
      value: 2,
      label: '2kg',
      description: t('options.small'),
      popular: true,
    },
    {
      value: 5,
      label: '5kg',
      description: t('options.mostPopular'),
      popular: true,
    },
    {
      value: 10,
      label: '10kg',
      description: t('options.medium'),
      popular: false,
    },
    {
      value: 20,
      label: '20kg',
      description: t('options.large'),
      popular: false,
    },
  ];

  // Filter weights that exceed capacity
  const availableOptions = weightOptions.filter(option =>
    !maxCapacity || option.value <= maxCapacity
  );

  const capacityPercentage = maxCapacity > 0 ? (value / maxCapacity) * 100 : 0;
  const isOverCapacity = maxCapacity > 0 && value > maxCapacity;

  const handleWeightSelect = (weight: number) => {
    if (!disabled) {
      onChange(weight);
    }
  };

  const handleCustomWeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseFloat(e.target.value);
    if (!isNaN(newValue) && newValue >= 0) {
      onChange(newValue);
    }
  };

  const getCapacityColor = () => {
    if (isOverCapacity) return 'text-red-600';
    if (capacityPercentage > 80) return 'text-orange-600';
    if (capacityPercentage > 60) return 'text-yellow-600';
    return 'text-green-600';
  };

  const getProgressColor = () => {
    if (isOverCapacity) return 'bg-red-500';
    if (capacityPercentage > 80) return 'bg-orange-500';
    if (capacityPercentage > 60) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* Quick select buttons */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">{t('selectLabel')}</Label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {availableOptions.map((option) => (
            <Button
              key={option.value}
              type="button"
              variant={value === option.value ? "default" : "outline"}
              size="sm"
              className={cn(
                "h-auto flex-col gap-1 p-3 relative",
                value === option.value && "ring-2 ring-primary ring-offset-2",
                option.popular && "border-primary/50"
              )}
              onClick={() => handleWeightSelect(option.value)}
              disabled={disabled}
            >
              {option.popular && (
                <Badge
                  variant="secondary"
                  className="absolute -top-2 -right-2 text-xs px-1.5 py-0.5 h-4 bg-primary/10 text-primary border-primary/20"
                >
                  {t('popular')}
                </Badge>
              )}

              <Package className="h-4 w-4" />
              <span className="font-semibold">{option.label}</span>
              {option.description && (
                <span className="text-xs text-muted-foreground">
                  {option.description}
                </span>
              )}
            </Button>
          ))}
        </div>
      </div>

      {/* Custom weight input */}
      {showCustomInput && (
        <div className="space-y-2">
          <Label htmlFor="custom-weight" className="text-sm font-medium">
            {t('customWeight')}
          </Label>
          <div className="flex items-center gap-3">
            <Input
              id="custom-weight"
              type="number"
              min="0.1"
              max={maxCapacity || 999}
              step="0.1"
              value={value}
              onChange={handleCustomWeightChange}
              disabled={disabled}
              placeholder={t('enterWeight')}
              className={cn(
                "flex-1",
                isOverCapacity && "border-red-500 focus:ring-red-500"
              )}
            />
            <span className="text-sm text-muted-foreground font-medium">
              kg
            </span>
          </div>
        </div>
      )}

      {/* Capacity indicator */}
      {maxCapacity > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              {t('capacityUsage')}
            </Label>
            <span className={cn("text-sm font-medium", getCapacityColor())}>
              {value.toFixed(1)}kg / {maxCapacity}kg
              {isOverCapacity && (
                <span className="text-red-600 ml-1">⚠️ {t('overCapacity')}</span>
              )}
            </span>
          </div>

          <Progress
            value={Math.min(capacityPercentage, 100)}
            className={cn("h-2", isOverCapacity && "bg-red-100")}
          />

          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{t('usedPercent', { percent: capacityPercentage.toFixed(0) })}</span>
            <span>{t('availablePercent', { percent: (100 - capacityPercentage).toFixed(0) })}</span>
          </div>
        </div>
      )}

      {/* Capacity warnings */}
      {isOverCapacity && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3">
          <p className="text-sm text-red-800">
            <strong>{t('overCapacityTitle')}</strong>
            <br />
            {t('overCapacityMessage', { maxCapacity })}
          </p>
        </div>
      )}

      {capacityPercentage > 80 && !isOverCapacity && (
        <div className="rounded-lg border border-orange-200 bg-orange-50 p-3">
          <p className="text-sm text-orange-800">
            <strong>{t('limitedCapacityTitle')}</strong>
            <br />
            {t('limitedCapacityMessage', { available: (maxCapacity - value).toFixed(1) })}
          </p>
        </div>
      )}

      {/* Trip-specific capacity info */}
      {selectedTrip && (
        <div className="text-xs text-muted-foreground space-y-1">
          <p>
            {t('tripInfo.route', { from: selectedTrip.departureCity, to: selectedTrip.destinationCity })}
          </p>
          <p>
            {t('tripInfo.driver')}: {selectedTrip.driver?.name || t('tripInfo.loading')}
          </p>
          {selectedTrip.departureTime && (
            <p>
              {t('tripInfo.departs')}: {new Date(selectedTrip.departureTime).toLocaleDateString()} at{' '}
              {new Date(selectedTrip.departureTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export default WeightQuickSelect;