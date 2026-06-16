import { notFound } from 'next/navigation';
import Link from 'next/link';
import { MOCK_SALES_LEADS, MOCK_SALES_ACTIVITIES } from '@/lib/mock/sales';
import Card from '@/components/ui/Card';
import StatusTag from '@/components/ui/StatusTag';
import Badge from '@/components/ui/Badge';
import { formatKRW, formatDate, formatDateTime } from '@/lib/utils';

const SOURCE_LABELS: Record<string, string> = {
  INBOUND: '인바운드',
  OUTBOUND: '아웃바운드',
  REFERRAL: '소개',
  EVENT: '이벤트',
};

const ACTIVITY_TYPE_LABELS: Record<string, string> = {
  CALL: '📞 전화',
  EMAIL: '📧 이메일',
  MEETING: '🤝 미팅',
  PROPOSAL: '📋 제안서',
  STAGE_CHANGE: '🔄 단계 변경',
};

const PRODUCT_LABELS: Record<string, string> = {
  STARTER: '스타터',
  LIVE_PERFORMANCE: '라이브 퍼포먼스',
  FAN_BOOSTER: '팬 부스터',
  OTHER: '기타',
};

export default function SalesDetailPage({ params }: { params: { id: string } }) {
  const lead = MOCK_SALES_LEADS.find((l) => l.id === params.id);
  if (!lead) notFound();

  const activities = MOCK_SALES_ACTIVITIES.filter((a) => a.leadId === params.id)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return (
    <div className="space-y-4 max-w-3xl">
      <Link href="/sales" className="text-sm text-gray-500 hover:text-gray-900">← 영업 현황</Link>

      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">{lead.companyName}</h2>
          <p className="text-sm text-gray-500 mt-1">{lead.contactName} {lead.contactPhone ? `· ${lead.contactPhone}` : ''}</p>
        </div>
        <StatusTag status={lead.stage} />
      </div>

      <Card className="p-5">
        <h3 className="text-sm font-semibold text-gray-700 mb-4">리드 정보</h3>
        <dl className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
          <div>
            <dt className="text-gray-500">담당 영업</dt>
            <dd className="font-medium text-gray-900 mt-0.5">{lead.salesRep}</dd>
          </div>
          <div>
            <dt className="text-gray-500">유입 경로</dt>
            <dd className="font-medium text-gray-900 mt-0.5">{SOURCE_LABELS[lead.source]}</dd>
          </div>
          <div>
            <dt className="text-gray-500">관심 상품</dt>
            <dd className="mt-0.5 flex gap-1 flex-wrap">
              {lead.productInterest.map((p, i) => (
                <Badge key={i} label={PRODUCT_LABELS[p] ?? p} variant="purple" />
              ))}
            </dd>
          </div>
          <div>
            <dt className="text-gray-500">예상 매출</dt>
            <dd className="font-bold text-purple-600 mt-0.5">{formatKRW(lead.estimatedValue)}</dd>
          </div>
          <div>
            <dt className="text-gray-500">최초 등록일</dt>
            <dd className="font-medium text-gray-900 mt-0.5">{formatDate(lead.createdAt)}</dd>
          </div>
          <div>
            <dt className="text-gray-500">최근 업데이트</dt>
            <dd className="font-medium text-gray-900 mt-0.5">{formatDate(lead.updatedAt)}</dd>
          </div>
        </dl>
        {lead.nextActionAt && (
          <div className="mt-4 pt-4 border-t border-gray-100 bg-orange-50 rounded-xl p-3">
            <p className="text-xs font-semibold text-orange-600 mb-1">⏰ 다음 액션</p>
            <p className="text-sm text-gray-700">{lead.nextActionNote}</p>
            <p className="text-xs text-gray-500 mt-1">{formatDate(lead.nextActionAt)}</p>
          </div>
        )}
      </Card>

      {/* 활동 이력 */}
      <Card className="p-5">
        <h3 className="text-sm font-semibold text-gray-700 mb-4">활동 이력</h3>
        {activities.length === 0 ? (
          <p className="text-sm text-gray-400 py-4 text-center">활동 이력이 없습니다</p>
        ) : (
          <div className="space-y-4">
            {activities.map((a) => (
              <div key={a.id} className="flex gap-3">
                <Badge label={ACTIVITY_TYPE_LABELS[a.type]} variant="gray" />
                <div className="flex-1">
                  <p className="text-sm text-gray-700">{a.description}</p>
                  <p className="text-xs text-gray-400 mt-1">{a.author} · {formatDateTime(a.createdAt)}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
