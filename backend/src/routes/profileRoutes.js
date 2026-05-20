import express from "express";
import { Router } from "express";
const profileRouter = Router();
import { getProfile } from "../controllers/profileController.js";
import { authenticateToken } from "../middlewares/authMiddleware.js";