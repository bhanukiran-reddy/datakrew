import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/utils/metadata';

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return buildMetadata(null, locale, {
    title: 'Search',
    description: 'Search Datakrew for articles, case studies, news, and resources.',
    path: 'search',
  });
}

export default function SearchLayout({ children }: Props) {
  return children;
}
