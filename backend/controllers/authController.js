import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET;
const SALT_ROUNDS = 10;

if (!JWT_SECRET) {
  console.warn('⚠️  JWT_SECRET is not set in .env');
}

export async function register(req, res, next) {
  try {
    const { name, email, password, phoneNumber } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'name, email and password are required' });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return res.status(409).json({ error: 'Email already in use' });

    const hash = await bcrypt.hash(password, SALT_ROUNDS);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hash,
        phoneNumber: phoneNumber ?? null,
      },
      select: {
        id: true, name: true, email: true, role: true, createdAt: true
      }
    });

    await prisma.cart.create({
      data: { userId: user.id }
    }).catch(()=>{});

    return res.status(201).json({ user });
  } catch (err) {
    next(err);
  }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'email and password required' });

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ error: 'Invalid credentials' });

    const tokenPayload = { id: user.id, email: user.email, role: user.role };
    const accessToken = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: '7d' });

    const safeUser = { id: user.id, name: user.name, email: user.email, role: user.role };

    return res.json({ accessToken, user: safeUser });
  } catch (err) {
    next(err);
  }
}

export async function me(req, res, next) {
  try {
    const id = req.user?.id;
    if (!id) return res.status(401).json({ error: 'Unauthorized' });

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true, name: true, email: true, phoneNumber: true, role: true, createdAt: true, updatedAt: true
      }
    });

    if (!user) return res.status(404).json({ error: 'User not found' });
    return res.json({ user });
  } catch (err) {
    next(err);
  }
}
