import express from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const router = express.Router();

router.get("/", async (req, res) => {
  const q = req.query.q?.trim();

  if (!q || q.length < 1) {
    return res.json({ results: [] });
  }

  const results = await prisma.product.findMany({
    where: {
      OR: [
        { name: { contains: q } },
        { description: { contains: q } },
      ]
    },
    include: {
      images: true,
      inventory: true,
    },
    take: 10,
  });

  const formatted = results.map(p => ({
    id: p.id,
    name: p.name,
    price: p.price,
    image: p.images[0] ? "/products/" + p.images[0].url.replace(/^products\//, "") : "/placeholder.jpg",
    inStock: p.inventory?.stockCount > 0,
  }));

  res.json({ results: formatted });
});

export default router;
