import { Router } from "express";
const loginRouter = Router();
import {registerUser, loginUser} from "../controllers/loginController.js";
import {validate,registerSchema,loginSchema} from "../utils/validators.js";

loginRouter.post("/register", validate(registerSchema) ,registerUser);
loginRouter.post("/login", validate(loginSchema) ,loginUser);

export default loginRouter;