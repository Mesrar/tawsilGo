"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import {
  Truck,
  Euro,
  Clock,
  MapPin,
  Shield,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  Calendar,
  Star,
  Users,
  Phone,
  FileText,
  CreditCard,
  Award,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { EarningsCalculator } from "./EarningsCalculator";

export function DriverJoinLanding() {
  const router = useRouter();
  const t = useTranslations("drivers.join");

  const requirements = [
    { icon: FileText, label: t("requirements.validLicense"), met: true },
    { icon: CreditCard, label: t("requirements.insurance"), met: true },
    { icon: Phone, label: t("requirements.smartphone"), met: true },
    { icon: Users, label: t("requirements.ageRequirement"), met: true },
    { icon: MapPin, label: t("requirements.euLocation"), met: true },
  ];

  const benefits = [
    { icon: Euro, title: t("benefits.flexibleEarnings.title"), description: t("benefits.flexibleEarnings.description") },
    { icon: Clock, title: t("benefits.ownSchedule.title"), description: t("benefits.ownSchedule.description") },
    { icon: MapPin, title: t("benefits.chooseRoutes.title"), description: t("benefits.chooseRoutes.description") },
    { icon: Shield, title: t("benefits.insurance.title"), description: t("benefits.insurance.description") },
    { icon: TrendingUp, title: t("benefits.bonuses.title"), description: t("benefits.bonuses.description") },
    { icon: Award, title: t("benefits.support.title"), description: t("benefits.support.description") },
  ];

  const steps = [
    { number: "1", title: t("steps.apply.title"), description: t("steps.apply.description"), time: t("steps.apply.time") },
    { number: "2", title: t("steps.verification.title"), description: t("steps.verification.description"), time: t("steps.verification.time") },
    { number: "3", title: t("steps.training.title"), description: t("steps.training.description"), time: t("steps.training.time") },
    { number: "4", title: t("steps.start.title"), description: t("steps.start.description"), time: t("steps.start.time") },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50 dark:from-slate-900 dark:via-blue-950/20 dark:to-slate-900">
      {/* Hero Section */}
      <section className="relative pt-20 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-green-500/5 pointer-events-none" />

        <div className="max-w-7xl mx-auto relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-sm font-semibold mb-6">
              <Truck className="h-4 w-4" />
              {t("hero.badge")}
            </div>

            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 bg-gradient-to-r from-slate-900 via-blue-800 to-slate-900 dark:from-slate-100 dark:via-blue-300 dark:to-slate-100 bg-clip-text text-transparent">
              {t("hero.title")}
            </h1>

            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto mb-8">
              {t("hero.subtitle")}
            </p>

            {/* Stats */}
            <div className="flex flex-wrap items-center justify-center gap-8 mb-10">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/40">
                  <Euro className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                <div className="text-left">
                  <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">€500-800</div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">{t("hero.stats.monthly")}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/40">
                  <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="text-left">
                  <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">2,000+</div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">{t("hero.stats.drivers")}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-900/40">
                  <Star className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                </div>
                <div className="text-left">
                  <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">4.8/5</div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">{t("hero.stats.rating")}</div>
                </div>
              </div>
            </div>

            <Button
              size="lg"
              className="h-14 px-8 text-lg bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-xl hover:shadow-2xl transition-all group"
              onClick={() => router.push("/drivers/register")}
            >
              {t("hero.cta")}
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Earnings Calculator */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <EarningsCalculator t={t} />
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-slate-100 mb-4">
              {t("benefits.title")}
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400">
              {t("benefits.subtitle")}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-lg bg-blue-100 dark:bg-blue-900/40">
                        <benefit.icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <CardTitle className="text-xl mb-2">{benefit.title}</CardTitle>
                        <CardDescription className="text-base">{benefit.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Requirements Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white/50 dark:bg-slate-800/50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-slate-100 mb-4">
              {t("requirements.title")}
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400">
              {t("requirements.subtitle")}
            </p>
          </div>

          <Card>
            <CardContent className="p-8">
              <div className="space-y-4">
                {requirements.map((req, index) => (
                  <div key={index} className="flex items-center gap-4 p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                    <CheckCircle2 className="h-6 w-6 text-green-600 dark:text-green-400 flex-shrink-0" />
                    <req.icon className="h-5 w-5 text-green-700 dark:text-green-300 flex-shrink-0" />
                    <span className="text-slate-900 dark:text-slate-100 font-medium">{req.label}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-slate-100 mb-4">
              {t("steps.title")}
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400">
              {t("steps.subtitle")}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative"
              >
                <Card className="h-full">
                  <CardHeader>
                    <div className="absolute -top-4 -left-4 w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-white font-bold text-xl flex items-center justify-center shadow-lg">
                      {step.number}
                    </div>
                    <CardTitle className="text-lg mt-4">{step.title}</CardTitle>
                    <CardDescription className="text-sm">{step.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400 font-semibold">
                      <Clock className="h-4 w-4" />
                      {step.time}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0">
            <CardContent className="p-12 text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                {t("cta.title")}
              </h2>
              <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                {t("cta.subtitle")}
              </p>
              <Button
                size="lg"
                variant="secondary"
                className="h-14 px-8 text-lg shadow-xl hover:shadow-2xl group"
                onClick={() => router.push("/drivers/register")}
              >
                {t("cta.button")}
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <p className="text-sm text-blue-100 mt-4">
                {t("cta.time")}
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
