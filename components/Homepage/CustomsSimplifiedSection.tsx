"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import {
  FileText,
  Shield,
  Check,
  X,
  ChevronRight,
  Calculator,
  AlertCircle,
  HelpCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";

export function CustomsSimplifiedSection() {
  const [parcelValue, setParcelValue] = useState<string>("");
  const [estimatedDuty, setEstimatedDuty] = useState<number | null>(null);

  const calculateDuty = () => {
    const value = parseFloat(parcelValue);
    if (isNaN(value) || value <= 0) {
      setEstimatedDuty(null);
      return;
    }

    // Morocco de minimis threshold: €150
    if (value <= 150) {
      setEstimatedDuty(0);
    } else {
      // Simplified estimate: 2.5% duty + 20% VAT on value above threshold
      const dutiableValue = value - 150;
      const duty = dutiableValue * 0.025;
      const vat = dutiableValue * 0.2;
      setEstimatedDuty(duty + vat);
    }
  };

  const commonItems = [
    { category: "Electronics", duty: "2.5%", example: "Phones, laptops, tablets" },
    { category: "Clothing", duty: "8%", example: "Shirts, pants, jackets" },
    { category: "Cosmetics", duty: "5%", example: "Perfume, skincare, makeup" },
    { category: "Books", duty: "0%", example: "Educational materials" },
  ];

  const prohibitedItems = [
    "Weapons & ammunition",
    "Illegal drugs",
    "Counterfeit goods",
    "Hazardous materials",
  ];

  const customsIncludedFeatures = [
    "HS code classification",
    "Commercial invoice prep",
    "Duty calculation",
    "Pre-clearance filing",
    "Certificate of origin",
    "Dedicated customs agent",
  ];

  return (
    <section className="py-16 px-4 bg-slate-50 dark:bg-slate-900">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="text-sm font-medium inline-block px-3 py-1 rounded-full bg-moroccan-mint-50 text-moroccan-mint-700 dark:bg-moroccan-mint-900/30 dark:text-moroccan-mint-300 mb-3">
            Customs Made Simple
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            No Customs Surprises
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-lg max-w-2xl mx-auto">
            Cross-border shipping can be confusing. We handle the paperwork and keep you
            informed every step of the way.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* Duty Calculator */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <Card className="h-full">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Calculator className="h-6 w-6 text-moroccan-mint" />
                  <h3 className="text-xl font-bold">Duty Calculator</h3>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
                  Estimate customs duties for your parcel. Morocco has a de minimis
                  threshold of €150.
                </p>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Parcel Value (€)
                    </label>
                    <div className="flex gap-2">
                      <Input
                        type="number"
                        placeholder="Enter total value"
                        value={parcelValue}
                        onChange={(e) => setParcelValue(e.target.value)}
                        className="flex-1"
                      />
                      <Button
                        onClick={calculateDuty}
                        className="bg-moroccan-mint hover:bg-moroccan-mint-600"
                      >
                        Calculate
                      </Button>
                    </div>
                  </div>

                  {estimatedDuty !== null && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="bg-moroccan-mint/10 p-4 rounded-lg border border-moroccan-mint/20"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Estimated Duty:</span>
                        <span className="text-2xl font-bold text-moroccan-mint">
                          €{estimatedDuty.toFixed(2)}
                        </span>
                      </div>
                      {estimatedDuty === 0 && (
                        <p className="text-xs text-green-700 dark:text-green-300 flex items-center gap-1">
                          <Check className="h-3 w-3" />
                          No duty! Value is below €150 threshold.
                        </p>
                      )}
                      <p className="text-xs text-slate-600 dark:text-slate-400 mt-2">
                        *Estimate only. Final duty determined by Morocco customs.
                      </p>
                    </motion.div>
                  )}
                </div>

                <div className="mt-6 pt-6 border-t">
                  <h4 className="font-semibold text-sm mb-3">Common Item Duties</h4>
                  <div className="space-y-2">
                    {commonItems.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between text-sm"
                      >
                        <div>
                          <div className="font-medium">{item.category}</div>
                          <div className="text-xs text-slate-500">{item.example}</div>
                        </div>
                        <Badge variant="outline">{item.duty}</Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Customs Included Service */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <Card className="h-full border-moroccan-mint/30">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Shield className="h-6 w-6 text-moroccan-mint" />
                  <h3 className="text-xl font-bold">Customs Brokerage Service</h3>
                  <Badge className="ml-auto bg-moroccan-mint text-white">+€20</Badge>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
                  Skip the hassle. Our licensed customs brokers handle all documentation
                  and clearance for you.
                </p>

                <ul className="space-y-3 mb-6">
                  {customsIncludedFeatures.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-moroccan-mint flex-shrink-0 mt-0.5" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg mb-6">
                  <div className="flex items-start gap-2">
                    <HelpCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm text-blue-900 dark:text-blue-200 font-semibold mb-1">
                        Why Use This Service?
                      </p>
                      <ul className="text-xs text-blue-800 dark:text-blue-300 space-y-1">
                        <li>• Avoid customs delays (saves 2-4 days)</li>
                        <li>• No paperwork stress</li>
                        <li>• Pre-calculated duty estimates</li>
                        <li>• Peace of mind guarantee</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <Button
                  className="w-full bg-moroccan-mint hover:bg-moroccan-mint-600"
                  asChild
                >
                  <Link href="/services/specialized">
                    Learn More About Customs Service
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Prohibited Items Alert */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <Alert className="border-red-200 dark:border-red-900">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <span className="font-semibold text-red-900 dark:text-red-200">
                    Prohibited Items:
                  </span>
                  <span className="text-red-800 dark:text-red-300 ml-2">
                    {prohibitedItems.join(" • ")}
                  </span>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/services/specialized#prohibited">
                    View Full List
                    <ChevronRight className="ml-1 h-3 w-3" />
                  </Link>
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        </motion.div>
      </div>
    </section>
  );
}
