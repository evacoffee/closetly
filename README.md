# Closetly - Your Digital Wardrobe

[![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![NextAuth.js](https://img.shields.io/badge/NextAuth.js-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://next-auth.js.org/)

Closetly is a modern digital wardrobe application that helps you catalog your clothing collection, generate stylish outfit combinations, and connect with fashion enthusiasts. Manage your wardrobe, get AI-powered outfit suggestions, and discover new styles all in one place.

![Closetly Screenshot](/public/images/closetly-preview.png)

## 🚀 Features

- **Style Quiz** - Discover your personal style
- **Wardrobe Management** - Catalog your clothing items with ease
- **AI Outfit Generator** - Get smart outfit suggestions
- **Social Sharing** - Share your styles and get inspired
- **Responsive Design** - Works seamlessly on all devices

## ✨ Features

- **Style Quiz** - Discover your personal style
- **Wardrobe Management** - Catalog your clothing items
- **Outfit Generation** - Get AI-powered outfit suggestions
- **Social Features** - Share and discover styles
- **Marketplace** - Buy and sell second-hand fashion items
- **Responsive Design** - Works on all devices
- **Secure Authentication** - NextAuth.js with OAuth and credentials
- **Rate Limiting** - Protect against abuse
- **Security Headers** - CSP, XSS Protection, and more

## 🛠 Development Setup

### Prerequisites

- Node.js 18 or later
- npm or yarn
- PostgreSQL 14 or later
- Google OAuth credentials (for social login)

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/closetly.git
   cd closetly
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   Update the values in `.env.local` with your configuration.

4. **Set up the database**
   ```bash
   npx prisma migrate dev --name init
   npx prisma generate
   ```

5. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```
   The app will be available at [http://localhost:3000](http://localhost:3000)

## 🚀 Deployment

### Vercel (Recommended)
1. Push your code to a GitHub/GitLab/Bitbucket repository
2. Import your repository on [Vercel](https://vercel.com/import)
3. Add your environment variables in the Vercel project settings
4. Deploy! Vercel will automatically deploy new commits

### Docker
```bash
docker build -t closetly .
docker run -p 3000:3000 closetly
```

## 🏗 How It's Made

Closetly is built with a modern tech stack to ensure performance, scalability, and developer experience:

- **Frontend**: Next.js with TypeScript and Tailwind CSS for a responsive, type-safe UI
- **Backend**: Next.js API routes for serverless functions
- **Database**: PostgreSQL with Prisma ORM for type-safe database access
- **Authentication**: NextAuth.js for secure authentication with multiple providers
- **Styling**: Tailwind CSS with custom theming for consistent design
- **Deployment**: Optimized for Vercel with serverless functions

The application follows modern web development best practices including:
- Component-based architecture
- Type safety throughout the stack
- Environment-based configuration
- Secure authentication and authorization
- Responsive design principles

## 🔒 Security

Closetly takes security seriously with these built-in protections:
- **Content Security Policy (CSP)** - Protects against XSS attacks
- **Rate Limiting** - Prevents abuse of API endpoints
- **Secure Headers** - Implements security best practices
- **CSRF Protection** - Built-in request forgery protection
- **Password Hashing** - Secure credential storage

## 🛠️ Tech Stack

- **Frontend**: [Next.js](https://nextjs.org/), [TypeScript](https://www.typescriptlang.org/), [Tailwind CSS](https://tailwindcss.com/)
- **Backend**: [Next.js API Routes](https://nextjs.org/docs/api-routes/introduction)
- **Database**: [PostgreSQL](https://www.postgresql.org/) with [Prisma ORM](https://www.prisma.io/)
- **Authentication**: [NextAuth.js](https://next-auth.js.org/)
- **Deployment**: [Vercel](https://vercel.com/)
- **Payments**: [Stripe](https://stripe.com/) (coming soon)

## 🤝 Contributing

Contributions are welcome! Please read our [contributing guidelines](CONTRIBUTING.md).

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
