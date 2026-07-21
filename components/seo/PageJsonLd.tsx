import JsonLd from './JsonLd';

/** Render one or more JSON-LD script blocks (non-empty strings only). */
export default function PageJsonLd({
  schemas,
}: {
  schemas: Array<string | null | undefined>;
}) {
  const valid = schemas.filter((schema): schema is string => Boolean(schema));
  if (valid.length === 0) return null;

  return (
    <>
      {valid.map((data, index) => (
        <JsonLd key={index} data={data} />
      ))}
    </>
  );
}
