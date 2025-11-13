"use client";

import { motion } from "framer-motion";
import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";
import {
  BuildingOfficeIcon,
  TruckIcon,
  ChartBarIcon,
  ShieldCheckIcon,
  UserGroupIcon,
  DocumentTextIcon,
} from "@heroicons/react/24/outline";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function BusinessSupport() {
  const t = useTranslations("support.business");
  const locale = useLocale();
  const isRTL = locale === "ar";

  const businessFeatures = [
    {
      icon: <TruckIcon className="h-8 w-8" />,
      title: t("features.volume.title"),
      description: t("features.volume.description"),
      color: "text-blue-500",
      bgColor: "bg-blue-50 dark:bg-blue-900/20",
    },
    {
      icon: <ChartBarIcon className="h-8 w-8" />,
      title: t("features.analytics.title"),
      description: t("features.analytics.description"),
      color: "text-purple-500",
      bgColor: "bg-purple-50 dark:bg-purple-900/20",
    },
    {
      icon: <ShieldCheckIcon className="h-8 w-8" />,
      title: t("features.insurance.title"),
      description: t("features.insurance.description"),
      color: "text-green-500",
      bgColor: "bg-green-50 dark:bg-green-900/20",
    },
    {
      icon: <UserGroupIcon className="h-8 w-8" />,
      title: t("features.account.title"),
      description: t("features.account.description"),
      color: "text-orange-500",
      bgColor: "bg-orange-50 dark:bg-orange-900/20",
    },
  ];

  const packages = [
    {
      name: t("packages.starter.name"),
      description: t("packages.starter.description"),
      features: [
        t("packages.starter.feature1"),
        t("packages.starter.feature2"),
        t("packages.starter.feature3"),
        t("packages.starter.feature4"),
      ],
      bestFor: t("packages.starter.bestFor"),
      badge: null,
    },
    {
      name: t("packages.business.name"),
      description: t("packages.business.description"),
      features: [
        t("packages.business.feature1"),
        t("packages.business.feature2"),
        t("packages.business.feature3"),
        t("packages.business.feature4"),
        t("packages.business.feature5"),
      ],
      bestFor: t("packages.business.bestFor"),
      badge: t("packages.business.badge"),
    },
    {
      name: t("packages.enterprise.name"),
      description: t("packages.enterprise.description"),
      features: [
        t("packages.enterprise.feature1"),
        t("packages.enterprise.feature2"),
        t("packages.enterprise.feature3"),
        t("packages.enterprise.feature4"),
        t("packages.enterprise.feature5"),
        t("packages.enterprise.feature6"),
      ],
      bestFor: t("packages.enterprise.bestFor"),
      badge: null,
    },
  ];

  const resources = [
    {
      icon: <DocumentTextIcon className="h-6 w-6" />,
      title: t("resources.guide.title"),
      description: t("resources.guide.description"),
      link: "#",
    },
    {
      icon: <ChartBarIcon className="h-6 w-6" />,
      title: t("resources.api.title"),
      description: t("resources.api.description"),
      link: "#",
    },
    {
      icon: <UserGroupIcon className="h-6 w-6" />,
      title: t("resources.training.title"),
      description: t("resources.training.description"),
      link: "#",
    },
  ];

  return (
    <section className="py-16 px-4 bg-white dark:bg-slate-800">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className={`text-center mb-12 ${isRTL ? "text-right" : ""}`}
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <BuildingOfficeIcon className="h-10 w-10 text-moroccan-mint" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{t("title")}</h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
            {t("subtitle")}
          </p>
        </motion.div>

        {/* Business Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {businessFeatures.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-6 text-center">
                  <div
                    className={`inline-flex p-4 rounded-lg ${feature.bgColor} ${feature.color} mb-4`}
                  >
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Business Packages */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h3
            className={`text-2xl md:text-3xl font-bold mb-8 text-center ${
              isRTL ? "text-right" : ""
            }`}
          >
            {t("packages.title")}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {packages.map((pkg, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card
                  className={`h-full ${
                    pkg.badge
                      ? "border-2 border-moroccan-mint shadow-lg"
                      : ""
                  }`}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-xl font-bold">{pkg.name}</h4>
                      {pkg.badge && (
                        <Badge className="bg-moroccan-mint text-white">
                          {pkg.badge}
                        </Badge>
                      )}
                    </div>
                    <p className="text-slate-600 dark:text-slate-400 mb-6">
                      {pkg.description}
                    </p>
                    <div className="space-y-3 mb-6">
                      {pkg.features.map((feature, featureIndex) => (
                        <div
                          key={featureIndex}
                          className={`flex items-start gap-2 ${
                            isRTL ? "flex-row-reverse text-right" : ""
                          }`}
                        >
                          <svg
                            className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                          <span className="text-sm">{feature}</span>
                        </div>
                      ))}
                    </div>
                    <div
                      className={`p-4 rounded-lg bg-slate-50 dark:bg-slate-700 mb-4 ${
                        isRTL ? "text-right" : ""
                      }`}
                    >
                      <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">
                        {t("packages.bestFor")}
                      </p>
                      <p className="text-sm font-semibold">{pkg.bestFor}</p>
                    </div>
                    <Button
                      className="w-full bg-moroccan-mint hover:bg-moroccan-mint-600"
                      asChild
                    >
                      <a href="#contact-form">{t("packages.contact")}</a>
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Business Resources */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <h3
            className={`text-2xl md:text-3xl font-bold mb-8 text-center ${
              isRTL ? "text-right" : ""
            }`}
          >
            {t("resources.title")}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {resources.map((resource, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 p-3 rounded-lg bg-moroccan-mint/10 text-moroccan-mint">
                        {resource.icon}
                      </div>
                      <div className="flex-1">
                        <h4 className="text-lg font-bold mb-2">{resource.title}</h4>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                          {resource.description}
                        </p>
                        <a
                          href={resource.link}
                          className="text-moroccan-mint hover:text-moroccan-mint-600 text-sm font-semibold inline-flex items-center gap-1 transition-colors"
                        >
                          {t("resources.learn")}
                          <svg
                            className="h-4 w-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 5l7 7-7 7"
                            />
                          </svg>
                        </a>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center p-8 bg-gradient-to-r from-moroccan-mint/10 to-moroccan-mint/5 rounded-xl"
        >
          <h3 className="text-2xl font-bold mb-4">{t("cta.title")}</h3>
          <p className="text-slate-600 dark:text-slate-400 mb-6 max-w-2xl mx-auto">
            {t("cta.description")}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              className="bg-moroccan-mint hover:bg-moroccan-mint-600"
              size="lg"
              asChild
            >
              <a href="#contact-form">{t("cta.contact")}</a>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href={`/${locale}/pricing`}>{t("cta.pricing")}</Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
