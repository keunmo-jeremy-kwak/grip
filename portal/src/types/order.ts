export type ProductType = 'STARTER' | 'LIVE_PERFORMANCE' | 'FAN_BOOSTER' | 'OTHER';

export type OrderStatus =
  | 'RECEIVED'
  | 'REVIEWING'
  | 'CONFIRMED'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'REFUNDED';

export interface Order {
  id: string;
  orderNumber: string;
  advertiserId: string;
  advertiserName: string;
  productType: ProductType;
  status: OrderStatus;
  amount: number;
  broadcastDate?: string;
  requestedAt: string;
  confirmedAt?: string;
  completedAt?: string;
  salesRep: string;
  memo?: string;
  linkedCampaignId?: string;
}
