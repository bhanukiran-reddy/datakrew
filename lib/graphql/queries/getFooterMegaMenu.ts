/**
 * Fetch global footer mega menu content from the CMS.
 */

import { cache } from 'react';
import { fetchGraphQL } from '@/lib/graphql/client';
import type { GetFooterMegaMenuResponse, GlobalFooterMegaMenuFields } from '@/lib/graphql/types';

const GET_FOOTER_MEGA_MENU = /* GraphQL */ `
  query getFooterMegaMenu {
    globalFooterMegaMenu {
      globalFooterMegaMenuFields {
        footerLogo {
          footerLogoImage {
            node {
              mediaItemUrl
            }
          }
          footerLogoLink {
            url
          }
        }
        menuColumnsSection {
          menuColumns {
            column {
              columnHeading
              columnLinks {
                link {
                  linkText
                  linkUrl{
                    target
                    url
                  }
                }
              }
            }
          }
        }
        bottomSection{
          copyrightText
          legalLinks {
            legalLabel
            legalUrl {
              target
              title
              url
            }
          }
        }
      }
    }
  }
`;

async function getFooterMegaMenuUncached(): Promise<GlobalFooterMegaMenuFields | null> {
  const data = await fetchGraphQL<GetFooterMegaMenuResponse>(GET_FOOTER_MEGA_MENU, undefined, {
    revalidate: 60,
    tags: ['footer'],
  });
  return data?.globalFooterMegaMenu?.globalFooterMegaMenuFields ?? null;
}

export const getFooterMegaMenu = cache(getFooterMegaMenuUncached);
