// backend/controllers/adminProductController.js
import { PrismaClient } from '@prisma/client';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const prisma = new PrismaClient();

// resolve backend root
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// destination directory for product images (frontend public folder)
// adjust if your frontend public path differs
const FRONTEND_PUBLIC_PRODUCTS = path.resolve(__dirname, '../..', 'luxe', 'public', 'products');

if (!fs.existsSync(FRONTEND_PUBLIC_PRODUCTS)) {
  fs.mkdirSync(FRONTEND_PUBLIC_PRODUCTS, { recursive: true });
}

// Update product handler
export const updateProduct = async (req, res) => {
  try {
    const adminId = req.user?.id;
    const productId = Number(req.params.id);
    if (!Number.isInteger(productId)) return res.status(400).json({ message: 'Invalid product id' });

    // Fields (multipart/form-data): name, description, price, categoryId, stockCount, deleteImageIds (JSON string)
    const { name, description, price, categoryId, stockCount, deleteImageIds } = req.body;

    // Update product fields if provided
    const updateData = {};
    if (name) updateData.name = name;
    if (description) updateData.description = description;
    if (typeof price !== 'undefined' && price !== '') updateData.price = Number(price);
    if (typeof categoryId !== 'undefined' && categoryId !== '') updateData.categoryId = Number(categoryId);

    // Apply product update
    const updatedProduct = await prisma.product.update({
      where: { id: productId },
      data: updateData,
    });

    // Update inventory stockCount if provided
    if (typeof stockCount !== 'undefined' && stockCount !== '') {
      const sc = Number(stockCount);
      // upsert inventory
      await prisma.inventory.upsert({
        where: { productId },
        update: { stockCount: sc },
        create: { productId, stockCount: sc },
      });
    }

    // Handle deleting selected images (deleteImageIds expected as JSON string array of ints)
    if (deleteImageIds) {
      let idsToDelete = [];
      try {
        idsToDelete = JSON.parse(deleteImageIds);
      } catch (e) {
        // ignore parse error
        idsToDelete = [];
      }

      if (Array.isArray(idsToDelete) && idsToDelete.length > 0) {
        // remove DB rows and delete files from disk
        const images = await prisma.productImage.findMany({
          where: { id: { in: idsToDelete }, productId },
        });

        await prisma.productImage.deleteMany({
          where: { id: { in: idsToDelete }, productId },
        });

        for (const img of images) {
          const filePath = path.join(FRONTEND_PUBLIC_PRODUCTS, path.basename(img.url));
          try { if (fs.existsSync(filePath)) fs.unlinkSync(filePath); } catch (e) { console.warn('Could not remove file', filePath, e.message); }
        }
      }
    }

    // Handle newly uploaded files (req.files, multer field name "images")
    if (req.files && req.files.length > 0) {
      const createdImages = [];
      for (const f of req.files) {
        // move file to frontend public products folder
        const destName = `${Date.now()}-${f.originalname}`;
        const destPath = path.join(FRONTEND_PUBLIC_PRODUCTS, destName);

        // f.path is temporary upload path (multer dest)
        fs.renameSync(f.path, destPath);

        // store a url relative to frontend public root: "products/<filename>"
        const url = `products/${destName}`;

        const img = await prisma.productImage.create({
          data: { productId, url },
        });
        createdImages.push(img);
      }
    }

    // return updated product (with images and inventory)
    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: {
        images: true,
        inventory: true,
      }
    });

    return res.json({ product });
  } catch (err) {
    console.error('updateProduct error', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};