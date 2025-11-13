'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState, useEffect, createContext, useContext } from 'react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';

// Create a context for managing mobile viewport state
const MobileContext = createContext({
  isMobileView: true,
  viewportWidth: 0,
  viewportHeight: 0,
  isLandscape: false,
});

// Custom hook for mobile-specific functionality
export const useMobile = () => useContext(MobileContext);

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());
  
  // Mobile viewport state
  const [mobileState, setMobileState] = useState({
    isMobileView: true,
    viewportWidth: 0,
    viewportHeight: 0,
    isLandscape: false,
  });

  // Effect to monitor viewport dimensions and orientation
  useEffect(() => {
    // Set initial values
    updateViewportDimensions();
    
    // Add event listeners
    window.addEventListener('resize', updateViewportDimensions);
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', updateViewportDimensions);
    };
  }, []);

  // Update viewport dimensions and orientation
  const updateViewportDimensions = () => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    
    setMobileState({
      isMobileView: width <= 768,
      viewportWidth: width,
      viewportHeight: height,
      isLandscape: width > height,
    });
  };

  return (
    <QueryClientProvider client={queryClient}>
      <NextThemesProvider 
        attribute="class" 
        defaultTheme="system" 
        enableSystem
        disableTransitionOnChange
      >
        <MobileContext.Provider value={mobileState}>
          {children}
        </MobileContext.Provider>
      </NextThemesProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}