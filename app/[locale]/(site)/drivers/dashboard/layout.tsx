"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  FileText,
  Clock,
  Menu,
  QrCode,
  TicketCheck,
  TrendingUp,
  Truck,
} from "lucide-react";
import { cn } from "@/lib/utils";
import React from "react"; // Added import for React
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { AnimatePresence, motion } from "framer-motion";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { UserDropdown } from "@/components/Header/user-dropdown";
import ThemeToggler from "@/components/Header/ThemeToggler";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { DriverBottomNav } from "@/components/Driver/DriverBottomNav";
import { Separator } from "@/components/ui/separator";

const menuItems = [
  // Primary Actions (Frequent Use)
  {
    icon: Truck,
    label: "My Trips",
    href: "/drivers/dashboard/trips",
  },
  {
    icon: TicketCheck,
    label: "Available Orders",
    href: "/drivers/dashboard/available-orders",
  },
  {
    icon: QrCode,
    label: "Scan Parcel",
    href: "/drivers/dashboard/check-parcel",
  },
  // Secondary Actions (Management)
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
    icon: TrendingUp,
    label: "Performance",
    href: "/drivers/dashboard/my-performance",
  },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const queryClient = new QueryClient();

  const Sidebar = () => (
    <ScrollArea className="h-full py-6">
      <h2 className="mb-4 px-6 text-lg font-semibold tracking-tight">
        Driver Dashboard
      </h2>
      <nav className="space-y-1 px-3">
        {menuItems.map((item, index) => (
          <React.Fragment key={item.href}>
            {/* Add separator before secondary actions (index 3) */}
            {index === 3 && (
              <Separator className="my-3" />
            )}
            <Link
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                pathname === item.href
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground"
              )}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          </React.Fragment>
        ))}
      </nav>
    </ScrollArea>
  );

  return (
    <QueryClientProvider client={queryClient}>
      <section className="py-10">
        <header className="fixed top-0 left-0 right-0 z-30 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container flex h-16 items-center justify-between py-4">
            {/* Left: Mobile menu + Logo */}
            <div className="flex items-center gap-4">
              <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon" className="md:hidden">
                    <Menu className="h-6 w-6" />
                    <span className="sr-only">Toggle Menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[240px] sm:w-[300px]">
                  <Sidebar />
                </SheetContent>
              </Sheet>

              <Link href="/" className="flex items-center">
                <Image
                  src="/images/logo/logo-light.png"
                  alt="TawsilGo"
                  width={180}
                  height={100}
                  className="h-10 md:h-12 w-auto dark:hidden"
                  priority
                />
                <Image
                  src="/images/logo/logo-dark.png"
                  alt="TawsilGo"
                  width={180}
                  height={100}
                  className="hidden h-10 md:h-12 w-auto dark:block"
                  priority
                />
              </Link>
            </div>

            {/* Right: Theme, Language, User */}
            <div className="flex items-center gap-2">
              <LanguageSwitcher />
              <ThemeToggler />
              {session?.user && <UserDropdown user={session.user} />}
            </div>
          </div>
        </header>
        <div className="container flex-1 items-start md:grid md:grid-cols-[240px_minmax(0,1fr)] md:gap-6 lg:grid-cols-[280px_minmax(0,1fr)] lg:gap-10 pt-16">
          <aside className="fixed top-[80px] z-20 -ml-2 hidden h-[calc(100vh-96px)] w-full shrink-0 overflow-y-auto border-r md:sticky md:block">
            <ScrollArea className="py-6 pr-6 lg:py-8">
              <Sidebar />
            </ScrollArea>
          </aside>
          <main className="flex w-full flex-col overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={pathname}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.3 }}
                className="flex-1 space-y-4 p-8 pt-6 pb-24 md:pb-8"
              >
                {children}
              </motion.div>
            </AnimatePresence>
          </main>
        </div>

        {/* Mobile Bottom Navigation */}
        <DriverBottomNav />
      </section>
    </QueryClientProvider>
  );
}
