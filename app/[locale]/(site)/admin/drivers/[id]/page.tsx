"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import {
  adminService,
  Driver,
  DriverDocument,
  StatusHistoryEntry,
} from "@/lib/api/admin-service";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import {
  Loader2,
  ArrowLeft,
  CheckCircle,
  XCircle,
  ShieldCheck,
  User,
  Car,
  FileText,
  AlertTriangle,
  CheckCheck,
} from "lucide-react";
import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DocumentVerificationCard } from "@/components/Admin/DocumentVerificationCard";
import { StatusHistoryTimeline } from "@/components/Admin/StatusHistoryTimeline";

export default function DriverDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const t = useTranslations("admin");

  const [driver, setDriver] = useState<Driver | null>(null);
  const [documents, setDocuments] = useState<DriverDocument[]>([]);
  const [statusHistory, setStatusHistory] = useState<StatusHistoryEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingDocs, setIsLoadingDocs] = useState(true);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isBulkProcessing, setIsBulkProcessing] = useState(false);
  const [verifyNotes, setVerifyNotes] = useState("");
  const [statusReason, setStatusReason] = useState("");
  const [isVerifyDialogOpen, setIsVerifyDialogOpen] = useState(false);
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
  const [isBulkVerifyDialogOpen, setIsBulkVerifyDialogOpen] = useState(false);
  const [bulkVerifyNotes, setBulkVerifyNotes] = useState("");

  const driverId = params?.id as string;

  const fetchDriver = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await adminService.getDriver(driverId);
      setDriver(data);
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to load driver details",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [driverId, toast]);

  const fetchDocuments = useCallback(async () => {
    try {
      setIsLoadingDocs(true);
      const docs = await adminService.getDriverDocuments(driverId);
      setDocuments(docs);
    } catch (err) {
      console.error("Failed to fetch documents:", err);
    } finally {
      setIsLoadingDocs(false);
    }
  }, [driverId]);

  const fetchStatusHistory = useCallback(async () => {
    try {
      setIsLoadingHistory(true);
      const history = await adminService.getDriverStatusHistory(driverId);
      setStatusHistory(history);
    } catch (err) {
      console.error("Failed to fetch status history:", err);
    } finally {
      setIsLoadingHistory(false);
    }
  }, [driverId]);

  useEffect(() => {
    if (driverId) {
      fetchDriver();
      fetchDocuments();
      fetchStatusHistory();
    }
  }, [driverId, fetchDriver, fetchDocuments, fetchStatusHistory]);

  const handleVerify = async () => {
    try {
      setIsProcessing(true);
      await adminService.verifyDriver(driverId, {
        is_verified: true,
        notes: verifyNotes || "Verified by admin",
      });

      toast({
        title: "Success",
        description: "Driver verified successfully",
      });

      setIsVerifyDialogOpen(false);
      setVerifyNotes("");
      fetchDriver();
      fetchStatusHistory();
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to verify driver",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleStatusChange = async (isActive: boolean) => {
    try {
      setIsProcessing(true);
      await adminService.setDriverStatus(driverId, {
        is_active: isActive,
        reason:
          statusReason ||
          (isActive ? "Activated by admin" : "Deactivated by admin"),
      });

      toast({
        title: "Success",
        description: `Driver ${isActive ? "activated" : "deactivated"} successfully`,
      });

      setIsStatusDialogOpen(false);
      setStatusReason("");
      fetchDriver();
      fetchStatusHistory();
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to update driver status",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleApproveDocument = async (documentId: string, notes?: string) => {
    try {
      await adminService.verifyDocument(driverId, documentId, {
        status: "approved",
        notes,
      });

      toast({
        title: "Document Approved",
        description: "The document has been approved successfully",
      });

      fetchDocuments();
      fetchStatusHistory();
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to approve document",
        variant: "destructive",
      });
      throw err;
    }
  };

  const handleRejectDocument = async (documentId: string, reason: string) => {
    try {
      await adminService.verifyDocument(driverId, documentId, {
        status: "rejected",
        notes: reason,
      });

      toast({
        title: "Document Rejected",
        description: "The document has been rejected",
      });

      fetchDocuments();
      fetchStatusHistory();
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to reject document",
        variant: "destructive",
      });
      throw err;
    }
  };

  const handleBulkVerifyAll = async () => {
    const pendingDocs = documents.filter((doc) => doc.status === "pending");
    if (pendingDocs.length === 0) return;

    try {
      setIsBulkProcessing(true);
      await adminService.bulkVerifyDocuments(driverId, {
        document_ids: pendingDocs.map((doc) => doc.id),
        notes: bulkVerifyNotes || "Bulk approved by admin",
      });

      toast({
        title: "All Documents Approved",
        description: `${pendingDocs.length} document(s) have been approved`,
      });

      setIsBulkVerifyDialogOpen(false);
      setBulkVerifyNotes("");
      fetchDocuments();
      fetchStatusHistory();
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to bulk approve documents",
        variant: "destructive",
      });
    } finally {
      setIsBulkProcessing(false);
    }
  };

  const pendingDocuments = documents.filter((doc) => doc.status === "pending");

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (!driver) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <p className="text-lg text-slate-500 mb-4">Driver not found</p>
        <Button onClick={() => router.back()}>Go Back</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4 flex-wrap">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            {driver.firstName} {driver.lastName}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm truncate">
            ID: {driver.id}
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          {driver.isVerified ? (
            <Badge className="bg-green-100 text-green-700 hover:bg-green-100 px-3 py-1">
              <ShieldCheck className="w-3 h-3 mr-1" /> Verified
            </Badge>
          ) : (
            <Badge
              variant="outline"
              className="bg-amber-50 text-amber-600 border-amber-200 px-3 py-1"
            >
              <AlertTriangle className="w-3 h-3 mr-1" /> Unverified
            </Badge>
          )}

          {driver.status === "active" ? (
            <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 px-3 py-1">
              Active
            </Badge>
          ) : (
            <Badge variant="secondary" className="px-3 py-1">
              Inactive
            </Badge>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Info - Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-blue-500" />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label className="text-slate-500">Email</Label>
                  <p className="font-medium">{driver.email}</p>
                </div>
                <div>
                  <Label className="text-slate-500">Phone</Label>
                  <p className="font-medium">{driver.phone}</p>
                </div>
                <div>
                  <Label className="text-slate-500">Joined Date</Label>
                  <p className="font-medium">
                    {driver.createdAt
                      ? format(new Date(driver.createdAt), "PPP")
                      : "N/A"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Vehicle & License */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Car className="h-5 w-5 text-purple-500" />
                Vehicle & License
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label className="text-slate-500">Vehicle Type</Label>
                  <p className="font-medium capitalize">
                    {driver.vehicleType || "Not specified"}
                  </p>
                </div>
                <div>
                  <Label className="text-slate-500">License Number</Label>
                  <p className="font-medium">
                    {driver.licenseNumber || "Not provided"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Documents - Enhanced */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-orange-500" />
                  Documents
                </CardTitle>
                {pendingDocuments.length > 0 && (
                  <Dialog
                    open={isBulkVerifyDialogOpen}
                    onOpenChange={setIsBulkVerifyDialogOpen}
                  >
                    <DialogTrigger asChild>
                      <Button size="sm" className="bg-green-600 hover:bg-green-700">
                        <CheckCheck className="w-4 h-4 mr-2" />
                        Approve All ({pendingDocuments.length})
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                          <CheckCheck className="w-5 h-5 text-green-600" />
                          Bulk Approve Documents
                        </DialogTitle>
                        <DialogDescription>
                          You are about to approve {pendingDocuments.length} pending
                          document(s). Add optional notes below.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="py-2">
                        <div className="mb-4 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                          <p className="text-sm font-medium mb-2">
                            Documents to approve:
                          </p>
                          <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
                            {pendingDocuments.map((doc) => (
                              <li key={doc.id} className="flex items-center gap-2">
                                <CheckCircle className="w-3 h-3 text-green-500" />
                                {doc.name}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <Label className="mb-2 block">Notes (optional)</Label>
                        <Textarea
                          placeholder="e.g., All documents verified and in order"
                          value={bulkVerifyNotes}
                          onChange={(e) => setBulkVerifyNotes(e.target.value)}
                          rows={3}
                        />
                      </div>
                      <DialogFooter>
                        <Button
                          variant="outline"
                          onClick={() => setIsBulkVerifyDialogOpen(false)}
                          disabled={isBulkProcessing}
                        >
                          Cancel
                        </Button>
                        <Button
                          onClick={handleBulkVerifyAll}
                          disabled={isBulkProcessing}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          {isBulkProcessing ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              Approving...
                            </>
                          ) : (
                            <>
                              <CheckCheck className="w-4 h-4 mr-2" />
                              Approve All
                            </>
                          )}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {isLoadingDocs ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
                </div>
              ) : documents.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {documents.map((doc) => (
                    <DocumentVerificationCard
                      key={doc.id}
                      document={doc}
                      onApprove={handleApproveDocument}
                      onReject={handleRejectDocument}
                    />
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-500 text-center py-8">
                  No documents uploaded.
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar - Right Column */}
        <div className="space-y-6">
          {/* Actions Card */}
          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
              <CardDescription>Manage driver status</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Verification Action */}
              {!driver.isVerified && (
                <Dialog
                  open={isVerifyDialogOpen}
                  onOpenChange={setIsVerifyDialogOpen}
                >
                  <DialogTrigger asChild>
                    <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
                      <ShieldCheck className="w-4 h-4 mr-2" />
                      Verify Driver
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Verify Driver</DialogTitle>
                      <DialogDescription>
                        Are you sure you want to verify this driver? This will
                        allow them to start accepting jobs.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                      <Label htmlFor="notes" className="mb-2 block">
                        Verification Notes
                      </Label>
                      <Textarea
                        id="notes"
                        placeholder="e.g., Documents checked and approved"
                        value={verifyNotes}
                        onChange={(e) => setVerifyNotes(e.target.value)}
                      />
                    </div>
                    <DialogFooter>
                      <Button
                        variant="outline"
                        onClick={() => setIsVerifyDialogOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={handleVerify}
                        disabled={isProcessing}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        {isProcessing && (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        Confirm Verification
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              )}

              {/* Status Action */}
              <Dialog
                open={isStatusDialogOpen}
                onOpenChange={setIsStatusDialogOpen}
              >
                <DialogTrigger asChild>
                  <Button
                    variant={driver.status === "active" ? "destructive" : "default"}
                    className="w-full"
                  >
                    {driver.status === "active" ? (
                      <>
                        <XCircle className="w-4 h-4 mr-2" /> Deactivate Driver
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-4 h-4 mr-2" /> Activate Driver
                      </>
                    )}
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>
                      {driver.status === "active"
                        ? "Deactivate Driver"
                        : "Activate Driver"}
                    </DialogTitle>
                    <DialogDescription>
                      {driver.status === "active"
                        ? "This will prevent the driver from accessing the platform."
                        : "This will restore the driver's access to the platform."}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="py-4">
                    <Label htmlFor="reason" className="mb-2 block">
                      Reason
                    </Label>
                    <Textarea
                      id="reason"
                      placeholder="Reason for status change..."
                      value={statusReason}
                      onChange={(e) => setStatusReason(e.target.value)}
                    />
                  </div>
                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => setIsStatusDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={() => handleStatusChange(driver.status !== "active")}
                      disabled={isProcessing}
                      variant={driver.status === "active" ? "destructive" : "default"}
                    >
                      {isProcessing && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      Confirm
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>

          {/* Status History */}
          <StatusHistoryTimeline
            history={statusHistory}
            isLoading={isLoadingHistory}
          />
        </div>
      </div>
    </div>
  );
}
