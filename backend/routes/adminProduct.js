// backend/routes/adminProduct.js
import express from 'express';
import multer from 'multer';
import path from 'path';
import os from 'os';
import { updateProduct } from '../controllers/adminProductController.js';
import { requireAdmin } from '../middleware/adminAuth.js';

const router = express.Router();

// temporary upload dir (multer stores here first)
const uploadTempDir = path.join(os.tmpdir(), 'luxe-uploads');
import fs from 'fs';
if (!fs.existsSync(uploadTempDir)) fs.mkdirSync(uploadTempDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadTempDir),
  filename: (req, file, cb) => cb(null, file.originalname)
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB per file
});

// PUT /api/admin/products/:id
// fields: images (multiple)
router.put('/products/:id', requireAdmin, upload.array('images', 6), updateProduct);

export default router;