"use client";

import { ArrowLeft, MoreVertical } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/Status-Bagde/status-badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface TripDetailsHeaderProps {
  tripId: string;
  status: string;
  isMobile?: boolean;
}

export function TripDetailsHeader({ tripId, status, isMobile }: TripDetailsHeaderProps) {
  const shortId = tripId.substring(0, 8);

  return (
    <div className="sticky top-0 z-10 bg-background border-b">
      <div className="container py-3 md:py-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 md:gap-4 min-w-0 flex-1">
            <Button variant="ghost" size={isMobile ? "sm" : "default"} asChild>
              <Link href="/drivers/dashboard/trips">
                <ArrowLeft className="h-4 w-4" />
                {!isMobile && <span className="ml-2">Back</span>}
              </Link>
            </Button>

            <div className="min-w-0 flex-1">
              <h1 className="text-lg md:text-2xl font-bold truncate">
                {isMobile ? `Trip #${shortId}` : "Trip Details"}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <StatusBadge status={status} />

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>View in Calendar</DropdownMenuItem>
                <DropdownMenuItem>Share Trip</DropdownMenuItem>
                <DropdownMenuItem>Export Details</DropdownMenuItem>
                <DropdownMenuItem className="text-red-600">Cancel Trip</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </div>
  );
}
