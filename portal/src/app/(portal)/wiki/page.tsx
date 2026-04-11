import Link from 'next/link';
import PageHeader from '@/components/layout/PageHeader';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { MOCK_WIKI_ARTICLES } from '@/lib/mock/wiki';
import type { WikiCategory } from '@/types/wiki';
import { formatDate } from '@/lib/utils';

const CATEGORY_LABELS: Record<WikiCategory, string> = {
  PRODUCT: '상품 안내',
  PROCESS: '업무 프로세스',
  SALES: '영업 자료',
  CREATIVE: '소재 가이드',
  FAQ: '자주 묻는 질문',
  POLICY: '정책/약관',
};

const CATEGORY_BADGE_VARIANTS: Record<WikiCategory, 'purple' | 'blue' | 'green' | 'yellow' | 'gray' | 'indigo'> = {
  PRODUCT: 'purple',
  PROCESS: 'blue',
  SALES: 'green',
  CREATIVE: 'indigo',
  FAQ: 'yellow',
  POLICY: 'gray',
};

export default function WikiPage() {
  const pinned = MOCK_WIKI_ARTICLES.filter((a) => a.pinned);
  const byCategory = MOCK_WIKI_ARTICLES.reduce<Partial<Record<WikiCategory, typeof MOCK_WIKI_ARTICLES>>>((acc, article) => {
    if (!acc[article.category]) acc[article.category] = [];
    acc[article.category]!.push(article);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      <PageHeader title="그립애즈 위키" description="내부 문서 및 가이드" />

      {/* 고정 문서 */}
      {pinned.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-3">📌 주요 문서</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {pinned.map((article) => (
              <Link key={article.slug} href={`/wiki/${article.slug}`}>
                <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer h-full">
                  <Badge label={CATEGORY_LABELS[article.category]} variant={CATEGORY_BADGE_VARIANTS[article.category]} />
                  <p className="text-sm font-semibold text-gray-900 mt-2">{article.title}</p>
                  <p className="text-xs text-gray-400 mt-1">{formatDate(article.updatedAt)} · {article.author}</p>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* 카테고리별 */}
      {(Object.keys(byCategory) as WikiCategory[]).map((category) => (
        <div key={category}>
          <h3 className="text-sm font-semibold text-gray-700 mb-3">{CATEGORY_LABELS[category]}</h3>
          <div className="bg-white rounded-2xl shadow-sm divide-y divide-gray-50">
            {byCategory[category]!.map((article) => (
              <Link key={article.slug} href={`/wiki/${article.slug}`} className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-3">
                  {article.pinned && <span className="text-xs">📌</span>}
                  <span className="text-sm font-medium text-gray-900">{article.title}</span>
                  <div className="flex gap-1">
                    {article.tags.slice(0, 2).map((tag) => (
                      <span key={tag} className="text-xs bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded">#{tag}</span>
                    ))}
                  </div>
                </div>
                <span className="text-xs text-gray-400">{formatDate(article.updatedAt)}</span>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
