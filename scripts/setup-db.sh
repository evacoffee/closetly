#!/bin/bash

# Exit on error
set -e

echo "🚀 Setting up Closetly database..."

# Function to check if a command exists
command_exists() {
  command -v "$1" >/dev/null 2>&1
}

# Check if Node.js is installed
if ! command_exists node; then
  echo "❌ Node.js is not installed. Please install Node.js 16+ and try again."
  exit 1
fi

# Check if PostgreSQL is running
if ! command_exists psql; then
  echo "❌ PostgreSQL is not installed. Please install PostgreSQL and try again."
  exit 1
fi

# Check if database exists, create if it doesn't
DB_EXISTS=$(psql -U postgres -tAc "SELECT 1 FROM pg_database WHERE datname='closetly'")
if [[ -z "$DB_EXISTS" ]]; then
  echo "🔍 Creating database 'closetly'..."
  sudo -u postgres psql -c "CREATE DATABASE closetly;"
  sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE closetly TO postgres;"
else
  echo "✅ Database 'closetly' already exists"
fi

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
  echo "📦 Installing Node.js dependencies..."
  npm install
fi

# Generate Prisma client
echo "🔧 Generating Prisma client..."
PRISMA_CLI_BINARY_TARGETS=linux-musl PRISMA_ENGINES_CHECKSUM_IGNORE_MISSING=1 npx prisma generate

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
