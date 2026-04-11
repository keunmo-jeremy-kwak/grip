export type AdvertiserTier = 'PROSPECT' | 'ACTIVE' | 'VIP' | 'CHURNED';

export interface Advertiser {
  id: string;
  companyName: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  tier: AdvertiserTier;
  totalSpend: number;
  activeOrderCount: number;
  joinedAt: string;
  lastContactedAt?: string;
  assignedSalesRep: string;
  memo?: string;
}

export interface ContactHistory {
  id: string;
  advertiserId: string;
  type: 'CALL' | 'EMAIL' | 'MEETING' | 'NOTE';
  summary: string;
  createdAt: string;
  author: string;
}
