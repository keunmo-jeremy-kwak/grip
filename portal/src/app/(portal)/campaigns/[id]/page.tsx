import { notFound } from 'next/navigation';
import Link from 'next/link';
import { MOCK_CAMPAIGNS } from '@/lib/mock/campaigns';
import Card from '@/components/ui/Card';
import StatCard from '@/components/ui/StatCard';
import StatusTag from '@/components/ui/StatusTag';
import { formatKRW, formatDate } from '@/lib/utils';

const PRODUCT_LABELS: Record<string, string> = {
  STARTER: '스타터',
  LIVE_PERFORMANCE: '라이브 퍼포먼스',
  FAN_BOOSTER: '팬 부스터',
  OTHER: '기타',
};

export default function CampaignDetailPage({ params }: { params: { id: string } }) {
  const campaign = MOCK_CAMPAIGNS.find((c) => c.id === params.id);
  if (!campaign) notFound();

  const m = campaign.metrics;

  return (
    <div className="space-y-4 max-w-4xl">
      <Link href="/campaigns" className="text-sm text-gray-500 hover:text-gray-900">← 캠페인 목록</Link>

      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">{campaign.name}</h2>
          <p className="text-sm text-gray-500 mt-1">
            {campaign.advertiserName} · {PRODUCT_LABELS[campaign.productType]} · {formatKRW(campaign.budget)}
          </p>
        </div>
        <StatusTag status={campaign.status} />
      </div>

      {/* 기간 정보 */}
      <Card className="p-5">
        <h3 className="text-sm font-semibold text-gray-700 mb-4">캠페인 정보</h3>
        <dl className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-3 text-sm">
          <div>
            <dt className="text-gray-500">집행 시작</dt>
            <dd className="font-medium text-gray-900 mt-0.5">{formatDate(campaign.startDate)}</dd>
          </div>
          <div>
            <dt className="text-gray-500">집행 종료</dt>
            <dd className="font-medium text-gray-900 mt-0.5">{formatDate(campaign.endDate)}</dd>
          </div>
          <div>
            <dt className="text-gray-500">방송일</dt>
            <dd className="font-medium text-gray-900 mt-0.5">
              {campaign.broadcastDate ? formatDate(campaign.broadcastDate) : '-'}
            </dd>
          </div>
          <div>
            <dt className="text-gray-500">예산</dt>
            <dd className="font-bold text-purple-600 mt-0.5">{formatKRW(campaign.budget)}</dd>
          </div>
        </dl>
      </Card>

      {/* 성과 지표 */}
      {m ? (
        <>
          <h3 className="text-base font-semibold text-gray-900">성과 리포트</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard label="누적 시청자" value={m.totalViewers.toLocaleString() + '명'} />
            <StatCard label="최대 동시 시청자" value={m.peakViewers.toLocaleString() + '명'} />
            <StatCard label="CRM 발송" value={m.crmSentCount.toLocaleString() + '건'} />
            <StatCard label="CRM 오픈율" value={m.crmOpenRate + '%'} />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard label="외부 노출" value={m.externalImpressions.toLocaleString() + '회'} />
            <StatCard label="클릭률(CTR)" value={m.ctrPct + '%'} />
            <StatCard label="전환 수" value={m.conversions.toLocaleString() + '건'} />
            <StatCard label="전환율" value={m.conversionRate + '%'} />
          </div>
        </>
      ) : (
        <Card className="p-8 text-center">
          <div className="text-3xl mb-3">📊</div>
          <p className="text-gray-500 text-sm">캠페인 집행 후 성과 데이터가 표시됩니다.</p>
        </Card>
      )}

      {/* 링크 */}
      <div className="flex gap-3">
        <Link href={`/crm/${campaign.advertiserId}`} className="text-sm text-purple-600 hover:text-purple-800 font-medium">
          광고주 CRM 보기 →
        </Link>
        <Link href={`/orders/${campaign.orderId}`} className="text-sm text-purple-600 hover:text-purple-800 font-medium">
          연결된 주문 보기 →
        </Link>
      </div>
    </div>
  );
}
