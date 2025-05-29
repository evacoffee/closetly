const { createCanvas } = require('canvas');
const fs = require('fs');
const path = require('path');

// Ensure resources directory exists
const resourcesDir = path.join(__dirname, '../resources');
if (!fs.existsSync(resourcesDir)) {
  fs.mkdirSync(resourcesDir, { recursive: true });
}

// Create icon (1024x1024)
function createIcon() {
  const size = 1024;
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');
  
  // Background
  ctx.fillStyle = '#6366f1'; // indigo-500
  ctx.fillRect(0, 0, size, size);
  
  // Text
  ctx.fillStyle = '#ffffff';
  ctx.font = `bold ${size * 0.5}px Arial`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('FIT', size / 2, size / 2);
  
  // Save
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(path.join(resourcesDir, 'icon.png'), buffer);
  console.log('✅ Created icon.png');
}

// Create splash screen (2732x2732)
function createSplash() {
  const size = 2732;
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');
  
  // Background
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, size, size);
  
  // Logo (smaller than icon)
  const logoSize = size * 0.3;
  const x = size / 2;
  const y = size / 2;
  
  // Draw logo background
  ctx.fillStyle = '#6366f1';
  ctx.beginPath();
  ctx.roundRect(
    x - logoSize / 2,
    y - logoSize / 2,
    logoSize,
    logoSize,
    logoSize * 0.2
  );
  ctx.fill();
  
  // Draw text
  ctx.fillStyle = '#ffffff';
  ctx.font = `bold ${logoSize * 0.3}px Arial`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('FIT', x, y);
  
  // Save
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(path.join(resourcesDir, 'splash.png'), buffer);
  console.log('✅ Created splash.png');
}

// Run both
createIcon();
createSplash();
