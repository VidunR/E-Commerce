// backend/middleware/isAdmin.js
export function isAdmin(req, res, next) {
  try {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden: admin only' });
    }
    next();
  } catch (err) {
    console.error('isAdmin error', err);
    return res.status(500).json({ message: 'Server error' });
  }
}