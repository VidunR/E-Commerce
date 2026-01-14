import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const updateUser = async (req, res) => {
  try {
    const userId = req.user.id; // from JWT middleware
    const { fullName, email, phoneNumber } = req.body;

    if (!fullName || !email) {
      return res.status(400).json({ message: "Full name and email are required" });
    }

    // Check if email already exists (for any user except this one)
    const existingEmail = await prisma.user.findFirst({
      where: {
        email,
        NOT: { id: userId }
      }
    });

    if (existingEmail) {
      return res.status(400).json({ message: "Email already in use" });
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        name: fullName,
        email,
        phoneNumber
      }
    });

    return res.json({
      message: "Profile updated successfully",
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        phoneNumber: updatedUser.phoneNumber
      }
    });
  } catch (err) {
    console.error("Update user error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};
