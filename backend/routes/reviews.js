import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const router = express.Router();

// Get reviews for a product
router.get("/:productId", async (req, res) => {
  try {
    const productId = Number(req.params.productId);

    const reviews = await prisma.review.findMany({
      where: { productId },
      include: { user: { select: { id: true, name: true } } },
      orderBy: { createdAt: "desc" },
    });

    const avgRating = reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

    res.json({ reviews, avgRating: avgRating.toFixed(1) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to load reviews" });
  }
});

// Add or update review
router.post("/:productId", authMiddleware, async (req, res) => {
  try {
    const productId = Number(req.params.productId);
    const userId = req.user.id;
    const { rating, comment } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: "Rating must be 1–5" });
    }

    const existing = await prisma.review.findFirst({
      where: { productId, userId },
    });

    let review;

    if (existing) {
      review = await prisma.review.update({
        where: { id: existing.id },
        data: { rating, comment },
        include: { user: { select: { id: true, name: true } } },
      });
    } else {
      review = await prisma.review.create({
        data: { rating, comment, productId, userId },
        include: { user: { select: { id: true, name: true } } },
      });
    }

    res.json({ review });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to save review" });
  }
});

// Delete review
router.delete("/:productId", authMiddleware, async (req, res) => {
  try {
    const productId = Number(req.params.productId);
    const userId = req.user.id;

    await prisma.review.deleteMany({
      where: { productId, userId },
    });

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete review" });
  }
});

export default router;
