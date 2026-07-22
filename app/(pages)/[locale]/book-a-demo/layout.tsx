import type { Metadata } from 'next';
import { getBookaDemoPage } from '@/lib/graphql/queries/getBookADemoPage';
import { buildMetadata } from '@/lib/utils/metadata';

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const page = await getBookaDemoPage(locale).catch(() => null);

  return buildMetadata(page?.seo || { title: 'Book a Demo' }, locale, { path: 'book-a-demo' });
}

export default async function BookADemoLayout({ children }: Props) {
  return <>{children}</>;
}
