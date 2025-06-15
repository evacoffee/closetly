import NextAuth from 'next-auth';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  // Configure your authentication providers
  providers: [
    // Add your authentication providers here
  ],
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };