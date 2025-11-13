"use client";

import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import {
  TrendingDown,
  CheckCircle,
  XCircle,
  Truck,
  Clock,
  Shield,
  Star,
  ArrowRight
} from 'lucide-react';

interface PriceAnchoringProps {
  ourPrice: number;
  competitorPrices: {
    dhl?: number;
    ups?: number;
    aramex?: number;
    laposte?: number;
  };
  weight: number;
  currency?: string;
  variant?: 'compact' | 'detailed';
  className?: string;
}

/**
 * Price anchoring component that shows TawsilGo's competitive advantage
 * Displays comparison with major carriers and savings percentage
 */
export function PriceAnchoring({
  ourPrice,
  competitorPrices,
  weight,
  currency = 'EUR',
  variant = 'detailed',
  className,
}: PriceAnchoringProps) {
  // Filter out undefined competitor prices
  const validCompetitors = Object.entries(competitorPrices)
    .filter(([_, price]) => price && price > 0)
    .map(([name, price]) => ({ name, price }));

  // If no competitor data, don't show the component
  if (validCompetitors.length === 0) {
    return null;
  }

  // Calculate average competitor price
  const avgCompetitorPrice = validCompetitors.reduce((sum, comp) => sum + comp.price, 0) / validCompetitors.length;

  // Calculate savings
  const savings = avgCompetitorPrice - ourPrice;
  const savingsPercent = avgCompetitorPrice > 0 ? (savings / avgCompetitorPrice) * 100 : 0;

  // Find the cheapest competitor
  const cheapestCompetitor = validCompetitors.reduce((cheapest, current) =>
    current.price < cheapest.price ? current : cheapest
  );

  const getCompetitorIcon = (name: string) => {
    switch (name) {
      case 'dhl':
        return <Truck className="h-4 w-4" />;
      case 'ups':
        return <Truck className="h-4 w-4" />;
      case 'aramex':
        return <Truck className="h-4 w-4" />;
      case 'laposte':
        return <Truck className="h-4 w-4" />;
      default:
        return <Truck className="h-4 w-4" />;
    }
  };

  const getCompetitorName = (name: string) => {
    switch (name) {
      case 'dhl':
        return 'DHL';
      case 'ups':
        return 'UPS';
      case 'aramex':
        return 'Aramex';
      case 'laposte':
        return 'La Poste';
      default:
        return name.toUpperCase();
    }
  };

  if (variant === 'compact') {
    return (
      <div className={cn("flex items-center gap-2", className)}>
        <Badge variant="secondary" className="bg-green-50 text-green-700 border-green-200">
          <TrendingDown className="h-3 w-3 mr-1" />
          Save {savingsPercent.toFixed(0)}%
        </Badge>
        <span className="text-sm text-muted-foreground">
          vs {getCompetitorName(cheapestCompetitor.name)} ({currency}{cheapestCompetitor.price})
        </span>
      </div>
    );
  }

  return (
    <Card className={cn("border-green-200 bg-green-50/30", className)}>
      <CardContent className="p-4">
        <div className="space-y-4">
          {/* Header with savings highlight */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-green-800 flex items-center gap-2">
                <TrendingDown className="h-4 w-4" />
                Best Price Guaranteed
              </h3>
              <p className="text-sm text-green-600">
                Save {currency}{savings.toFixed(2)} ({savingsPercent.toFixed(0)}%) compared to traditional carriers
              </p>
            </div>

            <div className="text-right">
              <div className="text-2xl font-bold text-green-800">
                {currency}{ourPrice}
              </div>
              <div className="text-xs text-green-600">
                Your price ({weight}kg)
              </div>
            </div>
          </div>

          {/* Price comparison table */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-green-800">Price Comparison</h4>

            {/* Our price first */}
            <div className="flex items-center justify-between p-3 bg-green-100 rounded-lg border border-green-200">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                  <CheckCircle className="h-4 w-4 text-white" />
                </div>
                <div>
                  <div className="font-medium text-green-800">TawsilGo</div>
                  <div className="text-xs text-green-600">Your choice</div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold text-green-800">{currency}{ourPrice}</div>
                <div className="text-xs text-green-600">Fast delivery</div>
              </div>
            </div>

            {/* Competitor prices */}
            {validCompetitors.map((competitor) => {
              const competitorSavings = competitor.price - ourPrice;
              const competitorSavingsPercent = (competitorSavings / competitor.price) * 100;

              return (
                <div key={competitor.name} className="flex items-center justify-between p-3 bg-white rounded-lg border border-slate-200">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center">
                      {getCompetitorIcon(competitor.name)}
                    </div>
                    <div>
                      <div className="font-medium text-slate-800">{getCompetitorName(competitor.name)}</div>
                      <div className="text-xs text-slate-600">Traditional carrier</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-slate-800">{currency}{competitor.price}</div>
                    <div className="text-xs text-red-600">
                      +{currency}{competitorSavings.toFixed(2)} ({competitorSavingsPercent.toFixed(0)}% more)
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Value proposition highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-green-200">
            <div className="flex items-center gap-2 text-sm text-green-700">
              <Clock className="h-4 w-4" />
              <span>2-3 day delivery</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-green-700">
              <Shield className="h-4 w-4" />
              <span>Insurance included</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-green-700">
              <Star className="h-4 w-4" />
              <span>Verified drivers</span>
            </div>
          </div>

          {/* Trust indicator */}
          <div className="flex items-center gap-2 text-xs text-green-600 bg-green-100 rounded-lg p-2">
            <CheckCircle className="h-3 w-3" />
            <span>
              Join 10,000+ customers who save money with TawsilGo every month
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default PriceAnchoring;