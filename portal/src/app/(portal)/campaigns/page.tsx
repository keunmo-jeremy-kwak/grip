import PageHeader from '@/components/layout/PageHeader';
import CampaignTable from '@/components/campaigns/CampaignTable';
import { MOCK_CAMPAIGNS } from '@/lib/mock/campaigns';

export default function CampaignsPage() {
  return (
    <div>
      <PageHeader
        title="캠페인 현황"
        description={`총 ${MOCK_CAMPAIGNS.length}건`}
      />
      <CampaignTable campaigns={MOCK_CAMPAIGNS} />
    </div>
  );
}
