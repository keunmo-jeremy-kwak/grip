import Link from 'next/link';
import StatCard from '@/components/ui/StatCard';
import Card from '@/components/ui/Card';
import StatusTag from '@/components/ui/StatusTag';
import { MOCK_ORDERS } from '@/lib/mock/orders';
import { MOCK_CAMPAIGNS } from '@/lib/mock/campaigns';
import { MOCK_ADVERTISERS } from '@/lib/mock/advertisers';
import { MOCK_SALES_LEADS } from '@/lib/mock/sales';
import { MOCK_CREATIVES } from '@/lib/mock/creatives';
import { MOCK_REVENUE, getMonthlyRevenueSummary } from '@/lib/mock/revenue';
import { formatKRW, formatDate } from '@/lib/utils';

export default function DashboardPage() {
  const monthlySummary = getMonthlyRevenueSummary();
  const latestMonth = monthlySummary[monthlySummary.length - 1];
  const prevMonth = monthlySummary[monthlySummary.length - 2];
  const momGrowth = prevMonth
    ? Math.round(((latestMonth.totalGross - prevMonth.totalGross) / prevMonth.totalGross) * 100)
    : 0;

  const totalRevenue = MOCK_REVENUE.reduce((sum, r) => sum + r.grossRevenue, 0);
  const activeOrders = MOCK_ORDERS.filter((o) => ['RECEIVED', 'REVIEWING', 'CONFIRMED', 'IN_PROGRESS'].includes(o.status));
  const activeCampaigns = MOCK_CAMPAIGNS.filter((c) => c.status === 'RUNNING');
  const activeLeads = MOCK_SALES_LEADS.filter((l) => !['WON', 'LOST'].includes(l.stage));
  const pendingCreatives = MOCK_CREATIVES.filter((c) => ['REQUESTED', 'IN_REVIEW', 'IN_PRODUCTION', 'REVISION'].includes(c.status));
  const vipCount = MOCK_ADVERTISERS.filter((a) => a.tier === 'VIP').length;

  const recentOrders = MOCK_ORDERS.slice().sort((a, b) => new Date(b.requestedAt).getTime() - new Date(a.requestedAt).getTime()).slice(0, 5);

  return (
    <div className="space-y-6">
      {/* KPI 요약 */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="이번 달 매출"
          value={formatKRW(latestMonth?.totalGross ?? 0)}
          delta={momGrowth}
          deltaLabel="vs 지난달"
          icon={
            <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
            </svg>
          }
        />
        <StatCard
          label="진행 중인 주문"
          value={`${activeOrders.length}건`}
          icon={
            <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
              <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
            </svg>
          }
        />
        <StatCard
          label="진행 중인 캠페인"
          value={`${activeCampaigns.length}건`}
          icon={
            <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
            </svg>
          }
        />
        <StatCard
          label="VIP 광고주"
          value={`${vipCount}개사`}
          icon={
            <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
            </svg>
          }
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* 소재 현황 */}
        <StatCard
          label="소재 제작 중"
          value={`${pendingCreatives.length}건`}
          icon={
            <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
            </svg>
          }
        />
        <StatCard
          label="영업 파이프라인"
          value={`${activeLeads.length}건`}
          icon={
            <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
            </svg>
          }
        />
        <StatCard
          label="누적 매출"
          value={formatKRW(totalRevenue)}
          icon={
            <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
            </svg>
          }
        />
      </div>

      {/* 최근 주문 */}
      <Card className="p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-semibold text-gray-900">최근 주문</h3>
          <Link href="/orders" className="text-sm text-purple-600 hover:text-purple-800 font-medium">
            전체 보기 →
          </Link>
        </div>
        <div className="space-y-3">
          {recentOrders.map((order) => (
            <Link
              key={order.id}
              href={`/orders/${order.id}`}
              className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0 hover:bg-gray-50 -mx-2 px-2 rounded-lg transition-colors"
            >
              <div className="flex items-center gap-3">
                <div>
                  <p className="text-sm font-medium text-gray-900">{order.advertiserName}</p>
                  <p className="text-xs text-gray-500">{order.orderNumber} · {formatDate(order.requestedAt)}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-semibold text-gray-900">{formatKRW(order.amount)}</span>
                <StatusTag status={order.status} />
              </div>
            </Link>
          ))}
        </div>
      </Card>

      {/* 섹션 바로가기 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { href: '/creatives', label: '소재 제작 현황', desc: `진행 중 ${pendingCreatives.length}건`, emoji: '✏️' },
          { href: '/crm', label: 'CRM', desc: `총 ${MOCK_ADVERTISERS.length}개사`, emoji: '👥' },
          { href: '/sales', label: '영업 현황', desc: `파이프라인 ${activeLeads.length}건`, emoji: '📈' },
          { href: '/wiki', label: '그립애즈 위키', desc: '프로세스 & 가이드', emoji: '📖' },
        ].map((item) => (
          <Link key={item.href} href={item.href}>
            <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer">
              <div className="text-2xl mb-2">{item.emoji}</div>
              <p className="text-sm font-semibold text-gray-900">{item.label}</p>
              <p className="text-xs text-gray-500 mt-0.5">{item.desc}</p>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
