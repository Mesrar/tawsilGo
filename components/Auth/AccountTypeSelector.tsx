"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Truck,
  Package,
  Clock,
  Wallet,
  MapPin,
  Star,
  Shield,
  TrendingUp,
  Users,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function AccountTypeSelector() {
  const router = useRouter();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  const cardHoverVariants = {
    rest: { y: 0, scale: 1 },
    hover: {
      y: -8,
      scale: 1.02,
      transition: { duration: 0.3, ease: "easeOut" },
    },
  };

  return (
    <section className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50 dark:from-slate-900 dark:via-blue-950/20 dark:to-slate-900">
      <div className="w-full max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center mb-12 space-y-4"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 15 }}
            className="inline-flex"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-blue-500/20 blur-2xl rounded-full" />
              <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg">
                <Truck className="h-10 w-10 text-white" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="space-y-3"
          >
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-r from-slate-900 via-blue-800 to-slate-900 dark:from-slate-100 dark:via-blue-300 dark:to-slate-100 bg-clip-text text-transparent">
              Join TawsilGo Network
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Choose your role in our logistics ecosystem connecting Europe and Morocco
            </p>
          </motion.div>

          {/* Trust indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="flex flex-wrap items-center justify-center gap-6 pt-4"
          >
            <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
              <div className="h-8 w-8 rounded-full bg-green-200 dark:bg-green-800 flex items-center justify-center">
                <Users className="h-4 w-4 text-green-700 dark:text-green-300" />
              </div>
              <span className="font-medium">10,000+ Active Users</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
              <div className="h-8 w-8 rounded-full bg-blue-200 dark:bg-blue-800 flex items-center justify-center">
                <TrendingUp className="h-4 w-4 text-blue-700 dark:text-blue-300" />
              </div>
              <span className="font-medium">95% Delivery Success</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
              <div className="h-8 w-8 rounded-full bg-amber-200 dark:bg-amber-800 flex items-center justify-center">
                <Star className="h-4 w-4 text-amber-700 dark:text-amber-300" />
              </div>
              <span className="font-medium">4.8/5 Rating</span>
            </div>
          </motion.div>
        </motion.div>

        {/* Account Type Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid md:grid-cols-2 gap-6 lg:gap-8"
        >
          {/* Driver Card */}
          <motion.div variants={itemVariants}>
            <motion.div
              variants={cardHoverVariants}
              initial="rest"
              whileHover="hover"
              className="h-full"
            >
              <Card className="h-full border-2 border-blue-200/60 dark:border-blue-800/40 hover:border-blue-400 dark:hover:border-blue-600 hover:shadow-2xl transition-all duration-300 overflow-hidden backdrop-blur-sm bg-white/80 dark:bg-slate-900/80">
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent pointer-events-none" />

                <CardHeader className="relative pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-xl bg-gradient-to-br from-blue-100 to-blue-50 dark:from-blue-900/40 dark:to-blue-900/20 ring-2 ring-blue-200/50 dark:ring-blue-800/50">
                        <Truck className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <CardTitle className="text-2xl">Driver Account</CardTitle>
                        <CardDescription className="text-base">
                          Earn by delivering parcels
                        </CardDescription>
                      </div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="relative space-y-6">
                  {/* Image */}
                  <div className="relative h-48 -mx-2 mb-4 rounded-lg overflow-hidden bg-gradient-to-br from-blue-50 to-slate-50 dark:from-blue-950/20 dark:to-slate-900">
                    <Image
                      src="/images/hero/driver-hero.svg"
                      alt="Delivery Driver"
                      fill
                      className="object-contain p-4"
                    />
                  </div>

                  {/* Features */}
                  <div className="space-y-3">
                    <h4 className="font-semibold text-sm text-slate-700 dark:text-slate-300 uppercase tracking-wide">
                      Benefits
                    </h4>
                    <ul className="space-y-3">
                      <FeatureItem
                        icon={Wallet}
                        text="Competitive earnings per delivery"
                        color="blue"
                      />
                      <FeatureItem
                        icon={Clock}
                        text="Flexible schedule, work when you want"
                        color="blue"
                      />
                      <FeatureItem
                        icon={MapPin}
                        text="Choose your preferred routes"
                        color="blue"
                      />
                      <FeatureItem
                        icon={Shield}
                        text="Full insurance coverage included"
                        color="blue"
                      />
                    </ul>
                  </div>

                  {/* CTA Button */}
                  <Button
                    className="w-full h-12 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-lg hover:shadow-xl transition-all duration-200 text-base font-semibold group"
                    size="lg"
                    onClick={() => router.push("/drivers/register")}
                  >
                    <Truck className="mr-2 h-5 w-5" />
                    Become a Driver
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>

                  <p className="text-xs text-center text-slate-500 dark:text-slate-400">
                    Complete 5-step verification process
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>

          {/* Customer Card */}
          <motion.div variants={itemVariants}>
            <motion.div
              variants={cardHoverVariants}
              initial="rest"
              whileHover="hover"
              className="h-full"
            >
              <Card className="h-full border-2 border-green-200/60 dark:border-green-800/40 hover:border-green-400 dark:hover:border-green-600 hover:shadow-2xl transition-all duration-300 overflow-hidden backdrop-blur-sm bg-white/80 dark:bg-slate-900/80">
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent pointer-events-none" />

                <CardHeader className="relative pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-xl bg-gradient-to-br from-green-100 to-green-50 dark:from-green-900/40 dark:to-green-900/20 ring-2 ring-green-200/50 dark:ring-green-800/50">
                        <Package className="h-8 w-8 text-green-600 dark:text-green-400" />
                      </div>
                      <div>
                        <CardTitle className="text-2xl">Customer Account</CardTitle>
                        <CardDescription className="text-base">
                          Ship parcels with ease
                        </CardDescription>
                      </div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="relative space-y-6">
                  {/* Image */}
                  <div className="relative h-48 -mx-2 mb-4 rounded-lg overflow-hidden bg-gradient-to-br from-green-50 to-slate-50 dark:from-green-950/20 dark:to-slate-900">
                    <Image
                      src="/images/hero/customer-hero.svg"
                      alt="Customer Shipping"
                      fill
                      className="object-contain p-4"
                    />
                  </div>

                  {/* Features */}
                  <div className="space-y-3">
                    <h4 className="font-semibold text-sm text-slate-700 dark:text-slate-300 uppercase tracking-wide">
                      Features
                    </h4>
                    <ul className="space-y-3">
                      <FeatureItem
                        icon={MapPin}
                        text="Real-time parcel tracking"
                        color="green"
                      />
                      <FeatureItem
                        icon={Clock}
                        text="Express delivery options available"
                        color="green"
                      />
                      <FeatureItem
                        icon={Star}
                        text="Rate drivers and track history"
                        color="green"
                      />
                      <FeatureItem
                        icon={Shield}
                        text="Secure payment processing"
                        color="green"
                      />
                    </ul>
                  </div>

                  {/* CTA Button */}
                  <Button
                    className="w-full h-12 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 shadow-lg hover:shadow-xl transition-all duration-200 text-base font-semibold group"
                    size="lg"
                    onClick={() => router.push("/auth/signup/customer")}
                  >
                    <Package className="mr-2 h-5 w-5" />
                    Start Shipping
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>

                  <p className="text-xs text-center text-slate-500 dark:text-slate-400">
                    Quick 2-step registration
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Footer CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="text-center mt-12 space-y-4"
        >
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Already have an account?{" "}
            <button
              onClick={() => router.push("/auth/signin")}
              className="font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:underline transition-colors"
            >
              Sign in here
            </button>
          </p>
          <div className="flex items-center justify-center gap-6 text-xs text-slate-500 dark:text-slate-400">
            <button onClick={() => router.push("/terms")} className="hover:text-slate-700 dark:hover:text-slate-300 transition-colors">
              Terms of Service
            </button>
            <span>•</span>
            <button onClick={() => router.push("/privacy")} className="hover:text-slate-700 dark:hover:text-slate-300 transition-colors">
              Privacy Policy
            </button>
            <span>•</span>
            <button onClick={() => router.push("/support")} className="hover:text-slate-700 dark:hover:text-slate-300 transition-colors">
              Support
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

interface FeatureItemProps {
  icon: any;
  text: string;
  color?: "blue" | "green";
}

const FeatureItem = ({ icon: Icon, text, color = "green" }: FeatureItemProps) => {
  const colorClasses = {
    blue: "text-blue-600 dark:text-blue-400",
    green: "text-green-600 dark:text-green-400",
  };

  return (
    <li className="flex items-start gap-3 group">
      <div className="flex-shrink-0 mt-0.5">
        <CheckCircle2 className={`h-5 w-5 ${colorClasses[color]}`} />
      </div>
      <span className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed group-hover:text-slate-900 dark:group-hover:text-slate-100 transition-colors">
        {text}
      </span>
    </li>
  );
};
