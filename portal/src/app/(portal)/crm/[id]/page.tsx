import { notFound } from 'next/navigation';
import Link from 'next/link';
import { MOCK_ADVERTISERS, MOCK_CONTACT_HISTORY } from '@/lib/mock/advertisers';
import { MOCK_ORDERS } from '@/lib/mock/orders';
import { MOCK_CAMPAIGNS } from '@/lib/mock/campaigns';
import Card from '@/components/ui/Card';
import StatusTag from '@/components/ui/StatusTag';
import Badge from '@/components/ui/Badge';
import { formatKRW, formatDate, formatDateTime } from '@/lib/utils';

const CONTACT_TYPE_LABELS: Record<string, string> = {
  CALL: '📞 전화',
  EMAIL: '📧 이메일',
  MEETING: '🤝 미팅',
  NOTE: '📝 메모',
};

export default function CrmDetailPage({ params }: { params: { id: string } }) {
  const advertiser = MOCK_ADVERTISERS.find((a) => a.id === params.id);
  if (!advertiser) notFound();

  const history = MOCK_CONTACT_HISTORY.filter((h) => h.advertiserId === params.id)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const orders = MOCK_ORDERS.filter((o) => o.advertiserId === params.id);
  const campaigns = MOCK_CAMPAIGNS.filter((c) => c.advertiserId === params.id);

  return (
    <div className="space-y-4 max-w-4xl">
      <Link href="/crm" className="text-sm text-gray-500 hover:text-gray-900">← CRM 목록</Link>

      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">{advertiser.companyName}</h2>
          <p className="text-sm text-gray-500 mt-1">{advertiser.contactName} · {advertiser.contactEmail}</p>
        </div>
        <StatusTag status={advertiser.tier} />
      </div>

      {/* 기본 정보 */}
      <Card className="p-5">
        <h3 className="text-sm font-semibold text-gray-700 mb-4">기본 정보</h3>
        <dl className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-3 text-sm">
          <div>
            <dt className="text-gray-500">연락처</dt>
            <dd className="font-medium text-gray-900 mt-0.5">{advertiser.contactPhone}</dd>
          </div>
          <div>
            <dt className="text-gray-500">이메일</dt>
            <dd className="font-medium text-gray-900 mt-0.5">{advertiser.contactEmail}</dd>
          </div>
          <div>
            <dt className="text-gray-500">담당 영업</dt>
            <dd className="font-medium text-gray-900 mt-0.5">{advertiser.assignedSalesRep}</dd>
          </div>
          <div>
            <dt className="text-gray-500">누적 광고비</dt>
            <dd className="font-bold text-purple-600 mt-0.5">{formatKRW(advertiser.totalSpend)}</dd>
          </div>
          <div>
            <dt className="text-gray-500">활성 주문</dt>
            <dd className="font-medium text-gray-900 mt-0.5">{advertiser.activeOrderCount}건</dd>
          </div>
          <div>
            <dt className="text-gray-500">가입일</dt>
            <dd className="font-medium text-gray-900 mt-0.5">{formatDate(advertiser.joinedAt)}</dd>
          </div>
        </dl>
        {advertiser.memo && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <p className="text-xs text-gray-500 mb-1">메모</p>
            <p className="text-sm text-gray-700">{advertiser.memo}</p>
          </div>
        )}
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* 주문 이력 */}
        <Card className="p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-gray-700">주문 이력</h3>
            <span className="text-xs text-gray-400">{orders.length}건</span>
          </div>
          {orders.length === 0 ? (
            <p className="text-sm text-gray-400 py-4 text-center">주문 내역이 없습니다</p>
          ) : (
            <div className="space-y-2">
              {orders.map((o) => (
                <Link key={o.id} href={`/orders/${o.id}`} className="flex items-center justify-between py-2 hover:bg-gray-50 rounded-lg px-2 -mx-2 transition-colors">
                  <div>
                    <p className="text-xs font-medium text-gray-900">{o.orderNumber}</p>
                    <p className="text-xs text-gray-500">{formatDate(o.requestedAt)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-gray-900">{formatKRW(o.amount)}</span>
                    <StatusTag status={o.status} />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </Card>

        {/* 캠페인 이력 */}
        <Card className="p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-gray-700">캠페인 이력</h3>
            <span className="text-xs text-gray-400">{campaigns.length}건</span>
          </div>
          {campaigns.length === 0 ? (
            <p className="text-sm text-gray-400 py-4 text-center">캠페인 내역이 없습니다</p>
          ) : (
            <div className="space-y-2">
              {campaigns.map((c) => (
                <Link key={c.id} href={`/campaigns/${c.id}`} className="flex items-center justify-between py-2 hover:bg-gray-50 rounded-lg px-2 -mx-2 transition-colors">
                  <div>
                    <p className="text-xs font-medium text-gray-900">{c.name}</p>
                    <p className="text-xs text-gray-500">{formatDate(c.startDate)}</p>
                  </div>
                  <StatusTag status={c.status} />
                </Link>
              ))}
            </div>
          )}
        </Card>
      </div>

      {/* 컨택 이력 */}
      <Card className="p-5">
        <h3 className="text-sm font-semibold text-gray-700 mb-4">컨택 이력</h3>
        {history.length === 0 ? (
          <p className="text-sm text-gray-400 py-4 text-center">컨택 이력이 없습니다</p>
        ) : (
          <div className="space-y-4">
            {history.map((h) => (
              <div key={h.id} className="flex gap-3">
                <div className="flex-shrink-0 mt-0.5">
                  <Badge label={CONTACT_TYPE_LABELS[h.type]} variant="gray" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-700">{h.summary}</p>
                  <p className="text-xs text-gray-400 mt-1">{h.author} · {formatDateTime(h.createdAt)}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
