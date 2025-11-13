"use client"

import type React from "react"
import Image from "next/image"
import { useState } from "react"
import { motion } from "framer-motion"
import { Truck, Package, Users, Clock, ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const Hero = () => {
  const [email, setEmail] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
  }

  return (
    <section className="overflow-hidden bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 py-20 lg:py-32">
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:gap-12">
          <motion.div
            className="lg:w-1/2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-blue-100 dark:bg-blue-900/30 px-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-300">
              <Users className="h-4 w-4" />
              <span>Peer-to-Peer Shipping Network</span>
            </div>
            <h1 className="mb-6 text-4xl font-bold text-gray-900 dark:text-white lg:text-5xl lg:leading-tight">
              Share Journeys, 
              <span className="relative mx-2 inline-block bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                Share Deliveries
                <span className="absolute bottom-0 left-0 w-full transform border-b-4 border-blue-200 dark:border-blue-900" />
              </span>
              Between Morocco & Europe
            </h1>
            <p className="mb-8 text-lg text-gray-600 dark:text-gray-300">
              Leverage traveling individuals to transport packages across continents. 
              <span className="font-semibold text-blue-600 dark:text-blue-400"> Save up to 60%</span> compared to traditional carriers while building a community-powered logistics network.
            </p>

            <form onSubmit={handleSubmit} className="mb-8">
              <div className="flex flex-col sm:flex-row gap-4">
             
                <Button 
                  
                  size="lg"
                  className="h-12 bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 shadow-lg hover:shadow-xl transition-all"
                  onClick={() => document.getElementById("booking-form")?.scrollIntoView()}
                >
                  Start Sending today
                </Button>
              </div>
              <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
                Join 1,200+ trusted members in our shipping community
              </p>
            </form>

            <div className="flex items-center gap-4">
              <div className="flex -space-x-2">
                {[1,2,3,4].map((item) => (
                  <Image
                    key={item}
                    src={`/images/avatars/avatar-${item}.png`}
                    width={40}
                    height={40}
                    alt="Community member"
                    className="inline-block h-10 w-10 rounded-full border-2 border-white dark:border-gray-800"
                  />
                ))}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300">
                <p className="font-medium">4.8/5 • 300+ Reviews</p>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="h-4 w-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="mt-12 lg:mt-0 lg:w-1/2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="relative rounded-2xl border-8 border-white dark:border-gray-800 shadow-2xl hover:shadow-3xl transition-shadow duration-300">
              <Image
                src="/images/world.svg"
                alt="Shipping routes between Europe and Morocco"
                width={600}
                height={400}
                className="rounded-lg bg-gray-50 dark:bg-gray-700"
              />
              
              <motion.div
                className="absolute top-20 left-8 bg-white dark:bg-gray-800 p-3 rounded-xl shadow-lg flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
              >
                <Truck className="w-6 h-6 text-blue-600" />
                <span className="text-sm font-medium">Active Travelers Now</span>
                <span className="text-green-600 font-bold">42</span>
              </motion.div>

              <motion.div
                className="absolute bottom-20 right-8 bg-white dark:bg-gray-800 p-3 rounded-xl shadow-lg"
                animate={{ y: [0, -10, 0] }}
                transition={{ repeat: Infinity, duration: 3 }}
              >
                <div className="flex items-center gap-2">
                  <Package className="w-6 h-6 text-green-600" />
                  <div>
                    <p className="text-xs text-gray-500">En Route Packages</p>
                    <p className="font-bold text-lg">189</p>
                  </div>
                </div>
              </motion.div>

              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-transparent rounded-lg" />
            </div>
          </motion.div>
        </div>

        <motion.div
          className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ staggerChildren: 0.2 }}
        >
          {[
            {
              icon: Clock,
              title: "Real-Time Tracking",
              text: "Monitor your package's journey live through our mobile app",
              color: "text-blue-600"
            },
            {
              icon: ShieldCheck,
              title: "Secure Payments",
              text: "Escrow-protected transactions with 100% money-back guarantee",
              color: "text-green-600"
            },
            {
              icon: Users,
              title: "Community Verified",
              text: "All travelers undergo strict verification and rating checks",
              color: "text-purple-600"
            }
          ].map((feature, index) => (
            <motion.div
              key={index}
              className="flex flex-col items-center text-center bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 hover:border-transparent hover:shadow-xl transition-all"
              whileHover={{ y: -5 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <feature.icon className={`w-12 h-12 mb-4 ${feature.color}`} />
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600 dark:text-gray-300">{feature.text}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

export default Hero