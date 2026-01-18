"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  FileText,
  Eye,
  Check,
  X,
  Loader2,
  Calendar,
  User,
  AlertCircle,
} from "lucide-react";
import { DriverDocument } from "@/lib/api/admin-service";
import { format } from "date-fns";

interface DocumentVerificationCardProps {
  document: DriverDocument;
  onApprove: (documentId: string, notes?: string) => Promise<void>;
  onReject: (documentId: string, reason: string) => Promise<void>;
  isProcessing?: boolean;
}

const getDocumentTypeLabel = (type: string): string => {
  const labels: Record<string, string> = {
    license: "Driving License",
    id_card: "ID Card",
    insurance: "Insurance",
    vehicle_registration: "Vehicle Registration",
    other: "Other Document",
  };
  return labels[type] || type;
};

const getStatusBadge = (status: string) => {
  switch (status) {
    case "approved":
      return (
        <Badge className="bg-green-100 text-green-700 border-green-200">
          Approved
        </Badge>
      );
    case "rejected":
      return (
        <Badge className="bg-red-100 text-red-700 border-red-200">
          Rejected
        </Badge>
      );
    case "pending":
    default:
      return (
        <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200">
          Pending
        </Badge>
      );
  }
};

export function DocumentVerificationCard({
  document,
  onApprove,
  onReject,
  isProcessing = false,
}: DocumentVerificationCardProps) {
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isApproveOpen, setIsApproveOpen] = useState(false);
  const [isRejectOpen, setIsRejectOpen] = useState(false);
  const [notes, setNotes] = useState("");
  const [rejectReason, setRejectReason] = useState("");
  const [localProcessing, setLocalProcessing] = useState(false);

  const isPending = document.status === "pending";
  const processing = isProcessing || localProcessing;

  const handleApprove = async () => {
    setLocalProcessing(true);
    try {
      await onApprove(document.id, notes || undefined);
      setIsApproveOpen(false);
      setNotes("");
    } finally {
      setLocalProcessing(false);
    }
  };

  const handleReject = async () => {
    if (!rejectReason.trim()) return;
    setLocalProcessing(true);
    try {
      await onReject(document.id, rejectReason);
      setIsRejectOpen(false);
      setRejectReason("");
    } finally {
      setLocalProcessing(false);
    }
  };

  return (
    <>
      <Card className="overflow-hidden">
        <CardContent className="p-4">
          <div className="flex items-start gap-4">
            {/* Document Icon */}
            <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center flex-shrink-0">
              <FileText className="w-6 h-6 text-slate-500" />
            </div>

            {/* Document Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2 mb-1">
                <h4 className="font-medium text-sm truncate">{document.name}</h4>
                {getStatusBadge(document.status)}
              </div>

              <p className="text-xs text-slate-500 mb-2">
                {getDocumentTypeLabel(document.type)}
              </p>

              {/* Metadata */}
              <div className="flex flex-wrap gap-3 text-xs text-slate-500">
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  <span>
                    Uploaded {format(new Date(document.uploaded_at), "MMM d, yyyy")}
                  </span>
                </div>
                {document.verified_by && (
                  <div className="flex items-center gap-1">
                    <User className="w-3 h-3" />
                    <span>By {document.verified_by}</span>
                  </div>
                )}
              </div>

              {/* Rejection reason */}
              {document.status === "rejected" && document.rejection_reason && (
                <div className="mt-2 p-2 bg-red-50 dark:bg-red-900/20 rounded text-xs text-red-700 dark:text-red-400">
                  <span className="font-medium">Reason:</span> {document.rejection_reason}
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={() => setIsViewOpen(true)}
            >
              <Eye className="w-4 h-4 mr-1" />
              View
            </Button>

            {isPending && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 text-green-600 hover:text-green-700 hover:bg-green-50"
                  onClick={() => setIsApproveOpen(true)}
                  disabled={processing}
                >
                  <Check className="w-4 h-4 mr-1" />
                  Approve
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                  onClick={() => setIsRejectOpen(true)}
                  disabled={processing}
                >
                  <X className="w-4 h-4 mr-1" />
                  Reject
                </Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* View Document Dialog */}
      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{document.name}</DialogTitle>
            <DialogDescription>
              {getDocumentTypeLabel(document.type)} - {getStatusBadge(document.status)}
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center justify-center bg-slate-50 dark:bg-slate-900 rounded-lg p-4 min-h-[400px]">
            <img
              src={document.url}
              alt={document.name}
              className="max-w-full max-h-[500px] object-contain rounded"
            />
          </div>
        </DialogContent>
      </Dialog>

      {/* Approve Dialog */}
      <Dialog open={isApproveOpen} onOpenChange={setIsApproveOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Check className="w-5 h-5 text-green-600" />
              Approve Document
            </DialogTitle>
            <DialogDescription>
              You are about to approve &quot;{document.name}&quot;. Add optional notes below.
            </DialogDescription>
          </DialogHeader>
          <Textarea
            placeholder="Optional notes (e.g., 'Document verified, valid until 2025')"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
          />
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsApproveOpen(false)}
              disabled={processing}
            >
              Cancel
            </Button>
            <Button
              className="bg-green-600 hover:bg-green-700"
              onClick={handleApprove}
              disabled={processing}
            >
              {processing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Approving...
                </>
              ) : (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  Approve Document
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog open={isRejectOpen} onOpenChange={setIsRejectOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-600" />
              Reject Document
            </DialogTitle>
            <DialogDescription>
              You are about to reject &quot;{document.name}&quot;. Please provide a reason.
            </DialogDescription>
          </DialogHeader>
          <Textarea
            placeholder="Reason for rejection (required)"
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            rows={3}
            className="border-red-200 focus:border-red-400"
          />
          {!rejectReason.trim() && (
            <p className="text-xs text-red-500">A rejection reason is required</p>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsRejectOpen(false)}
              disabled={processing}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleReject}
              disabled={processing || !rejectReason.trim()}
            >
              {processing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Rejecting...
                </>
              ) : (
                <>
                  <X className="w-4 h-4 mr-2" />
                  Reject Document
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
