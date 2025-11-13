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
import { Button } from "@/components/ui/button";

export default function QuickActions() {
  const t = useTranslations('support.quickActions');
  const locale = useLocale();
  const isRTL = locale === 'ar';

  const actions = [
    {
      icon: <MagnifyingGlassIcon className="h-8 w-8" />,
      title: t('track.title'),
      description: t('track.description'),
      href: `/${locale}/tracking`,
      color: "bg-blue-500",
      hoverColor: "hover:bg-blue-600",
    },
    {
      icon: <CalculatorIcon className="h-8 w-8" />,
      title: t('quote.title'),
      description: t('quote.description'),
      href: `/${locale}/pricing`,
      color: "bg-moroccan-mint",
      hoverColor: "hover:bg-moroccan-mint-600",
    },
    {
      icon: <ExclamationCircleIcon className="h-8 w-8" />,
      title: t('report.title'),
      description: t('report.description'),
      href: "#contact-form",
      color: "bg-amber-500",
      hoverColor: "hover:bg-amber-600",
      scroll: true,
    },
    {
      icon: <ChatBubbleLeftRightIcon className="h-8 w-8" />,
      title: t('chat.title'),
      description: t('chat.description'),
      href: "https://wa.me/33763215487",
      color: "bg-green-500",
      hoverColor: "hover:bg-green-600",
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
      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className={`text-center mb-8 ${isRTL ? 'text-right' : ''}`}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {t('title')}
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            {t('subtitle')}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
                className="block"
              >
                <Button
                  className={`
                    w-full h-auto flex flex-col items-center justify-center
                    p-6 ${action.color} ${action.hoverColor} text-white
                    transition-all duration-300 hover:scale-105 hover:shadow-lg
                    rounded-xl border-0
                  `}
                  size="lg"
                >
                  <div className="mb-3">
                    {action.icon}
                  </div>
                  <h3 className="text-lg font-bold mb-2 text-center">
                    {action.title}
                  </h3>
                  <p className="text-sm opacity-90 text-center">
                    {action.description}
                  </p>
                </Button>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
