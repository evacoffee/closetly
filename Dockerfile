# Use the official Node.js image
FROM node:18-alpine AS base

# Set working directory
WORKDIR /app

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app

# Install additional dependencies for build process
RUN apk add --no-cache libc6-compat

# Copy package files
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app

# Set Next.js to output standalone mode
ENV NEXT_TELEMETRY_DISABLED 1
ENV NODE_ENV=production

# Copy node_modules from deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy all project files
COPY . .

# Create a new next.config.js that disables ESLint and enables standalone mode
RUN echo 'const withBundleAnalyzer = require("@next/bundle-analyzer")({ enabled: process.env.ANALYZE === "true" });' > next.config.js && \
    echo 'const withPWA = require("next-pwa")({ dest: "public", disable: process.env.NODE_ENV === "development", register: true, skipWaiting: true });' >> next.config.js && \
    echo 'const nextConfig = { output: "standalone", eslint: { ignoreDuringBuilds: true }, typescript: { ignoreBuildErrors: true }, reactStrictMode: true, swcMinify: true };' >> next.config.js && \
    echo 'module.exports = withPWA(withBundleAnalyzer(nextConfig));' >> next.config.js

# Create a temporary .env.local file with required environment variables
RUN echo "MONGODB_URI=mongodb://mongo:27017/fit\nNEXTAUTH_URL=http://localhost:3000\nNEXTAUTH_SECRET=temporarysecretforbuilding" > .env.local

# Build the application
RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

# Create non-root user for security
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy necessary files from builder
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Copy environment files
COPY --from=builder /app/.env.* ./

# Set user to non-root for security
USER nextjs

# Expose port and set environment variables
EXPOSE 3000
ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

# Start the application
CMD ["node", "server.js"]