'use client';

import { usePathname } from 'next/navigation';

const PAGE_TITLES: Record<string, string> = {
  '/dashboard': '대시보드',
  '/creatives': '소재 제작 현황',
  '/orders': '신청/주문 관리',
  '/campaigns': '캠페인 현황',
  '/crm': 'CRM',
  '/revenue': '매출 현황',
  '/sales': '영업 현황',
  '/wiki': '그립애즈 위키',
};

function getPageTitle(pathname: string): string {
  for (const [key, title] of Object.entries(PAGE_TITLES)) {
    if (pathname === key || pathname.startsWith(key + '/')) {
      return title;
    }
  }
  return '그립애즈 포탈';
}

export default function Header() {
  const pathname = usePathname();
  const title = getPageTitle(pathname);

  return (
    <header className="sticky top-0 z-10 bg-white border-b border-gray-100 px-6 h-14 flex items-center justify-between">
      <h1 className="text-base font-semibold text-gray-900">{title}</h1>
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
          <span className="text-purple-700 text-xs font-bold">운영</span>
        </div>
      </div>
    </header>
  );
}
