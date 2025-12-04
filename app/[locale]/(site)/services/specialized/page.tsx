"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  Snowflake,
  FileText,
  Shield,
  Zap,
  Package,
  ChevronRight,
  Check,
  Clock,
  ThermometerSnowflake,
  Scale,
  AlertCircle,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ServiceHero } from "@/components/Services/ServiceHero";
import { TrustMarquee } from "@/components/TrustMarquee";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useTranslations, useLocale } from "next-intl";

export default function SpecializedServicesPage() {
  const t = useTranslations('services.specialized');
  const locale = useLocale();
  const isRTL = locale === 'ar';

  const services = [
    {
      icon: <Zap className="h-8 w-8" />,
      title: t('services.express.title'),
      duration: t('services.express.duration'),
      price: t('services.express.price'),
      description: t('services.express.description'),
      features: [
        t('services.express.features.nextBus'),
        t('services.express.features.priority'),
        t('services.express.features.sms'),
        t('services.express.features.guarantee'),
      ],
      useCases: [
        t('services.express.useCases.medical'),
        t('services.express.useCases.gifts'),
        t('services.express.useCases.contracts'),
      ],
    },
    {
      icon: <ThermometerSnowflake className="h-8 w-8" />,
      title: t('services.temperature.title'),
      duration: t('services.temperature.duration'),
      price: t('services.temperature.price'),
      description: t('services.temperature.description'),
      features: [
        t('services.temperature.features.climate'),
        t('services.temperature.features.logging'),
        t('services.temperature.features.handling'),
        t('services.temperature.features.customs'),
      ],
      useCases: [
        t('services.temperature.useCases.medications'),
        t('services.temperature.useCases.food'),
        t('services.temperature.useCases.cosmetics'),
      ],
      badge: t('services.temperature.badge'),
    },
    {
      icon: <FileText className="h-8 w-8" />,
      title: t('services.documents.title'),
      duration: t('services.documents.duration'),
      price: t('services.documents.price'),
      description: t('services.documents.description'),
      features: [
        t('services.documents.features.tamper'),
        t('services.documents.features.custody'),
        t('services.documents.features.signature'),
        t('services.documents.features.scan'),
      ],
      useCases: [
        t('services.documents.useCases.legal'),
        t('services.documents.useCases.passport'),
        t('services.documents.useCases.deeds'),
      ],
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: t('services.insurance.title'),
      duration: t('services.insurance.duration'),
      price: t('services.insurance.price'),
      description: t('services.insurance.description'),
      features: [
        t('services.insurance.features.coverage'),
        t('services.insurance.features.claims'),
        t('services.insurance.features.photo'),
        t('services.insurance.features.fragile'),
      ],
      useCases: [
        t('services.insurance.useCases.electronics'),
        t('services.insurance.useCases.jewelry'),
        t('services.insurance.useCases.collectibles'),
      ],
    },
    {
      icon: <Scale className="h-8 w-8" />,
      title: t('services.oversized.title'),
      duration: t('services.oversized.duration'),
      price: t('services.oversized.price'),
      description: t('services.oversized.description'),
      features: [
        t('services.oversized.features.weight'),
        t('services.oversized.features.dimensions'),
        t('services.oversized.features.space'),
        t('services.oversized.features.securing'),
      ],
      useCases: [
        t('services.oversized.useCases.furniture'),
        t('services.oversized.useCases.appliances'),
        t('services.oversized.useCases.sports'),
      ],
      badge: t('services.oversized.badge'),
    },
    {
      icon: <Sparkles className="h-8 w-8" />,
      title: t('services.whiteGlove.title'),
      duration: t('services.whiteGlove.duration'),
      price: t('services.whiteGlove.price'),
      description: t('services.whiteGlove.description'),
      features: [
        t('services.whiteGlove.features.scheduled'),
        t('services.whiteGlove.features.unpacking'),
        t('services.whiteGlove.features.assembly'),
        t('services.whiteGlove.features.removal'),
      ],
      useCases: [
        t('services.whiteGlove.useCases.gifts'),
        t('services.whiteGlove.useCases.antiques'),
        t('services.whiteGlove.useCases.corporate'),
      ],
      badge: t('services.whiteGlove.badge'),
    },
  ];

  const customsBrokerageFeatures = [
    t('customs.features.hsCode'),
    t('customs.features.invoice'),
    t('customs.features.duty'),
    t('customs.features.certificate'),
    t('customs.features.preClearance'),
    t('customs.features.agent'),
  ];

  const prohibitedItems = [
    t('prohibited.weapons'),
    t('prohibited.drugs'),
    t('prohibited.hazardous'),
    t('prohibited.counterfeit'),
    t('prohibited.animals'),
    t('prohibited.perishable'),
  ];

  const restrictedItems = [
    {
      item: t('restricted.alcohol.item'),
      note: t('restricted.alcohol.note'),
    },
    {
      item: t('restricted.tobacco.item'),
      note: t('restricted.tobacco.note'),
    },
    {
      item: t('restricted.cosmetics.item'),
      note: t('restricted.cosmetics.note'),
    },
    {
      item: t('restricted.medications.item'),
      note: t('restricted.medications.note'),
    },
  ];

  return (
    <main className="min-h-screen" dir={isRTL ? "rtl" : "ltr"}>
      <ServiceHero
        badge={t('hero.badge')}
        title={t('hero.title')}
        titleHighlight={t('hero.titleHighlight')}
        subtitle={t('hero.subtitle')}
        imageSrc="/images/services/specialized.png"
        ctaText={t('hero.cta')}
        ctaLink="/booking"
      />

      <TrustMarquee />

      {/* Services Grid */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className={`text-center mb-12 ${isRTL ? 'text-right' : ''}`}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {t('servicesGrid.title')}
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-lg">
              {t('servicesGrid.subtitle')}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    {service.badge && (
                      <Badge className="mb-3 bg-moroccan-mint/10 text-moroccan-mint border-moroccan-mint/20">
                        {service.badge}
                      </Badge>
                    )}
                    <div className="h-14 w-14 rounded-lg bg-moroccan-mint/10 text-moroccan-mint flex items-center justify-center mb-4">
                      {service.icon}
                    </div>
                    <h3 className="text-xl font-bold mb-2">{service.title}</h3>
                    <div className="flex items-center gap-4 text-sm mb-3">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4 text-slate-500" />
                        <span className="text-slate-600 dark:text-slate-400">
                          {service.duration}
                        </span>
                      </div>
                      <div className="font-semibold text-moroccan-mint">
                        {service.price}
                      </div>
                    </div>
                    <p className="text-slate-600 dark:text-slate-400 mb-4">
                      {service.description}
                    </p>
                    <ul className="space-y-2 mb-4">
                      {service.features.map((feature, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm">
                          <Check className="h-4 w-4 text-moroccan-mint flex-shrink-0 mt-0.5" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="border-t pt-4">
                      <p className={`text-xs text-slate-500 mb-2 ${isRTL ? 'text-right' : ''}`}>
                        {t('servicesGrid.useCases')}
                      </p>
                      <div className={`flex flex-wrap gap-1 ${isRTL ? 'justify-end' : ''}`}>
                        {service.useCases.map((useCase, i) => (
                          <Badge
                            key={i}
                            variant="outline"
                            className="text-xs"
                          >
                            {useCase}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
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
              {t('cta.title')}
            </h2>
            <p className="text-xl mb-8 text-white/90">
              {t('cta.subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-white text-moroccan-mint hover:bg-slate-100 h-14 px-8 text-lg"
                asChild
              >
                <Link href="/support">
                  {t('cta.contact')}
                  <ChevronRight className={`h-5 w-5 ${isRTL ? 'mr-2' : 'ml-2'}`} />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white/10 h-14 px-8 text-lg"
                asChild
              >
                <Link href="/booking">{t('cta.bookStandard')}</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}