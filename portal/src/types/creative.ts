export type CreativeStatus =
  | 'REQUESTED'
  | 'IN_REVIEW'
  | 'IN_PRODUCTION'
  | 'REVISION'
  | 'APPROVED'
  | 'DELIVERED';

export interface CreativeTask {
  id: string;
  advertiserName: string;
  campaignId: string;
  title: string;
  type: 'IMAGE' | 'VIDEO' | 'BANNER';
  status: CreativeStatus;
  assignee: string;
  requestedAt: string;
  deadline: string;
  deliveredAt?: string;
  revisionCount: number;
  notes?: string;
}
