"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { 
  Package, 
  CheckCircle, 
  MapPin, 
  FileText, 
  Clock, 
  ChartBar,
  QrCode, 
  Menu, 
  X,
  Home,
  User
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

// Mobile-first navigation component with modern UX principles
export default function MobileDriverDashboard({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Modern minimalist menu items with clear icons
  const menuItems = [
    {
      icon: Home,
      label: "Home",
      href: "/drivers/dashboard",
    },
    {
      icon: Package,
      label: "Available",
      href: "/drivers/dashboard/available-orders",
    },
    {
      icon: CheckCircle,
      label: "My Orders",
      href: "/drivers/dashboard/my-orders",
    },
    {
      icon: MapPin,
      label: "Route",
      href: "/drivers/dashboard/optimal-route",
    },
    {
      icon: QrCode,
      label: "Check Parcel",
      href: "/drivers/dashboard/check-parcel",
    },
    {
      icon: FileText,
      label: "Documents",
      href: "/drivers/dashboard/my-documents",
    },
    {
      icon: Clock,
      label: "Availability",
      href: "/drivers/dashboard/my-availability",
    },
    {
      icon: ChartBar,
      label: "Performance",
      href: "/drivers/dashboard/my-performance",
    },
    {
      icon: User,
      label: "Profile",
      href: "/drivers/profile",
    },
  ];

  // Animation variants for smooth transitions
  const menuVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.05, delayChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-gray-900">
      {/* Mobile Header - 48px minimum touch target */}
      <header className="sticky top-0 z-40 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-4">
        <div className="flex h-16 items-center justify-between">
          <h1 className="text-lg font-semibold text-gray-900 dark:text-white">Driver Dashboard</h1>
          
          {/* Menu Button with 48x48px touch target */}
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-3 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMenuOpen ? (
              <X className="h-6 w-6 text-gray-700 dark:text-gray-300" />
            ) : (
              <Menu className="h-6 w-6 text-gray-700 dark:text-gray-300" />
            )}
          </button>
        </div>
      </header>

      {/* Mobile Navigation Drawer with Animation */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed inset-0 z-30 bg-white dark:bg-gray-900 pt-16"
          >
            <motion.nav
              variants={menuVariants}
              initial="hidden"
              animate="visible"
              className="p-4 overflow-y-auto h-full"
            >
              <div className="space-y-2 pb-16">
                {menuItems.map((item) => (
                  <motion.div key={item.href} variants={itemVariants}>
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors",
                        pathname === item.href
                          ? "bg-primary/10 text-primary dark:bg-primary/20"
                          : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                      )}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <item.icon className="h-5 w-5" />
                      {item.label}
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content Area with Micro-Interactions */}
      <main className="flex-1 px-4 pt-4 pb-16 overflow-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            className="container mx-auto max-w-md"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Bottom Navigation Bar - 5 Key Actions */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
        <div className="grid grid-cols-5 h-16">
          {menuItems.slice(0, 5).map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center px-2 transition-colors",
                pathname === item.href
                  ? "text-primary"
                  : "text-gray-500 dark:text-gray-400"
              )}
              aria-label={item.label}
            >
              <item.icon className="h-5 w-5 mb-1" />
              <span className="text-xs truncate">{item.label}</span>
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
}