import dotenv  from "dotenv";
dotenv.config();
import {createServer} from "http";
import app from "./server.js";


const server = createServer(app);
server.listen(process.env.PORT || 3000, () => {
    console.log("Server is running on port 3000");
});
