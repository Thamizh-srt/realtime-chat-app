import {createChannel, getChannel, deleteChannel} from '../controllers/channelController.js';
import { Router } from "express";
import { protect } from '../middlewares/authMiddleware.js';
const channelRouter = Router();

channelRouter.use(protect);

channelRouter.post("/create", createChannel);
channelRouter.get("/list", getChannel);
channelRouter.post("/delete", deleteChannel);

export default channelRouter;