import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { DashboardSidebar, adminNavItems } from "@/components/dashboard/Sidebar";
import { MobileSidebar } from "@/components/dashboard/MobileSidebar";
import Image from "next/image";

export default async function AdminLayout({
    children,
    params: { locale }
}: {
    children: React.ReactNode;
    params: { locale: string };
}) {
    const messages = await getMessages();

    return (
        <NextIntlClientProvider locale={locale} messages={messages}>
            <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex transition-colors duration-300">
                {/* Sidebar */}
                <DashboardSidebar items={adminNavItems} className="hidden lg:flex" />

                {/* Main Content */}
                <div className="flex-1 flex flex-col lg:pl-72 transition-all duration-300">
                    {/* Top Header for Mobile/Tablet or just User Profile */}
                    <header className="h-16 px-6 lg:px-8 border-b border-slate-100 bg-white/50 backdrop-blur-sm sticky top-0 z-30 flex items-center justify-between lg:justify-end gap-4">
                        <div className="lg:hidden flex items-center gap-4">
                            <MobileSidebar items={adminNavItems} />
                            <div className="font-bold text-xl text-blue-600">TawsilGo</div>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                                <div className="text-right hidden sm:block">
                                    <p className="text-sm font-medium text-slate-900 dark:text-slate-100">Admin User</p>
                                    <p className="text-xs text-slate-500">Administrator</p>
                                </div>
                                <div className="h-9 w-9 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold border-2 border-white shadow-sm">
                                    A
                                </div>
                            </div>
                        </div>
                    </header>

                    <main className="flex-1 p-6 lg:p-8">
                        <div className="max-w-7xl mx-auto space-y-6">
                            {children}
                        </div>
                    </main>
                </div>
            </div>
        </NextIntlClientProvider>
    );
}
