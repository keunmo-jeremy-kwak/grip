export type WikiCategory =
  | 'PRODUCT'
  | 'PROCESS'
  | 'SALES'
  | 'CREATIVE'
  | 'FAQ'
  | 'POLICY';

export interface WikiArticle {
  slug: string;
  title: string;
  category: WikiCategory;
  content: string;
  author: string;
  createdAt: string;
  updatedAt: string;
  tags: string[];
  pinned?: boolean;
}
