import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const getAllProducts = async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      include: {
        images: true,
        inventory: true,
        orderItems: false
      }
    });

    const formatted = products.map(p => ({
      id: p.id,
      sku: p.id,
      name: p.name,
      description: p.description,
      price: p.price,
      images: p.images,
      inventory: p.inventory,
      variants: [],
      inStock: p.inventory?.stockCount > 0,
      stock: p.inventory?.stockCount || 0
    }));

    res.json({ products: formatted });
  } catch (err) {
    console.error("getAllProducts error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getProductById = async (req, res) => {
  try {
    const id = Number(req.params.id);

    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        images: true,
        inventory: true
      }
    });

    if (!product) return res.status(404).json({ message: "Not found" });

    const formatted = {
      id: product.id,
      sku: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      images: product.images,
      inventory: product.inventory,
      variants: [],
      inStock: product.inventory?.stockCount > 0,
      stock: product.inventory?.stockCount || 0
    };

    res.json({ product: formatted });
  } catch (err) {
    console.error("getProductById error:", err);
    res.status(500).json({ message: "Server error" });
  }
};