import { getServerSideSitemap } from 'next-sitemap';
import { GetServerSideProps } from 'next';
import { getPosts } from '@/lib/api'; // Your API function to get posts

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  // Fetch dynamic routes
  const posts = await getPosts(); // Replace with your data fetching
  
  const fields = [
    {
      loc: process.env.NEXT_PUBLIC_SITE_URL || 'https://yourdomain.com',
      lastmod: new Date().toISOString(),
      changefreq: 'daily',
      priority: 1.0,
    },
    // Add more dynamic routes
    ...posts.map((post) => ({
      loc: `${process.env.NEXT_PUBLIC_SITE_URL}/posts/${post.slug}`,
      lastmod: post.updatedAt,
      changefreq: 'weekly',
      priority: 0.8,
    })),
  ];

  return getServerSideSitemap(ctx, fields);
};

// Default export to prevent next.js errors
export default () => {};