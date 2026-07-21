type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function InfographicLayout({ children }: Props) {
  return <>{children}</>;
}
