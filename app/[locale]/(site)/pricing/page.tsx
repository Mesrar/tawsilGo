"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import {
  Calculator,
  ChevronRight,
  Check,
  X,
  TrendingDown,
  Package,
  Zap,
  Shield,
  FileText,
  ThermometerSnowflake,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function PricingPage() {
  const t = useTranslations('pricing');
  const locale = useLocale();
  const isRTL = locale === 'ar';
  // Calculator state
  const [origin, setOrigin] = useState<string>("france");
  const [destination, setDestination] = useState<string>("morocco");
  const [weight, setWeight] = useState<number>(5);
  const [addOns, setAddOns] = useState({
    express: false,
    insurance: false,
    customs: false,
    fragile: false,
  });

  // Base pricing matrix (€)
  const basePricing: { [key: string]: { [key: string]: number[] } } = {
    france: {
      morocco: [18, 28, 45, 68], // 0-5kg, 5-10kg, 10-20kg, 20-30kg
    },
    spain: {
      morocco: [22, 32, 52, 78],
    },
    belgium: {
      morocco: [24, 36, 58, 85],
    },
    netherlands: {
      morocco: [24, 36, 58, 85],
    },
    italy: {
      morocco: [26, 38, 62, 90],
    },
  };

  // Add-on pricing
  const addOnPrices = {
    express: 15,
    insurance: 8,
    customs: 20,
    fragile: 5,
  };

  // Calculate price
  const calculatePrice = () => {
    const prices = basePricing[origin]?.[destination] || [0, 0, 0, 0];
    let basePrice = 0;

    if (weight <= 5) basePrice = prices[0];
    else if (weight <= 10) basePrice = prices[1];
    else if (weight <= 20) basePrice = prices[2];
    else basePrice = prices[3];

    let total = basePrice;
    if (addOns.express) total += addOnPrices.express;
    if (addOns.insurance) total += addOnPrices.insurance;
    if (addOns.customs) total += addOnPrices.customs;
    if (addOns.fragile) total += addOnPrices.fragile;

    return { basePrice, total };
  };

  const { basePrice, total } = calculatePrice();

  // Competitor comparison
  const competitors = [
    {
      name: "DHL",
      price: basePrice * 3.8,
      duration: "4-6 days",
      color: "text-yellow-600",
    },
    {
      name: "UPS",
      price: basePrice * 3.5,
      duration: "5-7 days",
      color: "text-amber-700",
    },
    {
      name: "FedEx",
      price: basePrice * 3.2,
      duration: "4-5 days",
      color: "text-purple-600",
    },
    {
      name: "TawsilGo",
      price: total,
      duration: "2-3 days",
      color: "text-moroccan-mint",
      highlight: true,
    },
  ];

  const savings = Math.round(
    ((competitors[0].price - total) / competitors[0].price) * 100
  );

  // Standard pricing table
  const pricingTiers = [
    {
      weight: "0-5kg",
      france: "€18",
      spain: "€22",
      belgium: "€24",
      popular: true,
    },
    {
      weight: "5-10kg",
      france: "€28",
      spain: "€32",
      belgium: "€36",
      popular: false,
    },
    {
      weight: "10-20kg",
      france: "€45",
      spain: "€52",
      belgium: "€58",
      popular: false,
    },
    {
      weight: "20-30kg",
      france: "€68",
      spain: "€78",
      belgium: "€85",
      popular: false,
    },
  ];

  const addOnsDetails = [
    {
      id: "express",
      icon: <Zap className="h-5 w-5" />,
      name: t('addOns.express.name'),
      price: t('addOns.express.price'),
      description: t('addOns.express.description'),
      checked: addOns.express,
    },
    {
      id: "insurance",
      icon: <Shield className="h-5 w-5" />,
      name: t('addOns.insurance.name'),
      price: t('addOns.insurance.price'),
      description: t('addOns.insurance.description'),
      checked: addOns.insurance,
    },
    {
      id: "customs",
      icon: <FileText className="h-5 w-5" />,
      name: t('addOns.customs.name'),
      price: t('addOns.customs.price'),
      description: t('addOns.customs.description'),
      checked: addOns.customs,
    },
    {
      id: "fragile",
      icon: <ThermometerSnowflake className="h-5 w-5" />,
      name: t('addOns.fragile.name'),
      price: t('addOns.fragile.price'),
      description: t('addOns.fragile.description'),
      checked: addOns.fragile,
    },
  ];

  return (
    <main className="min-h-screen" dir={isRTL ? "rtl" : "ltr"}>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-moroccan-blue-midnight via-slate-900 to-moroccan-mint-900 text-white py-20 px-4 overflow-hidden">
        <div className="container mx-auto max-w-6xl relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <Badge className="mb-4 bg-moroccan-mint text-white border-none">
              {t('hero.badge')}
            </Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              {t('hero.title')}
              <span className="block text-moroccan-mint mt-2">{t('hero.titleHighlight')}</span>
            </h1>
            <p className="text-xl md:text-2xl text-slate-200 mb-8 max-w-3xl mx-auto">
              {t('hero.subtitle')}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Interactive Calculator */}
      <section className="py-16 px-4 bg-slate-50 dark:bg-slate-900">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Calculator Input */}
              <Card className="border-2 border-moroccan-mint/20">
                <CardContent className="p-8">
                  <div className={`flex items-center gap-2 mb-6 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <Calculator className="h-6 w-6 text-moroccan-mint" />
                    <h2 className="text-2xl font-bold">{t('calculator.title')}</h2>
                  </div>

                  <div className="space-y-6">
                    {/* Origin */}
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${isRTL ? 'text-right' : ''}`}>
                        {t('calculator.originCountry')}
                      </label>
                      <Select value={origin} onValueChange={setOrigin}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="france">🇫🇷 France</SelectItem>
                          <SelectItem value="spain">🇪🇸 Spain</SelectItem>
                          <SelectItem value="belgium">🇧🇪 Belgium</SelectItem>
                          <SelectItem value="netherlands">🇳🇱 Netherlands</SelectItem>
                          <SelectItem value="italy">🇮🇹 Italy</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Destination */}
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${isRTL ? 'text-right' : ''}`}>
                        {t('calculator.destinationCountry')}
                      </label>
                      <Select value={destination} onValueChange={setDestination}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="morocco">🇲🇦 Morocco</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Weight */}
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${isRTL ? 'text-right' : ''}`}>
                        {t('calculator.parcelWeight', { weight: `${weight}` })}
                      </label>
                      <Slider
                        value={[weight]}
                        onValueChange={(value) => setWeight(value[0])}
                        min={1}
                        max={30}
                        step={1}
                        className="mb-2"
                      />
                      <div className="flex justify-between text-xs text-slate-500">
                        <span>1kg</span>
                        <span>30kg</span>
                      </div>
                    </div>

                    {/* Add-ons */}
                    <div>
                      <label className={`block text-sm font-medium mb-3 ${isRTL ? 'text-right' : ''}`}>
                        {t('calculator.addOnServices')}
                      </label>
                      <div className="space-y-3">
                        {addOnsDetails.map((addon) => (
                          <div
                            key={addon.id}
                            className="flex items-start gap-3 p-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                          >
                            <Checkbox
                              checked={addon.checked}
                              onCheckedChange={(checked) =>
                                setAddOns({ ...addOns, [addon.id]: checked as boolean })
                              }
                              className="mt-0.5"
                            />
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <div className="text-moroccan-mint">{addon.icon}</div>
                                <span className="font-medium text-sm">{addon.name}</span>
                                <span className="text-xs text-moroccan-mint font-semibold ml-auto">
                                  {addon.price}
                                </span>
                              </div>
                              <p className="text-xs text-slate-600 dark:text-slate-400">
                                {addon.description}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Price Result */}
              <div className="space-y-6">
                <Card className="bg-gradient-to-br from-moroccan-mint to-moroccan-mint-600 text-white border-none">
                  <CardContent className="p-8">
                    <h3 className={`text-xl font-bold mb-6 ${isRTL ? 'text-right' : ''}`}>{t('quote.title')}</h3>

                    <div className="space-y-4 mb-6">
                      <div className={`flex ${isRTL ? 'flex-row-reverse' : ''} justify-between items-center`}>
                        <span className="text-white/80">{t('quote.baseShipping')}</span>
                        <span className="font-semibold">€{basePrice}</span>
                      </div>

                      {addOns.express && (
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-white/80">Express delivery:</span>
                          <span>+€{addOnPrices.express}</span>
                        </div>
                      )}
                      {addOns.insurance && (
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-white/80">Premium insurance:</span>
                          <span>+€{addOnPrices.insurance}</span>
                        </div>
                      )}
                      {addOns.customs && (
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-white/80">Customs brokerage:</span>
                          <span>+€{addOnPrices.customs}</span>
                        </div>
                      )}
                      {addOns.fragile && (
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-white/80">Fragile handling:</span>
                          <span>+€{addOnPrices.fragile}</span>
                        </div>
                      )}

                      <div className="border-t border-white/20 pt-4">
                        <div className="flex justify-between items-center">
                          <span className="text-lg font-semibold">Total:</span>
                          <span className="text-4xl font-bold">€{total}</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white/10 p-4 rounded-lg mb-6">
                      <div className="flex items-center gap-2 mb-2">
                        <Check className="h-5 w-5" />
                        <span className="font-semibold">What's Included:</span>
                      </div>
                      <ul className="text-sm space-y-1 text-white/90">
                        <li>• Door-to-door pickup & delivery</li>
                        <li>• Real-time GPS tracking</li>
                        <li>• €500 insurance coverage</li>
                        <li>• 48-72 hour delivery</li>
                      </ul>
                    </div>

                    <Button
                      size="lg"
                      className="w-full bg-white text-moroccan-mint hover:bg-slate-100 h-14"
                      asChild
                    >
                      <Link href={`/booking?from=${origin}&to=${destination}&weight=${weight}`}>
                        Book This Shipment
                        <ChevronRight className="ml-2 h-5 w-5" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>

                {/* Savings Badge */}
                <Alert className="border-green-200 bg-green-50 dark:bg-green-900/20 dark:border-green-900">
                  <TrendingDown className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-900 dark:text-green-200">
                    <span className="font-semibold">You save {savings}%</span> compared to
                    DHL (€{Math.round(competitors[0].price)})
                  </AlertDescription>
                </Alert>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Competitor Comparison */}
      <section className="py-16 px-4 bg-white dark:bg-slate-950">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Compare & Save
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-lg">
              See how much you save with TawsilGo vs traditional carriers
            </p>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-4">
            {competitors.map((competitor, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card
                  className={`${
                    competitor.highlight
                      ? "border-moroccan-mint border-2 shadow-lg"
                      : ""
                  }`}
                >
                  <CardContent className="p-6 text-center">
                    {competitor.highlight && (
                      <Badge className="mb-3 bg-moroccan-mint text-white">
                        Best Value
                      </Badge>
                    )}
                    <h3
                      className={`text-xl font-bold mb-2 ${competitor.color}`}
                    >
                      {competitor.name}
                    </h3>
                    <div className="text-3xl font-bold mb-2">
                      €{Math.round(competitor.price)}
                    </div>
                    <div className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                      {competitor.duration}
                    </div>
                    {competitor.highlight ? (
                      <div className="space-y-2 text-sm text-left">
                        <div className="flex items-center gap-2">
                          <Check className="h-4 w-4 text-moroccan-mint" />
                          <span>Door-to-door</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Check className="h-4 w-4 text-moroccan-mint" />
                          <span>Live tracking</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Check className="h-4 w-4 text-moroccan-mint" />
                          <span>€500 insurance</span>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2 text-sm text-left">
                        <div className="flex items-center gap-2">
                          <X className="h-4 w-4 text-slate-400" />
                          <span className="text-slate-500">Higher cost</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <X className="h-4 w-4 text-slate-400" />
                          <span className="text-slate-500">Slower delivery</span>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Standard Pricing Table */}
      <section className="py-16 px-4 bg-slate-50 dark:bg-slate-900">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Standard Pricing Table
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-lg">
              All prices to Morocco. No hidden fees.
            </p>
          </motion.div>

          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-100 dark:bg-slate-800">
                    <tr>
                      <th className="text-left p-4 font-semibold">Weight Range</th>
                      <th className="text-left p-4 font-semibold">From France</th>
                      <th className="text-left p-4 font-semibold">From Spain</th>
                      <th className="text-left p-4 font-semibold">From Belgium/NL</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pricingTiers.map((tier, index) => (
                      <tr
                        key={index}
                        className={`border-b dark:border-slate-700 ${
                          tier.popular ? "bg-moroccan-mint/5" : ""
                        }`}
                      >
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <Package className="h-4 w-4 text-slate-500" />
                            <span className="font-medium">{tier.weight}</span>
                            {tier.popular && (
                              <Badge className="bg-moroccan-mint text-white text-xs">
                                Popular
                              </Badge>
                            )}
                          </div>
                        </td>
                        <td className="p-4 font-semibold text-moroccan-mint">
                          {tier.france}
                        </td>
                        <td className="p-4 font-semibold text-moroccan-mint">
                          {tier.spain}
                        </td>
                        <td className="p-4 font-semibold text-moroccan-mint">
                          {tier.belgium}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          <Alert className="mt-6">
            <Info className="h-4 w-4" />
            <AlertDescription>
              Prices shown are for standard delivery (48-72 hours). Express and specialized
              services available at additional cost.{" "}
              <Link
                href="/services/specialized"
                className="text-moroccan-mint hover:underline"
              >
                View all services →
              </Link>
            </AlertDescription>
          </Alert>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-gradient-to-br from-moroccan-mint to-moroccan-mint-600 text-white">
        <div className="container mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Ship?
            </h2>
            <p className="text-xl mb-8 text-white/90">
              Get your instant quote and book in 3 minutes
            </p>
            <Button
              size="lg"
              className="bg-white text-moroccan-mint hover:bg-slate-100 h-14 px-8 text-lg"
              asChild
            >
              <Link href="/booking">
                Start Booking Now
                <ChevronRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
