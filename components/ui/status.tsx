import type { ComponentProps, HTMLAttributes } from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export type StatusProps = ComponentProps<typeof Badge> & {
  status: 'online' | 'offline' | 'busy' | 'away';
};

export const Status = ({ className, status, ...props }: StatusProps) => (
  <Badge
    className={cn('flex items-center gap-2', 'group', status, className)}
    variant="secondary"
    {...props}
  />
);

export type StatusIndicatorProps = HTMLAttributes<HTMLSpanElement>;

export const StatusIndicator = ({
  className,
  ...props
}: StatusIndicatorProps) => (
  <span className="relative flex h-2 w-2" {...props}>
    <span
      className={cn(
        'absolute inline-flex h-full w-full animate-ping rounded-full opacity-75',
        'group-[.online]:bg-emerald-500',
        'group-[.offline]:bg-gray-500',
        'group-[.busy]:bg-amber-500',
        'group-[.away]:bg-blue-500'
      )}
    />
    <span
      className={cn(
        'relative inline-flex h-2 w-2 rounded-full',
        'group-[.online]:bg-emerald-500',
        'group-[.offline]:bg-gray-500',
        'group-[.busy]:bg-amber-500',
        'group-[.away]:bg-blue-500'
      )}
    />
  </span>
);

export type StatusLabelProps = HTMLAttributes<HTMLSpanElement>;

export const StatusLabel = ({
  className,
  children,
  ...props
}: StatusLabelProps) => (
  <span className={cn('text-sm font-medium', className)} {...props}>
    {children ?? (
      <>
        <span className="hidden group-[.online]:block">Available</span>
        <span className="hidden group-[.offline]:block">Offline</span>
        <span className="hidden group-[.busy]:block">Busy</span>
        <span className="hidden group-[.away]:block">Away</span>
      </>
    )}
  </span>
);
