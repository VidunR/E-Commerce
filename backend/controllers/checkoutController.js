import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const checkout = async (req, res) => {
  try {
    const userId = req.user.id;
    const { addressId, paymentMethod } = req.body;

    if (!addressId || !paymentMethod) {
      return res.status(400).json({ message: "Missing address or payment method" });
    }

    // Get cart
    const cart = await prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: { product: true }
        }
      }
    });

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    // Calculate total
    let totalPrice = 0;
    for (const item of cart.items) {
      totalPrice += item.quantity * item.price;

      // check stock
      const inv = await prisma.inventory.findUnique({
        where: { productId: item.productId }
      });

      if (!inv || inv.stockCount < item.quantity) {
        return res.status(400).json({
          message: `Not enough stock for ${item.product.name}`
        });
      }
    }

    // Determine order status based on payment method
    const orderStatus = paymentMethod === "cod" ? "pending-payment" : paymentMethod === "card" ? "paid" : "processing";

    // Create order
    const order = await prisma.order.create({
      data: {
        userId,
        addressId,
        totalPrice,
        paymentMethod,
        status: orderStatus,
        orderItems: {
          create: cart.items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price
          }))
        }
      },
      include: {
        orderItems: true
      }
    });

    // Deduct stock
    for (const item of cart.items) {
      await prisma.inventory.update({
        where: { productId: item.productId },
        data: {
          stockCount: {
            decrement: item.quantity
          }
        }
      });
    }

    // Clear cart
    await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });

    res.json({
      message: "Order placed successfully!",
      orderId: order.id,
      order
    });

  } catch (err) {
    console.error("Checkout failed:", err);
    res.status(500).json({ message: "Checkout failed" });
  }
};
