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
      textColor: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      number: 2,
      icon: <MapPin className="h-6 w-6" />,
      title: t("steps.wePickUp.title"),
      description: t("steps.wePickUp.description"),
      color: "bg-moroccan-mint",
      textColor: "text-moroccan-mint",
      bgColor: "bg-moroccan-mint/10",
    },
    {
      number: 3,
      icon: <Truck className="h-6 w-6" />,
      title: t("steps.busTransit.title"),
      description: t("steps.busTransit.description"),
      color: "bg-amber-500",
      textColor: "text-amber-500",
      bgColor: "bg-amber-500/10",
    },
    {
      number: 4,
      icon: <CheckCircle className="h-6 w-6" />,
      title: t("steps.delivered.title"),
      description: t("steps.delivered.description"),
      color: "bg-green-500",
      textColor: "text-green-500",
      bgColor: "bg-green-500/10",
    },
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
            {t("badge")}
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-slate-900 dark:text-white">
            {t("heading")}
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed">
            {t("description")}
          </p>
        </motion.div>

        {/* Desktop: 4-column grid */}
        <div className="hidden md:grid md:grid-cols-4 gap-8 mb-16">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="relative group"
            >
              <Card className="h-full border-0 shadow-lg shadow-slate-200/50 dark:shadow-black/20 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm hover:-translate-y-1 transition-all duration-300 overflow-hidden">
                <div className={`absolute top-0 left-0 w-full h-1 ${step.color}`} />
                <CardContent className="p-8 text-center">
                  <div
                    className={`h-12 w-12 rounded-full ${step.color} text-white flex items-center justify-center text-lg font-bold mx-auto mb-6 shadow-md group-hover:scale-110 transition-transform duration-300`}
                  >
                    {step.number}
                  </div>
                  <div
                    className={`h-16 w-16 rounded-2xl ${step.bgColor} flex items-center justify-center mx-auto mb-6 transition-colors duration-300`}
                  >
                    <div className={`${step.textColor}`}>
                      {step.icon}
                    </div>
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-white">{step.title}</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    {step.description}
                  </p>
                </CardContent>
              </Card>

              {/* Arrow connector (except for last item) */}
              {index < steps.length - 1 && (
                <div className="absolute top-1/2 -right-4 transform -translate-y-1/2 z-10 hidden lg:block text-slate-300 dark:text-slate-600">
                  <ChevronRight className="h-8 w-8" strokeWidth={1.5} />
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Mobile: Vertical Timeline */}
        <div className="md:hidden relative pl-8 rtl:pl-0 rtl:pr-8 space-y-8 mb-12">
          {/* Vertical Line */}
          <div className="absolute left-4 rtl:left-auto rtl:right-4 top-4 bottom-4 w-0.5 bg-slate-200 dark:bg-slate-800" />

          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="relative"
            >
              {/* Timeline Dot */}
              <div className={`absolute -left-[2.25rem] rtl:-left-auto rtl:-right-[2.25rem] top-0 h-8 w-8 rounded-full ${step.color} text-white flex items-center justify-center text-sm font-bold shadow-md z-10`}>
                {step.number}
              </div>

              <Card className="border-0 shadow-md bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm ml-2 rtl:ml-0 rtl:mr-2">
                <CardContent className="p-5">
                  <div className="flex items-start gap-4">
                    <div
                      className={`h-12 w-12 rounded-xl ${step.bgColor} flex items-center justify-center flex-shrink-0`}
                    >
                      <div className={`${step.textColor}`}>
                        {step.icon}
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold mb-1 text-slate-900 dark:text-white">{step.title}</h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
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
            className="bg-moroccan-mint hover:bg-moroccan-mint-600 h-14 px-8 rounded-full text-lg shadow-lg shadow-moroccan-mint/25 transition-all duration-300 hover:scale-105"
            asChild
          >
            <Link href="/services/how-it-works">
              {t("cta")}
              <ChevronRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
