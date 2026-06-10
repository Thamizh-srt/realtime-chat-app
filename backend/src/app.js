import dotenv  from "dotenv";
dotenv.config();
import {createServer} from "http";
import app from "./server.js";
import { initSocket } from "./sockets/index.js";
const server = createServer(app);

initSocket(server);

server.listen(process.env.PORT || 5000, () => {
    console.log(`Server is running on port ${process.env.PORT || 5000}`);
});

process.on('SIGTERM', () => {
  logger.info('SIGTERM received — shutting down gracefully');
  httpServer.close(() => {
    logger.info('Server closed');
    process.exit(0);
  });
});