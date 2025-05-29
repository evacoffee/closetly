const { execSync } = require('child_process');

console.log('Generating assets...');

try {
  // Generate icons
  execSync('npx cordova-res ios --skip-config --copy', { stdio: 'inherit' });
  execSync('npx cordova-res android --skip-config --copy', { stdio: 'inherit' });
  
  // Copy assets to native projects
  execSync('npx cap sync', { stdio: 'inherit' });
  
  console.log('✅ Assets generated successfully!');
} catch (error) {
  console.error('❌ Error generating assets:', error);
  process.exit(1);
}
