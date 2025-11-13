"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

export default function FAQSection() {
  const t = useTranslations('support.faq');
  const locale = useLocale();
  const isRTL = locale === 'ar';
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = [
    { id: 'shipping', label: t('categories.shipping'), count: 5 },
    { id: 'pricing', label: t('categories.pricing'), count: 4 },
    { id: 'customs', label: t('categories.customs'), count: 4 },
    { id: 'tracking', label: t('categories.tracking'), count: 4 },
    { id: 'general', label: t('categories.general'), count: 3 },
  ];

  // Build FAQ items from translations
  const faqItems = categories.flatMap(category => {
    const count = category.count;
    return Array.from({ length: count }, (_, i) => ({
      category: category.id,
      categoryLabel: category.label,
      question: t(`${category.id}.q${i + 1}.question`),
      answer: t(`${category.id}.q${i + 1}.answer`),
    }));
  });

  // Filter FAQs based on search and category
  const filteredFAQs = faqItems.filter(item => {
    const matchesSearch = searchQuery === "" ||
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = !selectedCategory || item.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <section className="py-16 px-4 bg-slate-50 dark:bg-slate-900">
      <div className="container mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className={`text-center mb-8 ${isRTL ? 'text-right' : ''}`}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {t('title')}
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            {t('subtitle')}
          </p>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <div className="relative">
            <MagnifyingGlassIcon className={`absolute top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 ${isRTL ? 'right-3' : 'left-3'}`} />
            <Input
              type="text"
              placeholder={t('searchPlaceholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`${isRTL ? 'pr-10 text-right' : 'pl-10'} h-12 text-base`}
            />
          </div>
        </motion.div>

        {/* Category Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className={`flex flex-wrap gap-2 mb-8 ${isRTL ? 'justify-end' : 'justify-start'}`}
        >
          <Badge
            onClick={() => setSelectedCategory(null)}
            className={`cursor-pointer px-4 py-2 ${
              selectedCategory === null
                ? 'bg-moroccan-mint text-white'
                : 'bg-slate-200 text-slate-700 hover:bg-slate-300 dark:bg-slate-700 dark:text-slate-200'
            }`}
          >
            {t('allCategories')}
          </Badge>
          {categories.map((category) => (
            <Badge
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`cursor-pointer px-4 py-2 ${
                selectedCategory === category.id
                  ? 'bg-moroccan-mint text-white'
                  : 'bg-slate-200 text-slate-700 hover:bg-slate-300 dark:bg-slate-700 dark:text-slate-200'
              }`}
            >
              {category.label} ({category.count})
            </Badge>
          ))}
        </motion.div>

        {/* FAQ Accordion */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          {filteredFAQs.length > 0 ? (
            <Accordion type="single" collapsible className="space-y-3">
              {filteredFAQs.map((item, index) => (
                <AccordionItem
                  key={index}
                  value={`item-${index}`}
                  className="border rounded-lg px-4 bg-white dark:bg-slate-800"
                >
                  <AccordionTrigger className={`text-left hover:no-underline ${isRTL ? 'text-right' : ''}`}>
                    <div className="flex items-start gap-3 flex-1">
                      <Badge variant="outline" className="mt-1 text-xs">
                        {item.categoryLabel}
                      </Badge>
                      <span className="font-semibold flex-1">{item.question}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className={`text-slate-600 dark:text-slate-400 ${isRTL ? 'text-right' : ''}`}>
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          ) : (
            <div className="text-center py-12">
              <p className="text-slate-500 dark:text-slate-400 mb-4">
                {t('noResults')}
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory(null);
                }}
              >
                {t('clearFilters')}
              </Button>
            </div>
          )}
        </motion.div>

        {/* Still Need Help CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-12 text-center p-6 bg-gradient-to-r from-moroccan-mint/10 to-moroccan-mint/5 rounded-xl"
        >
          <h3 className="text-xl font-bold mb-2">{t('stillNeedHelp.title')}</h3>
          <p className="text-slate-600 dark:text-slate-400 mb-4">
            {t('stillNeedHelp.subtitle')}
          </p>
          <Button
            asChild
            className="bg-moroccan-mint hover:bg-moroccan-mint-600"
          >
            <Link href="#contact-form">
              {t('stillNeedHelp.button')}
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
