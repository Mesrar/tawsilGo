"use client";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { MapPin, Calendar as CalendarIcon, X, Loader2, Search, Info, Globe } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FlagIcon } from "react-flag-kit";
import { format, addDays } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { LocationCombobox } from "./LocationCombobox";
import { useTranslations } from "next-intl";
import { COUNTRIES } from "@/lib/const";

export const SearchForm = ({
  departureFilter: departureCityFilter,
  setDepartureCityFilter: setDepartureCityFilter,
  destinationFilter: destinationCityFilter,
  setDestinationFilter: setDestinationCityFilter,
  departureCountryFilter,
  setDepartureCountryFilter,
  destinationCountryFilter,
  setDestinationCountryFilter,
  dateFilter,
  setDateFilter,
  isLoading,
  handleFilter,
  clearFilters,
  popularLocations,
  activeStep = "search",
}: {
  departureCountryFilter: string;
  setDepartureCountryFilter: (value: string) => void;
  destinationCountryFilter: string;
  setDestinationCountryFilter: (value: string) => void;
  departureFilter: string;
  setDepartureCityFilter: (value: string) => void;
  destinationFilter: string;
  setDestinationFilter: (value: string) => void;
  dateFilter: Date | undefined;
  setDateFilter: (date: Date | undefined) => void;
  isLoading: boolean;
  handleFilter: () => void;
  clearFilters: () => void;
  popularLocations: string[];
  activeStep: string;
}) => {
  const t = useTranslations("booking.searchForm");
  const tCountries = useTranslations("countries");

  // Search mode state
  const [searchMode, setSearchMode] = useState<"country" | "city">("country");
  const [showCityRefinement, setShowCityRefinement] = useState(false);

  // Remember last search mode
  useEffect(() => {
    const savedMode = localStorage.getItem("tawsilgo_search_mode");
    if (savedMode === "city" || savedMode === "country") {
      setSearchMode(savedMode);
    }
  }, []);

  // Save search mode preference
  useEffect(() => {
    localStorage.setItem("tawsilgo_search_mode", searchMode);
  }, [searchMode]);

  // Handle mode switch with confirmation
  const handleModeSwitch = (newMode: "country" | "city") => {
    const hasCountryData = departureCountryFilter || destinationCountryFilter;
    const hasCityData = departureCityFilter || destinationCityFilter;
    const hasData = hasCountryData || hasCityData;

    if (hasData && newMode !== searchMode) {
      if (window.confirm(t("modeSwitchConfirm") || "Switch search mode? Current selections will be cleared.")) {
        setSearchMode(newMode);
        clearFilters();
        setShowCityRefinement(false);
      }
    } else {
      setSearchMode(newMode);
    }
  };

  return (
  <motion.div
         initial={{ opacity: 0, y: 10 }}
         animate={{ opacity: 1, y: 0 }}
         transition={{ duration: 0.3 }}
       >
         <Card className="border border-slate-200 dark:border-white/10
  bg-white/95 dark:bg-slate-900/95
  backdrop-blur-md shadow-lg dark:shadow-2xl
  rounded-xl overflow-hidden
  ring-1 ring-moroccan-mint/5 dark:ring-moroccan-mint/10">
           <CardContent className="p-4 pt-4">
             <div className="space-y-4">
               {/* Search Mode Toggle */}
               <div className="pb-2 border-b border-slate-100">
                 <label className="text-xs font-medium text-slate-600 mb-2 block">
                   {t("searchMode") || "Choose your search level:"}
                 </label>
                 <RadioGroup value={searchMode} onValueChange={handleModeSwitch} className="flex gap-3">
                   <div className="flex items-center space-x-2">
                     <RadioGroupItem value="country" id="country" className="border-primary" />
                     <Label
                       htmlFor="country"
                       className="text-sm font-medium cursor-pointer flex items-center gap-1.5"
                     >
                       <Globe className="h-3.5 w-3.5 text-primary" />
                       {t("countryToCountry") || "Country-to-Country"}
                       <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                         {t("faster") || "Faster"}
                       </Badge>
                     </Label>
                   </div>
                   <div className="flex items-center space-x-2">
                     <RadioGroupItem value="city" id="city" className="border-primary" />
                     <Label
                       htmlFor="city"
                       className="text-sm font-medium cursor-pointer flex items-center gap-1.5"
                     >
                       <MapPin className="h-3.5 w-3.5 text-primary" />
                       {t("cityToCity") || "City-to-City"}
                       <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                         {t("precise") || "Precise"}
                       </Badge>
                     </Label>
                   </div>
                 </RadioGroup>
               </div>

               {/* Country Search Mode */}
               <AnimatePresence mode="wait">
                 {searchMode === "country" && (
                   <motion.div
                     key="country-mode"
                     initial={{ opacity: 0, height: 0 }}
                     animate={{ opacity: 1, height: "auto" }}
                     exit={{ opacity: 0, height: 0 }}
                     transition={{ duration: 0.2 }}
                     className="space-y-4"
                   >
                     {/* From Country */}
                     <div className="space-y-2">
                       <label className="text-sm font-medium flex items-center gap-2">
                         <Globe className="h-4 w-4 text-slate-500" strokeWidth={2} />
                         {t("fromCountry") || "From Country"}
                         <span className="text-red-500">*</span>
                       </label>
                       <Select value={departureCountryFilter} onValueChange={setDepartureCountryFilter}>
                         <SelectTrigger className="w-full h-12 rounded-xl border-slate-200">
                           <SelectValue placeholder={t("selectDepartureCountry") || "Select departure country"} />
                         </SelectTrigger>
                         <SelectContent className="rounded-xl">
                           {COUNTRIES.map((country) => (
                             <SelectItem key={country.value} value={country.value}>
                               <div className="flex items-center gap-3">
                                 <FlagIcon code={country.code} className="w-5 h-5" />
                                 <span>{tCountries(country.value)}</span>
                               </div>
                             </SelectItem>
                           ))}
                         </SelectContent>
                       </Select>
                     </div>

                     {/* To Country */}
                     <div className="space-y-2">
                       <label className="text-sm font-medium flex items-center gap-2">
                         <Globe className="h-4 w-4 text-slate-500" strokeWidth={2} />
                         {t("toCountry") || "To Country"}
                         <span className="text-red-500">*</span>
                       </label>
                       <Select value={destinationCountryFilter} onValueChange={setDestinationCountryFilter}>
                         <SelectTrigger className="w-full h-12 rounded-xl border-slate-200">
                           <SelectValue placeholder={t("selectDestinationCountry") || "Select destination country"} />
                         </SelectTrigger>
                         <SelectContent className="rounded-xl">
                           {COUNTRIES.map((country) => (
                             <SelectItem key={country.value} value={country.value}>
                               <div className="flex items-center gap-3">
                                 <FlagIcon code={country.code} className="w-5 h-5" />
                                 <span>{tCountries(country.value)}</span>
                               </div>
                             </SelectItem>
                           ))}
                         </SelectContent>
                       </Select>
                     </div>

                     {/* Optional City Refinement */}
                     <div>
                       <Button
                         variant="ghost"
                         size="sm"
                         type="button"
                         onClick={() => setShowCityRefinement(!showCityRefinement)}
                         className="text-primary hover:text-primary/80 text-xs h-8 px-2"
                       >
                         {showCityRefinement ? "−" : "+"} {t("refineByCities") || "Optional: Refine by specific cities"}
                       </Button>

                       <AnimatePresence>
                         {showCityRefinement && (
                           <motion.div
                             initial={{ opacity: 0, height: 0 }}
                             animate={{ opacity: 1, height: "auto" }}
                             exit={{ opacity: 0, height: 0 }}
                             transition={{ duration: 0.2 }}
                             className="space-y-3 mt-3 pt-3 border-t border-slate-100"
                           >
                             <LocationCombobox
                               value={departureCityFilter}
                               onChange={setDepartureCityFilter}
                               locations={popularLocations}
                               placeholder={t("optionalDepartureCity") || "Optional: Specific departure city"}
                               label={t("departureCity") || "Departure City (Optional)"}
                               required={false}
                             />
                             <LocationCombobox
                               value={destinationCityFilter}
                               onChange={setDestinationCityFilter}
                               locations={popularLocations}
                               placeholder={t("optionalDestinationCity") || "Optional: Specific destination city"}
                               label={t("destinationCity") || "Destination City (Optional)"}
                               required={false}
                             />
                           </motion.div>
                         )}
                       </AnimatePresence>
                     </div>
                   </motion.div>
                 )}

                 {/* City Search Mode */}
                 {searchMode === "city" && (
                   <motion.div
                     key="city-mode"
                     initial={{ opacity: 0, height: 0 }}
                     animate={{ opacity: 1, height: "auto" }}
                     exit={{ opacity: 0, height: 0 }}
                     transition={{ duration: 0.2 }}
                     className="space-y-4"
                   >
                     {/* From Location - Enhanced with Combobox */}
                     <LocationCombobox
                       value={departureCityFilter}
                       onChange={setDepartureCityFilter}
                       locations={popularLocations}
                       placeholder={t("placeholders.cityOrPostcode")}
                       label={t("departure")}
                       required
                     />

                     {/* To Location - Enhanced with Combobox */}
                     <LocationCombobox
                       value={destinationCityFilter}
                       onChange={setDestinationCityFilter}
                       locations={popularLocations}
                       placeholder={t("placeholders.cityOrPostcode")}
                       label={t("destination")}
                       required
                     />
                   </motion.div>
                 )}
               </AnimatePresence>
               
               {/* Date Picker - Touch optimized with shadcn Calendar */}
               <div className="space-y-2">
                 <label className="text-sm font-medium flex items-center gap-2">
                   <CalendarIcon className="h-4 w-4 text-slate-500" strokeWidth={2} />
                   {t("departureDate")}
                 </label>

                 <Popover>
                   <PopoverTrigger asChild>
                     <Button
                       variant="outline"
                       className={cn(
                         "w-full h-12 rounded-xl border-slate-200 justify-start text-left font-normal",
                         !dateFilter && "text-muted-foreground"
                       )}
                     >
                       <CalendarIcon className="mr-2 h-5 w-5 text-slate-400" />
                       {dateFilter ? format(dateFilter, "PPP") : <span>{t("placeholders.selectDate")}</span>}
                     </Button>
                   </PopoverTrigger>
                   <PopoverContent className="w-auto p-0" align="start">
                     <Calendar
                       mode="single"
                       selected={dateFilter}
                       onSelect={setDateFilter}
                       disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                       initialFocus
                     />
                   </PopoverContent>
                 </Popover>

                 {/* Quick date selection with touch-friendly badges */}
                 <div className="flex flex-wrap gap-2 mt-1">
                   <Badge
                     variant="outline"
                     className="cursor-pointer py-1.5 px-3 text-xs rounded-full hover:bg-primary/10 border-slate-200"
                     onClick={() => setDateFilter(new Date())}
                   >
                     {t("quickDates.today")}
                   </Badge>
                   <Badge
                     variant="outline"
                     className="cursor-pointer py-1.5 px-3 text-xs rounded-full hover:bg-primary/10 border-slate-200"
                     onClick={() => setDateFilter(addDays(new Date(), 1))}
                   >
                     {t("quickDates.tomorrow")}
                   </Badge>
                 </div>
               </div>
             </div>
             
             {/* Action buttons in thumb-friendly position */}
             <div className="mt-6 space-y-3">
               <Button
                 onClick={handleFilter}
                 disabled={
                   isLoading ||
                   (searchMode === "country"
                     ? !departureCountryFilter || !destinationCountryFilter
                     : !departureCityFilter || !destinationCityFilter)
                 }
                 className="w-full h-12 rounded-xl bg-primary hover:bg-primary/90 text-slate-900 font-medium shadow-sm disabled:opacity-50"
               >
                 {isLoading ? (
                   <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                 ) : (
                   <Search className="mr-2 h-5 w-5" />
                 )}
                 {t("buttons.findTrips")}
               </Button>

               <Button
                 variant="outline"
                 onClick={() => {
                   clearFilters();
                   setShowCityRefinement(false);
                 }}
                 disabled={
                   !departureCityFilter &&
                   !destinationCityFilter &&
                   !departureCountryFilter &&
                   !destinationCountryFilter &&
                   !dateFilter
                 }
                 className="w-full h-12 rounded-xl text-slate-500 border-slate-200 hover:bg-slate-50"
               >
                 <X className="mr-2 h-5 w-5" />
                 {t("buttons.clearFilters")}
               </Button>
             </div>
           </CardContent>
         </Card>
       </motion.div>
  );
};
