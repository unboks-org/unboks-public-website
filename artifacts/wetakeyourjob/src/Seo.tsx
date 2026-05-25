import { Helmet } from 'react-helmet-async';

const SITE_URL = 'https://unboks.org';
const DEFAULT_TITLE = 'Unboks - All your messages. One inbox.';
const DEFAULT_DESCRIPTION =
  'Unboks helps small and mid-sized businesses handle customer messages across WhatsApp, email, Instagram, Facebook, and more with an AI Agent and human control.';
const OG_IMAGE = `${SITE_URL}/opengraph.jpg`;

type SeoProps = {
  title?: string;
  description?: string;
  path?: string;
};

export default function Seo({
  title = DEFAULT_TITLE,
  description = DEFAULT_DESCRIPTION,
  path = '/',
}: SeoProps) {
  const canonicalPath = path.startsWith('/') ? path : `/${path}`;
  const canonicalUrl = `${SITE_URL}${canonicalPath === '/' ? '' : canonicalPath}`;

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonicalUrl} />
      <meta name="robots" content="index,follow" />

      <meta property="og:site_name" content="Unboks" />
      <meta property="og:type" content="website" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={OG_IMAGE} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={OG_IMAGE} />
    </Helmet>
  );
}
