"use client";

import { usePathname } from "next/navigation";

import Footer from "@/components/Footer";
import Lines from "@/components/Lines";
import ScrollToTop from "@/components/ScrollToTop";
import ToasterContext from "../../context/ToastContext";
import { ThemeProvider } from "@/components/ThemProvider/ThemProvider";
import { Header } from "@/components/Header";
import { SessionProvider } from "next-auth/react";
import { Providers } from "../../providers";
import { AuthProvider } from "@/lib/auth-context";
import SessionMonitor from "@/components/SessionMonito";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isDashboard = pathname?.includes("/admin") || pathname?.includes("/drivers/dashboard") || pathname?.includes("/organizations");

  return (
    <SessionProvider>
      <Providers>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Lines />
          <Header />
          <ToasterContext />
          <AuthProvider>
            <SessionMonitor>{children}</SessionMonitor>
          </AuthProvider>
          {!isDashboard && <Footer />}
          <ScrollToTop />
        </ThemeProvider>
      </Providers>
    </SessionProvider>
  );
}
