import type { ProductType } from './order';

export type CampaignStatus = 'SCHEDULED' | 'RUNNING' | 'COMPLETED' | 'PAUSED';

export interface CampaignMetrics {
  peakViewers: number;
  totalViewers: number;
  crmSentCount: number;
  crmOpenRate: number;
  ctrPct: number;
  conversions: number;
  conversionRate: number;
  externalImpressions: number;
}

export interface Campaign {
  id: string;
  name: string;
  advertiserId: string;
  advertiserName: string;
  orderId: string;
  status: CampaignStatus;
  productType: ProductType;
  budget: number;
  startDate: string;
  endDate: string;
  broadcastDate?: string;
  metrics?: CampaignMetrics;
}
