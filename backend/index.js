import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import cartRoutes from './routes/cart.js';
import addressRoutes from './routes/address.js';
import userRoutes from "./routes/users.js";
import orderRoutes from "./routes/order.js";
import checkoutRoutes from "./routes/checkout.js";
import productRoutes from "./routes/product.js";
import adminRoutes from "./routes/admin.js";
import adminProductRoutes from './routes/adminProduct.js';
import googleAuthRoutes from './routes/googleAuth.js';
import wishlistRoutes from './routes/wishlist.js';
import reviewRoutes from './routes/reviews.js';
import searchRoutes from './routes/search.js';
import recommendationRoutes from './routes/recommendations.js';
import passwordRoutes from './routes/password.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

app.use('/api/auth', authRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/addresses', addressRoutes);
app.use("/api/users", userRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/checkout", checkoutRoutes);
app.use("/api/products", productRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/admin', adminProductRoutes);
app.use('/api/auth/google', googleAuthRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/recommendations', recommendationRoutes);
app.use('/api/password', passwordRoutes);

app.get('/', (req, res) => res.send('Backend is running'));

app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || 'Server error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
