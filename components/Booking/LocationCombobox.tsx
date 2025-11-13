"use client";

import * as React from "react";
import { Check, ChevronsUpDown, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useTranslations } from "next-intl";

interface LocationComboboxProps {
  value: string;
  onChange: (value: string) => void;
  locations: string[];
  placeholder?: string;
  label?: string;
  required?: boolean;
}

export function LocationCombobox({
  value,
  onChange,
  locations,
  placeholder = "Select location...",
  label = "Location",
  required = false,
}: LocationComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const t = useTranslations("booking.locationCombobox");

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium flex items-center gap-2">
        <MapPin className="h-4 w-4 text-primary" strokeWidth={2} />
        {label}
        {required && <span className="text-destructive">*</span>}
      </label>

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn(
              "w-full h-12 rounded-xl border-slate-200 justify-between",
              !value && "text-muted-foreground"
            )}
          >
            <div className="flex items-center gap-2 truncate">
              <MapPin className="h-5 w-5 text-slate-400 flex-shrink-0" />
              <span className="truncate">{value || placeholder}</span>
            </div>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0" align="start">
          <Command>
            <CommandInput
              placeholder={t("searchPlaceholder", {label: label.toLowerCase()})}
              value={value}
              onValueChange={onChange}
            />
            <CommandList>
              <CommandEmpty>
                <div className="py-6 text-center text-sm">
                  <p>{t("noLocationFound")}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {t("typeCustom")}
                  </p>
                </div>
              </CommandEmpty>
              <CommandGroup heading={t("popularLocations")}>
                {locations.map((location) => (
                  <CommandItem
                    key={location}
                    value={location}
                    onSelect={(currentValue) => {
                      onChange(currentValue === value ? "" : currentValue);
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === location ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {location}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
