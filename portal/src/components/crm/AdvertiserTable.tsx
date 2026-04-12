'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { Advertiser } from '@/types/crm';
import StatusTag from '@/components/ui/StatusTag';
import SearchInput from '@/components/ui/SearchInput';
import EmptyState from '@/components/ui/EmptyState';
import { formatKRW, formatDate } from '@/lib/utils';

interface AdvertiserTableProps {
  advertisers: Advertiser[];
}

export default function AdvertiserTable({ advertisers }: AdvertiserTableProps) {
  const [search, setSearch] = useState('');

  const filtered = advertisers.filter(
    (a) =>
      !search ||
      a.companyName.includes(search) ||
      a.contactName.includes(search) ||
      a.assignedSalesRep.includes(search)
  );

  return (
    <div className="space-y-4">
      <div className="w-64">
        <SearchInput value={search} onChange={setSearch} placeholder="광고주명, 담당자 검색..." />
      </div>
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        {filtered.length === 0 ? (
          <EmptyState title="해당하는 광고주가 없습니다" />
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">회사명</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">담당자</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">등급</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">누적 광고비</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">담당 영업</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">최근 연락</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">가입일</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((adv) => (
                <tr key={adv.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <Link href={`/crm/${adv.id}`} className="text-sm font-medium text-purple-600 hover:text-purple-800">
                      {adv.companyName}
                    </Link>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-sm text-gray-900">{adv.contactName}</div>
                    <div className="text-xs text-gray-500">{adv.contactPhone}</div>
                  </td>
                  <td className="px-4 py-3"><StatusTag status={adv.tier} /></td>
                  <td className="px-4 py-3 text-sm font-semibold text-gray-900">{formatKRW(adv.totalSpend)}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{adv.assignedSalesRep}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">
                    {adv.lastContactedAt ? formatDate(adv.lastContactedAt) : '-'}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">{formatDate(adv.joinedAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
