import { Post } from '@/types/index'; // Updated import path

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
];

export const getPosts = async (): Promise<Post[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockPosts);
    }, 100);
  });
};

export const getPostBySlug = async (slug: string): Promise<Post | null> => {
  const posts = await getPosts();
  return posts.find((post) => post.slug === slug) || null;
};
