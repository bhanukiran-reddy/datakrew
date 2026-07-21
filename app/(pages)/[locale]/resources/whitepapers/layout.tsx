type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function WhitepaperLayout({ children }: Props) {
  return <>{children}</>;
}
