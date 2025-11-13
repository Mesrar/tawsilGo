"use client"
import { motion } from "framer-motion"
import Image from "next/image"
import { Truck, Package, Globe, Shield, ArrowRight } from "lucide-react"
import { useTranslations } from "next-intl"

const CTA = () => {
  const t = useTranslations("home.cta");
  return (
    <section className="relative overflow-hidden py-16 bg-white dark:bg-slate-900">
      <div className="mx-auto px-4 sm:px-6">
        <div
          className="relative overflow-hidden rounded-xl bg-gradient-to-br from-blue-500/90 to-green-500/90 dark:from-blue-600/80 dark:to-green-600/80 px-6 py-10 shadow-lg dark:shadow-2xl"
        >
          {/* Subtle Background Pattern */}
          <div className="absolute -right-16 -top-16 -z-10 opacity-10">
            <Image
              src="/images/map-pattern.svg"
              width={300}
              height={300}
              alt=""
              aria-hidden="true"
              className="rotate-180"
            />
          </div>

          {/* Main Content */}
          <div className="flex flex-col items-center gap-8">
            {/* Text Content */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              viewport={{ once: true }}
              className="w-full text-center"
            >
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-medium text-white">
                <Truck className="h-4 w-4" />
                <span>{t("badge")}</span>
              </div>

              <h2 className="mb-4 text-2xl font-bold leading-tight text-white sm:text-3xl">
                {t("heading")}
                <span className="block bg-gradient-to-r from-green-200 to-white bg-clip-text text-transparent">
                  {t("headingHighlight")}
                </span>
              </h2>

              <p className="mb-6 text-base text-blue-50/90 sm:text-lg">
                {t("description")}
              </p>

              {/* Trust Badge - Mobile Optimized */}
              <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
                <div className="flex -space-x-2">
                  {[1,2,3,4].map((item) => (
                    <div key={item} className="h-8 w-8 overflow-hidden rounded-full border-2 border-white sm:h-10 sm:w-10">
                      <Image
                        src={`/images/avatars/ava-${item}.svg`}
                        width={40}
                        height={40}
                        alt=""
                        aria-hidden="true"
                      />
                    </div>
                  ))}
                </div>
                <p className="text-sm text-white/80">
                  {t.rich("trustCount", {
                    count: (chunks) => (
                      <span className="font-medium">{chunks}</span>
                    ),
                  })}
                </p>
              </div>
            </motion.div>

            {/* CTA Image - Hidden on smallest screens */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              className="relative hidden w-full max-w-[280px] sm:block"
            >
              <Image
                src="/images/package_delivery.svg"
                width={280}
                height={140}
                alt="Package delivery illustration"
                className="mx-auto"
              />
            </motion.div>

            {/* CTA Button - Full Width on Mobile */}
            <motion.div
              className="w-full"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <a
                href="/booking"
                className="flex h-14 w-full items-center justify-center gap-3 rounded-full bg-white px-6 py-4 text-base font-semibold text-blue-600 shadow-md transition-all hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:w-auto sm:min-w-[220px]"
                style={{ minHeight: '48px', touchAction: 'manipulation' }}
              >
                <Package className="h-5 w-5" />
                <span>{t("button")}</span>
                <ArrowRight className="h-5 w-5" />
              </a>
            </motion.div>
          </div>

          {/* Feature Icons - 2x2 Grid on Mobile */}
          <div className="mt-10 grid grid-cols-2 gap-y-4 gap-x-2 text-white/90">
            {[
              { icon: Globe, text: t("features.crossBorder") },
              { icon: Shield, text: t("features.secureHandling") },
              { icon: Truck, text: t("features.liveTracking") },
              { icon: Package, text: t("features.lowestRates") }
            ].map((feature, index) => (
              <div 
                key={index} 
                className="flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-white/5"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10">
                  <feature.icon className="h-5 w-5 text-green-200" />
                </div>
                <span className="text-sm font-medium">{feature.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default CTA