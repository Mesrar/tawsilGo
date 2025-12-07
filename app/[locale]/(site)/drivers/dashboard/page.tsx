"use client";

import { useTranslations } from "next-intl";
import { StatWidget } from "@/components/dashboard/StatWidget";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import {
  Clock,
  MapPin,
  Calendar as CalendarIcon,
  Radio,
  Fuel,
  Ruler,
  FileCheck,
  Key,
  Truck
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DriverDashboardPage() {
  const t = useTranslations("driver");

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Dashboard</h1>
        <p className="text-slate-500">Good morning, ready for your first trip?</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Calendar & Rating */}
        <div className="space-y-6">
          <DashboardCard title="Calendar">
            <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-4 flex items-center justify-center h-48">
              <div className="text-center">
                <CalendarIcon className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="text-slate-500 text-sm">Today, Dec 7</p>
              </div>
            </div>
          </DashboardCard>

          <DashboardCard title="Rating">
            <div className="flex items-end gap-2">
              <span className="text-4xl font-bold text-slate-900 dark:text-white">4.8</span>
              <div className="mb-1 text-yellow-400">★★★★★</div>
            </div>
            <p className="text-sm text-slate-500 mt-1">Based on 68 reviews</p>
          </DashboardCard>
        </div>

        {/* Middle Column: Current Trip */}
        <DashboardCard title="Current Trip" className="lg:col-span-1">
          <div className="relative pl-6 border-l-2 border-slate-100 dark:border-slate-800 space-y-8 py-2">
            {/* Departure */}
            <div className="relative">
              <div className="absolute -left-[31px] top-1 w-4 h-4 rounded-full border-2 border-blue-500 bg-white"></div>
              <p className="text-xs text-slate-400 mb-1">Departure</p>
              <h4 className="font-semibold text-slate-900 dark:text-white">Casablanca, Port Station</h4>
              <p className="text-sm text-slate-500">10:45 AM</p>
            </div>

            {/* Stop */}
            <div className="relative">
              <div className="absolute -left-[31px] top-1 w-4 h-4 rounded-full border-2 border-slate-300 bg-white"></div>
              <p className="text-xs text-slate-400 mb-1">Stop</p>
              <h4 className="font-semibold text-slate-900 dark:text-white">Rabat, Agdal</h4>
              <p className="text-sm text-slate-500">12:15 PM</p>
            </div>

            {/* Arrival */}
            <div className="relative">
              <div className="absolute -left-[30px] top-1 w-4 h-4 rounded-full bg-slate-900 dark:bg-white"></div>
              <p className="text-xs text-slate-400 mb-1">Arrival</p>
              <h4 className="font-semibold text-slate-900 dark:text-white">Tangier, City Center</h4>
              <p className="text-sm text-slate-500">2:30 PM</p>
            </div>
          </div>

          <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 flex items-center justify-center gap-2 text-blue-600 dark:text-blue-400">
            <Clock className="w-5 h-5" />
            <span className="font-medium">Duration: 3 hours 45 min</span>
          </div>
        </DashboardCard>

        {/* Right Column: Map */}
        <div className="lg:col-span-1 h-full min-h-[300px] bg-slate-200 rounded-3xl overflow-hidden relative">
          <div className="absolute inset-0 bg-[url('/map-pattern.png')] opacity-20"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <Button className="bg-white text-slate-900 hover:bg-slate-50 shadow-lg gap-2 rounded-full px-6">
              <Radio className="w-4 h-4 text-blue-600" />
              Live Navigation
            </Button>
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Schedule of Trips */}
        <DashboardCard title="Schedule of trips">
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="flex flex-col">
                    <span className="font-medium text-slate-900">Casablanca</span>
                  </div>
                  <div className="text-xs text-slate-400">3hr 45m</div>
                  <div className="flex flex-col">
                    <span className="font-medium text-slate-900">Tangier</span>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className="text-xs text-slate-500">04/15/2025 • 8:51 AM</span>
                  <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-700">Planned</span>
                </div>
              </div>
            ))}
          </div>
        </DashboardCard>

        {/* Current Vehicle */}
        <DashboardCard title="Current vehicle">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1 space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><Fuel className="w-5 h-5" /></div>
                <div>
                  <p className="text-xs text-slate-500">Fuel Type</p>
                  <p className="font-medium text-slate-900">Diesel (8 km/liter)</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-50 text-purple-600 rounded-lg"><Ruler className="w-5 h-5" /></div>
                <div>
                  <p className="text-xs text-slate-500">Length</p>
                  <p className="font-medium text-slate-900">12.5 meters</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg"><FileCheck className="w-5 h-5" /></div>
                <div>
                  <p className="text-xs text-slate-500">License Plate</p>
                  <p className="font-medium text-slate-900">WA-12345-AB</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-50 text-orange-600 rounded-lg"><Key className="w-5 h-5" /></div>
                <div>
                  <p className="text-xs text-slate-500">Service Due</p>
                  <p className="font-medium text-slate-900">09/15/2025</p>
                </div>
              </div>
            </div>
            {/* Vehicle Image Placeholder */}
            <div className="flex-1 bg-slate-100 rounded-xl h-40 md:h-auto flex items-center justify-center">
              <Truck className="w-16 h-16 text-slate-300" />
            </div>
          </div>
        </DashboardCard>
      </div>
    </div>
  );
}
