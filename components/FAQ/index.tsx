"use client"
import { motion } from "framer-motion"
import { useState } from "react"
import { Truck, Shield, Clock } from "lucide-react"
import FAQItem from "./FAQItem"
import Image from "next/image"
import faqData from "./faqData"

type CategoryTab = {
  id: string;
  label: string;
}

const categoryTabs: CategoryTab[] = [
  { id: "all", label: "All" },
  { id: "shipping", label: "Shipping" },
  { id: "payment", label: "Payment" },
  { id: "security", label: "Security" },
  { id: "support", label: "Support" }
]

const FAQ = () => {
  const [activeFaq, setActiveFaq] = useState(1)
  const [activeCategory, setActiveCategory] = useState("all")

  const handleFaqToggle = (id: number) => {
    activeFaq === id ? setActiveFaq(0) : setActiveFaq(id)
  }

  const filteredFaqs = activeCategory === "all" 
    ? faqData 
    : faqData.filter(faq => faq.category === activeCategory)

  return (
    <section className="relative py-12 bg-gradient-to-b from-blue-50/30 to-transparent dark:from-gray-900/50">
      <div className="mx-auto max-w-[375px] px-4">
        {/* Background Pattern - More subtle for mobile */}
        <div className="absolute inset-0 -z-10 opacity-5">
          <Image
            src="/images/map-pattern.svg"
            alt=""
            fill
            className="object-cover dark:opacity-10"
            aria-hidden="true"
          />
        </div>

        {/* Header Section - Simplified for mobile */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          viewport={{ once: true }}
          className="mb-8"
        >
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-600 dark:bg-blue-900/20 dark:text-blue-300">
            <Truck className="h-3.5 w-3.5" />
            Shipping Support
          </div>
          <h2 className="mb-3 text-xl font-bold text-gray-900 dark:text-white">
            Your Logistics
            <span className="mx-1 bg-gradient-to-r from-blue-500 to-green-500 bg-clip-text text-transparent">
              Questions
            </span>
            Answered
          </h2>
          
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Get answers to the most common questions about our shipping process
          </p>
        </motion.div>

        {/* Category Tabs - Mobile optimized horizontal scroll */}
        <div className="mb-5 overflow-x-auto scrollbar-hide">
          <div className="flex gap-2 pb-1 w-max">
            {categoryTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveCategory(tab.id)}
                className={`whitespace-nowrap rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors min-h-[32px] ${
                  activeCategory === tab.id
                    ? "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* FAQ Items */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          viewport={{ once: true }}
          className="mb-8"
        >
          {filteredFaqs.length > 0 ? (
            <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-850">
              {filteredFaqs.map((faq) => (
                <FAQItem
                  key={faq.id}
                  faqData={{
                    ...faq,
                    activeFaq,
                    handleFaqToggle,
                    icon: faq.icon
                  }}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <div className="mb-3 rounded-full bg-blue-50 p-3 dark:bg-blue-900/20">
                <Truck className="h-6 w-6 text-blue-500" />
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                No FAQs found in this category
              </p>
              <button 
                onClick={() => setActiveCategory("all")}
                className="mt-3 text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
              >
                View all FAQs
              </button>
            </div>
          )}
        </motion.div>

        {/* Support Card - Mobile Optimized */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          viewport={{ once: true }}
          className="rounded-xl border border-blue-100 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-850"
        >
          <div className="flex items-start gap-3">
            <div className="rounded-lg bg-blue-50 p-2 dark:bg-blue-900/20">
              <Clock className="h-5 w-5 text-blue-500" />
            </div>
            <div>
              <h3 className="mb-2 text-base font-medium text-gray-900 dark:text-white">
                24/7 Support
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Need urgent help? Our multilingual support team is available round-the-clock.
              </p>
              <div className="mt-3 flex items-center gap-2">
                <span className="text-xs text-gray-500">Average response time:</span>
                <span className="text-sm font-medium text-green-500">8 minutes</span>
              </div>
            </div>
          </div>
          
          {/* Trust Badge - Simplified for mobile */}
          <div className="mt-4 flex items-center justify-between rounded-lg bg-gray-50 p-3 dark:bg-gray-800">
            <div className="flex items-center gap-3">
              <Shield className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  Verified Bus Partners
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-300">
                  Licensed drivers, 10+ years Morocco routes
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default FAQ