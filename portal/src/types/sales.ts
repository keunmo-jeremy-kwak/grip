import type { ProductType } from './order';

export type SalesStage =
  | 'LEAD'
  | 'CONTACT'
  | 'CONSULTATION'
  | 'PROPOSAL'
  | 'NEGOTIATION'
  | 'WON'
  | 'LOST';

export interface SalesLead {
  id: string;
  companyName: string;
  contactName: string;
  contactPhone?: string;
  stage: SalesStage;
  salesRep: string;
  estimatedValue: number;
  productInterest: ProductType[];
  source: 'INBOUND' | 'OUTBOUND' | 'REFERRAL' | 'EVENT';
  createdAt: string;
  updatedAt: string;
  nextActionAt?: string;
  nextActionNote?: string;
}

export interface SalesActivity {
  id: string;
  leadId: string;
  type: 'CALL' | 'EMAIL' | 'MEETING' | 'PROPOSAL' | 'STAGE_CHANGE';
  description: string;
  author: string;
  createdAt: string;
}
