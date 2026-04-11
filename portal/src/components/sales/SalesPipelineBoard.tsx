import type { SalesLead, SalesStage } from '@/types/sales';
import StatusTag from '@/components/ui/StatusTag';
import { formatKRW, formatDate } from '@/lib/utils';
import Link from 'next/link';

const STAGES: { stage: SalesStage; label: string }[] = [
  { stage: 'LEAD', label: '리드 발굴' },
  { stage: 'CONTACT', label: '첫 연락' },
  { stage: 'CONSULTATION', label: '상담 진행' },
  { stage: 'PROPOSAL', label: '제안서 발송' },
  { stage: 'NEGOTIATION', label: '협상' },
  { stage: 'WON', label: '계약 성사' },
  { stage: 'LOST', label: '이탈' },
];

const SOURCE_LABELS: Record<string, string> = {
  INBOUND: '인바운드',
  OUTBOUND: '아웃바운드',
  REFERRAL: '소개',
  EVENT: '이벤트',
};

interface SalesPipelineBoardProps {
  leads: SalesLead[];
}

export default function SalesPipelineBoard({ leads }: SalesPipelineBoardProps) {
  return (
    <div className="overflow-x-auto">
      <div className="flex gap-4 min-w-max pb-4">
        {STAGES.map((col) => {
          const colLeads = leads.filter((l) => l.stage === col.stage);
          const totalValue = colLeads.reduce((sum, l) => sum + l.estimatedValue, 0);
          return (
            <div key={col.stage} className="w-52 flex-shrink-0">
              <div className="mb-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-gray-600 uppercase tracking-wider">{col.label}</span>
                  <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full font-medium">
                    {colLeads.length}
                  </span>
                </div>
                {totalValue > 0 && (
                  <p className="text-xs text-purple-600 font-medium mt-0.5">{formatKRW(totalValue)}</p>
                )}
              </div>
              <div className="space-y-2">
                {colLeads.map((lead) => (
                  <Link key={lead.id} href={`/sales/${lead.id}`}>
                    <div className="bg-white rounded-xl p-3 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                      <p className="text-sm font-medium text-gray-900 mb-0.5">{lead.companyName}</p>
                      <p className="text-xs text-gray-500 mb-2">{lead.contactName}</p>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-purple-600 font-semibold">{formatKRW(lead.estimatedValue)}</span>
                        <span className="text-gray-400">{lead.salesRep}</span>
                      </div>
                      <div className="mt-2 text-xs text-gray-400">{SOURCE_LABELS[lead.source]}</div>
                      {lead.nextActionAt && (
                        <div className="mt-1.5 text-xs text-orange-500">
                          ⏰ {formatDate(lead.nextActionAt)}
                        </div>
                      )}
                    </div>
                  </Link>
                ))}
                {colLeads.length === 0 && (
                  <div className="bg-gray-50 rounded-xl p-4 text-center text-xs text-gray-400 border-2 border-dashed border-gray-200">
                    없음
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
