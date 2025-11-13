"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  MapPin,
  Package,
  Truck,
  CheckCircle,
  ChevronRight,
  Shield,
  Star,
  Clock,
  QrCode,
  Bell,
  Lock,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useTranslations } from "next-intl";

export default function HowItWorksPage() {
  const t = useTranslations("howItWorksPage");

  const steps = [
    {
      number: 1,
      icon: <Package className="h-8 w-8" />,
      title: t("steps.step1.title"),
      description: t("steps.step1.description"),
      details: [
        t("steps.step1.details.detail1"),
        t("steps.step1.details.detail2"),
        t("steps.step1.details.detail3"),
        t("steps.step1.details.detail4"),
      ],
      color: "bg-blue-500",
    },
    {
      number: 2,
      icon: <MapPin className="h-8 w-8" />,
      title: t("steps.step2.title"),
      description: t("steps.step2.description"),
      details: [
        t("steps.step2.details.detail1"),
        t("steps.step2.details.detail2"),
        t("steps.step2.details.detail3"),
        t("steps.step2.details.detail4"),
      ],
      color: "bg-moroccan-mint",
    },
    {
      number: 3,
      icon: <Truck className="h-8 w-8" />,
      title: t("steps.step3.title"),
      description: t("steps.step3.description"),
      details: [
        t("steps.step3.details.detail1"),
        t("steps.step3.details.detail2"),
        t("steps.step3.details.detail3"),
        t("steps.step3.details.detail4"),
      ],
      color: "bg-amber-500",
    },
    {
      number: 4,
      icon: <CheckCircle className="h-8 w-8" />,
      title: t("steps.step4.title"),
      description: t("steps.step4.description"),
      details: [
        t("steps.step4.details.detail1"),
        t("steps.step4.details.detail2"),
        t("steps.step4.details.detail3"),
        t("steps.step4.details.detail4"),
      ],
      color: "bg-green-500",
    },
  ];

  const safetyFeatures = [
    {
      icon: <Shield className="h-6 w-6" />,
      title: t("safety.features.licensedDrivers.title"),
      description: t("safety.features.licensedDrivers.description"),
    },
    {
      icon: <Lock className="h-6 w-6" />,
      title: t("safety.features.insurance.title"),
      description: t("safety.features.insurance.description"),
    },
    {
      icon: <QrCode className="h-6 w-6" />,
      title: t("safety.features.qrVerification.title"),
      description: t("safety.features.qrVerification.description"),
    },
    {
      icon: <Star className="h-6 w-6" />,
      title: t("safety.features.driverRatings.title"),
      description: t("safety.features.driverRatings.description"),
    },
  ];

  const trackingFeatures = [
    t("tracking.features.feature1"),
    t("tracking.features.feature2"),
    t("tracking.features.feature3"),
    t("tracking.features.feature4"),
    t("tracking.features.feature5"),
    t("tracking.features.feature6"),
  ];

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[100vh] bg-gradient-to-br from-moroccan-blue-midnight via-moroccan-blue-indigo to-slate-900 dark:from-moroccan-blue-midnight dark:via-moroccan-blue-indigo/95 dark:to-slate-950 text-white py-20 px-4 overflow-hidden">
        {/* Animated gradient shimmer overlay */}
        <div className="absolute inset-0 opacity-30 motion-reduce:hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-moroccan-mint/20 to-transparent animate-bounce-x" />
        </div>

        {/* Floating Moroccan geometric particles */}
        <div className="absolute inset-0 pointer-events-none motion-reduce:hidden">
          <div className="absolute top-20 left-10 w-8 h-8 border-2 border-moroccan-mint/30 rotate-45 animate-bounce" style={{ animationDelay: '0s', animationDuration: '3s' }} />
          <div className="absolute top-40 right-20 w-12 h-12 border-2 border-moroccan-blue-chefchaouen/20 rotate-12 animate-bounce" style={{ animationDelay: '1s', animationDuration: '4s' }} />
          <div className="absolute bottom-32 left-1/4 w-6 h-6 border-2 border-moroccan-mint/25 rotate-45 animate-bounce" style={{ animationDelay: '2s', animationDuration: '3.5s' }} />
          <div className="absolute top-1/3 right-1/3 w-10 h-10 border-2 border-moroccan-blue-chefchaouen/15 rotate-45 animate-bounce" style={{ animationDelay: '1.5s', animationDuration: '5s' }} />
          <div className="absolute bottom-20 right-1/4 w-8 h-8 border-2 border-moroccan-mint/20 rotate-12 animate-bounce" style={{ animationDelay: '0.5s', animationDuration: '4.5s' }} />
        </div>

        {/* Moroccan pattern overlay */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2300D4AA' fill-opacity='0.3'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />

        <div className="container mx-auto max-w-6xl relative z-10 px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center pt-safe-top pb-safe-bottom"
          >
            <Badge className="mb-6 bg-moroccan-mint text-white border-none text-sm sm:text-base px-4 py-2 touch-manipulation">
              {t("hero.badge")}
            </Badge>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-6 md:mb-8 leading-tight">
              {t("hero.title")}
              <span className="block text-moroccan-mint mt-2 md:mt-4">
                {t("hero.subtitle")}
              </span>
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-slate-200 mb-8 md:mb-12 max-w-3xl mx-auto px-4 sm:px-0 leading-relaxed">
              {t("hero.description")}
            </p>
            <Button
              size="lg"
              className="bg-moroccan-mint hover:bg-moroccan-mint-600 text-white h-14 sm:h-16 px-6 sm:px-8 text-base sm:text-lg font-medium touch-manipulation min-w-[48px] min-h-[48px] shadow-lg hover:shadow-xl transition-all duration-300"
              asChild
            >
              <Link href="/booking">
                {t("hero.cta")}
                <ChevronRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Steps Process */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {t("deliveryJourney.title")}
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-lg">
              {t("deliveryJourney.subtitle")}
            </p>
          </motion.div>

          <div className="space-y-12">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="grid md:grid-cols-2 gap-8 items-center">
                  {/* Content */}
                  <div className={index % 2 === 0 ? "md:order-1" : "md:order-2"}>
                    <div className="flex items-center gap-4 mb-4">
                      <div
                        className={`h-16 w-16 rounded-full ${step.color} text-white flex items-center justify-center text-2xl font-bold`}
                      >
                        {step.number}
                      </div>
                      <div
                        className={`h-14 w-14 rounded-lg ${step.color}/10 text-${step.color.replace("bg-", "")} flex items-center justify-center`}
                      >
                        {step.icon}
                      </div>
                    </div>
                    <h3 className="text-2xl font-bold mb-3">{step.title}</h3>
                    <p className="text-slate-600 dark:text-slate-400 mb-4 text-lg">
                      {step.description}
                    </p>
                    <ul className="space-y-2">
                      {step.details.map((detail, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <CheckCircle className="h-5 w-5 text-moroccan-mint flex-shrink-0 mt-0.5" />
                          <span className="text-sm">{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Visual */}
                  <div className={index % 2 === 0 ? "md:order-2" : "md:order-1"}>
                    <Card className="border-2 border-slate-100 dark:border-slate-800">
                      <CardContent className="p-8 text-center">
                        <div
                          className={`h-32 w-32 rounded-full ${step.color}/10 mx-auto flex items-center justify-center mb-4`}
                        >
                          <div className={`${step.color} rounded-full p-6 text-white`}>
                            {step.icon}
                          </div>
                        </div>
                        <div className="text-6xl font-bold text-slate-200 dark:text-slate-700">
                          {step.number}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                {/* Connector Line (except for last step) */}
                {index < steps.length - 1 && (
                  <div className="flex justify-center my-8">
                    <div className="h-12 w-0.5 bg-gradient-to-b from-slate-300 to-slate-200 dark:from-slate-700 dark:to-slate-800" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Safety & Trust */}
      <section className="py-16 px-4 bg-slate-50 dark:bg-slate-900">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {t("safety.title")}
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-lg max-w-2xl mx-auto">
              {t("safety.subtitle")}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {safetyFeatures.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full text-center">
                  <CardContent className="p-6">
                    <div className="h-14 w-14 rounded-full bg-moroccan-mint/10 text-moroccan-mint flex items-center justify-center mx-auto mb-4">
                      {feature.icon}
                    </div>
                    <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Tracking Features */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <Badge className="mb-4 bg-moroccan-mint/10 text-moroccan-mint border-none">
                {t("tracking.badge")}
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                {t("tracking.title")}
              </h2>
              <p className="text-slate-600 dark:text-slate-400 text-lg mb-6">
                {t("tracking.description")}
              </p>
              <ul className="space-y-3">
                {trackingFeatures.map((feature, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <div className="h-6 w-6 rounded-full bg-moroccan-mint/10 text-moroccan-mint flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="h-4 w-4" />
                    </div>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-8">
                <Button variant="outline" asChild>
                  <Link href="/tracking">
                    {t("tracking.cta")}
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <Card className="border-2 border-moroccan-mint/20">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {/* Simulated tracking UI */}
                    <div className="bg-moroccan-mint/5 p-4 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">{t("tracking.demo.trackingId")}</span>
                        <Badge className="bg-moroccan-mint text-white">TR-78945612</Badge>
                      </div>
                      <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div className="h-full bg-moroccan-mint" style={{ width: "65%" }} />
                      </div>
                      <div className="text-xs text-slate-500 mt-1">65% {t("tracking.demo.complete")}</div>
                    </div>

                    <div className="space-y-3">
                      {[
                        {
                          status: t("tracking.demo.pickedUp"),
                          location: t("tracking.demo.paris"),
                          time: "2h",
                          completed: true,
                        },
                        {
                          status: t("tracking.demo.inTransit"),
                          location: t("tracking.demo.madrid"),
                          time: "30m",
                          completed: true,
                          active: true,
                        },
                        {
                          status: t("tracking.demo.outForDelivery"),
                          location: t("tracking.demo.casablanca"),
                          time: "18h",
                          completed: false,
                        },
                      ].map((event, i) => (
                        <div key={i} className="flex items-start gap-3">
                          <div
                            className={`h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                              event.completed
                                ? "bg-moroccan-mint text-white"
                                : "bg-slate-200 dark:bg-slate-700"
                            }`}
                          >
                            {event.completed ? (
                              <CheckCircle className="h-5 w-5" />
                            ) : (
                              <Clock className="h-4 w-4" />
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="font-medium">{event.status}</div>
                            <div className="text-sm text-slate-500">
                              {event.location} • {event.completed ? t("tracking.demo.ago", { time: event.time }) : t("tracking.demo.estimated", { time: event.time })}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
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
              {t("cta.title")}
            </h2>
            <p className="text-xl mb-8 text-white/90">
              {t("cta.subtitle")}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-white text-moroccan-mint hover:bg-slate-100 h-14 px-8 text-lg"
                asChild
              >
                <Link href="/booking">
                  {t("cta.primaryButton")}
                  <ChevronRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white bg-gradient-to-br from-moroccan-mint to-moroccan-mint-600 text-white hover:bg-white h-14 px-8 text-lg"
                asChild
              >
                <Link href="/pricing">{t("cta.secondaryButton")}</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
