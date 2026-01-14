import express from "express";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import axios from "axios";

const prisma = new PrismaClient();
const router = express.Router();

router.get("/login", (req, res) => {
  const redirect = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.GOOGLE_CLIENT_ID}&redirect_uri=${process.env.GOOGLE_REDIRECT_URL}&response_type=code&scope=email%20profile&access_type=online`;
  res.redirect(redirect);
});

router.get("/callback", async (req, res) => {
  const { code } = req.query;

  try {
    // 1. Exchange code for token
    const response = await axios.post(
      "https://oauth2.googleapis.com/token",
      {
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: process.env.GOOGLE_REDIRECT_URL,
        grant_type: "authorization_code",
        code,
      }
    );

    const { access_token } = response.data;

    // 2. Get Google user profile
    const googleUser = await axios.get(
      "https://www.googleapis.com/oauth2/v1/userinfo?alt=json",
      { headers: { Authorization: `Bearer ${access_token}` } }
    );

    const { email, name, picture } = googleUser.data;

    // 3. Lookup user in DB
    let user = await prisma.user.findUnique({ where: { email } });

    // 4. If user does not exist → create customer account
    if (!user) {
      user = await prisma.user.create({
        data: {
          email,
          name,
          role: "customer", // never auto-admin!
          password: "", // Google users don't use passwords
        }
      });
    }

    // 5. Create JWT
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // 6. Redirect back to frontend with token
    return res.redirect(`http://localhost:5173/google-success?token=${token}`);

  } catch (err) {
    console.error(err);
    return res.redirect("http://localhost:5173/login?error=google_failed");
  }
});

export default router;