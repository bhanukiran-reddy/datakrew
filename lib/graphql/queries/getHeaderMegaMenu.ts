/**
 * Fetch global header mega menu content from the CMS.
 */

import { cache } from 'react';
import { fetchGraphQL } from '@/lib/graphql/client';
import type { GetHeaderMegaMenuResponse, GlobalHeaderMegaMenuFields } from '@/lib/graphql/types';

const GET_HEADER_MEGA_MENU = /* GraphQL */ `
  query getHeaderMegaMenu {
    globalHeader {
      globalHeaderMegaMenuFields {
        topBar {
          announcementSection {
            announcementText
            announcementCtaButton {
              announcementButtonText
              announcementButtonUrl {
                target
                url
              }
            }
          }
        }
        headerLogo {
          headerLogoImage {
            node {
              altText
              mediaItemUrl
            }
          }
          headerLogoLink {
            url
          }
        }
        menuColumnsSection {
          navItems {
            solutionMenuColumn {
              solColumnHeading
              byNeedColumn {
                byNeedHeading
                byNeedLinks {
                  nodes {
                    ... on ByNeed {
                      id
                      slug
                      title
                      uri
                    }
                  }
                }
              }
              byIndustryColumn {
                byIndustryHeading
                byIndustryLinks {
                  nodes {
                    ... on Industry {
                      id
                      slug
                      title
                      uri
                    }
                  }
                }
              }
              byCustomerColumn {
                byCustomerHeading
                byCustomerLinks {
                  nodes {
                    ... on ByCustomer {
                      id
                      title
                      uri
                      slug
                    }
                  }
                }
              }
              solFeaturedPanel {
                solPanelEyebrow
                solPanelTitle
                solPanelType
                solPanelDescription
                solPanelCtaText
                solPanelCtaUrl {
                  target
                  url
                }
                solPanelThumbnail {
                  node {
                    mediaItemUrl
                    altText
                  }
                }
              }
            }
            techStackMenuColumn {
              techFeaturedPanel {
                techPanelEyebrow
                techPanelTitle
                techPanelCtaText
                techPanelDescription
                techPanelType
                techPanelCtaUrl {
                  target
                  url
                }
                techPanelThumbnail {
                  node {
                    mediaItemUrl
                    altText
                  }
                }
              }
              techColumnHeading
              hardwareColumn {
                hardwareHeading
                hardwareLinks {
                  nodes {
                    ... on Infrastructure {
                      id
                      title
                      uri
                    }
                  }
                }
              }
              softwareColumn {
                softwareHeading
                softwareLinks {
                  nodes {
                    ... on Infrastructure {
                      id
                      title
                      uri
                    }
                  }
                }
              }
              aiSolutionsColumn {
                aiSolutionsHeading
                aiSolutionsLinks {
                  nodes {
                    ... on Infrastructure {
                      id
                      title
                      uri
                    }
                  }
                }
              }
              techstackOverviewCta {
                techstackButtonText
                techstackButtonLink {
                  target
                  url
                }
              }
            }
            resourcesMenuColumn {
              resColumnHeading
              resourcesColumn {
                resourcesHeading
                resourcesLinks {
                  resourceLinkLabel
                  resourceLinkUrl {
                    target
                    url
                  }
                }
              }
              resFeaturedPanel {
                resPanelTitle
                resPanelType
                resPanelCtaUrl {
                  target
                  url
                }
                resPanelCtaText
                resPanelEyebrow
                resPanelThumbnail {
                  node {
                    mediaItemUrl
                    altText
                  }
                }
                resPanelDescription
              }
              resourcesOverviewCta {
                resourcesButtonText
                resourcesButtonLink {
                  target
                  url
                }
              }
            }
            companyMenuColumn {
              compColumnHeading
              companyColumn {
                companyHeading
                companyLinks {
                  companyLinkLabel
                  companyLinkUrl {
                    target
                    url
                  }
                }
              }
              compFeaturedPanel {
                compPanelType
                compPanelTitle
                compPanelCtaUrl {
                  target
                  url
                }
                compPanelCtaText
                compPanelEyebrow
                compPanelThumbnail {
                  node {
                    mediaItemUrl
                    altText
                  }
                }
                compPanelDescription
              }
            }
          }
        }
        ctaSection {
          ctaButtons {
            buttonText
            buttonUrl {
              url
              target
            }
          }
        }
      }
    }
  }
`;

async function getHeaderMegaMenuUncached(): Promise<GlobalHeaderMegaMenuFields | null> {
  const data = await fetchGraphQL<GetHeaderMegaMenuResponse>(GET_HEADER_MEGA_MENU, undefined, {
    revalidate: 60,
    tags: ['header'],
  });
  return data?.globalHeader?.globalHeaderMegaMenuFields ?? null;
}

export const getHeaderMegaMenu = cache(getHeaderMegaMenuUncached);
