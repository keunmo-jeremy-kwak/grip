import { notFound } from 'next/navigation';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { MOCK_WIKI_ARTICLES } from '@/lib/mock/wiki';
import Badge from '@/components/ui/Badge';
import { formatDate } from '@/lib/utils';
import type { WikiCategory } from '@/types/wiki';

const ReactMarkdown = dynamic(() => import('react-markdown'), { ssr: false });

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

export default function WikiArticlePage({ params }: { params: { slug: string } }) {
  const article = MOCK_WIKI_ARTICLES.find((a) => a.slug === params.slug);
  if (!article) notFound();

  const related = MOCK_WIKI_ARTICLES.filter(
    (a) => a.slug !== article.slug && a.category === article.category
  ).slice(0, 3);

  return (
    <div className="max-w-3xl space-y-4">
      <Link href="/wiki" className="text-sm text-gray-500 hover:text-gray-900">← 위키 목록</Link>

      <div>
        <Badge label={CATEGORY_LABELS[article.category]} variant={CATEGORY_BADGE_VARIANTS[article.category]} />
        <h2 className="text-2xl font-bold text-gray-900 mt-2">{article.title}</h2>
        <p className="text-sm text-gray-400 mt-1">
          {article.author} · 최종 수정 {formatDate(article.updatedAt)}
        </p>
        <div className="flex gap-1 mt-2">
          {article.tags.map((tag) => (
            <span key={tag} className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded">#{tag}</span>
          ))}
        </div>
      </div>

      {/* Article content */}
      <div className="bg-white rounded-2xl shadow-sm p-6 prose prose-sm max-w-none
        prose-headings:text-gray-900 prose-headings:font-bold
        prose-p:text-gray-700 prose-p:leading-relaxed
        prose-li:text-gray-700
        prose-code:bg-gray-100 prose-code:px-1 prose-code:rounded prose-code:text-purple-700
        prose-table:text-sm prose-th:text-gray-600 prose-td:text-gray-700
        prose-strong:text-gray-900
        prose-blockquote:border-purple-300 prose-blockquote:text-gray-600">
        <ReactMarkdown>{article.content}</ReactMarkdown>
      </div>

      {/* Related */}
      {related.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-2">관련 문서</h3>
          <div className="space-y-1">
            {related.map((a) => (
              <Link key={a.slug} href={`/wiki/${a.slug}`} className="flex items-center gap-2 text-sm text-purple-600 hover:text-purple-800 py-1">
                → {a.title}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
