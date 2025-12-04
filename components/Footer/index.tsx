"use client"
import { motion } from "framer-motion"
import Image from "next/image"
import { Truck, MapPin, Clock, Shield, Mail, Phone, ArrowRight, CreditCard } from "lucide-react"
import Link from "next/link"
import { useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const Footer = () => {
  const t = useTranslations("footer")
  const currentYear = new Date().getFullYear()

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
    { icon: <Shield className="h-5 w-5" />, text: t("companyInfo.certification") },
    { icon: <Phone className="h-5 w-5" />, text: "+212 5XX-XXXXXX" },
    { icon: <Mail className="h-5 w-5" />, text: "contact@tawsilgo.com" }
  ]

  return (
    <footer className="relative bg-slate-900 text-slate-200 overflow-hidden border-t border-slate-800">
      {/* Moroccan Pattern Overlay */}
      <div className="absolute inset-0 bg-moroccan-pattern opacity-5 pointer-events-none" />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900/95 via-slate-900/90 to-moroccan-blue-midnight/90 pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-4 pt-16 pb-8 sm:px-6 lg:px-8">
        {/* Top Section: Newsletter & App Download */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16 border-b border-slate-800 pb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <h3 className="text-2xl font-bold text-white">
              {t("newsletter.title") || "Stay Updated"}
            </h3>
            <p className="text-slate-400 max-w-md">
              {t("newsletter.description")}
            </p>
            <form className="flex gap-3 max-w-md">
              <Input
                type="email"
                placeholder={t("newsletter.placeholder")}
                className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 focus:ring-moroccan-mint focus:border-moroccan-mint"
              />
              <Button type="submit" className="bg-moroccan-mint hover:bg-moroccan-mint-600 text-white shrink-0">
                <ArrowRight className="h-5 w-5" />
              </Button>
            </form>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="flex flex-col justify-center lg:items-end space-y-6"
          >
            <h3 className="text-xl font-semibold text-white">
              Download Our App
            </h3>
            <div className="flex flex-wrap gap-4">
              {/* App Store Button Placeholder */}
              <Button variant="outline" className="h-14 px-6 bg-slate-950 border-slate-700 hover:bg-slate-800 hover:border-slate-600 text-white flex items-center gap-3 transition-all group">
                <svg className="h-8 w-8 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.21-1.96 1.07-3.11-1.05.05-2.31.71-3.06 1.55-.68.75-1.26 1.95-1.11 3.07 1.17.09 2.36-.68 3.1-1.51" /></svg>
                <div className="text-left">
                  <div className="text-[10px] uppercase tracking-wider text-slate-400">Download on the</div>
                  <div className="text-sm font-bold leading-none">App Store</div>
                </div>
              </Button>

              {/* Google Play Button Placeholder */}
              <Button variant="outline" className="h-14 px-6 bg-slate-950 border-slate-700 hover:bg-slate-800 hover:border-slate-600 text-white flex items-center gap-3 transition-all group">
                <svg className="h-8 w-8 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.3,12.08L17.89,14.5L15.39,12L17.89,9.5L20.3,11.92C20.46,12.08 20.46,12.34 20.3,12.5M16.81,8.88L14.54,11.15L6.05,2.66L16.81,8.88Z" /></svg>
                <div className="text-left">
                  <div className="text-[10px] uppercase tracking-wider text-slate-400">Get it on</div>
                  <div className="text-sm font-bold leading-none">Google Play</div>
                </div>
              </Button>
            </div>
          </motion.div>
        </div>

        {/* Main Footer Content */}
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-4 mb-16">
          {/* Company Info */}
          <div className="space-y-6">
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/images/logo/logo-dark.png"
                alt="TawsilGo"
                width={160}
                height={50}
                className="h-10 w-auto"
              />
            </Link>
            <p className="text-sm leading-relaxed text-slate-400">
              {t("description")}
            </p>

            <div className="space-y-4">
              {companyInfo.map((item, index) => (
                <div key={index} className="flex items-center gap-3 group">
                  <span className="text-moroccan-mint bg-moroccan-mint/10 p-2 rounded-full group-hover:bg-moroccan-mint/20 transition-colors">
                    {item.icon}
                  </span>
                  <span className="text-sm text-slate-300">{item.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:pl-8">
            <h3 className="mb-6 text-lg font-semibold text-white">{t("sections.shippingServices")}</h3>
            <ul className="space-y-4">
              {logisticsLinks.map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-400 transition-colors hover:text-moroccan-mint flex items-center gap-2 group"
                  >
                    <span className="h-1 w-1 rounded-full bg-slate-600 group-hover:bg-moroccan-mint transition-colors" />
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="mb-6 text-lg font-semibold text-white">{t("sections.support")}</h3>
            <ul className="space-y-4">
              {supportLinks.map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-400 transition-colors hover:text-moroccan-mint flex items-center gap-2 group"
                  >
                    <span className="h-1 w-1 rounded-full bg-slate-600 group-hover:bg-moroccan-mint transition-colors" />
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal & Certifications */}
          <div>
            <h3 className="mb-6 text-lg font-semibold text-white">Legal & Security</h3>
            <ul className="space-y-4 mb-8">
              <li>
                <Link href="/terms" className="text-sm text-slate-400 hover:text-moroccan-mint transition-colors">
                  {t("legal.termsOfService")}
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-sm text-slate-400 hover:text-moroccan-mint transition-colors">
                  {t("legal.privacyPolicy")}
                </Link>
              </li>
            </ul>

            <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
              <div className="flex items-center gap-3 mb-2">
                <Shield className="h-5 w-5 text-moroccan-mint" />
                <span className="font-semibold text-white text-sm">Secure Shipping</span>
              </div>
              <p className="text-xs text-slate-400">
                All shipments are insured and tracked with bank-grade security protocols.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Copyright */}
          <div className="text-center text-sm text-slate-500 md:text-left">
            {t("copyright", { year: currentYear })}
          </div>

          {/* Payment Methods */}
          <div className="flex items-center gap-4">
            <span className="text-xs text-slate-500 uppercase tracking-wider">We Accept</span>
            <div className="flex gap-2">
              {/* Simple CSS/SVG Payment Badges */}
              <div className="h-8 w-12 bg-white rounded flex items-center justify-center" title="Visa">
                <svg className="h-4 w-auto" viewBox="0 0 36 11" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12.238 0.676L8.381 10.37H5.821L2.684 2.876C2.535 2.31 1.458 1.05 0 0.745V0.676H4.297C4.832 0.676 5.337 1.037 5.456 1.666L6.497 7.236L10.04 0.676H12.238ZM22.89 7.086C22.905 4.408 19.16 4.266 19.22 3.058C19.235 2.692 19.606 2.295 20.423 2.18C20.839 2.122 21.968 2.079 22.905 2.51L23.44 0.985C22.712 0.718 21.775 0.588 20.616 0.588C17.659 0.588 15.564 2.15 15.549 4.364C15.534 6.278 17.273 7.343 18.595 7.991C19.947 8.653 20.408 9.07 20.408 9.66C20.393 10.552 19.338 10.955 18.328 10.955C17.095 10.955 16.382 10.609 15.817 10.35L15.283 11.933C15.966 12.25 17.243 12.523 18.536 12.523C21.612 12.523 23.648 10.998 23.663 8.752L22.89 7.086ZM29.354 12.35H31.627L29.651 0.676H27.184C26.679 0.676 26.248 0.964 26.055 1.439L22.251 12.35H24.881L25.416 10.867H28.656L28.968 12.35H29.354ZM26.159 8.809L27.526 5.052L27.927 8.809H26.159ZM36 12.35H38.331L35.032 0.676H32.908L30.932 12.35H33.265L33.725 10.032H36V12.35Z" fill="#1A1F71" /></svg>
              </div>
              <div className="h-8 w-12 bg-white rounded flex items-center justify-center" title="Mastercard">
                <svg className="h-5 w-auto" viewBox="0 0 24 15" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="7.5" cy="7.5" r="7.5" fill="#EB001B" /><circle cx="16.5" cy="7.5" r="7.5" fill="#F79E1B" fillOpacity="0.8" /></svg>
              </div>
              <div className="h-8 w-12 bg-white rounded flex items-center justify-center" title="PayPal">
                <span className="text-xs font-bold text-blue-800 italic">Pay</span><span className="text-xs font-bold text-blue-500 italic">Pal</span>
              </div>
            </div>
          </div>

          {/* Social Links */}
          <div className="flex gap-4">
            {[
              { icon: <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" /></svg>, href: "#" },
              { icon: <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /></svg>, href: "#" },
              { icon: <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" /></svg>, href: "#" }
            ].map((social, index) => (
              <Link
                key={index}
                href={social.href}
                className="h-10 w-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-moroccan-mint hover:text-white transition-all duration-300"
              >
                {social.icon}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer