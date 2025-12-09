"use client";

import { useQuery } from "@tanstack/react-query";
import { driverService } from "@/lib/api/driver-service";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Wallet, TrendingUp, ArrowUpRight, ArrowDownLeft, Clock } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

export default function EarningsPage() {
    const { data: session } = useSession();
    const driverId = (session?.user as any)?.id || "current";

    const { data: earnings, isLoading, error } = useQuery({
        queryKey: ['driver-earnings', driverId],
        queryFn: () => driverService.getEarnings(driverId)
    });

    if (isLoading) {
        return <div className="p-8 text-center">Loading financial data...</div>;
    }

    if (error) {
        return (
            <Alert variant="destructive">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>Failed to load earnings history.</AlertDescription>
            </Alert>
        );
    }

    return (
        <div className="container py-8 space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold">Earnings & Finance</h1>
                    <p className="text-muted-foreground">Manage your payouts and view transaction history</p>
                </div>
                <Button className="bg-green-600 hover:bg-green-700">
                    Request Payout
                </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <Card className="bg-gradient-to-br from-blue-600 to-blue-700 text-white border-blue-600">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-blue-100 flex items-center gap-2">
                            <Wallet className="h-4 w-4" /> Total Balance
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{earnings.total_balance?.toFixed(2)} {earnings.currency}</div>
                        <p className="text-xs text-blue-100 mt-1">Available for withdrawal</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                            <Clock className="h-4 w-4" /> Pending Payout
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-slate-900 dark:text-white">{earnings.pending_payout?.toFixed(2)} {earnings.currency}</div>
                        <p className="text-xs text-muted-foreground mt-1">Processing (Est. 2-3 days)</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                            <TrendingUp className="h-4 w-4" /> Last Payout
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-slate-900 dark:text-white">{earnings.last_payout?.amount?.toFixed(2)} {earnings.currency}</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Paid on {earnings.last_payout?.date ? format(new Date(earnings.last_payout.date), "PPP") : "N/A"}
                        </p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle>Earnings Overview (Last 7 Days)</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={earnings.chart_data}>
                                    <defs>
                                        <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#2563eb" stopOpacity={0.8} />
                                            <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                                    <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
                                    <Tooltip />
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e5e550" />
                                    <Area type="monotone" dataKey="amount" stroke="#2563eb" fillOpacity={1} fill="url(#colorAmount)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Recent Transactions</CardTitle>
                        <CardDescription>Latest financial activity</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {earnings.transactions && earnings.transactions.map((tx: any, i: number) => (
                                <div key={i} className="flex items-center justify-between pb-4 last:pb-0 last:border-0 border-b">
                                    <div className="flex items-center gap-3">
                                        <div className={`p-2 rounded-full ${tx.type === 'credit' ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'}`}>
                                            {tx.type === 'credit' ? <ArrowDownLeft className="h-4 w-4" /> : <ArrowUpRight className="h-4 w-4" />}
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium">{tx.description}</p>
                                            <p className="text-xs text-muted-foreground">{format(new Date(tx.date), "MMM d, h:mm a")}</p>
                                        </div>
                                    </div>
                                    <div className={`font-bold text-sm ${tx.type === 'credit' ? 'text-green-600' : 'text-slate-900 dark:text-white'}`}>
                                        {tx.type === 'credit' ? '+' : ''}{tx.amount.toFixed(2)}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <Button variant="ghost" className="w-full mt-4 text-sm">View Full History</Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
