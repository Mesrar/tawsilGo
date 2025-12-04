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
import { ServiceHero } from "@/components/Services/ServiceHero";
import { TrustMarquee } from "@/components/TrustMarquee";

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
      <ServiceHero
        badge={t("hero.badge")}
        title={t("hero.title")}
        titleHighlight={t("hero.subtitle")}
        subtitle={t("hero.description")}
        imageSrc="/images/services/how-it-works.png"
        ctaText={t("hero.cta")}
        ctaLink="/booking"
      />

      <TrustMarquee />

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
                            className={`h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0 ${event.completed
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
