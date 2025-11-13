import React from 'react';

/**
 * Modern icon component using Heroicons-style stroke-based icons
 * Optimized for mobile display with WCAG-compliant touch targets
 */
export function Icon({ 
  name, 
  size = 'md', 
  strokeWidth = 1.5,
  className = '',
  color = 'currentColor' 
}) {
  // Size presets (based on touch guidelines)
  const sizeMap = {
    xs: 'w-4 h-4',      // 16px - small indicators only
    sm: 'w-5 h-5',      // 20px
    md: 'w-6 h-6',      // 24px - standard size
    lg: 'w-8 h-8',      // 32px
    xl: 'w-10 h-10',    // 40px
    touch: 'w-12 h-12', // 48px - WCAG compliant minimum touch target
  };

  const sizeClass = sizeMap[size] || sizeMap.md;
  
  // Icon path definitions
  const icons = {
    // Navigation
    home: (
      <path 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
      />
    ),
    menu: (
      <path 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
      />
    ),
    search: (
      <path 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
      />
    ),
    
    // Shipping & Logistics
    package: (
      <path 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9"
      />
    ),
    truck: (
      <path 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12"
      />
    ),
    mapPin: (
      <path 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
        /><path 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
      />
    ),
    calendar: (
      <path 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"
      />
    ),
    
    // UI Elements
    chevronRight: (
      <path 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        d="M8.25 4.5l7.5 7.5-7.5 7.5"
      />
    ),
    chevronDown: (
      <path 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        d="M19.5 8.25l-7.5 7.5-7.5-7.5"
      />
    ),
    plus: (
      <path 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        d="M12 4.5v15m7.5-7.5h-15"
      />
    ),
    x: (
      <path 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        d="M6 18L18 6M6 6l12 12"
      />
    ),
    
    // User interface
    user: (
      <path 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
      />
    ),
    shield: (
      <path 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
      />
    ),
    bell: (
      <path 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"
      />
    ),
    
    // Money & Payments
    currencyDollar: (
      <path 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    ),
    creditCard: (
      <path 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z"
      />
    )
  };

  if (!icons[name]) {
    console.warn(`Icon "${name}" not found in icon library`);
    return null;
  }

  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke={color}
      strokeWidth={strokeWidth}
      className={`${sizeClass} ${className}`}
      aria-hidden="true"
    >
      {icons[name]}
    </svg>
  );
}