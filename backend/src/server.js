import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import loginRouter from "./routes/loginRoutes.js";
import { golbalErrorHandler, notFound } from "../src/middlewares/errorMiddleware.js"

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5174',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/auth', loginRouter);
app.use(notFound);
app.use(golbalErrorHandler);


export default app;


// app.listen(PORT, () => {
//     console.log(`Server is running on port ${PORT}`);
// });