"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  Shield,
  FileText,
  CheckCircle2,
  Clock,
  AlertTriangle,
  XCircle,
  Eye,
  Download,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";

type CustomsStatus =
  | "PENDING"
  | "DOCUMENTS_SUBMITTED"
  | "UNDER_REVIEW"
  | "CLEARED"
  | "HOLD"
  | "REJECTED";

interface ParcelCustomsInfo {
  parcelId: string;
  trackingNumber: string;
  status: CustomsStatus;
  lastUpdated: string;
  estimatedClearanceTime?: string;
  documentsMissing?: string[];
  holdReason?: string;
  customsOffice?: string;
  dutyAmount?: number;
  dutyCurrency?: string;
}

interface CustomsStatusTrackerProps {
  parcels?: ParcelCustomsInfo[];
  tripId?: string;
  className?: string;
}

const statusConfig: Record<CustomsStatus, {
  label: string;
  icon: React.ElementType;
  color: string;
  bgColor: string;
  variant: "default" | "secondary" | "destructive" | "outline";
}> = {
  PENDING: {
    label: "Pending",
    icon: Clock,
    color: "text-gray-600",
    bgColor: "bg-gray-100 dark:bg-gray-800",
    variant: "secondary",
  },
  DOCUMENTS_SUBMITTED: {
    label: "Documents Submitted",
    icon: FileText,
    color: "text-blue-600",
    bgColor: "bg-blue-100 dark:bg-blue-900",
    variant: "outline",
  },
  UNDER_REVIEW: {
    label: "Under Review",
    icon: Eye,
    color: "text-yellow-600",
    bgColor: "bg-yellow-100 dark:bg-yellow-900",
    variant: "outline",
  },
  CLEARED: {
    label: "Cleared",
    icon: CheckCircle2,
    color: "text-green-600",
    bgColor: "bg-green-100 dark:bg-green-900",
    variant: "outline",
  },
  HOLD: {
    label: "On Hold",
    icon: AlertTriangle,
    color: "text-orange-600",
    bgColor: "bg-orange-100 dark:bg-orange-900",
    variant: "destructive",
  },
  REJECTED: {
    label: "Rejected",
    icon: XCircle,
    color: "text-red-600",
    bgColor: "bg-red-100 dark:bg-red-900",
    variant: "destructive",
  },
};

export function CustomsStatusTracker({
  parcels = [],
  tripId,
  className
}: CustomsStatusTrackerProps) {
  // Calculate summary statistics
  const summary = parcels.reduce(
    (acc, parcel) => {
      acc[parcel.status] = (acc[parcel.status] || 0) + 1;
      return acc;
    },
    {} as Record<CustomsStatus, number>
  );

  const totalParcels = parcels.length;
  const clearedParcels = summary.CLEARED || 0;
  const onHoldParcels = summary.HOLD || 0;
  const clearanceRate = totalParcels > 0 ? (clearedParcels / totalParcels) * 100 : 0;

  const getStatusConfig = (status: CustomsStatus) => statusConfig[status];

  return (
    <Card className={cn("border-2", className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            <CardTitle>Customs Status</CardTitle>
          </div>
          <Badge variant="outline" className="font-mono">
            {clearedParcels}/{totalParcels} cleared
          </Badge>
        </div>
        <CardDescription>Track customs clearance for all parcels</CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Summary Progress */}
        {totalParcels > 0 && (
          <div className="space-y-3">
            <div className="flex items-baseline justify-between">
              <span className="text-sm text-muted-foreground">Clearance Progress</span>
              <span className="text-lg font-semibold">{Math.round(clearanceRate)}%</span>
            </div>
            <Progress value={clearanceRate} className="h-2" />
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>{clearedParcels} cleared</span>
              <span>{totalParcels - clearedParcels} pending</span>
            </div>
          </div>
        )}

        {/* Status Summary Grid */}
        {totalParcels > 0 && (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {(Object.keys(statusConfig) as CustomsStatus[]).map((status) => {
                const count = summary[status] || 0;
                if (count === 0) return null;

                const config = getStatusConfig(status);
                const Icon = config.icon;

                return (
                  <div
                    key={status}
                    className={cn(
                      "rounded-lg border p-3 text-center",
                      config.bgColor
                    )}
                  >
                    <div className="flex items-center justify-center mb-1">
                      <Icon className={cn("h-5 w-5", config.color)} />
                    </div>
                    <p className="text-2xl font-bold">{count}</p>
                    <p className="text-xs text-muted-foreground">{config.label}</p>
                  </div>
                );
              })}
            </div>

            <Separator />
          </>
        )}

        {/* Alerts for Issues */}
        {onHoldParcels > 0 && (
          <div className="rounded-lg border-2 border-orange-500 bg-orange-50 dark:bg-orange-950 p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-orange-600 mt-0.5" />
              <div className="flex-1">
                <h4 className="font-semibold text-orange-900 dark:text-orange-100">
                  {onHoldParcels} Parcel{onHoldParcels > 1 ? 's' : ''} on Hold
                </h4>
                <p className="text-sm text-orange-800 dark:text-orange-200 mt-1">
                  Action required: Review customs documentation
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Parcel List */}
        {parcels.length > 0 ? (
          <div className="space-y-3">
            <h4 className="text-sm font-semibold">Parcel Details</h4>
            <div className="space-y-2 max-h-[400px] overflow-y-auto">
              {parcels.map((parcel) => {
                const config = getStatusConfig(parcel.status);
                const Icon = config.icon;

                return (
                  <div
                    key={parcel.parcelId}
                    className="rounded-lg border p-3 hover:bg-accent transition-colors"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-sm font-semibold">
                            {parcel.trackingNumber}
                          </span>
                          <Badge variant={config.variant} className="text-xs">
                            <Icon className="h-3 w-3 mr-1" />
                            {config.label}
                          </Badge>
                        </div>

                        {parcel.customsOffice && (
                          <p className="text-xs text-muted-foreground">
                            📍 {parcel.customsOffice}
                          </p>
                        )}

                        {parcel.estimatedClearanceTime && parcel.status !== "CLEARED" && (
                          <p className="text-xs text-muted-foreground">
                            ⏱️ Est. clearance:{" "}
                            {formatDistanceToNow(new Date(parcel.estimatedClearanceTime), {
                              addSuffix: true,
                            })}
                          </p>
                        )}

                        {parcel.documentsMissing && parcel.documentsMissing.length > 0 && (
                          <div className="text-xs text-orange-600 dark:text-orange-400">
                            ⚠️ Missing: {parcel.documentsMissing.join(", ")}
                          </div>
                        )}

                        {parcel.holdReason && (
                          <div className="text-xs text-red-600 dark:text-red-400">
                            🚫 {parcel.holdReason}
                          </div>
                        )}

                        {parcel.dutyAmount && (
                          <div className="text-xs font-semibold">
                            💰 Duty: {parcel.dutyCurrency} {parcel.dutyAmount.toFixed(2)}
                          </div>
                        )}

                        <p className="text-xs text-muted-foreground">
                          Updated {formatDistanceToNow(new Date(parcel.lastUpdated), { addSuffix: true })}
                        </p>
                      </div>

                      {parcel.status === "HOLD" && (
                        <Button size="sm" variant="outline">
                          <FileText className="h-3 w-3 mr-1" />
                          Fix
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Shield className="h-12 w-12 text-muted-foreground/50 mb-3" />
            <p className="text-sm text-muted-foreground">No parcels to track</p>
            <p className="text-xs text-muted-foreground mt-1">
              Customs status will appear when parcels are assigned
            </p>
          </div>
        )}

        {/* Action Buttons */}
        {totalParcels > 0 && (
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="flex-1">
              <Download className="h-3 w-3 mr-2" />
              Export Report
            </Button>
            <Button variant="outline" size="sm" className="flex-1">
              <FileText className="h-3 w-3 mr-2" />
              Documents
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
