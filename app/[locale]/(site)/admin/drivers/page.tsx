"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { adminService, Driver } from "@/lib/api/admin-service";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Search, Eye, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { format } from "date-fns";

export default function DriversPage() {
    const t = useTranslations("admin");
    const [drivers, setDrivers] = useState<Driver[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchDrivers();
    }, []);

    const fetchDrivers = async () => {
        try {
            setIsLoading(true);
            const data = await adminService.getDrivers();
            setDrivers(data);
        } catch (err) {
            setError("Failed to load drivers");
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const filteredDrivers = drivers.filter(driver =>
        driver.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        driver.lastName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        driver.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        driver.phone?.includes(searchQuery)
    );

    const getStatusBadge = (status: string, isVerified: boolean) => {
        if (!isVerified) {
            return <Badge variant="outline" className="bg-amber-50 text-amber-600 border-amber-200">Unverified</Badge>;
        }
        if (status === "active") {
            return <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Active</Badge>;
        }
        return <Badge variant="secondary">Inactive</Badge>;
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Drivers Management</h1>
                <Button onClick={fetchDrivers} variant="outline" size="sm">
                    Refresh List
                </Button>
            </div>

            <Card>
                <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-lg font-medium">All Drivers</CardTitle>
                        <div className="relative w-full max-w-sm">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
                            <Input
                                placeholder="Search drivers..."
                                className="pl-9"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="flex justify-center py-8">
                            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                        </div>
                    ) : error ? (
                        <div className="flex flex-col items-center justify-center py-8 text-red-500">
                            <AlertCircle className="h-8 w-8 mb-2" />
                            <p>{error}</p>
                            <Button variant="link" onClick={fetchDrivers} className="mt-2">Try Again</Button>
                        </div>
                    ) : filteredDrivers.length === 0 ? (
                        <div className="text-center py-8 text-slate-500">
                            No drivers found matching your search.
                        </div>
                    ) : (
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Contact</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Joined</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredDrivers.map((driver) => (
                                        <TableRow key={driver.id}>
                                            <TableCell className="font-medium">
                                                {driver.firstName} {driver.lastName}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex flex-col text-sm">
                                                    <span>{driver.email}</span>
                                                    <span className="text-slate-500">{driver.phone}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                {getStatusBadge(driver.status, driver.isVerified)}
                                            </TableCell>
                                            <TableCell>
                                                {driver.createdAt ? format(new Date(driver.createdAt), "MMM d, yyyy") : "-"}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Button variant="ghost" size="sm" asChild>
                                                    <Link href={`/admin/drivers/${driver.id}`}>
                                                        <Eye className="h-4 w-4 mr-2" />
                                                        Details
                                                    </Link>
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
