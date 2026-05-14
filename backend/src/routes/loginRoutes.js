import { Router } from "express";
const loginRouter = Router();
import {registerUser} from "../controllers/loginController.js";
import {validate,registerSchema} from "../utils/validators.js";

loginRouter.post("/register", validate(registerSchema) ,registerUser);

export default loginRouter;