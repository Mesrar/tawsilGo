"use client";

import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { DashboardSidebar } from "./Sidebar";
import { useState } from "react";

interface MobileSidebarProps {
    items: any[];
}

export function MobileSidebar({ items }: MobileSidebarProps) {
    const [open, setOpen] = useState(false);

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden text-slate-500 hover:text-slate-900">
                    <Menu className="h-6 w-6" />
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 bg-transparent border-0 w-72">
                {/* Reusing DashboardSidebar but ensuring it shows up */}
                <DashboardSidebar items={items} className="flex h-full relative border-r-0" />
            </SheetContent>
        </Sheet>
    );
}
