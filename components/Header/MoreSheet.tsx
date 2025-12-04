"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { getMenuData } from "./menuData";
import { cn } from "@/lib/utils";

export function MoreSheet({ children }: { children: React.ReactNode }) {
  const t = useTranslations("navigation");
  const pathname = usePathname();
  const locale = useLocale();
  const isRtl = locale === "ar";
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);
  const menuData = getMenuData(t);

  return (
    <Sheet>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent side={isRtl ? "left" : "right"} className="w-[85vw] max-w-[350px] p-0 bg-white dark:bg-white">
        <SheetHeader className="sr-only">
          <SheetTitle>More Options</SheetTitle>
        </SheetHeader>

        <div className="flex flex-col h-full">
          {/* Header with Language Switcher */}
          <div className="p-4 border-b border-slate-100 dark:border-slate-200">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold text-slate-900">Menu</h2>
              <LanguageSwitcher />
            </div>
          </div>

          {/* Navigation Items */}
          <div className="flex-1 overflow-auto py-2">
            <div className="flex flex-col space-y-1 px-2">
              {menuData.map((item) => (
                <div key={item.title} className="py-1 px-2">
                  {item.submenu ? (
                    <div className="space-y-1">
                      <button
                        onClick={() =>
                          setOpenSubmenu(
                            openSubmenu === item.title ? null : item.title
                          )
                        }
                        className="flex w-full items-center justify-between rounded-lg p-2 text-start text-sm font-medium text-slate-900 hover:bg-slate-100"
                      >
                        {item.title}
                        <ChevronDown
                          className={`h-4 w-4 text-slate-400 transition-transform ${openSubmenu === item.title ? "rotate-180" : ""}`}
                        />
                      </button>
                      <AnimatePresence>
                        {openSubmenu === item.title && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden ml-2 rtl:ml-0 rtl:mr-2"
                          >
                            {item.submenu.map((subItem) => (
                              <Link
                                key={subItem.title}
                                href={subItem.path || "#"}
                                className={cn(
                                  "flex items-center rounded-lg px-3 py-2 text-sm text-slate-900 hover:bg-slate-100",
                                  pathname === subItem.path &&
                                  "bg-slate-100 text-primary font-medium"
                                )}
                              >
                                {subItem.title}
                                {pathname === subItem.path && (
                                  <div className="ml-auto rtl:ml-0 rtl:mr-auto h-1.5 w-1.5 rounded-full bg-primary" />
                                )}
                              </Link>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ) : (
                    <Link
                      href={item.path || "#"}
                      className={cn(
                        "flex items-center rounded-lg px-3 py-2 text-sm text-slate-900 hover:bg-slate-100",
                        pathname === item.path &&
                        "bg-slate-100 text-primary font-medium"
                      )}
                    >
                      {item.title}
                      {pathname === item.path && (
                        <div className="ml-auto rtl:ml-0 rtl:mr-auto h-1.5 w-1.5 rounded-full bg-primary" />
                      )}
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-slate-100 dark:border-slate-200 p-4">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <Link href="/terms" className="hover:underline">
                Terms of Service
              </Link>
              <Link href="/privacy" className="hover:underline">
                Privacy Policy
              </Link>
              <span>© 2025</span>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
