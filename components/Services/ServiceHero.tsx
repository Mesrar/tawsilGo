"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLocale } from "next-intl";

interface ServiceHeroProps {
    badge?: string;
    title: string;
    titleHighlight?: string;
    subtitle: string;
    imageSrc?: string;
    ctaText?: string;
    ctaLink?: string;
    secondaryCtaText?: string;
    secondaryCtaLink?: string;
}

export function ServiceHero({
    badge,
    title,
    titleHighlight,
    subtitle,
    imageSrc,
    ctaText,
    ctaLink = "/booking",
    secondaryCtaText,
    secondaryCtaLink,
}: ServiceHeroProps) {
    const locale = useLocale();
    const isRTL = locale === "ar";

    return (
        <section className="relative min-h-[80vh] flex flex-col justify-center py-20 px-4 overflow-hidden bg-slate-50 dark:bg-slate-950">
            {/* Background Image */}
            <div className="absolute inset-0 z-0 overflow-hidden">
                {imageSrc ? (
                    <Image
                        src={imageSrc}
                        alt=""
                        fill
                        priority
                        quality={85}
                        className="object-cover object-center"
                        placeholder="blur"
                        blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg=="
                    />
                ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-moroccan-mint-900 via-slate-900 to-moroccan-blue-midnight" />
                )}

                {/* Overlays for readability */}
                <div className="absolute inset-0 bg-gradient-to-b from-white/90 via-white/80 to-white/90 md:bg-gradient-to-r md:from-white/95 md:via-white/80 md:to-transparent dark:from-slate-950/95 dark:via-slate-950/80 dark:to-transparent/50" />

                {/* Moroccan Pattern Overlay */}
                <div className="absolute inset-0 bg-moroccan-pattern opacity-10 mix-blend-overlay pointer-events-none" />
            </div>

            <div className="container mx-auto max-w-6xl relative z-10">
                <div className="max-w-2xl">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className={`text-center ${isRTL ? "md:text-right" : "md:text-left"}`}
                    >
                        {badge && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.6, delay: 0.2 }}
                            >
                                <Badge className="mb-6 bg-moroccan-mint text-white border-none text-sm px-4 py-1.5 shadow-sm">
                                    {badge}
                                </Badge>
                            </motion.div>
                        )}

                        <motion.h1
                            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-slate-900 dark:text-white leading-tight"
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7, delay: 0.3 }}
                        >
                            {title}
                            {titleHighlight && (
                                <span className="block text-moroccan-mint mt-2">
                                    {titleHighlight}
                                </span>
                            )}
                        </motion.h1>

                        <motion.p
                            className="text-xl text-slate-700 dark:text-slate-200 mb-8 leading-relaxed"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.6 }}
                        >
                            {subtitle}
                        </motion.p>

                        <motion.div
                            className={`flex flex-col sm:flex-row gap-4 ${isRTL ? "md:justify-start" : "md:justify-start"
                                } justify-center`}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.7 }}
                        >
                            {ctaText && (
                                <Button
                                    size="lg"
                                    className="bg-moroccan-mint hover:bg-moroccan-mint-600 text-white h-14 px-8 text-lg shadow-lg hover:shadow-xl transition-all duration-300"
                                    asChild
                                >
                                    <Link href={ctaLink}>
                                        {ctaText}
                                        <ChevronRight className={`h-5 w-5 ${isRTL ? "mr-2" : "ml-2"}`} />
                                    </Link>
                                </Button>
                            )}

                            {secondaryCtaText && secondaryCtaLink && (
                                <Button
                                    size="lg"
                                    variant="outline"
                                    className="border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 h-14 px-8 text-lg"
                                    asChild
                                >
                                    <Link href={secondaryCtaLink}>{secondaryCtaText}</Link>
                                </Button>
                            )}
                        </motion.div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
