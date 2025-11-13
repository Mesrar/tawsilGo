"use client"

import { useState, useRef, useEffect, JSX, SetStateAction } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import { Truck, Map, Shield, Clock, Package, Users, ChevronRight } from "lucide-react"
import { useSwipeable } from "react-swipeable"
import { cn } from "@/lib/utils"

const featuresTabData = [
  {
    id: "tabOne",
    title: "Smart Matching System",
    description: "AI-powered traveler-package matching with optimal route planning",
    image: "/images/smat_tech.svg",
    list: [
      {
        icon: <Clock className="h-5 w-5 text-blue-600" />,
        title: "Fast Matching",
        text: "Average 2.7 minute match time"
      },
      {
        icon: <Users className="h-5 w-5 text-green-600" />,
        title: "Community Verified",
        text: "All travelers undergo 3-step verification"
      },
      {
        icon: <Package className="h-5 w-5 text-purple-600" />,
        title: "Size Optimization",
        text: "98% luggage space utilization rate"
      }
    ],
    stats: [
      { value: "4.9/5", label: "Matching Accuracy" },
      { value: "850+", label: "Daily Matches" }
    ]
  },
  {
    id: "tabTwo",
    title: "Real-Time Tracking",
    description: "Live GPS monitoring with predictive analytics",
    image: "/images/live-tracking.svg",
    list: [
      {
        icon: <Map className="h-5 w-5 text-blue-600" />,
        title: "Route Optimization",
        text: "Dynamic path adjustments saving 15% travel time"
      },
      {
        icon: <Clock className="h-5 w-5 text-green-600" />,
        title: "ETA Predictions",
        text: "95% accurate arrival estimates"
      },
      {
        icon: <Shield className="h-5 w-5 text-purple-600" />,
        title: "Geo-Fencing",
        text: "Instant deviation alerts"
      }
    ],
    stats: [
      { value: "24/7", label: "Monitoring" },
      { value: "100ms", label: "Update Frequency" }
    ]
  },
  {
    id: "tabThree",
    title: "Secure Transactions",
    description: "Blockchain-powered escrow & automated payments",
    image: "/images/secure_payment.svg",
    list: [
      {
        icon: <Shield className="h-5 w-5 text-blue-600" />,
        title: "Escrow Protection",
        text: "100% payment security guarantee"
      },
      {
        icon: <Clock className="h-5 w-5 text-green-600" />,
        title: "Instant Payouts",
        text: "1-hour payment release after confirmation"
      },
      {
        icon: <Users className="h-5 w-5 text-purple-600" />,
        title: "Dispute Resolution",
        text: "24hr mediator response time"
      }
    ],
    stats: [
      { value: "€10K", label: "Insurance Coverage" },
      { value: "4.8/5", label: "Trust Rating" }
    ]
  }
]

interface Feature {
  id: string;
  title: string;
  description: string;
  image: string;
  list: Array<{
    icon: JSX.Element;
    title: string;
    text: string;
  }>;
  stats: Array<{
    value: string;
    label: string;
  }>;
}

const FeatureTabContent = ({ feature }: { feature: Feature }) => {
  return (
    <div className="mt-6 md:mt-10 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
      <div className="order-2 md:order-1">
        <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-4">
          {feature.title}
        </h3>
        <p className="text-sm md:text-base text-gray-600 dark:text-gray-300 mb-6">
          {feature.description}
        </p>
        
        <div className="space-y-4">
          {feature.list.map((item, i) => (
            <div key={i} className="flex items-start">
              <div className="flex-shrink-0 h-10 w-10 rounded-lg flex items-center justify-center bg-blue-50 dark:bg-gray-800">
                {item.icon}
              </div>
              <div className="ml-4">
                <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                  {item.title}
                </h4>
                <p className="mt-1 text-xs md:text-sm text-gray-500 dark:text-gray-400">
                  {item.text}
                </p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-6 grid grid-cols-2 gap-4">
          {feature.stats.map((stat, i) => (
            <div 
              key={i} 
              className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 text-center"
            >
              <p className="text-lg md:text-xl font-bold text-gray-900 dark:text-white">
                {stat.value}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
      
      <div className="relative h-64 md:h-auto order-1 md:order-2">
        <div className="aspect-video relative rounded-xl overflow-hidden shadow-lg h-full w-full">
          <Image
            src={feature.image}
            alt={feature.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/10 to-transparent" />
        </div>
      </div>
    </div>
  )
}

const FeaturesTab = () => {
  const [currentTab, setCurrentTab] = useState("tabOne")
  const [currentIndex, setCurrentIndex] = useState(0)
  const tabCountRef = useRef(featuresTabData.length)
  
  // Update index when tab changes
  useEffect(() => {
    const index = featuresTabData.findIndex(tab => tab.id === currentTab)
    if (index !== -1) {
      setCurrentIndex(index)
    }
  }, [currentTab])
  
  // Handle tab change
  const changeTab = (tabId: SetStateAction<string>, index: SetStateAction<number>) => {
    setCurrentTab(tabId)
    setCurrentIndex(index)
  }
  
  // Handle swiping for mobile
  const nextTab = () => {
    const newIndex = (currentIndex + 1) % tabCountRef.current
    changeTab(featuresTabData[newIndex].id, newIndex)
  }
  
  const prevTab = () => {
    const newIndex = (currentIndex - 1 + tabCountRef.current) % tabCountRef.current
    changeTab(featuresTabData[newIndex].id, newIndex)
  }
  
  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => nextTab(),
    onSwipedRight: () => prevTab(),
    trackMouse: false,
    preventScrollOnSwipe: true
  })

  return (
    <section className="py-12 md:py-20 lg:py-28 bg-gradient-to-b from-blue-50/30 to-transparent dark:from-gray-900 overflow-hidden">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="mb-10 md:mb-16 text-center"
        >
          <div className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1.5 text-xs font-medium text-blue-600 dark:bg-blue-900/30 dark:text-blue-300">
            <Truck className="mr-1.5 h-3.5 w-3.5" />
            Trusted by 1,200+ Shippers
          </div>
          <h2 className="mt-4 text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white">
            Powering Peer-to-Peer
            <span className="block md:inline md:ml-2 bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
              Logistics
            </span>
          </h2>
        </motion.div>

        {/* Mobile tab indicator */}
        <div className="flex justify-center mb-4 md:hidden">
          <div className="flex space-x-2">
            {featuresTabData.map((_, index) => (
              <span 
                key={index} 
                className={cn(
                  "block h-1.5 rounded-full transition-all duration-300",
                  index === currentIndex 
                    ? "w-6 bg-blue-600" 
                    : "w-1.5 bg-gray-300 dark:bg-gray-700"
                )}
              />
            ))}
          </div>
        </div>

        {/* Mobile swipeable tabs */}
        <div className="md:hidden mb-4 px-1" {...swipeHandlers}>
          <div className="overflow-hidden rounded-xl">
            <AnimatePresence mode="wait">
              <motion.div 
                key={currentTab}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="bg-white dark:bg-gray-800 shadow-sm p-5 rounded-xl"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 dark:bg-gray-700">
                      {currentIndex === 0 && <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />}
                      {currentIndex === 1 && <Map className="h-6 w-6 text-blue-600 dark:text-blue-400" />}
                      {currentIndex === 2 && <Shield className="h-6 w-6 text-blue-600 dark:text-blue-400" />}
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {featuresTabData[currentIndex].title}
                      </h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Swipe to explore more features
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                </div>
                
                <FeatureTabContent feature={featuresTabData[currentIndex]} />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Desktop Tab Navigation */}
        <div className="hidden md:block mb-10">
          <motion.div
            className="grid grid-cols-3 gap-4 lg:gap-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "0px 0px -100px 0px" }}
            variants={{
              visible: { transition: { staggerChildren: 0.2 } }
            }}
          >
            {featuresTabData.map((tab, index) => (
              <motion.div
                key={tab.id}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 }
                }}
                className={cn(
                  "group relative cursor-pointer overflow-hidden rounded-xl p-6 shadow-sm transition-all",
                  currentTab === tab.id 
                    ? "bg-gradient-to-br from-blue-600 to-green-600 text-white"
                    : "bg-white hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-750"
                )}
                onClick={() => changeTab(tab.id, index)}
              >
                <div className={cn(
                  "mb-4 flex h-12 w-12 items-center justify-center rounded-lg",
                  currentTab === tab.id 
                    ? "bg-white/20" 
                    : "bg-blue-100 dark:bg-gray-700"
                )}>
                  {index === 0 && <Users className="h-5 w-5" />}
                  {index === 1 && <Map className="h-5 w-5" />}
                  {index === 2 && <Shield className="h-5 w-5" />}
                </div>
                <h3 className={cn(
                  "text-lg font-semibold",
                  currentTab === tab.id ? "text-white" : "text-gray-900 dark:text-white"
                )}>
                  {tab.title}
                </h3>
                <p className={cn(
                  "mt-2 text-sm",
                  currentTab === tab.id ? "text-blue-50" : "text-gray-600 dark:text-gray-300"
                )}>
                  {tab.description}
                </p>
                <div className={cn(
                  "absolute -right-8 -top-8 h-24 w-24 rounded-full transition-all",
                  currentTab === tab.id ? "bg-white/10" : "bg-blue-600/10 group-hover:bg-green-600/10"
                )} />
              </motion.div>
            ))}
          </motion.div>
          
          {/* Desktop Tab Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-8 bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-8"
            >
              {featuresTabData.map((feature) => (
                <div key={feature.id} className={feature.id === currentTab ? "block" : "hidden"}>
                  <FeatureTabContent feature={feature} />
                </div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}

export default FeaturesTab