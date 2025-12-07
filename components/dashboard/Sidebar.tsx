"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { LogOut, LayoutDashboard, Truck, Building2, Calendar, MessageSquare, BarChart3, Settings, HelpCircle, FileText, Package, Users, MapPin } from "lucide-react";
import { signOut } from "next-auth/react";

interface SidebarItem {
    icon: React.ElementType;
    label: string;
    href: string;
    badge?: number;
}

interface DashboardSidebarProps {
    items: SidebarItem[];
    logoutUrl?: string;
    className?: string;
}

export function DashboardSidebar({ items, logoutUrl = "/api/auth/signout", className }: DashboardSidebarProps) {
    const pathname = usePathname();

    return (
        <aside className={cn(
            "w-72 bg-white dark:bg-slate-900 h-screen fixed left-0 top-0 border-r border-slate-100 dark:border-slate-800 flex flex-col p-6 z-40 hidden lg:flex",
            className
        )}>
            {/* Logo Area */}
            <div className="mb-10 px-2">
                <Link href="/" className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center">
                        <Truck className="h-5 w-5 text-white" />
                    </div>
                    <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                        TawsilGo
                    </span>
                </Link>
            </div>

            {/* Navigation */}
            <nav className="flex-1 space-y-1">
                {items.map((item) => {
                    const isActive = pathname === item.href || pathname?.startsWith(item.href + "/");
                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-medium transition-all duration-200 group relative",
                                isActive
                                    ? "bg-blue-600 text-white shadow-lg shadow-blue-200 dark:shadow-blue-900/20"
                                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100"
                            )}
                        >
                            <Icon className={cn("h-5 w-5", isActive ? "text-white" : "text-slate-400 group-hover:text-slate-600")} />
                            <span>{item.label}</span>
                            {item.badge && (
                                <span className={cn(
                                    "ml-auto text-xs py-0.5 px-2 rounded-full",
                                    isActive ? "bg-white/20 text-white" : "bg-blue-100 text-blue-600"
                                )}>
                                    {item.badge}
                                </span>
                            )}
                        </Link>
                    );
                })}
            </nav>

            {/* Bottom Actions */}
            <div className="pt-6 border-t border-slate-100 dark:border-slate-800 space-y-1">
                <Link
                    href="/settings"
                    className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                >
                    <Settings className="h-5 w-5 text-slate-400" />
                    <span>Settings</span>
                </Link>
                <button
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium text-red-500 hover:bg-red-50 hover:text-red-600 transition-colors"
                >
                    <LogOut className="h-5 w-5 opacity-70" />
                    <span>Log out</span>
                </button>
            </div>
        </aside>
    );
}

// Default items for Admin
export const adminNavItems: SidebarItem[] = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/admin" },
    { icon: Truck, label: "Drivers", href: "/admin/drivers" },
    { icon: Building2, label: "Organizations", href: "/admin/organizations" },
    { icon: Calendar, label: "Schedule", href: "/admin/schedule" },
    { icon: MessageSquare, label: "Messages", href: "/admin/messages", badge: 2 },
    { icon: BarChart3, label: "Analytics", href: "/admin/analytics" },
    { icon: FileText, label: "Reports", href: "/admin/reports" },
    { icon: HelpCircle, label: "Support", href: "/admin/support" },
];

export const driverNavItems: SidebarItem[] = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/drivers/dashboard" },
    { icon: MapPin, label: "My Trips", href: "/drivers/dashboard/trips" },
    { icon: Package, label: "My Orders", href: "/drivers/dashboard/my-orders" },
    { icon: MessageSquare, label: "Messages", href: "/drivers/dashboard/messages", badge: 1 },
    { icon: Truck, label: "My Vehicle", href: "/drivers/dashboard/vehicle" },
    { icon: BarChart3, label: "Performance", href: "/drivers/dashboard/my-performance" },
    { icon: FileText, label: "My Documents", href: "/drivers/dashboard/my-documents" },
    { icon: HelpCircle, label: "Support", href: "/drivers/dashboard/support" },
];

export const organizationNavItems: SidebarItem[] = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/organizations" },
    { icon: Truck, label: "Fleet", href: "/organizations/fleet" },
    { icon: Users, label: "Drivers", href: "/organizations/fleet/drivers" },
    { icon: Calendar, label: "Trips", href: "/organizations/trips" },
    { icon: BarChart3, label: "Analytics", href: "/organizations/analytics" },
    { icon: Settings, label: "Settings", href: "/organizations/profile" },
];
