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
import { Card } from "@/components/ui/card";

export default function SupportChannels() {
  const t = useTranslations("support.channels");
  const locale = useLocale();
  const isRTL = locale === "ar";

  const contactMethods = [
    {
      icon: <PhoneIcon className="h-5 w-5" />,
      title: t("phone.title"),
      value: t("phone.number"),
      action: "tel:+33763215487",
      color: "text-blue-600 dark:text-blue-400",
      bg: "bg-blue-50 dark:bg-blue-900/20",
    },
    {
      icon: <EnvelopeIcon className="h-5 w-5" />,
      title: t("email.title"),
      value: t("email.address"),
      action: "mailto:support@tawsilgo.com",
      color: "text-purple-600 dark:text-purple-400",
      bg: "bg-purple-50 dark:bg-purple-900/20",
    },
    {
      icon: <ChatBubbleLeftRightIcon className="h-5 w-5" />,
      title: t("whatsapp.title"),
      value: t("whatsapp.number"),
      action: "https://wa.me/33763215487",
      color: "text-green-600 dark:text-green-400",
      bg: "bg-green-50 dark:bg-green-900/20",
      external: true,
    },
  ];

  return (
    <section className="py-16 px-4 bg-gray-50 dark:bg-slate-900/50">
      <div className="container mx-auto max-w-5xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Methods */}
          <div className="lg:col-span-2 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className={`text-2xl font-bold mb-6 text-gray-900 dark:text-white ${isRTL ? "text-right" : ""}`}>
                {t("title")}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {contactMethods.map((method, index) => (
                  <a
                    key={index}
                    href={method.action}
                    target={method.external ? "_blank" : undefined}
                    rel={method.external ? "noopener noreferrer" : undefined}
                    className="block group"
                  >
                    <Card className="p-5 h-full border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm hover:shadow-md transition-all duration-200">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${method.bg} ${method.color}`}>
                        {method.icon}
                      </div>
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                        {method.title}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 font-medium group-hover:text-primary transition-colors">
                        {method.value}
                      </p>
                    </Card>
                  </a>
                ))}
              </div>
            </motion.div>

            {/* Office Location */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <Card className="p-6 border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900">
                <div className={`flex items-start gap-4 ${isRTL ? "flex-row-reverse text-right" : ""}`}>
                  <div className="w-10 h-10 rounded-lg bg-moroccan-mint/10 text-moroccan-mint flex items-center justify-center flex-shrink-0">
                    <MapPinIcon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                      {t("office.title")}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-4">
                      {t("office.address")}
                    </p>
                    <div className={`flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 ${isRTL ? "flex-row-reverse" : ""}`}>
                      <ClockIcon className="h-4 w-4" />
                      <span>{t("office.availability")}</span>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>

          {/* Response Times - Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <Card className="h-full p-6 bg-gradient-to-br from-gray-900 to-slate-800 text-white border-0 shadow-lg">
              <h3 className={`text-lg font-bold mb-6 ${isRTL ? "text-right" : ""}`}>
                {t("responseTimes.title")}
              </h3>
              <div className="space-y-6">
                <div className={`flex items-center gap-4 ${isRTL ? "flex-row-reverse text-right" : ""}`}>
                  <div className="w-2 h-2 rounded-full bg-red-400 shadow-[0_0_10px_rgba(248,113,113,0.5)]" />
                  <div>
                    <p className="text-sm font-medium text-gray-300">{t("responseTimes.urgent")}</p>
                    <p className="text-lg font-bold">{t("responseTimes.urgentTime")}</p>
                  </div>
                </div>
                <div className={`flex items-center gap-4 ${isRTL ? "flex-row-reverse text-right" : ""}`}>
                  <div className="w-2 h-2 rounded-full bg-blue-400 shadow-[0_0_10px_rgba(96,165,250,0.5)]" />
                  <div>
                    <p className="text-sm font-medium text-gray-300">{t("responseTimes.normal")}</p>
                    <p className="text-lg font-bold">{t("responseTimes.normalTime")}</p>
                  </div>
                </div>
                <div className={`flex items-center gap-4 ${isRTL ? "flex-row-reverse text-right" : ""}`}>
                  <div className="w-2 h-2 rounded-full bg-purple-400 shadow-[0_0_10px_rgba(192,132,252,0.5)]" />
                  <div>
                    <p className="text-sm font-medium text-gray-300">{t("responseTimes.business")}</p>
                    <p className="text-lg font-bold">{t("responseTimes.businessTime")}</p>
                  </div>
                </div>
              </div>
              <div className="mt-8 pt-6 border-t border-white/10">
                <p className={`text-xs text-gray-400 leading-relaxed ${isRTL ? "text-right" : ""}`}>
                  {t("responseTimes.note")}
                </p>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
