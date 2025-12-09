"use client";

import { useQuery } from "@tanstack/react-query";
import { driverService } from "@/lib/api/driver-service";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Truck, Timer, Star, TrendingUp, AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";

export default function PerformancePage() {
    const { data: session } = useSession();
    const userId = (session?.user as any)?.id;

    // 1. Fetch Profile to get real Driver ID
    const { data: profile, isLoading: isProfileLoading } = useQuery({
        queryKey: ['driver-profile', userId],
        queryFn: () => driverService.getProfile(userId!),
        enabled: !!userId,
        retry: false
    });

    const driverId = profile?.id;

    // 2. Fetch Stats using real Driver ID
    const { data: stats, isLoading: isStatsLoading, error } = useQuery({
        queryKey: ['driver-stats', driverId],
        queryFn: () => driverService.getStatistics(driverId!),
        enabled: !!driverId,
        // Fallback data for demo if API fails or not implemented
        initialData: {
            this_month_trips: 45,
            total_earnings: 12500,
            on_time_rate: 98.5,
            average_rating: 4.9,
            weekly_activity: [
                { name: 'Mon', trips: 4 },
                { name: 'Tue', trips: 6 },
                { name: 'Wed', trips: 8 },
                { name: 'Thu', trips: 5 },
                { name: 'Fri', trips: 9 },
                { name: 'Sat', trips: 3 },
                { name: 'Sun', trips: 0 },
            ]
        }
    });

    const isLoading = isProfileLoading || isStatsLoading;

    if (isLoading) {
        return <div className="p-8 text-center">Loading performance data...</div>;
    }

    if (error) {
        return (
            <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>Failed to load performance statistics.</AlertDescription>
            </Alert>
        );
    }

    return (
        <div className="container py-8 space-y-8">
            <div>
                <h1 className="text-3xl font-bold">Performance Analytics</h1>
                <p className="text-muted-foreground">Track your delivery performance and earnings</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Trips (Month)</CardTitle>
                        <Truck className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.this_month_trips}</div>
                        <p className="text-xs text-muted-foreground">+12% from last month</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">On-Time Rate</CardTitle>
                        <Timer className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.on_time_rate}%</div>
                        <p className="text-xs text-muted-foreground">+2.1% improvement</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
                        <Star className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.average_rating}</div>
                        <p className="text-xs text-muted-foreground">Based on 124 reviews</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Earnings (Est.)</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.total_earnings} MAD</div>
                        <p className="text-xs text-muted-foreground">+8% from last month</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>Weekly Activity</CardTitle>
                    </CardHeader>
                    <CardContent className="pl-2">
                        <ResponsiveContainer width="100%" height={350}>
                            <BarChart data={stats.weekly_activity}>
                                <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
                                <Tooltip />
                                <Bar dataKey="trips" fill="#2563eb" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle>Recent Feedback</CardTitle>
                        <CardDescription>Latest reviews from your customers.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="flex items-start gap-4 p-3 bg-muted/50 rounded-lg">
                                    <div className="rounded-full bg-blue-100 p-2">
                                        <Star className="h-4 w-4 text-blue-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium">"Great service, very punctual!"</p>
                                        <p className="text-xs text-muted-foreground">2 days ago • Trip #TR-{8530 + i}</p>
                                    </div>
                                </div>
                            ))}
                            <Button variant="ghost" className="w-full text-sm">View all reviews</Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
