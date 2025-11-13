"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { QrCode, MapPin, FileText, Clock, Package } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const actions = [
  {
    icon: Package,
    label: "Available Orders",
    href: "/drivers/dashboard/available-orders",
    color: "text-blue-600 bg-blue-100 dark:bg-blue-950/30 hover:bg-blue-200 dark:hover:bg-blue-900/40",
  },
  {
    icon: QrCode,
    label: "Scan Parcel",
    href: "/drivers/dashboard/check-parcel",
    color: "text-purple-600 bg-purple-100 dark:bg-purple-950/30 hover:bg-purple-200 dark:hover:bg-purple-900/40",
  },
  {
    icon: MapPin,
    label: "My Trips",
    href: "/drivers/dashboard/trips",
    color: "text-emerald-600 bg-emerald-100 dark:bg-emerald-950/30 hover:bg-emerald-200 dark:hover:bg-emerald-900/40",
  },
  {
    icon: FileText,
    label: "Documents",
    href: "/drivers/dashboard/my-documents",
    color: "text-amber-600 bg-amber-100 dark:bg-amber-950/30 hover:bg-amber-200 dark:hover:bg-amber-900/40",
  },
];

interface QuickActionsProps {
  className?: string;
}

export function QuickActions({ className }: QuickActionsProps) {
  return (
    <Card className={className}>
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {actions.map((action) => (
            <Link key={action.href} href={action.href}>
              <Button
                variant="outline"
                className={cn(
                  "h-auto w-full flex-col gap-2 p-4 transition-all",
                  action.color
                )}
              >
                <action.icon className="h-6 w-6" />
                <span className="text-xs font-medium">{action.label}</span>
              </Button>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
