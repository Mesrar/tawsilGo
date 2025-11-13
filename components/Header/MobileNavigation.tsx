import React from 'react';
import Link from 'next/link';
import { Icon } from '@/components/Icons/Icon';

/**
 * Mobile-first navigation bar component
 * - Optimized for 375x812px viewport (iPhone 13 Mini)
 * - Uses touch-friendly targets (48x48px minimum)
 * - Implements system font stack
 */
export default function MobileNavigation() {
  const navItems = [
    { name: 'Home', icon: 'home', href: '/' },
    { name: 'Morocco', icon: 'mapPin', href: '/morocco', highlight: true },
    { name: 'Track', icon: 'truck', href: '/tracking' },
    { name: 'Profile', icon: 'user', href: '/users/profil' },
  ];

  return (
    <nav className="mobile-nav no-scrollbar">
      {navItems.map((item) => (
        <Link
          key={item.name}
          href={item.href}
          className={`mobile-nav-item group ${item.highlight ? 'relative' : ''}`}
        >
          {item.highlight && (
            <span className="absolute -top-1 -right-1 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-moroccan-mint opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-moroccan-mint"></span>
            </span>
          )}
          <Icon
            name={item.icon}
            size="md"
            strokeWidth={1.5}
            className={`transition-colors ${
              item.highlight
                ? 'text-moroccan-mint-600 group-hover:text-moroccan-mint dark:text-moroccan-mint-400 dark:group-hover:text-moroccan-mint-300'
                : 'text-slate-600 group-hover:text-moroccan-mint dark:text-slate-300 dark:group-hover:text-moroccan-mint-300'
            }`}
          />
          <span className={`text-xs mt-1 font-medium transition-colors ${
            item.highlight
              ? 'text-moroccan-mint-600 group-hover:text-moroccan-mint dark:text-moroccan-mint-400 dark:group-hover:text-moroccan-mint-300'
              : 'text-slate-600 group-hover:text-moroccan-mint dark:text-slate-300 dark:group-hover:text-moroccan-mint-300'
          }`}>
            {item.name}
          </span>
        </Link>
      ))}
    </nav>
  );
}