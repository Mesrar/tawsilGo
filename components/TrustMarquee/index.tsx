"use client";

import { Badge } from "@/components/ui/badge";
import { Marquee, MarqueeContent, MarqueeFade, MarqueeItem } from "@/components/ui/marquee";
import { MapPin } from "lucide-react";
import { useTranslations } from "next-intl";

// Cities we serve - Morocco and key European diaspora hubs
const moroccanCities = [
  { name: "Casablanca", flag: "🇲🇦", deliveries: "2,500+" },
  { name: "Rabat", flag: "🇲🇦", deliveries: "1,800+" },
  { name: "Marrakech", flag: "🇲🇦", deliveries: "1,400+" },
  { name: "Tangier", flag: "🇲🇦", deliveries: "1,200+" },
  { name: "Fez", flag: "🇲🇦", deliveries: "950+" },
  { name: "Agadir", flag: "🇲🇦", deliveries: "720+" },
  { name: "Meknes", flag: "🇲🇦", deliveries: "580+" },
  { name: "Oujda", flag: "🇲🇦", deliveries: "420+" },
];

const europeanCities = [
  { name: "Paris", flag: "🇫🇷", deliveries: "3,200+" },
  { name: "Lyon", flag: "🇫🇷", deliveries: "1,100+" },
  { name: "Marseille", flag: "🇫🇷", deliveries: "890+" },
  { name: "Madrid", flag: "🇪🇸", deliveries: "1,600+" },
  { name: "Barcelona", flag: "🇪🇸", deliveries: "1,300+" },
  { name: "Brussels", flag: "🇧🇪", deliveries: "950+" },
  { name: "Amsterdam", flag: "🇳🇱", deliveries: "820+" },
  { name: "Frankfurt", flag: "🇩🇪", deliveries: "680+" },
];

export function TrustMarquee() {
  const t = useTranslations("home.trustMarquee");

  return (
    <section className="py-8 bg-slate-50 dark:bg-slate-900/50 overflow-hidden">
      {/* Section Header */}
      <div className="text-center mb-6 px-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-moroccan-mint-50 dark:bg-moroccan-mint-900/30 text-moroccan-mint-700 dark:text-moroccan-mint-300 text-sm font-medium mb-3">
          <MapPin className="h-4 w-4" />
          {t("badge")}
        </div>
        <h3 className="text-xl font-bold text-slate-800 dark:text-white">
          {t.rich("heading", {
            highlight: (chunks) => (
              <span className="text-moroccan-mint">{chunks}</span>
            ),
          })}
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
          {t("description")}
        </p>
      </div>

      {/* Moroccan Cities Marquee */}
      <div className="mb-4">
        <p className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-2 px-4">
          {t("moroccoLabel")}
        </p>
        <Marquee>
          <MarqueeFade side="left" />
          <MarqueeFade side="right" />
          <MarqueeContent speed={30} direction="left">
            {moroccanCities.map((city, index) => (
              <MarqueeItem key={`morocco-${index}`}>
                <Badge
                  variant="outline"
                  className="h-10 px-4 border-moroccan-mint-200 dark:border-moroccan-mint-800 bg-white dark:bg-slate-800 hover:bg-moroccan-mint-50 dark:hover:bg-moroccan-mint-900/20 transition-colors"
                >
                  <span className="text-base mr-2">{city.flag}</span>
                  <div className="flex flex-col items-start">
                    <span className="font-semibold text-slate-800 dark:text-white text-sm">
                      {city.name}
                    </span>
                    <span className="text-xs text-moroccan-mint-600 dark:text-moroccan-mint-400">
                      {city.deliveries} {t("deliveries")}
                    </span>
                  </div>
                </Badge>
              </MarqueeItem>
            ))}
          </MarqueeContent>
        </Marquee>
      </div>

      {/* European Cities Marquee */}
      <div>
        <p className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-2 px-4">
          {t("europeLabel")}
        </p>
        <Marquee>
          <MarqueeFade side="left" />
          <MarqueeFade side="right" />
          <MarqueeContent speed={35} direction="right">
            {europeanCities.map((city, index) => (
              <MarqueeItem key={`europe-${index}`}>
                <Badge
                  variant="outline"
                  className="h-10 px-4 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                >
                  <span className="text-base mr-2">{city.flag}</span>
                  <div className="flex flex-col items-start">
                    <span className="font-semibold text-slate-800 dark:text-white text-sm">
                      {city.name}
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      {city.deliveries} {t("sent")}
                    </span>
                  </div>
                </Badge>
              </MarqueeItem>
            ))}
          </MarqueeContent>
        </Marquee>
      </div>

      {/* Stats Footer */}
      <div className="mt-6 text-center">
        <p className="text-xs text-slate-500 dark:text-slate-400">
          {t.rich("footer", {
            highlight: (chunks) => (
              <span className="font-semibold text-moroccan-mint">{chunks}</span>
            ),
          })}
        </p>
      </div>
    </section>
  );
}
