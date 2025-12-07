import { getMessages } from "next-intl/server";
import { NextIntlClientProvider } from "next-intl";
import { DashboardSidebar, organizationNavItems } from "@/components/dashboard/Sidebar";
import { MobileSidebar } from "@/components/dashboard/MobileSidebar";
import { UserDropdown } from "@/components/Header/user-dropdown";
import ThemeToggler from "@/components/Header/ThemeToggler";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth"; // Verify this path
import Image from "next/image";
import Link from "next/link";
import { Bell } from "lucide-react";

export default async function OrganizationLayout({
  children,
  params: { locale }
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const messages = await getMessages();
  const session = await getServerSession(authOptions);

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex transition-colors duration-300">
        {/* Sidebar */}
        <DashboardSidebar items={organizationNavItems} className="hidden lg:flex" />

        {/* Main Content */}
        <div className="flex-1 flex flex-col lg:pl-72 transition-all duration-300">
          {/* Top Header */}
          <header className="h-16 px-6 lg:px-8 border-b border-slate-100 bg-white/50 backdrop-blur-sm sticky top-0 z-30 flex items-center justify-between lg:justify-end">
            <div className="lg:hidden flex items-center gap-4 mr-auto">
              <MobileSidebar items={organizationNavItems} />
              <div className="font-bold text-xl text-blue-600">TawsilGo</div>
            </div>
            <div className="flex items-center gap-4">
              <button className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors relative">
                <Bell className="w-5 h-5" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
              </button>
              <div className="h-8 w-px bg-slate-200" />
              <div className="flex items-center gap-2">
                <LanguageSwitcher />
                <ThemeToggler />
                {session?.user && <UserDropdown user={session.user} />}
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
