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
    <section className="relative py-12 overflow-hidden bg-slate-50 dark:bg-slate-900/50 border-y border-slate-200/50 dark:border-slate-800/50">
      {/* Moroccan Pattern Overlay */}
      <div className="absolute inset-0 bg-moroccan-pattern opacity-10 pointer-events-none" />

      {/* Section Header */}
      <div className="relative z-10 text-center mb-8 px-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-moroccan-mint/10 text-moroccan-mint-700 dark:text-moroccan-mint-300 text-xs font-bold uppercase tracking-wider mb-4 border border-moroccan-mint/20">
          <MapPin className="h-3.5 w-3.5" />
          {t("badge")}
        </div>
        <h3 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-3">
          {t.rich("heading", {
            highlight: (chunks) => (
              <span className="text-moroccan-mint relative inline-block">
                {chunks}
                <span className="absolute bottom-1 left-0 w-full h-2 bg-moroccan-mint/20 -z-10 rounded-full"></span>
              </span>
            ),
          })}
        </h3>
        <p className="text-base text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          {t("description")}
        </p>
      </div>

      {/* Moroccan Cities Marquee */}
      <div className="mb-6 relative z-10">
        <p className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-3 px-4 uppercase tracking-widest text-center">
          {t("moroccoLabel")}
        </p>
        <Marquee className="py-2">
          <MarqueeFade side="left" />
          <MarqueeFade side="right" />
          <MarqueeContent speed={30} direction="left">
            {moroccanCities.map((city, index) => (
              <MarqueeItem key={`morocco-${index}`} className="mx-2">
                <div
                  className="flex items-center gap-3 h-14 px-5 rounded-2xl border border-moroccan-mint/20 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm hover:bg-white hover:shadow-lg hover:shadow-moroccan-mint/10 hover:-translate-y-0.5 transition-all duration-300 cursor-default"
                >
                  <span className="text-2xl">{city.flag}</span>
                  <div className="flex flex-col items-start">
                    <span className="font-bold text-slate-900 dark:text-white text-sm leading-tight">
                      {city.name}
                    </span>
                    <span className="text-[10px] font-medium text-moroccan-mint-600 dark:text-moroccan-mint-400 uppercase tracking-wide">
                      {city.deliveries} {t("deliveries")}
                    </span>
                  </div>
                </div>
              </MarqueeItem>
            ))}
          </MarqueeContent>
        </Marquee>
      </div>

      {/* European Cities Marquee */}
      <div className="relative z-10">
        <p className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-3 px-4 uppercase tracking-widest text-center">
          {t("europeLabel")}
        </p>
        <Marquee className="py-2">
          <MarqueeFade side="left" />
          <MarqueeFade side="right" />
          <MarqueeContent speed={35} direction="right">
            {europeanCities.map((city, index) => (
              <MarqueeItem key={`europe-${index}`} className="mx-2">
                <div
                  className="flex items-center gap-3 h-14 px-5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm hover:bg-white hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 cursor-default"
                >
                  <span className="text-2xl">{city.flag}</span>
                  <div className="flex flex-col items-start">
                    <span className="font-bold text-slate-900 dark:text-white text-sm leading-tight">
                      {city.name}
                    </span>
                    <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                      {city.deliveries} {t("sent")}
                    </span>
                  </div>
                </div>
              </MarqueeItem>
            ))}
          </MarqueeContent>
        </Marquee>
      </div>

      {/* Stats Footer */}
      <div className="mt-8 text-center relative z-10">
        <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">
          {t.rich("footer", {
            highlight: (chunks) => (
              <span className="font-bold text-moroccan-mint">{chunks}</span>
            ),
          })}
        </p>
      </div>
    </section>
  );
}
