"use client"

import { useState, useRef } from "react"
import { motion, useInView } from "framer-motion"
import Image from "next/image"
import { Globe, ShieldCheck, Users, Clock, Package, ArrowRight } from "lucide-react"

const About = () => {
  const section1Ref = useRef(null);
  const section2Ref = useRef(null);
  const isSection1InView = useInView(section1Ref, { once: true, amount: 0.2 });
  const isSection2InView = useInView(section2Ref, { once: true, amount: 0.2 });
  
  return (
    <div className="bg-gradient-to-b from-blue-50/30 to-transparent dark:from-gray-900">
      {/* Mobile-optimized About Section 1 */}
      <section 
        ref={section1Ref}
        className="py-12 md:py-20 lg:py-28 overflow-hidden"
      >
        <div className="container px-5 mx-auto">
          <div className="flex flex-col gap-8 md:gap-10 lg:flex-row lg:gap-16">
            {/* Mobile-optimized image section */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isSection1InView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5 }}
              className="w-full lg:w-1/2"
            >
              <div className="relative aspect-[4/3] md:aspect-video rounded-2xl overflow-hidden shadow-lg">
                <Image
                  src="/images/map_logi.svg"
                  alt="Shipping Network"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority
                  className="object-cover dark:hidden"
                />
                <Image
                  src="/images/tech_map.svg"
                  alt="Shipping Network"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority
                  className="hidden object-cover dark:block"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-transparent" />
                
                {/* Mobile-optimized stats card with larger touch area */}
                <div className="absolute left-4 top-4 md:left-8 md:top-8 rounded-xl bg-white/90 shadow-md p-3 md:p-4 backdrop-blur-sm dark:bg-gray-800/90">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 flex items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/30">
                      <Users className="h-5 w-5 text-blue-600 dark:text-blue-300" />
                    </div>
                    <div>
                      <p className="text-xs md:text-sm font-medium text-gray-600 dark:text-gray-300">Active Community</p>
                      <p className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">2.4K+</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Mobile-optimized text content */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isSection1InView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="w-full lg:w-1/2"
            >
              <div className="inline-flex items-center gap-2 rounded-full bg-blue-100 px-3 py-1.5 text-xs md:text-sm font-medium text-blue-600 dark:bg-blue-900/30 dark:text-blue-300">
                <Package className="h-3.5 w-3.5" />
                Trusted by 850+ Shippers
              </div>
              
              <h2 className="mt-4 text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white">
                <span className="block mb-1">Revolutionizing</span>
                <span className="bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                  Peer Shipping
                </span>
              </h2>
              
              <p className="mt-4 text-base md:text-lg text-gray-600 dark:text-gray-300">
                We connect travelers with spare luggage space to individuals needing affordable,
                reliable cross-continental delivery.
              </p>

              {/* Mobile-optimized features with improved touch targets */}
              <div className="mt-8 space-y-4">
                {[
                  {
                    icon: Globe,
                    title: "Real-Time Tracking",
                    description: "Live GPS updates with customs alerts"
                  },
                  {
                    icon: ShieldCheck,
                    title: "Secure Handling",
                    description: "€10,000 insurance coverage"
                  },
                  {
                    icon: Clock,
                    title: "Fast Turnaround",
                    description: "Average 3-5 day delivery"
                  }
                ].map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0 }}
                    animate={isSection1InView ? { opacity: 1 } : {}}
                    transition={{ delay: index * 0.1 + 0.3 }}
                    className="flex gap-3 p-3 rounded-xl transition-colors hover:bg-white hover:shadow-md dark:hover:bg-gray-800"
                  >
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 to-green-600 text-white">
                      <feature.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                        {feature.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300">{feature.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mobile-optimized About Section 2 */}
      <section 
        ref={section2Ref}
        className="py-12 md:py-20 lg:py-28 overflow-hidden"
      >
        <div className="container px-5 mx-auto">
          <div className="flex flex-col gap-8 md:gap-10 lg:flex-row-reverse lg:gap-16">
            {/* Mobile-optimized image section */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isSection2InView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5 }}
              className="w-full lg:w-1/2"
            >
              <div className="relative aspect-[4/3] md:aspect-video rounded-2xl overflow-hidden shadow-lg">
                <Image
                  src="/images/tech_map.svg"
                  alt="Shipping Technology"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-contain dark:hidden"
                />
                <Image
                  src="/images/shipping-tech-dark.svg"
                  alt="Shipping Technology"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="hidden object-contain dark:block"
                />
                <div className="absolute inset-0 bg-gradient-to-l from-green-600/20 to-transparent" />
              </div>
            </motion.div>

            {/* Mobile-optimized text content */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isSection2InView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="w-full lg:w-1/2"
            >
              <div className="inline-flex items-center gap-2 rounded-full bg-green-100 px-3 py-1.5 text-xs md:text-sm font-medium text-green-600 dark:bg-green-900/30 dark:text-green-300">
                <Clock className="h-3.5 w-3.5" />
                24/7 Support
              </div>
              
              <h2 className="mt-4 text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white">
                <span className="block mb-1">Smart Logistics</span>
                <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                  Made Simple
                </span>
              </h2>
              
              <p className="mt-4 text-base text-gray-600 dark:text-gray-300">
                Our platform combines AI-powered matching with blockchain tracking to ensure
                complete transparency and reliability.
              </p>

              {/* Mobile-optimized statistics grid */}
              <div className="mt-8 grid grid-cols-2 gap-3">
                {[
                  { value: "98%", label: "On-Time Delivery" },
                  { value: "4.9/5", label: "User Rating" },
                  { value: "3h", label: "Avg. Match Time" },
                  { value: "€0.99", label: "Per KG Rate" }
                ].map((stat, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={isSection2InView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: index * 0.1 + 0.3 }}
                    className="rounded-xl border border-gray-100 bg-white p-4 text-center dark:border-gray-800 dark:bg-gray-800"
                  >
                    <p className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                    <p className="text-xs md:text-sm text-gray-600 dark:text-gray-300">{stat.label}</p>
                  </motion.div>
                ))}
              </div>

              {/* Mobile-optimized CTA with proper touch target */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={isSection2InView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.7 }}
                className="mt-8"
              >
                <button className="flex h-12 items-center justify-center rounded-full bg-gradient-to-r from-green-600 to-blue-600 px-6 text-sm font-medium text-white shadow-md transition-transform active:scale-95 w-full md:w-auto">
                  Start Shipping Now
                  <ArrowRight className="ml-2 h-4 w-4" />
                </button>
                
                {/* Mobile-optimized trust indicators */}
                <div className="mt-6 flex items-center gap-3">
                  <div className="flex -space-x-2">
                    {[1,2,3].map((item) => (
                      <Image
                        key={item}
                        src={`/images/avatars/avatar-${item}.png`}
                        width={32}
                        height={32}
                        alt="User"
                        className="inline-block h-8 w-8 rounded-full border-2 border-white dark:border-gray-800"
                      />
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Joined by 2,400+ satisfied users
                  </p>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default About