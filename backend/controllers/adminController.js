// backend/controllers/adminController.js
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

/**
 * PRODUCTS
 */
export const listProducts = async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      include: { images: true, inventory: true },
      orderBy: { id: 'asc' },
    });
    res.json({ products });
  } catch (err) {
    console.error('listProducts', err);
    res.status(500).json({ message: 'Failed to list products' });
  }
};

export const getProduct = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const product = await prisma.product.findUnique({
      where: { id },
      include: { images: true, inventory: true },
    });
    if (!product) return res.status(404).json({ message: 'Not found' });
    res.json({ product });
  } catch (err) {
    console.error('getProduct', err);
    res.status(500).json({ message: 'Failed to fetch product' });
  }
};

export const createProduct = async (req, res) => {
  try {
    const { name, description, price, categoryId, images = [], stock = 0 } = req.body;

    if (!name || !price) return res.status(400).json({ message: 'name & price required' });

    const product = await prisma.product.create({
      data: {
        name,
        description: description || '',
        price: Number(price),
        categoryId: categoryId ? Number(categoryId) : null,
      },
    });

    // product images
    if (Array.isArray(images) && images.length) {
      const imageCreates = images.map(url => ({ productId: product.id, url }));
      await prisma.productImage.createMany({ data: imageCreates });
    }

    // inventory
    await prisma.inventory.create({
      data: { productId: product.id, stockCount: Number(stock || 0) },
    });

    const created = await prisma.product.findUnique({
      where: { id: product.id },
      include: { images: true, inventory: true },
    });

    res.status(201).json({ product: created });
  } catch (err) {
    console.error('createProduct', err);
    res.status(500).json({ message: 'Failed to create product' });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { name, description, price, categoryId } = req.body;

    const updated = await prisma.product.update({
      where: { id },
      data: {
        name,
        description,
        price: price !== undefined ? Number(price) : undefined,
        categoryId: categoryId !== undefined ? (categoryId ? Number(categoryId) : null) : undefined,
      },
    });

    res.json({ product: updated });
  } catch (err) {
    console.error('updateProduct', err);
    res.status(500).json({ message: 'Failed to update product' });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const id = Number(req.params.id);

    // Cascade-delete related rows if necessary (Prisma may fail if FK constraints exist).
    await prisma.productImage.deleteMany({ where: { productId: id } });
    await prisma.inventory.deleteMany({ where: { productId: id } });
    await prisma.cartItem.deleteMany({ where: { productId: id } });
    await prisma.orderItem.deleteMany({ where: { productId: id } });

    await prisma.product.delete({ where: { id } });

    res.json({ message: 'Deleted' });
  } catch (err) {
    console.error('deleteProduct', err);
    res.status(500).json({ message: 'Failed to delete product' });
  }
};

/**
 * IMAGE helper (add one)
 */
export const addProductImage = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { url } = req.body;
    if (!url) return res.status(400).json({ message: 'url required' });

    const pi = await prisma.productImage.create({
      data: { productId: id, url },
    });

    res.status(201).json({ image: pi });
  } catch (err) {
    console.error('addProductImage', err);
    res.status(500).json({ message: 'Failed to add image' });
  }
};

/**
 * INVENTORY (adjust stock)
 */
export const updateInventory = async (req, res) => {
  try {
    const id = Number(req.params.id); // product id
    const { stock } = req.body;
    if (stock === undefined) return res.status(400).json({ message: 'stock required' });

    const inv = await prisma.inventory.upsert({
      where: { productId: id },
      update: { stockCount: Number(stock) },
      create: { productId: id, stockCount: Number(stock) },
    });

    res.json({ inventory: inv });
  } catch (err) {
    console.error('updateInventory', err);
    res.status(500).json({ message: 'Failed to update inventory' });
  }
};

/**
 * ORDERS
 */
export const listOrders = async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      include: {
        orderItems: {
          include: { product: { include: { images: true } } }
        },
        user: true,
        address: true,
      },
      orderBy: { createdAt: 'desc' },
    });
    res.json({ orders });
  } catch (err) {
    console.error('listOrders', err);
    res.status(500).json({ message: 'Failed to list orders' });
  }
};

export const getOrder = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        orderItems: { include: { product: true } },
        user: true,
        address: true,
      },
    });
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json({ order });
  } catch (err) {
    console.error('getOrder', err);
    res.status(500).json({ message: 'Failed to fetch order' });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { status } = req.body;
    if (!status) return res.status(400).json({ message: 'status required' });
    const updated = await prisma.order.update({
      where: { id },
      data: { status },
    });
    res.json({ order: updated });
  } catch (err) {
    console.error('updateOrderStatus', err);
    res.status(500).json({ message: 'Failed to update order status' });
  }
};