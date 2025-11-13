"use client"

import { useState, useRef, useEffect } from "react"
import { motion, useInView, AnimatePresence } from "framer-motion"
import Image from "next/image"
import { Truck, Globe, Package, Users, Clock, Shield, TrendingUp, Info, ChevronRight, ChevronLeft } from "lucide-react"
import { useSwipeable } from "react-swipeable"
import { cn } from "@/lib/utils"

const FunFact = () => {
  const [activeCard, setActiveCard] = useState<number | null>(0)
  const statsRef = useRef(null)
  const isInView = useInView(statsRef, { once: true, margin: "-100px 0px" })
  
  const stats = [
    { 
      id: "packages",
      value: "1.2M+", 
      label: "Packages Delivered",
      icon: <Package className="h-6 w-6 text-blue-500" strokeWidth={1.5} />,
      progress: 85,
      detail: "Shipped through our platform since 2020"
    },
    { 
      id: "travelers",
      value: "42K+", 
      label: "Active Travelers",
      icon: <Users className="h-6 w-6 text-green-500" strokeWidth={1.5} />,
      progress: 72,
      detail: "Verified community members worldwide"
    },
    { 
      id: "cities",
      value: "120+", 
      label: "Cities Connected",
      icon: <Globe className="h-6 w-6 text-purple-500" strokeWidth={1.5} />,
      progress: 100,
      detail: "Across 6 continents and 45 countries"
    },
    { 
      id: "ontime",
      value: "98.7%", 
      label: "On-Time Delivery",
      icon: <Clock className="h-6 w-6 text-amber-500" strokeWidth={1.5} />,
      progress: 98,
      detail: "Average delivery reliability rate"
    }
  ]
  
  // Mobile navigation for stat cards
  const handlePrevCard = () => {
    setActiveCard((prev) => prev !== null ? (prev - 1 + stats.length) % stats.length : stats.length - 1);
  }
  
  const handleNextCard = () => {
    setActiveCard((prev) => (prev !== null ? (prev + 1) % stats.length : 0));
  }
  
  // Mobile swipe handlers with improved sensitivity
  const swipeHandlers = useSwipeable({
    onSwipedLeft: handleNextCard,
    onSwipedRight: handlePrevCard,
    preventScrollOnSwipe: true,
    trackMouse: false,
    swipeDuration: 500,
    delta: 10 // Lower threshold for more responsive swiping
  });

  return (
    <section className="relative py-12 overflow-hidden bg-gradient-to-b from-blue-50/80 to-white dark:from-gray-900/80 dark:to-gray-900">
      <div className="mx-auto max-w-lg px-4 sm:max-w-3xl sm:px-6 lg:max-w-7xl lg:px-8">
        {/* Background pattern */}
        <div className="absolute inset-0 -z-10 pointer-events-none">
          <Image
            src="/images/map-pattern.svg"
            alt=""
            fill
            className="object-cover opacity-10 dark:opacity-5"
            aria-hidden="true"
            role="presentation"
            priority={false}
          />
        </div>

        {/* Mobile-optimized header with reduced content */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          viewport={{ once: true }}
          className="mb-10 text-center"
        >
          <div className="inline-flex items-center rounded-full bg-blue-100/80 px-3 py-1.5 text-xs font-medium text-blue-600 dark:bg-blue-900/40 dark:text-blue-300">
            <Truck className="mr-1.5 h-3.5 w-3.5" strokeWidth={1.5} />
            Peer Delivery Network
          </div>
          <h2 className="mt-4 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            Building the Future of
            <span className="block mt-1 bg-gradient-to-r from-blue-500 to-green-500 bg-clip-text text-transparent">
              Peer Shipping
            </span>
          </h2>
          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-gray-600 dark:text-gray-300">
            Save up to 60% on international shipping with our community network.
          </p>
        </motion.div>

        {/* Mobile card carousel with enhanced UX */}
        <div className="relative md:hidden mb-10" ref={statsRef}>
          <div 
            {...swipeHandlers}
            className="overflow-hidden touch-pan-y"
          >
            <div 
              className="flex transition-transform duration-300 ease-out" 
              style={{ transform: `translateX(-${activeCard !== null ? activeCard * 100 : 0}%)` }}
            >
              {stats.map((stat) => (
                <div 
                  key={stat.id}
                  className="w-full flex-shrink-0 px-1"
                >
                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="relative h-full rounded-xl bg-white p-5 shadow-sm border border-gray-100 dark:bg-gray-800 dark:border-gray-700"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-50 dark:bg-gray-700">
                        {stat.icon}
                      </div>
                      
                      <button
                        onClick={() => alert(`${stat.detail}`)}
                        className="h-10 w-10 flex items-center justify-center rounded-full text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 transition-colors"
                        aria-label={`Learn more about ${stat.label}`}
                      >
                        <Info className="h-4 w-4" strokeWidth={1.5} />
                      </button>
                    </div>
                    
                    <div>
                      <div className="flex items-baseline gap-2">
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                          {stat.value}
                        </h3>
                        {stat.progress && (
                          <div className="flex items-center text-sm font-medium text-green-500">
                            <TrendingUp className="h-3.5 w-3.5 mr-0.5" strokeWidth={2} />
                            {stat.progress}%
                          </div>
                        )}
                      </div>
                      <p className="text-base text-gray-700 dark:text-gray-200 mb-1">{stat.label}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{stat.detail}</p>
                    </div>
                    
                    {/* Animated Progress Bar */}
                    <div className="mt-5 relative">
                      <div className="h-2 w-full rounded-full bg-gray-100 dark:bg-gray-700">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${stat.progress}%` }}
                          transition={{ duration: 1, delay: 0.2 }}
                          className="h-full rounded-full bg-gradient-to-r from-blue-500 to-green-500"
                        />
                      </div>
                      <div className="mt-1 flex justify-between text-xs text-gray-500 dark:text-gray-400">
                        <span>0%</span>
                        <span>{stat.progress}%</span>
                      </div>
                    </div>
                    
                    {/* Subtle decoration */}
                    <div className="absolute -right-6 -top-6 h-16 w-16 rounded-full bg-blue-500/10 dark:bg-blue-500/5" aria-hidden="true" />
                  </motion.div>
                </div>
              ))}
            </div>
          </div>

          {/* Mobile navigation buttons for better tap targets */}
          <div className="flex justify-center items-center mt-5 gap-2">
            <button 
              onClick={handlePrevCard}
              className="flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-sm border border-gray-100 text-gray-600 hover:text-gray-900 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300 dark:hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              aria-label="Previous stat"
            >
              <ChevronLeft className="h-5 w-5" strokeWidth={1.5} />
            </button>

            <div className="flex items-center justify-center">
              {stats.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveCard(index)}
                  className={cn(
                    "w-2.5 h-2.5 mx-1 rounded-full transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500",
                    activeCard === index
                      ? "bg-blue-500 w-6" 
                      : "bg-gray-300 dark:bg-gray-600"
                  )}
                  aria-label={`Go to slide ${index + 1}`}
                  aria-current={activeCard === index ? "true" : "false"}
                />
              ))}
            </div>

            <button 
              onClick={handleNextCard}
              className="flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-sm border border-gray-100 text-gray-600 hover:text-gray-900 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300 dark:hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              aria-label="Next stat"
            >
              <ChevronRight className="h-5 w-5" strokeWidth={1.5} />
            </button>
          </div>
        </div>

        {/* Desktop Stats Grid (hidden on mobile) */}
        <motion.div
          ref={statsRef}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={{
            visible: { transition: { staggerChildren: 0.1 } },
            hidden: {}
          }}
          className="hidden md:grid grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.id}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 }
              }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className="group relative overflow-hidden rounded-xl bg-white p-6 shadow-lg transition-all hover:shadow-xl dark:bg-gray-800"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 dark:bg-gray-700">
                {stat.icon}
              </div>
              <div className="flex items-baseline gap-2">
                <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">
                  {stat.value}
                </h3>
                {stat.progress && (
                  <span className="text-sm font-medium text-green-600 flex items-center">
                    <TrendingUp className="h-3.5 w-3.5 mr-0.5" />
                    {stat.progress}%
                  </span>
                )}
              </div>
              <p className="text-gray-600 dark:text-gray-300">{stat.label}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{stat.detail}</p>
              
              {/* Animated Progress Bar */}
              <div className="mt-4 h-1.5 w-full rounded-full bg-gray-100 dark:bg-gray-700">
                <motion.div
                  initial={{ width: 0 }}
                  animate={isInView ? { width: `${stat.progress}%` } : { width: 0 }}
                  transition={{ duration: 1, delay: 0.2 }}
                  className="h-full rounded-full bg-gradient-to-r from-blue-600 to-green-600"
                />
              </div>

              <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-blue-600/10 transition-all group-hover:bg-green-600/10" />
            </motion.div>
          ))}
        </motion.div>

        {/* Mobile-optimized "Trusted By" Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          viewport={{ once: true }}
          className="mt-12 md:mt-16"
        >
          <div className="text-center mb-5">
            <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
              TRUSTED BY LEADING LOGISTICS COMPANIES
            </span>
          </div>
          
          {/* Mobile-optimized partner logos */}
          <div className="overflow-hidden">
            <div className="flex animate-marquee space-x-8 py-2">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex-shrink-0 flex items-center justify-center h-8">
                  <Image
                    src={`/images/brand/logo-${i + 1}.svg`}
                    width={80}
                    height={32}
                    alt={`Partner logo`}
                    className="h-5 w-auto grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all"
                  />
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default FunFact