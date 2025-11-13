"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calculator, Check, Info, ExternalLink } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

// Morocco customs duty rates by category
const dutyRates = {
  electronics: { rate: 0.025, vat: 0.2, name: "Electronics", example: "Phones, laptops, tablets" },
  clothing: { rate: 0.08, vat: 0.2, name: "Clothing", example: "Shirts, pants, jackets" },
  cosmetics: { rate: 0.05, vat: 0.2, name: "Cosmetics", example: "Perfume, skincare, makeup" },
  books: { rate: 0, vat: 0.2, name: "Books", example: "Educational materials" },
  food: { rate: 0.175, vat: 0.2, name: "Food Items", example: "Packaged foods, snacks" },
  toys: { rate: 0.10, vat: 0.2, name: "Toys & Games", example: "Children's toys, board games" },
  jewelry: { rate: 0.25, vat: 0.2, name: "Jewelry", example: "Watches, accessories" },
  sports: { rate: 0.025, vat: 0.2, name: "Sports Equipment", example: "Gear, apparel" },
  other: { rate: 0.10, vat: 0.2, name: "Other Goods", example: "General merchandise" },
};

const DE_MINIMIS_EUR = 150; // Morocco de minimis threshold
const PROCESSING_FEE_MAD = 50;
const EUR_TO_MAD = 10.8; // Approximate exchange rate

export function DutyCalculator() {
  const [itemValue, setItemValue] = useState("");
  const [category, setCategory] = useState("electronics");
  const [result, setResult] = useState<{
    dutyFree: boolean;
    dutyAmount: number;
    vatAmount: number;
    processingFee: number;
    totalDuty: number;
    totalDutyEur: number;
  } | null>(null);

  const calculateDuty = () => {
    const value = parseFloat(itemValue);
    if (isNaN(value) || value <= 0) {
      setResult(null);
      return;
    }

    // Check de minimis
    if (value <= DE_MINIMIS_EUR) {
      setResult({
        dutyFree: true,
        dutyAmount: 0,
        vatAmount: 0,
        processingFee: 0,
        totalDuty: 0,
        totalDutyEur: 0,
      });
      return;
    }

    // Calculate duty
    const selectedCategory = dutyRates[category as keyof typeof dutyRates];
    const dutiableValue = value - DE_MINIMIS_EUR;
    const dutiableValueMAD = dutiableValue * EUR_TO_MAD;

    const dutyAmount = dutiableValueMAD * selectedCategory.rate;
    const vatAmount = dutiableValueMAD * selectedCategory.vat;
    const processingFee = PROCESSING_FEE_MAD;
    const totalDuty = dutyAmount + vatAmount + processingFee;
    const totalDutyEur = totalDuty / EUR_TO_MAD;

    setResult({
      dutyFree: false,
      dutyAmount,
      vatAmount,
      processingFee,
      totalDuty,
      totalDutyEur,
    });
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Calculator className="h-6 w-6 text-moroccan-mint" />
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">
            Morocco Customs Duty Calculator
          </h3>
        </div>

        <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
          Estimate customs duties for your parcel entering Morocco. This is an estimate only - final duty is determined by Morocco customs.
        </p>

        {/* Input Form */}
        <div className="space-y-4 mb-6">
          <div>
            <Label htmlFor="item-value">Declared Item Value (€)</Label>
            <Input
              id="item-value"
              type="number"
              placeholder="Enter total value"
              value={itemValue}
              onChange={(e) => setItemValue(e.target.value)}
              className="mt-1"
            />
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Value shown on commercial invoice
            </p>
          </div>

          <div>
            <Label htmlFor="category">Item Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger id="category" className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(dutyRates).map(([key, data]) => (
                  <SelectItem key={key} value={key}>
                    <div className="flex flex-col items-start">
                      <span className="font-medium">{data.name}</span>
                      <span className="text-xs text-slate-500">{data.example}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button
            onClick={calculateDuty}
            className="w-full bg-moroccan-mint hover:bg-moroccan-mint-600"
          >
            <Calculator className="h-4 w-4 mr-2" />
            Calculate Duty
          </Button>
        </div>

        {/* Results */}
        <AnimatePresence mode="wait">
          {result && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              {result.dutyFree ? (
                <Alert className="border-green-200 dark:border-green-900 bg-green-50 dark:bg-green-900/20">
                  <Check className="h-4 w-4 text-green-600" />
                  <AlertDescription>
                    <p className="font-semibold text-green-900 dark:text-green-200 mb-1">
                      No Duty Required! 🎉
                    </p>
                    <p className="text-sm text-green-800 dark:text-green-300">
                      Your item value (€{parseFloat(itemValue).toFixed(2)}) is below Morocco's de minimis threshold of €{DE_MINIMIS_EUR}. No customs duty or VAT will be charged.
                    </p>
                  </AlertDescription>
                </Alert>
              ) : (
                <div className="space-y-4">
                  <div className="p-4 bg-moroccan-mint/10 rounded-lg border border-moroccan-mint/20">
                    <div className="space-y-2 text-sm mb-3">
                      <div className="flex justify-between">
                        <span className="text-slate-600 dark:text-slate-400">
                          Item Value:
                        </span>
                        <span className="font-medium text-slate-900 dark:text-white">
                          €{parseFloat(itemValue).toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600 dark:text-slate-400">
                          De Minimis Exemption:
                        </span>
                        <span className="font-medium text-slate-900 dark:text-white">
                          -€{DE_MINIMIS_EUR.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600 dark:text-slate-400">
                          Dutiable Value:
                        </span>
                        <span className="font-medium text-slate-900 dark:text-white">
                          €{(parseFloat(itemValue) - DE_MINIMIS_EUR).toFixed(2)}
                        </span>
                      </div>
                      <div className="h-px bg-slate-200 dark:bg-slate-700 my-2" />
                      <div className="flex justify-between">
                        <span className="text-slate-600 dark:text-slate-400">
                          Import Duty ({(dutyRates[category as keyof typeof dutyRates].rate * 100).toFixed(1)}%):
                        </span>
                        <span className="font-medium text-slate-900 dark:text-white">
                          MAD {result.dutyAmount.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600 dark:text-slate-400">
                          VAT (20%):
                        </span>
                        <span className="font-medium text-slate-900 dark:text-white">
                          MAD {result.vatAmount.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600 dark:text-slate-400">
                          Processing Fee:
                        </span>
                        <span className="font-medium text-slate-900 dark:text-white">
                          MAD {result.processingFee.toFixed(2)}
                        </span>
                      </div>
                      <div className="h-px bg-moroccan-mint/30 my-2" />
                      <div className="flex justify-between items-center pt-1">
                        <span className="font-bold text-slate-900 dark:text-white">
                          Estimated Total Duty:
                        </span>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-moroccan-mint">
                            MAD {result.totalDuty.toFixed(2)}
                          </div>
                          <div className="text-sm text-slate-600 dark:text-slate-400">
                            ~€{result.totalDutyEur.toFixed(2)}
                          </div>
                        </div>
                      </div>
                    </div>

                    <Alert className="mt-4 bg-white dark:bg-slate-900">
                      <Info className="h-4 w-4" />
                      <AlertDescription className="text-xs">
                        *This is an estimate based on declared value and category. Actual duty determined by Morocco customs inspection may vary.
                      </AlertDescription>
                    </Alert>
                  </div>

                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-900">
                    <p className="text-sm font-semibold text-blue-900 dark:text-blue-200 mb-2">
                      💡 Avoid Surprises
                    </p>
                    <p className="text-sm text-blue-800 dark:text-blue-300 mb-3">
                      Pay through TawsilGo when your package reaches Morocco customs. We process payment instantly and release your package within 4 hours.
                    </p>
                    <Link
                      href="/services/specialized#customs-brokerage"
                      className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                    >
                      Learn about our Customs Brokerage Service
                      <ExternalLink className="h-3 w-3" />
                    </Link>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Common Item Duties Reference */}
        <div className="mt-6 pt-6 border-t">
          <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">
            Common Item Duty Rates
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {Object.entries(dutyRates).slice(0, 6).map(([key, data]) => (
              <div
                key={key}
                className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-800/50 rounded text-sm"
              >
                <div className="flex-1">
                  <div className="font-medium text-slate-900 dark:text-white">
                    {data.name}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    {data.example}
                  </div>
                </div>
                <Badge variant="outline" className="ml-2">
                  {(data.rate * 100).toFixed(1)}%
                </Badge>
              </div>
            ))}
          </div>
        </div>

        {/* Important Notes */}
        <div className="mt-6 pt-6 border-t">
          <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">
            Important to Know
          </h4>
          <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
            <li className="flex items-start gap-2">
              <span className="text-moroccan-mint mt-0.5">•</span>
              <span>
                <strong>De Minimis Threshold:</strong> Items under €150 typically exempt from duty
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-moroccan-mint mt-0.5">•</span>
              <span>
                <strong>Gift Marking:</strong> Items marked as gifts may qualify for reduced rates
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-moroccan-mint mt-0.5">•</span>
              <span>
                <strong>Processing Time:</strong> Duty payment required before customs release (12-48h typical)
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-moroccan-mint mt-0.5">•</span>
              <span>
                <strong>Exchange Rate:</strong> MAD amounts calculated at current rate (~1 EUR = 10.8 MAD)
              </span>
            </li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
