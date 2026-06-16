import PageHeader from '@/components/layout/PageHeader';
import OrderTable from '@/components/orders/OrderTable';
import { MOCK_ORDERS } from '@/lib/mock/orders';

export default function OrdersPage() {
  return (
    <div>
      <PageHeader
        title="신청/주문 관리"
        description={`총 ${MOCK_ORDERS.length}건`}
      />
      <OrderTable orders={MOCK_ORDERS} />
    </div>
  );
}
