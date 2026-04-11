import PageHeader from '@/components/layout/PageHeader';
import CreativeKanban from '@/components/creatives/CreativeKanban';
import { MOCK_CREATIVES } from '@/lib/mock/creatives';

export default function CreativesPage() {
  const inProgress = MOCK_CREATIVES.filter((c) =>
    ['REQUESTED', 'IN_REVIEW', 'IN_PRODUCTION', 'REVISION'].includes(c.status)
  ).length;

  return (
    <div>
      <PageHeader
        title="소재 제작 현황"
        description={`진행 중 ${inProgress}건 / 전체 ${MOCK_CREATIVES.length}건`}
      />
      <CreativeKanban tasks={MOCK_CREATIVES} />
    </div>
  );
}
