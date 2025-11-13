"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  FileText,
  Download,
  Eye,
  AlertCircle,
  CheckCircle2,
  Clock,
  Upload,
  Plus,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";

type DocumentStatus = "VALID" | "EXPIRING_SOON" | "EXPIRED" | "PENDING";

interface CustomsDocument {
  id: string;
  name: string;
  type: string;
  status: DocumentStatus;
  uploadDate: string;
  expiryDate?: string;
  fileSize: number;
  fileUrl?: string;
  required: boolean;
}

interface CustomsDocumentLibraryProps {
  documents?: CustomsDocument[];
  className?: string;
}

const documentTemplates = [
  { name: "Commercial Invoice", type: "invoice", required: true },
  { name: "Certificate of Origin", type: "certificate", required: true },
  { name: "Packing List", type: "packing_list", required: true },
  { name: "Insurance Certificate", type: "insurance", required: false },
  { name: "CMR Document", type: "cmr", required: true },
  { name: "Carnet ATA", type: "carnet", required: false },
];

const statusConfig: Record<DocumentStatus, {
  label: string;
  icon: React.ElementType;
  color: string;
  bgColor: string;
}> = {
  VALID: {
    label: "Valid",
    icon: CheckCircle2,
    color: "text-green-600",
    bgColor: "bg-green-100 dark:bg-green-900",
  },
  EXPIRING_SOON: {
    label: "Expiring Soon",
    icon: Clock,
    color: "text-yellow-600",
    bgColor: "bg-yellow-100 dark:bg-yellow-900",
  },
  EXPIRED: {
    label: "Expired",
    icon: AlertCircle,
    color: "text-red-600",
    bgColor: "bg-red-100 dark:bg-red-900",
  },
  PENDING: {
    label: "Pending Upload",
    icon: Upload,
    color: "text-gray-600",
    bgColor: "bg-gray-100 dark:bg-gray-800",
  },
};

export function CustomsDocumentLibrary({
  documents = [],
  className,
}: CustomsDocumentLibraryProps) {
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const getExpiryWarning = (expiryDate?: string) => {
    if (!expiryDate) return null;

    const expiry = new Date(expiryDate);
    const now = new Date();
    const daysUntilExpiry = Math.floor(
      (expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (daysUntilExpiry < 0) return "Expired";
    if (daysUntilExpiry === 0) return "Expires today";
    if (daysUntilExpiry <= 7) return `Expires in ${daysUntilExpiry} days`;
    if (daysUntilExpiry <= 30) return `Expires in ${Math.ceil(daysUntilExpiry / 7)} weeks`;
    return null;
  };

  // Calculate statistics
  const requiredDocs = documentTemplates.filter((t) => t.required).length;
  const uploadedRequired = documents.filter(
    (d) => d.required && d.status !== "PENDING"
  ).length;
  const expiringSoon = documents.filter((d) => d.status === "EXPIRING_SOON").length;
  const expired = documents.filter((d) => d.status === "EXPIRED").length;

  return (
    <Card className={cn("border-2", className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            <CardTitle>Documents Library</CardTitle>
          </div>
          <Badge variant="outline" className="font-mono">
            {uploadedRequired}/{requiredDocs} required
          </Badge>
        </div>
        <CardDescription>Manage customs documentation</CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Alerts */}
        {expired > 0 && (
          <div className="rounded-lg border-2 border-red-500 bg-red-50 dark:bg-red-950 p-3">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-4 w-4 text-red-600 mt-0.5" />
              <div className="text-xs">
                <p className="font-semibold text-red-900 dark:text-red-100">
                  {expired} document{expired > 1 ? "s" : ""} expired
                </p>
                <p className="text-red-800 dark:text-red-200 mt-1">
                  Update immediately to avoid customs delays
                </p>
              </div>
            </div>
          </div>
        )}

        {expiringSoon > 0 && (
          <div className="rounded-lg border border-yellow-500 bg-yellow-50 dark:bg-yellow-950 p-3">
            <div className="flex items-start gap-2">
              <Clock className="h-4 w-4 text-yellow-600 mt-0.5" />
              <div className="text-xs">
                <p className="font-semibold text-yellow-900 dark:text-yellow-100">
                  {expiringSoon} document{expiringSoon > 1 ? "s" : ""} expiring soon
                </p>
                <p className="text-yellow-800 dark:text-yellow-200 mt-1">
                  Renew within the next 30 days
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-2">
          <Button variant="default" size="sm">
            <Plus className="h-3 w-3 mr-2" />
            Upload Document
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-3 w-3 mr-2" />
            Download All
          </Button>
        </div>

        <Separator />

        {/* Document Templates/List */}
        <div className="space-y-2">
          <h4 className="text-sm font-semibold">Required Documents</h4>
          {documentTemplates
            .filter((template) => template.required)
            .map((template) => {
              const doc = documents.find((d) => d.type === template.type);
              const config = doc
                ? statusConfig[doc.status]
                : statusConfig.PENDING;
              const Icon = config.icon;
              const expiryWarning = doc ? getExpiryWarning(doc.expiryDate) : null;

              return (
                <div
                  key={template.type}
                  className="rounded-lg border p-3 hover:bg-accent transition-colors"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h5 className="font-semibold text-sm">{template.name}</h5>
                        <Badge
                          className={cn("text-xs", config.bgColor, config.color)}
                        >
                          <Icon className="h-3 w-3 mr-1" />
                          {config.label}
                        </Badge>
                      </div>

                      {doc && (
                        <>
                          <p className="text-xs text-muted-foreground">
                            Uploaded{" "}
                            {formatDistanceToNow(new Date(doc.uploadDate), {
                              addSuffix: true,
                            })}
                            {doc.fileSize && ` • ${formatFileSize(doc.fileSize)}`}
                          </p>
                          {expiryWarning && (
                            <p className="text-xs text-orange-600 dark:text-orange-400 mt-1">
                              ⚠️ {expiryWarning}
                            </p>
                          )}
                        </>
                      )}
                    </div>

                    {doc && doc.status !== "PENDING" ? (
                      <div className="flex gap-1">
                        <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                          <Eye className="h-3 w-3" />
                        </Button>
                        <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                          <Download className="h-3 w-3" />
                        </Button>
                      </div>
                    ) : (
                      <Button size="sm" variant="outline">
                        <Upload className="h-3 w-3 mr-1" />
                        Upload
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
        </div>

        {/* Optional Documents */}
        {documentTemplates.some((t) => !t.required) && (
          <>
            <Separator />
            <div className="space-y-2">
              <h4 className="text-sm font-semibold">Optional Documents</h4>
              {documentTemplates
                .filter((template) => !template.required)
                .map((template) => {
                  const doc = documents.find((d) => d.type === template.type);
                  const hasDoc = doc && doc.status !== "PENDING";

                  return (
                    <div
                      key={template.type}
                      className="rounded-lg border p-2 hover:bg-accent transition-colors"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{template.name}</span>
                        </div>
                        {hasDoc ? (
                          <Badge variant="outline" className="text-xs">
                            Uploaded
                          </Badge>
                        ) : (
                          <Button size="sm" variant="ghost">
                            Add
                          </Button>
                        )}
                      </div>
                    </div>
                  );
                })}
            </div>
          </>
        )}

        {/* Help Section */}
        <div className="rounded-lg border bg-muted/50 p-3">
          <div className="flex items-start gap-2">
            <FileText className="h-4 w-4 text-muted-foreground mt-0.5" />
            <div className="text-xs text-muted-foreground">
              <p className="font-semibold mb-1">Need help with documents?</p>
              <p>
                View our guide on customs documentation requirements for
                Europe-Morocco shipments.
              </p>
              <Button variant="link" className="h-auto p-0 mt-1 text-xs">
                Read Documentation Guide →
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
