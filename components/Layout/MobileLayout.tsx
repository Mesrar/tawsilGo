import React from 'react';
import MobileNavigation from '@/components/Header/MobileNavigation';
import { usePathname } from 'next/navigation';

type MobileLayoutProps = {
  children: React.ReactNode;
  hideNavigation?: boolean;
  fullHeight?: boolean;
};

/**
 * Mobile-first layout component that enforces mobile-first principles
 * - Optimized for 375x812px viewport (iPhone 13 Mini)
 * - Handles safe area insets for modern mobile devices
 * - Provides consistent padding and spacing
 */
export default function MobileLayout({ 
  children, 
  hideNavigation = false,
  fullHeight = false
}: MobileLayoutProps) {
  const pathname = usePathname();
  
  // Determine if we're on a page that should use the full height
  const isFullHeightPage = fullHeight || [
    '/booking',
    '/tracking',
    '/payment',
    '/pickup'
  ].some(path => pathname?.startsWith(path));
  
  return (
    <div className={`
      flex flex-col
      ${isFullHeightPage ? 'min-h-[100svh]' : ''} 
      safe-top safe-left safe-right
      bg-white dark:bg-slate-900
      antialiased
    `}>
      <main className={`
        flex-1 
        mx-auto 
        w-full 
        max-w-[375px] 
        px-4 
        ${!hideNavigation ? 'pb-20' : 'pb-6'} 
        pt-4
      `}>
        {children}
      </main>
      
      {!hideNavigation && <MobileNavigation />}
    </div>
  );
}