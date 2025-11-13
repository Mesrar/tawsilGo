"use client";

import { useState } from "react";
import Image from "next/image";
import { useTranslations } from 'next-intl';
import { Button } from "@/components/ui/button";
import {
  Package,
  MapPin,
  Truck,
  ChevronRight,
  Star,
  Clock,
  ShieldCheck,
  PiggyBank
} from "lucide-react";
import { FlagIcon } from "react-flag-kit";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface BookingHeroProps {
  departureCountry: string;
  destinationCountry: string;
  setDepartureCountry: (country: string) => void;
  setDestinationCountry: (country: string) => void;
  onSearchClick: () => void;
}

export function BookingHero({
  departureCountry,
  destinationCountry,
  setDepartureCountry,
  setDestinationCountry,
  onSearchClick,
}: BookingHeroProps) {
  const t = useTranslations('home.hero');
  const tBooking = useTranslations('booking.hero');
  const tCountries = useTranslations('countries');
  const [isLoading, setIsLoading] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleSearch = () => {
    setIsLoading(true);
    // Simulate loading state for better feedback
    setTimeout(() => {
      onSearchClick();
      setIsLoading(false);
    }, 800);
  };

  // Popular Morocco routes for diaspora
  const popularRoutes = [
    { from: "france", to: "morocco", label: `🇫🇷 → 🇲🇦 ${tCountries('france')}` },
    { from: "spain", to: "morocco", label: `🇪🇸 → 🇲🇦 ${tCountries('spain')}` },
    { from: "netherlands", to: "morocco", label: `🇳🇱 → 🇲🇦 ${tCountries('belgium')}` }
  ];
  
  const handleQuickRouteSelect = (from: string, to: string) => {
    setDepartureCountry(from);
    setDestinationCountry(to);
  };

  return (
    <section className="relative min-h-[100svh] flex flex-col justify-start md:justify-between pt-16 md:pt-24 pb-40 overflow-hidden">
      {/* Hero background image with Next.js optimization */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {!imageError ? (
          <Image
            src="/images/hero/hero_banner.png"
            alt=""
            fill
            priority
            quality={75}
            sizes="100vw"
            className="object-cover object-center"
            onError={() => setImageError(true)}
            placeholder="blur"
            blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg=="
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-moroccan-mint-900 via-slate-900 to-moroccan-blue-midnight" />
        )}

        {/* Lighter overlay for better contrast with dark text - mobile first */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/70 via-white/60 to-white/75 md:bg-gradient-to-br md:from-white/65 md:via-white/55 md:to-white/70 dark:from-slate-950/80 dark:via-slate-950/70 dark:to-slate-950/85" />
      </div>

      {/* Content with enhanced z-index */}
      <div className="relative z-10 w-full max-w-md mx-auto mt-8 md:mt-0">
        {/* Trust badge with stronger backdrop */}
        <div className="flex items-center bg-white/80 dark:bg-moroccan-mint/15 backdrop-blur-md rounded-full px-4 py-3 mb-6 shadow-lg border-2 border-moroccan-mint/30 dark:border-moroccan-mint/30">
          <span className="bg-moroccan-mint text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 shadow-md">
            ✓
          </span>
          <span className="text-slate-900 dark:text-white font-medium text-sm">{tBooking('trustBadge')}</span>
        </div>

        {/* Main heading with improved contrast */}
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white leading-tight mb-4">
          {t('title')}
        </h1>

        {/* Subheading with improved contrast */}
        <p className="text-base text-slate-800 dark:text-white/95 mb-8">
          {t('subtitle')}
        </p>
      </div>

      {/* Main form card with stronger backdrop blur */}
      <div className="relative z-10 w-full max-w-md mx-auto rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-md p-5 border border-slate-200 dark:border-white/20 shadow-2xl">
        {/* Form header */}
        <div className="flex items-center justify-between mb-5">
          <p className="text-base text-slate-800 dark:text-white font-medium flex items-center">
            <Package className="h-5 w-5 mr-2 text-moroccan-mint" strokeWidth={2} />
            <span>{t('priceEstimate')}</span>
          </p>

          {/* Mobile-optimized route switcher control */}
          <button
            className="text-xs text-moroccan-mint hover:text-moroccan-mint-600 dark:hover:text-moroccan-mint-300 transition-colors"
            aria-label={t('switchRoute')}
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M7 10L17 10M17 10L13 6M17 10L13 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M17 14L7 14M7 14L11 18M7 14L11 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

        {/* Form with improved spacing for touch targets */}
        <div className="space-y-4">
          {/* From field */}
          <div>
            <label className="block text-sm text-slate-700 dark:text-white font-medium mb-2 flex items-center">
              <MapPin className="h-4 w-4 mr-1.5 text-slate-500 dark:text-slate-300" strokeWidth={2} />
              {t('from')}:
            </label>
            <Select
              defaultValue={departureCountry}
              onValueChange={setDepartureCountry}
            >
              <SelectTrigger className="w-full h-12 bg-white dark:bg-slate-800 border-0 shadow-sm rounded-xl text-slate-800 dark:text-white">
                <SelectValue placeholder={t('selectDeparture')} />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-slate-800 rounded-xl border-0 shadow-xl">
                <SelectItem value="france">
                  <div className="flex items-center gap-3">
                    <FlagIcon code={"FR"} className="w-5 h-5" />
                    <span>{tCountries('france')}</span>
                  </div>
                </SelectItem>
                <SelectItem value="spain">
                  <div className="flex items-center gap-3">
                    <FlagIcon code={"ES"} className="w-5 h-5" />
                    <span>{tCountries('spain')}</span>
                  </div>
                </SelectItem>
                <SelectItem value="italy">
                  <div className="flex items-center gap-3">
                    <FlagIcon code={"IT"} className="w-5 h-5" />
                    <span>{tCountries('italy')}</span>
                  </div>
                </SelectItem>
                <SelectItem value="netherlands">
                  <div className="flex items-center gap-3">
                    <FlagIcon code={"NL"} className="w-5 h-5" />
                    <span>{tCountries('netherlands')}</span>
                  </div>
                </SelectItem>
                <SelectItem value="morocco">
                  <div className="flex items-center gap-3">
                    <FlagIcon code={"MA"} className="w-5 h-5" />
                    <span>{tCountries('morocco')}</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* To field */}
          <div>
            <label className="block text-sm text-slate-700 dark:text-white font-medium mb-2 flex items-center">
              <MapPin className="h-4 w-4 mr-1.5 text-slate-500 dark:text-slate-300" strokeWidth={2} />
              {t('to')}:
            </label>
            <Select
              defaultValue={destinationCountry}
              onValueChange={setDestinationCountry}
            >
              <SelectTrigger className="w-full h-12 bg-white dark:bg-slate-800 border-0 shadow-sm rounded-xl text-slate-800 dark:text-white">
                <SelectValue placeholder={t('selectDestination')} />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-slate-800 rounded-xl border-0 shadow-xl">
                <SelectItem value="france">
                  <div className="flex items-center gap-3">
                    <FlagIcon code={"FR"} className="w-5 h-5" />
                    <span>{tCountries('france')}</span>
                  </div>
                </SelectItem>
                <SelectItem value="spain">
                  <div className="flex items-center gap-3">
                    <FlagIcon code={"ES"} className="w-5 h-5" />
                    <span>{tCountries('spain')}</span>
                  </div>
                </SelectItem>
                <SelectItem value="italy">
                  <div className="flex items-center gap-3">
                    <FlagIcon code={"IT"} className="w-5 h-5" />
                    <span>{tCountries('italy')}</span>
                  </div>
                </SelectItem>
                <SelectItem value="netherlands">
                  <div className="flex items-center gap-3">
                    <FlagIcon code={"NL"} className="w-5 h-5" />
                    <span>{tCountries('netherlands')}</span>
                  </div>
                </SelectItem>
                <SelectItem value="morocco">
                  <div className="flex items-center gap-3">
                    <FlagIcon code={"MA"} className="w-5 h-5" />
                    <span>{tCountries('morocco')}</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Mobile-optimized CTA button - Moroccan mint theme */}
          <Button
            className="w-full bg-moroccan-mint hover:bg-moroccan-mint-600 text-base font-medium h-14 shadow-md rounded-xl mt-2 transition-all duration-300 flex items-center justify-center"
            onClick={handleSearch}
            disabled={isLoading}
          >
            {isLoading ? (
              <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : <Truck className="mr-2 h-5 w-5" />}
            {t('cta')}
          </Button>
        </div>

        {/* Popular routes - enhanced for touch */}
        <div className="mt-5">
          <p className="text-sm text-slate-600 dark:text-white/80 mb-2 flex items-center">
            <Clock className="h-4 w-4 mr-1.5 opacity-70" strokeWidth={2} />
            {t('popularRoutes')}:
          </p>
          <div className="flex flex-wrap gap-2">
            {popularRoutes.map((route) => (
              <Button
                key={route.label}
                variant="ghost"
                size="sm"
                onClick={() => handleQuickRouteSelect(route.from, route.to)}
                className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-white text-xs h-10 rounded-lg flex items-center shadow-sm transition-colors"
              >
                {route.label}
                <ChevronRight className="h-3 w-3 ml-1 opacity-70" />
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile-friendly feature highlights */}
      <div className="relative z-10 w-full max-w-md mx-auto mt-8 mb-4">
        <div className="grid grid-cols-3 gap-3">
          {[
            { icon: <Clock className="h-5 w-5" strokeWidth={2} />, text: t('fastDelivery') },
            { icon: <ShieldCheck className="h-5 w-5" strokeWidth={2} />, text: t('secure') },
            { icon: <PiggyBank className="h-5 w-5" strokeWidth={2} />, text: t('affordable') },
          ].map((item, i) => (
            <div
              key={i}
              className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm rounded-xl p-3 text-center flex flex-col items-center justify-center shadow-lg border border-slate-200/50 dark:border-white/10"
            >
              <div className="text-moroccan-mint mb-2">{item.icon}</div>
              <div className="text-slate-700 dark:text-white text-xs font-medium">
                {item.text}
              </div>
            </div>
          ))}
        </div>

        {/* Trust indicators - mobile optimized */}
        <div className="mt-6 flex items-center justify-center">
          <div className="flex">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className="h-4 w-4 text-yellow-400"
                fill="currentColor"
              />
            ))}
          </div>
          <span className="text-sm text-slate-900 dark:text-white ml-2">
            {t('reviews')}
          </span>
        </div>
      </div>


    </section>
  );
}