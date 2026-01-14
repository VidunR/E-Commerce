import express from "express";
import { PrismaClient } from "@prisma/client";
import { authMiddleware } from "../middleware/authMiddleware.js";

const prisma = new PrismaClient();
const router = express.Router();

router.get("/", authMiddleware, async (req, res) => {
  try {
    const items = await prisma.wishlist.findMany({
      where: { userId: req.user.id },
      include: { 
        product: { 
          include: { 
            images: true,
            inventory: true
          } 
        } 
      }
    });

    const formatted = items.map(w => ({
      id: w.product.id,
      name: w.product.name,
      price: w.product.price,
      description: w.product.description,
      images: w.product.images.map(i => i.url),
      inStock: w.product.inventory ? w.product.inventory.stockCount > 0 : false,
      variants: [{ id: 1, color: 'Default', colorHex: '#000000' }]
    }));

    res.json({ wishlist: formatted });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to load wishlist" });
  }
});

router.post("/:productId", authMiddleware, async (req, res) => {
  try {
    const productId = Number(req.params.productId);

    await prisma.wishlist.upsert({
      where: {
        userId_productId: { userId: req.user.id, productId },
      },
      update: {},
      create: { userId: req.user.id, productId },
    });

    res.json({ message: "Added to wishlist" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Could not add to wishlist" });
  }
});

router.delete("/:productId", authMiddleware, async (req, res) => {
  try {
    const productId = Number(req.params.productId);

    await prisma.wishlist.deleteMany({
      where: { userId: req.user.id, productId },
    });

    res.json({ message: "Removed from wishlist" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Could not remove from wishlist" });
  }
});

export default router;
