import 'dotenv/config';
import { PrismaLibSql } from '@prisma/adapter-libsql';
import { PrismaClient } from '../generated/prisma/client';

const adapter = new PrismaLibSql({
  url: process.env['DATABASE_URL'] ?? 'file:./prisma/dev.db',
  authToken: process.env['DATABASE_AUTH_TOKEN'],
});

const prisma = new PrismaClient({ adapter });

async function main() {
  // ---------------------------------------------------------------------------
  // Categorías
  // ---------------------------------------------------------------------------
  const audio = await prisma.category.upsert({
    where: { name: 'audio' },
    update: {},
    create: { name: 'audio', description: 'Dispositivos de audio y sonido' },
  });
  const perifericos = await prisma.category.upsert({
    where: { name: 'perifericos' },
    update: {},
    create: {
      name: 'perifericos',
      description: 'Teclados, ratones y accesorios',
    },
  });
  const monitores = await prisma.category.upsert({
    where: { name: 'monitores' },
    update: {},
    create: { name: 'monitores', description: 'Pantallas y displays' },
  });
  const accesorios = await prisma.category.upsert({
    where: { name: 'accesorios' },
    update: {},
    create: {
      name: 'accesorios',
      description: 'Cables, adaptadores y complementos',
    },
  });

  // ---------------------------------------------------------------------------
  // Productos
  // ---------------------------------------------------------------------------
  const auriculares = await prisma.product.upsert({
    where: { id: 'prod-1' },
    update: {},
    create: {
      id: 'prod-1',
      name: 'Auriculares Bluetooth',
      description: 'Cancelación de ruido, 30h de batería',
      price: 79.99,
      stock: 42,
      imageUrl: 'https://picsum.photos/seed/headphones/800/600',
      categoryId: audio.id,
    },
  });
  const teclado = await prisma.product.upsert({
    where: { id: 'prod-2' },
    update: {},
    create: {
      id: 'prod-2',
      name: 'Teclado mecánico',
      description: 'Switches táctiles, layout ISO',
      price: 119.5,
      stock: 15,
      imageUrl: 'https://picsum.photos/seed/keyboard/800/600',
      categoryId: perifericos.id,
    },
  });
  const monitor = await prisma.product.upsert({
    where: { id: 'prod-3' },
    update: {},
    create: {
      id: 'prod-3',
      name: 'Monitor 27 4K',
      description: 'IPS, 60Hz, HDR400',
      price: 349,
      stock: 8,
      imageUrl: 'https://picsum.photos/seed/monitor/800/600',
      categoryId: monitores.id,
    },
  });
  const hub = await prisma.product.upsert({
    where: { id: 'prod-4' },
    update: {},
    create: {
      id: 'prod-4',
      name: 'Hub USB-C',
      description: '7 en 1: HDMI, USB-A, SD',
      price: 45,
      stock: 100,
      imageUrl: 'https://picsum.photos/seed/hub/800/600',
      categoryId: accesorios.id,
    },
  });

  // ---------------------------------------------------------------------------
  // Usuarios
  // ---------------------------------------------------------------------------
  const sofia = await prisma.user.upsert({
    where: { email: 'sofia@example.com' },
    update: {},
    create: {
      firstName: 'Sofia',
      lastName: 'Mendoza',
      email: 'sofia@example.com',
      lastVisit: new Date('2026-04-09T16:30:00.000Z'),
      createdAt: new Date('2026-03-01T10:00:00.000Z'),
    },
  });
  const daniel = await prisma.user.upsert({
    where: { email: 'daniel@example.com' },
    update: {},
    create: {
      firstName: 'Daniel',
      lastName: 'Rojas',
      email: 'daniel@example.com',
      lastVisit: new Date('2026-04-10T08:12:00.000Z'),
      createdAt: new Date('2026-03-10T09:20:00.000Z'),
    },
  });

  // ---------------------------------------------------------------------------
  // Reseñas
  // ---------------------------------------------------------------------------
  await prisma.review.upsert({
    where: { id: 'rev-1' },
    update: {},
    create: {
      id: 'rev-1',
      title: 'Muy buena calidad',
      comment: 'Cómodos y con excelente sonido.',
      rating: 5,
      userId: sofia.id,
      productId: auriculares.id,
      createdAt: new Date('2026-04-05T11:00:00.000Z'),
    },
  });
  await prisma.review.upsert({
    where: { id: 'rev-2' },
    update: {},
    create: {
      id: 'rev-2',
      title: 'Buen teclado',
      comment: 'Buena respuesta, algo ruidoso.',
      rating: 4,
      userId: daniel.id,
      productId: teclado.id,
      createdAt: new Date('2026-04-06T18:40:00.000Z'),
    },
  });
  await prisma.review.upsert({
    where: { id: 'rev-3' },
    update: {},
    create: {
      id: 'rev-3',
      title: 'Imagen nítida',
      comment: null,
      rating: 5,
      userId: sofia.id,
      productId: monitor.id,
      createdAt: new Date('2026-04-07T13:25:00.000Z'),
    },
  });

  // ---------------------------------------------------------------------------
  // Órdenes
  // ---------------------------------------------------------------------------
  const orden1 = await prisma.order.upsert({
    where: { id: 'ord-1' },
    update: {},
    create: {
      id: 'ord-1',
      status: 'COMPLETED',
      userId: sofia.id,
      createdAt: new Date('2026-04-01T10:00:00.000Z'),
      updatedAt: new Date('2026-04-02T12:30:00.000Z'),
    },
  });
  const orden2 = await prisma.order.upsert({
    where: { id: 'ord-2' },
    update: {},
    create: {
      id: 'ord-2',
      status: 'PROCESSING',
      userId: daniel.id,
      createdAt: new Date('2026-04-09T09:15:00.000Z'),
      updatedAt: new Date('2026-04-10T09:00:00.000Z'),
    },
  });

  // ---------------------------------------------------------------------------
  // Items de órdenes
  // ---------------------------------------------------------------------------
  await prisma.orderItem.upsert({
    where: { id: 'item-1' },
    update: {},
    create: {
      id: 'item-1',
      orderId: orden1.id,
      productId: auriculares.id,
      quantity: 1,
      unitPrice: 79.99,
    },
  });
  await prisma.orderItem.upsert({
    where: { id: 'item-2' },
    update: {},
    create: {
      id: 'item-2',
      orderId: orden1.id,
      productId: hub.id,
      quantity: 2,
      unitPrice: 45,
    },
  });
  await prisma.orderItem.upsert({
    where: { id: 'item-3' },
    update: {},
    create: {
      id: 'item-3',
      orderId: orden2.id,
      productId: teclado.id,
      quantity: 1,
      unitPrice: 119.5,
    },
  });

  console.log('✅ Seed completado con éxito');
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
