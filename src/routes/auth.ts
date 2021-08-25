import express, { Request, Response, NextFunction } from "express";
import { registerUser } from "../controllers/auth";
const router = express.Router();

router.get("/login");
router.post("/register", registerUser);

export default router;
