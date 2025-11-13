"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import {
  MapPin,
  ChevronRight,
  Truck,
  Clock,
  Package,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTranslations, useLocale } from "next-intl";

export default function RouteCoveragePage() {
  const t = useTranslations('services.routeCoverage');
  const locale = useLocale();
  const isRTL = locale === 'ar';

  const [selectedOrigin, setSelectedOrigin] = useState<string>("");
  const [selectedDestination, setSelectedDestination] = useState<string>("");

  const europeanCities = [
    {
      city: "Paris",
      country: "France",
      flag: "🇫🇷",
      routes: 8,
      frequency: "Daily",
      pickupAreas: ["75, 91, 92, 93, 94, 95"],
    },
    {
      city: "Lyon",
      country: "France",
      flag: "🇫🇷",
      routes: 4,
      frequency: "3x/week",
      pickupAreas: ["69, 38, 01"],
    },
    {
      city: "Marseille",
      country: "France",
      flag: "🇫🇷",
      routes: 3,
      frequency: "3x/week",
      pickupAreas: ["13, 83, 84"],
    },
    {
      city: "Madrid",
      country: "Spain",
      flag: "🇪🇸",
      routes: 5,
      frequency: "Daily",
      pickupAreas: ["28, 19, 45"],
    },
    {
      city: "Barcelona",
      country: "Spain",
      flag: "🇪🇸",
      routes: 4,
      frequency: "Daily",
      pickupAreas: ["08, 17, 43"],
    },
    {
      city: "Brussels",
      country: "Belgium",
      flag: "🇧🇪",
      routes: 3,
      frequency: "4x/week",
      pickupAreas: ["1000-1200, Brabant"],
    },
    {
      city: "Amsterdam",
      country: "Netherlands",
      flag: "🇳🇱",
      routes: 3,
      frequency: "4x/week",
      pickupAreas: ["1000-1100, Randstad"],
    },
    {
      city: "Frankfurt",
      country: "Germany",
      flag: "🇩🇪",
      routes: 2,
      frequency: "2x/week",
      pickupAreas: ["60, 61, 63"],
    },
  ];

  const moroccanCities = [
    {
      city: "Casablanca",
      region: "Grand Casablanca",
      flag: "🇲🇦",
      deliveries: "2,500+/month",
      coverage: "Full city + suburbs",
    },
    {
      city: "Rabat",
      region: "Rabat-Salé-Kénitra",
      flag: "🇲🇦",
      deliveries: "1,800+/month",
      coverage: "Full city + Salé",
    },
    {
      city: "Marrakech",
      region: "Marrakech-Safi",
      flag: "🇲🇦",
      deliveries: "1,400+/month",
      coverage: "Medina + Gueliz + Hivernage",
    },
    {
      city: "Tangier",
      region: "Tanger-Tétouan-Al Hoceïma",
      flag: "🇲🇦",
      deliveries: "1,200+/month",
      coverage: "Full city + port area",
    },
    {
      city: "Fez",
      region: "Fès-Meknès",
      flag: "🇲🇦",
      deliveries: "950+/month",
      coverage: "Fes el-Bali + Fes Jdid + Ville Nouvelle",
    },
    {
      city: "Agadir",
      region: "Souss-Massa",
      flag: "🇲🇦",
      deliveries: "720+/month",
      coverage: "Full city + beach area",
    },
    {
      city: "Meknes",
      region: "Fès-Meknès",
      flag: "🇲🇦",
      deliveries: "580+/month",
      coverage: "Full city coverage",
    },
    {
      city: "Oujda",
      region: "Oriental",
      flag: "🇲🇦",
      deliveries: "420+/month",
      coverage: "Full city coverage",
    },
  ];

  const popularRoutes = [
    {
      from: "Paris",
      to: "Casablanca",
      duration: "48-58 hours",
      frequency: "Daily",
      price: "From €18",
    },
    {
      from: "Madrid",
      to: "Tangier",
      duration: "36-42 hours",
      frequency: "Daily",
      price: "From €22",
    },
    {
      from: "Brussels",
      to: "Rabat",
      duration: "52-62 hours",
      frequency: "4x/week",
      price: "From €24",
    },
    {
      from: "Barcelona",
      to: "Marrakech",
      duration: "48-56 hours",
      frequency: "Daily",
      price: "From €22",
    },
  ];

  return (
    <main className="min-h-screen" dir={isRTL ? "rtl" : "ltr"}>
      {/* Hero Section */}
      <section className="relative min-h-[100svh] flex flex-col justify-center py-20 px-4 overflow-hidden">
        {/* Enhanced background with animations */}
        <div className="absolute inset-0 bg-gradient-to-br from-moroccan-blue-midnight via-slate-900 to-moroccan-mint-900 z-0" />

        {/* Animated gradient shimmer overlay - matching other service pages */}
        <div className="absolute inset-0 opacity-30 motion-reduce:hidden z-5">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-moroccan-mint/20 to-transparent animate-bounce-x" />
        </div>

        {/* Floating Moroccan geometric particles - matching other service pages */}
        <div className="absolute inset-0 pointer-events-none motion-reduce:hidden z-5">
          <div className="absolute top-20 left-10 w-8 h-8 border-2 border-moroccan-mint/30 rotate-45 animate-bounce" style={{ animationDelay: '0s', animationDuration: '3s' }} />
          <div className="absolute top-40 right-20 w-12 h-12 border-2 border-moroccan-blue-chefchaouen/20 rotate-12 animate-bounce" style={{ animationDelay: '1s', animationDuration: '4s' }} />
          <div className="absolute bottom-32 left-1/4 w-6 h-6 border-2 border-moroccan-mint/25 rotate-45 animate-bounce" style={{ animationDelay: '2s', animationDuration: '3.5s' }} />
          <div className="absolute top-1/3 right-1/3 w-10 h-10 border-2 border-moroccan-blue-chefchaouen/15 rotate-45 animate-bounce" style={{ animationDelay: '1.5s', animationDuration: '5s' }} />
          <div className="absolute bottom-20 right-1/4 w-8 h-8 border-2 border-moroccan-mint/20 rotate-12 animate-bounce" style={{ animationDelay: '0.5s', animationDuration: '4.5s' }} />
        </div>

        {/* Moroccan pattern overlay - matching other service pages */}
        <div
          className="absolute inset-0 opacity-10 z-5"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2300D4AA' fill-opacity='0.3'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />

        <div className="container mx-auto max-w-6xl relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Badge className="mb-4 bg-moroccan-mint text-white border-none">
                {t('hero.badge')}
              </Badge>
            </motion.div>

            <motion.h1
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
            >
              {t('hero.title')}
              <motion.span
                className="block text-moroccan-mint mt-2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                {t('hero.titleHighlight')}
              </motion.span>
            </motion.h1>

            <motion.p
              className="text-xl md:text-2xl text-slate-200 mb-8 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              {t('hero.subtitle')}
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Route Finder */}
      <section className="py-12 px-4 bg-white dark:bg-slate-900 border-b">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Card>
              <CardContent className="p-6">
                <h3 className={`text-xl font-bold mb-4 flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <Search className="h-5 w-5 text-moroccan-mint" />
                  {t('routeFinder.title')}
                </h3>
                <div className="grid md:grid-cols-3 gap-4">
                  <Select value={selectedOrigin} onValueChange={setSelectedOrigin}>
                    <SelectTrigger>
                      <SelectValue placeholder={t('routeFinder.selectOrigin')} />
                    </SelectTrigger>
                    <SelectContent>
                      {europeanCities.map((city, index) => (
                        <SelectItem key={index} value={city.city}>
                          {city.flag} {city.city}, {city.country}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select
                    value={selectedDestination}
                    onValueChange={setSelectedDestination}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={t('routeFinder.selectDestination')} />
                    </SelectTrigger>
                    <SelectContent>
                      {moroccanCities.map((city, index) => (
                        <SelectItem key={index} value={city.city}>
                          {city.flag} {city.city}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Button
                    className="bg-moroccan-mint hover:bg-moroccan-mint-600"
                    disabled={!selectedOrigin || !selectedDestination}
                    asChild
                  >
                    <Link
                      href={`/booking?from=${selectedOrigin}&to=${selectedDestination}`}
                    >
                      {t('routeFinder.getPrice')}
                      <ChevronRight className={`h-4 w-4 ${isRTL ? 'mr-2' : 'ml-2'}`} />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* European Cities */}
      <section className="py-16 px-4 bg-slate-50 dark:bg-slate-900">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className={`text-center mb-12 ${isRTL ? 'text-right' : ''}`}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {t('europeanCities.title')}
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-lg">
              {t('europeanCities.subtitle')}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {europeanCities.map((city, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.08,
                  type: "spring",
                  stiffness: 100
                }}
                whileHover={{ y: -5, scale: 1.02 }}
              >
                <Card className="h-full hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
                  <CardContent className="p-6">
                    <motion.div
                      className="text-4xl mb-3"
                      whileHover={{ scale: 1.2, rotate: 10 }}
                      transition={{ duration: 0.3 }}
                    >
                      {city.flag}
                    </motion.div>
                    <h3 className="text-xl font-bold mb-1">{city.city}</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                      {city.country}
                    </p>
                    <div className="space-y-2 text-sm">
                      <motion.div
                        className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 + index * 0.05 }}
                      >
                        <motion.div
                          whileHover={{ scale: 1.2, rotate: 15 }}
                          transition={{ duration: 0.2 }}
                        >
                          <Truck className="h-4 w-4 text-moroccan-mint" />
                        </motion.div>
                        <span>{city.routes} {t('europeanCities.routes')}</span>
                      </motion.div>
                      <motion.div
                        className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.4 + index * 0.05 }}
                      >
                        <motion.div
                          whileHover={{ scale: 1.2, rotate: 15 }}
                          transition={{ duration: 0.2 }}
                        >
                          <Clock className="h-4 w-4 text-moroccan-mint" />
                        </motion.div>
                        <span>{city.frequency}</span>
                      </motion.div>
                      <motion.div
                        className="flex items-start gap-2"
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.5 + index * 0.05 }}
                      >
                        <motion.div
                          whileHover={{ scale: 1.2, rotate: 15 }}
                          transition={{ duration: 0.2 }}
                        >
                          <MapPin className="h-4 w-4 text-moroccan-mint mt-0.5" />
                        </motion.div>
                        <span className="text-xs">{city.pickupAreas.join(", ")}</span>
                      </motion.div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Moroccan Cities */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className={`text-center mb-12 ${isRTL ? 'text-right' : ''}`}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {t('moroccanCities.title')}
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-lg">
              {t('moroccanCities.subtitle')}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {moroccanCities.map((city, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow border-moroccan-mint/20">
                  <CardContent className="p-6">
                    <div className="text-4xl mb-3">{city.flag}</div>
                    <h3 className="text-xl font-bold mb-1">{city.city}</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                      {city.region}
                    </p>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Package className="h-4 w-4 text-moroccan-mint" />
                        <span className="font-semibold text-moroccan-mint">
                          {city.deliveries}
                        </span>
                      </div>
                      <div className="flex items-start gap-2">
                        <MapPin className="h-4 w-4 text-moroccan-mint mt-0.5" />
                        <span className="text-xs">{city.coverage}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Routes */}
      <section className="py-16 px-4 bg-slate-50 dark:bg-slate-900">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className={`text-center mb-12 ${isRTL ? 'text-right' : ''}`}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {t('popularRoutes.title')}
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-lg">
              {t('popularRoutes.subtitle')}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            {popularRoutes.map((route, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <MapPin className="h-5 w-5 text-blue-500" />
                        <span className="font-semibold text-lg">{route.from}</span>
                      </div>
                      <ChevronRight className="h-5 w-5 text-moroccan-mint" />
                      <div className="flex items-center gap-3">
                        <span className="font-semibold text-lg">{route.to}</span>
                        <MapPin className="h-5 w-5 text-moroccan-mint" />
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <div className="text-slate-500 mb-1">{t('popularRoutes.duration')}</div>
                        <div className="font-semibold">{route.duration}</div>
                      </div>
                      <div>
                        <div className="text-slate-500 mb-1">{t('popularRoutes.frequency')}</div>
                        <div className="font-semibold">{route.frequency}</div>
                      </div>
                      <div>
                        <div className="text-slate-500 mb-1">{t('popularRoutes.price')}</div>
                        <div className="font-semibold text-moroccan-mint">
                          {route.price}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-gradient-to-br from-moroccan-mint to-moroccan-mint-600 text-white relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 pointer-events-none motion-reduce:hidden">
          <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full animate-bounce" style={{ animationDelay: '0s', animationDuration: '3s' }} />
          <div className="absolute bottom-10 right-20 w-16 h-16 bg-white/5 rounded-full animate-bounce" style={{ animationDelay: '1s', animationDuration: '4s' }} />
          <div className="absolute top-1/2 right-1/4 w-12 h-12 bg-white/8 rounded-full animate-bounce" style={{ animationDelay: '0.5s', animationDuration: '3.5s' }} />
        </div>

        <div className="container mx-auto max-w-4xl text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <motion.h2
              className="text-3xl md:text-4xl font-bold mb-4"
              initial={{ scale: 0.9, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
            >
              {t('cta.title')}
            </motion.h2>
            <motion.p
              className="text-xl mb-8 text-white/90"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
            >
              {t('cta.subtitle')}
            </motion.p>
            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 }}
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                <Button
                  size="lg"
                  className="bg-white text-moroccan-mint hover:bg-slate-100 h-14 px-8 text-lg shadow-lg hover:shadow-xl transition-all duration-300"
                  asChild
                >
                  <Link href="/support">
                    {t('cta.requestRoute')}
                    <ChevronRight className={`h-5 w-5 ${isRTL ? 'mr-2' : 'ml-2'}`} />
                  </Link>
                </Button>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white/10 h-14 px-8 text-lg"
                  asChild
                >
                  <Link href="/booking">{t('cta.bookRoute')}</Link>
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
