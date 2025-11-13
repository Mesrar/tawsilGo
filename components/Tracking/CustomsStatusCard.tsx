"use client";

import { motion } from "framer-motion";
import {
  Shield,
  CheckCircle2,
  Clock,
  AlertCircle,
  HelpCircle,
  ExternalLink,
  CreditCard,
  FileText,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import type { CustomsInfo, ParcelStatus } from "@/types/booking";
import Link from "next/link";

interface CustomsStatusCardProps {
  customsInfo: CustomsInfo;
  onPayDuty?: () => void;
  onUploadDocuments?: () => void;
}

export function CustomsStatusCard({
  customsInfo,
  onPayDuty,
  onUploadDocuments,
}: CustomsStatusCardProps) {
  const { stage, status, submittedAt, estimatedClearanceTime, dutyInfo, documents, delayReason } = customsInfo;

  // Determine customs stage display
  const stageConfig = {
    EU_EXIT: {
      title: "EU Export Customs",
      location: "France/Spain Border",
      description: "Package clearing European Union customs",
    },
    MA_ENTRY: {
      title: "Morocco Import Customs",
      location: "Tangier/Casablanca Port",
      description: "Package clearing Moroccan customs",
    },
  };

  const currentStage = stageConfig[stage];

  // Status configuration
  const getStatusConfig = () => {
    if (status === "CUSTOMS_CLEARED_EU" || status === "CUSTOMS_CLEARED_MA") {
      return {
        icon: CheckCircle2,
        color: "text-green-600 dark:text-green-400",
        bgColor: "bg-green-50 dark:bg-green-900/20",
        badge: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
        text: "Cleared",
        progress: 100,
      };
    }

    if (status === "CUSTOMS_HELD_EU" || status === "CUSTOMS_HELD_MA" || status === "DUTY_PAYMENT_PENDING") {
      return {
        icon: AlertCircle,
        color: "text-amber-600 dark:text-amber-400",
        bgColor: "bg-amber-50 dark:bg-amber-900/20",
        badge: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
        text: status === "DUTY_PAYMENT_PENDING" ? "Payment Required" : "Action Needed",
        progress: 50,
      };
    }

    if (status === "CUSTOMS_INSPECTION_EU" || status === "CUSTOMS_INSPECTION_MA") {
      return {
        icon: Shield,
        color: "text-blue-600 dark:text-blue-400",
        bgColor: "bg-blue-50 dark:bg-blue-900/20",
        badge: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
        text: "Under Inspection",
        progress: 60,
      };
    }

    // Submitted/Processing
    return {
      icon: Clock,
      color: "text-moroccan-mint",
      bgColor: "bg-moroccan-mint/10",
      badge: "bg-moroccan-mint/10 text-moroccan-mint-700",
      text: "Processing",
      progress: 30,
    };
  };

  const statusConfig = getStatusConfig();
  const StatusIcon = statusConfig.icon;

  // Calculate time in customs
  const getTimeInCustoms = () => {
    if (!submittedAt) return null;
    const submitted = new Date(submittedAt);
    const now = new Date();
    const hours = Math.floor((now.getTime() - submitted.getTime()) / 3600000);

    if (hours < 1) return "Less than 1 hour";
    if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''}`;
    const days = Math.floor(hours / 24);
    return `${days} day${days > 1 ? 's' : ''} ${hours % 24} hours`;
  };

  const timeInCustoms = getTimeInCustoms();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
    >
      <Card className="border-2">
        <CardContent className="p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-start gap-3">
              <div className={cn("rounded-full p-2", statusConfig.bgColor)}>
                <StatusIcon className={cn("h-5 w-5", statusConfig.color)} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  {currentStage.title}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {currentStage.location}
                </p>
              </div>
            </div>
            <Badge className={statusConfig.badge}>{statusConfig.text}</Badge>
          </div>

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
                Clearance Progress
              </span>
              <span className="text-xs font-bold text-slate-900 dark:text-white">
                {statusConfig.progress}%
              </span>
            </div>
            <Progress value={statusConfig.progress} className="h-2" />
          </div>

          {/* Timeline Info */}
          {submittedAt && (
            <div className="grid grid-cols-2 gap-4 mb-6 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
              <div>
                <p className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                  Time in Customs
                </p>
                <p className="text-sm font-bold text-slate-900 dark:text-white">
                  {timeInCustoms}
                </p>
              </div>
              <div>
                <p className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                  Expected Duration
                </p>
                <p className="text-sm font-bold text-slate-900 dark:text-white">
                  {estimatedClearanceTime || "12-48 hours"}
                </p>
              </div>
            </div>
          )}

          {/* Duty Payment Section */}
          {dutyInfo && dutyInfo.paymentStatus === "PENDING" && (
            <Alert className="mb-6 border-amber-200 dark:border-amber-900 bg-amber-50 dark:bg-amber-900/20">
              <CreditCard className="h-4 w-4 text-amber-600" />
              <AlertDescription>
                <div className="flex flex-col gap-3">
                  <div>
                    <p className="font-semibold text-amber-900 dark:text-amber-200 mb-2">
                      Customs Duty Payment Required
                    </p>
                    <div className="space-y-1 text-sm text-amber-800 dark:text-amber-300">
                      <div className="flex justify-between">
                        <span>Item Value:</span>
                        <span className="font-medium">
                          €{dutyInfo.breakdown.itemValue.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Import Duty ({(dutyInfo.breakdown.dutyRate * 100).toFixed(1)}%):</span>
                        <span className="font-medium">
                          {dutyInfo.currency} {dutyInfo.breakdown.dutyAmount.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>VAT (20%):</span>
                        <span className="font-medium">
                          {dutyInfo.currency} {dutyInfo.breakdown.vat.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Processing Fee:</span>
                        <span className="font-medium">
                          {dutyInfo.currency} {dutyInfo.breakdown.processingFee.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between pt-2 border-t border-amber-300 dark:border-amber-800">
                        <span className="font-bold">Total Due:</span>
                        <span className="font-bold text-lg">
                          {dutyInfo.currency} {dutyInfo.amount.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      onClick={onPayDuty}
                      className="flex-1 bg-moroccan-mint hover:bg-moroccan-mint-600"
                    >
                      <CreditCard className="h-4 w-4 mr-2" />
                      Pay Now (€{(dutyInfo.amount + 5).toFixed(2)})
                    </Button>
                    <Button variant="outline" className="flex-1" asChild>
                      <Link href="/services/specialized#customs">
                        Learn More
                      </Link>
                    </Button>
                  </div>

                  <p className="text-xs text-amber-700 dark:text-amber-400">
                    💡 Pay through TawsilGo for instant processing (+€5 convenience fee) or pay directly at customs (2-5 days delay)
                  </p>
                </div>
              </AlertDescription>
            </Alert>
          )}

          {/* Duty Paid Confirmation */}
          {dutyInfo && dutyInfo.paymentStatus === "PAID" && (
            <Alert className="mb-6 border-green-200 dark:border-green-900 bg-green-50 dark:bg-green-900/20">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800 dark:text-green-300">
                <p className="font-semibold mb-1">Customs Duty Paid</p>
                <p className="text-sm">
                  Payment of {dutyInfo.currency} {dutyInfo.amount.toFixed(2)} received.
                  Package will be released within 4 hours.
                </p>
              </AlertDescription>
            </Alert>
          )}

          {/* Document Status */}
          {documents && documents.length > 0 && (
            <div className="mb-6">
              <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">
                Required Documents
              </h4>
              <div className="space-y-2">
                {documents.map((doc, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg"
                  >
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-slate-400" />
                      <span className="text-sm text-slate-700 dark:text-slate-300">
                        {doc.name}
                      </span>
                    </div>
                    <Badge
                      variant={doc.status === "APPROVED" ? "default" : "secondary"}
                      className={cn(
                        doc.status === "APPROVED" && "bg-green-100 text-green-700",
                        doc.status === "PENDING" && "bg-amber-100 text-amber-700",
                        doc.status === "REJECTED" && "bg-red-100 text-red-700"
                      )}
                    >
                      {doc.status}
                    </Badge>
                  </div>
                ))}
              </div>

              {documents.some(d => d.status === "PENDING" || d.status === "REJECTED") && (
                <Button
                  onClick={onUploadDocuments}
                  variant="outline"
                  className="w-full mt-3"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Upload Missing Documents
                </Button>
              )}
            </div>
          )}

          {/* Delay Reason */}
          {delayReason && (
            <Alert className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <p className="font-semibold text-slate-900 dark:text-white mb-1">
                  Customs Delay
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {delayReason}
                </p>
              </AlertDescription>
            </Alert>
          )}

          {/* What's Happening Explanation */}
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-900">
            <div className="flex items-start gap-2 mb-3">
              <HelpCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-blue-900 dark:text-blue-200 mb-1">
                  What's Happening Now?
                </p>
                <p className="text-sm text-blue-800 dark:text-blue-300">
                  {status === "CUSTOMS_SUBMITTED_EU" || status === "CUSTOMS_SUBMITTED_MA" ? (
                    <>
                      {stage === "EU_EXIT"
                        ? "EU customs is reviewing your package's export documentation. This is required for all international shipments."
                        : "Morocco customs is assessing your package's declared value and contents. Duty may apply for items over MAD 1,250 (~€115)."}
                    </>
                  ) : status === "CUSTOMS_INSPECTION_EU" || status === "CUSTOMS_INSPECTION_MA" ? (
                    "Your package has been selected for physical inspection. This is routine for cross-border shipments and helps ensure compliance."
                  ) : status === "CUSTOMS_CLEARED_EU" || status === "CUSTOMS_CLEARED_MA" ? (
                    "✅ All customs requirements met! Your package has been cleared and will continue its journey."
                  ) : status === "DUTY_PAYMENT_PENDING" ? (
                    "Morocco customs has assessed import duty on your package. Payment is required to release it for delivery."
                  ) : (
                    "Your package is being held pending additional information or payment. Check requirements above."
                  )}
                </p>
              </div>
            </div>

            <Link
              href="/services/specialized#customs-guide"
              className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
            >
              Learn about {stage === "EU_EXIT" ? "EU export" : "Morocco customs"} process
              <ExternalLink className="h-3 w-3" />
            </Link>
          </div>

          {/* Typical Timeline */}
          <div className="mt-6 pt-6 border-t">
            <p className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-3">
              Typical {stage === "EU_EXIT" ? "EU Export" : "Morocco Import"} Timeline
            </p>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-lg font-bold text-green-600">60%</p>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Clear in 6-12h
                </p>
              </div>
              <div>
                <p className="text-lg font-bold text-amber-600">35%</p>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Clear in 12-48h
                </p>
              </div>
              <div>
                <p className="text-lg font-bold text-red-600">5%</p>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Require action
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
