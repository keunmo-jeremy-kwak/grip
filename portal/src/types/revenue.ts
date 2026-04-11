import type { ProductType } from './order';

export interface RevenueRecord {
  id: string;
  month: string;
  productType: ProductType;
  grossRevenue: number;
  netRevenue: number;
  orderCount: number;
  newAdvertiserCount: number;
  repeatAdvertiserCount: number;
}

export interface RevenueSummary {
  totalGross: number;
  totalNet: number;
  momGrowthPct: number;
  yoyGrowthPct?: number;
}
