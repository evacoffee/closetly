export interface Author {
  name: string;
  picture: string;
}

export interface Post {
  id: string;
  slug: string;
  title: string;
  content: string;
  excerpt: string;
  coverImage: string;
  date: string;
  updatedAt: string;
  author: Author;
}
