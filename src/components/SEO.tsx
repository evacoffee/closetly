import Head from 'next/head';
import { useRouter } from 'next/router';

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  type?: 'website' | 'article';
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  section?: string;
  tags?: string[];
}

const SITE_NAME = 'FIT - Digital Wardrobe';
const DEFAULT_DESCRIPTION = 'Catalog your clothing, generate outfits, and connect with fashion enthusiasts';
const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://yourdomain.com';

export function SEO({
  title = SITE_NAME,
  description = DEFAULT_DESCRIPTION,
  image = `${BASE_URL}/images/og-image.jpg`,
  type = 'website',
  publishedTime,
  modifiedTime,
  author,
  section,
  tags = [],
}: SEOProps) {
  const { asPath } = useRouter();
  const url = `${BASE_URL}${asPath}`;

  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content={type} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content={SITE_NAME} />
      
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {publishedTime && (
        <meta property="article:published_time" content={publishedTime} />
      )}
      {modifiedTime && (
        <meta property="article:modified_time" content={modifiedTime} />
      )}
      {author && <meta property="article:author" content={author} />}
      {section && <meta property="article:section" content={section} />}
      {tags.map((tag) => (
        <meta property="article:tag" content={tag} key={tag} />
      ))}

      <link rel="canonical" href={url} />
    </Head>
  );
}