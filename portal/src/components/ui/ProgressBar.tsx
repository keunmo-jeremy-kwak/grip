import { cn } from '@/lib/utils';

interface ProgressBarProps {
  value: number;
  max?: number;
  className?: string;
  color?: 'purple' | 'green' | 'blue' | 'yellow';
}

const colorStyles = {
  purple: 'bg-purple-600',
  green: 'bg-green-500',
  blue: 'bg-blue-500',
  yellow: 'bg-yellow-500',
};

export default function ProgressBar({ value, max = 100, className, color = 'purple' }: ProgressBarProps) {
  const pct = Math.min(100, Math.round((value / max) * 100));
  return (
    <div className={cn('w-full bg-gray-100 rounded-full h-2', className)}>
      <div
        className={cn('h-2 rounded-full transition-all', colorStyles[color])}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
