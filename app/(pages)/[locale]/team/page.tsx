import type { Metadata } from "next";
import { buildMetadata } from "@/lib/utils/metadata";
import InnerPageBanner from "@/components/sections/reusable/InnerPageBanner/InnerPageBanner";
import TeamSection from "@/components/sections/reusable/TeamSection/TeamSection";
import ProfileInfo from "@/components/ui/ProfileInfo/ProfileInfo"
import TeamPageSchema from "@/components/seo/TeamPageSchema";
import styles from "./team.module.css"
import { getTeamPage } from "@/lib/graphql/queries/getByTeamPage";
import type { CMSPage, CMSSection } from '@/lib/types/cms';


type Props = { params: Promise<{ locale: string }> };

function getSectionData(page: CMSPage, type: string): Record<string, unknown> | undefined {
	const section = page.sections?.find((s: CMSSection) => s.type === type);
	return section?.data as Record<string, unknown> | undefined;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    const page: CMSPage | null = await getTeamPage(locale).catch(() => null);

    return buildMetadata(page?.seo || { title: "Team" }, locale, { path: 'team' });
}

export const revalidate = 60;

export default async function TeamPage({ params }: Props) {
	const { locale } = await params;
	let page: CMSPage | null = await getTeamPage(locale).catch(() => null);

	const bannerData = page ? (getSectionData(page, 'innerPageBanner') ?? {}) : {};
	const profileInfoData = page ? (getSectionData(page, 'teamQuote') ?? {}) : {};
	const teamSectionData = page ? (getSectionData(page, 'teamSection') ?? {}) : {};

	const schemaMembers = (() => {
		const seen = new Set<string>();
		const members: Array<{
			name: string;
			jobTitle?: string;
			image?: string;
			sameAs?: string;
		}> = [];

		const addMember = (member: {
			name?: string;
			jobTitle?: string;
			image?: string;
			sameAs?: string;
		}) => {
			const name = member.name?.trim();
			if (!name) return;
			const key = name.toLowerCase();
			if (seen.has(key)) return;
			seen.add(key);
			members.push({
				name,
				jobTitle: member.jobTitle?.trim() || undefined,
				image: member.image || undefined,
				sameAs:
					member.sameAs && member.sameAs !== '#'
						? member.sameAs
						: undefined,
			});
		};

		addMember({
			name: profileInfoData.name as string,
			jobTitle: profileInfoData.role as string,
			image: profileInfoData.image as string,
		});

		const teamMembers = (teamSectionData.teamMembers as Array<{
			name?: string;
			role?: string;
			image?: string;
			url?: string;
		}>) || [];

		teamMembers.forEach((member) => {
			addMember({
				name: member.name,
				jobTitle: member.role,
				image: member.image,
				sameAs: member.url,
			});
		});

		return members;
	})();

	return (
		<>
			<TeamPageSchema members={schemaMembers} />
			<InnerPageBanner {...bannerData as any}>
			</InnerPageBanner>
			<section className={styles.founderSection}>
				<div className="container">
					<ProfileInfo
						name={profileInfoData.name as string || ""}
						role={profileInfoData.role as string || ""}
						description={profileInfoData.description as string || ""}
						image={profileInfoData.image as string || ""}
						pageName="Team" />
				</div>
			</section>
			<section className={styles.TeamSection}>
				<div className="container">
					<div className={styles.title}>
						<h2 className="sectionTitle" dangerouslySetInnerHTML={{ __html: teamSectionData.heading as string || "The <span>krew</span>" }}></h2>
					</div>
					<TeamSection teamMembers={teamSectionData.teamMembers as any || []} />
					{teamSectionData.cta && (teamSectionData.cta as any).url && (
						<div className={styles.teamCtaWrap}>
							<a
								href={(teamSectionData.cta as any).url}
								target={(teamSectionData.cta as any).target || "_self"}
								className="primaryCta"
							>
								{(teamSectionData.cta as any).text || "Join the krew"}
							</a>
						</div>
					)}
				</div>
			</section>
		</>
	)
}