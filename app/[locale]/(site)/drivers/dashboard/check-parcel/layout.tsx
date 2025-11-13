"use client";

import { useEffect, useState } from "react";
import CheckParcelPage from "./page";
import MobileDriverDashboard from "@/components/Driver/MobileDriverDashboard";
import MobileCheckParcelPage from "@/components/Driver/MobileCheckParcelPage";

export default function CheckParcelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [mounted, setMounted] = useState(false);

  // Only render the mobile version after mounting to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // If not mounted yet, return nothing to avoid hydration errors
  if (!mounted) return null;

  // For mobile devices, use the mobile-optimized version
  if (isMobile) {
    return (
      <MobileDriverDashboard>
        <MobileCheckParcelPage />
      </MobileDriverDashboard>
    );
  }

  // For desktop, use the original layout with children
  return children;
}

function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    setMatches(media.matches);

    const listener = (e: MediaQueryListEvent) => setMatches(e.matches);
    media.addEventListener('change', listener);
    
    return () => media.removeEventListener('change', listener);
  }, [query]);

  return matches;
}
