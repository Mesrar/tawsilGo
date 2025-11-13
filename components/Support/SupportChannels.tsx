"use client";

import { motion } from "framer-motion";
import { useTranslations, useLocale } from "next-intl";
import {
  PhoneIcon,
  EnvelopeIcon,
  ChatBubbleLeftRightIcon,
  MapPinIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function SupportChannels() {
  const t = useTranslations("support.channels");
  const locale = useLocale();
  const isRTL = locale === "ar";

  const channels = [
    {
      icon: <PhoneIcon className="h-8 w-8" />,
      title: t("phone.title"),
      description: t("phone.description"),
      detail: t("phone.number"),
      availability: t("phone.availability"),
      action: "tel:+33763215487",
      actionLabel: t("phone.action"),
      color: "text-blue-500",
      bgColor: "bg-blue-50 dark:bg-blue-900/20",
      available: true,
    },
    {
      icon: <EnvelopeIcon className="h-8 w-8" />,
      title: t("email.title"),
      description: t("email.description"),
      detail: t("email.address"),
      availability: t("email.availability"),
      action: "mailto:support@tawsilgo.com",
      actionLabel: t("email.action"),
      color: "text-purple-500",
      bgColor: "bg-purple-50 dark:bg-purple-900/20",
      available: true,
    },
    {
      icon: <ChatBubbleLeftRightIcon className="h-8 w-8" />,
      title: t("whatsapp.title"),
      description: t("whatsapp.description"),
      detail: t("whatsapp.number"),
      availability: t("whatsapp.availability"),
      action: "https://wa.me/33763215487",
      actionLabel: t("whatsapp.action"),
      color: "text-green-500",
      bgColor: "bg-green-50 dark:bg-green-900/20",
      available: true,
      external: true,
    },
    {
      icon: <MapPinIcon className="h-8 w-8" />,
      title: t("office.title"),
      description: t("office.description"),
      detail: t("office.address"),
      availability: t("office.availability"),
      action: "#",
      actionLabel: t("office.action"),
      color: "text-moroccan-mint",
      bgColor: "bg-moroccan-mint/10",
      available: true,
    },
  ];

  const responseTimeInfo = [
    {
      icon: <ClockIcon className="h-5 w-5" />,
      label: t("responseTimes.urgent"),
      time: t("responseTimes.urgentTime"),
      badgeColor: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300",
    },
    {
      icon: <ClockIcon className="h-5 w-5" />,
      label: t("responseTimes.normal"),
      time: t("responseTimes.normalTime"),
      badgeColor: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
    },
    {
      icon: <ClockIcon className="h-5 w-5" />,
      label: t("responseTimes.business"),
      time: t("responseTimes.businessTime"),
      badgeColor: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300",
    },
  ];

  return (
    <section className="py-16 px-4 bg-slate-50 dark:bg-slate-900">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className={`text-center mb-12 ${isRTL ? "text-right" : ""}`}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{t("title")}</h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            {t("subtitle")}
          </p>
        </motion.div>

        {/* Channel Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {channels.map((channel, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-6">
                  <div className={`flex items-start gap-4 ${isRTL ? "flex-row-reverse" : ""}`}>
                    <div
                      className={`flex-shrink-0 p-4 rounded-lg ${channel.bgColor} ${channel.color}`}
                    >
                      {channel.icon}
                    </div>
                    <div className={`flex-1 ${isRTL ? "text-right" : ""}`}>
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-xl font-bold">{channel.title}</h3>
                        {channel.available && (
                          <Badge className="bg-green-500 text-white text-xs">
                            {t("available")}
                          </Badge>
                        )}
                      </div>
                      <p className="text-slate-600 dark:text-slate-400 mb-3">
                        {channel.description}
                      </p>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm font-semibold">
                          <span className={channel.color}>{channel.detail}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                          <ClockIcon className="h-4 w-4" />
                          <span>{channel.availability}</span>
                        </div>
                      </div>
                      <a
                        href={channel.action}
                        target={channel.external ? "_blank" : undefined}
                        rel={channel.external ? "noopener noreferrer" : undefined}
                        className={`inline-flex items-center mt-4 text-moroccan-mint hover:text-moroccan-mint-600 font-semibold transition-colors ${
                          isRTL ? "flex-row-reverse" : ""
                        }`}
                      >
                        {channel.actionLabel}
                        <svg
                          className={`h-4 w-4 ${isRTL ? "mr-2 rotate-180" : "ml-2"}`}
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

        {/* Response Times */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
        >
          <Card className="bg-gradient-to-r from-moroccan-mint/10 to-moroccan-mint/5">
            <CardContent className="p-6">
              <h3
                className={`text-xl font-bold mb-6 ${
                  isRTL ? "text-right" : ""
                }`}
              >
                {t("responseTimes.title")}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {responseTimeInfo.map((info, index) => (
                  <div
                    key={index}
                    className={`flex items-center gap-3 p-4 rounded-lg bg-white dark:bg-slate-800 ${
                      isRTL ? "flex-row-reverse text-right" : ""
                    }`}
                  >
                    <div className="flex-shrink-0 text-moroccan-mint">{info.icon}</div>
                    <div className="flex-1">
                      <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">
                        {info.label}
                      </p>
                      <Badge className={info.badgeColor}>{info.time}</Badge>
                    </div>
                  </div>
                ))}
              </div>
              <p
                className={`mt-4 text-sm text-slate-600 dark:text-slate-400 ${
                  isRTL ? "text-right" : ""
                }`}
              >
                {t("responseTimes.note")}
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
