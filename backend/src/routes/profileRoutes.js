import express from "express";
import { Router } from "express";
import { getProfile } from "../controllers/profileController.js";

const profileRouter = Router();
// import { authenticateToken } from "../middlewares/authMiddleware.js";

profileRouter.get('/get',getProfile);

export  default profileRouter;