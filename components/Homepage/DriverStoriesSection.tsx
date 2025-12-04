"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Star, MapPin, Truck, ChevronRight, Award, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useTranslations } from "next-intl";

export function DriverStoriesSection() {
  const t = useTranslations("home.drivers");
  const drivers = [
    {
      name: "Hassan M.",
      route: "Paris → Casablanca",
      experience: "8",
      rating: 4.9,
      deliveries: "2,500+",
      testimonialKey: "hassan",
      earnings: "€650",
      initials: "HM",
      color: "bg-blue-500",
    },
    {
      name: "Aicha B.",
      route: "Madrid → Rabat",
      experience: "5",
      rating: 5.0,
      deliveries: "1,800+",
      testimonialKey: "aicha",
      earnings: "€580",
      initials: "AB",
      color: "bg-moroccan-mint",
    },
    {
      name: "Karim L.",
      route: "Brussels → Marrakech",
      experience: "6",
      rating: 4.8,
      deliveries: "2,100+",
      testimonialKey: "karim",
      earnings: "€720",
      initials: "KL",
      color: "bg-amber-500",
    },
  ];

  const customerTestimonials = [
    {
      name: "Fatima R.",
      location: "Paris",
      textKey: "fatima",
      rating: 5,
    },
    {
      name: "Mohammed K.",
      location: "Madrid",
      textKey: "mohammed",
      rating: 5,
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

        {/* Driver Profiles */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {drivers.map((driver, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="h-full border-0 shadow-lg shadow-slate-200/50 dark:shadow-black/20 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm hover:-translate-y-1 transition-all duration-300 overflow-hidden group">
                <CardContent className="p-8">
                  {/* Driver Avatar & Info */}
                  <div className="flex items-start gap-5 mb-6">
                    <Avatar className={`h-16 w-16 ${driver.color} text-white text-xl font-bold ring-4 ring-white dark:ring-slate-800 shadow-md`}>
                      <AvatarFallback className={driver.color}>
                        {driver.initials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 pt-1">
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">{driver.name}</h3>
                      <div className="flex items-center gap-1 mb-2">
                        <Star className="h-4 w-4 text-amber-400 fill-amber-400" />
                        <span className="text-sm font-bold text-slate-800 dark:text-white">{driver.rating}</span>
                        <span className="text-xs text-slate-500 dark:text-slate-400 ml-1">
                          ({driver.deliveries} {t("deliveries")})
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 text-sm text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-700/50 px-2 py-1 rounded-md w-fit">
                        <MapPin className="h-3.5 w-3.5" />
                        <span className="font-medium">{driver.route}</span>
                      </div>
                    </div>
                  </div>

                  {/* Badges */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    <Badge variant="outline" className="text-xs py-1 px-2.5 bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700">
                      <Award className="h-3 w-3 mr-1.5 text-moroccan-mint" />
                      {t("badges.years", { count: driver.experience })}
                    </Badge>
                    <Badge variant="outline" className="text-xs py-1 px-2.5 bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700">
                      <Truck className="h-3 w-3 mr-1.5 text-moroccan-mint" />
                      {t("badges.licensed")}
                    </Badge>
                  </div>

                  {/* Testimonial */}
                  <blockquote className="text-sm text-slate-700 dark:text-slate-300 italic mb-6 border-l-4 rtl:border-l-0 rtl:border-r-4 border-moroccan-mint pl-4 rtl:pl-0 rtl:pr-4 leading-relaxed">
                    "{t(`profiles.${driver.testimonialKey}.testimonial`)}"
                  </blockquote>

                  {/* Earnings Badge */}
                  <div className="bg-green-50 dark:bg-green-900/10 p-4 rounded-xl border border-green-100 dark:border-green-900/20">
                    <div className="flex items-center gap-3">
                      <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-full">
                        <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400" />
                      </div>
                      <span className="text-sm font-bold text-green-800 dark:text-green-300">
                        {t("supplementary", { amount: driver.earnings })}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Customer Testimonials About Drivers */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h3 className="text-2xl font-bold text-center mb-8 text-slate-900 dark:text-white">{t("customerTestimonials.heading")}</h3>
          <div className="grid md:grid-cols-2 gap-6">
            {customerTestimonials.map((testimonial, index) => (
              <Card key={index} className="border-0 shadow-md bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm">
                <CardContent className="p-8">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="h-4 w-4 text-amber-400 fill-amber-400"
                      />
                    ))}
                  </div>
                  <p className="text-lg text-slate-700 dark:text-slate-300 mb-6 italic leading-relaxed">
                    "{t(`customerTestimonials.${testimonial.textKey}.text`)}"
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-moroccan-mint/10 flex items-center justify-center text-moroccan-mint font-bold">
                      {testimonial.name.charAt(0)}
                    </div>
                    <div className="text-sm">
                      <div className="font-bold text-slate-900 dark:text-white">{testimonial.name}</div>
                      <div className="text-slate-500 dark:text-slate-400">{testimonial.location}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>

        {/* Become a Driver CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <Card className="bg-gradient-to-br from-moroccan-mint to-moroccan-mint-600 text-white border-none shadow-2xl shadow-moroccan-mint/20 overflow-hidden relative">
            {/* Pattern overlay */}
            <div className="absolute inset-0 bg-moroccan-pattern opacity-10 pointer-events-none mix-blend-overlay" />

            <CardContent className="p-8 md:p-16 text-center relative z-10">
              <div className="bg-white/20 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 backdrop-blur-sm shadow-inner">
                <Truck className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-3xl md:text-4xl font-bold mb-4">
                {t("cta.heading")}
              </h3>
              <p className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto leading-relaxed">
                {t("cta.description")}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  className="bg-white text-moroccan-mint hover:bg-slate-50 h-14 px-8 rounded-full text-lg font-bold shadow-lg transition-transform hover:scale-105"
                  asChild
                >
                  <Link href="/drivers/join">
                    {t("cta.becomeDriver")}
                    <ChevronRight className="ml-2 rtl:ml-0 rtl:mr-2 h-5 w-5 rtl:rotate-180" />
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-white/30 bg-white/10 text-white hover:bg-white/20 h-14 px-8 rounded-full text-lg font-medium backdrop-blur-sm transition-colors"
                  asChild
                >
                  <Link href="/services/how-it-works">{t("cta.learnHow")}</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
