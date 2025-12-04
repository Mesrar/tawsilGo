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
    <section className="relative py-20 px-4 bg-slate-50 dark:bg-slate-900 overflow-hidden">
      {/* Moroccan Pattern Overlay */}
      <div className="absolute inset-0 bg-moroccan-pattern opacity-5 pointer-events-none" />

      <div className="container mx-auto max-w-6xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-xs font-bold inline-block px-4 py-1.5 rounded-full bg-moroccan-mint/10 text-moroccan-mint-700 dark:text-moroccan-mint-300 uppercase tracking-wider mb-4 border border-moroccan-mint/20">
            Customs Made Simple
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-slate-900 dark:text-white">
            No Customs Surprises
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed">
            Cross-border shipping can be confusing. We handle the paperwork and keep you
            informed every step of the way.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 mb-16">
          {/* Duty Calculator */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <Card className="h-full border-0 shadow-lg shadow-slate-200/50 dark:shadow-black/20 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-moroccan-mint" />
              <CardContent className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-12 w-12 rounded-xl bg-moroccan-mint/10 flex items-center justify-center">
                    <Calculator className="h-6 w-6 text-moroccan-mint" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Duty Calculator</h3>
                </div>
                <p className="text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
                  Estimate customs duties for your parcel. Morocco has a de minimis
                  threshold of €150.
                </p>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wide">
                      Parcel Value (€)
                    </label>
                    <div className="flex gap-3">
                      <Input
                        type="number"
                        placeholder="Enter total value"
                        value={parcelValue}
                        onChange={(e) => setParcelValue(e.target.value)}
                        className="flex-1 h-12 text-lg bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700"
                      />
                      <Button
                        onClick={calculateDuty}
                        className="bg-moroccan-mint hover:bg-moroccan-mint-600 h-12 px-6 font-bold text-white shadow-md shadow-moroccan-mint/20"
                      >
                        Calculate
                      </Button>
                    </div>
                  </div>

                  {estimatedDuty !== null && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="bg-moroccan-mint/5 p-6 rounded-2xl border border-moroccan-mint/20"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-bold text-slate-700 dark:text-slate-300">Estimated Duty:</span>
                        <span className="text-3xl font-bold text-moroccan-mint">
                          €{estimatedDuty.toFixed(2)}
                        </span>
                      </div>
                      {estimatedDuty === 0 && (
                        <p className="text-sm text-green-700 dark:text-green-300 flex items-center gap-2 font-medium bg-green-50 dark:bg-green-900/20 p-2 rounded-lg">
                          <Check className="h-4 w-4" />
                          No duty! Value is below €150 threshold.
                        </p>
                      )}
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-3 italic">
                        *Estimate only. Final duty determined by Morocco customs.
                      </p>
                    </motion.div>
                  )}
                </div>

                <div className="mt-8 pt-8 border-t border-slate-100 dark:border-slate-700">
                  <h4 className="font-bold text-sm mb-4 uppercase tracking-wide text-slate-500 dark:text-slate-400">Common Item Duties</h4>
                  <div className="space-y-3">
                    {commonItems.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between text-sm p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                      >
                        <div>
                          <div className="font-bold text-slate-800 dark:text-white">{item.category}</div>
                          <div className="text-xs text-slate-500">{item.example}</div>
                        </div>
                        <Badge variant="secondary" className="bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold">{item.duty}</Badge>
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
            <Card className="h-full border border-moroccan-mint/20 shadow-lg shadow-moroccan-mint/5 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm relative overflow-hidden">
              {/* Decorative background blob */}
              <div className="absolute -top-20 -right-20 w-64 h-64 bg-moroccan-mint/5 rounded-full blur-3xl pointer-events-none" />

              <CardContent className="p-8 relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-12 w-12 rounded-xl bg-moroccan-mint/10 flex items-center justify-center">
                    <Shield className="h-6 w-6 text-moroccan-mint" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Customs Brokerage</h3>
                  <Badge className="ml-auto bg-moroccan-mint text-white font-bold px-3 py-1">+€20</Badge>
                </div>
                <p className="text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
                  Skip the hassle. Our licensed customs brokers handle all documentation
                  and clearance for you.
                </p>

                <ul className="space-y-4 mb-8">
                  {customsIncludedFeatures.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="mt-0.5 bg-green-100 dark:bg-green-900/30 p-1 rounded-full">
                        <Check className="h-3.5 w-3.5 text-green-600 dark:text-green-400" />
                      </div>
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{feature}</span>
                    </li>
                  ))}
                </ul>

                <div className="bg-blue-50 dark:bg-blue-900/10 p-5 rounded-xl mb-8 border border-blue-100 dark:border-blue-900/20">
                  <div className="flex items-start gap-3">
                    <HelpCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm text-blue-900 dark:text-blue-200 font-bold mb-2">
                        Why Use This Service?
                      </p>
                      <ul className="text-xs text-blue-800 dark:text-blue-300 space-y-1.5 font-medium">
                        <li>• Avoid customs delays (saves 2-4 days)</li>
                        <li>• No paperwork stress</li>
                        <li>• Pre-calculated duty estimates</li>
                        <li>• Peace of mind guarantee</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <Button
                  className="w-full bg-moroccan-mint hover:bg-moroccan-mint-600 h-12 text-lg font-bold shadow-md shadow-moroccan-mint/20"
                  asChild
                >
                  <Link href="/services/specialized">
                    Learn More About Customs Service
                    <ChevronRight className="ml-2 rtl:ml-0 rtl:mr-2 h-5 w-5 rtl:rotate-180" />
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
          <Alert className="border-red-200 dark:border-red-900/50 bg-red-50/50 dark:bg-red-900/10">
            <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
            <AlertDescription className="ml-2">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <span className="font-bold text-red-900 dark:text-red-200 text-base">
                    Prohibited Items:
                  </span>
                  <span className="text-red-800 dark:text-red-300 ml-2 font-medium">
                    {prohibitedItems.join(" • ")}
                  </span>
                </div>
                <Button variant="outline" size="sm" className="border-red-200 text-red-700 hover:bg-red-50 hover:text-red-800 dark:border-red-800 dark:text-red-300 dark:hover:bg-red-900/30" asChild>
                  <Link href="/services/specialized#prohibited">
                    View Full List
                    <ChevronRight className="ml-1 rtl:ml-0 rtl:mr-1 h-3 w-3 rtl:rotate-180" />
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
