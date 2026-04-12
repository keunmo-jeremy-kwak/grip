import PageHeader from '@/components/layout/PageHeader';
import AdvertiserTable from '@/components/crm/AdvertiserTable';
import { MOCK_ADVERTISERS } from '@/lib/mock/advertisers';

export default function CrmPage() {
  return (
    <div>
      <PageHeader
        title="CRM"
        description={`총 ${MOCK_ADVERTISERS.length}개사`}
      />
      <AdvertiserTable advertisers={MOCK_ADVERTISERS} />
    </div>
  );
}
