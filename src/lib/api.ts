import { Post } from '@/types/index'; // Updated import path

// Mock data for demonstration
const mockPosts: Post[] = [
  {
    id: '1',
    slug: 'welcome-to-fit',
    title: 'Welcome to FIT',
    content: 'Welcome to our fashion inspiration tool!',
    excerpt: 'Get started with FIT and discover your style.',
    coverImage: '/images/welcome.jpg',
    date: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    author: {
      name: 'FIT Team',
      picture: '/images/team.jpg',
    },
  },
  // Add more mock posts as needed
];

/**
 * Fetches blog posts from the API
 * In a real application, this would be a call to your backend API
 */
export const getPosts = async (): Promise<Post[]> => {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockPosts);
    }, 100);
  });
};

/**
 * Fetches a single post by slug
 */
export const getPostBySlug = async (slug: string): Promise<Post | null> => {
  const posts = await getPosts();
  return posts.find((post) => post.slug === slug) || null;
};
