import type { RevenueRecord } from '@/types/revenue';

export const MOCK_REVENUE: RevenueRecord[] = [
  {
    id: 'rev-001',
    month: '2025-01',
    productType: 'LIVE_PERFORMANCE',
    grossRevenue: 1980000,
    netRevenue: 1782000,
    orderCount: 2,
    newAdvertiserCount: 2,
    repeatAdvertiserCount: 0,
  },
  {
    id: 'rev-002',
    month: '2025-01',
    productType: 'STARTER',
    grossRevenue: 390000,
    netRevenue: 351000,
    orderCount: 1,
    newAdvertiserCount: 1,
    repeatAdvertiserCount: 0,
  },
  {
    id: 'rev-003',
    month: '2025-02',
    productType: 'LIVE_PERFORMANCE',
    grossRevenue: 1980000,
    netRevenue: 1782000,
    orderCount: 2,
    newAdvertiserCount: 1,
    repeatAdvertiserCount: 1,
  },
  {
    id: 'rev-004',
    month: '2025-03',
    productType: 'LIVE_PERFORMANCE',
    grossRevenue: 990000,
    netRevenue: 891000,
    orderCount: 1,
    newAdvertiserCount: 0,
    repeatAdvertiserCount: 1,
  },
  {
    id: 'rev-005',
    month: '2025-04',
    productType: 'LIVE_PERFORMANCE',
    grossRevenue: 1980000,
    netRevenue: 1782000,
    orderCount: 2,
    newAdvertiserCount: 1,
    repeatAdvertiserCount: 1,
  },
  {
    id: 'rev-006',
    month: '2025-04',
    productType: 'STARTER',
    grossRevenue: 390000,
    netRevenue: 351000,
    orderCount: 1,
    newAdvertiserCount: 1,
    repeatAdvertiserCount: 0,
  },
];

export interface MonthlyRevenueSummary {
  month: string;
  totalGross: number;
  totalNet: number;
  orderCount: number;
}

export function getMonthlyRevenueSummary(): MonthlyRevenueSummary[] {
  const map = new Map<string, MonthlyRevenueSummary>();
  for (const r of MOCK_REVENUE) {
    const existing = map.get(r.month);
    if (existing) {
      existing.totalGross += r.grossRevenue;
      existing.totalNet += r.netRevenue;
      existing.orderCount += r.orderCount;
    } else {
      map.set(r.month, {
        month: r.month,
        totalGross: r.grossRevenue,
        totalNet: r.netRevenue,
        orderCount: r.orderCount,
      });
    }
  }
  return Array.from(map.values()).sort((a, b) => a.month.localeCompare(b.month));
}
