'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { MonthlyRevenueSummary } from '@/lib/mock/revenue';

interface RevenueChartProps {
  data: MonthlyRevenueSummary[];
}

function formatAxis(value: number) {
  if (value >= 1000000) return `${(value / 1000000).toFixed(0)}M`;
  if (value >= 1000) return `${(value / 1000).toFixed(0)}K`;
  return String(value);
}

function formatTooltip(value: number) {
  return new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW', maximumFractionDigits: 0 }).format(value);
}

export default function RevenueChart({ data }: RevenueChartProps) {
  const chartData = data.map((d) => ({
    month: d.month.replace('2025-', ''),
    매출: d.totalGross,
    주문수: d.orderCount,
  }));

  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
        <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#9ca3af' }} />
        <YAxis tickFormatter={formatAxis} tick={{ fontSize: 12, fill: '#9ca3af' }} />
        <Tooltip
          formatter={(value: number) => [formatTooltip(value), '매출']}
          contentStyle={{ borderRadius: '12px', border: '1px solid #e5e7eb', fontSize: '13px' }}
        />
        <Bar dataKey="매출" fill="#9333ea" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
