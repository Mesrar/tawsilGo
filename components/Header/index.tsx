"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { getMenuData } from "./menuData";
import { useTranslations } from 'next-intl';
import ThemeToggler from "./ThemeToggler";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { Button } from "../ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "../ui/navigation-menu";
import { useSession, signIn } from "next-auth/react";
import { UserDropdown } from "./user-dropdown";
import {
  ChevronDown,
  X,
  Menu,
  Home,
  Search,
  User,
  Package,
  MapPin,
  Phone,
  ArrowRight,
  Bell,
  Settings,
  MoreHorizontal,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MoreSheet } from "./MoreSheet";

export function Header() {
  // Get pathname early to allow conditional return before other hooks
  const pathname = usePathname();

  // Hide header on dashboard routes for clean, focused experience
  // Keep header visible on registration and public organization pages
  const isOrganizationDashboard = (pathname?.startsWith('/organizations/') ||
    pathname?.includes('/organizations/')) &&
    !pathname?.includes('/organizations/register');
  const isDashboardRoute = pathname?.includes('/drivers/dashboard') || isOrganizationDashboard;

  if (isDashboardRoute) {
    return null;
  }

  const t = useTranslations('navigation');
  const [isScrolled, setIsScrolled] = React.useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [activeTab, setActiveTab] = useState(() => {
    // Initialize based on pathname to avoid hydration mismatch
    if (!pathname) return "home";
    if (pathname === "/") return "home";
    if (pathname.includes("/tracking")) return "tracking";
    if (pathname.includes("/booking")) return "booking";
    if (pathname.includes("/users/profil")) return "account";
    return "home";
  });
  const [openSubmenu, setOpenSubmenu] = React.useState<string | null>(null);
  const { data: session, status } = useSession();
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const isAuthenticated = Boolean(session);
  const [isMounted, setIsMounted] = React.useState(false);

  // Get translated menu data
  const menuData = React.useMemo(() => getMenuData(t), [t]);

  // Detect if we're in a booking/payment flow
  const isBookingFlow = pathname?.includes('/booking') ||
    pathname?.includes('/payment') ||
    pathname?.includes('/users/book');

  // Hide bottom nav during multi-step flows, but keep it on the initial booking page
  const shouldHideBottomNav = isBookingFlow && !pathname?.endsWith('/booking');

  // Track mounted state to avoid hydration issues
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Scroll handler
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on path change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  // Set active tab based on pathname
  useEffect(() => {
    if (!pathname) return;
    if (pathname === "/") setActiveTab("home");
    else if (pathname.includes("/tracking")) setActiveTab("tracking");
    else if (pathname.includes("/booking")) setActiveTab("booking");
    else if (pathname.includes("/users/profil")) setActiveTab("account");
  }, [pathname]);

  // Click outside handler for mobile menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target as Node)
      ) {
        setIsMobileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Mobile menu tabs configuration
  const mobileMenuTabs = [
    { id: "home", label: t('home'), icon: Home, path: "/" },
    { id: "tracking", label: t('track'), icon: Search, path: "/tracking" },
    { id: "booking", label: t('booking'), icon: Package, path: "/booking" },
    { id: "more", label: t('more'), icon: MoreHorizontal, isSheet: true },
    {
      id: "account",
      label: t('account'),
      icon: User,
      path: isAuthenticated ? "/users/profil" : "#signin",
    },
  ];

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={cn(
          "fixed left-0 top-0 z-40 w-full  transition-all duration-300 bg-white dark:bg-white",
          isScrolled &&
          "shadow-sm backdrop-blur"
        )}
      >
        <div className="container mx-auto flex items-center justify-between px-4 md:px-8 2xl:px-0">
          {/* Logo - Light logo on white background */}
          <Link href="/" className="flex items-center group">
            {/* Mobile Logo (Icon + Text) - Adjusted to match original h-12 + p-2 height */}
            <div className="flex items-center gap-2 md:hidden py-2">
              <div className="relative w-10 h-10">
                <Image
                  src="/images/logo/logo-mobile.png"
                  alt="TawsilGo"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              <span className="font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-moroccan-mint to-moroccan-gold">
                TawsilGo
              </span>
            </div>

            {/* Desktop Logo (Full Wordmark) - Adjusted to match original h-16 + p-2.5 height */}
            <div className="hidden md:block relative w-48 h-16 py-1">
              <Image
                src="/images/logo/logo-desktop.png"
                alt="TawsilGo"
                fill
                className="object-contain object-left rtl:object-right"
                priority
              />
            </div>
          </Link>

          {/* Desktop Navigation - Unchanged but with improved hover states */}
          <nav className="hidden md:block">
            <NavigationMenu>
              <NavigationMenuList className="gap-5 lg:gap-7">
                {menuData.map((item) => (
                  <NavigationMenuItem key={item.title}>
                    {item.submenu ? (
                      <>
                        <NavigationMenuTrigger className="group flex items-center gap-1 text-sm font-medium text-slate-600 hover:text-slate-900 data-[state=open]:text-slate-900 lg:text-base">
                          {item.title}
                        </NavigationMenuTrigger>
                        <NavigationMenuContent className="rounded-lg border border-slate-200 bg-white p-4 shadow-lg">
                          <div className="grid gap-3 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                            {item.submenu.map((subItem) => (
                              <Link
                                key={subItem.title}
                                href={subItem.path || "#"}
                                className={cn(
                                  "rounded-md p-3 transition-colors text-slate-900 hover:bg-slate-100 flex items-center",
                                  pathname === subItem.path &&
                                  "bg-slate-100 text-primary"
                                )}
                              >
                                <div className="text-sm font-medium">
                                  {subItem.title}
                                </div>
                              </Link>
                            ))}
                          </div>
                        </NavigationMenuContent>
                      </>
                    ) : (
                      <Link
                        href={item.path || "#"}
                        className={cn(
                          "text-sm font-medium text-slate-600 transition-colors hover:text-slate-900 lg:text-base px-2 py-1 rounded-md",
                          pathname === item.path && "text-primary bg-slate-100"
                        )}
                      >
                        {item.title}
                      </Link>
                    )}
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>
          </nav>

          {/* Right Section - Optimized for mobile with thumb-friendly layout */}
          <div className="flex items-center gap-3 md:gap-4">
            {/* Language Switcher - Visible on mobile and desktop */}
            <div>
              <LanguageSwitcher />
            </div>

            {/* Theme Toggler - Visible on mobile and desktop */}
            <ThemeToggler />

            {/* Authentication - Desktop */}
            <div className="hidden md:block">
              {session?.user ? (
                <UserDropdown user={session.user} />
              ) : (
                <Button
                  onClick={() => signIn()}
                  className="rounded-full bg-primary px-5 py-1.5 h-9 font-medium text-slate-900 dark:text-slate-900 hover:bg-primary/90 flex items-center gap-1.5"
                >
                  Get Started
                  <ArrowRight className="h-3.5 w-3.5 text-slate-900 dark:text-slate-900" />
                </Button>
              )}
            </div>

          </div>
        </div>
      </motion.header>

      {/* Mobile Bottom Navigation Bar - Hidden during booking flows to maximize screen space */}
      {!shouldHideBottomNav && isMounted && (
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-t border-slate-200/50 dark:border-slate-800/50 h-[calc(4rem+env(safe-area-inset-bottom))] pb-[env(safe-area-inset-bottom)] px-2 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
          <div className="grid grid-cols-5 h-16 items-center">
            {mobileMenuTabs.map((tab) => {
              const isActive = activeTab === tab.id;

              // Handle More tab with Sheet
              if (tab.isSheet) {
                return (
                  <MoreSheet key={tab.id}>
                    <button
                      className={cn(
                        "flex flex-col items-center justify-center h-full w-full relative touch-target transition-all duration-300 bg-transparent border-0 p-0",
                        isActive
                          ? "text-primary font-bold"
                          : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
                      )}
                    >
                      {isActive && (
                        <motion.div
                          layoutId="mobile-nav-active"
                          className="absolute -top-[1px] left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-primary to-transparent shadow-[0_2px_10px_rgba(0,212,170,0.5)]"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                        />
                      )}

                      <div className={cn(
                        "relative p-1.5 rounded-xl transition-all duration-300 mb-1",
                        isActive ? "bg-primary/10 dark:bg-primary/20 translate-y-[-2px]" : ""
                      )}>
                        <tab.icon className={cn("h-6 w-6", isActive && "stroke-[2.5px]")} />
                      </div>

                      <span className={cn(
                        "text-[10px] tracking-wide transition-all duration-300",
                        isActive ? "scale-105" : "font-medium"
                      )}>
                        {tab.label}
                      </span>
                    </button>
                  </MoreSheet>
                );
              }

              // Regular tab with Link
              return (
                <Link
                  key={tab.id}
                  href={tab.id === "account" && !isAuthenticated ? "#" : tab.path!}
                  onClick={(e) => {
                    if (tab.id === "account" && !isAuthenticated) {
                      e.preventDefault();
                      signIn();
                    }
                    setActiveTab(tab.id);
                  }}
                  className={cn(
                    "flex flex-col items-center justify-center relative w-full h-full touch-target transition-all duration-300",
                    isActive ? "text-primary" : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
                  )}
                >
                  {tab.id === "account" && session?.user?.image ? (
                    <div className="relative">
                      <Avatar className={cn("h-7 w-7 border-2 transition-all duration-300", isActive ? "border-primary" : "border-slate-200 dark:border-slate-700")}>
                        <AvatarImage
                          src={session.user.image}
                          alt={session.user.name || "User"}
                        />
                        <AvatarFallback>
                          {session.user.name?.charAt(0) || "U"}
                        </AvatarFallback>
                      </Avatar>
                      {/* Notification dot example */}
                      {isAuthenticated && tab.id === "account" && (
                        <span className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-white dark:ring-slate-900"></span>
                      )}
                    </div>
                  ) : (
                    <div className={cn("relative p-1.5 rounded-xl transition-all duration-300", isActive && "bg-primary/10")}>
                      <tab.icon
                        className={cn(
                          "h-6 w-6 transition-all duration-300",
                          isActive ? "text-primary scale-110" : "text-current"
                        )}
                        strokeWidth={isActive ? 2.5 : 2}
                      />
                    </div>
                  )}
                  <span className={cn("text-[10px] font-medium mt-0.5 transition-all duration-300", isActive ? "text-primary font-bold" : "text-current")}>
                    {tab.label}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* Bottom spacer for mobile - only when nav is visible */}
      {!shouldHideBottomNav && <div className="h-16 md:hidden" />}
    </>
  );
}
