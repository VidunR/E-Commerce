import express from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const router = express.Router();

router.get("/:productId", async (req, res) => {
  const productId = Number(req.params.productId);

  const product = await prisma.product.findUnique({
    where: { id: productId },
  });

  if (!product) return res.status(404).json({ message: "Product not found" });

  const recommendations = await prisma.product.findMany({
    where: {
      categoryId: product.categoryId,
      NOT: { id: productId },
    },
    include: { images: true, inventory: true },
    take: 4,
  });

  const formatted = recommendations.map((p) => ({
    id: p.id,
    name: p.name,
    price: p.price,
    image: p.images[0] ? "/products/" + p.images[0].url.replace(/^products\//, "") : "/placeholder.jpg",
    inStock: p.inventory?.stockCount > 0,
  }));

  res.json({ recommendations: formatted });
});

export default router;
