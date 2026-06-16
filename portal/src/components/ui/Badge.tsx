import { cn } from '@/lib/utils';

type BadgeVariant = 'green' | 'yellow' | 'red' | 'purple' | 'blue' | 'gray' | 'indigo';

const variantStyles: Record<BadgeVariant, string> = {
  green: 'bg-green-50 text-green-700',
  yellow: 'bg-yellow-50 text-yellow-700',
  red: 'bg-red-50 text-red-700',
  purple: 'bg-purple-50 text-purple-700',
  blue: 'bg-blue-50 text-blue-700',
  gray: 'bg-gray-100 text-gray-600',
  indigo: 'bg-indigo-50 text-indigo-700',
};

interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
  className?: string;
}

export default function Badge({ label, variant = 'gray', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
        variantStyles[variant],
        className
      )}
    >
      {label}
    </span>
  );
}
