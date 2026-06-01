import {createChannel, getChannel, deleteChannel, leaveChannel, joinChannel, getSingleChannel} from '../controllers/channelController.js';
import { Router } from "express";
import { protect } from '../middlewares/authMiddleware.js';
const channelRouter = Router();

channelRouter.use(protect);

channelRouter.post("/create", createChannel);
channelRouter.get("/list", getChannel);
channelRouter.post("/delete", deleteChannel);
channelRouter.post("/leave", leaveChannel);
channelRouter.post("/join", joinChannel);
channelRouter.get("/:id", getSingleChannel);

export default channelRouter;