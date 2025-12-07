"use client";

import { useTranslations } from "next-intl";
import { StatWidget } from "@/components/dashboard/StatWidget";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import {
    Users,
    Truck,
    Package,
    TrendingUp,
    Clock,
    MapPin,
    Calendar as CalendarIcon
} from "lucide-react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    AreaChart,
    Area,
    PieChart,
    Pie,
    Cell
} from "recharts";

// Mock Data
const tripsData = [
    { name: 'Dec', value: 40 },
    { name: 'Jan', value: 30 },
    { name: 'Feb', value: 45 },
    { name: 'Mar', value: 55 },
    { name: 'Apr', value: 65 },
];

const distanceData = [
    { name: 'Dec', value: 1200 },
    { name: 'Jan', value: 1400 },
    { name: 'Feb', value: 1100 },
    { name: 'Mar', value: 1628 },
    { name: 'Apr', value: 1500 },
];

const drivingHoursData = [
    { name: 'Day', value: 65, color: '#84cc16' }, // Lime-500
    { name: 'Night', value: 35, color: '#3b82f6' }, // Blue-500
];

export default function AdminDashboardPage() {
    const t = useTranslations("admin");

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Overview</h1>
                <p className="text-slate-500">Welcome back, here's what's happening today.</p>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatWidget
                    title="Total trips"
                    value="84"
                    icon={<Truck className="w-5 h-5" />}
                    trend={{ value: 2.1, direction: "up", label: "this month" }}
                    chart={
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={tripsData}>
                                <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    }
                />
                <StatWidget
                    title="Distance driven"
                    value="1,628 km"
                    icon={<MapPin className="w-5 h-5" />}
                    chart={
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={distanceData}>
                                <defs>
                                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <Area type="monotone" dataKey="value" stroke="#3b82f6" fillOpacity={1} fill="url(#colorValue)" strokeWidth={2} />
                            </AreaChart>
                        </ResponsiveContainer>
                    }
                />
                <StatWidget
                    title="Driving hours"
                    value="16hr 12m"
                    icon={<Clock className="w-5 h-5" />}
                    chart={
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={drivingHoursData}
                                    innerRadius={15}
                                    outerRadius={22}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {drivingHoursData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                            </PieChart>
                        </ResponsiveContainer>
                    }
                />
                <StatWidget
                    title="Active Drivers"
                    value="12"
                    icon={<Users className="w-5 h-5" />}
                    trend={{ value: 4, direction: "up", label: "this week" }}
                />
            </div>

            {/* Middle Row: Calendar, Map, etc */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Calendar / Schedule - Simplified */}
                <DashboardCard title="Calendar" className="lg:col-span-1">
                    <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-4 flex items-center justify-center h-64">
                        <div className="text-center">
                            <CalendarIcon className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                            <p className="text-slate-500 text-sm">No events scheduled for today</p>
                        </div>
                    </div>
                </DashboardCard>

                {/* Current Trip Map Placeholder */}
                <DashboardCard title="Live Map" className="lg:col-span-2">
                    <div className="bg-slate-100 dark:bg-slate-800 rounded-xl w-full h-64 relative overflow-hidden group">
                        <div className="absolute inset-0 flex items-center justify-center">
                            <p className="text-slate-500 font-medium flex items-center gap-2">
                                <MapPin className="w-5 h-5" />
                                Interactive Map Loading...
                            </p>
                        </div>
                        {/* Placeholder for real map */}
                        <div className="absolute inset-0 bg-[url('/map-pattern.png')] opacity-10"></div>
                    </div>
                </DashboardCard>
            </div>

            {/* Bottom Row: Recent Trips Table */}
            <DashboardCard title="Recent Trips">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-slate-500 uppercase bg-slate-50/50">
                            <tr>
                                <th className="px-4 py-3">Route</th>
                                <th className="px-4 py-3">Date</th>
                                <th className="px-4 py-3">Status</th>
                                <th className="px-4 py-3 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {[1, 2, 3].map((i) => (
                                <tr key={i} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50">
                                    <td className="px-4 py-3 font-medium text-slate-900">
                                        Poznan <span className="text-slate-400 mx-2">→</span> Berlin
                                    </td>
                                    <td className="px-4 py-3 text-slate-500">
                                        04/15/2025 <span className="text-xs ml-1 bg-slate-100 px-1.5 py-0.5 rounded text-slate-500">8:51 AM</span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                            Completed
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        <button className="text-blue-600 hover:text-blue-700 font-medium text-xs">View</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </DashboardCard>
        </div>
    );
}
