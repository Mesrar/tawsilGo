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
import { ServiceHero } from "@/components/Services/ServiceHero";
import { TrustMarquee } from "@/components/TrustMarquee";

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
      <ServiceHero
        badge={t('hero.badge')}
        title={t('hero.title')}
        titleHighlight={t('hero.titleHighlight')}
        subtitle={t('hero.subtitle')}
        imageSrc="/images/services/individual-shipping.png"
        ctaText={t('hero.bookNow')}
        ctaLink="/booking"
        secondaryCtaText={t('hero.viewPricing')}
        secondaryCtaLink="/pricing"
      />

      <TrustMarquee />

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
                <Card className={`h-full transition-all duration-300 ${tier.popular
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
