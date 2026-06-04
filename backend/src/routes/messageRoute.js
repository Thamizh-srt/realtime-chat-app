import { Router } from "express";
import {sendMessage} from '../controllers/messageController.js';
import { protect } from '../middlewares/authMiddleware.js';

const messageRouter = Router();
messageRouter.use(protect);

messageRouter.post('/post/:roomId', sendMessage);

export default messageRouter;