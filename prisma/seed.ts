import { PrismaClient, UserRole, ItemCategory, ItemCondition } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  const hashedAdminPassword = await bcrypt.hash('admin123', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      name: 'Admin User',
      email: 'admin@example.com',
      username: 'admin',
      password: hashedAdminPassword,
      emailVerified: new Date(),
      role: 'ADMIN',
      bio: 'I am the admin of Closetly',
      location: 'Internet',
      website: 'https://closetly.app',
      styleProfile: {
        create: {
          style: ['MINIMALIST', 'CASUAL'],
          colors: ['BLACK', 'WHITE', 'NAVY'],
          sizes: ['M', 'L'],
          preferences: {
            fit: 'regular',
            stylePreferences: ['minimal', 'classic']
          }
        }
      }
    },
    include: { styleProfile: true }
  });

  const hashedUserPassword = await bcrypt.hash('user1234', 12);
  const user = await prisma.user.upsert({
    where: { email: 'user@example.com' },
    update: {},
    create: {
      name: 'Test User',
      email: 'user@example.com',
      username: 'testuser',
      password: hashedUserPassword,
      emailVerified: new Date(),
      bio: 'Fashion enthusiast and clothing lover',
      location: 'New York, NY',
      styleProfile: {
        create: {
          style: ['CASUAL', 'STREETWEAR'],
          colors: ['BLUE', 'BLACK', 'GRAY'],
          sizes: ['M', '32'],
          preferences: {
            fit: 'slim',
            stylePreferences: ['streetwear', 'casual']
          }
        }
      },
      following: {
        connect: [{ id: admin.id }]
      }
    },
    include: {
      styleProfile: true,
      following: true
    }
  });

  const wardrobeItems = await Promise.all([
    prisma.wardrobeItem.create({
      data: {
        name: 'Classic White T-Shirt',
        description: 'Comfortable cotton t-shirt',
        brand: 'Uniqlo',
        category: ItemCategory.TOPS,
        color: 'WHITE',
        size: 'M',
        condition: ItemCondition.EXCELLENT,
        price: 19.99,
        images: ['/images/wardrobe/tshirt1.jpg'],
        tags: ['casual', 'basic', 'summer'],
        userId: user.id
      }
    }),
    prisma.wardrobeItem.create({
      data: {
        name: 'Slim Fit Jeans',
        description: 'Dark wash jeans',
        brand: 'Levi\'s',
        category: ItemCategory.BOTTOMS,
        color: 'BLUE',
        size: '32',
        condition: ItemCondition.GOOD,
        price: 69.99,
        images: ['/images/wardrobe/jeans1.jpg'],
        tags: ['casual', 'denim', 'pants'],
        userId: user.id
      }
    }),
    prisma.wardrobeItem.create({
      data: {
        name: 'Leather Sneakers',
        description: 'White leather sneakers',
        brand: 'Adidas',
        category: ItemCategory.SHOES,
        color: 'WHITE',
        size: '10',
        condition: ItemCondition.NEW,
        price: 89.99,
        images: ['/images/wardrobe/sneakers1.jpg'],
        tags: ['casual', 'sneakers', 'athletic'],
        userId: user.id
      }
    })
  ]);

  const outfit = await prisma.outfit.create({
    data: {
      name: 'Casual Day Out',
      description: 'Perfect for a casual day out with friends',
      isPublic: true,
      privacy: 'PUBLIC',
      images: ['/images/outfits/casual1.jpg'],
      tags: ['casual', 'daytime', 'spring'],
      userId: user.id,
      items: {
        create: [
          { itemId: wardrobeItems[0].id },
          { itemId: wardrobeItems[1].id },
          { itemId: wardrobeItems[2].id }
        ]
      }
    },
    include: {
      items: true,
      user: true
    }
  });

  console.log('✅ Database seeded successfully!');
  console.log(`👤 Admin user: ${admin.email} (${admin.role})`);
  console.log(`👤 Regular user: ${user.email}`);
  console.log(`👕 Wardrobe items: ${wardrobeItems.length}`);
  console.log(`👗 Outfits: 1`);
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
