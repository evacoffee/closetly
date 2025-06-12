import { getServerSideSitemap } from 'next-sitemap';
import { GetServerSideProps } from 'next';
import { getPosts } from '@/lib/api'; // Your API function to get posts

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const posts = await getPosts(); // Replace with your data fetching
  
  const fields = [
    {
      loc: process.env.NEXT_PUBLIC_SITE_URL || 'https://yourdomain.com',
      lastmod: new Date().toISOString(),
      changefreq: 'daily',
      priority: 1.0,
    },
    ...posts.map((post) => ({
      loc: `${process.env.NEXT_PUBLIC_SITE_URL}/posts/${post.slug}`,
      lastmod: post.updatedAt,
      changefreq: 'weekly',
      priority: 0.8,
    })),
  ];

  return getServerSideSitemap(ctx, fields);
};

export default () => {};