import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const getOrders = async (req, res) => {
  try {
    const userId = req.user.id;

    const orders = await prisma.order.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      include: {
        orderItems: {
          include: {
            product: true
          }
        },
        address: true
      }
    });

    res.json({ orders });
  } catch (err) {
    console.error("GET /orders failed:", err);
    res.status(500).json({ message: "Server error fetching orders" });
  }
};
