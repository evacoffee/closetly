#!/bin/bash

# Exit on error
set -e

echo "🚀 Setting up Closetly..."

# Create .env file with default values
cat > .env << 'EOL'
# Application
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Database
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/closetly?schema=public

# Authentication
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-change-this-in-production
NEXTAUTH_DEBUG=true

# OAuth Providers (optional)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Security
JWT_SECRET=your-jwt-secret-change-this-in-production
EOL

echo "✅ .env file created successfully!"

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
  echo "📦 Installing Node.js dependencies..."
  npm install
fi

# Generate Prisma client
echo "🔧 Generating Prisma client..."
PRISMA_CLI_BINARY_TARGETS=linux-musl PRISMA_ENGINES_CHECKSUM_IGNORE_MISSING=1 npx prisma generate

# Create database if it doesn't exist
echo "🔍 Setting up database..."
sudo -u postgres psql -c "CREATE DATABASE closetly;" 2>/dev/null || true

# Run migrations
echo "🔄 Running database migrations..."
PRISMA_CLI_BINARY_TARGETS=linux-musl PRISMA_ENGINES_CHECKSUM_IGNORE_MISSING=1 npx prisma migrate dev --name init

# Seed the database
echo "🌱 Seeding database..."
npx ts-node prisma/seed.ts

echo ""
echo "🎉 Setup complete!"
echo "You can now start the development server with:"
echo "  npm run dev"
echo ""
echo "Admin credentials:"
echo "  Email: admin@example.com"
echo "  Password: admin123"
echo ""
echo "User credentials:"
echo "  Email: user@example.com"
echo "  Password: user1234"
