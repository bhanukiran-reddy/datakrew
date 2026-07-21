import type { ProductPropertyValue } from './jsonld';

/**
 * Optional product spec properties per page path (from SEO templates).
 * CMS fields are used for name/description/image; specs supplement when defined here.
 */
export const PRODUCT_SCHEMA_SPECS: Record<string, ProductPropertyValue[]> = {
  'tech-stack/hardware/itus-max': [
    { name: 'Connectivity', value: '4G LTE with 2G fallback' },
    { name: 'Global Coverage', value: 'Auto-roaming across 140+ countries' },
    { name: 'Vehicle Interface', value: 'OBD-II, CAN FD and CAN 2.0B' },
    { name: 'Enclosure Rating', value: 'IP67' },
    {
      name: 'Cryptography',
      value: 'Post-quantum cryptography, NIST and ISO compliant',
    },
    { name: 'Operating Temperature', value: '+5°C to 65°C' },
    { name: 'EMC Compliance', value: 'CISPR 25' },
    {
      name: 'OEM Compatibility',
      value: '35+ brands, 100+ vehicle models',
    },
  ],
};
