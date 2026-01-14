import express from "express";
import crypto from "crypto";
import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";
import { sendEmail } from "../utils/sendEmail.js";

const prisma = new PrismaClient();
const router = express.Router();

router.post("/request", async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return res.json({ message: "If account exists, email sent." });
  }

  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + 1000 * 60 * 30);

  await prisma.resetToken.create({
    data: { token, userId: user.id, expiresAt },
  });

  const resetUrl = `http://localhost:5173/reset-password?token=${token}`;

  try {
    await sendEmail(
      user.email,
      "Reset Your Luxe Password",
      `
        <h2>Password Reset Request</h2>
        <p>Click the link below to reset your password:</p>
        <a href="${resetUrl}">${resetUrl}</a>
        <p>This link is valid for 30 minutes.</p>
      `
    );
  } catch (err) {
    console.error("Email send error:", err);
  }

  return res.json({ message: "Email sent if account exists" });
});

router.post("/reset", async (req, res) => {
  const { token, password } = req.body;

  if (!token || !password) {
    return res.status(400).json({ message: "Token and password are required" });
  }

  if (password.length < 6) {
    return res.status(400).json({ message: "Password must be at least 6 characters" });
  }

  const record = await prisma.resetToken.findUnique({ where: { token } });
  if (!record) {
    return res.status(400).json({ message: "Invalid or expired token" });
  }

  if (record.expiresAt < new Date()) {
    return res.status(400).json({ message: "Token expired" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await prisma.user.update({
    where: { id: record.userId },
    data: { password: hashedPassword },
  });

  await prisma.resetToken.delete({ where: { id: record.id } });

  res.json({ success: true, message: "Password updated" });
});

export default router;
