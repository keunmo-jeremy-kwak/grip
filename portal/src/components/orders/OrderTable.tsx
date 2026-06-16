'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { Order, OrderStatus } from '@/types/order';
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

const STATUS_TABS: { label: string; value: OrderStatus | 'ALL' }[] = [
  { label: '전체', value: 'ALL' },
  { label: '신청 접수', value: 'RECEIVED' },
  { label: '검토 중', value: 'REVIEWING' },
  { label: '확정', value: 'CONFIRMED' },
  { label: '집행 중', value: 'IN_PROGRESS' },
  { label: '완료', value: 'COMPLETED' },
  { label: '취소/환불', value: 'CANCELLED' },
];

interface OrderTableProps {
  orders: Order[];
}

export default function OrderTable({ orders }: OrderTableProps) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'ALL'>('ALL');

  const filtered = orders.filter((o) => {
    const matchStatus = statusFilter === 'ALL' || o.status === statusFilter;
    const matchSearch =
      !search ||
      o.advertiserName.includes(search) ||
      o.orderNumber.includes(search) ||
      o.salesRep.includes(search);
    return matchStatus && matchSearch;
  });

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <SearchInput value={search} onChange={setSearch} placeholder="광고주명, 주문번호 검색..." />
        <div className="flex gap-1 flex-wrap">
          {STATUS_TABS.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setStatusFilter(tab.value)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                statusFilter === tab.value
                  ? 'bg-purple-600 text-white'
                  : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        {filtered.length === 0 ? (
          <EmptyState title="해당하는 주문이 없습니다" />
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">주문번호</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">광고주</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">상품</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">금액</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">방송일</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">담당</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">상태</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">신청일</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <Link href={`/orders/${order.id}`} className="text-sm font-medium text-purple-600 hover:text-purple-800">
                      {order.orderNumber}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">{order.advertiserName}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{PRODUCT_LABELS[order.productType]}</td>
                  <td className="px-4 py-3 text-sm font-semibold text-gray-900">{formatKRW(order.amount)}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {order.broadcastDate ? formatDate(order.broadcastDate) : '-'}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">{order.salesRep}</td>
                  <td className="px-4 py-3"><StatusTag status={order.status} /></td>
                  <td className="px-4 py-3 text-sm text-gray-500">{formatDate(order.requestedAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
