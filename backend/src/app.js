import dotenv  from "dotenv";
dotenv.config();
import {createServer} from "http";
import app from "./server.js";

const server = createServer(app);

server.listen(process.env.PORT || 5000, () => {
    console.log(`Server is running on port ${process.env.PORT || 5000}`);
});
