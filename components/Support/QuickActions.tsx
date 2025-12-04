"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import {
  MagnifyingGlassIcon,
  CalculatorIcon,
  ExclamationCircleIcon,
  ChatBubbleLeftRightIcon
} from "@heroicons/react/24/outline";
import { Card } from "@/components/ui/card";

export default function QuickActions() {
  const t = useTranslations('support.quickActions');
  const locale = useLocale();
  const isRTL = locale === 'ar';

  const actions = [
    {
      icon: <MagnifyingGlassIcon className="h-6 w-6" />,
      title: t('track.title'),
      description: t('track.description'),
      href: `/${locale}/tracking`,
      color: "text-blue-600 dark:text-blue-400",
      bg: "bg-blue-50 dark:bg-blue-900/20",
    },
    {
      icon: <CalculatorIcon className="h-6 w-6" />,
      title: t('quote.title'),
      description: t('quote.description'),
      href: `/${locale}/pricing`,
      color: "text-moroccan-mint",
      bg: "bg-moroccan-mint/10",
    },
    {
      icon: <ExclamationCircleIcon className="h-6 w-6" />,
      title: t('report.title'),
      description: t('report.description'),
      href: "#contact-form",
      color: "text-amber-600 dark:text-amber-400",
      bg: "bg-amber-50 dark:bg-amber-900/20",
      scroll: true,
    },
    {
      icon: <ChatBubbleLeftRightIcon className="h-6 w-6" />,
      title: t('chat.title'),
      description: t('chat.description'),
      href: "https://wa.me/33763215487",
      color: "text-green-600 dark:text-green-400",
      bg: "bg-green-50 dark:bg-green-900/20",
      external: true,
    },
  ];

  const handleClick = (e: React.MouseEvent, scroll?: boolean) => {
    if (scroll) {
      e.preventDefault();
      document.getElementById('contact-form')?.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  return (
    <section className="py-12 px-4">
      <div className="container mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className={`text-center mb-10 ${isRTL ? 'text-right' : ''}`}
        >
          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
            {t('title')}
          </h1>
          <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
            {t('subtitle')}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {actions.map((action, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.4 }}
            >
              <Link
                href={action.href}
                onClick={(e) => handleClick(e, action.scroll)}
                target={action.external ? "_blank" : undefined}
                rel={action.external ? "noopener noreferrer" : undefined}
                className="block h-full group"
              >
                <Card className="h-full p-6 border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm hover:shadow-md transition-all duration-300 group-hover:-translate-y-1">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${action.bg} ${action.color} transition-colors`}>
                    {action.icon}
                  </div>
                  <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white group-hover:text-primary transition-colors">
                    {action.title}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                    {action.description}
                  </p>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
