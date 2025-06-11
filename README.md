# closetly - your digital wardrobe

[![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![NextAuth.js](https://img.shields.io/badge/NextAuth.js-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://next-auth.js.org/)

A modern digital wardrobe application that helps users catalog their clothing collection, generate outfit combinations, and connect with fashion enthusiasts.

*small use of AI for checking purposes*

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

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- PostgreSQL 14+
- Google OAuth credentials (for social login)

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/closetly.git
   cd closetly
   ```

2. Install dependencies
   ```bash
   npm install
   # or
   yarn
   ```

3. Set up environment variables
   ```bash
   cp .env.example .env.local
   ```
   Update the values in `.env.local` with your configuration.

4. Set up the database
   ```bash
   npx prisma migrate dev --name init
   ```

5. Run the development server
   ```bash
   npm run dev
   # or
   yarn dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🔒 Security Features

- **Content Security Policy (CSP)** - Protect against XSS attacks
- **Rate Limiting** - Prevent abuse of API endpoints
- **Secure Headers** - X-Content-Type-Options, X-Frame-Options, etc.
- **CSRF Protection** - Built-in CSRF protection
- **Password Hashing** - Secure password storage
- **Session Management** - Secure session handling

## 🛠️ Built With

- [Next.js](https://nextjs.org/) - The React Framework
- [TypeScript](https://www.typescriptlang.org/) - Type Safety
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [PostgreSQL](https://www.postgresql.org/) - Database
- [Prisma](https://www.prisma.io/) - Database ORM
- [NextAuth.js](https://next-auth.js.org/) - Authentication
- [Stripe](https://stripe.com/) - Payment Processing

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
