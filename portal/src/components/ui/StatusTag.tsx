import type { OrderStatus } from '@/types/order';
import type { CampaignStatus } from '@/types/campaign';
import type { CreativeStatus } from '@/types/creative';
import type { SalesStage } from '@/types/sales';
import type { AdvertiserTier } from '@/types/crm';
import Badge from './Badge';

type AnyStatus = OrderStatus | CampaignStatus | CreativeStatus | SalesStage | AdvertiserTier;

const STATUS_CONFIG: Record<string, { label: string; variant: 'green' | 'yellow' | 'red' | 'purple' | 'blue' | 'gray' | 'indigo' }> = {
  // Order
  RECEIVED: { label: '신청 접수', variant: 'gray' },
  REVIEWING: { label: '검토 중', variant: 'yellow' },
  CONFIRMED: { label: '확정', variant: 'purple' },
  IN_PROGRESS: { label: '집행 중', variant: 'blue' },
  COMPLETED: { label: '완료', variant: 'green' },
  CANCELLED: { label: '취소', variant: 'red' },
  REFUNDED: { label: '환불', variant: 'red' },
  // Campaign
  SCHEDULED: { label: '예정', variant: 'indigo' },
  RUNNING: { label: '진행 중', variant: 'blue' },
  PAUSED: { label: '일시 중지', variant: 'yellow' },
  // Creative
  REQUESTED: { label: '요청됨', variant: 'gray' },
  IN_REVIEW: { label: '검토 중', variant: 'yellow' },
  IN_PRODUCTION: { label: '제작 중', variant: 'blue' },
  REVISION: { label: '수정 요청', variant: 'red' },
  APPROVED: { label: '승인됨', variant: 'purple' },
  DELIVERED: { label: '납품 완료', variant: 'green' },
  // Sales
  LEAD: { label: '리드 발굴', variant: 'gray' },
  CONTACT: { label: '첫 연락', variant: 'indigo' },
  CONSULTATION: { label: '상담 진행', variant: 'blue' },
  PROPOSAL: { label: '제안서 발송', variant: 'yellow' },
  NEGOTIATION: { label: '협상', variant: 'purple' },
  WON: { label: '계약 성사', variant: 'green' },
  LOST: { label: '이탈', variant: 'red' },
  // CRM Tier
  PROSPECT: { label: '잠재 고객', variant: 'gray' },
  ACTIVE: { label: '활성 고객', variant: 'blue' },
  VIP: { label: 'VIP', variant: 'purple' },
  CHURNED: { label: '이탈', variant: 'red' },
};

interface StatusTagProps {
  status: AnyStatus;
}

export default function StatusTag({ status }: StatusTagProps) {
  const config = STATUS_CONFIG[status];
  if (!config) return <Badge label={status} />;
  return <Badge label={config.label} variant={config.variant} />;
}
