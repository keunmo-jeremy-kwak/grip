'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

interface SidebarItemProps {
  href: string;
  label: string;
  icon: React.ReactNode;
}

export default function SidebarItem({ href, label, icon }: SidebarItemProps) {
  const pathname = usePathname();
  const isActive = pathname === href || pathname.startsWith(href + '/');

  return (
    <Link
      href={href}
      className={cn(
        'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
        isActive
          ? 'bg-purple-50 text-purple-700'
          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
      )}
    >
      <span className={cn('w-5 h-5 flex-shrink-0', isActive ? 'text-purple-600' : 'text-gray-400')}>
        {icon}
      </span>
      {label}
    </Link>
  );
}
