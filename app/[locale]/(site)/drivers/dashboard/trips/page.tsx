"use client";

import { useTranslations } from "next-intl";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import { MapPin, Search, Calendar, ChevronRight, Clock, Truck } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CreateTripDialog } from "@/components/drivers/CreateTripDialog";

const mockTrips = [
  { id: 1, from: "Casablanca", to: "Tangier", date: "04/15/2025", time: "8:51 AM", duration: "3hr 45m", status: "Planned", price: "450 MAD" },
  { id: 2, from: "Rabat", to: "Marrakech", date: "04/16/2025", time: "10:30 AM", duration: "3hr 15m", status: "Completed", price: "520 MAD" },
  { id: 3, from: "Fes", to: "Meknes", date: "04/17/2025", time: "2:00 PM", duration: "45m", status: "Cancelled", price: "120 MAD" },
  { id: 4, from: "Tangier", to: "Tetouan", date: "04/18/2025", time: "09:00 AM", duration: "1hr 10m", status: "Planned", price: "150 MAD" },
  { id: 5, from: "Agadir", to: "Essaouira", date: "04/19/2025", time: "11:15 AM", duration: "2hr 30m", status: "Planned", price: "300 MAD" },
];

export default function DriverTripsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">My Trips</h1>
          <p className="text-slate-500">View and manage your scheduled deliveries.</p>
        </div>
        <CreateTripDialog />
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input placeholder="Search trips..." className="pl-10" />
        </div>
        <div className="flex gap-2">
          <Button variant="outline"><Calendar className="w-4 h-4 mr-2" /> Date Range</Button>
          <Button variant="outline"><Truck className="w-4 h-4 mr-2" /> Status</Button>
        </div>
      </div>

      <DashboardCard title="Upcoming & Past Trips" className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-500 uppercase bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800">
              <tr>
                <th className="px-6 py-4">Route</th>
                <th className="px-6 py-4">Date & Time</th>
                <th className="px-6 py-4">Duration</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {mockTrips.map((trip) => (
                <tr key={trip.id} className="border-b border-slate-50 dark:border-slate-800 last:border-0 hover:bg-slate-50/50 dark:hover:bg-slate-900/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2 font-medium text-slate-900 dark:text-white">
                        <span>{trip.from}</span>
                        <span className="text-slate-400">→</span>
                        <span>{trip.to}</span>
                      </div>
                      <span className="text-xs text-slate-500 mt-1">Trip #{trip.id}1092</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{trip.date}</span>
                      <span className="text-slate-300">|</span>
                      <Clock className="w-3.5 h-3.5" />
                      <span>{trip.time}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-600 dark:text-slate-400">
                    {trip.duration}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${trip.status === "Completed" ? "bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-900/30" :
                      trip.status === "Cancelled" ? "bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-900/30" :
                        "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-900/30"
                      }`}>
                      {trip.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <ChevronRight className="w-4 h-4" />
                    </Button>
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