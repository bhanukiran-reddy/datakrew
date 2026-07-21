import PageJsonLd from './PageJsonLd';
import { buildPersonJsonLd } from '@/lib/seo';

export type TeamMemberSchemaInput = {
  name: string;
  jobTitle?: string;
  image?: string;
  sameAs?: string;
};

type TeamPageSchemaProps = {
  members: TeamMemberSchemaInput[];
};

export default function TeamPageSchema({ members }: TeamPageSchemaProps) {
  const schemas = members
    .filter((member) => member.name?.trim())
    .map((member) =>
      buildPersonJsonLd({
        name: member.name,
        jobTitle: member.jobTitle,
        image: member.image,
        sameAs: member.sameAs,
      }),
    );

  return <PageJsonLd schemas={schemas} />;
}
