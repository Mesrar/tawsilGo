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
    <section className="py-16 px-4 bg-gradient-to-b from-white to-slate-50 dark:from-slate-900 dark:to-slate-800">
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

        {/* Driver Profiles */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {drivers.map((driver, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="h-full hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  {/* Driver Avatar & Info */}
                  <div className="flex items-start gap-4 mb-4">
                    <Avatar className={`h-16 w-16 ${driver.color} text-white text-xl font-bold`}>
                      <AvatarFallback className={driver.color}>
                        {driver.initials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold">{driver.name}</h3>
                      <div className="flex items-center gap-1 mb-1">
                        <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                        <span className="text-sm font-semibold">{driver.rating}</span>
                        <span className="text-xs text-slate-500 ml-1">
                          ({driver.deliveries} {t("deliveries")})
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-sm text-slate-600 dark:text-slate-400">
                        <MapPin className="h-4 w-4" />
                        <span>{driver.route}</span>
                      </div>
                    </div>
                  </div>

                  {/* Badges */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    <Badge variant="outline" className="text-xs">
                      <Award className="h-3 w-3 mr-1" />
                      {t("badges.years", { count: driver.experience })}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      <Truck className="h-3 w-3 mr-1" />
                      {t("badges.licensed")}
                    </Badge>
                  </div>

                  {/* Testimonial */}
                  <blockquote className="text-sm text-slate-700 dark:text-slate-300 italic mb-4 border-l-2 border-moroccan-mint pl-3">
                    "{t(`profiles.${driver.testimonialKey}.testimonial`)}"
                  </blockquote>

                  {/* Earnings Badge */}
                  <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400" />
                      <span className="text-sm font-semibold text-green-700 dark:text-green-300">
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
          className="mb-12"
        >
          <h3 className="text-xl font-bold text-center mb-6">{t("customerTestimonials.heading")}</h3>
          <div className="grid md:grid-cols-2 gap-6">
            {customerTestimonials.map((testimonial, index) => (
              <Card key={index} className="border-moroccan-mint/20">
                <CardContent className="p-6">
                  <div className="flex mb-2">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="h-4 w-4 text-yellow-400 fill-yellow-400"
                      />
                    ))}
                  </div>
                  <p className="text-slate-700 dark:text-slate-300 mb-3 italic">
                    "{t(`customerTestimonials.${testimonial.textKey}.text`)}"
                  </p>
                  <div className="text-sm">
                    <div className="font-semibold">{testimonial.name}</div>
                    <div className="text-slate-500">{testimonial.location}</div>
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
          <Card className="bg-gradient-to-br from-moroccan-mint to-moroccan-mint-600 text-white border-none">
            <CardContent className="p-8 md:p-12 text-center">
              <Truck className="h-12 w-12 mx-auto mb-4 opacity-90" />
              <h3 className="text-2xl md:text-3xl font-bold mb-3">
                {t("cta.heading")}
              </h3>
              <p className="text-lg text-white/90 mb-6 max-w-2xl mx-auto">
                {t("cta.description")}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  className="bg-white text-moroccan-mint hover:bg-slate-100 h-12"
                  asChild
                >
                  <Link href="/drivers/join">
                    {t("cta.becomeDriver")}
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white bg-gradient-to-br from-moroccan-mint to-moroccan-mint-600 text-slate-100 hover:bg-white h-12"
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
