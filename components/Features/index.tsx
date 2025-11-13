"use client";

import React, { useRef } from "react";
import { useTranslations } from 'next-intl';
import { motion, useInView, AnimatePresence } from "framer-motion";
import {
  Truck,
  Globe,
  ShieldCheck,
  DollarSign,
  Users,
  Smartphone,
  ArrowRight,
  Star,
  Package,
  Clock,
  Heart
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { GridPattern } from "@/components/ui/grid-pattern";

const Features = () => {
  const t = useTranslations('home.features');
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });

  // Morocco-focused feature data with diaspora context
  const featuresData = [
    {
      icon: <Truck className="h-6 w-6" />,
      title: t('busDelivery.title'),
      description: t('busDelivery.description'),
      stat: "24-48h",
      color: "moroccan-mint"
    },
    {
      icon: <Globe className="h-6 w-6" />,
      title: t('moroccoSpecialists.title'),
      description: t('moroccoSpecialists.description'),
      stat: "5+ Cities",
      color: "moroccan-blue-chefchaouen"
    },
    {
      icon: <DollarSign className="h-6 w-6" />,
      title: t('transparentPricing.title'),
      description: t('transparentPricing.description'),
      stat: "No Hidden Fees",
      color: "moroccan-gold"
    },
    {
      icon: <ShieldCheck className="h-6 w-6" />,
      title: t('secureToMorocco.title'),
      description: t('secureToMorocco.description'),
      stat: "Insured",
      color: "moroccan-mint"
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: t('trustedByFamilies.title'),
      description: t('trustedByFamilies.description'),
      stat: "10,000+",
      color: "moroccan-saffron"
    },
    {
      icon: <Smartphone className="h-6 w-6" />,
      title: t('mobileFirst.title'),
      description: t('mobileFirst.description'),
      stat: "Real-time",
      color: "moroccan-blue-indigo"
    }
  ];

  const getFeatureColorClasses = (color: string) => {
    const colorMap: Record<string, { bg: string; icon: string; stat: string }> = {
      "moroccan-mint": {
        bg: "bg-moroccan-mint-50 dark:bg-moroccan-mint-900/20",
        icon: "text-moroccan-mint-600 dark:text-moroccan-mint-400",
        stat: "text-moroccan-mint-700 dark:text-moroccan-mint-300"
      },
      "moroccan-blue-chefchaouen": {
        bg: "bg-blue-50 dark:bg-moroccan-blue-chefchaouen/20",
        icon: "text-moroccan-blue-chefchaouen dark:text-moroccan-blue-chefchaouen-400",
        stat: "text-moroccan-blue-chefchaouen-700 dark:text-moroccan-blue-chefchaouen-300"
      },
      "moroccan-gold": {
        bg: "bg-yellow-50 dark:bg-moroccan-gold/20",
        icon: "text-moroccan-gold dark:text-moroccan-gold-400",
        stat: "text-moroccan-gold-700 dark:text-moroccan-gold-300"
      },
      "moroccan-saffron": {
        bg: "bg-orange-50 dark:bg-moroccan-saffron/20",
        icon: "text-moroccan-saffron dark:text-moroccan-saffron-400",
        stat: "text-moroccan-saffron-700 dark:text-moroccan-saffron-300"
      },
      "moroccan-blue-indigo": {
        bg: "bg-indigo-50 dark:bg-moroccan-blue-indigo/20",
        icon: "text-moroccan-blue-indigo dark:text-moroccan-blue-indigo-400",
        stat: "text-moroccan-blue-indigo-700 dark:text-moroccan-blue-indigo-300"
      }
    };
    return colorMap[color] || colorMap["moroccan-mint"];
  };

  const handleBookNow = () => {
    window.location.href = '/booking';
  };

  return (
    <section
      id="features"
      ref={sectionRef}
      className="relative py-20 lg:py-32 overflow-hidden bg-white dark:bg-blacksection"
    >
      {/* Background pattern */}
      <GridPattern
        className="absolute inset-0 -z-10 opacity-30 dark:opacity-20"
        width={40}
        height={40}
        x={-1}
        y={-1}
        squares={[
          [2, 3],
          [5, 5],
          [8, 2],
          [11, 6],
          [14, 4],
          [17, 7],
          [20, 5],
          [23, 3],
          [26, 6],
          [29, 4],
          [32, 2],
          [35, 5],
          [38, 3]
        ]}
      />

      {/* Subtle gradient overlay */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-moroccan-mint to-transparent opacity-20"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header section */}
        <div className="text-center mb-16 lg:mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <Badge
              variant="secondary"
              className="mb-4 px-4 py-2 bg-moroccan-mint-100 text-moroccan-mint-800 dark:bg-moroccan-mint-900/30 dark:text-moroccan-mint-200 border-0 text-sm font-medium"
            >
              <Star className="h-3 w-3 mr-1" />
              {t('badge')}
            </Badge>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white mb-6 leading-tight"
          >
            {t('heading')}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed"
          >
            {t('subheading')}
          </motion.p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-12 lg:mb-16">
          {featuresData.map((feature, index) => {
            const colors = getFeatureColorClasses(feature.color);

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{
                  duration: 0.6,
                  delay: 0.3 + index * 0.1,
                  type: "spring",
                  stiffness: 100
                }}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                <Card className="group relative h-full border-0 shadow-lg shadow-slate-200/50 dark:shadow-black/20 hover:shadow-xl hover:shadow-moroccan-mint/20 dark:hover:shadow-moroccan-mint/10 transition-all duration-300 bg-white dark:bg-blackho overflow-hidden">
                  {/* Gradient overlay on hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-moroccan-mint/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                  <CardContent className="relative p-6 lg:p-8">
                    {/* Icon container */}
                    <div className={`inline-flex h-14 w-14 items-center justify-center rounded-xl ${colors.bg} mb-6 group-hover:scale-110 transition-transform duration-300`}>
                      <div className={colors.icon}>
                        {feature.icon}
                      </div>
                    </div>

                    {/* Feature content */}
                    <div className="space-y-3">
                      <h3 className="text-xl font-semibold text-slate-900 dark:text-white group-hover:text-moroccan-mint-700 dark:group-hover:text-moroccan-mint-300 transition-colors duration-300">
                        {feature.title}
                      </h3>

                      <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                        {feature.description}
                      </p>

                      {/* Stat badge */}
                      <div className="flex items-center justify-between pt-2">
                        <span className={`text-sm font-medium ${colors.stat}`}>
                          {feature.stat}
                        </span>
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <ArrowRight className="h-4 w-4 text-moroccan-mint" />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Call-to-action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center"
        >
          <div className="bg-gradient-to-r from-moroccan-mint to-moroccan-blue-chefchaouen p-[1px] rounded-full inline-block">
            <Button
              onClick={handleBookNow}
              size="lg"
              className="bg-white dark:bg-blackho text-moroccan-mint hover:bg-slate-50 dark:hover:bg-slate-800 border-0 rounded-full px-8 py-4 text-base font-semibold transition-all duration-300 hover:scale-105 group"
            >
              <span className="flex items-center">
                {t('cta')}
                <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
              </span>
            </Button>
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 1 }}
            className="mt-4 text-sm text-slate-500 dark:text-slate-400"
          >
            <span className="flex items-center justify-center gap-2">
              <Heart className="h-4 w-4 text-moroccan-saffron" />
              {t('guarantee')}
            </span>
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
};

export default Features;