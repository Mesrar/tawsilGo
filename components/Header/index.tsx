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
  const [activeTab, setActiveTab] = useState("home");
  const [openSubmenu, setOpenSubmenu] = React.useState<string | null>(null);
  const { data: session, status } = useSession();
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const isAuthenticated = Boolean(session);

  // Get translated menu data
  const menuData = React.useMemo(() => getMenuData(t), [t]);

  // Detect if we're in a booking/payment flow
  const isBookingFlow = pathname?.includes('/booking') ||
                        pathname?.includes('/payment') ||
                        pathname?.includes('/users/book');

  // Hide bottom nav during multi-step flows, but keep it on the initial booking page
  const shouldHideBottomNav = isBookingFlow && !pathname?.endsWith('/booking');

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
          "fixed left-0 top-0 z-40 w-full py-3 md:py-4 transition-all duration-300",
          isScrolled &&
            "bg-background/95 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-background/60"
        )}
      >
        <div className="container mx-auto flex items-center justify-between px-4 md:px-8 2xl:px-0">
          {/* Logo - No background for better blending */}
          <Link href="/" className="flex items-center group">
            <div className="relative p-2 md:p-2.5 rounded-lg hover:shadow-lg transition-shadow duration-200">
              <Image
                src="/images/logo/logo-light.png"
                alt="TawsilGo Logo"
                width={180}
                height={100}
                className="h-12 md:h-16 w-auto dark:hidden"
                priority
              />
              <Image
                src="/images/logo/logo-dark.png"
                alt="TawsilGo Logo"
                width={180}
                height={100}
                className="hidden h-12 md:h-16 w-auto dark:block"
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
                        <NavigationMenuTrigger className="group flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground data-[state=open]:text-foreground lg:text-base">
                          {item.title}
                        </NavigationMenuTrigger>
                        <NavigationMenuContent className="rounded-lg border bg-background p-4 shadow-lg">
                          <div className="grid gap-3 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                            {item.submenu.map((subItem) => (
                              <Link
                                key={subItem.title}
                                href={subItem.path || "#"}
                                className={cn(
                                  "rounded-md p-3 transition-colors hover:bg-accent/70 flex items-center",
                                  pathname === subItem.path &&
                                    "bg-accent/80 text-primary"
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
                          "text-sm font-medium text-muted-foreground transition-colors hover:text-foreground lg:text-base px-2 py-1 rounded-md",
                          pathname === item.path && "text-primary bg-primary/5"
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
            {/* Desktop-only Language Switcher */}
            <div className="hidden md:block">
              <LanguageSwitcher />
            </div>

            {/* Desktop-only Theme Toggler */}
            <div className="hidden md:block">
              <ThemeToggler />
            </div>

            {/* Authentication - Desktop */}
            <div className="hidden md:block">
              {session?.user ? (
                <UserDropdown user={session.user} />
              ) : (
                <Button
                  onClick={() => signIn()}
                  className="rounded-full bg-primary px-5 py-1.5 h-9 font-medium text-primary-foreground hover:bg-primary/90 flex items-center gap-1.5"
                >
                  Get Started
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              )}
            </div>

            {/* Mobile Menu Button - Using Sheet component for better UX */}
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 rounded-full md:hidden"
                  aria-label="Open menu"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>

              <SheetContent side="right" className="w-[85vw] max-w-[350px] p-0">
                <SheetHeader className="sr-only">
                  <SheetTitle>Navigation Menu</SheetTitle>
                </SheetHeader>

                <div className="flex flex-col h-full">
                  {/* Menu Header */}
                  <div className="p-4 border-b border-slate-100 dark:border-slate-800">
                    <div className="flex justify-between items-center mb-6">
                      <Image
                        src="/images/logo/logo-light.svg"
                        alt="TawsilGo Logo"
                        width={120}
                        height={30}
                        className="h-7 w-auto dark:hidden"
                      />
                      <Image
                        src="/images/logo/logo-dark.svg"
                        alt="TawsilGo Logo"
                        width={120}
                        height={30}
                        className="hidden h-7 w-auto dark:block"
                      />
                      <div className="flex items-center gap-2">
                        <LanguageSwitcher />
                        <ThemeToggler />
                      </div>
                    </div>

                    {/* User section */}
                    {isAuthenticated ? (
                      <div className="flex items-center gap-3 bg-accent/50 p-3 rounded-xl">
                        <Avatar className="h-10 w-10 border border-slate-200 dark:border-slate-700">
                          <AvatarImage
                            src={session?.user?.image || ""}
                            alt={session?.user?.name || "User"}
                          />
                          <AvatarFallback>
                            {session?.user?.name?.charAt(0) || "U"}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="font-medium text-sm">
                            {session?.user?.name}
                          </div>
                          <div className="text-xs text-muted-foreground truncate max-w-[200px]">
                            {session?.user?.email}
                          </div>
                        </div>
                        <Link href="/users/profil">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-full"
                          >
                            <Settings className="h-4 w-4" />
                          </Button>
                        </Link>
                      </div>
                    ) : (
                      <div className="flex gap-2">
                        <Button
                          onClick={() => signIn()}
                          className="flex-1 h-12 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90"
                        >
                          Sign In
                        </Button>
                        <Button
                          variant="outline"
                          className="flex-1 h-12 rounded-lg border-slate-200"
                        >
                          Register
                        </Button>
                      </div>
                    )}
                  </div>

                  {/* Main menu items */}
                  <div className="flex-1 overflow-auto py-2">
                    <div className="flex flex-col space-y-1 px-2">
                      {/* Primary Navigation */}
                      {menuData.map((item) => (
                        <div key={item.title} className="py-1 px-2">
                          {item.submenu ? (
                            <div className="space-y-1">
                              <button
                                onClick={() =>
                                  setOpenSubmenu(
                                    openSubmenu === item.title
                                      ? null
                                      : item.title
                                  )
                                }
                                className="flex w-full items-center justify-between rounded-lg p-2 text-left text-sm font-medium hover:bg-accent"
                              >
                                {item.title}
                                <ChevronDown
                                  className={`h-4 w-4 text-slate-400 transition-transform ${openSubmenu === item.title ? "rotate-180" : ""}`}
                                />
                              </button>
                              <AnimatePresence>
                                {openSubmenu === item.title && (
                                  <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                    className="overflow-hidden ml-2"
                                  >
                                    {item.submenu.map((subItem) => (
                                      <Link
                                        key={subItem.title}
                                        href={subItem.path || "#"}
                                        className={cn(
                                          "flex items-center rounded-lg px-3 py-2 text-sm hover:bg-accent",
                                          pathname === subItem.path &&
                                            "bg-accent/80 text-primary font-medium"
                                        )}
                                      >
                                        {subItem.title}
                                        {pathname === subItem.path && (
                                          <div className="ml-auto h-1.5 w-1.5 rounded-full bg-primary" />
                                        )}
                                      </Link>
                                    ))}
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                          ) : (
                            <Link
                              href={item.path || "#"}
                              className={cn(
                                "flex items-center rounded-lg px-3 py-2 text-sm hover:bg-accent",
                                pathname === item.path &&
                                  "bg-accent/80 text-primary font-medium"
                              )}
                            >
                              {item.title}
                              {pathname === item.path && (
                                <div className="ml-auto h-1.5 w-1.5 rounded-full bg-primary" />
                              )}
                            </Link>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Quick Actions Section */}
                    <div className="mt-4 px-4">
                      <p className="mb-2 text-xs font-medium text-slate-500 uppercase px-2">
                        Quick Actions
                      </p>
                      <div className="grid grid-cols-2 gap-2">
                        <Button
                          variant="outline"
                          className="justify-start h-auto py-3 pl-3 pr-3 border-slate-200"
                          asChild
                        >
                          <Link href="/tracking">
                            <Search className="h-4 w-4 mr-2 text-blue-500" />
                            <span className="text-sm">Track Parcel</span>
                          </Link>
                        </Button>
                        <Button
                          variant="outline"
                          className="justify-start h-auto py-3 pl-3 pr-3 border-slate-200"
                          asChild
                        >
                          <Link href="/booking">
                            <Package className="h-4 w-4 mr-2 text-green-500" />
                            <span className="text-sm">Book Shipment</span>
                          </Link>
                        </Button>
                        <Button
                          variant="outline"
                          className="justify-start h-auto py-3 pl-3 pr-3 border-slate-200"
                          asChild
                        >
                          <Link href="/locations">
                            <MapPin className="h-4 w-4 mr-2 text-amber-500" />
                            <span className="text-sm">Locations</span>
                          </Link>
                        </Button>
                        <Button
                          variant="outline"
                          className="justify-start h-auto py-3 pl-3 pr-3 border-slate-200"
                          asChild
                        >
                          <Link href="/support">
                            <Phone className="h-4 w-4 mr-2 text-purple-500" />
                            <span className="text-sm">Contact</span>
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="border-t border-slate-100 dark:border-slate-800 p-4">
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <Link href="/terms" className="hover:underline">
                        Terms of Service
                      </Link>
                      <Link href="/privacy" className="hover:underline">
                        Privacy Policy
                      </Link>
                      <span>© 2025</span>
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </motion.header>

      {/* Mobile Bottom Navigation Bar - Hidden during booking flows to maximize screen space */}
      {!shouldHideBottomNav && (
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-background/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 h-16 px-4">
          <div className="grid grid-cols-4 h-full">
            {mobileMenuTabs.map((tab) => (
              <Link
                key={tab.id}
                href={tab.id === "account" && !isAuthenticated ? "#" : tab.path}
                onClick={(e) => {
                  if (tab.id === "account" && !isAuthenticated) {
                    e.preventDefault();
                    signIn();
                  }
                  setActiveTab(tab.id);
                }}
                className={cn(
                  "flex flex-col items-center justify-center relative",
                  activeTab === tab.id ? "text-primary" : "text-muted-foreground"
                )}
              >
                {tab.id === "account" && session?.user?.image ? (
                  <div className="relative">
                    <Avatar className="h-6 w-6 border border-slate-200 dark:border-slate-700">
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
                      <span className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-background"></span>
                    )}
                  </div>
                ) : (
                  <tab.icon
                    className={cn(
                      "h-5 w-5 mb-1",
                      activeTab === tab.id
                        ? "text-primary"
                        : "text-muted-foreground"
                    )}
                  />
                )}
                <span className="text-xs font-medium">{tab.label}</span>

                {/* Active indicator */}
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="activeTabIndicator"
                    className="absolute -bottom-4 h-1 w-12 bg-primary rounded-t-full"
                    transition={{ type: "spring", duration: 0.5 }}
                  />
                )}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Bottom spacer for mobile - only when nav is visible */}
      {!shouldHideBottomNav && <div className="h-16 md:hidden" />}
    </>
  );
}
