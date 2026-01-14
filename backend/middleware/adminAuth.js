// backend/middleware/adminAuth.js
import { authMiddleware } from './authMiddleware.js';

// Wrap existing auth middleware and ensure role === 'admin'
export const requireAdmin = (req, res, next) => {
  authMiddleware(req, res, (err) => {
    // if authMiddleware called next normally, req.user exists
    if (err) return next(err);
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
    if (req.user.role !== 'admin') return res.status(403).json({ message: 'Forbidden: admin only' });
    next();
  });
};