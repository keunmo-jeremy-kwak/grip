import { cn } from '@/lib/utils';
import Card from './Card';

interface StatCardProps {
  label: string;
  value: string | number;
  delta?: number;
  deltaLabel?: string;
  icon?: React.ReactNode;
  className?: string;
}

export default function StatCard({ label, value, delta, deltaLabel, icon, className }: StatCardProps) {
  const isPositive = delta !== undefined && delta >= 0;

  return (
    <Card className={cn('p-5', className)}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-gray-500 mb-1">{label}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {delta !== undefined && (
            <p className={cn('text-xs mt-1 font-medium', isPositive ? 'text-green-600' : 'text-red-600')}>
              {isPositive ? '▲' : '▼'} {Math.abs(delta)}%{deltaLabel ? ` ${deltaLabel}` : ''}
            </p>
          )}
        </div>
        {icon && (
          <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600 flex-shrink-0">
            {icon}
          </div>
        )}
      </div>
    </Card>
  );
}
