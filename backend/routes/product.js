import express from "express";
import { PrismaClient } from "@prisma/client";

const router = express.Router();
const prisma = new PrismaClient();

// GET /api/products
router.get('/', async (req, res) => {
  const products = await prisma.product.findMany({
    include: { images: true, inventory: true }
  });

  const normalized = products.map(p => ({
    ...p,
    images: p.images.map(img => {
      let imgUrl = img.url;

      // normalize: remove leading "products/" if exists
      imgUrl = imgUrl.replace(/^products\//, "");

      return `/products/${imgUrl}`;
    })
  }));

  res.json({ products: normalized });
});

// GET /api/products/:id
router.get('/:id', async (req, res) => {
  const id = Number(req.params.id);

  const product = await prisma.product.findUnique({
    where: { id },
    include: { images: true, inventory: true }
  });

  if (!product) return res.status(404).json({ message: 'Not found' });

  const normalized = {
    ...product,
    images: product.images.map(img => {
      let imgUrl = img.url.replace(/^products\//, "");
      return `/products/${imgUrl}`;
    })
  };

  res.json({ product: normalized });
});

export default router;