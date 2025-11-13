"use client";

import React from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { PackagingOption } from '@/types/booking';
import { cn } from '@/lib/utils';
import {
  Package,
  PackageOpen,
  Box,
  FileText,
  Wine,
  Smartphone,
  CheckCircle,
} from 'lucide-react';

interface PackagingSelectorProps {
  value: 'small' | 'medium' | 'large';
  onChange: (value: 'small' | 'medium' | 'large') => void;
  weight?: number;
  disabled?: boolean;
  className?: string;
}

/**
 * Simplified packaging selector with 3 options
 * Visual cards with icons and clear weight ranges
 */
export function PackagingSelector({
  value,
  onChange,
  weight = 5,
  disabled = false,
  className,
}: PackagingSelectorProps) {
  const t = useTranslations('booking.packaging');

  // Simplified packaging options as per PRD
  const packagingOptions: PackagingOption[] = [
    {
      id: 'small',
      name: t('options.small.name'),
      icon: 'Package',
      weightRange: {
        min: 0.1,
        max: 5,
      },
      description: t('options.small.description'),
      popular: true,
    },
    {
      id: 'medium',
      name: t('options.medium.name'),
      icon: 'PackageOpen',
      weightRange: {
        min: 5,
        max: 20,
      },
      description: t('options.medium.description'),
      popular: true,
    },
    {
      id: 'large',
      name: t('options.large.name'),
      icon: 'Box',
      weightRange: {
        min: 20,
        max: 100,
      },
      description: t('options.large.description'),
      popular: false,
    },
  ];

  const getIconComponent = (iconName: string) => {
    const iconProps = { className: "h-8 w-8" };
    switch (iconName) {
      case 'Package':
        return <Package {...iconProps} />;
      case 'PackageOpen':
        return <PackageOpen {...iconProps} />;
      case 'Box':
        return <Box {...iconProps} />;
      case 'FileText':
        return <FileText {...iconProps} />;
      case 'Wine':
        return <Wine {...iconProps} />;
      case 'Smartphone':
        return <Smartphone {...iconProps} />;
      default:
        return <Package {...iconProps} />;
    }
  };

  const getRecommendedOption = (): 'small' | 'medium' | 'large' => {
    if (weight <= 5) return 'small';
    if (weight <= 20) return 'medium';
    return 'large';
  };

  const isWeightInRange = (option: PackagingOption): boolean => {
    return weight >= option.weightRange.min && weight <= option.weightRange.max;
  };

  const isRecommended = (optionId: string): boolean => {
    return optionId === getRecommendedOption();
  };

  const getWeightStatusText = (option: PackagingOption): string => {
    if (weight < option.weightRange.min) {
      return t('tooLight', { min: option.weightRange.min });
    }
    if (weight > option.weightRange.max) {
      return t('tooHeavy', { max: option.weightRange.max });
    }
    return t('perfectFit');
  };

  const getWeightStatusColor = (option: PackagingOption): string => {
    if (!isWeightInRange(option)) return 'text-red-600';
    if (isRecommended(option.id)) return 'text-green-600';
    return 'text-orange-600';
  };

  return (
    <div className={cn("space-y-4", className)}>
      <div className="space-y-2">
        <h3 className="text-sm font-medium">{t('selectType')}</h3>
        <p className="text-xs text-muted-foreground">
          {t('selectDescription')}
        </p>
      </div>

      <div className="grid gap-3">
        {packagingOptions.map((option) => {
          const isSelected = value === option.id;
          const recommended = isRecommended(option.id);
          const fitsWeight = isWeightInRange(option);

          return (
            <Card
              key={option.id}
              className={cn(
                "cursor-pointer transition-all hover:shadow-md",
                isSelected && "ring-2 ring-primary ring-offset-2 bg-primary/5",
                !fitsWeight && "opacity-50 cursor-not-allowed",
                disabled && "cursor-not-allowed opacity-50"
              )}
              onClick={() => !disabled && fitsWeight && onChange(option.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className={cn(
                    "p-2 rounded-lg",
                    isSelected ? "bg-primary text-primary-foreground" : "bg-muted"
                  )}>
                    {getIconComponent(option.icon)}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium">{option.name}</h4>
                      {option.popular && (
                        <Badge variant="secondary" className="text-xs">
                          {t('popular')}
                        </Badge>
                      )}
                      {recommended && (
                        <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                          {t('recommended')}
                        </Badge>
                      )}
                    </div>

                    <p className="text-sm text-muted-foreground mb-2">
                      {option.description}
                    </p>

                    <div className="flex items-center justify-between">
                      <div className="text-xs">
                        <span className="text-muted-foreground">
                          {t('weightRange', { min: option.weightRange.min, max: option.weightRange.max })}
                        </span>
                      </div>

                      {/* Weight fit indicator */}
                      <div className={cn(
                        "flex items-center gap-1 text-xs font-medium",
                        getWeightStatusColor(option)
                      )}>
                        {fitsWeight ? (
                          <>
                            <CheckCircle className="h-3 w-3" />
                            <span>{t('perfectFit')}</span>
                          </>
                        ) : (
                          <span>{getWeightStatusText(option)}</span>
                        )}
                      </div>
                    </div>

                    {/* Current weight indicator */}
                    {weight > 0 && (
                      <div className="mt-2">
                        <div className="text-xs text-muted-foreground mb-1">
                          {t('yourParcel', { weight })}
                        </div>
                        <div className="w-full bg-muted rounded-full h-1.5">
                          <div
                            className={cn(
                              "h-1.5 rounded-full transition-all",
                              fitsWeight ? "bg-green-500" : "bg-red-500"
                            )}
                            style={{
                              width: `${Math.min((weight / option.weightRange.max) * 100, 100)}%`
                            }}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Selection indicator */}
                  <div className={cn(
                    "w-5 h-5 rounded-full border-2 flex items-center justify-center",
                    isSelected ? "bg-primary border-primary" : "border-muted-foreground"
                  )}>
                    {isSelected && (
                      <CheckCircle className="h-3 w-3 text-primary-foreground" />
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Auto-selection message */}
      {weight > 0 && value !== getRecommendedOption() && (
        <div className="rounded-lg border border-blue-200 bg-blue-50 p-3">
          <p className="text-sm text-blue-800">
            <strong>{t('recommendationLabel')}:</strong> {t('recommendationText', {
              weight,
              recommendedBox: packagingOptions.find(o => o.id === getRecommendedOption())?.name
            })}.
          </p>
        </div>
      )}

      {/* Packaging guidelines */}
      <div className="text-xs text-muted-foreground space-y-1">
        <p className="font-medium">{t('guidelines.title')}:</p>
        <ul className="space-y-1 ml-4">
          <li>• {t('guidelines.sturdyBox')}</li>
          <li>• {t('guidelines.wrapFragile')}</li>
          <li>• {t('guidelines.fillEmpty')}</li>
          <li>• {t('guidelines.sealSecurely')}</li>
        </ul>
      </div>
    </div>
  );
}

export default PackagingSelector;