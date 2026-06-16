import type { CreativeTask, CreativeStatus } from '@/types/creative';
import StatusTag from '@/components/ui/StatusTag';
import { formatDate } from '@/lib/utils';
import Link from 'next/link';

const COLUMNS: { status: CreativeStatus; label: string }[] = [
  { status: 'REQUESTED', label: '요청됨' },
  { status: 'IN_REVIEW', label: '검토 중' },
  { status: 'IN_PRODUCTION', label: '제작 중' },
  { status: 'REVISION', label: '수정 요청' },
  { status: 'APPROVED', label: '승인됨' },
  { status: 'DELIVERED', label: '납품 완료' },
];

const TYPE_LABELS: Record<string, string> = {
  IMAGE: '🖼️ 이미지',
  VIDEO: '🎬 영상',
  BANNER: '🏷️ 배너',
};

interface CreativeKanbanProps {
  tasks: CreativeTask[];
}

export default function CreativeKanban({ tasks }: CreativeKanbanProps) {
  return (
    <div className="overflow-x-auto">
      <div className="flex gap-4 min-w-max pb-4">
        {COLUMNS.map((col) => {
          const colTasks = tasks.filter((t) => t.status === col.status);
          return (
            <div key={col.status} className="w-60 flex-shrink-0">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-gray-600 uppercase tracking-wider">{col.label}</span>
                <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full font-medium">
                  {colTasks.length}
                </span>
              </div>
              <div className="space-y-3">
                {colTasks.map((task) => (
                  <Link key={task.id} href={`/creatives/${task.id}`}>
                    <div className="bg-white rounded-xl p-3 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                      <div className="flex items-start justify-between mb-2">
                        <span className="text-xs text-gray-400">{TYPE_LABELS[task.type]}</span>
                        {task.revisionCount > 0 && (
                          <span className="text-xs bg-red-50 text-red-600 px-1.5 py-0.5 rounded font-medium">
                            수정 {task.revisionCount}회
                          </span>
                        )}
                      </div>
                      <p className="text-sm font-medium text-gray-900 mb-1 leading-snug">{task.title}</p>
                      <p className="text-xs text-gray-500 mb-2">{task.advertiserName}</p>
                      <div className="flex items-center justify-between text-xs text-gray-400">
                        <span>담당: {task.assignee}</span>
                        <span>~{formatDate(task.deadline)}</span>
                      </div>
                    </div>
                  </Link>
                ))}
                {colTasks.length === 0 && (
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
