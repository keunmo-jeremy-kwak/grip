'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { Campaign } from '@/types/campaign';
import StatusTag from '@/components/ui/StatusTag';
import SearchInput from '@/components/ui/SearchInput';
import EmptyState from '@/components/ui/EmptyState';
import { formatKRW, formatDate } from '@/lib/utils';

const PRODUCT_LABELS: Record<string, string> = {
  STARTER: '스타터',
  LIVE_PERFORMANCE: '라이브 퍼포먼스',
  FAN_BOOSTER: '팬 부스터',
  OTHER: '기타',
};

interface CampaignTableProps {
  campaigns: Campaign[];
}

export default function CampaignTable({ campaigns }: CampaignTableProps) {
  const [search, setSearch] = useState('');

  const filtered = campaigns.filter(
    (c) =>
      !search ||
      c.name.includes(search) ||
      c.advertiserName.includes(search)
  );

  return (
    <div className="space-y-4">
      <div className="w-64">
        <SearchInput value={search} onChange={setSearch} placeholder="캠페인명, 광고주명 검색..." />
      </div>
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        {filtered.length === 0 ? (
          <EmptyState title="해당하는 캠페인이 없습니다" />
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">캠페인명</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">광고주</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">상품</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">예산</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">방송일</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">상태</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">시청자</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((c) => (
                <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <Link href={`/campaigns/${c.id}`} className="text-sm font-medium text-purple-600 hover:text-purple-800">
                      {c.name}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">{c.advertiserName}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{PRODUCT_LABELS[c.productType]}</td>
                  <td className="px-4 py-3 text-sm font-semibold text-gray-900">{formatKRW(c.budget)}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {c.broadcastDate ? formatDate(c.broadcastDate) : '-'}
                  </td>
                  <td className="px-4 py-3"><StatusTag status={c.status} /></td>
                  <td className="px-4 py-3 text-sm text-gray-900">
                    {c.metrics ? c.metrics.totalViewers.toLocaleString() + '명' : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
