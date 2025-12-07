import { cn } from "@/lib/utils";

interface DashboardCardProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
    title?: string;
    action?: React.ReactNode;
}

export function DashboardCard({ children, title, action, className, ...props }: DashboardCardProps) {
    return (
        <div
            className={cn(
                "bg-white rounded-[24px] p-6 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] dark:bg-slate-900 border border-slate-100 dark:border-slate-800",
                className
            )}
            {...props}
        >
            {(title || action) && (
                <div className="flex items-center justify-between mb-6">
                    {title && <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">{title}</h3>}
                    {action && <div>{action}</div>}
                </div>
            )}
            {children}
        </div>
    );
}
