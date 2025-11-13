"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Package, MapPin, Truck, CheckCircle, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useTranslations } from "next-intl";

export function HowItWorksSection() {
  const t = useTranslations("home.howItWorks");

  const steps = [
    {
      number: 1,
      icon: <Package className="h-6 w-6" />,
      title: t("steps.bookOnline.title"),
      description: t("steps.bookOnline.description"),
      color: "bg-blue-500",
    },
    {
      number: 2,
      icon: <MapPin className="h-6 w-6" />,
      title: t("steps.wePickUp.title"),
      description: t("steps.wePickUp.description"),
      color: "bg-moroccan-mint",
    },
    {
      number: 3,
      icon: <Truck className="h-6 w-6" />,
      title: t("steps.busTransit.title"),
      description: t("steps.busTransit.description"),
      color: "bg-amber-500",
    },
    {
      number: 4,
      icon: <CheckCircle className="h-6 w-6" />,
      title: t("steps.delivered.title"),
      description: t("steps.delivered.description"),
      color: "bg-green-500",
    },
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
            {t("badge")}
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {t("heading")}
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-lg max-w-2xl mx-auto">
            {t("description")}
          </p>
        </motion.div>

        {/* Desktop: 4-column grid */}
        <div className="hidden md:grid md:grid-cols-4 gap-6 mb-12">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="relative"
            >
              <Card className="h-full hover:shadow-lg transition-shadow">
                <CardContent className="p-6 text-center">
                  <div
                    className={`h-12 w-12 rounded-full ${step.color} text-white flex items-center justify-center text-xl font-bold mx-auto mb-4`}
                  >
                    {step.number}
                  </div>
                  <div
                    className={`h-14 w-14 rounded-lg ${step.color}/10 flex items-center justify-center mx-auto mb-4`}
                  >
                    <div className={`${step.color.replace("bg-", "text-")}`}>
                      {step.icon}
                    </div>
                  </div>
                  <h3 className="text-lg font-bold mb-2">{step.title}</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {step.description}
                  </p>
                </CardContent>
              </Card>

              {/* Arrow connector (except for last item) */}
              {index < steps.length - 1 && (
                <div className="absolute top-1/2 -right-3 transform -translate-y-1/2 z-10 hidden lg:block">
                  <ChevronRight className="h-6 w-6 text-moroccan-mint" />
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Mobile: Vertical stack */}
        <div className="md:hidden space-y-4 mb-8">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div
                      className={`h-12 w-12 rounded-full ${step.color} text-white flex items-center justify-center text-xl font-bold flex-shrink-0`}
                    >
                      {step.number}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold mb-2">{step.title}</h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <Button
            size="lg"
            className="bg-moroccan-mint hover:bg-moroccan-mint-600 h-12"
            asChild
          >
            <Link href="/services/how-it-works">
              {t("cta")}
              <ChevronRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
