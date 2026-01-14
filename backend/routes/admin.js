// backend/routes/admin.js
import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import verifyAdmin from '../middleware/verifyAdmin.js';
import * as adminController from '../controllers/adminController.js';

const router = express.Router();

// Protect all admin routes with auth + verifyAdmin
router.use(authMiddleware, verifyAdmin);

// Products CRUD
router.get('/products', adminController.listProducts);
router.get('/products/:id', adminController.getProduct);
router.post('/products', adminController.createProduct);
router.put('/products/:id', adminController.updateProduct);
router.delete('/products/:id', adminController.deleteProduct);

// images + inventory
router.post('/products/:id/images', adminController.addProductImage);
router.put('/products/:id/inventory', adminController.updateInventory);

// orders
router.get('/orders', adminController.listOrders);
router.get('/orders/:id', adminController.getOrder);
router.put('/orders/:id/status', adminController.updateOrderStatus);

export default router;