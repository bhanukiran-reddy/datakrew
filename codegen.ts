import type { CodegenConfig } from '@graphql-codegen/cli';

const endpoint = process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT;
const schemaSource = endpoint
  ? endpoint
  : './lib/graphql/schema.graphql';

const config: CodegenConfig = {
  schema: schemaSource,
  generates: {
    'lib/graphql/generated/schema-types.ts': {
      plugins: ['typescript'],
      config: {
        skipTypename: true,
        scalars: {
          JSON: 'Record<string, unknown>',
        },
        enumsAsTypes: true,
      },
    },
  },
  ignoreNoDocuments: true,
};

export default config;
