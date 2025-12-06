"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { adminService } from "@/lib/api/admin-service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, Building2, CheckCircle } from "lucide-react";

export default function OrganizationsPage() {
    const { toast } = useToast();
    const t = useTranslations("admin");

    const [orgId, setOrgId] = useState("");
    const [isProcessing, setIsProcessing] = useState(false);

    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!orgId.trim()) return;

        try {
            setIsProcessing(true);
            await adminService.verifyOrganization(orgId);

            toast({
                title: "Success",
                description: "Organization verified successfully",
            });

            setOrgId(""); // Clear input
        } catch (err) {
            toast({
                title: "Error",
                description: "Failed to verify organization. Please check the ID.",
                variant: "destructive",
            });
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Organization Management</h1>
                <p className="text-slate-500 dark:text-slate-400">Tools for managing organizations</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Building2 className="h-5 w-5 text-blue-500" />
                            Manual Verification
                        </CardTitle>
                        <CardDescription>
                            Verify an organization by its ID manually.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleVerify} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="orgId">Organization ID</Label>
                                <Input
                                    id="orgId"
                                    placeholder="e.g., org_123456789"
                                    value={orgId}
                                    onChange={(e) => setOrgId(e.target.value)}
                                    required
                                />
                            </div>
                            <Button type="submit" disabled={isProcessing || !orgId.trim()} className="w-full">
                                {isProcessing ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Verifying...
                                    </>
                                ) : (
                                    <>
                                        <CheckCircle className="mr-2 h-4 w-4" />
                                        Verify Organization
                                    </>
                                )}
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                <Card className="bg-slate-50 dark:bg-slate-900 border-dashed">
                    <CardContent className="flex flex-col items-center justify-center h-full py-12 text-center text-slate-500">
                        <Building2 className="h-12 w-12 mb-4 opacity-20" />
                        <p className="text-lg font-medium">More Tools Coming Soon</p>
                        <p className="text-sm">Additional organization management features will be added here.</p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
