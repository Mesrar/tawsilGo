import React from 'react';
import { Icon } from '@/components/Icons/Icon';

type MobileButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  icon?: string;
  iconPosition?: 'left' | 'right';
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  className?: string;
};

/**
 * Mobile-optimized button component that follows WCAG guidelines
 * - Uses minimum 48px height for touch targets
 * - Implements proper loading states
 * - Provides consistent spacing and typography
 */
export default function MobileButton({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'left',
  disabled = false,
  loading = false,
  fullWidth = false,
  className = '',
}: MobileButtonProps) {
  // Size classes for proper touch targets
  const sizeClasses = {
    sm: 'min-h-[40px] text-sm px-4',
    md: 'min-h-[48px] text-base px-5',
    lg: 'min-h-[56px] text-lg px-6',
  };

  // Variant styling with Tailwind
  const variantClasses = {
    primary: 'bg-primary text-white hover:bg-primary/90 active:bg-primary/90 focus:ring-primary/20',
    secondary: 'bg-slate-800 text-white hover:bg-slate-700 active:bg-slate-700 focus:ring-slate-400/20',
    outline: 'bg-transparent border border-slate-300 text-slate-700 hover:bg-slate-50 active:bg-slate-100 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-800/70',
    ghost: 'bg-transparent text-slate-700 hover:bg-slate-100 active:bg-slate-200 dark:text-slate-300 dark:hover:bg-slate-800/70',
  };

  const isDisabled = disabled || loading;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={isDisabled}
      className={`
        relative
        ${sizeClasses[size]}
        ${variantClasses[variant]}
        ${fullWidth ? 'w-full' : ''}
        rounded-lg
        font-medium
        inline-flex
        items-center
        justify-center
        transition-colors
        duration-200
        focus:outline-none
        focus:ring-4
        ${isDisabled ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `}
    >
      {loading && (
        <span className="absolute inset-0 flex items-center justify-center">
          <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </span>
      )}

      <span className={`flex items-center gap-2 ${loading ? 'opacity-0' : ''}`}>
        {icon && iconPosition === 'left' && <Icon name={icon} size="sm" className="shrink-0" />}
        {children}
        {icon && iconPosition === 'right' && <Icon name={icon} size="sm" className="shrink-0" />}
      </span>
    </button>
  );
}