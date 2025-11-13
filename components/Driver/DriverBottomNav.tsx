"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Package, QrCode, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface BottomNavItem {
  id: string;
  label: string;
  icon: React.ElementType;
  path: string;
  badge?: number;
}

const navItems: BottomNavItem[] = [
  {
    id: "dashboard",
    label: "Home",
    icon: Home,
    path: "/drivers/dashboard",
  },
  {
    id: "orders",
    label: "Orders",
    icon: Package,
    path: "/drivers/dashboard/available-orders",
  },
  {
    id: "scan",
    label: "Scan",
    icon: QrCode,
    path: "/drivers/dashboard/check-parcel",
  },
  {
    id: "profile",
    label: "Profile",
    icon: User,
    path: "/drivers/dashboard/my-performance",
  },
];

interface DriverBottomNavProps {
  orderCount?: number;
}

export function DriverBottomNav({ orderCount }: DriverBottomNavProps) {
  const pathname = usePathname();

  const isActive = (path: string) => {
    if (path === "/drivers/dashboard") {
      return pathname === path;
    }
    return pathname?.startsWith(path);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 md:hidden">
      <div className="flex h-16 items-center justify-around px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          const showBadge = item.id === "orders" && orderCount && orderCount > 0;

          return (
            <Link
              key={item.id}
              href={item.path}
              className={cn(
                "flex min-w-[64px] flex-col items-center justify-center gap-1 rounded-lg px-3 py-2 text-xs font-medium transition-colors",
                "hover:bg-accent hover:text-accent-foreground",
                "active:scale-95",
                active
                  ? "text-primary"
                  : "text-muted-foreground"
              )}
            >
              <div className="relative">
                <Icon
                  className={cn(
                    "h-6 w-6",
                    active && "stroke-[2.5px]"
                  )}
                />
                {showBadge && (
                  <Badge
                    variant="destructive"
                    className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full p-0 text-[10px]"
                  >
                    {orderCount > 99 ? "99+" : orderCount}
                  </Badge>
                )}
              </div>
              <span className={cn(
                "truncate",
                active && "font-semibold"
              )}>
                {item.label}
              </span>
              {active && (
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-primary" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
