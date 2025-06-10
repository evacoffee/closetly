#!/usr/bin/env bash

# Exit on error
set -e

echo "🚀 Setting up Closetly with Nix..."

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "📄 Creating .env file..."
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
    echo "✅ .env file created!"
else
    echo "ℹ️  .env file already exists, skipping creation."
fi

# Install Node.js dependencies in a nix-shell
echo "📦 Installing Node.js dependencies..."
nix-shell -p nodejs_20 --run "npm install"

# Generate Prisma client
echo "🔧 Generating Prisma client..."
nix-shell -p nodejs_20 --run "PRISMA_CLI_BINARY_TARGETS=linux-musl PRISMA_ENGINES_CHECKSUM_IGNORE_MISSING=1 npx prisma generate"

# Setup database
echo "💾 Setting up database..."
if ! nix-shell -p postgresql --run "psql -U postgres -tAc \"SELECT 1 FROM pg_database WHERE datname='closetly'\"" | grep -q 1; then
    echo "  Creating database 'closetly'..."
    sudo -u postgres createdb closetly
else
    echo "  Database 'closetly' already exists."
fi

# Run migrations
echo "🔄 Running database migrations..."
nix-shell -p nodejs_20 postgresql --run "PRISMA_CLI_BINARY_TARGETS=linux-musl PRISMA_ENGINES_CHECKSUM_IGNORE_MISSING=1 npx prisma migrate dev --name init"

# Seed the database
echo "🌱 Seeding database..."
nix-shell -p nodejs_20 --run "npx ts-node prisma/seed.ts"

echo ""
echo "🎉 Setup complete!"
echo "You can now start the development server with:"
echo "  nix-shell -p nodejs_20 --run \"npm run dev\""
echo ""
echo "Admin credentials:"
echo "  Email: admin@example.com"
echo "  Password: admin123"
echo ""
echo "User credentials:"
echo "  Email: user@example.com"
echo "  Password: user1234"
echo ""
echo "⚠️  Don't forget to update the secrets in the .env file for production!"
