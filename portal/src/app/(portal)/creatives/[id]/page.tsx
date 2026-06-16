import { notFound } from 'next/navigation';
import Link from 'next/link';
import { MOCK_CREATIVES } from '@/lib/mock/creatives';
import Card from '@/components/ui/Card';
import StatusTag from '@/components/ui/StatusTag';
import { formatDate, formatDateTime } from '@/lib/utils';

const TYPE_LABELS: Record<string, string> = {
  IMAGE: '🖼️ 이미지',
  VIDEO: '🎬 영상',
  BANNER: '🏷️ 배너',
};

export default function CreativeDetailPage({ params }: { params: { id: string } }) {
  const task = MOCK_CREATIVES.find((c) => c.id === params.id);
  if (!task) notFound();

  return (
    <div className="space-y-4 max-w-2xl">
      <Link href="/creatives" className="text-sm text-gray-500 hover:text-gray-900">← 소재 목록</Link>

      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">{task.title}</h2>
          <p className="text-sm text-gray-500 mt-1">{task.advertiserName} · {TYPE_LABELS[task.type]}</p>
        </div>
        <StatusTag status={task.status} />
      </div>

      <Card className="p-5">
        <h3 className="text-sm font-semibold text-gray-700 mb-4">작업 정보</h3>
        <dl className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
          <div>
            <dt className="text-gray-500">담당자</dt>
            <dd className="font-medium text-gray-900 mt-0.5">{task.assignee}</dd>
          </div>
          <div>
            <dt className="text-gray-500">마감일</dt>
            <dd className="font-medium text-gray-900 mt-0.5">{formatDate(task.deadline)}</dd>
          </div>
          <div>
            <dt className="text-gray-500">요청일</dt>
            <dd className="font-medium text-gray-900 mt-0.5">{formatDateTime(task.requestedAt)}</dd>
          </div>
          {task.deliveredAt && (
            <div>
              <dt className="text-gray-500">납품일</dt>
              <dd className="font-medium text-gray-900 mt-0.5">{formatDateTime(task.deliveredAt)}</dd>
            </div>
          )}
          <div>
            <dt className="text-gray-500">수정 횟수</dt>
            <dd className="font-medium text-gray-900 mt-0.5">{task.revisionCount}회</dd>
          </div>
          <div>
            <dt className="text-gray-500">연결 캠페인 ID</dt>
            <dd className="font-medium text-gray-500 mt-0.5 text-xs">{task.campaignId}</dd>
          </div>
        </dl>
        {task.notes && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <p className="text-xs text-gray-500 mb-1">메모</p>
            <p className="text-sm text-gray-700">{task.notes}</p>
          </div>
        )}
      </Card>
    </div>
  );
}
