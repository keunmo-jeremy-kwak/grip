import { notFound } from 'next/navigation';
import Link from 'next/link';
import { MOCK_ORDERS } from '@/lib/mock/orders';
import { MOCK_CAMPAIGNS } from '@/lib/mock/campaigns';
import Card from '@/components/ui/Card';
import StatusTag from '@/components/ui/StatusTag';
import { formatKRW, formatDate, formatDateTime } from '@/lib/utils';

const PRODUCT_LABELS: Record<string, string> = {
  STARTER: '스타터',
  LIVE_PERFORMANCE: '라이브 퍼포먼스',
  FAN_BOOSTER: '팬 부스터',
  OTHER: '기타',
};

export default function OrderDetailPage({ params }: { params: { id: string } }) {
  const order = MOCK_ORDERS.find((o) => o.id === params.id);
  if (!order) notFound();

  const campaign = order.linkedCampaignId
    ? MOCK_CAMPAIGNS.find((c) => c.id === order.linkedCampaignId)
    : null;

  return (
    <div className="space-y-4 max-w-3xl">
      {/* Back */}
      <Link href="/orders" className="text-sm text-gray-500 hover:text-gray-900 flex items-center gap-1">
        ← 주문 목록
      </Link>

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">{order.orderNumber}</h2>
          <p className="text-sm text-gray-500 mt-1">{order.advertiserName}</p>
        </div>
        <StatusTag status={order.status} />
      </div>

      {/* Main Info */}
      <Card className="p-5">
        <h3 className="text-sm font-semibold text-gray-700 mb-4">주문 정보</h3>
        <dl className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
          <div>
            <dt className="text-gray-500">상품</dt>
            <dd className="font-medium text-gray-900 mt-0.5">{PRODUCT_LABELS[order.productType]}</dd>
          </div>
          <div>
            <dt className="text-gray-500">금액</dt>
            <dd className="font-bold text-gray-900 mt-0.5">{formatKRW(order.amount)}</dd>
          </div>
          <div>
            <dt className="text-gray-500">방송 예정일</dt>
            <dd className="font-medium text-gray-900 mt-0.5">
              {order.broadcastDate ? formatDate(order.broadcastDate) : '-'}
            </dd>
          </div>
          <div>
            <dt className="text-gray-500">담당 영업</dt>
            <dd className="font-medium text-gray-900 mt-0.5">{order.salesRep}</dd>
          </div>
          <div>
            <dt className="text-gray-500">신청일</dt>
            <dd className="font-medium text-gray-900 mt-0.5">{formatDateTime(order.requestedAt)}</dd>
          </div>
          {order.confirmedAt && (
            <div>
              <dt className="text-gray-500">확정일</dt>
              <dd className="font-medium text-gray-900 mt-0.5">{formatDateTime(order.confirmedAt)}</dd>
            </div>
          )}
          {order.completedAt && (
            <div>
              <dt className="text-gray-500">완료일</dt>
              <dd className="font-medium text-gray-900 mt-0.5">{formatDateTime(order.completedAt)}</dd>
            </div>
          )}
        </dl>
        {order.memo && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <p className="text-xs text-gray-500 mb-1">메모</p>
            <p className="text-sm text-gray-700">{order.memo}</p>
          </div>
        )}
      </Card>

      {/* Linked Campaign */}
      {campaign && (
        <Card className="p-5">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">연결된 캠페인</h3>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900">{campaign.name}</p>
              <p className="text-xs text-gray-500 mt-0.5">{formatDate(campaign.startDate)} ~ {formatDate(campaign.endDate)}</p>
            </div>
            <div className="flex items-center gap-3">
              <StatusTag status={campaign.status} />
              <Link href={`/campaigns/${campaign.id}`} className="text-sm text-purple-600 hover:text-purple-800 font-medium">
                보기 →
              </Link>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
