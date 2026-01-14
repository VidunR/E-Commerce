import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import {
  getCart,
  addCartItem,
  updateCartItem,
  removeCartItem,
  clearCart
} from "../controllers/cartController.js";

const router = express.Router();

router.get("/", authMiddleware, getCart);
router.post("/items", authMiddleware, addCartItem);
router.patch("/items/:itemId", authMiddleware, updateCartItem);
router.delete("/items/:itemId", authMiddleware, removeCartItem);
router.delete("/", authMiddleware, clearCart);

export default router;
