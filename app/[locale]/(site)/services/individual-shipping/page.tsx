"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  Package,
  Truck,
  MapPin,
  Clock,
  Shield,
  ChevronRight,
  Check,
  Heart,
  Home,
  Gift,
  Users,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useTranslations, useLocale } from "next-intl";

export default function IndividualShippingPage() {
  const t = useTranslations('services.individualShipping');
  const locale = useLocale();
  const isRTL = locale === 'ar';

  const features = [
    {
      icon: <Package className="h-6 w-6" />,
      title: t('features.doorToDoor.title'),
      description: t('features.doorToDoor.description'),
    },
    {
      icon: <Clock className="h-6 w-6" />,
      title: t('features.fastDelivery.title'),
      description: t('features.fastDelivery.description'),
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: t('features.insurance.title'),
      description: t('features.insurance.description'),
    },
    {
      icon: <Truck className="h-6 w-6" />,
      title: t('features.tracking.title'),
      description: t('features.tracking.description'),
    },
    {
      icon: <MapPin className="h-6 w-6" />,
      title: t('features.cities.title'),
      description: t('features.cities.description'),
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: t('features.verified.title'),
      description: t('features.verified.description'),
    },
  ];

  const useCases = [
    {
      icon: <Heart className="h-5 w-5" />,
      title: t('useCases.carePackages.title'),
      example: t('useCases.carePackages.example'),
    },
    {
      icon: <Gift className="h-5 w-5" />,
      title: t('useCases.gifts.title'),
      example: t('useCases.gifts.example'),
    },
    {
      icon: <Home className="h-5 w-5" />,
      title: t('useCases.belongings.title'),
      example: t('useCases.belongings.example'),
    },
  ];

  const pricingTiers = [
    { weight: "0-5kg", price: "€18", popular: true },
    { weight: "5-10kg", price: "€28", popular: false },
    { weight: "10-20kg", price: "€45", popular: false },
    { weight: "20-30kg", price: "€68", popular: false },
  ];

  const testimonials = [
    {
      name: t('testimonials.fatima.name'),
      location: t('testimonials.fatima.location'),
      rating: 5,
      text: t('testimonials.fatima.text'),
    },
    {
      name: t('testimonials.ahmed.name'),
      location: t('testimonials.ahmed.location'),
      rating: 5,
      text: t('testimonials.ahmed.text'),
    },
    {
      name: t('testimonials.sophia.name'),
      location: t('testimonials.sophia.location'),
      rating: 5,
      text: t('testimonials.sophia.text'),
    },
  ];

  return (
    <main className="min-h-screen" dir={isRTL ? "rtl" : "ltr"}>
      {/* Hero Section */}
      <section className="relative min-h-[100svh] flex flex-col justify-start md:justify-between pt-16 md:pt-24 pb-40 overflow-hidden">
        {/* Hero background image with Next.js optimization - matching booking hero */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-moroccan-mint-900 via-slate-900 to-moroccan-blue-midnight" />

          {/* Lighter overlay for better contrast with dark text - matching booking hero */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/70 via-white/60 to-white/75 md:bg-gradient-to-br md:from-white/65 md:via-white/55 md:to-white/70 dark:from-slate-950/80 dark:via-slate-950/70 dark:to-slate-950/85" />
        </div>

        {/* Animated gradient shimmer overlay - matching how-it-works */}
        <div className="absolute inset-0 opacity-30 motion-reduce:hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-moroccan-mint/20 to-transparent animate-bounce-x" />
        </div>

        {/* Floating Moroccan geometric particles - matching how-it-works */}
        <div className="absolute inset-0 pointer-events-none motion-reduce:hidden">
          <div className="absolute top-20 left-10 w-8 h-8 border-2 border-moroccan-mint/30 rotate-45 animate-bounce" style={{ animationDelay: '0s', animationDuration: '3s' }} />
          <div className="absolute top-40 right-20 w-12 h-12 border-2 border-moroccan-blue-chefchaouen/20 rotate-12 animate-bounce" style={{ animationDelay: '1s', animationDuration: '4s' }} />
          <div className="absolute bottom-32 left-1/4 w-6 h-6 border-2 border-moroccan-mint/25 rotate-45 animate-bounce" style={{ animationDelay: '2s', animationDuration: '3.5s' }} />
          <div className="absolute top-1/3 right-1/3 w-10 h-10 border-2 border-moroccan-blue-chefchaouen/15 rotate-45 animate-bounce" style={{ animationDelay: '1.5s', animationDuration: '5s' }} />
          <div className="absolute bottom-20 right-1/4 w-8 h-8 border-2 border-moroccan-mint/20 rotate-12 animate-bounce" style={{ animationDelay: '0.5s', animationDuration: '4.5s' }} />
        </div>

        {/* Moroccan pattern overlay - matching how-it-works */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2300D4AA' fill-opacity='0.3'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />

        {/* Animated gradient accent layer - mobile optimized */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-5">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px]
            bg-gradient-radial from-moroccan-mint-100/40 via-moroccan-mint-50/20 to-transparent
            dark:from-moroccan-mint-900/20 dark:via-moroccan-mint-950/10 dark:to-transparent
            blur-3xl opacity-50 md:opacity-60" />

          {/* Secondary accent - desktop only */}
          <div className="hidden md:block absolute bottom-0 right-0 w-[500px] h-[500px]
            bg-gradient-radial from-blue-50/40 via-slate-50/20 to-transparent
            dark:from-slate-800/30 dark:via-slate-900/20 dark:to-transparent
            blur-3xl opacity-40" />
        </div>

        <div className="relative z-10 w-full max-w-4xl mx-auto px-4 md:px-0 mt-8 md:mt-0">
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
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-slate-900 dark:text-white"
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
              className="text-xl md:text-2xl text-slate-800 dark:text-white/95 mb-8 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              {t('hero.subtitle')}
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
            >
              <Button
                size="lg"
                className="bg-moroccan-mint hover:bg-moroccan-mint-600 text-white h-14 px-8 text-lg shadow-lg hover:shadow-xl transition-all duration-300"
                asChild
              >
                <Link href="/booking">
                  {t('hero.bookNow')}
                  <ChevronRight className={`h-5 w-5 ${isRTL ? 'mr-2' : 'ml-2'}`} />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-moroccan-mint text-moroccan-mint hover:bg-moroccan-mint/10 h-14 px-8 text-lg"
                asChild
              >
                <Link href="/pricing">{t('hero.viewPricing')}</Link>
              </Button>
            </motion.div>

            {/* Quick Stats with staggered animation */}
            <motion.div
              className="grid grid-cols-3 gap-4 mt-12 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              {[
                { value: "70%", label: t('stats.cheaper') },
                { value: "48-72h", label: t('stats.delivery') },
                { value: "99.8%", label: t('stats.onTime') }
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  className="text-center"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{
                    duration: 0.5,
                    delay: 0.9 + (index * 0.1)
                  }}
                >
                  <motion.div
                    className="text-3xl font-bold text-moroccan-mint"
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.2 }}
                  >
                    {stat.value}
                  </motion.div>
                  <div className="text-sm text-slate-700 dark:text-white/90">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
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
              {t('whyChoose.title')}
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-lg max-w-2xl mx-auto">
              {t('whyChoose.subtitle')}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.1,
                  type: "spring",
                  stiffness: 100
                }}
                whileHover={{ y: -5, scale: 1.02 }}
              >
                <Card className="h-full hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
                  <CardContent className="p-6">
                    <motion.div
                      className="h-12 w-12 rounded-lg bg-moroccan-mint/10 text-moroccan-mint flex items-center justify-center mb-4"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ duration: 0.2 }}
                    >
                      {feature.icon}
                    </motion.div>
                    <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                    <p className="text-slate-600 dark:text-slate-400">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className={`text-center mb-12 ${isRTL ? 'text-right' : ''}`}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {t('whatToSend.title')}
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-lg">
              {t('whatToSend.subtitle')}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {useCases.map((useCase, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.15,
                  type: "spring",
                  stiffness: 80
                }}
                whileHover={{ y: -8, scale: 1.03 }}
                className="text-center"
              >
                <motion.div
                  className="h-16 w-16 rounded-full bg-moroccan-mint text-white flex items-center justify-center mx-auto mb-4 shadow-lg"
                  whileHover={{ scale: 1.1, rotate: 10 }}
                  transition={{ duration: 0.3, type: "spring" }}
                >
                  {useCase.icon}
                </motion.div>
                <h3 className="text-xl font-semibold mb-2">{useCase.title}</h3>
                <p className="text-slate-600 dark:text-slate-400">{useCase.example}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Preview */}
      <section className="py-16 px-4 bg-slate-50 dark:bg-slate-900">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className={`text-center mb-12 ${isRTL ? 'text-right' : ''}`}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {t('pricing.title')}
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-lg">
              {t('pricing.subtitle')}
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {pricingTiers.map((tier, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.1,
                  type: "spring",
                  stiffness: 100
                }}
                whileHover={{ y: -5, scale: 1.05 }}
              >
                <Card className={`h-full transition-all duration-300 ${
                  tier.popular
                    ? "border-moroccan-mint border-2 shadow-lg hover:shadow-xl bg-gradient-to-br from-moroccan-mint/5 to-transparent"
                    : "hover:shadow-lg border-0 shadow-md"
                }`}>
                  <CardContent className="p-6 text-center">
                    {tier.popular && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.3 + index * 0.1, type: "spring" }}
                      >
                        <Badge className="mb-2 bg-moroccan-mint text-white">{t('pricing.popular')}</Badge>
                      </motion.div>
                    )}
                    <div className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                      {tier.weight}
                    </div>
                    <motion.div
                      className="text-3xl font-bold text-moroccan-mint mb-2"
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.2 }}
                    >
                      {tier.price}
                    </motion.div>
                    <div className="text-xs text-slate-500">{t('pricing.route')}</div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <motion.div
            className="text-center mt-8"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
          >
            <Button variant="outline" size="lg" className="hover:bg-moroccan-mint hover:text-white transition-all duration-300" asChild>
              <Link href="/pricing">
                {t('pricing.seeCalculator')}
                <ChevronRight className={`h-4 w-4 ${isRTL ? 'mr-2' : 'ml-2'}`} />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className={`text-center mb-12 ${isRTL ? 'text-right' : ''}`}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {t('testimonials.title')}
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-lg">
              {t('testimonials.subtitle')}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30, rotateY: 15 }}
                whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.15,
                  type: "spring",
                  stiffness: 80
                }}
                whileHover={{ y: -5, scale: 1.02 }}
              >
                <Card className="h-full shadow-lg hover:shadow-xl transition-all duration-300 border-0">
                  <CardContent className="p-6">
                    <motion.div
                      className="flex mb-2"
                      initial={{ scale: 0.8, opacity: 0 }}
                      whileInView={{ scale: 1, opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.3 + index * 0.1 }}
                    >
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <motion.div
                          key={i}
                          initial={{ scale: 0, rotate: -180 }}
                          animate={{ scale: 1, rotate: 0 }}
                          transition={{
                            delay: 0.4 + index * 0.1 + i * 0.05,
                            type: "spring",
                            stiffness: 200
                          }}
                        >
                          <Star
                            className="h-4 w-4 text-yellow-400 fill-yellow-400"
                          />
                        </motion.div>
                      ))}
                    </motion.div>
                    <motion.p
                      className="text-slate-700 dark:text-slate-300 mb-4 italic"
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.5 + index * 0.1 }}
                    >
                      "{testimonial.text}"
                    </motion.p>
                    <motion.div
                      className="border-t pt-4"
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.6 + index * 0.1 }}
                    >
                      <div className="font-semibold">{testimonial.name}</div>
                      <div className="text-sm text-slate-500">{testimonial.location}</div>
                    </motion.div>
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
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6, type: "spring", stiffness: 120 }}
              whileHover={{ scale: 1.05 }}
            >
              <Button
                size="lg"
                className="bg-white text-moroccan-mint hover:bg-slate-100 h-14 px-8 text-lg shadow-lg hover:shadow-xl transition-all duration-300"
                asChild
              >
                <Link href="/booking">
                  {t('cta.button')}
                  <ChevronRight className={`h-5 w-5 ${isRTL ? 'mr-2' : 'ml-2'}`} />
                </Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
