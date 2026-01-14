// backend/prisma/seed.js
import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Categories
  const accessories = await prisma.category.upsert({
    where: { slug: 'wallets' },
    update: {},
    create: {
      name: 'Wallets',
      slug: 'wallets',
      description: 'Luxury leather wallets',
    },
  });

  // Create products + variants
  const product1 = await prisma.product.create({
    data: {
      name: 'The Minimalist',
      slug: 'the-minimalist',
      description: 'Slim profile leather wallet.',
      price: new Prisma.Decimal('189.00'),
      categoryId: accessories.id,
      images: {
        create: [
          { url: '/products/wallet1.jpg', alt: 'The Minimalist' },
          { url: '/products/wallet2.jpg', alt: 'Alternate' },
        ],
      },
      variants: {
        create: [
          {
            sku: 'LW-MIN-BLK',
            name: 'Black',
            price: new Prisma.Decimal('189.00'),
            metadata: { color: 'black' },
            inventory: { create: { stockCount: 10, safetyStock: 2 } },
          },
          {
            sku: 'LW-MIN-BRN',
            name: 'Brown',
            price: new Prisma.Decimal('189.00'),
            metadata: { color: 'brown' },
            inventory: { create: { stockCount: 8, safetyStock: 2 } },
          },
        ],
      },
    },
  });

  // another product
  await prisma.product.create({
    data: {
      name: 'The Executive',
      slug: 'the-executive',
      description: 'Full grain Italian leather wallet.',
      price: new Prisma.Decimal('249.00'),
      categoryId: accessories.id,
      images: {
        create: [{ url: '/products/wallet3.jpg', alt: 'Executive' }],
      },
      variants: {
        create: [
          {
            sku: 'LW-EXE-BLK',
            name: 'Black',
            price: new Prisma.Decimal('249.00'),
            metadata: { color: 'black' },
            inventory: { create: { stockCount: 6 } },
          },
        ],
      },
    },
  });

  console.log('Seed finished');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
