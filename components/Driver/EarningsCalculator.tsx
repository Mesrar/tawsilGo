"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TrendingUp, Euro, Calendar } from "lucide-react";

interface EarningsCalculatorProps {
  t: any; // Translation function
}

export function EarningsCalculator({ t }: EarningsCalculatorProps) {
  const [deliveriesPerWeek, setDeliveriesPerWeek] = useState(10);
  const AVG_EARNING_PER_DELIVERY = 12; // €12 average per delivery
  const WEEKS_PER_MONTH = 4.33;

  const weeklyEarnings = deliveriesPerWeek * AVG_EARNING_PER_DELIVERY;
  const monthlyEarnings = weeklyEarnings * WEEKS_PER_MONTH;
  const yearlyEarnings = monthlyEarnings * 12;

  return (
    <Card className="border-2 border-green-200 dark:border-green-800 bg-gradient-to-br from-green-50 to-white dark:from-green-950/20 dark:to-slate-900">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/40">
            <TrendingUp className="h-6 w-6 text-green-600 dark:text-green-400" />
          </div>
          <div>
            <CardTitle className="text-2xl">{t("earningsCalculator.title")}</CardTitle>
            <CardDescription className="text-base">
              {t("earningsCalculator.description")}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Input */}
        <div className="space-y-2">
          <Label htmlFor="deliveries" className="text-sm font-semibold">
            {t("earningsCalculator.deliveriesPerWeek")}
          </Label>
          <div className="flex items-center gap-4">
            <Input
              id="deliveries"
              type="number"
              min="1"
              max="50"
              value={deliveriesPerWeek}
              onChange={(e) => setDeliveriesPerWeek(parseInt(e.target.value) || 1)}
              className="text-lg font-semibold"
            />
            <span className="text-sm text-slate-500 whitespace-nowrap">
              {t("earningsCalculator.deliveries")}
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {t("earningsCalculator.avgEarning", { amount: AVG_EARNING_PER_DELIVERY })}
          </p>
        </div>

        {/* Results */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Weekly */}
          <div className="p-4 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="h-4 w-4 text-slate-500" />
              <span className="text-sm text-slate-600 dark:text-slate-400">
                {t("earningsCalculator.weekly")}
              </span>
            </div>
            <div className="flex items-baseline gap-1">
              <Euro className="h-5 w-5 text-green-600 dark:text-green-400 mt-1" />
              <span className="text-3xl font-bold text-green-600 dark:text-green-400">
                {weeklyEarnings}
              </span>
            </div>
          </div>

          {/* Monthly */}
          <div className="p-4 rounded-lg bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/40 dark:to-green-900/20 border-2 border-green-300 dark:border-green-700">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="h-4 w-4 text-green-700 dark:text-green-300" />
              <span className="text-sm font-semibold text-green-700 dark:text-green-300">
                {t("earningsCalculator.monthly")}
              </span>
            </div>
            <div className="flex items-baseline gap-1">
              <Euro className="h-5 w-5 text-green-700 dark:text-green-300 mt-1" />
              <span className="text-3xl font-bold text-green-700 dark:text-green-300">
                {Math.round(monthlyEarnings)}
              </span>
            </div>
          </div>

          {/* Yearly */}
          <div className="p-4 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="h-4 w-4 text-slate-500" />
              <span className="text-sm text-slate-600 dark:text-slate-400">
                {t("earningsCalculator.yearly")}
              </span>
            </div>
            <div className="flex items-baseline gap-1">
              <Euro className="h-5 w-5 text-green-600 dark:text-green-400 mt-1" />
              <span className="text-3xl font-bold text-green-600 dark:text-green-400">
                {Math.round(yearlyEarnings).toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <p className="text-xs text-center text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-200 dark:border-slate-700">
          {t("earningsCalculator.disclaimer")}
        </p>
      </CardContent>
    </Card>
  );
}
