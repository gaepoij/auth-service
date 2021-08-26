import express from "express";
import { login, refreshTokens, registerUser } from "../controllers/auth";
const router = express.Router();

router.post("/login", login);
router.post("/register", registerUser);
router.post("/token", refreshTokens);

export default router;
