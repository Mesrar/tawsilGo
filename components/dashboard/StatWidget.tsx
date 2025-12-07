import { cn } from "@/lib/utils";
import { DashboardCard } from "./DashboardCard";
import { ArrowUpRight, ArrowDownRight, Minus } from "lucide-react";

interface StatWidgetProps {
    title: string;
    value: string | number;
    icon?: React.ReactNode;
    trend?: {
        value: number;
        label?: string;
        direction: "up" | "down" | "neutral";
    };
    chart?: React.ReactNode;
    className?: string;
    color?: "blue" | "green" | "indigo" | "violet" | "orange" | "red" | "slate" | "emerald";
}

const colorStyles = {
    blue: "text-blue-600 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400",
    green: "text-green-600 bg-green-50 dark:bg-green-900/20 dark:text-green-400",
    indigo: "text-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 dark:text-indigo-400",
    violet: "text-violet-600 bg-violet-50 dark:bg-violet-900/20 dark:text-violet-400",
    orange: "text-orange-600 bg-orange-50 dark:bg-orange-900/20 dark:text-orange-400",
    red: "text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400",
    slate: "text-slate-600 bg-slate-50 dark:bg-slate-800 dark:text-slate-400",
    emerald: "text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 dark:text-emerald-400",
};

export function StatWidget({ title, value, icon, trend, chart, className, color = "blue" }: StatWidgetProps) {
    return (
        <DashboardCard className={cn("relative overflow-hidden", className)}>
            <div className="flex items-start justify-between">
                <div>
                    <div className="flex items-center gap-3 mb-3">
                        {icon && (
                            <div className={cn("p-2 rounded-lg", colorStyles[color] || colorStyles.blue)}>
                                {icon}
                            </div>
                        )}
                        <h4 className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</h4>
                    </div>
                    <div className="flex items-end gap-3">
                        <span className="text-3xl font-bold text-slate-900 dark:text-white">{value}</span>
                        {trend && (
                            <div className={cn(
                                "flex items-center text-xs font-medium px-2 py-1 rounded-full mb-1",
                                trend.direction === "up" ? "text-green-700 bg-green-100 dark:bg-green-900/30 dark:text-green-400" :
                                    trend.direction === "down" ? "text-red-700 bg-red-100 dark:bg-red-900/30 dark:text-red-400" :
                                        "text-slate-700 bg-slate-100 dark:bg-slate-800 dark:text-slate-300"
                            )}>
                                {trend.direction === "up" && <ArrowUpRight className="w-3 h-3 mr-1" />}
                                {trend.direction === "down" && <ArrowDownRight className="w-3 h-3 mr-1" />}
                                {trend.direction === "neutral" && <Minus className="w-3 h-3 mr-1" />}
                                {trend.value}%
                                {trend.label && <span className="ml-1 opacity-70 hidden sm:inline">{trend.label}</span>}
                            </div>
                        )}
                    </div>
                </div>
                {chart && <div className="h-12 w-24">{chart}</div>}
            </div>
        </DashboardCard>
    );
}
