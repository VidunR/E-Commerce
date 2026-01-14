// backend/controllers/cartController.js
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const getCart = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const userId = Number(req.user.id);
    const cart = await prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            product: {
              include: {
                images: true
              }
            }
          }
        }
      }
    });

    if (!cart) {
      return res.json({ items: [] });
    }

    return res.json({ items: cart.items });
  } catch (err) {
    console.error("getCart error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const addCartItem = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const userId = Number(req.user.id);
    const { productId, quantity } = req.body;

    // basic validation
    if (typeof productId === "undefined" || typeof quantity === "undefined") {
      return res.status(400).json({ message: "productId and quantity are required" });
    }

    const pid = Number(productId);
    const qty = Number(quantity);

    if (!Number.isInteger(pid) || pid <= 0) {
      return res.status(400).json({ message: "Invalid productId" });
    }
    if (!Number.isInteger(qty) || qty <= 0) {
      return res.status(400).json({ message: "Invalid quantity" });
    }

    // ensure product exists
    const product = await prisma.product.findUnique({ where: { id: pid } });
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // find or create cart for user
    let cart = await prisma.cart.findUnique({ where: { userId } });
    if (!cart) {
      cart = await prisma.cart.create({ data: { userId } });
    }

    // existing item?
    const existingItem = await prisma.cartItem.findFirst({
      where: { cartId: cart.id, productId: pid }
    });

    if (existingItem) {
      const updated = await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + qty }
      });
      return res.json(updated);
    }

    // create new item (snapshot price)
    const newItem = await prisma.cartItem.create({
      data: {
        cartId: cart.id,
        productId: pid,
        quantity: qty,
        price: product.price,
      },
      include: {
        product: true
      }
    });

    return res.status(201).json(newItem);

  } catch (err) {
    console.error("addCartItem error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const updateCartItem = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { itemId } = req.params;
    const { quantity } = req.body;
    const qty = Number(quantity);

    if (!Number.isInteger(qty) || qty <= 0) {
      return res.status(400).json({ message: "Invalid quantity" });
    }

    const updated = await prisma.cartItem.update({
      where: { id: Number(itemId) },
      data: { quantity: qty }
    });

    return res.json(updated);
  } catch (err) {
    console.error("updateCartItem error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const removeCartItem = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { itemId } = req.params;
    await prisma.cartItem.delete({
      where: { id: Number(itemId) }
    });

    return res.json({ message: "Item removed" });
  } catch (err) {
    console.error("removeCartItem error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const clearCart = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const userId = Number(req.user.id);
    const cart = await prisma.cart.findUnique({ where: { userId } });
    
    if (cart) {
      await prisma.cartItem.deleteMany({
        where: { cartId: cart.id }
      });
    }

    return res.json({ message: "Cart cleared" });
  } catch (err) {
    console.error("clearCart error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};
