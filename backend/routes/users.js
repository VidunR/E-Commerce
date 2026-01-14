import express from "express";
import { updateUser } from "../controllers/userController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.put("/update", authMiddleware, updateUser);

export default router;
