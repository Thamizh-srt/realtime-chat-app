import {createChannel, getChannel} from '../controllers/channelController.js';
import { Router } from "express";
const channelRouter = Router();
channelRouter.post("/create", createChannel);
channelRouter.get("/list", getChannel);

export default channelRouter;