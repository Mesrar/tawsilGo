"use client"
import { motion } from "framer-motion"
import Image from "next/image"
import { Truck, Plane, MapPin, Clock, Shield, Globe } from "lucide-react"
import Link from "next/link"
import { useTranslations } from "next-intl"

const Footer = () => {
  const t = useTranslations("footer")

  const logisticsLinks = [
    { title: t("shippingLinks.trackShipment"), href: "/tracking" },
    { title: t("shippingLinks.shippingRates"), href: "/rates" },
    { title: t("shippingLinks.serviceCoverage"), href: "/coverage" },
    { title: t("shippingLinks.schedulePickup"), href: "/pickup" }
  ]

  const supportLinks = [
    { title: t("supportLinks.helpCenter"), href: "/support" },
    { title: t("supportLinks.documentation"), href: "/docs" },
    { title: t("supportLinks.contactSupport"), href: "/contact" },
    { title: t("supportLinks.apiIntegration"), href: "/api" }
  ]

  const companyInfo = [
    { icon: <MapPin className="h-5 w-5" />, text: t("companyInfo.address") },
    { icon: <Clock className="h-5 w-5" />, text: t("companyInfo.hours") },
    { icon: <Shield className="h-5 w-5" />, text: t("companyInfo.certification") }
  ]

  return (
    <footer className="border-t border-gray-200 bg-background dark:border-gray-800">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        {/* Main Footer Content */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 gap-12 lg:grid-cols-4"
        >
          {/* Company Info */}
          <motion.div
            initial={{ y: 20 }}
            whileInView={{ y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/images/logo/logo-light.png"
                alt="TawsilGo"
                width={180}
                height={100}
                className="h-10 md:h-12 w-auto dark:hidden"
              />
              <Image
                src="/images/logo/logo-dark.png"
                alt="TawsilGo"
                width={180}
                height={100}
                className="hidden h-10 md:h-12 w-auto dark:block"
              />
            </Link>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {t("description")}
            </p>
            
            <div className="space-y-3">
              {companyInfo.map((item, index) => (
                <div key={index} className="flex items-center gap-3">
                  <span className="text-primary">{item.icon}</span>
                  <span className="text-sm text-muted-foreground">{item.text}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ y: 20 }}
            whileInView={{ y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:pl-8"
          >
            <h3 className="mb-6 text-lg font-semibold">{t("sections.shippingServices")}</h3>
            <ul className="space-y-3">
              {logisticsLinks.map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Support Links */}
          <motion.div
            initial={{ y: 20 }}
            whileInView={{ y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h3 className="mb-6 text-lg font-semibold">{t("sections.support")}</h3>
            <ul className="space-y-3">
              {supportLinks.map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Newsletter */}
          <motion.div
            initial={{ y: 20 }}
            whileInView={{ y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="space-y-6"
          >
            <h3 className="text-lg font-semibold">{t("sections.shippingUpdates")}</h3>
            <p className="text-sm text-muted-foreground">
              {t("newsletter.description")}
            </p>
            <form className="flex gap-2">
              <input
                type="email"
                placeholder={t("newsletter.placeholder")}
                className="w-full rounded-lg border bg-background px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button
                type="submit"
                className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
              >
               
                <Truck className="h-5 w-5" />
                <span className="sr-only">Subscribe</span>
              </button>
            </form>
          </motion.div>
        </motion.div>

        {/* Divider */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="my-12 h-px bg-gray-200 dark:bg-gray-800"
        />

        {/* Bottom Section */}
        <motion.div
          initial={{ y: 20 }}
          whileInView={{ y: 0 }}
          className="flex flex-col items-center justify-between gap-6 md:flex-row"
        >
          {/* Copyright */}
          <div className="text-center text-sm text-muted-foreground md:text-left">
            {t("copyright", { year: new Date().getFullYear() })}
          </div>

          {/* Legal Links */}
          <div className="flex gap-6">
            <Link
              href="/terms"
              className="text-sm text-muted-foreground transition-colors hover:text-primary"
            >
              {t("legal.termsOfService")}
            </Link>
            <Link
              href="/privacy"
              className="text-sm text-muted-foreground transition-colors hover:text-primary"
            >
              {t("legal.privacyPolicy")}
            </Link>
          </div>

          {/* Social Links */}
          <div className="flex gap-6">
            <Link
              href="#"
              className="text-muted-foreground transition-colors hover:text-primary"
              aria-label="Twitter"
            >
                      <svg
                      className="fill-[#D1D8E0] transition-all duration-300 hover:fill-primary"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g clipPath="url(#clip0_48_1499)">
                        <path
                          d="M14 13.5H16.5L17.5 9.5H14V7.5C14 6.47 14 5.5 16 5.5H17.5V2.14C17.174 2.097 15.943 2 14.643 2C11.928 2 10 3.657 10 6.7V9.5H7V13.5H10V22H14V13.5Z"
                          fill=""
                        />
                      </g>
                      <defs>
                        <clipPath id="clip0_48_1499">
                          <rect width="24" height="24" fill="white" />
                        </clipPath>
                      </defs>
                    </svg>
            </Link>
            <Link
              href="#"
              className="text-muted-foreground transition-colors hover:text-primary"
              aria-label="LinkedIn"
            >
                       <svg
                                    className="fill-[#D1D8E0] transition-all duration-300 hover:fill-primary"
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <g clipPath="url(#clip0_48_1505)">
                                      <path
                                        d="M6.94 5.00002C6.93974 5.53046 6.72877 6.03906 6.35351 6.41394C5.97825 6.78883 5.46944 6.99929 4.939 6.99902C4.40857 6.99876 3.89997 6.78779 3.52508 6.41253C3.1502 6.03727 2.93974 5.52846 2.94 4.99802C2.94027 4.46759 3.15124 3.95899 3.5265 3.5841C3.90176 3.20922 4.41057 2.99876 4.941 2.99902C5.47144 2.99929 5.98004 3.21026 6.35492 3.58552C6.72981 3.96078 6.94027 4.46959 6.94 5.00002ZM7 8.48002H3V21H7V8.48002ZM13.32 8.48002H9.34V21H13.28V14.43C13.28 10.77 18.05 10.43 18.05 14.43V21H22V13.07C22 6.90002 14.94 7.13002 13.28 10.16L13.32 8.48002Z"
                                        fill=""
                                      />
                                    </g>
                                    <defs>
                                      <clipPath id="clip0_48_1505">
                                        <rect width="24" height="24" fill="white" />
                                      </clipPath>
                                    </defs>
                                  </svg>
            </Link>
            <Link
              href="#"
              className="text-muted-foreground transition-colors hover:text-primary"
              aria-label="Blog"
            >
              <Truck className="h-5 w-5" />
            </Link>
          </div>
        </motion.div>
      </div>
    </footer>
  )
}

export default Footer