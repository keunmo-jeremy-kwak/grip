import dynamic from 'next/dynamic';
import PageHeader from '@/components/layout/PageHeader';
import Card from '@/components/ui/Card';
import StatCard from '@/components/ui/StatCard';
import Badge from '@/components/ui/Badge';
import { MOCK_REVENUE, getMonthlyRevenueSummary } from '@/lib/mock/revenue';
import { formatKRW } from '@/lib/utils';

const RevenueChart = dynamic(() => import('@/components/revenue/RevenueChart'), { ssr: false });

const PRODUCT_LABELS: Record<string, string> = {
  STARTER: '스타터',
  LIVE_PERFORMANCE: '라이브 퍼포먼스',
  FAN_BOOSTER: '팬 부스터',
  OTHER: '기타',
};

const PRODUCT_BADGE_VARIANTS: Record<string, 'purple' | 'blue' | 'green' | 'gray'> = {
  STARTER: 'blue',
  LIVE_PERFORMANCE: 'purple',
  FAN_BOOSTER: 'green',
  OTHER: 'gray',
};

export default function RevenuePage() {
  const monthlySummary = getMonthlyRevenueSummary();
  const totalGross = MOCK_REVENUE.reduce((sum, r) => sum + r.grossRevenue, 0);
  const totalOrders = MOCK_REVENUE.reduce((sum, r) => sum + r.orderCount, 0);

  const latestMonth = monthlySummary[monthlySummary.length - 1];
  const prevMonth = monthlySummary[monthlySummary.length - 2];
  const momGrowth = prevMonth
    ? Math.round(((latestMonth.totalGross - prevMonth.totalGross) / prevMonth.totalGross) * 100)
    : 0;

  // Group by product
  const byProduct = MOCK_REVENUE.reduce<Record<string, { gross: number; orders: number }>>((acc, r) => {
    if (!acc[r.productType]) acc[r.productType] = { gross: 0, orders: 0 };
    acc[r.productType].gross += r.grossRevenue;
    acc[r.productType].orders += r.orderCount;
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      <PageHeader title="매출 현황" description="그립애즈 매출 집계" />

      {/* KPI */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="누적 매출" value={formatKRW(totalGross)} />
        <StatCard label="이번 달 매출" value={formatKRW(latestMonth?.totalGross ?? 0)} delta={momGrowth} deltaLabel="vs 지난달" />
        <StatCard label="이번 달 주문" value={`${latestMonth?.orderCount ?? 0}건`} />
        <StatCard label="총 주문 수" value={`${totalOrders}건`} />
      </div>

      {/* Chart */}
      <Card className="p-5">
        <h3 className="text-sm font-semibold text-gray-700 mb-4">월별 매출 추이</h3>
        <RevenueChart data={monthlySummary} />
      </Card>

      {/* By Product */}
      <Card className="p-5">
        <h3 className="text-sm font-semibold text-gray-700 mb-4">상품별 매출</h3>
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="text-left py-2 text-xs font-semibold text-gray-500">상품</th>
              <th className="text-right py-2 text-xs font-semibold text-gray-500">주문 수</th>
              <th className="text-right py-2 text-xs font-semibold text-gray-500">매출</th>
              <th className="text-right py-2 text-xs font-semibold text-gray-500">비중</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {Object.entries(byProduct).map(([type, data]) => (
              <tr key={type}>
                <td className="py-3">
                  <Badge
                    label={PRODUCT_LABELS[type] ?? type}
                    variant={PRODUCT_BADGE_VARIANTS[type] ?? 'gray'}
                  />
                </td>
                <td className="py-3 text-sm text-right text-gray-900">{data.orders}건</td>
                <td className="py-3 text-sm text-right font-semibold text-gray-900">{formatKRW(data.gross)}</td>
                <td className="py-3 text-sm text-right text-gray-500">
                  {Math.round((data.gross / totalGross) * 100)}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      {/* Monthly Detail */}
      <Card className="p-5">
        <h3 className="text-sm font-semibold text-gray-700 mb-4">월별 상세</h3>
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="text-left py-2 text-xs font-semibold text-gray-500">월</th>
              <th className="text-right py-2 text-xs font-semibold text-gray-500">주문</th>
              <th className="text-right py-2 text-xs font-semibold text-gray-500">매출</th>
              <th className="text-right py-2 text-xs font-semibold text-gray-500">순매출</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {monthlySummary.map((m) => (
              <tr key={m.month}>
                <td className="py-3 text-sm font-medium text-gray-900">{m.month}</td>
                <td className="py-3 text-sm text-right text-gray-600">{m.orderCount}건</td>
                <td className="py-3 text-sm text-right font-semibold text-gray-900">{formatKRW(m.totalGross)}</td>
                <td className="py-3 text-sm text-right text-gray-500">{formatKRW(m.totalNet)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
