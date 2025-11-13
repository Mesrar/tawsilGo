import React from 'react';
import { Icon } from '@/components/Icons/Icon';

/**
 * Mobile-first input field component
 * - Optimized for touch targets (48px minimum)
 * - Improves readability with system fonts
 * - Designed for iPhone 13 Mini viewport (375px)
 */
type MobileInputProps = {
  id: string;
  label: string;
  placeholder?: string;
  icon?: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  required?: boolean;
  autoComplete?: string;
  className?: string;
};

export default function MobileInput({
  id,
  label,
  placeholder,
  icon,
  type = 'text',
  value,
  onChange,
  error,
  required = false,
  autoComplete,
  className = '',
}: MobileInputProps) {
  return (
    <div className={`mb-4 ${className}`}>
      <label 
        htmlFor={id} 
        className="block text-sm font-medium mb-1.5 text-slate-700 dark:text-slate-300"
      >
        {label}{required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      
      <div className={`
        relative rounded-lg overflow-hidden
        ${error ? 'border-red-500 focus-within:border-red-500' : 'border-slate-200 focus-within:border-primary'}
        border bg-white dark:bg-slate-800 dark:border-slate-700
      `}>
        {icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400">
            <Icon name={icon} size="sm" />
          </div>
        )}
        
        <input
          id={id}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoComplete={autoComplete}
          required={required}
          className={`
            w-full 
            h-12 
            px-4 
            ${icon ? 'pl-10' : 'pl-4'} 
            text-base 
            bg-transparent
            text-slate-900 dark:text-white
            placeholder:text-slate-400
            focus:outline-none
            touch-target
          `}
        />
      </div>
      
      {error && (
        <p className="text-xs text-red-500 mt-1">{error}</p>
      )}
    </div>
  );
}