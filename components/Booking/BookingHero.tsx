"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
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

export function BookingHero() {
  const router = useRouter();
  const [departureCountry, setDepartureCountry] = useState("france");
  const [destinationCountry, setDestinationCountry] = useState("morocco");
  const t = useTranslations('home.hero');
  const tBooking = useTranslations('booking.hero');
  const tCountries = useTranslations('countries');
  const [isLoading, setIsLoading] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleSearch = () => {
    setIsLoading(true);
    // Create query parameters for the booking page
    const params = new URLSearchParams();
    params.append("from", departureCountry);
    params.append("to", destinationCountry);

    // Simulate loading state for better feedback
    setTimeout(() => {
      router.push(`/booking?${params.toString()}`);
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
    <section className="relative min-h-[100svh] flex flex-col justify-start md:justify-between pt-16 md:pt-24 pb-40 overflow-hidden bg-slate-50 dark:bg-slate-950">
      {/* Hero background image with Next.js optimization */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {!imageError ? (
          <Image
            src="/images/hero/hero-diaspora.png"
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
        <div className="absolute inset-0 bg-gradient-to-b from-white/80 via-white/70 to-white/85 md:bg-gradient-to-br md:from-white/75 md:via-white/65 md:to-white/80 dark:from-slate-950/80 dark:via-slate-950/70 dark:to-slate-950/85" />

        {/* Moroccan Pattern Overlay */}
        <div className="absolute inset-0 bg-moroccan-pattern opacity-30 mix-blend-overlay pointer-events-none" />
      </div>

      {/* Content with enhanced z-index */}
      <div className="relative z-10 w-full max-w-md mx-auto mt-6 md:mt-0 px-4">
        {/* Trust badge with stronger backdrop */}
        <div className="flex items-center bg-white/90 dark:bg-slate-900/80 backdrop-blur-md rounded-full px-4 py-2 mb-6 shadow-lg border border-moroccan-mint/20 w-fit mx-auto md:mx-0 animate-fade-in-up">
          <span className="bg-moroccan-mint text-white rounded-full w-5 h-5 flex items-center justify-center mr-2 shadow-sm">
            <ShieldCheck className="w-3 h-3" strokeWidth={3} />
          </span>
          <span className="text-slate-800 dark:text-slate-200 font-semibold text-xs tracking-wide uppercase">{tBooking('trustBadge')}</span>
        </div>

        {/* Main heading with improved contrast */}
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white leading-tight mb-3 text-center md:text-left tracking-tight">
          {t('title')}
        </h1>

        {/* Subheading with improved contrast */}
        <p className="text-lg text-slate-700 dark:text-slate-300 mb-8 text-center md:text-left leading-relaxed">
          {t('subtitle')}
        </p>
      </div>

      {/* Main form card with stronger backdrop blur */}
      <div className="relative z-10 w-full max-w-md mx-auto px-4">
        <div className="rounded-3xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl p-6 border border-white/50 dark:border-slate-700/50 shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
          {/* Form header */}
          <div className="flex items-center justify-between mb-6">
            <p className="text-lg text-slate-800 dark:text-white font-bold flex items-center">
              <Package className="h-6 w-6 mr-2.5 text-moroccan-mint" strokeWidth={2.5} />
              <span>{t('priceEstimate')}</span>
            </p>

            {/* Mobile-optimized route switcher control */}
            <button
              className="text-xs font-medium text-moroccan-mint hover:text-moroccan-mint-600 dark:hover:text-moroccan-mint-300 transition-colors bg-moroccan-mint/10 px-3 py-1.5 rounded-full flex items-center gap-1"
              aria-label={t('switchRoute')}
              onClick={() => {
                const temp = departureCountry;
                setDepartureCountry(destinationCountry);
                setDestinationCountry(temp);
              }}
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7 10L17 10M17 10L13 6M17 10L13 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M17 14L7 14M7 14L11 18M7 14L11 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              {t('switchRoute')}
            </button>
          </div>

          {/* Form with improved spacing for touch targets */}
          <div className="space-y-5">
            {/* From field */}
            <div className="relative">
              <label className="block text-sm text-slate-600 dark:text-slate-400 font-medium mb-2 flex items-center uppercase tracking-wider text-[11px]">
                <MapPin className="h-3.5 w-3.5 mr-1.5" strokeWidth={2} />
                {t('from')}
              </label>
              <Select
                defaultValue={departureCountry}
                onValueChange={setDepartureCountry}
              >
                <SelectTrigger className="w-full h-14 bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 shadow-sm rounded-2xl text-slate-900 dark:text-white text-base font-medium px-4 focus:ring-2 focus:ring-moroccan-mint/20 transition-all">
                  <SelectValue placeholder={t('selectDeparture')} />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-slate-800 rounded-2xl border-slate-100 dark:border-slate-700 shadow-xl p-1">
                  <SelectItem value="france" className="rounded-xl py-3 my-0.5 cursor-pointer">
                    <div className="flex items-center gap-3">
                      <FlagIcon code={"FR"} className="w-6 h-6 rounded-sm shadow-sm" />
                      <span className="font-medium">{tCountries('france')}</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="spain" className="rounded-xl py-3 my-0.5 cursor-pointer">
                    <div className="flex items-center gap-3">
                      <FlagIcon code={"ES"} className="w-6 h-6 rounded-sm shadow-sm" />
                      <span className="font-medium">{tCountries('spain')}</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="italy" className="rounded-xl py-3 my-0.5 cursor-pointer">
                    <div className="flex items-center gap-3">
                      <FlagIcon code={"IT"} className="w-6 h-6 rounded-sm shadow-sm" />
                      <span className="font-medium">{tCountries('italy')}</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="netherlands" className="rounded-xl py-3 my-0.5 cursor-pointer">
                    <div className="flex items-center gap-3">
                      <FlagIcon code={"NL"} className="w-6 h-6 rounded-sm shadow-sm" />
                      <span className="font-medium">{tCountries('netherlands')}</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="morocco" className="rounded-xl py-3 my-0.5 cursor-pointer">
                    <div className="flex items-center gap-3">
                      <FlagIcon code={"MA"} className="w-6 h-6 rounded-sm shadow-sm" />
                      <span className="font-medium">{tCountries('morocco')}</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* To field */}
            <div className="relative">
              <label className="block text-sm text-slate-600 dark:text-slate-400 font-medium mb-2 flex items-center uppercase tracking-wider text-[11px]">
                <MapPin className="h-3.5 w-3.5 mr-1.5" strokeWidth={2} />
                {t('to')}
              </label>
              <Select
                defaultValue={destinationCountry}
                onValueChange={setDestinationCountry}
              >
                <SelectTrigger className="w-full h-14 bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 shadow-sm rounded-2xl text-slate-900 dark:text-white text-base font-medium px-4 focus:ring-2 focus:ring-moroccan-mint/20 transition-all">
                  <SelectValue placeholder={t('selectDestination')} />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-slate-800 rounded-2xl border-slate-100 dark:border-slate-700 shadow-xl p-1">
                  <SelectItem value="france" className="rounded-xl py-3 my-0.5 cursor-pointer">
                    <div className="flex items-center gap-3">
                      <FlagIcon code={"FR"} className="w-6 h-6 rounded-sm shadow-sm" />
                      <span className="font-medium">{tCountries('france')}</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="spain" className="rounded-xl py-3 my-0.5 cursor-pointer">
                    <div className="flex items-center gap-3">
                      <FlagIcon code={"ES"} className="w-6 h-6 rounded-sm shadow-sm" />
                      <span className="font-medium">{tCountries('spain')}</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="italy" className="rounded-xl py-3 my-0.5 cursor-pointer">
                    <div className="flex items-center gap-3">
                      <FlagIcon code={"IT"} className="w-6 h-6 rounded-sm shadow-sm" />
                      <span className="font-medium">{tCountries('italy')}</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="netherlands" className="rounded-xl py-3 my-0.5 cursor-pointer">
                    <div className="flex items-center gap-3">
                      <FlagIcon code={"NL"} className="w-6 h-6 rounded-sm shadow-sm" />
                      <span className="font-medium">{tCountries('netherlands')}</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="morocco" className="rounded-xl py-3 my-0.5 cursor-pointer">
                    <div className="flex items-center gap-3">
                      <FlagIcon code={"MA"} className="w-6 h-6 rounded-sm shadow-sm" />
                      <span className="font-medium">{tCountries('morocco')}</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Mobile-optimized CTA button - Moroccan mint theme */}
            <Button
              className="w-full bg-moroccan-mint hover:bg-moroccan-mint-600 text-white text-lg font-bold h-16 shadow-lg shadow-moroccan-mint/25 rounded-2xl mt-4 transition-all duration-300 flex items-center justify-center active:scale-[0.98]"
              onClick={handleSearch}
              disabled={isLoading}
            >
              {isLoading ? (
                <svg className="animate-spin -ml-1 mr-2 h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : <Truck className="mr-2.5 h-6 w-6" strokeWidth={2.5} />}
              {t('cta')}
            </Button>
          </div>

          {/* Popular routes - enhanced for touch */}
          <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800">
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-3 flex items-center uppercase tracking-wider">
              <Clock className="h-3.5 w-3.5 mr-1.5" strokeWidth={2} />
              {t('popularRoutes')}
            </p>
            <div className="flex flex-wrap gap-2">
              {popularRoutes.map((route) => (
                <Button
                  key={route.label}
                  variant="ghost"
                  size="sm"
                  onClick={() => handleQuickRouteSelect(route.from, route.to)}
                  className="bg-slate-50 hover:bg-moroccan-mint/10 dark:bg-slate-800 dark:hover:bg-moroccan-mint/20 text-slate-700 dark:text-slate-300 hover:text-moroccan-mint dark:hover:text-moroccan-mint-300 text-xs h-9 rounded-lg flex items-center shadow-sm border border-slate-200 dark:border-slate-700 transition-all"
                >
                  {route.label}
                  <ChevronRight className="h-3 w-3 ml-1 opacity-50" />
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile-friendly feature highlights */}
        <div className="grid grid-cols-3 gap-3 mt-6">
          {[
            { icon: <Clock className="h-5 w-5" strokeWidth={2} />, text: t('fastDelivery') },
            { icon: <ShieldCheck className="h-5 w-5" strokeWidth={2} />, text: t('secure') },
            { icon: <PiggyBank className="h-5 w-5" strokeWidth={2} />, text: t('affordable') },
          ].map((item, i) => (
            <div
              key={i}
              className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm rounded-2xl p-3 text-center flex flex-col items-center justify-center shadow-sm border border-white/20 dark:border-white/5"
            >
              <div className="text-moroccan-mint mb-2 bg-moroccan-mint/10 p-2 rounded-full">{item.icon}</div>
              <div className="text-slate-700 dark:text-slate-300 text-[10px] font-bold uppercase tracking-wide">
                {item.text}
              </div>
            </div>
          ))}
        </div>

        {/* Trust indicators - mobile optimized */}
        <div className="mt-8 flex flex-col items-center justify-center text-center">
          <div className="flex mb-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className="h-4 w-4 text-amber-400 fill-amber-400"
              />
            ))}
          </div>
          <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
            {t('reviews')}
          </span>
        </div>
      </div>
    </section>
  );
}