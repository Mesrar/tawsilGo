"use client";

import { useTranslations } from "next-intl";
import { Truck, MapPin, Package, Users, Activity, TrendingUp } from "lucide-react";
import { StatWidget } from "@/components/dashboard/StatWidget";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const data = [
    { name: 'Mon', trips: 12 },
    { name: 'Tue', trips: 19 },
    { name: 'Wed', trips: 15 },
    { name: 'Thu', trips: 22 },
    { name: 'Fri', trips: 28 },
    { name: 'Sat', trips: 18 },
    { name: 'Sun', trips: 10 },
];

export default function OrganizationDashboardPage() {
    const t = useTranslations("organization");

    // Mock data - would normally come from API
    const stats = {
        totalFleet: 12,
        activeTrips: 5,
        completedTrips: 128,
        totalDrivers: 8
    };

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Organization Overview</h1>
                <p className="text-slate-500">Manage your fleet, track trips, and monitor performance.</p>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatWidget
                    title="Total Fleet"
                    value={stats.totalFleet.toString()}
                    icon={<Truck className="w-5 h-5" />}
                    trend={{ value: 2, direction: "up", label: "new vehicles" }}
                    color="blue"
                />
                <StatWidget
                    title="Active Trips"
                    value={stats.activeTrips.toString()}
                    icon={<Activity className="w-5 h-5" />}
                    trend={{ value: 12, direction: "up", label: "vs yesterday" }}
                    color="green"
                />
                <StatWidget
                    title="Completed Trips"
                    value={stats.completedTrips.toString()}
                    icon={<Package className="w-5 h-5" />}
                    trend={{ value: 5.4, direction: "up", label: "this month" }}
                    color="indigo"
                />
                <StatWidget
                    title="Drivers"
                    value={stats.totalDrivers.toString()}
                    icon={<Users className="w-5 h-5" />}
                    trend={{ value: 0, direction: "neutral", label: "stable" }}
                    color="violet"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Chart */}
                <div className="lg:col-span-2">
                    <DashboardCard title="Weekly Trip Volume">
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                                    <XAxis
                                        dataKey="name"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#64748B', fontSize: 12 }}
                                        dy={10}
                                    />
                                    <YAxis
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#64748B', fontSize: 12 }}
                                    />
                                    <Tooltip
                                        cursor={{ fill: '#F1F5F9' }}
                                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    />
                                    <Bar
                                        dataKey="trips"
                                        fill="#3B82F6"
                                        radius={[4, 4, 0, 0]}
                                        barSize={32}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </DashboardCard>
                </div>

                {/* Recent Activity / Notifications */}
                <div>
                    <DashboardCard title="Recent Activity">
                        <div className="space-y-4">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="flex gap-3 items-start pb-4 border-b border-slate-100 last:border-0 last:pb-0">
                                    <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                                        <MapPin className="w-4 h-4 text-blue-500" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-slate-800">Trip completed</p>
                                        <p className="text-xs text-slate-500">Driver Ahmed arrived at destination.</p>
                                        <p className="text-[10px] text-slate-400 mt-1">2 mins ago</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </DashboardCard>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <DashboardCard title="Quick Actions">
                    <div className="grid grid-cols-2 gap-3">
                        <button className="p-3 rounded-lg border border-slate-200 hover:border-blue-500 hover:bg-blue-50 transition-all flex flex-col items-center gap-2 text-center group">
                            <Truck className="w-5 h-5 text-slate-500 group-hover:text-blue-600" />
                            <span className="text-xs font-medium text-slate-600 group-hover:text-blue-700">Add Vehicle</span>
                        </button>
                        <button className="p-3 rounded-lg border border-slate-200 hover:border-blue-500 hover:bg-blue-50 transition-all flex flex-col items-center gap-2 text-center group">
                            <Users className="w-5 h-5 text-slate-500 group-hover:text-blue-600" />
                            <span className="text-xs font-medium text-slate-600 group-hover:text-blue-700">Add Driver</span>
                        </button>
                    </div>
                </DashboardCard>
            </div>
        </div>
    );
}
