import dynamic from "next/dynamic";

/** Below-the-fold home sections: same SSR HTML, client chunks hydrate after parse. */

export const LogisticsSectionDynamic = dynamic(
  () => import("@/components/sections/Pages/Home/LogisticsSection/LogisticsSection"),
  { ssr: true },
);

export const DeepTechSectionDynamic = dynamic(
  () => import("@/components/sections/reusable/DeepTechSection/DeepTechSection"),
  { ssr: true },
);

export const OutcomesSectionDynamic = dynamic(
  () => import("@/components/sections/Pages/Home/OutcomesSection/OutcomesSection"),
  { ssr: true },
);

export const QuantifiedImpactSectionDynamic = dynamic(
  () => import("@/components/sections/reusable/QuantifiedImpactSection/QuantifiedImpactSection"),
  { ssr: true },
);

export const StatsSectionsDynamic = dynamic(
  () => import("@/components/sections/reusable/StatsSection/StatsSection"),
  { ssr: true },
);

export const ContactStripSectionDynamic = dynamic(
  () => import("@/components/sections/reusable/ContactStripSection/ContactStripSection"),
  { ssr: true },
);
