const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Generating Prisma client...');

// Set environment variables for Prisma
try {
  // Create a custom .env file for Prisma if it doesn't exist
  const envPath = path.join(__dirname, '../.env');
  if (!fs.existsSync(envPath)) {
    console.log('📄 Creating .env file...');
    fs.copyFileSync(path.join(__dirname, '../.env.example'), envPath);
    console.log('⚠️  Please update the .env file with your configuration and then run this script again.');
    process.exit(0);
  }

  // Set environment variables
  process.env.PRISMA_CLI_BINARY_TARGETS = 'linux-musl';
  process.env.PRISMA_ENGINES_CHECKSUM_IGNORE_MISSING = '1';

  // Generate the Prisma client
  console.log('🔧 Running prisma generate...');
  execSync('npx prisma generate', { stdio: 'inherit' });

  console.log('✅ Prisma client generated successfully!');
  
  // Run database migrations
  console.log('🚀 Running database migrations...');
  execSync('npx prisma migrate dev --name init', { stdio: 'inherit' });
  
  // Seed the database
  console.log('🌱 Seeding the database...');
  execSync('npx ts-node prisma/seed.ts', { stdio: 'inherit' });
  
  console.log('🎉 Database setup complete!');
  
} catch (error) {
  console.error('❌ Error generating Prisma client:', error);
  process.exit(1);
}
