#!/bin/bash

# Exit on error
set -e

echo "🚀 Starting Closetly setup..."

# Install Node.js dependencies
echo "📦 Installing Node.js dependencies..."
npm install

# Set up Prisma
echo "🔧 Setting up Prisma..."
PRISMA_CLI_BINARY_TARGETS=linux-musl npx prisma generate

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
  echo "📄 Creating .env file..."
  cp .env.example .env
  echo "⚠️  Please update the .env file with your configuration and then run this script again."
  exit 0
fi

# Initialize the database
echo "💾 Initializing database..."
npx prisma migrate dev --name init

# Seed the database
echo "🌱 Seeding database..."
npx ts-node prisma/seed.ts

echo ""
echo "🎉 Setup complete!"
echo "You can now start the development server with:"
echo "  npm run dev"
