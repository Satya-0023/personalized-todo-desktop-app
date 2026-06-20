import { cn } from '@/utils/cn';
import { Priority } from '@/types';

interface BadgeProps {
  children: React.ReactNode;
  variant?: Priority | 'default' | 'success' | 'warning';
  className?: string;
}

const variantStyles: Record<string, string> = {
  low: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
  medium: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
  high: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
  critical: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
  default: 'bg-white/10 text-white/70 border-white/10',
  success: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
  warning: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
};

export function Badge({ children, variant = 'default', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border',
        variantStyles[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
