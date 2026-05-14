import dotenv  from "dotenv";
dotenv.config();
import {createServer} from "http";
import app from "./server.js";
import prisma from "./config/db.js";


const server = createServer(app);

prisma.user.findMany()
  .then(() => console.log("OK: Prisma can query the DB"))
  .catch(err => console.error("Prisma ERROR:", err));

server.listen(process.env.PORT || 5000, () => {
    console.log(`Server is running on port ${process.env.PORT || 5000}`);
});
