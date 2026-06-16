import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '그립애즈 포탈',
  description: 'GripAds 내부 운영 관리 포탈',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
