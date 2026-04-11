import { Helmet } from 'react-helmet-async';
import { defaultMetadata } from '../lib/seo';

export default function Seo({ title, description }: { title?: string; description?: string }) {
  const metaTitle = title ? `${title} | We Take Your Job` : defaultMetadata.title;
  const metaDescription = description || defaultMetadata.description;

  return (
    <Helmet>
      <title>{metaTitle}</title>
      <meta name="description" content={metaDescription} />
      <meta property="og:title" content={metaTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={defaultMetadata.siteName} />
      <meta property="og:image" content={defaultMetadata.image} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={metaTitle} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:image" content={defaultMetadata.image} />
    </Helmet>
  );
}
