import PageHeader from '@/components/layout/PageHeader';
import SalesPipelineBoard from '@/components/sales/SalesPipelineBoard';
import StatCard from '@/components/ui/StatCard';
import { MOCK_SALES_LEADS } from '@/lib/mock/sales';
import { formatKRW } from '@/lib/utils';

export default function SalesPage() {
  const activeLeads = MOCK_SALES_LEADS.filter((l) => !['WON', 'LOST'].includes(l.stage));
  const wonLeads = MOCK_SALES_LEADS.filter((l) => l.stage === 'WON');
  const totalPipelineValue = activeLeads.reduce((sum, l) => sum + l.estimatedValue, 0);
  const wonValue = wonLeads.reduce((sum, l) => sum + l.estimatedValue, 0);

  return (
    <div className="space-y-6">
      <PageHeader title="영업 현황" description="영업 파이프라인 및 리드 관리" />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="활성 리드" value={`${activeLeads.length}건`} />
        <StatCard label="파이프라인 가치" value={formatKRW(totalPipelineValue)} />
        <StatCard label="이번 달 계약 성사" value={`${wonLeads.length}건`} />
        <StatCard label="성사 금액" value={formatKRW(wonValue)} />
      </div>

      <SalesPipelineBoard leads={MOCK_SALES_LEADS} />
    </div>
  );
}
