#!/bin/bash

# Exit on error
set -e

echo "🚀 Setting up Closetly environment..."

# Generate a random secret for NEXTAUTH_SECRET
NEXTAUTH_SECRET=$(openssl rand -base64 32)
JWT_SECRET=$(openssl rand -base64 32)

# Create .env file with default values
cat > .env <<EOL
# Application
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Database
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/closetly?schema=public

# Authentication
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=$NEXTAUTH_SECRET
NEXTAUTH_DEBUG=true

# OAuth Providers (optional)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Security
JWT_SECRET=$JWT_SECRET
EOL

echo "✅ .env file created successfully!"
echo "🔑 Generated secure secrets for authentication"
echo ""
echo "Next steps:"
echo "1. Ensure PostgreSQL is running and accessible"
echo "2. Run: npx prisma migrate dev --name init"
echo "3. Run: npx prisma db seed"
