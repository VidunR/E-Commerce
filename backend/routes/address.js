// backend/routes/address.js
import express from 'express';
import {
  listAddresses,
  createAddress,
  getAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
} from '../controllers/addressController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(authMiddleware); // all address routes need authentication

router.get('/', listAddresses);
router.post('/', createAddress);
router.get('/:id', getAddress);
router.patch('/:id', updateAddress);
router.delete('/:id', deleteAddress);
router.post('/:id/set-default', setDefaultAddress);

export default router;
