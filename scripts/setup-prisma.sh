#!/bin/bash

# Exit on error
set -e

echo "🚀 Setting up Prisma..."

# Install dependencies
echo "📦 Installing dependencies..."
npm install @prisma/client

# Generate Prisma client with specific platform target
echo "🔧 Generating Prisma client..."
PRISMA_CLI_BINARY_TARGETS=linux-musl npx prisma generate

echo "✅ Prisma setup complete!"
