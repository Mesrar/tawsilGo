"use client";

import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import { ArrowLeft, MapPin, Calendar, ArrowRight, Search, Filter, X, Check } from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TripSelectionGrid } from "@/components/Booking/available-trips";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle,
  SheetFooter,
  SheetClose,
  SheetTrigger 
} from "@/components/ui/sheet";
import { TripSelectionCardProps } from "@/types/trip";

// Skeleton loader for trip items
const TripItemSkeleton = () => (
  <div className="animate-pulse space-y-4 px-4 py-5 border-b border-slate-100">
    <div className="flex justify-between items-center">
      <div className="space-y-3">
        <div className="h-5 w-32 bg-slate-200 rounded"></div>
        <div className="h-4 w-28 bg-slate-100 rounded"></div>
      </div>
      <div className="h-10 w-24 bg-slate-200 rounded-md"></div>
    </div>
    <div className="flex items-center gap-2 mt-3">
      <div className="h-6 w-6 rounded-full bg-slate-200"></div>
      <div className="h-3 w-16 bg-slate-100 rounded"></div>
    </div>
  </div>
);

export function TripSelectionCard({
  departureFilter,
  destinationFilter,
  dateFilter,
  isLoading,
  onEditSearch,
  onTripSelected,
  onBookTrip,
  departureCountry: departureCountryFilter = "",
  destinationCountry: destinationCountryFilter = ""
}: TripSelectionCardProps) {
  const t = useTranslations('booking.tripSelection');
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  
  const fromLocation = departureFilter || departureCountryFilter;
  const toLocation = destinationFilter || destinationCountryFilter;

  // Filter options for the sheet
  const filterOptions = [
    { id: 'price', label: 'Price: Low to High' },
    { id: 'time', label: 'Departure Time' },
    { id: 'duration', label: 'Shortest Duration' },
    { id: 'capacity', label: 'Available Capacity' }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="pb-16"
    >
      {/* Trip header - Simplified and more thumb-friendly */}
      <div className="mb-5">
        {/* Back button and title in a more prominent position */}
        <div className="flex items-center justify-between mb-4">
          <Button
            variant="ghost"
            size="sm"
            className="h-12 w-12 p-0 rounded-full text-slate-700 hover:bg-slate-100"
            onClick={onEditSearch}
            aria-label="Go back to search"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          
          <h1 className="text-xl font-semibold">{t('availableRoutes')}</h1>
          
          {/* Filter button in thumb-friendly zone */}
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="h-12 w-12 p-0 rounded-full border-slate-200"
                aria-label="Filter options"
              >
                <Filter className="h-5 w-5 text-slate-600" />
              </Button>
            </SheetTrigger>
            
            <SheetContent side="bottom" className="rounded-t-xl max-h-[80vh]">
              <SheetHeader className="mb-5">
                <SheetTitle className="text-lg">Sort & Filter</SheetTitle>
              </SheetHeader>
              
              <div className="space-y-5">
                <div className="space-y-3">
                  <h3 className="text-sm font-medium text-slate-500">Sort by</h3>
                  <div className="grid grid-cols-1 gap-2">
                    {filterOptions.map(option => (
                      <Button
                        key={option.id}
                        variant="outline"
                        className={cn(
                          "justify-start h-12 border-slate-200 font-normal",
                          activeFilter === option.id && "border-primary text-primary bg-primary/5"
                        )}
                        onClick={() => setActiveFilter(option.id)}
                      >
                        <span className="flex-1 text-left">{option.label}</span>
                        {activeFilter === option.id && (
                          <Check className="h-4 w-4 text-primary" />
                        )}
                      </Button>
                    ))}
                  </div>
                </div>
                
                <div className="py-3 space-y-3">
                  <h3 className="text-sm font-medium text-slate-500">Route details</h3>
                  <div className="bg-slate-50 rounded-lg p-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">From</span>
                      <span className="text-sm text-slate-600">{fromLocation}</span>
                    </div>
                    <div className="my-2 border-t border-slate-200"></div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">To</span>
                      <span className="text-sm text-slate-600">{toLocation}</span>
                    </div>
                    {dateFilter && (
                      <>
                        <div className="my-2 border-t border-slate-200"></div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">Date</span>
                          <span className="text-sm text-slate-600">{format(dateFilter, "d MMMM yyyy")}</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
              
              <SheetFooter className="flex flex-col gap-3 mt-6 sm:flex-row">
                <SheetClose asChild>
                  <Button 
                    variant="outline"
                    className="w-full rounded-lg h-12 border-slate-200"
                  >
                    Cancel
                  </Button>
                </SheetClose>
                
                <SheetClose asChild>
                  <Button 
                    className="w-full rounded-lg h-12"
                    onClick={() => {
                      // Apply filters here
                    }}
                  >
                    Apply
                  </Button>
                </SheetClose>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </div>
        
        {/* Route summary with consistent badging */}
        <div className="bg-slate-50 rounded-xl p-4 flex items-center">
          <div className="flex-1 flex items-center">
            <div className="flex flex-col items-center mr-2">
              <MapPin className="h-5 w-5 text-primary mb-1" strokeWidth={2} />
              <div className="w-0.5 h-6 bg-slate-300"></div>
              <MapPin className="h-5 w-5 text-red-500 mt-1" strokeWidth={2} />
            </div>
            
            <div className="flex flex-col">
              <span className="text-sm font-medium">{fromLocation}</span>
              <span className="text-xs text-slate-500 my-1">to</span>
              <span className="text-sm font-medium">{toLocation}</span>
            </div>
          </div>
          
          {dateFilter && (
            <Badge variant="outline" className="h-8 bg-white border-slate-200 text-slate-700 px-3 flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 text-primary" strokeWidth={2} />
              {format(dateFilter, "d MMM")}
            </Badge>
          )}
        </div>
      </div>

      {/* Trip results with enhanced skeleton loading */}
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Card className="shadow-sm border border-slate-100 bg-white rounded-xl overflow-hidden">
            {isLoading ? (
              <div className="divide-y divide-slate-100">
                {[1, 2, 3].map((i) => (
                  <TripItemSkeleton key={i} />
                ))}
              </div>
            ) : (
              <CardContent className="p-0">
                <TripSelectionGrid
                  departureFilter={departureFilter}
                  destinationFilter={destinationFilter}
                  dateFilter={dateFilter}
                  departureCountry={departureCountryFilter}
                  destinationCountry={destinationCountryFilter}
                  onTripSelected={onTripSelected}
                  onBookTrip={onBookTrip}
                />
                
                {/* Empty state - show this when no trips are found */}
                {false && (
                  <div className="py-10 px-4 text-center">
                    <div className="bg-slate-50 rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-4">
                      <Search className="h-6 w-6 text-slate-400" />
                    </div>
                    <h3 className="font-medium text-lg mb-2">No trips found</h3>
                    <p className="text-slate-500 text-sm mb-4">Try adjusting your search criteria or dates.</p>
                    <Button onClick={onEditSearch} className="h-11">
                      Modify Search
                    </Button>
                  </div>
                )}
              </CardContent>
            )}
          </Card>
        </motion.div>
      </AnimatePresence>
      
      {/* Thumb-friendly bottom navigation - modernized and simplified */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-slate-100 shadow-lg z-50 md:hidden">
        <Button 
          className="w-full h-12 rounded-lg bg-primary hover:bg-primary/90 text-white font-medium"
          onClick={onEditSearch}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          New Search
        </Button>
      </div>
    </motion.div>
  );
}