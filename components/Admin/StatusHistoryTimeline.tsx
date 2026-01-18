"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  CheckCircle2,
  XCircle,
  UserCheck,
  UserX,
  FileCheck,
  FileX,
  Plus,
  Clock,
  User,
} from "lucide-react";
import { StatusHistoryEntry } from "@/lib/api/admin-service";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface StatusHistoryTimelineProps {
  history: StatusHistoryEntry[];
  isLoading?: boolean;
}

const getActionConfig = (actionType: StatusHistoryEntry["action_type"]) => {
  switch (actionType) {
    case "verified":
      return {
        icon: UserCheck,
        color: "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400",
        lineColor: "bg-green-400",
        label: "Verified",
      };
    case "unverified":
      return {
        icon: UserX,
        color: "bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400",
        lineColor: "bg-yellow-400",
        label: "Unverified",
      };
    case "activated":
      return {
        icon: CheckCircle2,
        color: "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400",
        lineColor: "bg-green-400",
        label: "Activated",
      };
    case "deactivated":
      return {
        icon: XCircle,
        color: "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400",
        lineColor: "bg-red-400",
        label: "Deactivated",
      };
    case "document_approved":
      return {
        icon: FileCheck,
        color: "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400",
        lineColor: "bg-green-400",
        label: "Document Approved",
      };
    case "document_rejected":
      return {
        icon: FileX,
        color: "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400",
        lineColor: "bg-red-400",
        label: "Document Rejected",
      };
    case "created":
    default:
      return {
        icon: Plus,
        color: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
        lineColor: "bg-blue-400",
        label: "Created",
      };
  }
};

export function StatusHistoryTimeline({
  history,
  isLoading = false,
}: StatusHistoryTimelineProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Status History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex gap-3 animate-pulse">
                <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-24" />
                  <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-full" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (history.length === 0) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Status History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-slate-500 text-center py-4">
            No status history available
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <Clock className="w-4 h-4" />
          Status History
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-0">
          {history.map((entry, index) => {
            const config = getActionConfig(entry.action_type);
            const Icon = config.icon;
            const isLast = index === history.length - 1;
            const timestamp = new Date(entry.timestamp);

            return (
              <div key={entry.id} className="relative">
                {/* Connecting line */}
                {!isLast && (
                  <div
                    className={cn(
                      "absolute left-[15px] top-[32px] bottom-0 w-0.5 -mb-1",
                      config.lineColor
                    )}
                  />
                )}

                <div className="flex gap-3 pb-4">
                  {/* Icon */}
                  <div
                    className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
                      config.color
                    )}
                  >
                    <Icon className="w-4 h-4" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-medium text-slate-900 dark:text-white">
                        {config.label}
                      </p>
                      <span className="text-xs text-slate-500 whitespace-nowrap">
                        {format(timestamp, "MMM d, HH:mm")}
                      </span>
                    </div>

                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-0.5">
                      {entry.new_value}
                    </p>

                    {entry.admin_name && (
                      <div className="flex items-center gap-1 mt-1 text-xs text-slate-500">
                        <User className="w-3 h-3" />
                        <span>{entry.admin_name}</span>
                      </div>
                    )}

                    {entry.notes && (
                      <div className="mt-2 p-2 bg-slate-50 dark:bg-slate-800 rounded text-xs text-slate-600 dark:text-slate-400">
                        {entry.notes}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
