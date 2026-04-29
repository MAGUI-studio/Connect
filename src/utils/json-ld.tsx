import { Organization, Thing, WebSite, WithContext } from "schema-dts";

export function JsonLd<T extends Thing>({ data }: { data: WithContext<T> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

/**
 * Helper to generate Organization Schema
 */
export const getOrganizationSchema = (
  url: string,
  logo: string,
  name: string
): WithContext<Organization> => ({
  "@context": "https://schema.org",
  "@type": "Organization",
  name,
  url,
  logo,
});

/**
 * Helper to generate WebSite Schema
 */
export const getWebSiteSchema = (
  url: string,
  name: string
): WithContext<WebSite> => ({
  "@context": "https://schema.org",
  "@type": "WebSite",
  name,
  url,
});
