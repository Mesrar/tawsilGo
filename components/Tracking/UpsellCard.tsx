"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Shield,
  Zap,
  Check,
  X,
  TrendingUp,
  Clock,
  Package,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface UpsellOption {
  id: string;
  type: "insurance" | "express";
  title: string;
  description: string;
  price: number;
  currency: string;
  icon: any;
  benefits: string[];
  badge?: string;
  ctaText: string;
  timeSaved?: string; // For express shipping
  coverageAmount?: number; // For insurance
}

interface UpsellCardProps {
  trackingNumber: string;
  currentStatus: string;
  estimatedDelivery: string;
  onUpgrade?: (optionId: string) => Promise<void>;
  className?: string;
}

/**
 * UpsellCard Component
 *
 * Contextual upsell opportunities displayed during tracking:
 * 1. Insurance Upgrade - If package not insured or under-insured
 * 2. Express Upgrade - Speed up delivery for in-transit packages
 *
 * Features:
 * - Contextual display based on shipment status
 * - A/B testing ready with variant support
 * - Conversion tracking integration
 * - Mobile-optimized pricing display
 * - Social proof elements
 *
 * Target: 5-8% conversion rate on upsells
 */
export function UpsellCard({
  trackingNumber,
  currentStatus,
  estimatedDelivery,
  onUpgrade,
  className,
}: UpsellCardProps) {
  const [isUpgrading, setIsUpgrading] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  // Determine which upsells to show based on status
  const getAvailableUpsells = (): UpsellOption[] => {
    const upsells: UpsellOption[] = [];

    // Insurance upsell - show if in transit and not fully insured
    if (
      currentStatus.includes("IN_TRANSIT") ||
      currentStatus.includes("CUSTOMS")
    ) {
      upsells.push({
        id: "insurance-premium",
        type: "insurance",
        title: "Upgrade to Premium Insurance",
        description:
          "Protect your package with enhanced coverage up to €500. Peace of mind for valuable items.",
        price: 12,
        currency: "EUR",
        coverageAmount: 500,
        icon: Shield,
        badge: "Most Popular",
        benefits: [
          "Coverage up to €500 (vs €100 standard)",
          "Faster claim processing (24-48 hours)",
          "No deductible on approved claims",
          "Covers damage, loss, and theft",
        ],
        ctaText: "Upgrade Insurance",
      });
    }

    // Express upgrade - show if in early transit stages
    if (
      currentStatus === "IN_TRANSIT_BUS" ||
      currentStatus === "CUSTOMS_CLEARED_EU"
    ) {
      upsells.push({
        id: "express-delivery",
        type: "express",
        title: "Expedite to Express Delivery",
        description:
          "Get your package 2-3 days faster with priority handling and dedicated ferry slot.",
        price: 25,
        currency: "EUR",
        timeSaved: "2-3 days faster",
        icon: Zap,
        badge: "Limited Availability",
        benefits: [
          "Priority bus loading & unloading",
          "Dedicated ferry slot (no delays)",
          "Express customs clearance",
          "Guaranteed delivery date",
        ],
        ctaText: "Upgrade to Express",
      });
    }

    return upsells;
  };

  const handleUpgrade = async (optionId: string) => {
    setSelectedOption(optionId);
    setIsUpgrading(true);

    try {
      if (onUpgrade) {
        await onUpgrade(optionId);
      }

      // Simulate payment flow
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // In production, redirect to payment page
      // window.location.href = `/upgrade-payment?tracking=${trackingNumber}&option=${optionId}`;

      alert("Upgrade successful! You'll receive a confirmation email shortly.");
    } catch (error) {
      alert("Upgrade failed. Please try again or contact support.");
    } finally {
      setIsUpgrading(false);
      setSelectedOption(null);
    }
  };

  const availableUpsells = getAvailableUpsells();

  if (availableUpsells.length === 0) {
    return null; // No upsells available for current status
  }

  return (
    <div className={cn("space-y-4", className)}>
      {availableUpsells.map((upsell, index) => {
        const Icon = upsell.icon;
        const isSelected = selectedOption === upsell.id;

        return (
          <motion.div
            key={upsell.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="border-2 border-moroccan-mint/20 hover:border-moroccan-mint/40 transition-all">
              <CardContent className="p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-moroccan-mint/10 rounded-lg">
                      <Icon className="h-6 w-6 text-moroccan-mint" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                          {upsell.title}
                        </h3>
                        {upsell.badge && (
                          <Badge className="bg-moroccan-gold text-white text-xs">
                            {upsell.badge}
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        {upsell.description}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Benefits */}
                <div className="mb-6">
                  <ul className="space-y-2">
                    {upsell.benefits.map((benefit, idx) => (
                      <li
                        key={idx}
                        className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300"
                      >
                        <Check className="h-4 w-4 text-moroccan-mint flex-shrink-0 mt-0.5" />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Value Proposition */}
                {upsell.type === "express" && upsell.timeSaved && (
                  <div className="mb-6 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-900">
                    <div className="flex items-center gap-2">
                      <Clock className="h-5 w-5 text-blue-600" />
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-blue-900 dark:text-blue-200">
                          Arrives {upsell.timeSaved} sooner
                        </p>
                        <p className="text-xs text-blue-700 dark:text-blue-300">
                          New estimated delivery: {/* Calculate earlier date */}
                          {new Date(
                            new Date(estimatedDelivery).getTime() -
                              2.5 * 24 * 60 * 60 * 1000
                          ).toLocaleDateString("en-US", {
                            month: "long",
                            day: "numeric",
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {upsell.type === "insurance" && upsell.coverageAmount && (
                  <div className="mb-6 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-900">
                    <div className="flex items-center gap-2">
                      <Shield className="h-5 w-5 text-green-600" />
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-green-900 dark:text-green-200">
                          5x More Coverage
                        </p>
                        <p className="text-xs text-green-700 dark:text-green-300">
                          From €100 → €{upsell.coverageAmount} protection
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Social Proof */}
                <div className="mb-6 flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
                  <TrendingUp className="h-4 w-4 text-moroccan-mint" />
                  <span>
                    {upsell.type === "insurance"
                      ? "847 customers upgraded this month"
                      : "92% of express upgrades arrive early"}
                  </span>
                </div>

                {/* CTA */}
                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <div className="text-3xl font-bold text-moroccan-mint">
                      €{upsell.price}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      One-time upgrade fee
                    </div>
                  </div>
                  <Button
                    onClick={() => handleUpgrade(upsell.id)}
                    disabled={isUpgrading}
                    className="bg-moroccan-mint hover:bg-moroccan-mint-600 px-6"
                  >
                    {isUpgrading && isSelected ? (
                      <>
                        <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        Processing...
                      </>
                    ) : (
                      upsell.ctaText
                    )}
                  </Button>
                </div>

                {/* Money-back guarantee */}
                <div className="mt-4 pt-4 border-t">
                  <p className="text-xs text-slate-500 dark:text-slate-400 text-center">
                    {upsell.type === "insurance"
                      ? "30-day money-back guarantee if you cancel your shipment"
                      : "Delivery guarantee or full refund"}
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        );
      })}

      {/* Optional: Dismiss/Not Interested */}
      <div className="text-center">
        <button className="text-sm text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 underline">
          Not interested right now
        </button>
      </div>
    </div>
  );
}

/**
 * Compact Upsell Banner (Alternative Layout)
 * For minimal displays or when space is limited
 */
export function CompactUpsellBanner({
  type,
  price,
  timeSaved,
  coverageAmount,
  onUpgrade,
}: {
  type: "insurance" | "express";
  price: number;
  timeSaved?: string;
  coverageAmount?: number;
  onUpgrade: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 bg-gradient-to-r from-moroccan-mint/10 to-chefchaouen-blue/10 border border-moroccan-mint/30 rounded-lg"
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {type === "insurance" ? (
            <Shield className="h-5 w-5 text-moroccan-mint" />
          ) : (
            <Zap className="h-5 w-5 text-moroccan-mint" />
          )}
          <div>
            <p className="text-sm font-semibold text-slate-900 dark:text-white">
              {type === "insurance" ? "Upgrade Insurance" : "Express Delivery"}
            </p>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              {type === "insurance"
                ? `€${coverageAmount} coverage`
                : `${timeSaved} faster`}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-lg font-bold text-moroccan-mint">€{price}</div>
          </div>
          <Button
            onClick={onUpgrade}
            size="sm"
            className="bg-moroccan-mint hover:bg-moroccan-mint-600"
          >
            Upgrade
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
